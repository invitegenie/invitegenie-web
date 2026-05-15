﻿import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import SmartVendorRecommendations from "../components/SmartVendorRecommendations";
import { useAuth } from "../auth/AuthContext";
import { getEventById } from "../services/mockData";
import { getEventMemories } from "../services/socialService";
import { getTicketOptions, hasValidTicket } from "../services/ticketingService";
import { hasPermission } from "../services/roles";
import { canUserViewEvent } from "../services/eventVisibilityService";
import { requestEventAccess, isUserApproved, hasPendingRequest, isUserInvited } from "../services/eventAccessService";
import {
  buildVendorRecommendationInputFromEvent,
  recommendVendors,
} from "../services/vendorRecommendationEngine";
import { getBookedVendorsForEvent } from "../services/eventVendorService";
import { getSponsorsForEvent } from "../services/eventSponsorService";
import EventBookedVendors from "../components/EventBookedVendors";
import EventSponsors from "../components/EventSponsors";
import SponsorEventModal from "../components/SponsorEventModal";

export default function EventDetails() {
  const { eventId, id } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile, role } = useAuth();
  const event = getEventById(eventId || id);
  const [ticketType, setTicketType] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [buyer, setBuyer] = useState({
    name: currentUser?.name || currentUser?.full_name || profile?.full_name || "",
    email: currentUser?.email || "",
    phone: profile?.phone || "",
  });

  const memories = useMemo(() => (event ? getEventMemories(event.id, "Most Liked").slice(0, 4) : []), [event]);
  const smartRecommendations = useMemo(() => {
    if (!event) return [];
    if (Array.isArray(event.recommendations) && event.recommendations.length) return event.recommendations;
    return recommendVendors(buildVendorRecommendationInputFromEvent(event), { limit: 8 });
  }, [event]);
  const options = getTicketOptions(event);
  const selectedOption = options.find((option) => option.type === ticketType) || options[0];
  const total = Number(selectedOption?.price || 0) * Number(quantity || 1);
  const canBuy = hasPermission(profile || role, "buy_ticket");

  // Access controls
  const user = currentUser || profile;
  const canView = canUserViewEvent(user, event);
  const hasTicket = hasValidTicket(user?.id, event?.id);
  const isHost = String(event?.hostId) === String(user?.id);
  
  const visibility = event?.visibility || "public";
  const isVipRequest = visibility === "vip_request";
  const isInviteOnly = visibility === "invite_only";
  
  const approved = isUserApproved(event?.id, user);
  const pending = hasPendingRequest(event?.id, user);
  const invited = isUserInvited(event, user);

  const bookedVendors = getBookedVendorsForEvent(event?.id);
  const sponsors = getSponsorsForEvent(event?.id);
  const approvedSponsors = sponsors.filter(s => s.status === "approved");

  if (!event) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-violet-400">event_busy</span>
          <h1 className="text-2xl font-black text-white">Event Not Found</h1>
          <button onClick={() => navigate("/events")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Back to Events</button>
        </div>
      </Layout>
    );
  }

  if (!canView) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-rose-400">lock</span>
          <h1 className="text-2xl font-black text-white">This event is private</h1>
          <p className="mt-2 text-slate-400">You must be invited or have a valid ticket to view this event.</p>
          <button onClick={() => navigate("/events")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Back to Events</button>
        </div>
      </Layout>
    );
  }

  const startCheckout = () => {
    if (!canBuy) return;
    const payload = {
      kind: "event_ticket",
      eventId: event.id,
      ticketType,
      quantity,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      buyerPhone: buyer.phone,
      amount: total,
    };
    localStorage.setItem("demo_pending_checkout", JSON.stringify(payload));
    navigate(`/events/${event.id}/checkout`);
  };

  const handleRequestAccess = () => {
    if (!user) return navigate("/login");
    if (!requestMessage.trim()) return alert("Please include a brief message for the host.");
    requestEventAccess(event.id, user, requestMessage);
    setIsRequestModalOpen(false);
    setRequestMessage("");
    alert("Access request sent to host.");
  };

  const shareEvent = async () => {
    const url = `${window.location.origin}/shared/event/${event.id}`;
    if (navigator.share) await navigator.share({ title: event.title, text: `View ${event.title} on InviteGenie`, url });
    else await navigator.clipboard.writeText(url);
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1400px] space-y-8 pb-24">
        <section className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
          <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
          <div className="absolute left-5 top-5 flex gap-2">
            <button onClick={() => navigate("/events")} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white backdrop-blur hover:bg-white/10">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button onClick={shareEvent} className="rounded-2xl border border-white/10 bg-black/40 p-3 text-white backdrop-blur hover:bg-white/10">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button onClick={() => navigate(`/events/${event.id}/website`)} className="rounded-2xl border border-amber-300/30 bg-amber-300/15 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-100 backdrop-blur hover:bg-amber-300/25">
              Website
            </button>
            <button onClick={() => navigate(`/ai-planner?eventId=${event.id}`)} className="rounded-2xl border border-violet-300/30 bg-violet-400/15 px-4 py-3 text-xs font-black uppercase tracking-widest text-violet-100 backdrop-blur hover:bg-violet-400/25">
              AI Planning
            </button>
            {isHost && (
              <button onClick={() => navigate(`/events/${event.id}/operations`)} className="rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-3 text-xs font-black uppercase tracking-widest text-emerald-100 backdrop-blur hover:bg-emerald-400/25">
                Host Dashboard
              </button>
            )}
          </div>
          <div className="absolute bottom-8 left-6 right-6 lg:left-10 lg:right-10">
            <p className="mb-4 w-fit rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">{event.category}</p>
            <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base text-slate-300">{event.description}</p>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <main className="space-y-8">
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <InfoCard icon="calendar_today" label="Date" value={formatDate(event.date)} />
              <InfoCard icon="schedule" label="Time" value={event.time} />
              <InfoCard icon="location_on" label="Location" value={event.location} />
              <InfoCard icon="confirmation_number" label="Available" value={`${event.availableTickets} tickets`} />
            </section>

            {isHost && (
              <SmartVendorRecommendations
                event={buildVendorRecommendationInputFromEvent(event)}
                recommendations={smartRecommendations}
                title="Recommended Vendors for This Event"
                subtitle="Ranked by fit, availability, location, capacity, and style"
              />
            )}

            <EventBookedVendors vendors={bookedVendors} />
            <EventSponsors sponsors={approvedSponsors} onSponsorClick={() => setIsSponsorModalOpen(true)} />

            <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Event Memories</h2>
                  <p className="mt-1 text-sm text-slate-500">Top memories from guests who attended.</p>
                </div>
                <button onClick={() => navigate(`/events/${event.id}/memories`)} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {memories.map((memory) => (
                  <button key={memory.id} onClick={() => navigate(`/events/${event.id}/memories`)} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-left">
                    <div className="aspect-square overflow-hidden">
                      <img src={memory.image} alt={memory.caption} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-xs text-slate-300">{memory.caption}</p>
                      <p className="mt-2 text-[10px] font-bold text-violet-300">{memory.likesCount} likes</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>

          <aside className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl xl:sticky xl:top-6 xl:self-start">
            <h2 className="text-xl font-black text-white">
              {hasTicket ? "You're Going!" : "Event Access"}
            </h2>
            
            {isVipRequest && !approved && !hasTicket && (
              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm text-amber-200">This event requires host approval to book tickets.</p>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {options.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setTicketType(option.type)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${ticketType === option.type ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-slate-950/70 hover:border-violet-400/40"}`}
                >
                  <span>
                    <span className="block text-sm font-black text-white">{option.type}</span>
                    <span className="text-xs text-slate-500">{option.available} available</span>
                  </span>
                  <span className="text-sm font-black text-emerald-300">FCFA {Number(option.price || 0).toLocaleString()}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-[1fr_120px] gap-3">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buyer Name</span>
                <input value={buyer.name} onChange={(event) => setBuyer({ ...buyer, name: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Qty</span>
                <input type="number" min="1" max={event.availableTickets} value={quantity} onChange={(change) => setQuantity(Math.max(1, Number(change.target.value || 1)))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
              </label>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <input value={buyer.email} onChange={(change) => setBuyer({ ...buyer, email: change.target.value })} placeholder="Email" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
              <input value={buyer.phone} onChange={(change) => setBuyer({ ...buyer, phone: change.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-200">Total</span>
                <span className="text-2xl font-black text-white">FCFA {total.toLocaleString()}</span>
              </div>
            </div>

            {!canBuy ? <p className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs font-semibold text-amber-100">This role does not have ticket purchase permission.</p> : null}

            <div className="mt-5">
              {hasTicket ? (
                <button onClick={() => navigate(`/events/${event.id}/live`)} className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-500">
                  Follow Live Event
                </button>
              ) : isVipRequest && !approved ? (
                <button 
                  disabled={pending} 
                  onClick={() => setIsRequestModalOpen(true)} 
                  className="w-full rounded-2xl bg-amber-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-amber-500 disabled:opacity-50"
                >
                  {pending ? "Request Pending" : "Request Access"}
                </button>
              ) : isInviteOnly && !invited ? (
                <button disabled className="w-full rounded-2xl bg-slate-800 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                  Not Invited
                </button>
              ) : (
                <button disabled={!canBuy || event.availableTickets <= 0} onClick={startCheckout} className="w-full rounded-2xl bg-violet-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
                  {event.availableTickets <= 0 ? "Sold Out" : Number(selectedOption?.price || 0) > 0 ? "Buy Ticket" : "Register For Free"}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* VIP Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white">Request Access</h3>
            <p className="mt-2 text-sm text-slate-400">Include a brief message to the host explaining why you'd like to attend {event.title}.</p>
            
            <textarea 
              value={requestMessage}
              onChange={e => setRequestMessage(e.target.value)}
              placeholder="Hi, I'm..."
              rows={4}
              className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/50"
            />
            
            <div className="mt-6 flex gap-3">
              <button onClick={() => setIsRequestModalOpen(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5">
                Cancel
              </button>
              <button onClick={handleRequestAccess} className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-amber-400">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
      <SponsorEventModal isOpen={isSponsorModalOpen} onClose={() => setIsSponsorModalOpen(false)} event={event} user={user} />
    </Layout>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <span className="material-symbols-outlined text-violet-300">{icon}</span>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
