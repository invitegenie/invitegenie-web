import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getProviderById } from "../services/mockData";
import { getStorefrontProductById, STOREFRONT_STORAGE_KEYS } from "../services/marketplaceStorefrontService";
import { checkBookingConflict } from "../services/bookingConflictService";
import * as Engine from "../auth/coreEngine";
import { sendMessage } from "../services/messagingService";

function makePendingOrderId() {
  return `ORD-${Date.now()}`;
}

function readSelectedItem(providerId) {
  try {
    const stored = JSON.parse(localStorage.getItem(STOREFRONT_STORAGE_KEYS.selectedItem) || "null");
    return stored && String(stored.providerId) === String(providerId) ? stored : null;
  } catch {
    return null;
  }
}

function selectedItemMatchesProduct(item, providerId, productId) {
  if (!item || String(item.providerId) !== String(providerId)) return false;
  if (!productId) return true;
  return String(item.id || item.productId) === String(productId);
}

function normalizeBookingItem(provider, product, productId) {
  if (product) {
    return {
      id: product.id || product.productId,
      providerId: product.providerId || provider.id,
      ownerId: product.ownerId || provider.ownerId || provider.userId || provider.sellerId,
      title: product.title,
      category: product.category || provider.category,
      type: product.type || "service",
      price: Number(product.price || 0),
      currency: product.currency || "FCFA",
      description: product.description || provider.description || provider.shortBio || "",
      duration: product.duration || provider.serviceTime || provider.responseTime || "To be confirmed",
      image: product.image || provider.image,
      included: Array.isArray(product.included) ? product.included : [],
      requirements: Array.isArray(product.requirements) ? product.requirements : [],
      isStorefrontProduct: Boolean(product.id || product.productId || productId),
    };
  }

  return {
    id: null,
    providerId: provider.id,
    ownerId: provider.ownerId || provider.userId || provider.sellerId,
    title: provider.title || provider.businessName || provider.name,
    category: provider.category,
    type: provider.type || "service",
    price: Number(provider.price || provider.startingPrice || 0),
    currency: provider.currency || "FCFA",
    description: provider.description || provider.shortBio || "",
    duration: provider.serviceTime || provider.responseTime || "To be confirmed",
    image: provider.image,
    included: Array.isArray(provider.included) ? provider.included : Array.isArray(provider.tags) ? provider.tags : [],
    requirements: Array.isArray(provider.requirements) ? provider.requirements : [],
    isStorefrontProduct: false,
  };
}

export default function VendorBooking() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { currentUser, profile } = useAuth();
  
  const mockProvider = getProviderById(providerId);
  const engineProvider = (Engine.getCollection(Engine.KEYS.VENDORS) || []).find(v => String(v.id) === String(providerId));
  const provider = mockProvider || engineProvider;

  const productId = searchParams.get("product");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [time, setTime] = useState(searchParams.get("time") || "");
  const [quantity, setQuantity] = useState(1);
  const [buyerNotes, setBuyerNotes] = useState("");
  const [error, setError] = useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const productFromStore = useMemo(() => {
    if (!productId) return null;
    const product = getStorefrontProductById(productId);
    return product && String(product.providerId) === String(providerId) ? product : null;
  }, [productId, providerId]);

  const storedProduct = useMemo(() => readSelectedItem(providerId), [providerId]);
  const stateProduct = location.state?.selectedMarketplaceProduct || null;
  const selectedProduct =
    productFromStore ||
    (selectedItemMatchesProduct(stateProduct, providerId, productId) ? stateProduct : null) ||
    (selectedItemMatchesProduct(storedProduct, providerId, productId) ? storedProduct : null);
  const invalidProductId = Boolean(productId && !selectedProduct);
  const bookingItem = provider ? normalizeBookingItem(provider, selectedProduct, productId) : null;
  const ownerId = bookingItem?.ownerId || provider?.ownerId || provider?.userId || provider?.sellerId;
  const isOwnService = Boolean(currentUser?.id && ownerId && String(currentUser.id) === String(ownerId));
  const qty = Math.max(1, Number(quantity || 1));
  const subtotal = Number(bookingItem?.price || 0) * qty;
  const tax = Math.round(subtotal * 0.18);
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + tax + platformFee;

  if (!provider) {
    return (
      <Layout>
        <EmptyState
          icon="storefront"
          title="Provider not found"
          message="This marketplace provider is not available."
          actionLabel="Back to Marketplace"
          onAction={() => navigate("/marketplace")}
        />
      </Layout>
    );
  }

  if (invalidProductId) {
    return (
      <Layout>
        <EmptyState
          icon="inventory_2"
          title="Product not available"
          message="This storefront item may have been removed, hidden, or belongs to another provider."
          actionLabel="Open Storefront"
          onAction={() => navigate(`/marketplace/${providerId}/storefront`)}
        />
      </Layout>
    );
  }

  const handleProceed = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    const conflict = await checkBookingConflict({ 
      providerId: provider.id, 
      date, 
      startTime: time, 
      endTime: time, 
      capacity: qty 
    });
    
    if (conflict.hasConflict && conflict.severity === 'high') {
      setError(conflict.message || "This time slot is unavailable. Please choose another.");
      return;
    }
    if (isOwnService) {
      setError("You cannot book your own marketplace service.");
      return;
    }
    if (!bookingItem?.price) {
      setError("This item does not have a valid price yet.");
      return;
    }
    if (!date || !time) {
      setError("Choose a date and time before continuing.");
      return;
    }

    const selectedItem = {
      providerId: provider.id,
      productId: bookingItem.id,
      title: bookingItem.title,
      category: bookingItem.category,
      type: bookingItem.type,
      price: bookingItem.price,
      currency: bookingItem.currency,
      duration: bookingItem.duration,
      image: bookingItem.image,
      included: bookingItem.included,
      requirements: bookingItem.requirements,
      description: bookingItem.description,
    };

    const pendingOrder = {
      id: makePendingOrderId(),
      kind: "marketplace_order",
      source: bookingItem.isStorefrontProduct ? "storefront_product" : "marketplace_provider",
      listingId: provider.id,
      productId: bookingItem.id,
      itemTitle: bookingItem.title,
      selectedItem,
      providerName: provider.businessName || provider.name,
      sellerId: ownerId,
      buyerId: currentUser.id,
      buyerName: profile?.full_name || currentUser.name || "InviteGenie User",
      buyerEmail: currentUser.email || profile?.email || "",
      buyerPhone: profile?.phone || currentUser.phone || "",
      quantity: qty,
      buyerNotes,
      selectedDate: date,
      selectedTime: time,
      amount: total,
      subtotal,
      tax,
      platformFee,
      currency: "FCFA",
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STOREFRONT_STORAGE_KEYS.selectedItem, JSON.stringify(selectedItem));
    localStorage.setItem("demo_pending_checkout", JSON.stringify(pendingOrder));
    navigate("/checkout");
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button onClick={() => navigate(`/marketplace/${providerId}/storefront${bookingItem.id ? `?product=${bookingItem.id}` : ""}`)} className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
              <Icon name="arrow_back" className="text-lg" /> Back to Storefront
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Book Marketplace Service</p>
            <h1 className="mt-2 text-3xl font-black text-white">Book {bookingItem.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review the selected storefront item, choose your appointment time, and continue to demo checkout.
            </p>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
            {error}
          </div>
        ) : null}

        {isOwnService ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100">
            You are viewing your own service. Booking is disabled for the owner account.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-xl">
              <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
                <img src={bookingItem.image} alt={bookingItem.title} className="h-64 w-full object-cover md:h-full" />
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    <Pill label={bookingItem.category} tone="amber" />
                    <Pill label={bookingItem.type} />
                    {bookingItem.isStorefrontProduct ? <Pill label="Storefront item" tone="green" /> : <Pill label="Provider listing" /> }
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{bookingItem.title}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-400">{provider.businessName || provider.name} - {provider.location}</p>
                    <p className="mt-3 text-2xl font-black text-emerald-300">FCFA {Number(bookingItem.price || 0).toLocaleString()}</p>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{bookingItem.description}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Info label="Duration" value={bookingItem.duration} icon="schedule" />
                    <Info label="Currency" value={bookingItem.currency} icon="payments" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl sm:p-6">
              <h2 className="flex items-center gap-3 text-lg font-bold text-white">
                <Step value="1" />
                Choose Date & Time
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Service Date</span>
                  <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setError(""); }} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
                </label>
                <div>
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Available Slots</span>
                  <div className="flex flex-wrap gap-2">
                    {["09:00", "10:00", "11:00", "14:00", "15:00"].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => { setTime(slot); setError(""); }}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${time === slot ? "bg-violet-600 text-white" : "border border-white/10 bg-slate-900 text-slate-400 hover:bg-white/5"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl sm:p-6">
              <h2 className="flex items-center gap-3 text-lg font-bold text-white">
                <Step value="2" />
                Booking Details
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value || 1)))}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">Buyer Notes</span>
                  <textarea
                    value={buyerNotes}
                    onChange={(event) => setBuyerNotes(event.target.value)}
                    rows={3}
                    placeholder="Add location details, occasion, preferred style, allergies, or special requests."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <ListBlock title="Included" items={bookingItem.included} fallback="Provider will confirm what is included after checkout." />
              <ListBlock title="Requirements" items={bookingItem.requirements} fallback="No special requirements listed." />
            </section>
          </main>

          <aside className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-lg font-bold text-white">Payment Summary</h2>
            <div className="mt-5 space-y-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <img src={bookingItem.image} className="h-14 w-14 rounded-xl object-cover" alt="" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{bookingItem.title}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{bookingItem.category}</p>
                </div>
              </div>
              <SummaryRow label="Provider" value={provider.businessName || provider.name} />
              <SummaryRow label="Date & Time" value={date && time ? `${date} at ${time}` : "None selected"} />
              <SummaryRow label="Quantity" value={qty} />
              <SummaryRow label="Unit Price" value={`FCFA ${Number(bookingItem.price || 0).toLocaleString()}`} />
            </div>
            <div className="mt-5 space-y-3 border-b border-white/10 pb-5">
              <SummaryRow label="Subtotal" value={`FCFA ${subtotal.toLocaleString()}`} />
              <SummaryRow label="Tax (18%)" value={`FCFA ${tax.toLocaleString()}`} />
              <SummaryRow label="Platform Fee (5%)" value={`FCFA ${platformFee.toLocaleString()}`} />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total</span>
              <span className="text-2xl font-black text-emerald-300">FCFA {total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleProceed}
              disabled={!date || !time || isOwnService || !bookingItem.price}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:opacity-90 disabled:cursor-not-allowed disabled:grayscale disabled:opacity-50"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setIsMessageModalOpen(true)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-white/[0.08]"
            >
              Message Provider
            </button>
          </aside>
        </div>
        <MessageModal provider={provider} open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} onInbox={() => navigate("/inbox")} />
      </div>
    </Layout>
  );
}

function MessageModal({ provider, open, onClose, onInbox }) {
  const { currentUser, profile } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => {
      sendMessage({
        senderId: currentUser?.id || "demo-user",
        senderName: profile?.full_name || currentUser?.name || "Guest",
        receiverId: provider.ownerId || provider.userId || provider.sellerId || provider.id || "vendor",
        receiverName: provider.businessName || provider.name || "Vendor",
        text,
        listingId: provider.id,
        listingName: provider.title || provider.businessName || provider.name
      });
      setSending(false);
      onClose();
      onInbox();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 text-left"><h2 className="text-xl font-black text-white">Message {provider.businessName || provider.name}</h2><button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="close" /></button></div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Hi, I'm interested in your services for my upcoming event..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-violet-500 resize-none mb-4" />
        <div className="flex justify-end gap-3"><button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">Cancel</button><button disabled={!text.trim() || sending} onClick={handleSend} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500 disabled:opacity-50">{sending ? "Sending..." : "Send Message"}</button></div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <Icon name={icon} className="mb-4 text-5xl text-violet-400" />
      <h1 className="text-2xl font-black text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      <button onClick={onAction} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">
        {actionLabel}
      </button>
    </div>
  );
}

function Pill({ label, tone = "slate" }) {
  const cls = tone === "amber" ? "bg-amber-300 text-black" : tone === "green" ? "bg-emerald-400/20 text-emerald-100" : "bg-white/[0.06] text-slate-200";
  return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls}`}>{label}</span>;
}

function Step({ value }) {
  return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white">{value}</span>;
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <Icon name={icon} className="text-[20px] text-violet-300" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value || "To be confirmed"}</p>
    </div>
  );
}

function ListBlock({ title, items = [], fallback }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.length ? items.map((item) => (
          <p key={item} className="flex gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
            <Icon name="check_circle" className="text-[18px] text-emerald-300" />
            {item}
          </p>
        )) : <p className="text-sm text-slate-400">{fallback}</p>}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-bold text-white">{value}</span>
    </div>
  );
}
