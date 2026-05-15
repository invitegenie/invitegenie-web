// InviteGenie AvailabilityLegend
export default function AvailabilityLegend() {
  return (
    <div className="flex gap-4 items-center mt-2">
      <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>Available</span>
      <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>Almost Booked</span>
      <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>Unavailable</span>
    </div>
  );
}
