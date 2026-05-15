import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEventById } from "../services/mockData";
import { hasValidTicket } from "../services/ticketingService";
import { useAuth } from "../auth/AuthContext";
import Icon from "../components/Icon";

export default function EventLive() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  
  const event = getEventById(eventId);
  const user = currentUser || profile;
  
  const isHost = String(event?.hostId) === String(user?.id);
  const hasTicket = hasValidTicket(user?.id, event?.id);
  const canAccess = isHost || hasTicket;

  if (!event || !canAccess) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-rose-400">lock</span>
          <h1 className="text-2xl font-black text-white">Live Access Restricted</h1>
          <p className="mt-2 text-slate-400">You must have a valid ticket to view the live event dashboard.</p>
          <button onClick={() => navigate(`/events/${eventId}`)} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Event Details</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <header className="rounded-[2rem] border border-white/10 bg-[#111827] p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 mb-4 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live Now
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{event.title}</h1>
            <p className="mt-3 text-slate-300">Welcome to the live attendee experience.</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex flex-col items-center justify-center min-h-[250px] text-center">
            <Icon name="campaign" className="text-4xl text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Announcements</h3>
            <p className="text-sm text-slate-400">Host updates and important alerts will appear here during the event.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex flex-col items-center justify-center min-h-[250px] text-center">
            <Icon name="photo_library" className="text-4xl text-violet-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Memory Wall</h3>
            <p className="text-sm text-slate-400">Live photos and posts from attendees.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 flex flex-col items-center justify-center min-h-[250px] text-center md:col-span-2 lg:col-span-1">
            <Icon name="schedule" className="text-4xl text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Live Timeline</h3>
            <p className="text-sm text-slate-400">Follow the event agenda in real time.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}