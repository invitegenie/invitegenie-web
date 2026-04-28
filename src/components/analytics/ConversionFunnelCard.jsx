import GlassCard from "../GlassCard";

export default function ConversionFunnelCard() {
  const funnelItems = [
    { percent: "100%", label: "Total Recipients", width: "w-full", accent: "from-purple-900/40 to-purple-500/30" },
    { percent: "77%", label: "Email Opened", width: "w-[90%]", accent: "from-purple-900/40 to-emerald-400/30", border: "border-emerald-400" },
    { percent: "60%", label: "Clicked Link", width: "w-[80%]", accent: "from-purple-900/30 to-amber-400/30", border: "border-amber-400" },
    { percent: "48%", label: "RSVPed", width: "w-[70%]", accent: "from-purple-900/20 to-emerald-400/30", border: "border-emerald-300" },
  ];

  return (
    <GlassCard className="lg:col-span-5">
      <h3 className="text-2xl font-bold text-gray-200 mb-8">Conversion Funnel</h3>
      <div className="space-y-4">
        {funnelItems.map((item) => (
          <div key={item.label} className="relative px-2">
            <div className={`relative ${item.width} mx-auto overflow-hidden rounded-xl border-l-4 ${item.border ?? "border-purple-500/60"} bg-white/[0.03] h-12`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${item.accent}`} />
              <span className="relative z-10 inline-flex h-full items-center px-4 text-xs font-bold text-gray-200">
                {item.label}: {item.percent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
