import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { KEYS } from "../../auth/coreEngine";
import { useAuth } from "../../auth/AuthContext";
import { USER_ROLES } from "../../services/roles";
import useEngineCollection from "../useEngineCollection";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();

  const events = useEngineCollection(KEYS.EVENTS);
  const memories = useEngineCollection(KEYS.MEMORIES) || [];
  const tickets = useEngineCollection(KEYS.TICKETS);

  const myTickets = useMemo(() => 
    (tickets || []).filter(t => t.userId === currentUser?.id || t.userId === 'user-pro-001'), [tickets, currentUser]);

  const myEvents = useMemo(() => 
    (events || []).filter(e => e.hostId === currentUser?.id || e.hostId === 'user-pro-001'), [events, currentUser]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. Quick Action Home Menu */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Home", icon: "home", path: "/dashboard", color: "from-violet-600 to-indigo-600" },
          { label: "Feed", icon: "rss_feed", path: "/feed", color: "from-fuchsia-600 to-pink-600" },
          { label: "Marketplace", icon: "storefront", path: "/marketplace", color: "from-emerald-600 to-teal-600" },
          { label: "Create", icon: "edit_square", path: "/create-event", color: "from-amber-600 to-orange-600" },
          { label: "Events", icon: "event", path: "/events", color: "from-blue-600 to-cyan-600" },
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`group relative p-6 rounded-[2rem] bg-gradient-to-br ${item.color} shadow-xl hover:scale-105 transition-all text-center flex flex-col items-center justify-center gap-3 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </section>

      {/* 2. Role Specific Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {role === USER_ROLES.NORMAL_USER && (
            <DashboardCard title="My Active Tickets" icon="confirmation_number">
              {myTickets.length > 0 ? (
                 <div className="space-y-4">
                   {myTickets.map(t => (
                     <div key={t.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{t.eventName}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{t.id}</p>
                        </div>
                        <button onClick={() => navigate(`/bookings/${t.id}/voucher`)} className="px-4 py-2 bg-violet-600 text-[10px] font-black uppercase rounded-xl">View</button>
                     </div>
                   ))}
                 </div>
              ) : (
                <p className="text-gray-500 text-sm">No tickets found. Explore the marketplace to find magical events!</p>
              )}
            </DashboardCard>
          )}

          {role === USER_ROLES.EVENT_PLANNER && (
            <DashboardCard title="My Hosted Events" icon="event">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myEvents.map(ev => (
                   <div key={ev.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="font-bold text-white truncate">{ev.title}</p>
                      <div className="flex justify-between mt-4">
                         <span className="text-[9px] font-black text-emerald-400 uppercase">{ev.ticketsSold} Sold</span>
                         <button onClick={() => navigate(`/events/${ev.id}`)} className="text-[9px] font-black text-violet-400 uppercase">Manage</button>
                      </div>
                   </div>
                ))}
                <button onClick={() => navigate("/create-event")} className="p-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-white hover:border-white/20 transition-all">
                  + Create New Event
                </button>
              </div>
            </DashboardCard>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <DashboardCard title="Feed Highlights" icon="rss_feed">
              {/* Small vertical slice of feed */}
              <div className="space-y-4">
                {/* Use the 'memories' variable from useEngineCollection hook instead of calling the async function */}
                {memories && memories.length > 0 ? memories.slice(0, 3).map(mem => (
                  <div key={mem.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"><img src={mem.image} alt={mem.caption || "Event memory"} className="w-full h-full object-cover" /></div>
                    <p className="text-[10px] text-gray-300 italic line-clamp-2">"{mem.caption}"</p>
                  </div>
                )) : (
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-center py-4">No moments captured yet</p>
                )}
                <button onClick={() => navigate("/feed")} className="w-full py-2 bg-white/5 text-[10px] font-black uppercase rounded-xl">View Full Feed</button>
              </div>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, icon, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}
