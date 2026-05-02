﻿import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getMarketplaceProviders } from "../services/mockData";
import { getMarketplaceOrdersForSeller } from "../services/ticketingService";
import { hasPermission } from "../services/roles";
import { useSearch } from "../contexts/SearchContext";

const categories = ["All", "DJ", "Caterer", "Drink Supplier", "Decorator", "Photographer", "Videographer", "Tasker", "Errand Runner", "Delivery Service", "Makeup Artist", "Venue", "Security", "Usher", "Supermarket Shopper"];

export default function Marketplace() {
  const navigate = useNavigate();
  const { currentUser, profile, role } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const listings = getMarketplaceProviders();
  const canCreate = hasPermission(profile || role, "create_marketplace_listing");
  const myOrders = getMarketplaceOrdersForSeller(currentUser?.id);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return listings
      .filter((listing) => {
        const haystack = [listing.businessName, listing.title, listing.category, listing.location, listing.description, ...(listing.tags || [])].join(" ").toLowerCase();
        const matchesSearch = !q || haystack.includes(q);
        const matchesCategory = category === "All" || listing.category === category || (category === "Tasker" && listing.type === "task");
        const matchesType = type === "All" || listing.type === type;
        return listing.status !== "draft" && matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => {
        if (sort === "Top Rated") return Number(b.rating || 0) - Number(a.rating || 0);
        if (sort === "Price Low") return Number(a.price || a.startingPrice || 0) - Number(b.price || b.startingPrice || 0);
        return Number(b.pro) - Number(a.pro) || Number(b.completedJobs || 0) - Number(a.completedJobs || 0);
      });
  }, [listings, searchQuery, category, type, sort]);

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1500px] space-y-6 pb-24">
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-md backdrop-blur-xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Marketplace</p>
              <h1 className="mt-2 text-3xl font-black text-white">Vendors, Taskers and Services</h1>
              <p className="mt-2 text-sm text-slate-400">Book professionals, buy products, and request quotes in FCFA.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[260px_180px_150px_150px_auto]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500">search</span>
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search services..." className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400/50" />
              </div>
              <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 outline-none">
                {["All", "service", "product", "task"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 outline-none">
                {["Recommended", "Top Rated", "Price Low"].map((item) => <option key={item}>{item}</option>)}
              </select>
              {canCreate ? (
                <button onClick={() => navigate("/marketplace/new")} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">
                  Create Listing
                </button>
              ) : null}
            </div>
          </div>
        </header>

        {/* Sponsored Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950">Sponsored Partner</span>
              <h2 className="mt-4 text-3xl font-black text-white">Adjoa's Creations</h2>
              <p className="mt-2 text-sm text-slate-300 max-w-lg">Premium event decoration and floral design in Douala. Book now and get a 10% discount on all luxury packages.</p>
            </div>
            <button onClick={() => navigate("/marketplace/list-prestige-decor")} className="shrink-0 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
              View Profile
            </button>
          </div>
        </section>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${category === item ? "bg-violet-600 text-white shadow-md shadow-violet-900/30" : "bg-[#111827] border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/50"}`}>
              {item}
            </button>
          ))}
        </div>

        {(role === "vendor" || role === "tasker") ? (
          <section className="grid gap-4 md:grid-cols-3">
            <Metric label="My Listings" value={listings.filter((listing) => String(listing.ownerId) === String(currentUser?.id)).length} />
            <Metric label="Orders" value={myOrders.length} />
            <Metric label="Estimated Earnings" value={`FCFA ${myOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0).toLocaleString()}`} />
          </section>
        ) : null}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((listing) => (
            <button key={listing.id} onClick={() => navigate(`/marketplace/${listing.id}`)} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111827] text-left shadow-lg transition hover:-translate-y-0.5 hover:border-violet-400/40">
              <div className="relative h-48 overflow-hidden">
                <img src={listing.image} alt={listing.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">{listing.category}</span>
                  {listing.pro ? <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-100 backdrop-blur">Pro</span> : null}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    Contact Provider
                  </span>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-2 min-h-[3.5rem] text-xl font-black text-white">{listing.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-300">{listing.businessName}</p>
                  <p className="mt-1 text-xs text-slate-500">{listing.location}</p>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-slate-400">{listing.description}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">From</p>
                    <p className="text-sm font-black text-emerald-300">FCFA {Number(listing.price || listing.startingPrice || 0).toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-bold text-amber-300">star {listing.rating}</p>
                </div>
              </div>
            </button>
          ))}
        </section>
      </div>
    </Layout>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
