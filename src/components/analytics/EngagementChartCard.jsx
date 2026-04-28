import GlassCard from "../GlassCard";

export default function EngagementChartCard() {
  const bars = [40, 55, 70, 45, 85, 60, 95];
  return (
    <GlassCard className="lg:col-span-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-2xl font-bold text-white">Engagement Trends</h3>
        <div className="flex gap-2">
          <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-white/10">
            7D
          </button>
          <button className="rounded-full border border-emerald-400/20 bg-emerald-400/15 px-3 py-1 text-[10px] font-bold text-emerald-300 transition hover:bg-emerald-400/25">
            30D
          </button>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden rounded-[32px] bg-slate-950/50 p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full rounded-[32px] bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.18),transparent)]" />
        </div>
        <div className="relative flex h-full items-end gap-3 px-2">
          {bars.map((height, index) => (
            <div key={index} className="flex-1 rounded-t-3xl bg-slate-700/40 transition-all duration-300 group-hover:bg-slate-700">
              <div className="relative h-full rounded-t-3xl bg-gradient-to-t from-purple-500 via-purple-400 to-emerald-400" style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </GlassCard>
  );
}
