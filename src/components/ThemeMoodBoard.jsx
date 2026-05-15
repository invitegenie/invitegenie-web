import React from "react";
import Icon from "./Icon";

export default function ThemeMoodBoard({ theme }) {
  if (!theme) return null;
  
  return (
    <div className="p-6 rounded-3xl border border-white/10 bg-[#111827] shadow-xl">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Design Direction</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Visual Mood</p>
          <p className="text-sm font-bold text-white">{theme.visualDirection}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Typography</p>
          <p className="text-sm font-bold text-white capitalize">{theme.typography?.fontStyle || 'sans'} Style</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Card Design</p>
          <p className="text-sm font-bold text-white capitalize">{theme.layout?.cardStyle || 'elevated'} / {theme.layout?.borderRadius || '1rem'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Hero Section</p>
          <p className="text-sm font-bold text-white capitalize">{theme.layout?.heroStyle || 'gradient'}</p>
        </div>
      </div>
    </div>
  );
}