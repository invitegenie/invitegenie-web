import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon";
import { cn, getRulerMarks, clamp } from "./venueObjectCatalog";
import VenuePlanObject, { IsometricWalls } from "./VenuePlanObject";

function WalkthroughObject({ object }) {
  const { type, x, y, width, height, name } = object;
  const baseStyle = { left: x, top: y, width, height, transformStyle: "preserve-3d" };
  if (type === "stage") {
    return (
      <div className="absolute" style={baseStyle}>
        <div className="w-full h-full bg-violet-950 border border-violet-700/50 shadow-[0_0_80px_rgba(139,92,246,0.4)]" />
        <div className="absolute bottom-full left-0 w-full h-[180px] bg-gradient-to-t from-violet-900 to-black border-x border-t border-violet-600/50 flex flex-col items-center justify-center" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}><p className="text-3xl font-black text-white drop-shadow-[0_0_20px_#a78bfa] tracking-[0.3em]">{name || "STAGE"}</p><div className="flex gap-12 mt-6"><div className="w-8 h-8 rounded-full bg-white shadow-[0_0_50px_rgba(255,255,255,1)] animate-pulse" /><div className="w-8 h-8 rounded-full bg-white shadow-[0_0_50px_rgba(255,255,255,1)] animate-pulse" /></div></div>
      </div>
    );
  }
  if (type === "roundTable") {
    return (
      <div className="absolute flex items-center justify-center rounded-full bg-white/5 border border-white/10" style={baseStyle}>
        <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-white/20" />
        <div className="w-12 h-24 bg-gradient-to-t from-amber-500/60 to-transparent flex flex-col items-center justify-end pb-3" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg) translateZ(5px)" }}><div className="w-4 h-4 rounded-full bg-orange-200 shadow-[0_0_25px_#fbbf24] animate-pulse" /></div>
      </div>
    );
  }
  if (type === "carpet") return <div className="absolute bg-gradient-to-b from-red-700 to-red-900 border-x-4 border-red-500/80 shadow-[0_0_40px_rgba(220,38,38,0.4)]" style={baseStyle} />;
  if (type === "danceFloor") {
    return (
      <div className="absolute bg-[#050812] border-4 border-violet-500/60 shadow-[0_0_50px_rgba(139,92,246,0.3)] flex items-center justify-center overflow-hidden" style={baseStyle}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:40px_40px]" />
        <div className="px-6 py-2 bg-black/60 border border-violet-500/30 rounded-2xl backdrop-blur-md" style={{ transformOrigin: "center", transform: "translateZ(2px)" }}><span className="text-xl font-black text-white drop-shadow-[0_0_10px_#a78bfa] tracking-[0.2em]">{name || "DANCE FLOOR"}</span></div>
      </div>
    );
  }
  if (["bar", "buffet", "headTable"].includes(type)) {
    const colors = { bar: "bg-amber-900", buffet: "bg-slate-200", headTable: "bg-amber-100" };
    const borderColors = { bar: "border-amber-600", buffet: "border-slate-400", headTable: "border-amber-400" };
    const textColors = { bar: "text-amber-200", buffet: "text-slate-800", headTable: "text-amber-900" };
    return (
      <div className={`absolute ${colors[type]} border-2 ${borderColors[type]} shadow-2xl`} style={baseStyle}>
        <div className={`absolute bottom-full left-0 w-full h-[70px] ${colors[type]} border-x border-t ${borderColors[type]} flex items-center justify-center`} style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}><span className={`text-xs font-black ${textColors[type]} tracking-widest px-2 text-center`}>{(name || type).toUpperCase()}</span></div>
      </div>
    );
  }
  if (type === "arch" || type === "entrance") {
    return (
      <div className="absolute" style={baseStyle}>
        <div className="absolute bottom-1/2 left-0 w-full h-[160px] border-[16px] border-emerald-500/90 rounded-t-full flex items-start justify-center pt-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}><div className="px-4 py-1.5 bg-black/80 rounded-full border border-white/20 text-[10px] font-black text-white tracking-widest shadow-xl">{(name || type).toUpperCase()}</div></div>
      </div>
    );
  }
  if (type === "photoBooth") {
    return (
      <div className="absolute bg-pink-950 border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.5)]" style={baseStyle}>
        <div className="absolute bottom-full left-0 w-full h-[120px] bg-gradient-to-t from-pink-900 to-black border-x border-t border-pink-500/50 flex flex-col items-center justify-center" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}><Icon name="photo_camera" className="text-3xl text-pink-300 drop-shadow-[0_0_10px_#f472b6] mb-2" /><span className="text-[10px] font-black text-pink-200 tracking-widest">PHOTO BOOTH</span></div>
      </div>
    );
  }
  if (type === "djBooth") {
    return (
      <div className="absolute bg-slate-900 border-2 border-violet-500 shadow-2xl" style={baseStyle}>
        <div className="absolute bottom-full left-0 w-full h-[80px] bg-slate-800 border-x border-t border-violet-500/50 flex flex-col items-center justify-center" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}><div className="flex gap-3 mb-2"><div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_10px_red] animate-pulse" /><div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_10px_blue] animate-pulse" /></div><span className="text-[10px] font-black text-white tracking-widest">DJ BOOTH</span></div>
      </div>
    );
  }
  return (
    <div className="absolute bg-white/10 border border-white/20 flex items-center justify-center" style={baseStyle}>
      <div className="absolute bottom-1/2 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-black text-white tracking-widest shadow-xl" style={{ transformOrigin: "bottom center", transform: "rotateX(-90deg)" }}>{(name || type).toUpperCase()}</div>
    </div>
  );
}

function WalkthroughPreview({ objects, venueSize, onExit }) {
  const [camera, setCamera] = useState({ x: 0, y: 0, rotX: 70, rotZ: 0 });
  useEffect(() => {
    const handleKeyDown = (e) => {
      const speed = 40;
      setCamera((prev) => {
        switch (e.key.toLowerCase()) {
          case "w": return { ...prev, y: prev.y + speed };
          case "s": return { ...prev, y: prev.y - speed };
          case "a": return { ...prev, x: prev.x + speed };
          case "d": return { ...prev, x: prev.x - speed };
          case "q": return { ...prev, rotZ: prev.rotZ - 5 };
          case "e": return { ...prev, rotZ: prev.rotZ + 5 };
          default: return prev;
        }
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020408] font-sans" style={{ perspective: "1200px" }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,40,217,0.15),transparent_70%)]" />
      <div className="relative transition-transform duration-300 ease-out" style={{ width: venueSize.w, height: venueSize.h, transformStyle: "preserve-3d", transform: `translateZ(-400px) rotateX(${camera.rotX}deg) rotateZ(${camera.rotZ}deg) translateX(${camera.x}px) translateY(${camera.y}px)` }}>
        <div className="absolute inset-0 bg-[#060913] bg-[linear-gradient(rgba(255,255,255,0.02)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.02)_2px,transparent_2px)] bg-[length:40px_40px] border-4 border-violet-900/50 shadow-[0_0_100px_rgba(109,40,217,0.3)]"><div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent" /></div>
        {objects.map((obj) => <WalkthroughObject key={obj.id} object={obj} />)}
      </div>
      <button onClick={onExit} className="absolute right-6 top-6 z-50 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md transition hover:bg-white/20">Exit Walkthrough</button>
      <div className="absolute bottom-6 right-6 z-50 rounded-2xl border border-white/10 bg-black/60 p-4 text-center backdrop-blur-md"><div className="mb-1 flex justify-center gap-1"><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">W</kbd></div><div className="mb-3 flex justify-center gap-1"><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">A</kbd><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">S</kbd><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">D</kbd></div><div className="flex justify-center gap-1"><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">Q</kbd><kbd className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-black text-white shadow-inner">E</kbd></div><p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Move & Rotate Camera</p></div>
      <div className="absolute bottom-6 left-6 z-50 flex h-48 w-56 flex-col rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-md"><p className="mb-2 shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400">Live Floorplan</p><div className="relative flex-1 overflow-hidden rounded-xl border border-white/5 bg-slate-900/50">{objects.map((obj) => <div key={`minimap-${obj.id}`} className="absolute border border-violet-400 bg-violet-500/60" style={{ left: `${(obj.x / venueSize.w) * 100}%`, top: `${(obj.y / venueSize.h) * 100}%`, width: `${(obj.width / venueSize.w) * 100}%`, height: `${(obj.height / venueSize.h) * 100}%` }} />)}<div className="absolute z-10 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_10px_#34d399] transition-all duration-300" style={{ left: `${Math.min(100, Math.max(0, 50 - (camera.x / venueSize.w) * 100))}%`, top: `${Math.min(100, Math.max(0, 50 - (camera.y / venueSize.h) * 100))}%`, transform: "translate(-50%, -50%)" }} /></div></div>
    </div>
  );
}

export default function CanvasWorkspace({ venueSize, zoom, setZoom, showGrid, gridSize, activeTool, setActiveTool, canvasPan, setCanvasPan, objects, setObjects, selectedObjectIds, setSelectedObjectIds, onSelect, snapToGrid, commitHistory, activeRenderMode, setActiveRenderMode }) {
  const viewportRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [objectDrag, setObjectDrag] = useState(null);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const isIso = activeRenderMode === "iso";
  const isFlow = activeRenderMode === "flow";
  const isHeat = activeRenderMode === "heat";
  const horizontalMarks = useMemo(() => getRulerMarks(venueSize.w), [venueSize.w]);
  const verticalMarks = useMemo(() => getRulerMarks(venueSize.h), [venueSize.h]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(e.target?.tagName)) { e.preventDefault(); setIsSpacePanning(true); }
    };
    const handleGlobalKeyUp = (e) => { if (e.code === "Space") setIsSpacePanning(false); };
    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("keyup", handleGlobalKeyUp);
    return () => { window.removeEventListener("keydown", handleGlobalKeyDown); window.removeEventListener("keyup", handleGlobalKeyUp); };
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(z => {
           const newZoom = clamp(z + zoomDelta, 0.1, 3);
           setCanvasPan(pan => {
              const rect = el.getBoundingClientRect();
              const cursorX = e.clientX - rect.left;
              const cursorY = e.clientY - rect.top;
              return { x: cursorX - (cursorX - pan.x) * (newZoom / z), y: cursorY - (cursorY - pan.y) * (newZoom / z) };
           });
           return newZoom;
        });
      } else { e.preventDefault(); setCanvasPan(pan => ({ x: pan.x - e.deltaX, y: pan.y - e.deltaY })); }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setZoom, setCanvasPan]);

  const handlePointerDown = (event) => {
    if (event.button === 1 || activeTool === "pan" || isSpacePanning) {
      event.preventDefault(); setIsPanning(true); setPanStart({ x: event.clientX, y: event.clientY, pan: { ...canvasPan } }); return;
    }
    if (event.target === viewportRef.current || event.target.closest('.absolute.inset-0.ring-1')) setSelectedObjectIds([]);
  };

  const handleObjectDragStart = (event, object) => {
    if (activeTool === "pan" || object.locked) return;
    event.stopPropagation();
    let newSelection = selectedObjectIds;
    if (!selectedObjectIds.includes(object.id)) { newSelection = event.shiftKey ? [...selectedObjectIds, object.id] : [object.id]; setSelectedObjectIds(newSelection); }
    const initials = {};
    objects.forEach(o => { if (newSelection.includes(o.id)) initials[o.id] = { ...o }; });
    setObjectDrag({ mode: "move", id: object.id, startX: event.clientX, startY: event.clientY, initials });
  };

  const handleResizeStart = (event, object) => { if (object.locked) return; event.stopPropagation(); setSelectedObjectIds([object.id]); setObjectDrag({ mode: "resize", id: object.id, startX: event.clientX, startY: event.clientY, initial: { ...object } }); };
  const handleRotateStart = (event, object) => { if (object.locked) return; event.stopPropagation(); setSelectedObjectIds([object.id]); setObjectDrag({ mode: "rotate", id: object.id, startX: event.clientX, initial: { ...object } }); };

  const handlePointerMove = (event) => {
    if (objectDrag) {
      const dx = (event.clientX - objectDrag.startX) / zoom;
      const dy = (event.clientY - objectDrag.startY) / zoom;
      setObjects((prev) => prev.map((object) => {
        if (objectDrag.mode === "move") {
          if (!objectDrag.initials[object.id]) return object;
          let x = objectDrag.initials[object.id].x + dx, y = objectDrag.initials[object.id].y + dy;
          if (snapToGrid) { x = Math.round(x / gridSize) * gridSize; y = Math.round(y / gridSize) * gridSize; }
          return { ...object, x, y };
        }
        if (object.id !== objectDrag.id) return object;
        if (objectDrag.mode === "resize") {
          let width = Math.max(24, objectDrag.initial.width + dx), height = Math.max(24, objectDrag.initial.height + dy);
          if (snapToGrid) { width = Math.max(gridSize, Math.round(width / gridSize) * gridSize); height = Math.max(gridSize, Math.round(height / gridSize) * gridSize); }
          return { ...object, width, height };
        }
        if (objectDrag.mode === "rotate") { return { ...object, rotation: Math.round(((objectDrag.initial.rotation || 0) + dx / 2) / 5) * 5 }; }
        return object;
      })); return;
    }
    if (!isPanning || !panStart) return;
    setCanvasPan({ x: panStart.pan.x + event.clientX - panStart.x, y: panStart.pan.y + event.clientY - panStart.y });
  };

  const handlePointerUp = () => { if (objectDrag) commitHistory(); setIsPanning(false); setPanStart(null); setObjectDrag(null); };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    
    try {
      const payload = JSON.parse(data);
      if (payload.type === "vendor_marker") {
        const canvasEl = document.getElementById("printable-canvas");
        if (!canvasEl) return;
        
        const rect = canvasEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        
        let objType = "custom";
        let width = 140;
        let height = 90;
        let color = "#F59E0B";

        if (payload.vendorType === "furniture") {
          objType = "chair";
          width = 42; height = 42;
        } else if (payload.vendorType === "av") {
          objType = "djBooth";
          width = 120; height = 70;
          color = "#7C3AED";
        } else if (payload.vendorType === "catering") {
          objType = "foodStall";
          width = 160; height = 100;
          color = "#FB923C";
        } else if (payload.vendorType === "decor") {
          objType = "decor";
          width = 95; height = 95;
          color = "#EC4899";
        } else if (payload.vendorType === "utilities") {
          objType = "generator";
          width = 140; height = 85;
          color = "#374151";
        } else if (payload.vendorType === "services") {
          objType = "vendorBooth";
        }

        commitHistory();
        const newObj = {
          id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: objType,
          name: payload.title + " Marker",
          x: Math.max(0, x - width/2),
          y: Math.max(0, y - height/2),
          width,
          height,
          color,
          rotation: 0,
          zIndex: 30,
          metadata: {}
        };
        
        setObjects(prev => [...prev, newObj]);
        setSelectedObjectIds([newObj.id]);
      }
    } catch(err) {
      console.error("Drop error", err);
    }
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-[#020308] overflow-hidden">
      <style>{`@keyframes flowDash { to { stroke-dashoffset: -24; } }`}</style>
      <div ref={viewportRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className={cn("relative min-h-0 flex-1 overflow-hidden bg-[#020308]", (activeTool === "pan" || isSpacePanning) ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair")}>
        <div className="absolute left-0 right-0 top-0 z-20 h-6 border-b border-white/5 bg-[#060913]/95 pl-10 backdrop-blur"><div className="relative h-full" style={{ width: venueSize.w * zoom, transform: `translateX(${canvasPan.x}px)` }}>{horizontalMarks.map((mark) => <div key={mark} className="absolute top-0 h-full border-l border-white/5 pl-1 text-[8px] font-bold leading-6 text-slate-600" style={{ left: mark * zoom }}>{mark}</div>)}</div></div>
        <div className="absolute bottom-0 left-0 top-6 z-20 w-10 border-r border-white/5 bg-[#060913]/95 pt-2 backdrop-blur"><div className="relative h-full" style={{ height: venueSize.h * zoom, transform: `translateY(${canvasPan.y}px)` }}>{verticalMarks.map((mark) => <div key={mark} className="absolute left-0 w-full border-t border-white/5 pt-1 text-center text-[8px] font-bold text-slate-600" style={{ top: mark * zoom }}>{mark}</div>)}</div></div>
        <div className="absolute left-0 top-0 z-30 grid h-6 w-10 place-items-center border-b border-r border-white/5 bg-[#060913] text-[8px] font-black text-slate-600">cm</div>
        <div className="absolute right-5 top-5 z-30 flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-3 py-1.5 backdrop-blur-md"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Canvas</span><span className="text-[11px] font-black text-white">{venueSize.w}×{venueSize.h} cm</span><span className="text-[11px] font-black text-violet-400">{Math.round(zoom * 100)}%</span></div>
        <div className="flex h-full items-center justify-center overflow-hidden p-4 pl-10 pt-8" style={{ perspective: "2000px" }}>
          <div id="printable-canvas" className="relative transition-transform duration-700 ease-in-out" style={{ width: venueSize.w, height: venueSize.h, transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${zoom})`, transformOrigin: "center center", transformStyle: "preserve-3d" }}>
            <div className={cn("absolute inset-0 transition-transform duration-700 ease-in-out rounded-sm border border-white/20 bg-[#0B101D] shadow-[0_35px_120px_rgba(0,0,0,.85)]", isIso && "shadow-[-50px_50px_100px_rgba(0,0,0,0.6)]")} style={{ transform: isIso ? "rotateX(60deg) rotateZ(-45deg)" : "none", transformStyle: "preserve-3d", backgroundImage: showGrid ? "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)" : "none", backgroundSize: `${gridSize}px ${gridSize}px` }}>
              {isIso && <IsometricWalls color="#0f172a" depth={20} />}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            {isHeat && (<div className="absolute inset-0 z-40 bg-[#000020]/80 pointer-events-none mix-blend-screen overflow-hidden">{objects.map(obj => { let color = "rgba(0, 255, 0, 0.15)"; if (obj.type === "danceFloor" || obj.type === "stage" || obj.type === "bar") color = "rgba(255, 50, 0, 0.4)"; else if (obj.type === "roundTable" || obj.type === "buffet") color = "rgba(255, 165, 0, 0.3)"; const radius = Math.max(obj.width, obj.height) * 3; return (<div key={`heat-${obj.id}`} className="absolute rounded-full blur-[40px]" style={{ left: obj.x + obj.width/2 - radius/2, top: obj.y + obj.height/2 - radius/2, width: radius, height: radius, background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />); })}</div>)}
            {isFlow && (
              <svg className="absolute inset-0 z-50 pointer-events-none overflow-visible w-full h-full">
                <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" /></marker><marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#F87171" /></marker><linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#8B5CF6" /></linearGradient></defs>
                {(() => {
                  const entrance = objects.find(o => o.type === "entrance"); if (!entrance) return null;
                  const targets = objects.filter(o => ["bar", "buffet", "stage", "roundTable", "toilet", "exit"].includes(o.type));
                  return targets.map(target => {
                    const startX = entrance.x + entrance.width / 2, startY = entrance.y + entrance.height / 2, endX = target.x + target.width / 2, endY = target.y + target.height / 2;
                    const midX = (startX + endX) / 2 + (endY - startY) * 0.2, midY = (startY + endY) / 2 + (startX - endX) * 0.2;
                    const isExit = target.type === "exit";
                    return (<path key={`flow-${target.id}`} d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`} fill="none" stroke={isExit ? "#F87171" : "url(#flowGradient)"} strokeWidth={isExit ? "4" : "3"} strokeDasharray="8 8" markerEnd={isExit ? "url(#arrowhead-red)" : "url(#arrowhead)"} className="opacity-80" style={{ animation: "flowDash 1.5s linear infinite" }} />);
                  });
                })()}
              </svg>
            )}
            {objects.map((object) => (<VenuePlanObject key={object.id} object={object} selected={selectedObjectIds.includes(object.id)} isSingleSelection={selectedObjectIds.length === 1} onSelect={onSelect} onDragStart={handleObjectDragStart} onResizeStart={handleResizeStart} onRotateStart={handleRotateStart} activeRenderMode={activeRenderMode} />))}
            </div>
          </div>
        </div>
        {isIso && (<div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center animate-in slide-in-from-top-10 fade-in duration-500"><div className="bg-amber-400/20 backdrop-blur-md rounded-full border border-amber-400/50 px-6 py-2 shadow-[0_0_30px_rgba(251,191,36,0.3)]"><p className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-2"><Icon name="view_in_ar" className="text-lg" />3D Isometric Preview</p></div></div>)}
      </div>
      {activeRenderMode === "walk" && (<WalkthroughPreview objects={objects} venueSize={venueSize} onExit={() => setActiveRenderMode("2d")} />)}
    </main>
  );
}
