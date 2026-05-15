﻿import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getTicketsByUser } from "../services/ticketingService";
import { getActiveSponsorBranding, injectSponsorsIntoTicket } from "../services/eventSponsorBrandingService";
import VIPAccessBadge from "../components/VIPAccessBadge";

export default function MyTickets() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const tickets = getTicketsByUser(currentUser?.id);

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-5xl space-y-7 pb-24">
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-md">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Tickets</p>
          <h1 className="mt-3 text-3xl font-black text-white">My Tickets</h1>
          <p className="mt-2 text-sm text-slate-400">Every ticket includes a QR code and local voucher route.</p>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-lg">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white">{ticket.eventName}</h2>
                    <p className="mt-1 text-xs font-black uppercase tracking-widest text-violet-300">{ticket.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      ticket.ticketStatus === 'checked_in' ? 'bg-violet-600 text-white' : 'bg-emerald-400/10 text-emerald-300'
                    }`}>
                      {ticket.ticketStatus === 'checked_in' ? "Checked In" : ticket.ticketStatus || ticket.status}
                    </span>
                    <VIPAccessBadge accessLevel={ticket.accessLevel} />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Info label="Buyer" value={ticket.buyerName} />
                  <Info label="Type" value={ticket.ticketType || ticket.type} />
                  <Info label="Quantity" value={ticket.quantity} />
                  <Info label="Paid" value={`FCFA ${Number(ticket.amount || ticket.price || 0).toLocaleString()}`} />
                </div>
                
                {/* Ticket Sponsors Strip */}
                {(() => {
                  const sponsors = injectSponsorsIntoTicket(ticket, getActiveSponsorBranding(ticket.eventId));
                  if (sponsors.length === 0) return null;
                  return (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">Sponsored By</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {sponsors.slice(0, 3).map((s) => (
                          s.sponsorLogo ? <img key={s.id} src={s.sponsorLogo} alt={s.sponsorName} className="h-4 sm:h-5 object-contain opacity-60 grayscale hover:grayscale-0 transition" title={s.sponsorName} /> : <span key={s.id} className="text-[9px] font-bold text-slate-400">{s.sponsorName}</span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                
              </div>
              <div className="grid gap-4 border-t border-white/10 bg-slate-950/50 p-5 sm:grid-cols-[160px_1fr]">
                <img src={ticket.qrCodeUrl} alt={`${ticket.eventName} QR`} className="mx-auto h-40 w-40 rounded-2xl bg-white p-3" />
                <div className="flex flex-col justify-center gap-3">
                  <button onClick={() => navigate(`/bookings/${ticket.bookingId || ticket.id}/voucher`)} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">View Voucher</button>
                  <button onClick={() => navigate(`/events/${ticket.eventId}`)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-200 hover:bg-white/[0.08]">View Event</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {!tickets.length ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-700">confirmation_number</span>
            <p className="mt-4 font-bold text-white">No tickets purchased yet</p>
            <button onClick={() => navigate("/events")} className="mt-5 rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Browse Events</button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}
