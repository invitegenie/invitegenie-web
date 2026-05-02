import { useMemo } from "react";

const formatFCFA = (amount) => {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  })
    .format(Number(amount || 0))
    .replace("FCFA", "FCFA ");
};

export default function EventCard({ event, onClick }) {
  const soldOut = useMemo(
    () => event?.availableTickets <= 0 && event?.status !== "PAST",
    [event?.availableTickets, event?.status]
  );

  const ticketPercentage = useMemo(() => {
    if (!event) return 0;
    return Math.round(((event.ticketsSold || 0) / (event.totalTickets || 100)) * 100);
  }, [event?.ticketsSold, event?.totalTickets]);

  const handleClick = () => {
    if (onClick) {
      onClick(event?.id);
    }
  };

  if (!event) return null;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#111827] border border-[#2A3342] rounded-2xl overflow-hidden hover:border-[#8B5CF6]/50 transition-all cursor-pointer shadow-lg flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-36 overflow-hidden bg-black">
        <img
          src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
            {event.category || "Event"}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
              event.status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : event.status === "DRAFT"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-white/5 text-gray-500 border-white/10"
            }`}
          >
            {event.status || "ACTIVE"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <p className="text-[9px] font-bold text-violet-400 uppercase tracking-tighter">
              {event.date
                ? new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date TBA"}{" "}
              {event.time ? `• ${event.time}` : ""}
            </p>
            {event.vendorName && (
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">
                {event.vendorName}
              </p>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-100 leading-tight group-hover:text-white transition-colors line-clamp-2 min-h-[2.5rem]">
            {event.title}
          </h3>
          {event.location && (
            <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              {event.location}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-3 border-t border-[#2A3342] mt-auto">
          <div className="flex justify-between text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
            <span>{event.status === "PAST" ? "FINAL RSVP" : "TICKETS SOLD"}</span>
            <span className="text-[#9CA3AF]">
              {event.ticketsSold || 0} / {event.totalTickets || 100}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#0B0F19] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] rounded-full transition-all duration-300"
              style={{ width: `${ticketPercentage}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-100">
              {event.price === 0 || !event.price ? "FREE" : formatFCFA(event.price)}
            </span>
            {!soldOut && event.availableTickets > 0 && event.availableTickets <= 20 && (
              <span className="text-[8px] font-bold text-rose-400 uppercase">Only {event.availableTickets} left!</span>
            )}
          </div>
          <span className="material-symbols-outlined text-gray-600 text-[18px] group-hover:text-violet-400 transition-colors">
            arrow_forward
          </span>
        </div>
      </div>

      {/* Sold Out Overlay */}
      {soldOut && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <span className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest -rotate-12 shadow-2xl">
            Sold Out
          </span>
        </div>
      )}
    </div>
  );
}
