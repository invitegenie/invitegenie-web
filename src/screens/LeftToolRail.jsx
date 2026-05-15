import React from "react";
import Icon from "../components/Icon";
import { cn } from "./venueObjectCatalog";

export default function LeftToolRail({ activeTool, setActiveTool }) {
  const tools = [
    ["select", "near_me", "Select"],
    ["pan", "pan_tool", "Pan"],
    ["text", "title", "Text"],
    ["shape", "category", "Shape"],
    ["line", "show_chart", "Line"],
    ["pen", "edit", "Pen"],
    ["measure", "straighten", "Measure"],
    ["note", "description", "Note"],
    ["upload", "upload", "Upload"],
  ];

  return (
    <aside className="flex w-[46px] shrink-0 flex-col items-center border-r border-white/5 bg-[#03050A] py-2">
      <div className="flex flex-1 flex-col gap-1">
        {tools.map(([id, icon, label]) => (
          <button key={id} onClick={() => setActiveTool(id)} className={cn("group flex h-[36px] w-[36px] flex-col items-center justify-center rounded-lg border text-[7px] font-bold transition", activeTool === id ? "border-violet-400/40 bg-violet-500/20 text-white shadow-lg shadow-violet-700/20" : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.055] hover:text-white")}>
            <Icon name={icon} className="mb-0.5 text-sm" />
            {label}
          </button>
        ))}
      </div>
      <button className="mt-2 flex h-[36px] w-[36px] flex-col items-center justify-center rounded-lg text-[7px] font-bold text-slate-500 hover:bg-white/[0.055] hover:text-white transition">
        <Icon name="help_outline" className="mb-0.5 text-sm" />Help
      </button>
    </aside>
  );
}
