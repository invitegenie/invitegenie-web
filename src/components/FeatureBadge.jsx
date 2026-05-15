import Icon from "./Icon";

export default function FeatureBadge({ icon = "check_circle", label, tone = "violet", active = true }) {
  const tones = {
    violet: active ? "border-violet-300/20 bg-violet-500/10 text-violet-100" : "border-white/10 bg-white/[0.035] text-slate-400",
    amber: active ? "border-amber-300/25 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.035] text-slate-400",
    emerald: active ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-white/[0.035] text-slate-400",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${tones[tone] || tones.violet}`}>
      <Icon name={icon} className="text-sm" />
      {label}
    </span>
  );
}
