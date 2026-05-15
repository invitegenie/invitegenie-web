﻿import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { addProviderRequest, getProviderById } from "../services/mockData";
import * as Engine from "../auth/coreEngine";

export default function ProviderDetails() {
  const { providerId, vendorId } = useParams();
  const navigate = useNavigate();
  const provider = useMemo(() => getProviderById(providerId || vendorId), [providerId, vendorId]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleQuote = (form) => {
    const budget = Number(form.budget || provider.startingPrice);
    const request = addProviderRequest({
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.category,
      estimatedPlatformCommission: Math.round(budget * 0.05),
      estimatedProviderPayout: Math.round(budget * 0.95),
      ...form,
    });
    setQuoteOpen(false);
    showToast(`Request ${request.id} sent. Provider payout estimate: FCFA ${request.estimatedProviderPayout.toLocaleString()}.`);

    const existingNotifs = Engine.getCollection(Engine.KEYS.NOTIFICATIONS) || [];
    Engine.save(Engine.KEYS.NOTIFICATIONS, [
      {
        id: `notif-quote-${Date.now()}`,
        userId: provider.ownerId || provider.userId,
        type: "vendor",
        title: "New Quote Request",
        message: `You have received a new quote request for ${provider.name}.`,
        path: "/dashboard?panel=quotes",
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...existingNotifs
    ]);
  };

  const handleBookNow = () => {
    const request = addProviderRequest({
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.category,
      serviceNeeded: provider.category,
      date: new Date().toISOString().slice(0, 10),
      location: provider.location,
      budget: provider.startingPrice,
      description: "Quick booking placeholder from provider profile.",
      phone: "",
      estimatedPlatformCommission: Math.round(provider.startingPrice * 0.05),
      estimatedProviderPayout: Math.round(provider.startingPrice * 0.95),
    });
    showToast(`Booking request ${request.id} created. Provider payout: FCFA ${request.estimatedProviderPayout.toLocaleString()}.`);

    const existingNotifs = Engine.getCollection(Engine.KEYS.NOTIFICATIONS) || [];
    Engine.save(Engine.KEYS.NOTIFICATIONS, [
      {
        id: `notif-book-${Date.now()}`,
        userId: provider.ownerId || provider.userId,
        type: "vendor",
        title: "New Booking Request",
        message: `You have received a new booking request for ${provider.name}.`,
        path: "/dashboard?panel=orders",
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...existingNotifs
    ]);
  };

  const handleShareQr = async () => {
    const listingUrl = `${window.location.origin}/marketplace/${provider.id}`;
    try {
      await navigator.clipboard.writeText(listingUrl);
      showToast("Listing link copied.");
    } catch {
      showToast("QR link is ready to share.");
    }
  };

  if (!provider) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <Icon name="person_off" className="mb-4 text-5xl text-slate-600" />
          <h1 className="text-2xl font-black text-white">Provider Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">This marketplace profile is not available.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">
            Back to Marketplace
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 pb-24">
        {toast ? (
          <div className="fixed right-6 top-6 z-[220] rounded-2xl border border-violet-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/30 backdrop-blur">
            {toast}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl">
          <div className="relative h-64">
            <img src={provider.coverImage} alt={provider.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />
            <button
              type="button"
              onClick={() => navigate("/marketplace")}
              className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-black uppercase tracking-widest text-white backdrop-blur hover:bg-black/60"
            >
              Back to Marketplace
            </button>
          </div>

          <div className="-mt-16 flex flex-col gap-6 p-6 md:flex-row md:items-end">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-[#111827] bg-slate-900 shadow-2xl">
              <img src={provider.image} alt={provider.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black text-white">{provider.title || provider.name}</h1>
                {provider.verified ? <Badge label="Verified" /> : null}
                {provider.pro ? <Badge label="Pro" tone="green" /> : null}
              </div>
              <p className="mt-2 text-sm font-semibold text-violet-300">{provider.name} - {provider.type} / {provider.category} - {provider.location}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>star {provider.rating} from {provider.reviews} reviews</span>
                <span>{provider.completedJobs} completed jobs</span>
                <span>Responds in {provider.responseTime}</span>
                <span>From FCFA {provider.startingPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionButton label="Request Quote" onClick={() => setQuoteOpen(true)} primary />
              <ActionButton label="Book Now" onClick={handleBookNow} />
              <ActionButton label="Message Provider" onClick={() => setMessageOpen(true)} />
              <ActionButton label="Save" onClick={() => showToast(`${provider.name} saved to your shortlist.`)} />
              <ActionButton label="Share QR" onClick={handleShareQr} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <Panel title="QR Code">
              <div className="rounded-2xl border border-violet-400/20 bg-slate-950/60 p-5 text-center">
                <p className="text-sm font-black text-white">Scan to open this listing</p>
                <img src={provider.qrCodeUrl} alt="Marketplace listing QR code" className="mx-auto mt-5 h-44 w-44 rounded-xl bg-white p-3" />
                <button
                  type="button"
                  onClick={handleShareQr}
                  className="mt-5 rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/[0.04]"
                >
                  Share QR
                </button>
              </div>
            </Panel>

            <Panel title="About">
              <p className="text-sm leading-relaxed text-slate-300">{provider.fullDescription || provider.shortBio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {provider.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
            </Panel>

            <Panel title="Services">
              <div className="grid gap-3">
                {(provider.included || provider.services).map((service) => (
                  <div key={service} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                    <Icon name="check_circle" className="text-emerald-300" />
                    <span className="text-sm font-semibold text-white">{service}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Customer Requirements">
              <div className="space-y-2">
                {(provider.requirements || []).length ? provider.requirements.map((requirement) => (
                  <p key={requirement} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                    <Icon name="assignment" className="text-violet-300" />
                    {requirement}
                  </p>
                )) : <p className="text-sm text-slate-400">Provider will confirm requirements after quote request.</p>}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Packages">
              <div className="grid gap-4 md:grid-cols-3">
                {(provider.packages || []).map((pack) => (
                  <div key={pack.name} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm font-black text-white">{pack.name}</p>
                    <p className="mt-2 min-h-12 text-xs leading-relaxed text-slate-400">{pack.description}</p>
                    <p className="mt-4 text-lg font-black text-emerald-300">FCFA {pack.price.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-slate-500">{pack.deliveryTime}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Portfolio">
              <div className="grid gap-3 sm:grid-cols-3">
                {(provider.portfolioImages || [provider.image]).map((image) => (
                  <img key={image} src={image} alt={`${provider.name} portfolio`} className="aspect-video rounded-2xl object-cover" />
                ))}
              </div>
            </Panel>

            <Panel title="Reviews">
              <div className="space-y-3">
                {(provider.reviewsList || []).length ? provider.reviewsList.map((review) => (
                  <div key={`${review.userName}-${review.date}`} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{review.userName}</p>
                      <p className="text-xs text-amber-300">star {review.rating}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{review.comment}</p>
                    <p className="mt-2 text-xs text-slate-500">{review.date}</p>
                  </div>
                )) : <p className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-400">No reviews yet for this listing.</p>}
              </div>
            </Panel>
          </div>
        </section>

        <QuoteModal provider={provider} open={quoteOpen} onClose={() => setQuoteOpen(false)} onSubmit={handleQuote} />
        <MessageModal provider={provider} open={messageOpen} onClose={() => setMessageOpen(false)} onInbox={() => navigate("/inbox")} />
      </div>
    </Layout>
  );
}

function QuoteModal({ provider, open, onClose, onSubmit }) {
  const [form, setForm] = useState({ serviceNeeded: provider?.category || "", date: "", location: provider?.location || "", budget: "", description: "", phone: "" });
  if (!open || !provider) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
      >
        <h2 className="text-2xl font-black text-white">Request Quote</h2>
        <p className="mt-1 text-sm text-slate-400">Tell {provider.name} what you need.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="Service Needed" value={form.serviceNeeded} onChange={(value) => setForm({ ...form, serviceNeeded: value })} required />
          <Input label="Event / Task Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} required />
          <Input label="Location" value={form.location} onChange={(value) => setForm({ ...form, location: value })} required />
          <Input label="Budget" type="number" value={form.budget} onChange={(value) => setForm({ ...form, budget: value })} placeholder={String(provider.startingPrice)} />
          <Input label="Contact Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="+237 6XX XXX XXX" required />
        </div>
        <label className="mt-4 block">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</span>
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} required className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50" />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300">Cancel</button>
          <button type="submit" className="rounded-2xl bg-gradient-to-r from-violet-500 to-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Submit Request</button>
        </div>
      </form>
    </div>
  );
}

function MessageModal({ provider, open, onClose, onInbox }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-6 text-center shadow-2xl">
        <Icon name="chat" className="mx-auto mb-3 text-5xl text-violet-300" />
        <h2 className="text-xl font-black text-white">Message {provider.name}</h2>
        <p className="mt-2 text-sm text-slate-400">Messaging is ready as a local placeholder. Open inbox to continue the conversation.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300">Close</button>
          <button onClick={onInbox} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Open Inbox</button>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function ActionButton({ label, onClick, primary = false }) {
  const cls = primary
    ? "bg-gradient-to-r from-violet-500 to-emerald-400 text-white"
    : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]";
  return <button type="button" onClick={onClick} className={`rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest ${cls}`}>{label}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50" />
    </label>
  );
}

function Badge({ label, tone = "violet" }) {
  const cls = tone === "green" ? "bg-emerald-400/15 text-emerald-200" : "bg-violet-400/15 text-violet-200";
  return <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${cls}`}>{label}</span>;
}
