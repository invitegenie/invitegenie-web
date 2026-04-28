import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";

export default function SeatingPlanner() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [map, setMap] = useState(null);
  const [guests, setGuests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const currentEvent = Engine.getEventById(eventId);
      if (!currentEvent) {
        navigate("/dashboard");
        return;
      }
      setEvent(currentEvent);

      // Get all tickets for this event (these are our guests)
      const allTickets = JSON.parse(localStorage.getItem("ig_tickets")) || [];
      const eventGuests = allTickets.filter(t => t.eventId === eventId);
      setGuests(eventGuests);

      // Load existing map or fallback to first venue layout
      const eventMap = Engine.getSeatMapByEvent(eventId) || {
        eventId,
        objects: Engine.getVenues()?.[0]?.layout || []
      };
      setMap(eventMap);

      // Load assignments
      setAssignments(Engine.getAssignmentsByEvent(eventId));
      setLoading(false);
    };

    loadData();
  }, [eventId, navigate]);

  // Filter guests who haven't been assigned a seat yet
  const unassignedGuests = useMemo(() => {
    const assignedTicketIds = assignments.map(a => a.ticketId);
    return guests.filter(g => !assignedTicketIds.includes(g.id));
  }, [guests, assignments]);

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData("ticketId", ticketId);
  };

  const handleDrop = (e, seatId) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData("ticketId");
    if (!ticketId) return;

    try {
      Engine.assignGuestToSeat(eventId, ticketId, seatId);
      // Refresh local state
      setAssignments(Engine.getAssignmentsByEvent(eventId));
      // The core engine marks the seat as booked in the map automatically
      setMap(Engine.getSeatMapByEvent(eventId));
    } catch (error) {
      alert("Magic error: " + error.message);
    }
  };

  const getGuestForSeat = (seatId) => {
    const assignment = assignments.find(a => a.seatId === seatId);
    if (!assignment) return null;
    return guests.find(g => g.id === assignment.ticketId);
  };

  if (loading || !event) return null;

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        <header className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Seating Architect</h1>
            <p className="text-[10px] text-violet-400 uppercase font-black tracking-[0.2em] mt-1">
              {event.title} • {unassignedGuests.length} Guests Unplaced
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/events/${eventId}`)} 
              className="px-6 py-2 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              Event Details
            </button>
            <button 
              onClick={() => window.print()} 
              className="px-6 py-2 bg-violet-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 transition-all"
            >
              Export Manifest
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
          {/* Sidebar: Unassigned Guests */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 px-2">Unassigned Guests</h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {unassignedGuests.length > 0 ? unassignedGuests.map(guest => (
                  <div
                    key={guest.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, guest.id)}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-violet-500/30 hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-200 group-hover:text-white">{guest.buyerName || 'Valued Guest'}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-black mt-1">{guest.type} Pass</p>
                      </div>
                      <span className="material-symbols-outlined text-gray-600 text-sm">drag_indicator</span>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-3xl">
                    <span className="material-symbols-outlined text-gray-700 text-3xl mb-2">check_circle</span>
                    <p className="text-[10px] text-gray-600 font-bold uppercase">All guests seated</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Floor Plan */}
          <main className="lg:col-span-9 relative bg-[#0f0e13] border border-white/10 rounded-[3rem] overflow-hidden group shadow-2xl">
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} 
            />
            
            {/* Stage Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-violet-600/20 rounded-b-full border-x border-b border-violet-500/30 flex items-center justify-center">
               <span className="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">FRONT / PERFORMANCE STAGE</span>
            </div>

            {/* Interactive Canvas */}
            <div className="absolute inset-0 p-20 overflow-auto">
              {map?.objects.map(obj => {
                const seatedGuest = getGuestForSeat(obj.id);
                
                return (
                  <div
                    key={obj.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, obj.id)}
                    style={{ left: obj.x, top: obj.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      obj.type === 'stage' ? 'pointer-events-none' : 'cursor-default'
                    }`}
                  >
                    {/* Seat/Table Visual */}
                    <div className={`relative flex flex-col items-center gap-2 ${
                      obj.type === 'stage' ? 'w-48 h-24 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center' :
                      'w-14 h-14'
                    }`}>
                      {obj.type !== 'stage' && (
                        <div className={`w-full h-full rounded-2xl border-2 flex items-center justify-center transition-all ${
                          seatedGuest 
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-gray-600 hover:border-violet-500/50'
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {obj.type === 'table' ? 'table_restaurant' : 'chair'}
                          </span>
                        </div>
                      )}
                      
                      {/* Label/Guest Name */}
                      <div className="absolute -bottom-8 whitespace-nowrap text-center">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">{obj.label}</p>
                        {seatedGuest && (
                          <p className="text-[10px] font-bold text-white animate-in slide-in-from-top-1">
                            {seatedGuest.buyerName}
                          </p>
                        )}
                      </div>

                      {obj.type === 'stage' && <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Main Stage</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 pointer-events-none flex gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded bg-emerald-500/50 border border-emerald-500/50" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupied</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded bg-white/5 border border-white/10" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Empty</span>
               </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}