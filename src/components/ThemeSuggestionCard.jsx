import React from "react";
import Icon from "./Icon";

export default function ThemeSuggestionCard({ theme, isSelected, onPreview, onApply }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected ? 'border-amber-400 bg-amber-400/5 shadow-lg shadow-amber-900/20' : 'border-white/10 bg-[#111827] hover:border-amber-400/40'}`} onClick={onPreview}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">{theme.themeType}</span>
            <h3 className="text-sm font-black text-white mt-2">{theme.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
            <Icon name="check_circle" className="text-[12px]" /> {theme.confidence}%
          </div>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{theme.description}</p>
        <div className="flex items-center gap-2 mb-5">
          {[theme.colors.primaryColor, theme.colors.secondaryColor, theme.colors.accentColor, theme.colors.backgroundColor].map((color, i) => (
            <div key={i} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      {isSelected ? (
        <button onClick={(e) => { e.stopPropagation(); onApply(theme); }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md">
          Apply Theme
        </button>
      ) : (
        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">Click to Preview</p>
      )}
    </div>
  );
}