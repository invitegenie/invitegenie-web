﻿﻿﻿import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { addProviderRequest, getProviderById } from "../services/mockData";
import * as Engine from "../auth/coreEngine";
import { getStorefrontProducts, STOREFRONT_STORAGE_KEYS } from "../services/marketplaceStorefrontService";
import AvailabilityBadge from "../components/AvailabilityBadge";
import { calculateAvailabilityStatus } from "../services/availabilityService";
import { sendMessage } from "../services/messagingService";

function notificationId(prefix = "notif") {
  return `${prefix}-${Date.now()}`;
}

export default function MarketplaceDetails() {
  const { providerId, listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  
  const mockListing = getProviderById(providerId || listingId);
  const engineListing = (Engine.getCollection(Engine.KEYS.VENDORS) || []).find(v => String(v.id) === String(providerId || listingId));
  const listing = mockListing || engineListing;

  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState("");
  const storefrontProducts = listing ? getStorefrontProducts(listing.id) : [];
  const [availabilityStatus, setAvailabilityStatus] = useState('available');

  useEffect(() => {
    const loadAvailability = async () => {
      if (listing?.id) {
        const s = await calculateAvailabilityStatus(listing.id, new Date().toISOString().slice(0, 10));
        setAvailabilityStatus(s);
      }
    };
    loadAvailability();
  }, [listing?.id]);

  if (!listing) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-violet-400">storefront</span>
          <h1 className="text-2xl font-black text-white">Listing Not Found</h1>
          <button onClick={() => navigate("/marketplace")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Back to Marketplace</button>
        </div>
      </Layout>
    );
  }

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const requestQuote = () => {
    addProviderRequest({
      providerId: listing.id,
      sellerId: listing.ownerId,
      buyerId: currentUser.id,
      buyerName: profile?.full_name || currentUser.name,
      providerName: listing.businessName,
      serviceNeeded: listing.category,
      budget: listing.price || listing.startingPrice,
      description: `Quote requested for ${listing.title}`,
    });
    showToast("Quote request sent.");

    const existingNotifs = Engine.getCollection(Engine.KEYS.NOTIFICATIONS) || [];
    Engine.save(Engine.KEYS.NOTIFICATIONS, [
      {
        id: notificationId(),
        userId: listing.ownerId || listing.sellerId,
        type: "vendor",
        title: "New Quote Request",
        message: `${profile?.full_name || currentUser?.name || "A user"} requested a quote for ${listing.title}.`,
        path: "/dashboard?panel=quotes",
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...existingNotifs
    ]);
  };

  const startCheckout = (mode) => {
    localStorage.setItem(
      "demo_pending_checkout",
      JSON.stringify({
        kind: "marketplace_order",
        mode,
        listingId: listing.id,
        amount: listing.price || listing.startingPrice,
      })
    );
    navigate("/checkout");
  };

  const bookStorefrontProduct = (product) => {
    const ownerId = product.ownerId || listing.ownerId || listing.userId || listing.sellerId;
    if (currentUser?.id && ownerId && String(currentUser.id) === String(ownerId)) {
      showToast("You cannot book your own service.");
      return;
    }
    localStorage.setItem(
      STOREFRONT_STORAGE_KEYS.selectedItem,
      JSON.stringify({
        providerId: listing.id,
        productId: product.id,
        ownerId,
        title: product.title,
        category: product.category,
        type: product.type,
        price: product.price,
        currency: product.currency,
        duration: product.duration,
        image: product.image,
        description: product.description,
        included: product.included,
      })
    );
    navigate(`/marketplace/${listing.id}/book?product=${product.id}`);
  };

  const shareListing = async () => {
    const url = `${window.location.origin}/marketplace/${listing.id}`;
    if (navigator.share) await navigator.share({ title: listing.title, text: listing.description, url });
    else await navigator.clipboard.writeText(url);
    showToast("Listing link ready.");
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1300px] space-y-6 pb-24">
        {toast ? <div className="fixed right-6 top-6 z-[200] rounded-2xl border border-violet-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div> : null}

        <section className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
          <img src={listing.image} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
          <button onClick={() => navigate("/marketplace")} className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 p-3 text-white backdrop-blur hover:bg-white/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="absolute bottom-8 left-6 right-6 lg:left-10 lg:right-10">
            <p className="mb-4 w-fit rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{listing.category}</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">{listing.title}</h1>
            <p className="mt-3 text-lg font-semibold text-slate-200">{listing.businessName} - {listing.location}</p>
            <div className="mt-2 flex items-center gap-4">
              <AvailabilityBadge status={availabilityStatus} label={
                availabilityStatus === 'available' ? 'Available Today' : availabilityStatus === 'almost_booked' ? 'Almost Booked' : 'Unavailable Today'
              } />
              <a href={`/marketplace/${listing.id}/availability`} className="text-violet-400 hover:underline text-xs font-bold">View Availability</a>
            </div>
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-6 no-scrollbar">
          {["overview", "portfolio", "reviews", "contact"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                activeTab === tab ? "border-violet-500 text-violet-400" : "border-transparent text-slate-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-6">
            {activeTab === "overview" && (
              <>
                <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-lg">
                  <h2 className="text-xl font-black text-white">About this listing</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{listing.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(listing.tags || []).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">{tag}</span>
                    ))}
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                  {(listing.packages || []).map((pkg) => (
                    <article key={pkg.name} className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg transition-transform hover:-translate-y-1">
                      <h3 className="font-black text-white">{pkg.name}</h3>
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">{pkg.description}</p>
                      <p className="mt-4 text-lg font-black text-emerald-300">FCFA {Number(pkg.price || 0).toLocaleString()}</p>
                    </article>
                  ))}
                </section>
              </>
            )}
            
            {activeTab === "portfolio" && (
              <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-white">Portfolio</h2>
                  <button onClick={() => navigate(`/marketplace/${listing.id}/portfolio`)} className="text-xs font-bold text-violet-400 hover:text-violet-300">View Full Gallery</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[listing.image, listing.image, listing.image, listing.image].map((img, i) => (
                    <img key={i} src={img} alt="Portfolio item" className="aspect-video rounded-2xl object-cover" />
                  ))}
                </div>
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-white">Client Reviews</h2>
                  <button onClick={() => navigate(`/marketplace/${listing.id}/review`)} className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20">Write a Review</button>
                </div>
                <div className="space-y-4">
                  {(listing.reviewsList || []).map((rev, i) => (
                    <div key={i} className="rounded-2xl border border-white/5 bg-slate-900/50 p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">{rev.userName}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{rev.date}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          {rev.rating}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "contact" && (
              <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-lg">
                <h2 className="text-xl font-black text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300"><span className="material-symbols-outlined text-violet-400">business</span> Elegance Catering & Events</div>
                  <div className="flex items-center gap-4 text-slate-300"><span className="material-symbols-outlined text-violet-400">location_on</span> Akwa, Douala, Cameroon</div>
                  <div className="flex items-center gap-4 text-slate-300"><span className="material-symbols-outlined text-violet-400">call</span> +237 6 70 00 00 00</div>
                  <div className="flex items-center gap-4 text-slate-300"><span className="material-symbols-outlined text-violet-400">mail</span> contact@elegance.cm</div>
                </div>
              </section>
            )}
          </main>

          <aside className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl xl:self-start">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Starting at</p>
            <p className="mt-2 text-3xl font-black text-white">FCFA {Number(listing.price || listing.startingPrice || 0).toLocaleString()}</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Mini label="Rating" value={listing.rating} />
              <Mini label="Reviews" value={listing.reviews} />
              <Mini label="Jobs" value={listing.completedJobs} />
            </div>
            <img src={listing.qrCodeUrl} alt={`${listing.title} QR`} className="mx-auto mt-6 h-40 w-40 rounded-2xl bg-white p-3" />
            <div className="mt-6 space-y-3">
              <button onClick={requestQuote} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/[0.08]">Request Quote</button>
              <button onClick={() => navigate(`/marketplace/${listing.id}/storefront`)} className="w-full rounded-2xl bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:opacity-90">View Storefront</button>
              <button onClick={() => navigate(`/marketplace/${listing.id}/book`)} className="w-full rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">Book Service</button>
              {["product", "item"].includes(String(listing.type).toLowerCase()) ? (
                <button onClick={() => startCheckout("buy")} className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-emerald-400">Buy Item</button>
              ) : null}
              <button onClick={() => showToast("Vendor messaging is saved as a local demo interaction.")} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/[0.08]">Message Vendor</button>
              <button onClick={shareListing} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/[0.08]">Share Listing</button>
            </div>
          </aside>
        </div>

        {activeTab === "overview" && storefrontProducts.length ? (
          <section className="rounded-3xl border border-amber-500/20 bg-[#11100d] p-6 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Storefront</p>
                <h2 className="mt-2 text-2xl font-black text-white">Featured products and services</h2>
              </div>
              <button onClick={() => navigate(`/marketplace/${listing.id}/storefront`)} className="w-fit rounded-2xl border border-amber-400/30 px-5 py-3 text-xs font-black uppercase tracking-widest text-amber-100">
                Open Full Storefront
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {storefrontProducts.slice(0, 3).map((product) => (
                <article key={product.id} className="overflow-hidden rounded-3xl border border-white/10 bg-black/25">
                  <img src={product.image} alt={product.title} className="h-40 w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-black">{product.category}</span>
                    <h3 className="line-clamp-2 text-lg font-black text-white">{product.title}</h3>
                    <p className="text-sm font-black text-amber-300">FCFA {Number(product.price || 0).toLocaleString()}</p>
                    <p className="line-clamp-2 text-sm leading-6 text-stone-400">{product.description}</p>
                    <button onClick={() => bookStorefrontProduct(product)} className="w-full rounded-2xl bg-amber-300 px-4 py-3 text-xs font-black uppercase tracking-widest text-black">
                      Book Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-center">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
