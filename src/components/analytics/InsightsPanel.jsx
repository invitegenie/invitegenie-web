import GlassCard from "../GlassCard";

export default function InsightsPanel() {
  return (
    <GlassCard className="lg:col-span-7 bg-white/[0.03] backdrop-blur-3xl border-white/5 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="relative z-10 mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-purple-400/80 to-emerald-300/80 p-3 text-gray-100 shadow-md">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-200">Genie AI Insights</h3>
      </div>
      <div className="relative z-10 grid gap-6 md:grid-cols-2">
        <InsightCard
          label="Attendance Prediction"
          value="1,850"
          note="Estimated ± 40"
          progress="82%"
          detail="Based on historical patterns, your final turnout is projected at 82%. Recommend increasing lounge capacity."
          accent="bg-gradient-to-r from-purple-400/80 to-emerald-300/80"
          badgeText="82%"
        />
        <InsightCard
          label="Send-Time Advice"
          value="Tuesday @ 10:15 AM"
          note="Highest engagement window"
          detail="Your audience has the highest engagement window early weekday mornings. Trigger the next follow-up in 14 hours for better ROI."
          buttonText="Apply Optimized Schedule"
        />
      </div>
    </GlassCard>
  );
}

function InsightCard({ label, value, note, detail, buttonText, accent, badgeText }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70 mb-3">{label}</p>
      <div className="mb-4 flex items-center gap-3">
        {accent ? (
          <div className={`rounded-full p-2 ${accent} text-gray-100`}>
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        ) : (
          <div className="rounded-full bg-amber-300/10 p-2 text-amber-300/80">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        )}
        <div>
          <p className="text-lg font-bold text-gray-200">{value}</p>
          <p className="text-xs text-gray-400">{note}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-300">{detail}</p>
      {buttonText ? (
        <button className="mt-4 w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-200 transition hover:bg-white/5">
          {buttonText}
        </button>
      ) : null}
    </div>
  );
}
