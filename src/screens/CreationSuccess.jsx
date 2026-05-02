import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import Icon from "../components/Icon";

export default function CreationSuccess() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const allEvents = useEngineCollection(Engine.KEYS.EVENTS);
  
  const event = useMemo(() => 
    allEvents.find((e) => e.id.toString() === eventId?.toString()), 
  [allEvents, eventId]);

  if (!event) return null;

  const shareUrl = `${window.location.origin}/events/${event.id}`;
  const shareMessage = `You're invited to ${event.title}! Manifest your presence here: ${shareUrl}`;

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const handleShareGmail = () => {
    const subject = encodeURIComponent(`Invitation: ${event.title}`);
    const body = encodeURIComponent(shareMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  // Using an external QR API with brand purple color
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=8b5cf6&bgcolor=111827`;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-6 space-y-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] shadow-[0_0_50px_rgba(139,92,246,0.5)] animate-bounce">
            <Icon name="check" className="text-white text-5xl font-black" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Event Manifested!</h1>
          <p className="text-[#9CA3AF] text-sm uppercase font-bold tracking-widest">The spirits have aligned. Your event is live.</p>
        </div>

        {/* Event Card Summary */}
        <div className="bg-[#111827] rounded-[2.5rem] border border-[#2A3342] shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-transparent to-[#22C55E]/10" />
          
          <div className="relative p-8 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            {/* QR Section */}
            <div className="shrink-0 space-y-4">
              <div className="p-4 bg-[#0B0F19] rounded-[2rem] border border-[#2A3342] shadow-inner inline-block">
                <img src={qrCodeUrl} alt="Event QR" className="w-40 h-40 rounded-xl" />
              </div>
              <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Scan to Preview</p>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase truncate">{event.title}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Icon name="calendar_today" className="text-[#A78BFA] text-sm" /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><Icon name="location_on" className="text-[#22C55E] text-sm" /> {event.location}</span>
                </div>
              </div>

              {/* Share Tools */}
              <div className="pt-6 border-t border-[#2A3342] space-y-4">
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Share Invitation</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button 
                    onClick={handleShareWhatsApp}
                    className="flex items-center gap-3 px-6 py-3 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#22C55E]/20 transition-all"
                  >
                    <Icon name="chat" className="text-lg" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={handleShareGmail}
                    className="flex items-center gap-3 px-6 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#EF4444]/20 transition-all"
                  >
                    <Icon name="mail" className="text-lg" />
                    Gmail
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert("Invitation link copied to clipboard!");
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <Icon name="content_copy" className="text-lg" />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex-1 py-4 bg-[#1F2937] border border-[#2A3342] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#2A3342] transition-all"
          >
            View Event Details
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex-1 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
