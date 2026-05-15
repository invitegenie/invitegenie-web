﻿import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getEvents } from "../services/mockData";
import { ALL_EVENT_STORAGE_KEYS } from "../services/eventStoreService";
import { hasPermission } from "../services/roles";
import { useSearch } from "../contexts/SearchContext";
import { getVisibleEventsForUser } from "../services/eventVisibilityService";
import { isUserApproved, hasPendingRequest, isUserInvited } from "../services/eventAccessService";

const categories = ["All", "Weddings", "Concerts", "Corporate", "Cultural", "Fashion"];

export default function Events() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, profile, role } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Soonest");
  const [events, setEvents] = useState(() => getEvents());
  const canCreate = hasPermission(profile || role, "create_event");
  const createdEventId = location.state?.createdEventId;

  useEffect(() => {
    const refreshEvents = (event) => {
      const changedKey = event?.detail?.key || event?.key;
      if (changedKey && !ALL_EVENT_STORAGE_KEYS.includes(changedKey)) return;
      setEvents(getEvents());
    };

    window.addEventListener("invitegenie:data-change", refreshEvents);
    window.addEventListener("storage", refreshEvents);
    return () => {
      window.removeEventListener("invitegenie:data-change", refreshEvents);
      window.removeEventListener("storage", refreshEvents);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    // Filter out private/hidden events based on visibility rules
    const visibleEvents = getVisibleEventsForUser(currentUser || profile, events);
    
    return visibleEvents
      .filter((event) => {
        const normalizedCategory = String(event.category || "").toLowerCase().replace(/s$/, "");
        const activeCategory = String(category || "").toLowerCase().replace(/s$/, "");
        const matchesCategory = category === "All" || normalizedCategory === activeCategory;
        const matchesSearch = !q || [event.title, event.location, event.vendorName, event.category].join(" ").toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "Price Low") return Number(a.price || 0) - Number(b.price || 0);
        if (sort === "Popular") return Number(b.ticketsSold || 0) - Number(a.ticketsSold || 0);
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [events, searchQuery, category, sort, currentUser, profile]);

  const getEventCTA = (event) => {
    const user = currentUser || profile;
    if (event.availableTickets <= 0) return "Sold Out";
    if (event.visibility === "vip_request") {
      if (isUserApproved(event.id, user)) return "Buy VIP Ticket";
      if (hasPendingRequest(event.id, user)) return "Request Pending";
      return "Request Access";
    }
    if (event.visibility === "invite_only") {
      return "View Invitation";
    }
    return Number(event.price || 0) > 0 ? "Buy Ticket" : "Register";
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1500px] space-y-6 pb-24">
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-md backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Events</p>
              <h1 className="mt-2 text-3xl font-black text-white">African Event Experiences</h1>
              <p className="mt-2 text-sm text-slate-400">Browse events, buy tickets, then post memories after attending.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[260px_150px_150px_auto]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search events..." className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400/50" />
              </div>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 outline-none">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 outline-none">
                {["Soonest", "Popular", "Price Low"].map((item) => <option key={item}>{item}</option>)}
              </select>
              {canCreate ? (
                <button onClick={() => navigate("/events/new")} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">
                  Create Event
                </button>
              ) : null}
            </div>
          </div>
        </header>

        {createdEventId ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100">
            Event created successfully. It is now live in your events list.
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <button key={event.id} onClick={() => navigate(`/events/${event.id}`)} className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111827] text-left shadow-lg transition hover:-translate-y-0.5 hover:border-violet-400/40">
              <div className="relative h-48 overflow-hidden">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">{event.category}</div>
                
                {event.visibility && event.visibility !== "public" && (
                  <div className="absolute right-3 top-3 rounded-full border border-amber-300/30 bg-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-100 backdrop-blur">
                    {event.visibility.replace("_", " ")}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col space-y-4 p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">{formatDate(event.date)} - {event.time}</p>
                  <h2 className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-black text-white">{event.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{event.location}</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-950">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{ width: `${Math.min(100, Math.round((event.ticketsSold / event.totalTickets) * 100))}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">From</p>
                    <p className="text-sm font-black text-emerald-300">FCFA {Number(event.price || 0).toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400">{event.availableTickets} left</p>
                </div>
                <div className="pt-3 border-t border-white/5 mt-auto">
                  <div className={`w-full rounded-xl py-3 text-center text-xs font-black uppercase tracking-widest transition ${event.availableTickets <= 0 ? "bg-slate-800 text-slate-500" : "bg-white/5 text-white group-hover:bg-violet-600"}`}>
                    {getEventCTA(event)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </section>
      </div>
    </Layout>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
