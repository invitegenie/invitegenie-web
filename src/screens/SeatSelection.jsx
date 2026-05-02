import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";

export default function SeatSelection() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [map, setMap] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSelection() {
      const loadedEvent = await Engine.getEventById(eventId);
      if (!mounted) return;

      setEvent(loadedEvent);
      const eventMap = Engine.getSeatMapByEvent(eventId) || {
        eventId,
        objects: Engine.getVenues()?.[0]?.layout || []
      };
      setMap(eventMap);
    }

    loadSelection();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  const handleConfirm = async () => {
    if (!selectedSeat) return alert("Please pick a magical spot first!");
    
    try {
      const ticket = await Engine.buyTicket(eventId, currentUser.id, "Standard");
      Engine.assignGuestToSeat(eventId, ticket.id, selectedSeat.id);
      navigate(`/bookings/${ticket.id}/voucher`);
    } catch (e) {
      alert(e.message);
    }
  };

  if (!event) return null;

  // If no venue map exists yet, show a placeholder
  if (!map || !map.objects || map.objects.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-gray-500 text-3xl">architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Floor Plan Available</h2>
          <p className="text-gray-500 max-w-xs mb-6">The host hasn't conjured a seating layout for this event yet.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-violet-600 rounded-xl font-bold text-white">Go Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">SELECT YOUR SEAT</h1>
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mt-1">{event.title}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white/10" /><span className="text-[10px] text-gray-500 font-bold uppercase">Taken</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-violet-600" /><span className="text-[10px] text-gray-500 font-bold uppercase">Selected</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 aspect-[16/9] bg-white/[0.02] border border-white/10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-violet-500/20 rounded-b-full border-x border-b border-violet-500/40 flex items-center justify-center">
               <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest">STAGE / FRONT</span>
            </div>

            {map.objects.map(obj => (
              <button
                key={obj.id}
                disabled={obj.status === 'booked'}
                onClick={() => setSelectedSeat(obj)}
                style={{ left: obj.x, top: obj.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  obj.status === 'booked' ? 'bg-white/5 border-white/5 text-gray-700 opacity-50 cursor-not-allowed' :
                  selectedSeat?.id === obj.id ? 'bg-violet-600 border-violet-400 text-white scale-110 shadow-lg shadow-violet-900/40' :
                  'bg-white/[0.03] border-white/10 text-gray-400 hover:border-violet-500/50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {obj.type === 'table' ? 'table_restaurant' : 'chair'}
                </span>
              </button>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Reservation Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Selected Spot:</span><span className="text-white font-bold">{selectedSeat?.label || '--'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Price:</span><span className="text-emerald-400 font-bold">FCFA {event.price.toLocaleString()}</span></div>
              </div>
              <button 
                onClick={handleConfirm}
                className="w-full mt-8 py-4 bg-violet-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-violet-500 active:scale-95 transition-all"
              >
                Confirm Selection
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
