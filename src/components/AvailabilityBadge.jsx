// InviteGenie AvailabilityBadge
export default function AvailabilityBadge({ status, label }) {
  let color;
  if (status === 'available') color = 'bg-emerald-500';
  else if (status === 'almost_booked') color = 'bg-amber-400';
  else color = 'bg-rose-500';
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white ${color}`}>
      <span className={`w-2 h-2 rounded-full ${color} inline-block`}></span>
      {label || (status === 'available' ? 'Available' : status === 'almost_booked' ? 'Almost Booked' : 'Unavailable')}
    </span>
  );
}
