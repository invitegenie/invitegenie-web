import GlassCard from "../GlassCard";

export default function AnalyticsMetricCard({ icon, label, value, delta, accent }) {
  return (
    <GlassCard className="rounded-[24px] bg-white/[0.03] p-6 shadow-md border-white/5">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${accent}`}>
          <span className="material-symbols-outlined text-gray-100">{icon}</span>
        </div>
        <span className="text-xs font-bold text-emerald-400/90">{delta}</span>
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-200">{value}</p>
    </GlassCard>
  );
}
