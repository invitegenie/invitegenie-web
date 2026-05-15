﻿import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import { MOCK_BOOKINGS } from "./Bookings";
import { getEventById as getDemoEventById } from "../services/mockData";
import { getBookingById as getDemoBookingById, getTicketById as getDemoTicketById } from "../services/ticketingService";
import { getActiveSponsorBranding, injectSponsorsIntoTicket } from "../services/eventSponsorBrandingService";
import SponsorLogoStrip from "../components/SponsorLogoStrip";
import VIPAccessBadge from "../components/VIPAccessBadge";

export default function EVoucher() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadVoucher() {
      const demoBooking = getDemoBookingById(bookingId);
      const tkt = demoBooking ? getDemoTicketById(demoBooking.ticketId) : getDemoTicketById(bookingId) || Engine.getTicketById(bookingId);
      if (tkt) {
        const evt = getDemoEventById(tkt.eventId) || await Engine.getEventById(tkt.eventId);
        if (!mounted) return;
        setTicket(tkt);
        setEvent(evt);
        setUser(Engine.getCurrentUser());
      } else {
        const mock = MOCK_BOOKINGS.find((booking) => String(booking.id) === String(bookingId));
        if (!mounted || !mock) return;
        setTicket({
          id: mock.id,
          type: mock.category,
          eventName: mock.event,
          buyerName: mock.name,
          date: mock.date,
          amount: mock.amount,
          price: mock.amount,
          qrValue: mock.voucher === "-" ? mock.id : mock.voucher,
          accessLevel: "standard",
          ticketStatus: "valid"
        });
        setEvent({
          title: mock.event,
          category: mock.category,
          location: "Cameroon",
          date: mock.date,
          image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
        });
        setUser(Engine.getCurrentUser());
      }
    }

    loadVoucher();
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invite Genie E-Voucher',
          text: `Check out my voucher for ${ticket?.eventName}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const sponsors = event ? injectSponsorsIntoTicket(ticket, getActiveSponsorBranding(event.id)) : [];

  if (!ticket || !event) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-gray-500 text-3xl">confirmation_number</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Voucher Not Found</h2>
          <button onClick={() => navigate("/bookings")} className="px-6 py-2 bg-violet-600 rounded-xl font-bold text-white">Back to Bookings</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500 print:p-0">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <button onClick={() => navigate("/bookings")} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Bookings
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => alert("Downloading PDF...")} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
          <button onClick={handleShare} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button onClick={() => window.print()} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
          <button onClick={() => alert("Added to Wallet")} className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-900/20 hover:bg-violet-500 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            Add to Wallet
          </button>
        </div>
      </div>

      {/* Main Voucher Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#141218] shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left: Cover */}
          <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
            <img 
              src={event.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"} 
              className="w-full h-full object-cover"
              alt="Event Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10">
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-[9px] font-black uppercase tracking-widest text-white">{ticket.type || ticket.ticketType} Pass</span>
                <VIPAccessBadge accessLevel={ticket.accessLevel} />
              </div>
              <h1 className="text-2xl font-semibold text-white font-heading leading-tight">{ticket.eventName}</h1>
              <p className="text-gray-300 text-xs mt-1 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {event.location}
              </p>
            </div>
          </div>

          {/* Middle: Details */}
          <div className="flex-1 p-6 lg:p-10 border-x border-white/5 flex flex-col justify-center bg-white/[0.01]">
            <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Guest Name</label>
                <p className="text-sm font-semibold text-white">{ticket.buyerName || user?.name || 'Valued Guest'}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Invoice ID</label>
                <p className="text-sm font-mono text-violet-400 font-bold tracking-tight">{ticket.id}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Date & Time</label>
                <p className="text-sm font-semibold text-white">{new Date(ticket.date).toLocaleDateString()} â€¢ {event.time || '12:00 PM'}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Category</label>
                <p className="text-sm font-semibold text-white">{event.category}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Seat / Table</label>
                <p className="text-sm font-semibold text-emerald-400">Table B12 (Gate 3)</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total Paid</label>
                <p className="text-sm font-black text-white">FCFA {Number(ticket.amount || ticket.price || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 {ticket.ticketStatus === "checked_in" ? (
                   <>
                     <span className="material-symbols-outlined text-violet-400">task_alt</span>
                     <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest">Scanned / Checked In</span>
                   </>
                 ) : (
                   <>
                     <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valid Entry Pass</span>
                   </>
                 )}
               </div>
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-violet-400">verified</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured by Invite Genie</span>
               </div>
            </div>
            
            <SponsorLogoStrip sponsors={sponsors} className="border-white/5" />
            
          </div>

          {/* Right: QR Code */}
          <div className="lg:w-1/4 p-6 lg:p-10 flex flex-col items-center justify-center bg-white/[0.01]">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Scan to Enter</p>
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${ticket.qrValue}`} 
                alt="QR Code" 
                className="w-40 h-40"
              />
            </div>
            <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed font-medium">
              Present this QR code at the gate<br />for secure check-in.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schedule & Terms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Event Schedule */}
          <div className="p-6 lg:p-8 rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-violet-400">history_toggle_off</span>
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Event Schedule</h3>
            </div>
            <div className="space-y-6 relative">
              <div className="absolute left-[31px] top-2 bottom-2 w-px bg-white/5" />
              {[
                { time: "1:00 PM", task: "Church Ceremony", desc: "Main sanctuary at Mt. Carmel" },
                { time: "3:00 PM", task: "Guest Arrival at Reception", desc: "Welcome drinks at Mountain Club Garden" },
                { time: "4:00 PM", task: "Couple Entrance", desc: "Grand arrival and traditional welcome" },
                { time: "5:00 PM", task: "Dinner Service", desc: "Full buffet with African delicacies" },
                { time: "7:00 PM", task: "Traditional Dance", desc: "Njang and Bottle Dance performance" },
                { time: "9:00 PM", task: "After Party", desc: "Live DJ set until late" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <span className="text-[10px] font-black text-violet-400 w-16 pt-0.5">{item.time}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 ring-4 ring-[#0f1014]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-200">{item.task}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-6 lg:p-8 rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-gray-400">gavel</span>
              <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Terms & Conditions</h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "Ticket is valid only for the named guest",
                "QR code can only be used once",
                "Government-issued ID may be required",
                "No unauthorized entry",
                "InviteGenie & hosts may deny entry",
                "No resale without authorization",
                "Guests must respect venue rules",
                "Photography may occur during event",
              ].map((term, i) => (
                <li key={i} className="text-xs text-gray-500 flex gap-2 leading-relaxed">
                  <span className="text-violet-400">â€¢</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Map & Prohibited */}
        <div className="lg:col-span-4 space-y-6">
          {/* Venue Map */}
          <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Venue Location</h3>
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group mb-6">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZId_p6pWq2FqG-K8q1Yq8R-C_R1S-L_q0-zZ-z-Z-z" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map Placeholder" />
               <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                 <span className="material-symbols-outlined text-3xl text-violet-500 mb-2 drop-shadow-xl animate-bounce">location_on</span>
                 <p className="text-[10px] font-black text-white text-center">Mountain Club, Buea</p>
               </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                {event.location}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  Open in Maps
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  Directions
                </button>
              </div>
            </div>
          </div>

          {/* Prohibited Items */}
          <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Prohibited Items</h3>
            <div className="grid grid-cols-3 gap-2">
              <ProhibitedItem icon="handyman" label="Weapons" />
              <ProhibitedItem icon="liquor" label="Outside Alcohol" />
              <ProhibitedItem icon="science" label="Illegal Items" />
              <ProhibitedItem icon="airplanemode_active" label="Drones" />
              <ProhibitedItem icon="work" label="Large Bags" />
              <ProhibitedItem icon="firework" label="Fireworks" />
              <ProhibitedItem icon="pets" label="Pets" />
              <ProhibitedItem icon="campaign" label="Politics" />
              <ProhibitedItem icon="wine_bar" label="Glass Bottles" />
            </div>
          </div>

          {/* Support Strip */}
          <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-600/5 flex items-center justify-between group cursor-pointer hover:bg-violet-600/10 transition-all">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400">
                 <span className="material-symbols-outlined text-[20px]">help</span>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Need help?</p>
                 <p className="text-[9px] text-gray-500 mt-1">Contact event support</p>
               </div>
             </div>
             <span className="material-symbols-outlined text-gray-600 group-hover:text-white transition-colors">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Floating Magic Tools Trigger */}
      <div className="fixed bottom-28 right-8 z-[60] print:hidden">
         <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-xl animate-pulse" />
         <button onClick={() => navigate("/dashboard")} className="relative w-14 h-14 rounded-full bg-violet-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[28px]">home</span>
         </button>
      </div>
      </div>
    </Layout>
  );
}

function ProhibitedItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all group">
      <span className="material-symbols-outlined text-gray-600 group-hover:text-rose-400 transition-colors text-[20px] mb-2">{icon}</span>
      <span className="text-[8px] font-bold text-gray-500 group-hover:text-gray-300 text-center uppercase tracking-tighter leading-tight">{label}</span>
    </div>
  );
}
