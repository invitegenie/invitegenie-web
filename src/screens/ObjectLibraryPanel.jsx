import React, { useState, useMemo } from "react";
import Icon from "../components/Icon";
import { cn, librarySections, VENUE_TEMPLATES } from "./venueObjectCatalog";

export default function ObjectLibraryPanel({ addObjectFromLibrary, applyTemplate }) {
  const [activeTab, setActiveTab] = useState("library");
  const [query, setQuery] = useState("");
  const [expandedCat, setExpandedCat] = useState(null);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return librarySections;
    return librarySections
      .map((section) => ({ ...section, items: section.items.filter((item) => item.name.toLowerCase().includes(q)) }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-white/5 bg-[#060913]">
      <div className="border-b border-white/5 p-2">
        <div className="grid grid-cols-2 rounded-lg bg-black/25 p-1">
          <button onClick={() => setActiveTab("library")} className={cn("rounded-md py-1.5 text-[8px] font-black uppercase tracking-widest transition", activeTab === "library" ? "bg-violet-600/25 text-violet-200" : "text-slate-500 hover:text-white")}>Object Library</button>
          <button onClick={() => setActiveTab("templates")} className={cn("rounded-md py-1.5 text-[8px] font-black uppercase tracking-widest transition", activeTab === "templates" ? "bg-violet-600/25 text-violet-200" : "text-slate-500 hover:text-white")}>Templates</button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/25 px-2 py-1">
          <Icon name="search" className="text-slate-500 text-xs" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search objects..." className="w-full bg-transparent text-[10px] font-semibold text-white outline-none placeholder:text-slate-600" />
          <Icon name="filter_list" className="text-slate-500 text-xs" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 custom-scrollbar relative">
        {activeTab === "library" ? (
          filteredSections.map((section) => {
            const isExpanded = expandedCat === section.title;
            const firstItem = section.items[0];
            const remainingItems = section.items.slice(1);
            
            return (
              <section key={section.title} className="relative group mb-3 z-10 hover:z-50">
                <button onClick={() => setExpandedCat(isExpanded ? null : section.title)} className="flex items-center justify-between w-full mb-1.5">
                  <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors cursor-pointer">{section.title}</h3>
                  <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-xs text-slate-600 group-hover:text-violet-400 transition-colors" />
                </button>
                
                {firstItem && (
                  <button 
                    onClick={() => addObjectFromLibrary(firstItem)} 
                    className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-left transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-900/20"
                  >
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-gradient-to-br from-slate-200 to-slate-400 text-[#0A1220] shadow-sm">
                      <Icon name={firstItem.icon} className="text-xs" />
                    </div>
                    <span className="text-[9px] font-black leading-tight text-slate-200">{firstItem.name}</span>
                  </button>
                )}

                {remainingItems.length > 0 && (
                  <div className={cn(
                    "absolute left-0 top-full mt-1 w-full rounded-xl border border-white/10 bg-[#060913]/95 backdrop-blur-xl shadow-2xl p-2 transition-all duration-200 origin-top",
                    isExpanded ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none group-hover:scale-y-100 group-hover:opacity-100 group-hover:pointer-events-auto"
                  )}>
                    <div className="grid grid-cols-3 gap-1">
                      {remainingItems.map((item) => (
                        <button key={item.name} onClick={() => addObjectFromLibrary(item)} className="group/btn flex min-h-[56px] flex-col items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] p-1 text-center transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-900/20">
                          <div className="mb-1 grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-slate-200 to-slate-400 text-[#0A1220] shadow-sm transition group-hover/btn:scale-110"><Icon name={item.icon} className="text-xs" /></div>
                          <span className="line-clamp-2 text-[7px] font-black leading-tight text-slate-200">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        ) : (<div className="space-y-1.5">{VENUE_TEMPLATES.map((template) => (<button key={template.id} onClick={() => applyTemplate(template)} className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] p-2 text-left hover:border-violet-400/30 hover:bg-violet-500/10 transition"><div className="grid h-8 w-8 place-items-center rounded-md bg-violet-500/20 text-violet-200"><Icon name="dashboard_customize" className="text-xs" /></div><div className="min-w-0 flex-1"><p className="text-[10px] font-black text-white truncate">{template.title}</p><p className="text-[8px] mt-0.5 font-semibold text-slate-500 line-clamp-2 leading-tight">{template.description}</p></div></button>))}</div>)}
      </div>
    </aside>
  );
}
