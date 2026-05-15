import React, { useState } from "react";
import Icon from "../components/Icon";
import { cn, uid } from "./venueObjectCatalog";

export function InspectorSection({ title, children }) {
  return <section className="mb-3 border-b border-white/5 pb-3"><h3 className="mb-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h3>{children}</section>;
}

export function Field({ label, value, full, onChange }) {
  return <label className={cn("block text-[8px] font-black uppercase tracking-widest text-slate-500", full && "mb-1.5")}>{label}<input value={value} onChange={(e) => onChange?.(e.target.value)} readOnly={!onChange} className="mt-1 flex h-6 w-full items-center rounded border border-white/5 bg-black/40 px-1.5 text-[10px] font-bold text-slate-200 outline-none focus:border-violet-500/50 transition" /></label>;
}

export function ColorField({ label, color, onChange }) {
  return <div className="flex items-center gap-1.5"><span className="w-10 text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</span><input type="color" value={color} onChange={(e) => onChange?.(e.target.value)} className="h-6 w-6 rounded border border-white/5 bg-black/40 p-0.5 cursor-pointer" /><input value={color} onChange={(e) => onChange?.(e.target.value)} className="flex h-6 flex-1 items-center rounded border border-white/5 bg-black/40 px-1.5 text-[10px] font-bold text-slate-300 outline-none focus:border-violet-500/50 transition" /></div>;
}

export default function InspectorPanel({ selectedObjectIds, setSelectedObjectIds, onSelect, objects, setObjects, commitHistory }) {
  const [tab, setTab] = useState("inspector");
  const selectedObjects = objects.filter((o) => selectedObjectIds.includes(o.id));
  const selectedObject = selectedObjects.length === 1 ? selectedObjects[0] : null;
  const isMultiSelect = selectedObjects.length > 1;

  const updateSelected = (updates) => {
    if (selectedObjectIds.length === 0) return;
    setObjects((prev) => prev.map((object) => selectedObjectIds.includes(object.id) ? { ...object, ...updates } : object));
    commitHistory();
  };

  const duplicateSelected = () => {
    if (selectedObjectIds.length === 0) return;
    const newIds = [];
    const copies = selectedObjects.map((obj) => {
      const id = uid(); newIds.push(id);
      return { ...obj, id, name: `${obj.name} Copy`, x: obj.x + 35, y: obj.y + 35, zIndex: Math.max(0, ...objects.map((item) => item.zIndex || 0)) + 1 };
    });
    setObjects((prev) => [...prev, ...copies]); setSelectedObjectIds(newIds); commitHistory();
  };

  const deleteSelected = () => {
    if (selectedObjectIds.length === 0) return;
    setObjects((prev) => prev.filter((object) => !selectedObjectIds.includes(object.id)));
    setSelectedObjectIds([]); commitHistory();
  };

  const reorderSelected = (direction) => {
    if (selectedObjectIds.length === 0) return;
    setObjects((prev) => {
      const maxZ = Math.max(0, ...prev.map((item) => item.zIndex || 0)), minZ = Math.min(0, ...prev.map((item) => item.zIndex || 0));
      return prev.map(o => {
        if (!selectedObjectIds.includes(o.id)) return o;
        let nextZ = o.zIndex || 0;
        if (direction === "front") nextZ = maxZ + 1; if (direction === "back") nextZ = minZ - 1; if (direction === "up") nextZ += 1; if (direction === "down") nextZ -= 1;
        return { ...o, zIndex: nextZ };
      });
    }); commitHistory();
  };

  const toggleHidden = (objectId) => setObjects((prev) => prev.map((object) => object.id === objectId ? { ...object, hidden: !object.hidden } : object));
  const toggleLocked = (objectId) => setObjects((prev) => prev.map((object) => object.id === objectId ? { ...object, locked: !object.locked } : object));
  const sortedObjects = [...objects].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <aside className="flex w-[285px] shrink-0 flex-col border-l border-white/5 bg-[#060913]">
      <div className="grid grid-cols-3 border-b border-white/5 p-1">
        {[["inspector", "Insp"], ["layers", "Layers"], ["settings", "Settings"]].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} className={cn("rounded py-1.5 text-[8px] font-black uppercase tracking-widest transition", tab === id ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:text-white")}>{label}</button>))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2 custom-scrollbar">
        {tab === "inspector" && (selectedObject ? (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4"><div className="min-w-0 pr-2"><h2 className="truncate text-lg font-black text-white">{selectedObject.name}</h2><p className="mt-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">ID: {selectedObject.id}</p></div><div className="flex shrink-0 gap-1.5"><button onClick={() => updateSelected({ locked: !selectedObject.locked })} className={cn("grid h-7 w-7 place-items-center rounded-md border border-white/5 transition", selectedObject.locked ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]")}><Icon name={selectedObject.locked ? "lock" : "lock_open"} className="text-xs" /></button><button onClick={() => updateSelected({ hidden: !selectedObject.hidden })} className={cn("grid h-7 w-7 place-items-center rounded-md border border-white/5 transition", selectedObject.hidden ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]")}><Icon name={selectedObject.hidden ? "visibility_off" : "visibility"} className="text-xs" /></button></div></div>
            <InspectorSection title="Transform"><div className="grid grid-cols-2 gap-2"><Field label="X" value={Math.round(selectedObject.x)} onChange={(v) => updateSelected({ x: Number(v || 0) })} /><Field label="Y" value={Math.round(selectedObject.y)} onChange={(v) => updateSelected({ y: Number(v || 0) })} /><Field label="W" value={Math.round(selectedObject.width)} onChange={(v) => updateSelected({ width: Number(v || 0) })} /><Field label="H" value={Math.round(selectedObject.height)} onChange={(v) => updateSelected({ height: Number(v || 0) })} /><Field label="Rot" value={Math.round(selectedObject.rotation || 0)} onChange={(v) => updateSelected({ rotation: Number(v || 0) })} /><Field label="Z" value={selectedObject.zIndex || 10} onChange={(v) => updateSelected({ zIndex: Number(v || 0) })} /></div></InspectorSection>
            <InspectorSection title="Arrange"><div className="grid grid-cols-2 gap-1.5"><button onClick={() => reorderSelected("front")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Bring Front</button><button onClick={() => reorderSelected("back")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Send Back</button><button onClick={() => reorderSelected("up")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Forward</button><button onClick={() => reorderSelected("down")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Backward</button></div></InspectorSection>
            <InspectorSection title="Appearance"><div className="space-y-2.5"><ColorField label="Fill" color={selectedObject.color || "#F6F6F6"} onChange={(v) => updateSelected({ color: v })} /><ColorField label="Stroke" color="#8E8E8E" /><div><div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400"><span>Opacity</span><span>{Math.round((selectedObject.opacity || 1) * 100)}%</span></div><input type="range" min="0.1" max="1" step="0.1" value={selectedObject.opacity || 1} onChange={(e) => updateSelected({ opacity: Number(e.target.value) })} className="w-full accent-violet-500" /></div></div></InspectorSection>
            <InspectorSection title="Properties"><Field label="Name" value={selectedObject.name || ""} full onChange={(v) => updateSelected({ name: v })} /><Field label="Type" value={selectedObject.type || ""} full /><Field label="Seats" value={selectedObject.metadata?.seats || ""} full onChange={(v) => updateSelected({ metadata: { ...(selectedObject.metadata || {}), seats: Number(v || 0) } })} /><Field label="Table No." value={selectedObject.metadata?.tableNumber || ""} full onChange={(v) => updateSelected({ metadata: { ...(selectedObject.metadata || {}), tableNumber: v } })} /></InspectorSection>
            <div className="grid grid-cols-2 gap-2 mt-4"><button onClick={duplicateSelected} className="rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 px-2 py-2.5 text-[8px] font-black uppercase tracking-widest transition hover:bg-violet-600 hover:text-white"><Icon name="content_copy" className="mr-1 inline text-[10px]" />Dup</button><button onClick={deleteSelected} className="rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 px-2 py-2.5 text-[8px] font-black uppercase tracking-widest transition hover:bg-rose-600 hover:text-white"><Icon name="delete" className="mr-1 inline text-[10px]" />Del</button></div>
          </div>
        ) : isMultiSelect ? (
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4"><div><h2 className="text-lg font-black text-white">Multiple Selected</h2><p className="mt-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">{selectedObjects.length} objects</p></div></div>
            <InspectorSection title="Arrange"><div className="grid grid-cols-2 gap-1.5"><button onClick={() => reorderSelected("front")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Bring Front</button><button onClick={() => reorderSelected("back")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Send Back</button><button onClick={() => reorderSelected("up")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Forward</button><button onClick={() => reorderSelected("down")} className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/[0.08] transition">Backward</button></div></InspectorSection>
            <InspectorSection title="Appearance"><div><div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400"><span>Opacity</span></div><input type="range" min="0.1" max="1" step="0.1" defaultValue={1} onChange={(e) => updateSelected({ opacity: Number(e.target.value) })} className="w-full accent-violet-500" /></div></InspectorSection>
            <div className="grid grid-cols-2 gap-2 mt-4"><button onClick={duplicateSelected} className="rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 px-2 py-2.5 text-[8px] font-black uppercase tracking-widest transition hover:bg-violet-600 hover:text-white"><Icon name="content_copy" className="mr-1 inline text-[10px]" />Dup</button><button onClick={deleteSelected} className="rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 px-2 py-2.5 text-[8px] font-black uppercase tracking-widest transition hover:bg-rose-600 hover:text-white"><Icon name="delete" className="mr-1 inline text-[10px]" />Del</button></div>
          </div>
        ) : (<div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center"><Icon name="touch_app" className="mx-auto mb-2 text-3xl text-slate-500" /><p className="text-xs font-black text-white">Select an object</p><p className="mt-1 text-[9px] font-semibold text-slate-500">Click a table, stage, buffet, bar, or object on the canvas to edit it.</p></div>))}
        {tab === "layers" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between"><h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Object Layers</h3><span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[8px] font-black text-slate-400">{objects.length}</span></div>
            {sortedObjects.map((object) => (
              <div key={object.id} onClick={(e) => onSelect(object.id, e.shiftKey)} className={cn("group flex cursor-pointer items-center gap-2 rounded-lg border p-1.5 transition", selectedObjectIds.includes(object.id) ? "border-violet-400/40 bg-violet-500/15" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]")}><div className="grid h-6 w-6 place-items-center rounded-md border border-white/10 text-[10px] font-black text-black shadow" style={{ backgroundColor: object.color }}>{object.type === "roundTable" ? "T" : object.type.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black text-white">{object.name}</p><p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Z {object.zIndex || 0} • {object.type}</p></div><button onClick={(e) => { e.stopPropagation(); toggleHidden(object.id); commitHistory(); }} className={cn("grid h-6 w-6 place-items-center rounded-md transition", object.hidden ? "text-rose-400 bg-rose-500/10" : "text-slate-500 hover:bg-white/[0.08] hover:text-white")}><Icon name={object.hidden ? "visibility_off" : "visibility"} className="text-[12px]" /></button><button onClick={(e) => { e.stopPropagation(); toggleLocked(object.id); commitHistory(); }} className={cn("grid h-6 w-6 place-items-center rounded-md transition", object.locked ? "text-amber-400 bg-amber-500/10" : "text-slate-500 hover:bg-white/[0.08] hover:text-white")}><Icon name={object.locked ? "lock" : "lock_open"} className="text-[12px]" /></button></div>
            ))}
          </div>
        )}
        {tab === "settings" && (
          <div className="space-y-4">
            <InspectorSection title="Canvas Settings"><p className="text-[10px] font-semibold leading-relaxed text-slate-400">Use the top control strip to change custom venue dimensions, zoom level, grid spacing, snap mode, and fit-to-screen scaling.</p></InspectorSection>
            <InspectorSection title="Workspace Actions"><div className="grid grid-cols-2 gap-2"><button className="rounded-lg border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 transition hover:bg-white/[0.08]">Save Symbol</button><button className="rounded-lg border border-white/5 bg-white/[0.03] px-2 py-2 text-[8px] font-black uppercase tracking-widest text-slate-300 transition hover:bg-white/[0.08]">Clear View</button></div></InspectorSection>
          </div>
        )}
      </div>
    </aside>
  );
}
