import GlassCard from "../GlassCard";

export default function RSVPStatusCard() {
  return (
    <GlassCard className="lg:col-span-4 flex flex-col justify-between">
      <h3 className="text-2xl font-bold text-gray-200 mb-6">RSVP Status</h3>

      <div className="relative mx-auto mb-8 h-48 w-48">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="#88d982" strokeWidth="4" strokeDasharray="65 100" />
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="#cfbcff" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-65" />
          <circle cx="18" cy="18" r="16" fill="transparent" stroke="#e7c365" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-85" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-gray-200">2.4k</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Total Responses</span>
        </div>
      </div>

      <div className="space-y-3">
        <StatusRow color="bg-emerald-500" label="Attending" value="65%" />
        <StatusRow color="bg-purple-400" label="Maybe" value="20%" />
        <StatusRow color="bg-amber-400" label="Declined" value="15%" />
      </div>
    </GlassCard>
  );
}

function StatusRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-200">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <span>{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}
