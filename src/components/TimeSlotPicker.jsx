// InviteGenie TimeSlotPicker
export default function TimeSlotPicker({ slots, selectedSlot, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map(slot => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot)}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${selectedSlot?.id === slot.id ? 'bg-violet-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-400 hover:bg-white/5'}`}
          disabled={slot.status !== 'available'}
        >
          {slot.startTime} - {slot.endTime}
        </button>
      ))}
    </div>
  );
}
