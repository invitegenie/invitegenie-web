import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";

const TOOLS = [
  { type: "table", icon: "table_restaurant", label: "Table", width: 72, height: 72, capacity: 8 },
  { type: "seat", icon: "chair", label: "Seat", width: 44, height: 44, capacity: 1 },
  { type: "stage", icon: "theater_comedy", label: "Stage", width: 180, height: 92, capacity: 0 },
  { type: "bar", icon: "local_bar", label: "Bar", width: 120, height: 62, capacity: 0 },
  { type: "zone", icon: "grid_view", label: "VIP Zone", width: 150, height: 110, capacity: 25 },
  { type: "entrance", icon: "door_open", label: "Entrance", width: 110, height: 56, capacity: 0 },
  { type: "dancefloor", icon: "nightlife", label: "Dance Floor", width: 170, height: 120, capacity: 60 },
];

const STATUS = {
  available: "bg-emerald-500/15 border-emerald-400/40 text-emerald-200",
  reserved: "bg-amber-500/15 border-amber-400/40 text-amber-200",
  vip: "bg-violet-500/20 border-violet-400/50 text-violet-100",
  blocked: "bg-rose-500/15 border-rose-400/40 text-rose-200",
};

const STATUS_OPTIONS = ["available", "reserved", "vip", "blocked"];

export default function VenueBuilder() {
  const [venueName, setVenueName] = useState("Mountain Club Reception Hall");
  const [selectedTool, setSelectedTool] = useState("table");
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [canvasMode, setCanvasMode] = useState("build");

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  const stats = useMemo(() => {
    const capacity = objects.reduce((sum, obj) => sum + Number(obj.capacity || 0), 0);
    const tables = objects.filter((obj) => obj.type === "table").length;
    const seats = objects.filter((obj) => obj.type === "seat").length;
    const vipZones = objects.filter((obj) => obj.status === "vip" || obj.type === "zone").length;

    return { capacity, tables, seats, vipZones, total: objects.length };
  }, [objects]);

  function pushHistory(nextObjects = objects) {
    setHistory((prev) => [...prev.slice(-15), nextObjects]);
  }

  function getTool(type) {
    return TOOLS.find((tool) => tool.type === type) || TOOLS[0];
  }

  function addObject(e) {
    if (canvasMode !== "build") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const x = snapToGrid ? Math.round(rawX / 20) * 20 : Math.round(rawX);
    const y = snapToGrid ? Math.round(rawY / 20) * 20 : Math.round(rawY);
    const tool = getTool(selectedTool);

    pushHistory();

    const newObject = {
      id: `${tool.type}-${Date.now()}`,
      type: tool.type,
      icon: tool.icon,
      x,
      y,
      width: tool.width,
      height: tool.height,
      rotation: 0,
      label: `${tool.label} ${objects.filter((o) => o.type === tool.type).length + 1}`,
      status: tool.type === "zone" ? "vip" : "available",
      capacity: tool.capacity,
      price: tool.type === "zone" ? 50000 : tool.type === "table" ? 25000 : 0,
      notes: "",
    };

    setObjects((prev) => [...prev, newObject]);
    setSelectedId(newObject.id);
  }

  function updateObject(id, updates) {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)));
  }

  function deleteObject() {
    if (!selectedId) return;
    pushHistory();
    setObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  }

  function duplicateObject() {
    if (!selectedObject) return;
    pushHistory();

    const duplicate = {
      ...selectedObject,
      id: `${selectedObject.type}-${Date.now()}`,
      x: selectedObject.x + 30,
      y: selectedObject.y + 30,
      label: `${selectedObject.label} Copy`,
    };

    setObjects((prev) => [...prev, duplicate]);
    setSelectedId(duplicate.id);
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;

    setObjects(previous);
    setHistory((prev) => prev.slice(0, -1));
    setSelectedId(null);
  }

  function resetLayout() {
    if (!window.confirm("Clear this venue layout?")) return;
    pushHistory();
    setObjects([]);
    setSelectedId(null);
  }

  function saveVenue() {
    const venue = {
      id: `venue-${Date.now()}`,
      name: venueName,
      layout: objects,
      stats,
      updatedAt: new Date().toISOString(),
    };

    if (typeof Engine.saveVenue === "function") {
      Engine.saveVenue(venue);
    } else {
      localStorage.setItem("ig_venue_layout", JSON.stringify(venue));
    }

    alert("Venue layout saved successfully.");
  }

  function loadSampleLayout() {
    pushHistory();

    setObjects([
      makeObject("entrance", 90, 80, "Main Entrance"),
      makeObject("stage", 510, 90, "Main Stage"),
      makeObject("dancefloor", 510, 250, "Dance Floor"),
      makeObject("bar", 850, 120, "Cocktail Bar"),
      makeObject("zone", 850, 330, "VIP Lounge", "vip"),
      makeObject("table", 240, 280, "Table A1"),
      makeObject("table", 340, 280, "Table A2"),
      makeObject("table", 240, 400, "Table B1"),
      makeObject("table", 340, 400, "Table B2"),
      makeObject("table", 640, 400, "Table C1"),
      makeObject("table", 740, 400, "Table C2"),
    ]);
  }

  function makeObject(type, x, y, label, status = "available") {
    const tool = getTool(type);

    return {
      id: `${type}-${Math.random().toString(36).slice(2)}`,
      type,
      icon: tool.icon,
      x,
      y,
      width: tool.width,
      height: tool.height,
      rotation: 0,
      label,
      status,
      capacity: tool.capacity,
      price: type === "zone" ? 50000 : type === "table" ? 25000 : 0,
      notes: "",
    };
  }

  return (
    <Layout>
      <div className="mx-auto max-w-[1500px] space-y-5 pb-24">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.035] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <input
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-gray-100 outline-none"
            />
            <p className="mt-1 text-sm text-gray-500">
              Design seating plans, VIP zones, tables, stages, bars and access areas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={undo} className="btn-secondary" disabled={!history.length}>
              Undo
            </button>
            <button onClick={loadSampleLayout} className="btn-secondary">
              Load Sample
            </button>
            <button onClick={resetLayout} className="btn-secondary">
              Reset
            </button>
            <button onClick={saveVenue} className="btn-primary">
              Save Venue
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Objects" value={stats.total} icon="widgets" />
          <Stat label="Capacity" value={stats.capacity} icon="groups" />
          <Stat label="Tables" value={stats.tables} icon="table_restaurant" />
          <Stat label="VIP Areas" value={stats.vipZones} icon="workspace_premium" />
        </section>

        <div className="grid min-h-[760px] grid-cols-1 gap-5 xl:grid-cols-[230px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-white/5 bg-white/[0.035] p-4">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Layout Tools
              </p>
              <p className="mt-1 text-xs text-gray-500">Select an item, then click the canvas.</p>
            </div>

            <div className="space-y-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => {
                    setSelectedTool(tool.type);
                    setCanvasMode("build");
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    selectedTool === tool.type && canvasMode === "build"
                      ? "border-violet-400/50 bg-violet-500/15 text-violet-100"
                      : "border-white/5 bg-white/[0.025] text-gray-400 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.width}Ã—{tool.height}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-white/5 pt-5">
              <Toggle label="Snap to grid" checked={snapToGrid} onChange={setSnapToGrid} />
              <Toggle label="Show labels" checked={showLabels} onChange={setShowLabels} />
            </div>
          </aside>

          <main className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0c0d12] shadow-sm">
            <div className="absolute left-5 top-5 z-20 rounded-2xl border border-white/5 bg-black/50 px-4 py-3 backdrop-blur">
              <p className="text-xs font-medium text-gray-300">
                Mode: <span className="text-violet-300">{canvasMode === "build" ? "Build" : "Select/Edit"}</span>
              </p>
              <p className="text-xs text-gray-500">Click canvas to place selected object.</p>
            </div>

            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="absolute inset-0 cursor-crosshair" onClick={addObject}>
              {objects.map((obj) => {
                const selected = selectedId === obj.id;

                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(obj.id);
                      setCanvasMode("select");
                    }}
                    style={{
                      left: obj.x,
                      top: obj.y,
                      width: obj.width,
                      height: obj.height,
                      transform: `translate(-50%, -50%) rotate(${obj.rotation || 0}deg)`,
                    }}
                    className={`absolute flex flex-col items-center justify-center rounded-xl border text-center transition hover:scale-105 ${
                      STATUS[obj.status] || STATUS.available
                    } ${selected ? "ring-2 ring-violet-300 ring-offset-2 ring-offset-[#0c0d12]" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{obj.icon}</span>
                    {showLabels ? (
                      <span className="mt-1 max-w-full truncate px-1 text-[9px] font-semibold uppercase">
                        {obj.label}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/55 p-3 backdrop-blur">
              <div className="flex flex-wrap gap-3">
                {STATUS_OPTIONS.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className={`h-2.5 w-2.5 rounded-full ${STATUS[item].split(" ")[0]}`} />
                    {item}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500">Click items to edit details.</p>
            </div>
          </main>

          <aside className="rounded-2xl border border-white/5 bg-white/[0.035] p-4">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Inspector
              </p>
              <h2 className="mt-1 text-lg font-semibold text-gray-100">
                {selectedObject ? selectedObject.label : "No object selected"}
              </h2>
            </div>

            {selectedObject ? (
              <div className="space-y-4">
                <Field
                  label="Label"
                  value={selectedObject.label}
                  onChange={(value) => updateObject(selectedObject.id, { label: value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Capacity"
                    type="number"
                    value={selectedObject.capacity}
                    onChange={(value) => updateObject(selectedObject.id, { capacity: Number(value) })}
                  />
                  <Field
                    label="Price FCFA"
                    type="number"
                    value={selectedObject.price}
                    onChange={(value) => updateObject(selectedObject.id, { price: Number(value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Width"
                    type="number"
                    value={selectedObject.width}
                    onChange={(value) => updateObject(selectedObject.id, { width: Number(value) })}
                  />
                  <Field
                    label="Height"
                    type="number"
                    value={selectedObject.height}
                    onChange={(value) => updateObject(selectedObject.id, { height: Number(value) })}
                  />
                </div>

                <Field
                  label="Rotation"
                  type="number"
                  value={selectedObject.rotation || 0}
                  onChange={(value) => updateObject(selectedObject.id, { rotation: Number(value) })}
                />

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </span>
                  <select
                    value={selectedObject.status}
                    onChange={(e) => updateObject(selectedObject.id, { status: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-gray-200 outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                    Notes
                  </span>
                  <textarea
                    value={selectedObject.notes}
                    onChange={(e) => updateObject(selectedObject.id, { notes: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-gray-200 outline-none"
                    placeholder="Reserved for family, VIP sponsors, service access..."
                  />
                </label>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={duplicateObject} className="btn-secondary">
                    Duplicate
                  </button>
                  <button onClick={deleteObject} className="btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-600">ads_click</span>
                <p className="mt-3 text-sm font-medium text-gray-300">Select an object</p>
                <p className="mt-1 text-xs text-gray-500">
                  Click any table, seat, bar or zone on the canvas to edit details.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="material-symbols-outlined text-violet-300">{icon}</span>
        <span className="text-xs text-gray-500">Live</span>
      </div>
      <p className="text-2xl font-semibold text-gray-100">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-violet-400/50"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-gray-300">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-violet-500"
      />
    </label>
  );
}

