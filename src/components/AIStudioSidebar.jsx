import Icon from "./Icon";

export default function AIStudioSidebar({ modules = [], activeModule, onChange, isModuleLocked, usage, accountType }) {
  const used = Number(usage?.used || 0);
  const limit = usage?.limit === Infinity ? "Unlimited" : Number(usage?.limit || 0).toLocaleString();
  const percent = usage?.limit === Infinity ? 18 : Math.min(100, Math.round((used / Math.max(Number(usage?.limit || 1), 1)) * 100));

  return (
    <aside className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-4 shadow-xl shadow-black/20 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">AI Usage</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-black text-white">{used}</p>
            <p className="text-xs font-semibold text-slate-400">of {limit} this month</p>
          </div>
          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-100">
            {accountType}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/40">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <nav className="mt-4 space-y-2">
        {modules.map((module) => {
          const locked = isModuleLocked?.(module);
          const active = activeModule === module.id;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onChange?.(module.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? "border-amber-300/40 bg-amber-300/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-amber-300 text-black" : "bg-black/30 text-amber-200"}`}>
                <Icon name={module.icon} className="text-[20px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black">{module.label}</span>
                <span className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-500">{module.description}</span>
              </span>
              {locked ? <Icon name="lock" className="text-[18px] text-slate-500" /> : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
