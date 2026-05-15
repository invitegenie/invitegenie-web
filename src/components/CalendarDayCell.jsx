// InviteGenie CalendarDayCell
export default function CalendarDayCell({ date, status, slots, selected, onClick }) {
  let color;
  if (status === 'available') color = 'border-emerald-500';
  else if (status === 'almost_booked') color = 'border-amber-400';
  else color = 'border-rose-500';
  return (
    <button
      className={`w-12 h-12 flex flex-col items-center justify-center border-2 ${color} rounded-xl bg-slate-900 hover:bg-slate-800 transition relative ${selected ? 'ring-2 ring-violet-500' : ''}`}
      onClick={onClick}
      disabled={status === 'unavailable'}
    >
      <span className="font-bold text-white">{date.getDate()}</span>
      <span className={`w-2 h-2 rounded-full mt-1 ${color} inline-block`}></span>
      {slots && slots.length > 0 && (
        <span className="absolute bottom-1 right-1 text-[10px] text-slate-400">{slots.length}</span>
      )}
    </button>
  );
}
