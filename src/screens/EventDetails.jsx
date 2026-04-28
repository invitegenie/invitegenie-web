import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";
import { USER_ROLES, hasPermission } from "../auth/roles";

// Local Components
const TicketModal = ({ isOpen, onClose, event, onPurchase }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', qty: 1, type: 'Standard' });
  
  if (!isOpen) return null;

  const total = formData.qty * (event.price || 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#141218] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-white/5">
           <h2 className="text-2xl font-bold text-white tracking-tight">Purchase Tickets</h2>
           <p className="text-xs text-gray-500 mt-1 uppercase font-black tracking-widest">{event.title}</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Full Name</label>
            <input type="text" placeholder="Ngalle Marie" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Email</label>
              <input type="email" placeholder="marie@example.cm" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Phone</label>
              <input type="tel" placeholder="+237 6XX XXX XXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Quantity</label>
              <input type="number" min="1" max={event.availableTickets} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.qty} onChange={e => setFormData({...formData, qty: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Ticket Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Standard">Standard Pass</option>
                <option value="VIP">VIP / Business</option>
                <option value="Table">Table Reservation</option>
              </select>
            </div>
          </div>
          <div className="mt-6 p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex justify-between items-center">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
             <span className="text-xl font-black text-white">FCFA {total.toLocaleString()}</span>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-500 text-xs font-black uppercase tracking-widest">Cancel</button>
            <button onClick={() => onPurchase(formData)} className="flex-1 px-4 py-3 rounded-xl bg-violet-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-900/40">Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  useEffect(() => {
    const events = Engine.getEvents();
    setAllEvents(events);
    const found = events.find((e) => e.id.toString() === eventId?.toString());
    setEvent(found);
  }, [eventId]);

  const { currentUser, role: userRole } = useAuth();
  const canBuy = hasPermission(userRole, "buy_tickets");
  const canEdit = hasPermission(userRole, "manage_all_events") || 
                  (hasPermission(userRole, "manage_own_events") && event?.vendorId === 'v_my'); // Simplified check

  const similarEvents = useMemo(() => {
    if (!event) return [];
    return allEvents
      .filter(e => e.id !== event.id && e.category === event.category)
      .slice(0, 3);
  }, [event, allEvents]);

  const handlePurchase = (formData) => {
    if (!currentUser) {
      alert("Please log in to purchase tickets.");
      return navigate("/login");
    }

    try {
      // Use the coreEngine to process the transaction
      // Note: For this MVP, we process the booking via the engine logic
      const ticket = Engine.buyTicket(event.id, currentUser.id, formData.type);
    
      // Refresh local state to reflect reduced ticket availability
      setEvent(Engine.getEventById(event.id));
      setIsPurchaseModalOpen(false);
      
      navigate(`/bookings/${ticket.id}/voucher`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!event) return null;

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate("/events")} 
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            Back to Marketplace
          </button>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"><span className="material-symbols-outlined text-[20px]">share</span></button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"><span className="material-symbols-outlined text-[20px]">favorite</span></button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
          <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-[10px] font-black uppercase tracking-[0.2em] text-white">{event.category}</span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Available</span>
              </div>
              <h1 className="text-5xl font-bold text-white font-heading tracking-tighter leading-none">{event.title}</h1>
              <p className="text-gray-300 text-lg mt-4 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400">location_on</span>
                {event.location}
              </p>
            </div>
            
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] min-w-[280px]">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Fee</span>
                  <span className="text-2xl font-black text-white">{event.price === 0 ? 'FREE' : `FCFA ${event.price.toLocaleString()}`}</span>
               </div>
               {canEdit && (
                 <button
                    onClick={() => navigate(`/seating-planner/${event.id}`)}
                    className="w-full mb-3 py-4 border border-violet-500/30 bg-violet-500/10 text-violet-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500/20 transition-all"
                  >
                    Manage Seating
                  </button>
               )}

               {canBuy && event.availableTickets > 0 ? (
                  <button 
                    onClick={() => navigate(`/seat-selection/${event.id}`)}
                    className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-900/40 hover:bg-violet-500 transition-all active:scale-95"
                  >
                    Select Seats & Buy
                  </button>
               ) : (
                 <button className="w-full py-4 bg-white/5 border border-white/10 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">Sold Out</button>
               )}
               <p className="text-center text-[10px] text-gray-500 mt-4 uppercase font-bold tracking-tighter">Remaining: {event.availableTickets} Tickets</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">About the Event</h3>
                 <button 
                   onClick={() => navigate(`/events/${event.id}/memories`)}
                   className="px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                 >
                   View Gallery
                 </button>
               </div>
               <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                  <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5">
                     <span className="material-symbols-outlined text-violet-400 mb-3">calendar_today</span>
                     <p className="text-[10px] font-black text-gray-500 uppercase">Date</p>
                     <p className="text-sm font-bold text-white mt-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5">
                     <span className="material-symbols-outlined text-violet-400 mb-3">schedule</span>
                     <p className="text-[10px] font-black text-gray-500 uppercase">Time</p>
                     <p className="text-sm font-bold text-white mt-1">{event.time || "12:00 PM"}</p>
                  </div>
                  <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5">
                     <span className="material-symbols-outlined text-violet-400 mb-3">verified_user</span>
                     <p className="text-[10px] font-black text-gray-500 uppercase">Organizer</p>
                     <p className="text-sm font-bold text-white mt-1">{event.vendorName}</p>
                  </div>
               </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Event Schedule</h3>
              <div className="space-y-4">
                {[
                  { time: '13:00', task: 'Guest Arrival', sub: 'Welcome drinks and networking' },
                  { time: '14:30', task: 'Main Performance', sub: 'Cultural showcase and speeches' },
                  { time: '16:00', task: 'Buffet Service', sub: 'Premium African delicacies' },
                  { time: '18:00', task: 'Grand Finale', sub: 'Live band and dancing' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <span className="text-xs font-black text-violet-400 w-12">{item.time}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-100">{item.task}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Venue & Similar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Venue Details</h3>
              <div className="h-40 rounded-2xl bg-slate-900 border border-white/10 mb-6 overflow-hidden relative">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZId_p6pWq2FqG-K8q1Yq8R-C_R1S-L_q0-zZ-z-Z-z" className="w-full h-full object-cover opacity-30 grayscale" alt="Map" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="material-symbols-outlined text-3xl text-violet-500 mb-2">location_on</span>
                    <p className="text-[10px] font-black text-white text-center uppercase tracking-widest">{event.location.split(',')[0]}</p>
                 </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed italic">"Dress code: Smart Traditional or Formal. Strictly by Invite/Voucher only."</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Rules & Terms</p>
                  <ul className="text-[10px] text-gray-600 space-y-1">
                    <li>• No outside food or drinks</li>
                    <li>• Security check at gate is mandatory</li>
                    <li>• Digital voucher required for entry</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Similar Events */}
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Similar Events</h3>
              <div className="space-y-4">
                {similarEvents.map(sim => (
                  <div key={sim.id} onClick={() => navigate(`/events/${sim.id}`)} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0"><img src={sim.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{sim.title}</p>
                      <p className="text-[10px] text-violet-400 font-black mt-0.5">{sim.price === 0 ? 'FREE' : `FCFA ${sim.price.toLocaleString()}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TicketModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)} 
        event={event} 
        onPurchase={handlePurchase}
      />
    </Layout>
  );
}
