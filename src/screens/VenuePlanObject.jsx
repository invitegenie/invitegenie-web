import React from "react";
import Icon from "../components/Icon";
import { cn } from "./venueObjectCatalog";

export function IsometricWalls({ color, depth }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
      <div className="absolute bottom-full left-0 w-full origin-bottom" style={{ height: depth, backgroundColor: color, transform: "rotateX(90deg)", filter: "brightness(0.75)" }} />
      <div className="absolute top-full left-0 w-full origin-top" style={{ height: depth, backgroundColor: color, transform: "rotateX(-90deg)", filter: "brightness(0.5)" }} />
      <div className="absolute top-0 right-full h-full origin-right" style={{ width: depth, backgroundColor: color, transform: "rotateY(-90deg)", filter: "brightness(0.9)" }} />
      <div className="absolute top-0 left-full h-full origin-left" style={{ width: depth, backgroundColor: color, transform: "rotateY(90deg)", filter: "brightness(0.75)" }} />
    </div>
  );
}

export function IsometricCylinder({ color, depth, isIso }) {
  if (!isIso) return null;
  const steps = Math.min(10, Math.ceil(depth / 2));
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="absolute inset-0 rounded-full" style={{ backgroundColor: color, transform: `translateZ(-${(i + 1) * (depth / steps)}px)`, filter: "brightness(0.8)" }} />
      ))}
    </div>
  );
}

export default function VenuePlanObject({ object, selected, highlighted, isSingleSelection, onSelect, onDragStart, onResizeStart, onRotateStart, activeRenderMode }) {
  if (object.hidden) return null;
  
  const is2D = activeRenderMode === "2d";
  const is3D = activeRenderMode === "iso" || activeRenderMode === "walk";
  const isIso = activeRenderMode === "iso";

  const style = {
    left: object.x,
    top: object.y,
    width: object.width,
    height: object.height,
    zIndex: object.zIndex || 10,
    opacity: object.opacity ?? 1,
    transform: `rotate(${object.rotation || 0}deg) ${is3D ? `translateZ(${(object.zIndex || 10) * 3}px)` : ""}`,
    transformStyle: "preserve-3d",
    transition: is3D ? "transform 0.7s ease-in-out" : "none",
  };

  const label = object.metadata?.tableNumber || object.name;
  const seats = object.metadata?.seats || 8;

  return (
    <div onPointerDown={(event) => is2D && onDragStart(event, object)} onClick={(event) => { event.stopPropagation(); if (is2D) onSelect(object.id); }} className={cn("absolute select-none", is2D ? (object.locked ? "cursor-not-allowed" : "cursor-move") : "cursor-default", is2D && selected ? "ring-2 ring-violet-300 ring-offset-2 ring-offset-[#171F2E]" : is2D && highlighted ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#171F2E]" : "")} style={style}>
      {object.type === "roundTable" && (
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {isIso && <IsometricCylinder color="#cbd5e1" depth={20} isIso={isIso} />}
          {Array.from({ length: seats }).map((_, index) => {
            const angle = (index / seats) * Math.PI * 2;
            const radiusX = object.width / 2 + 12;
            const radiusY = object.height / 2 + 12;
            const rotation = angle * (180 / Math.PI) + 90;
            return <div key={index} className="absolute h-6 w-6 rounded-t-full rounded-b-lg border border-slate-300 bg-slate-200 shadow-md" style={{ left: object.width / 2 + Math.cos(angle) * radiusX - 12, top: object.height / 2 + Math.sin(angle) * radiusY - 12, transform: `rotate(${rotation}deg) translateZ(${isIso ? -10 : 0}px)`, transformStyle: "preserve-3d" }}>
               {isIso && <div className="absolute inset-0 rounded-t-full rounded-b-lg bg-slate-300 pointer-events-none" style={{ transform: "translateZ(-8px)" }} />}
            </div>;
          })}
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-slate-200 bg-white/95 shadow-lg" style={{ transform: isIso ? "translateZ(1px)" : "none" }}><span className="text-sm font-black text-slate-800 drop-shadow-sm">{label}</span></div>
        </div>
      )}
      {object.type === "chair" && (
        <div className="relative h-full w-full flex flex-col items-center justify-end drop-shadow-md" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#cbd5e1" depth={15} />}
           <div className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden rounded-2xl"><div className="w-3/4 h-1/3 bg-slate-300 border border-slate-400 shadow-inner" /><div className="w-full h-2/3 bg-slate-200 border border-slate-400 shadow-md flex justify-between p-1"><div className="w-1.5 h-full bg-slate-300 rounded-full" /><div className="w-1.5 h-full bg-slate-300 rounded-full" /></div></div>
        </div>
      )}
      {object.type === "stage" && (
        <div className="relative h-full w-full rounded-md shadow-[0_20px_50px_rgba(139,92,246,0.4)]" style={{ transformStyle: "preserve-3d" }}>
          {isIso && <IsometricWalls color="#2e1065" depth={40} />}
          <div className="absolute inset-0 rounded-md border border-slate-800 bg-gradient-to-b from-slate-900 to-black overflow-hidden"><div className="absolute top-0 left-0 w-full h-6 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.2)_4px,rgba(255,255,255,0.2)_8px)] border-b-2 border-slate-700 flex justify-around items-center px-4">{[1,2,3,4,5,6].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,1)]" />)}</div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-6 flex flex-col"><div className="w-full h-1/2 bg-slate-800 border-t border-slate-600 rounded-t-sm" /><div className="w-[110%] -ml-[5%] h-1/2 bg-slate-700 border-t border-slate-500 rounded-t-sm" /></div><div className="absolute inset-x-8 top-10 h-16 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" /><div className="grid h-full place-items-center"><div className="text-center"><p className="text-2xl font-black text-white tracking-[0.3em] drop-shadow-lg">{object.name || "STAGE"}</p><p className="text-[10px] font-bold text-white/50 tracking-widest mt-1">{Math.round(object.width / 100)}m × {Math.round(object.height / 100)}m</p></div></div></div>
        </div>
      )}
      {object.type === "danceFloor" && (
        <div className="relative h-full w-full rounded-lg shadow-[0_0_40px_rgba(139,92,246,0.3)]" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#4c1d95" depth={8} />}
           <div className="absolute inset-0 overflow-hidden border-4 border-violet-500/50 rounded-lg bg-[#0f172a]"><div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_51%),linear-gradient(-45deg,transparent_49%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_51%)] bg-[length:40px_40px]" /><div className="grid h-full place-items-center"><div className="bg-black/50 px-6 py-3 rounded-2xl backdrop-blur-md border border-violet-500/30"><p className="text-center text-xl font-black text-white drop-shadow-lg tracking-[0.2em]">{object.name || "DANCE FLOOR"}</p></div></div></div>
        </div>
      )}
      {object.type === "headTable" && (
        <div className="relative h-full w-full rounded-md shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#fcd34d" depth={20} />}
           <div className="absolute inset-0 rounded-md border-4 border-amber-300 bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-around px-8 overflow-hidden"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 bg-emerald-600/60 blur-[4px] rounded-full" />{[1,2,3,4,5,6].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-300 bg-white shadow-md flex items-center justify-center z-10"><div className="w-5 h-5 rounded-full border border-slate-200" /></div>)}<div className="absolute inset-0 grid place-items-center pointer-events-none z-20"><p className="text-sm font-black text-amber-900 bg-white/80 px-5 py-1.5 rounded-full backdrop-blur-md shadow-lg tracking-widest uppercase">{label}</p></div></div>
        </div>
      )}
      {object.type === "buffet" && (
        <div className="relative h-full w-full rounded-lg shadow-xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#cbd5e1" depth={25} />}
           <div className="absolute inset-0 rounded-lg border-2 border-slate-300 bg-slate-100 flex items-center justify-around px-4 overflow-hidden">{[1,2,3,4].map(i => <div key={i} className="w-12 h-16 rounded-md border-2 border-slate-400 bg-slate-200 shadow-inner flex items-center justify-center"><div className="w-10 h-12 rounded-sm border border-slate-300 bg-slate-100" /></div>)}<div className="absolute inset-0 grid place-items-center pointer-events-none"><p className="text-xs font-black text-slate-800 bg-white/90 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md tracking-widest">{object.name || "BUFFET"}</p></div></div>
        </div>
      )}
      {object.type === "bar" && (
        <div className="relative h-full w-full rounded-lg shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#92400e" depth={30} />}
           <div className="absolute inset-0 rounded-lg border border-amber-900 bg-gradient-to-b from-amber-700 to-amber-900 flex flex-col justify-end overflow-hidden"><div className="absolute top-0 w-full h-1/2 bg-amber-800 border-b-4 border-amber-950/50 flex items-center justify-around px-4">{[1,2,3,4,5,6,7].map(i => <div key={i} className={`w-4 h-4 rounded-full shadow-sm ${["bg-emerald-400","bg-rose-400","bg-blue-400","bg-amber-200","bg-violet-400"][i%5]}`} />)}</div><div className="flex w-full justify-around pb-1.5 relative z-10">{[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-600 bg-slate-300 shadow-xl" />)}</div><div className="absolute inset-0 grid place-items-center pointer-events-none z-20"><p className="text-xs font-black text-white bg-black/60 px-4 py-1 rounded-full drop-shadow-md tracking-widest">{object.name || "BAR"}</p></div></div>
        </div>
      )}
      {object.type === "entrance" && (
        <div className="relative h-full w-full rounded-t-3xl shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#047857" depth={35} />}
           <div className="absolute inset-0 rounded-t-3xl border-4 border-emerald-600/80 bg-gradient-to-t from-emerald-900/80 to-emerald-500/30 flex items-center justify-center border-b-0 overflow-hidden"><div className="absolute bottom-0 w-full h-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,rgba(255,255,255,0.15)_15px,rgba(255,255,255,0.15)_30px)]" /><p className="text-sm font-black text-emerald-100 tracking-widest bg-emerald-900/90 px-5 py-2 rounded-full border border-emerald-500/50 backdrop-blur-md shadow-xl">{object.name || "ENTRANCE"}</p></div>
        </div>
      )}
      {object.type === "photoBooth" && (
        <div className="relative h-full w-full rounded-xl shadow-[0_0_30px_rgba(236,72,153,0.4)]" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#831843" depth={25} />}
           <div className="absolute inset-0 rounded-xl border-2 border-pink-500/60 bg-gradient-to-br from-slate-900 to-black p-3 flex flex-col justify-between overflow-hidden"><div className="w-full h-3 bg-pink-500/40 rounded-full flex justify-center"><div className="w-6 h-full bg-pink-400 rounded-full shadow-[0_0_15px_rgba(244,114,182,0.9)]" /></div><div className="w-full flex-1 mt-3 border-2 border-dashed border-pink-500/40 rounded-xl flex items-center justify-center bg-pink-500/5"><Icon name="photo_camera" className="text-4xl text-pink-300 opacity-90 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]" /></div><p className="absolute bottom-2 right-3 text-[10px] font-black text-pink-200 tracking-widest bg-black/60 px-2 py-0.5 rounded-md backdrop-blur">PHOTO BOOTH</p></div>
        </div>
      )}
      {object.type === "djBooth" && (
        <div className="relative h-full w-full rounded-lg shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#1e293b" depth={20} />}
           <div className="absolute inset-0 rounded-lg border-b-8 border-slate-950 bg-slate-800 flex flex-col overflow-hidden"><div className="flex-1 flex items-center justify-around px-4"><div className="w-14 h-14 rounded-full border-4 border-slate-600 bg-slate-900 shadow-inner flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-slate-700" /></div><div className="w-12 h-16 rounded-md bg-slate-700 border-2 border-slate-600 flex flex-col justify-between p-1.5 shadow-inner"><div className="w-full h-1.5 bg-red-500/90 rounded shadow-[0_0_5px_red]" /><div className="w-full h-1.5 bg-amber-500/90 rounded shadow-[0_0_5px_orange]" /><div className="w-full h-1.5 bg-green-500/90 rounded shadow-[0_0_5px_green]" /></div><div className="w-14 h-14 rounded-full border-4 border-slate-600 bg-slate-900 shadow-inner flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-slate-700" /></div></div><div className="h-8 bg-violet-600 border-t-2 border-violet-400 flex items-center justify-center shadow-lg z-10"><p className="text-[11px] font-black text-white tracking-[0.25em]">{object.name || "DJ BOOTH"}</p></div></div>
        </div>
      )}
      {object.type === "generator" && (
        <div className="relative h-full w-full rounded-xl shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#334155" depth={25} />}
           <div className="absolute inset-0 rounded-xl border-4 border-slate-800 bg-[repeating-linear-gradient(45deg,#eab308,#eab308_20px,#000_20px,#000_40px)] overflow-hidden flex items-center justify-center"><div className="bg-slate-900 border-4 border-slate-700 p-3 rounded-lg shadow-inner flex flex-col items-center"><Icon name="bolt" className="text-yellow-400 text-3xl animate-pulse drop-shadow-[0_0_10px_yellow]" /><span className="text-[10px] font-black text-white bg-black px-3 py-1 rounded-md mt-1 tracking-widest">GENERATOR</span></div></div>
        </div>
      )}
      {object.type === "toilet" && (
        <div className="relative h-full w-full rounded-2xl shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#0891b2" depth={30} />}
           <div className="absolute inset-0 rounded-2xl border-4 border-cyan-600 bg-cyan-950/60 p-2 flex gap-2 overflow-hidden"><div className="flex-1 bg-cyan-900/80 border-2 border-cyan-700 rounded-lg flex flex-col items-center justify-center"><Icon name="man" className="text-cyan-300 text-3xl" /></div><div className="flex-1 bg-cyan-900/80 border-2 border-cyan-700 rounded-lg flex flex-col items-center justify-center"><Icon name="woman" className="text-cyan-300 text-3xl" /></div><div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-600 px-4 py-1 rounded-full border-2 border-cyan-300 text-[10px] font-black tracking-widest text-white shadow-xl z-10">RESTROOMS</div></div>
        </div>
      )}
      {object.type === "parking" && (
        <div className="relative h-full w-full rounded-2xl shadow-inner" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#334155" depth={5} />}
           <div className="absolute inset-0 rounded-2xl border-4 border-slate-700 bg-slate-800 overflow-hidden p-3 flex gap-5"><div className="flex-1 border-r-4 border-dashed border-white/40" /><div className="flex-1 border-r-4 border-dashed border-white/40" /><div className="flex-1 border-r-4 border-dashed border-white/40" /><div className="flex-1" /><div className="absolute inset-0 grid place-items-center"><div className="w-20 h-20 rounded-full bg-blue-600/90 border-4 border-white flex items-center justify-center backdrop-blur-md shadow-2xl"><span className="text-4xl font-black text-white">P</span></div></div></div>
        </div>
      )}
      {(object.type === "vendorBooth" || object.type === "foodStall") && (
        <div className="relative h-full w-full rounded-xl shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#b45309" depth={35} />}
           <div className="absolute inset-0 rounded-xl border-2 border-amber-700 bg-amber-50 overflow-hidden flex flex-col"><div className="w-full h-1/2 bg-[repeating-linear-gradient(90deg,#f59e0b,#f59e0b_20px,#fff_20px,#fff_40px)] border-b-4 border-amber-600 shadow-md flex items-center justify-center" /><div className="w-full flex-1 bg-amber-100 flex items-center justify-center px-2 text-center"><p className="text-[11px] font-black text-amber-900 uppercase tracking-widest">{object.name}</p></div></div>
        </div>
      )}
      {object.type === "lightingTower" && (
        <div className="relative h-full w-full rounded-full border-4 border-yellow-400 bg-yellow-200 shadow-[0_0_60px_rgba(253,224,71,0.8)] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricCylinder color="#eab308" depth={60} isIso={isIso} />}
           <div className="w-1/2 h-1/2 rounded-full bg-white shadow-[0_0_30px_#fff] z-10" />
        </div>
      )}
      {object.type === "exit" && (
        <div className="relative h-full w-full rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center justify-center text-white" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#059669" depth={20} />}
           <div className="absolute inset-0 rounded-xl border-4 border-emerald-400 bg-emerald-600 overflow-hidden flex items-center justify-center"><Icon name="exit_to_app" className="text-3xl mr-2" /><span className="text-lg font-black tracking-widest">EXIT</span></div>
        </div>
      )}
      {object.type === "carpet" && (
        <div className="relative h-full w-full rounded-sm bg-gradient-to-r from-red-800 via-red-500 to-red-800 border-x-8 border-red-950 shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex flex-col justify-center" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <div className="absolute inset-0 rounded-sm bg-red-950" style={{ transform: "translateZ(-2px)" }} />}
           <div className="w-full h-px bg-red-300/40" /><div className="w-full h-px bg-red-300/40 mt-3" />
        </div>
      )}
      {object.type === "decor" && (
        <div className="relative h-full w-full rounded-full border-[8px] border-emerald-700/90 bg-emerald-900/30 shadow-2xl flex items-center justify-center overflow-visible" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricCylinder color="#064e3b" depth={15} isIso={isIso} />}
           <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.9)] z-10" style={{ transform: isIso ? "translateZ(10px)" : "none" }} />
           <div className="absolute top-1/2 -right-4 w-7 h-7 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.9)] z-10" style={{ transform: isIso ? "translateZ(15px)" : "none" }} />
           <div className="absolute -bottom-3 left-1/2 w-9 h-9 rounded-full bg-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.9)] z-10" style={{ transform: isIso ? "translateZ(20px)" : "none" }} />
           <p className="text-[10px] font-black text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-md shadow-lg tracking-widest z-20" style={{ transform: isIso ? "translateZ(5px)" : "none" }}>{object.name || "DECOR"}</p>
        </div>
      )}
      {object.type === "canopy" && (
        <div className="relative h-full w-full rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.3)]" style={{ transformStyle: "preserve-3d" }}>
           {isIso && <IsometricWalls color="#94a3b8" depth={60} />}
           <div className="absolute inset-0 rounded-xl border-4 border-slate-300 bg-white/95 overflow-hidden"><div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-slate-400 border-2 border-slate-600 shadow-md" /><div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-400 border-2 border-slate-600 shadow-md" /><div className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-slate-400 border-2 border-slate-600 shadow-md" /><div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-slate-400 border-2 border-slate-600 shadow-md" /><svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none"><line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="3" /><line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="3" /></svg><div className="grid h-full place-items-center"><p className="text-sm font-black tracking-widest text-slate-800 bg-white/90 px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm z-10">{object.name || "TENT"}</p></div></div>
        </div>
      )}
      {object.type === "arch" && (
        <div className="relative h-full w-full rounded-t-full shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
          {isIso && <IsometricWalls color="#15803d" depth={15} />}
          <div className="absolute inset-0 rounded-t-full border-[16px] border-emerald-600/90 border-b-0 flex items-start justify-center pt-4 overflow-hidden"><div className="absolute -top-4 left-4 w-6 h-6 rounded-full bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.9)]" /><div className="absolute top-10 -right-4 w-6 h-6 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.9)]" /><p className="text-[10px] font-black tracking-widest text-emerald-900 bg-white/90 px-3 py-1 rounded-full shadow-md backdrop-blur-sm z-10">{object.name || "ARCH"}</p></div>
        </div>
      )}
      {object.type === "custom" && (
        <div className="relative h-full w-full rounded-lg shadow-xl" style={{ transformStyle: "preserve-3d" }}>
          {isIso && <IsometricWalls color={object.color || "#333"} depth={20} />}
          <div className="absolute inset-0 grid place-items-center rounded-lg border-2 border-black/30 text-center text-xs font-black text-black overflow-hidden" style={{ backgroundColor: object.color }}>{object.name.toUpperCase()}</div>
        </div>
      )}
      {is2D && selected && isSingleSelection && !object.locked && (
        <>
          <button onPointerDown={(event) => onRotateStart(event, object)} className="absolute -top-7 left-1/2 h-5 w-5 -translate-x-1/2 grid place-items-center rounded-full border border-violet-400 bg-white text-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.6)] hover:scale-110 transition-transform z-50"><Icon name="rotate_right" className="text-[10px]" /></button>
          {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((pos) => <button key={pos} onPointerDown={(event) => onResizeStart(event, object)} className={cn("absolute h-3 w-3 rounded-full border border-violet-400 bg-white shadow-[0_0_8px_rgba(139,92,246,0.6)] hover:scale-125 transition-transform z-50", pos)} />)}
        </>
      )}
    </div>
  );
}
