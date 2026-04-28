import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { hasPermission } from "../auth/roles";
import { useAuth } from "../auth/AuthContext";

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CM', { 
    style: 'currency', 
    currency: 'XAF', 
    minimumFractionDigits: 0 
  }).format(amount || 0)
    .replace('FCFA', 'FCFA ');
};

const EventListItem = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event.id)}
      className="group bg-white/[0.02] border border-white/5 rounded-2xl p-3 hover:bg-white/[0.05] hover:border-violet-500/30 transition-all cursor-pointer flex items-center gap-6"
    >
      <div className="h-20 w-20 rounded-xl overflow-hidden shrink-0 shadow-lg">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[8px] font-black uppercase tracking-wider">{event.category}</span>
          <p className="text-[9px] font-bold text-gray-500 uppercase">{event.vendorName}</p>
        </div>
        <h3 className="text-sm font-bold text-white truncate">{event.title}</h3>
        <div className="flex items-center gap-4 mt-1">
           <p className="text-[10px] text-gray-500 flex items-center gap-1">
             <span className="material-symbols-outlined text-[12px]">calendar_today</span>
             {new Date(event.date).toLocaleDateString()}
           </p>
           <p className="text-[10px] text-gray-500 flex items-center gap-1">
             <span className="material-symbols-outlined text-[12px]">location_on</span>
             {event.location}
           </p>
        </div>
      </div>

      <div className="hidden md:block w-48 px-4">
        <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase mb-1">
          <span>RSVP</span>
          <span>{Math.round((event.ticketsSold / event.totalTickets) * 100)}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }} />
        </div>
      </div>

      <div className="text-right shrink-0 px-4">
        <p className="text-xs font-black text-white">{event.price === 0 ? 'FREE' : formatFCFA(event.price)}</p>
        <p className="text-[9px] font-bold text-gray-500 uppercase mt-0.5">{event.availableTickets} left</p>
      </div>

      <div className="shrink-0 pr-2">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-500 group-hover:bg-violet-600 group-hover:text-white transition-all`}>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
         </div>
      </div>
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  const soldOut = event.availableTickets <= 0 && event.status !== 'PAST';

  return (
    <div
      onClick={() => onClick(event.id)}
      className="group relative bg-white/[0.035] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer shadow-sm flex flex-col h-full"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
            event.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            event.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
            'bg-white/5 text-gray-500 border-white/10'
          }`}>
            {event.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <p className="text-[9px] font-bold text-violet-400 uppercase tracking-tighter">
              {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} {event.time ? `• ${event.time}` : ''}
            </p>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{event.vendorName}</p>
          </div>
          <h3 className="text-sm font-bold text-gray-100 leading-tight group-hover:text-white transition-colors line-clamp-2 min-h-[2.5rem]">{event.title}</h3>
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">location_on</span>
            {event.location}
          </p>
        </div>

        <div className="space-y-2 pt-3 border-t border-[#2A3342] mt-auto">
          <div className="flex justify-between text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
            <span>{event.status === 'PAST' ? 'FINAL RSVP' : 'TICKETS SOLD'}</span>
            <span className="text-[#9CA3AF]">{event.ticketsSold || 0} / {event.totalTickets}</span>
          </div>
          <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] rounded-full" style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#F9FAFB]">{event.price === 0 ? 'FREE' : formatFCFA(event.price)}</span>
            {!soldOut && event.availableTickets > 0 && event.availableTickets <= 20 && (
               <span className="text-[8px] font-bold text-[#EF4444] uppercase">Only {event.availableTickets} left!</span>
            )}
          </div>
          <span className="material-symbols-outlined text-[#6B7280] text-[18px] group-hover:text-[#8B5CF6] transition-colors">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};

export default function Events() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState("ACTIVE");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [viewMode, setViewMode] = useState("grid");

  const events = useEngineCollection(KEYS.EVENTS);
  const { role: userRole } = useAuth();

  const canCreate = hasPermission(userRole, "create_events");

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (e.vendorName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = (e.status || "").toUpperCase() === statusTab.toUpperCase();
      const matchesCategory = categoryFilter === "All Categories" || 
                             (e.category || "").toLowerCase() === categoryFilter.toLowerCase();
      const matchesPrice = e.price <= maxPrice;
      return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
    });
  }, [events, searchTerm, statusTab, categoryFilter, maxPrice]);

  const tabCounts = useMemo(() => ({
    ACTIVE: events.filter(e => (e.status || "").toUpperCase() === 'ACTIVE').length,
    DRAFT: events.filter(e => (e.status || "").toUpperCase() === 'DRAFT').length,
    PAST: events.filter(e => (e.status || "").toUpperCase() === 'PAST').length,
  }), [events]);

  return (
    <Layout>
      <main className="p-6 space-y-6 bg-[#0B0F19] min-h-screen font-sans">
        
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Events Marketplace</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Discover and manage magical experiences.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6B7280] text-sm">search</span>
              <input 
                type="text"
                placeholder="Search events..."
                className="w-full bg-[#0F172A] border border-[#2A3342] text-white rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {canCreate && (
              <button 
                onClick={() => navigate("/create-event")}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-lg px-6 py-2 font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Create Event
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-px gap-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {["ACTIVE", "DRAFT", "PAST"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  statusTab === tab ? "text-violet-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
                {tabCounts[tab] > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] font-black text-gray-400">{tabCounts[tab]}</span>
                )}
                {statusTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 animate-in fade-in slide-in-from-bottom-1" />
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Max Price: {formatFCFA(maxPrice)}</span>
               <input 
                 type="range"
                 min="0" 
                 max="500000" 
                 step="10000" 
                 value={maxPrice} 
                 onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                 className="accent-violet-500 h-1.5 w-32 bg-white/5 rounded-full appearance-none cursor-pointer"
               />
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Showing {filteredEvents.length} of {events.length} Events
            </div>
          </div>
        </div>

        {/* Main Content Rendering */}
        <section className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "flex flex-col gap-3"}>
          {filteredEvents.map((event) => 
            viewMode === 'grid' ? (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={(id) => navigate(`/events/${id}`)} 
              />
            ) : (
              <EventListItem 
                key={event.id} 
                event={event} 
                onClick={(id) => navigate(`/events/${id}`)} 
              />
            )
          )}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-gray-600 text-3xl">event_busy</span>
              </div>
              <h3 className="text-gray-400 font-bold uppercase tracking-widest">No {statusTab.toLowerCase()} events</h3>
              <p className="text-gray-600 text-[10px] mt-1 uppercase font-black">
                {tabCounts.ACTIVE > 0 || tabCounts.DRAFT > 0 || tabCounts.PAST > 0 
                  ? "Content exists in other categories. Check the tabs above or refine your search."
                  : "The marketplace is empty. Ready to conjure something magical?"}
              </p>
              {canCreate && (
                <button onClick={() => navigate("/create-event")} className="mt-8 px-8 py-3 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:bg-violet-500 transition-all active:scale-95">
                  Create Your First Event
                </button>
              )}
            </div>
          )}
        </section>

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <div className="flex items-center justify-between pt-10">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Page 1 of 1</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-500 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {[1].map(page => (
                <button 
                  key={page}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 text-white text-[10px] font-black"
                >
                  {page}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Genie Assist Trigger */}
        <div className="fixed bottom-28 right-8 z-[60]">
           <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-xl animate-pulse" />
           <button onClick={() => navigate("/genie")} className="relative w-14 h-14 rounded-full bg-violet-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
           </button>
        </div>

      </main>
    </Layout>
  );
}
