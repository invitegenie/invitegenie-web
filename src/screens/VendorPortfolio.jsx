import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getProviderById, getMarketplaceProviders } from "../services/mockData";
import { hasPermission } from "../services/roles";

export default function VendorPortfolio() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  
  // If providerId is passed, it's public viewing. Otherwise, it's the vendor's own portfolio.
  const isOwnerView = !providerId;
  const canManage = isOwnerView && hasPermission(profile, "manage_vendor_portfolio");
  
  const listing = isOwnerView 
    ? getMarketplaceProviders().find(p => String(p.ownerId) === String(currentUser?.id)) 
    : getProviderById(providerId);

  const [filter, setFilter] = useState("All");
  
  if (!listing) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <Icon name="cases" className="text-5xl text-slate-600 mb-4" />
          <h1 className="text-2xl font-black text-white">Portfolio Not Found</h1>
          <p className="text-slate-400 mt-2">Create a marketplace listing to manage your portfolio.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Go to Marketplace</button>
        </div>
      </Layout>
    );
  }

  const images = [
    { id: 1, url: listing.image, category: listing.category },
    { id: 2, url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800", category: "Decor" },
    { id: 3, url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800", category: "Catering" },
    { id: 4, url: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=800", category: "Photography" },
    { id: 5, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", category: "Event" },
  ];

  const filteredImages = filter === "All" ? images : images.filter(img => img.category === filter);
  const categories = ["All", ...new Set(images.map(img => img.category))];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8 pb-32 pt-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Vendor Portfolio</p>
            <h1 className="mt-2 text-3xl font-black text-white">{listing.businessName}</h1>
            <p className="mt-2 text-sm text-slate-400">Showcasing previous work and event highlights.</p>
          </div>
          {!isOwnerView && (
            <button onClick={() => navigate(`/marketplace/${listing.id}`)} className="w-fit rounded-xl border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5">
              Back to Profile
            </button>
          )}
        </header>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
                filter === cat ? "bg-violet-600 text-white" : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredImages.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
              <img src={img.url} alt="Portfolio item" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {canManage && (
                <button className="absolute right-3 top-3 rounded-lg bg-red-500/80 p-2 text-white opacity-0 backdrop-blur transition-opacity hover:bg-red-500 group-hover:opacity-100">
                  <Icon name="delete" className="text-sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}