import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopHeader from "./TopHeader";
import LeftToolRail from "./LeftToolRail";
import ObjectLibraryPanel from "./ObjectLibraryPanel";
import ControlStrip from "./ControlStrip";
import CanvasWorkspace from "./CanvasWorkspace";
import InspectorPanel from "./InspectorPanel";
import BottomPanel from "./BottomPanel";
import MobileGenieRender from "./MobileGenieRender";
import {
  STORAGE_DRAFTS_KEY,
  STORAGE_SNAPSHOTS_KEY,
  MIN_DESKTOP_WIDTH,
  uid,
  previewCards,
  initialVenueObjects,
  makeObjectFromLibraryItem,
  clamp,
} from "./venueObjectCatalog";

function useIsDesktop() {
  const getInitialValue = () => (
    typeof window === "undefined" ? true : window.innerWidth >= MIN_DESKTOP_WIDTH
  );
  const [isDesktop, setIsDesktop] = useState(getInitialValue);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= MIN_DESKTOP_WIDTH);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isDesktop;
}

function normalizeSelectedIds(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

export default function VenueBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const isDesktop = useIsDesktop();

  const [saveStatus, setSaveStatus] = useState("Unsaved");
  const [venueSize, setVenueSize] = useState({ w: 1200, h: 1000 });
  const [zoom, setZoom] = useState(0.5);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(40);
  const [activeTool, setActiveTool] = useState("select");
  const [activeRenderMode, setActiveRenderMode] = useState("2d");
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [objects, setObjects] = useState(initialVenueObjects);
  const [selectedObjectIds, setSelectedObjectIds] = useState(["table-9"]);
  const [highlightedObjectIds, setHighlightedObjectIds] = useState([]);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [sceneMetadata, setSceneMetadata] = useState(null);
  const [snapshots, setSnapshots] = useState([]);

  const stats = useMemo(() => {
    const totalTables = objects.filter((object) => object.type === "roundTable").length;
    const totalSeats = objects.reduce((sum, object) => sum + (object.metadata?.seats || 0), 0);
    return {
      totalTables,
      totalSeats,
      totalObjects: objects.length,
      venueLabel: `${venueSize.w}x${venueSize.h} cm`,
    };
  }, [objects, venueSize]);

  const commitHistory = () => {
    setHistory((prev) => ({ past: [...prev.past.slice(-49), objects], future: [] }));
  };

  const undo = () => {
    setHistory((prev) => {
      if (!prev.past.length) return prev;
      const previous = prev.past[prev.past.length - 1];
      setObjects(previous);
      return { past: prev.past.slice(0, -1), future: [objects, ...prev.future] };
    });
  };

  const redo = () => {
    setHistory((prev) => {
      if (!prev.future.length) return prev;
      const next = prev.future[0];
      setObjects(next);
      return { past: [...prev.past, objects], future: prev.future.slice(1) };
    });
  };

  const latestState = useRef({ selectedObjectIds, undo, redo, commitHistory });

  useEffect(() => {
    latestState.current = { selectedObjectIds, undo, redo, commitHistory };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SNAPSHOTS_KEY);
      if (saved) setSnapshots(JSON.parse(saved));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName)) return;

      const {
        selectedObjectIds: latestSelection,
        undo: latestUndo,
        redo: latestRedo,
        commitHistory: latestCommitHistory,
      } = latestState.current;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) latestRedo();
        else latestUndo();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        latestRedo();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        if (latestSelection.length > 0) {
          event.preventDefault();
          latestCommitHistory();
          setObjects((prev) => prev.filter((object) => !latestSelection.includes(object.id)));
          setSelectedObjectIds([]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (id, multi) => {
    setSelectedObjectIds((prev) => {
      if (multi) return prev.includes(id) ? prev.filter((currentId) => currentId !== id) : [...prev, id];
      return [id];
    });
  };

  const handleApplyTemplate = (template) => {
    if (window.confirm(`Apply the "${template.title}" template? This will replace your current layout.`)) {
      commitHistory();
      setVenueSize(template.venueSize);
      const newObjects = template.getObjects(template.venueSize.w, template.venueSize.h);
      setObjects(newObjects);
      setSelectedObjectIds([newObjects[0]?.id].filter(Boolean));
      setActiveRenderMode("2d");
    }
  };

  const saveSnapshot = () => {
    const newSnapshot = {
      id: uid("snap"),
      venueId: eventId || "demo",
      renderMode: activeRenderMode,
      title: `${previewCards.find((card) => card.id === activeRenderMode)?.title || "Layout"} Snapshot`,
      thumbnailType: activeRenderMode,
      objectsSnapshot: JSON.parse(JSON.stringify(objects)),
      venueSize: { ...venueSize },
      createdAt: new Date().toISOString(),
    };
    const updated = [newSnapshot, ...snapshots];
    setSnapshots(updated);
    localStorage.setItem(STORAGE_SNAPSHOTS_KEY, JSON.stringify(updated));
  };

  const deleteSnapshot = (id) => {
    const updated = snapshots.filter((snapshot) => snapshot.id !== id);
    setSnapshots(updated);
    localStorage.setItem(STORAGE_SNAPSHOTS_KEY, JSON.stringify(updated));
  };

  const restoreSnapshot = (snapshot) => {
    commitHistory();
    setActiveRenderMode(snapshot.renderMode);
    setObjects(snapshot.objectsSnapshot);
    setVenueSize(snapshot.venueSize);
  };

  const addObjectFromLibrary = (libraryItem) => {
    commitHistory();
    const object = makeObjectFromLibraryItem(libraryItem, venueSize);
    setObjects((prev) => [...prev, object]);
    setSelectedObjectIds([object.id]);
  };

  const fitToScreen = () => {
    const availableWidth = window.innerWidth - (250 + 46 + 285);
    const availableHeight = window.innerHeight - (52 + 50 + 172);
    const nextZoom = clamp(
      Math.min((availableWidth - 60) / venueSize.w, (availableHeight - 60) / venueSize.h),
      0.1,
      3,
    );
    setZoom(Number(nextZoom.toFixed(2)));
    setCanvasPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    setZoom(0.5);
    setCanvasPan({ x: 0, y: 0 });
  }, []);

  const handleExportPDF = () => {
    try {
      const printScale = Math.min(1050 / venueSize.w, 750 / venueSize.h);
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body * { visibility: hidden; }
          #printable-canvas, #printable-canvas * { visibility: visible; }
          #printable-canvas {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(${printScale}) !important;
            margin: 0 !important;
            padding: 0 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            box-shadow: none !important;
          }
          @page { size: landscape; margin: 0mm; }
        }
      `;
      document.head.appendChild(style);
      const prevMode = activeRenderMode;
      const prevSelected = selectedObjectIds;
      if (activeRenderMode === "iso" || activeRenderMode === "walk") setActiveRenderMode("2d");
      setSelectedObjectIds([]);
      
      setTimeout(() => {
        window.print();
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
        setActiveRenderMode(prevMode);
        setSelectedObjectIds(prevSelected);
      }, 300);
    } catch (error) {
      console.error("PDF Export failed:", error);
      window.alert("Failed to export layout. Please try again.");
    }
  };

  const aiActions = {
    generate: (promptText) => {
      commitHistory();
      const text = (typeof promptText === "string" ? promptText : "").toLowerCase();
      const isConcert = text.includes("concert");
      const isConference = text.includes("conference");
      const guestMatch = text.match(/(\d+)\s*guest/);
      const guestCount = guestMatch ? parseInt(guestMatch[1], 10) : (isConcert ? 500 : isConference ? 200 : 150);
      const tableCount = isConcert ? 0 : Math.ceil(guestCount / 8);

      setSceneMetadata({
        eventType: isConcert ? "concert" : isConference ? "conference" : "wedding",
        guestCount,
        tableCount,
        theme: text.includes("luxury") ? "luxury" : "standard",
        lightingZones: isConcert ? 4 : 2,
        vendorZones: isConference ? 5 : 2,
      });

      const generated = [
        {
          id: uid("ai-stage"),
          type: "stage",
          name: isConcert ? "Massive Concert Stage" : "Main Stage",
          x: venueSize.w * 0.3,
          y: 20,
          width: venueSize.w * 0.4,
          height: 150,
          color: "#6D28D9",
          rotation: 0,
          zIndex: 20,
          metadata: {
            vendorCategory: "Production",
            costEstimate: isConcert ? 800000 : 250000,
            capacity: 20,
            renderStyle: isConcert ? "concert" : "classic",
            material: "steel_truss",
            lighting: "purple_wash",
            importance: "high",
            zone: "entertainment",
          },
        },
      ];

      if (!isConcert) {
        if (!isConference) {
          generated.push({
            id: uid("ai-dance"),
            type: "danceFloor",
            name: "Dance Floor",
            x: venueSize.w * 0.42,
            y: 200,
            width: 220,
            height: 165,
            color: "#8B5A2B",
            rotation: 0,
            zIndex: 12,
            metadata: {
              vendorCategory: "Rentals",
              costEstimate: 80000,
              capacity: 50,
              renderStyle: "led_panel",
              material: "acrylic",
              lighting: "dynamic_chase",
              importance: "medium",
              zone: "entertainment",
            },
          });
        }

        generated.push({
          id: uid("ai-vip"),
          type: "headTable",
          name: "VIP Table",
          x: venueSize.w * 0.36,
          y: 390,
          width: 320,
          height: 52,
          color: "#F7D77E",
          rotation: 0,
          zIndex: 14,
          metadata: {
            vendorCategory: "Furniture",
            costEstimate: 50000,
            capacity: 12,
            renderStyle: "luxury",
            material: "glass_gold",
            lighting: "warm_spot",
            importance: "high",
            zone: "vip",
          },
        });

        Array.from({ length: tableCount }).forEach((_, index) => {
          const leftSide = index < Math.ceil(tableCount / 2);
          const col = index % 3;
          const row = Math.floor((index % Math.ceil(tableCount / 2)) / 3);
          generated.push({
            id: uid(`ai-table-${index}`),
            type: "roundTable",
            name: `Table ${index + 1}`,
            x: leftSide ? 120 + col * 145 : venueSize.w - 430 + col * 145,
            y: 480 + row * 150,
            width: 96,
            height: 96,
            color: "#F8FAFC",
            rotation: 0,
            zIndex: 16,
            metadata: {
              seats: 8,
              tableNumber: `AI-${index + 1}`,
              vendorCategory: "Furniture",
              costEstimate: 35000,
              capacity: 8,
              renderStyle: "classic",
              material: "linen",
              lighting: "ambient",
              importance: "medium",
              zone: "seating",
            },
          });
        });
      } else {
        generated.push({
          id: uid("ai-standing"),
          type: "carpet",
          name: "Standing VIP Area",
          x: venueSize.w * 0.25,
          y: 200,
          width: venueSize.w * 0.5,
          height: 300,
          color: "#DC2626",
          rotation: 0,
          zIndex: 10,
          metadata: {
            vendorCategory: "Rentals",
            costEstimate: 120000,
            capacity: 300,
            renderStyle: "barrier",
            material: "metal",
            lighting: "none",
            importance: "high",
            zone: "seating",
          },
        });
      }

      generated.push({
        id: uid("ai-bar"),
        type: "bar",
        name: "Cocktail Bar",
        x: venueSize.w * 0.78,
        y: 170,
        width: 165,
        height: 52,
        color: "#F7D77E",
        rotation: 0,
        zIndex: 12,
        metadata: {
          vendorCategory: "Catering",
          costEstimate: 95000,
          capacity: 5,
          renderStyle: "modern",
          material: "wood_led",
          lighting: "backlit",
          importance: "high",
          zone: "service",
        },
      });

      if (!isConcert) {
        generated.push({
          id: uid("ai-buffet"),
          type: "buffet",
          name: "Grand Buffet",
          x: venueSize.w * 0.04,
          y: 280,
          width: 65,
          height: 220,
          color: "#F7D77E",
          rotation: 0,
          zIndex: 12,
          metadata: {
            vendorCategory: "Catering",
            costEstimate: 120000,
            capacity: 0,
            renderStyle: "elegant",
            material: "linen_silver",
            lighting: "warm_wash",
            importance: "high",
            zone: "service",
          },
        });
      }

      generated.push({
        id: uid("ai-entry"),
        type: "entrance",
        name: "Grand Entrance",
        x: venueSize.w * 0.46,
        y: venueSize.h - 100,
        width: 115,
        height: 80,
        color: "#B91C1C",
        rotation: 0,
        zIndex: 12,
        metadata: {
          vendorCategory: "Decor",
          costEstimate: 40000,
          capacity: 0,
          renderStyle: "floral",
          material: "roses_greenery",
          lighting: "spotlight",
          importance: "high",
          zone: "entry",
        },
      });

      setObjects(generated);
      setSelectedObjectIds([generated[0]?.id].filter(Boolean));
    },
    optimize: () => {
      commitHistory();
      setObjects((prev) => prev.map((object) => (
        object.type === "roundTable"
          ? { ...object, x: Math.round(object.x / 40) * 40, y: Math.round(object.y / 40) * 40 }
          : object
      )));
    },
    fix: () => {
      commitHistory();
      setObjects((prev) => (prev.some((object) => object.type === "exit") ? prev : [
        ...prev,
        {
          id: uid("ai-exit-1"),
          type: "exit",
          name: "Emergency Exit",
          x: 40,
          y: 40,
          width: 120,
          height: 70,
          color: "#16A34A",
          rotation: 0,
          zIndex: 12,
          metadata: {
            vendorCategory: "Safety",
            costEstimate: 5000,
            renderStyle: "standard",
            material: "metal",
            lighting: "illuminated",
            importance: "critical",
            zone: "safety",
          },
        },
        {
          id: uid("ai-exit-2"),
          type: "exit",
          name: "Emergency Exit",
          x: venueSize.w - 160,
          y: 40,
          width: 120,
          height: 70,
          color: "#16A34A",
          rotation: 0,
          zIndex: 12,
          metadata: {
            vendorCategory: "Safety",
            costEstimate: 5000,
            renderStyle: "standard",
            material: "metal",
            lighting: "illuminated",
            importance: "critical",
            zone: "safety",
          },
        },
      ]));
    },
    addVendors: () => {
      commitHistory();
      setObjects((prev) => [
        ...prev,
        {
          id: uid("ai-vendor-1"),
          type: "vendorBooth",
          name: "Snack Stall",
          x: 40,
          y: venueSize.h - 200,
          width: 140,
          height: 90,
          color: "#F59E0B",
          rotation: 0,
          zIndex: 15,
          metadata: {
            vendorCategory: "Food",
            costEstimate: 25000,
            capacity: 3,
            renderStyle: "canopy",
            material: "wood_canvas",
            lighting: "string_lights",
            importance: "medium",
            zone: "vendor",
          },
        },
      ]);
    },
    addDecor: () => {
      commitHistory();
      setObjects((prev) => [
        ...prev,
        {
          id: uid("ai-decor"),
          type: "arch",
          name: "Floral Arch",
          x: venueSize.w * 0.46,
          y: venueSize.h - 220,
          width: 115,
          height: 125,
          color: "#22C55E",
          rotation: 0,
          zIndex: 18,
          metadata: {
            vendorCategory: "Florist",
            costEstimate: 45000,
            renderStyle: "lush",
            material: "fresh_flowers",
            lighting: "none",
            importance: "high",
            zone: "decor",
          },
        },
      ]);
    },
    addLighting: () => {
      commitHistory();
      setObjects((prev) => [
        ...prev,
        {
          id: uid("ai-light-1"),
          type: "lightingTower",
          name: "Light Tower",
          x: 80,
          y: 100,
          width: 70,
          height: 70,
          color: "#FDE047",
          rotation: 0,
          zIndex: 30,
          metadata: {
            vendorCategory: "Production",
            costEstimate: 12000,
            renderStyle: "truss",
            material: "aluminum",
            lighting: "spot",
            importance: "high",
            zone: "lighting",
          },
        },
      ]);
    },
    handleFix: (action) => {
      commitHistory();
      if (action === "addSeating") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-table"), type: "roundTable", name: "Extra Table", x: 100, y: 100, width: 96, height: 96, color: "#F8FAFC", rotation: 0, zIndex: 16, metadata: { seats: 8 } },
        ]);
      } else if (action === "addEntrance") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-entry"), type: "entrance", name: "Main Entrance", x: venueSize.w / 2 - 50, y: venueSize.h - 100, width: 115, height: 80, color: "#B91C1C", rotation: 0, zIndex: 12, metadata: {} },
        ]);
      } else if (action === "addBar") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-bar"), type: "bar", name: "Bar Station", x: venueSize.w - 200, y: 100, width: 165, height: 52, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
        ]);
      } else if (action === "addBuffet") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-buffet"), type: "buffet", name: "Food Station", x: 100, y: 100, width: 65, height: 220, color: "#F7D77E", rotation: 0, zIndex: 12, metadata: {} },
        ]);
      } else if (action === "addExit") {
        aiActions.fix();
      } else if (action === "addToilet") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-toilet"), type: "toilet", name: "Restrooms", x: venueSize.w - 150, y: venueSize.h - 150, width: 110, height: 90, color: "#0EA5E9", rotation: 0, zIndex: 12, metadata: {} },
        ]);
      } else if (action === "addGenerator") {
        setObjects((prev) => [
          ...prev,
          { id: uid("fix-gen"), type: "generator", name: "Power Generator", x: 50, y: venueSize.h - 150, width: 140, height: 85, color: "#374151", rotation: 0, zIndex: 12, metadata: {} },
        ]);
      } else if (action === "addVendors") {
        aiActions.addVendors();
      } else if (action === "optimize") {
        aiActions.optimize();
      }
    },
  };

  const handleSaveDraft = () => {
    setSaveStatus("Saving");
    setTimeout(() => {
      const id = eventId || "demo-draft";
      const draft = {
        id,
        eventId: id,
        title: "Venue Draft",
        venueSize,
        objects,
        selectedObjectIds,
        zoom,
        canvasPan,
        updatedAt: new Date().toISOString(),
      };
      const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFTS_KEY) || "{}");
      drafts[id] = { ...draft, createdAt: drafts[id]?.createdAt || draft.updatedAt };
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(drafts));
      setSaveStatus("Draft Saved");
      setTimeout(() => setSaveStatus("Unsaved"), 3000);
    }, 500);
  };

  const handleLoadDrafts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_DRAFTS_KEY) || "{}");
      const draftList = Object.values(drafts);
      const draft = drafts[eventId || "demo-draft"] || draftList.sort((a, b) => (
        new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      ))[0];

      if (!draft) {
        window.alert("No saved venue draft found.");
        return;
      }

      commitHistory();
      setVenueSize(draft.venueSize || { w: 1200, h: 1000 });
      setObjects(Array.isArray(draft.objects) ? draft.objects : initialVenueObjects);
      setSelectedObjectIds(normalizeSelectedIds(draft.selectedObjectIds || draft.selectedObjectId));
      if (typeof draft.zoom === "number") setZoom(draft.zoom);
      if (draft.canvasPan) setCanvasPan(draft.canvasPan);
      setSaveStatus("Draft Loaded");
      setTimeout(() => setSaveStatus("Unsaved"), 3000);
    } catch (error) {
      console.error(error);
      window.alert("Unable to load venue draft.");
    }
  };

  if (!isDesktop) return <MobileGenieRender eventId={eventId} />;

  return (
    <div className="h-screen overflow-hidden bg-[#050812] text-white">
      <div className="flex h-full flex-col">
        <TopHeader
          stats={stats}
          onUndo={undo}
          onRedo={redo}
          canUndo={history.past.length > 0}
          canRedo={history.future.length > 0}
          onAiGenerate={() => aiActions.generate()}
          onExportPDF={handleExportPDF}
          onSaveDraft={handleSaveDraft}
          onLoadDrafts={handleLoadDrafts}
          saveStatus={saveStatus}
          onBack={() => navigate(-1)}
        />
        <div className="flex min-h-0 flex-1">
          <LeftToolRail activeTool={activeTool} setActiveTool={setActiveTool} />
          <ObjectLibraryPanel addObjectFromLibrary={addObjectFromLibrary} applyTemplate={handleApplyTemplate} />
          <div className="flex min-w-0 flex-1 flex-col">
            <ControlStrip
              venueSize={venueSize}
              setVenueSize={setVenueSize}
              zoom={zoom}
              setZoom={setZoom}
              fitToScreen={fitToScreen}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              snapToGrid={snapToGrid}
              setSnapToGrid={setSnapToGrid}
              gridSize={gridSize}
              setGridSize={setGridSize}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
            />
            <CanvasWorkspace
              venueSize={venueSize}
              zoom={zoom}
              setZoom={setZoom}
              showGrid={showGrid}
              gridSize={gridSize}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              canvasPan={canvasPan}
              setCanvasPan={setCanvasPan}
              objects={objects}
              setObjects={setObjects}
              selectedObjectIds={selectedObjectIds}
              setSelectedObjectIds={setSelectedObjectIds}
              highlightedObjectIds={highlightedObjectIds}
              onSelect={handleSelect}
              snapToGrid={snapToGrid}
              commitHistory={commitHistory}
              activeRenderMode={activeRenderMode}
              setActiveRenderMode={setActiveRenderMode}
            />
          </div>
          <InspectorPanel
            selectedObjectIds={selectedObjectIds}
            setSelectedObjectIds={setSelectedObjectIds}
            onSelect={handleSelect}
            objects={objects}
            setObjects={setObjects}
            commitHistory={commitHistory}
          />
        </div>
        <BottomPanel
          objects={objects}
          setObjects={setObjects}
          venueSize={venueSize}
          aiActions={aiActions}
          activeRenderMode={activeRenderMode}
          setActiveRenderMode={setActiveRenderMode}
          snapshots={snapshots}
          saveSnapshot={saveSnapshot}
          deleteSnapshot={deleteSnapshot}
          restoreSnapshot={restoreSnapshot}
          sceneMetadata={sceneMetadata}
          setSelectedObjectIds={setSelectedObjectIds}
          setHighlightedObjectIds={setHighlightedObjectIds}
        />
      </div>
    </div>
  );
}
