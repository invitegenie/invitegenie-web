import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getEventById, getProviderById } from "../services/mockData";
import { createTicketPurchase, createMarketplaceOrder, updatePaymentStatus } from "../services/ticketingService";
import { initiatePayment } from "../services/paymentGatewayService";
import { openWhatsAppBooking } from "../services/whatsappMessageFormatter";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { PAYMENT_PROVIDERS } from "../services/paymentProviderConfig";

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const [pending, setPending] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(PAYMENT_PROVIDERS[0].id);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("beta_pending_checkout") || localStorage.getItem("demo_pending_checkout");
    if (data) setPending(JSON.parse(data));
  }, []);

  const event = pending?.kind === "event_ticket" ? getEventById(pending.eventId) : null;
  const listing = pending?.kind === "marketplace_order" ? getProviderById(pending.listingId) : null;
  const title = pending?.itemTitle || event?.title || listing?.title || listing?.businessName || "Checkout";
  const amount = Number(pending?.amount || listing?.price || listing?.startingPrice || 0);

  const selectedProvider = PAYMENT_PROVIDERS.find(p => p.id === selectedProviderId);

  const startPaymentFlow = () => {
    if (!pending || !currentUser) return;
    setError("");
    setProcessing(true);

    try {
      if (pending.kind === "event_ticket") {
        const result = createTicketPurchase({
          user: { ...profile, ...currentUser },
          eventId: pending.eventId,
          ticketType: pending.ticketType,
          quantity: pending.quantity,
          buyerName: pending.buyerName,
          buyerEmail: pending.buyerEmail,
          buyerPhone: pending.buyerPhone,
          paymentMethod: selectedProvider?.name || "Manual Payment",
          initialStatus: "pending_payment",
          initialPaymentStatus: "unpaid"
        });

        const payment = initiatePayment({
          amount,
          customer: { ...profile, ...currentUser },
          providerId: selectedProviderId,
          orderType: pending.kind,
          orderId: result.ticket.id,
          metadata: {
            bookingId: result.booking.id,
            eventId: pending.eventId,
          },
        });
        updatePaymentStatus(payment.id, "awaiting_user_payment", currentUser.id);
        
        localStorage.removeItem("beta_pending_checkout");
        localStorage.removeItem("demo_pending_checkout");

        if (selectedProvider?.id === "manual_demo" || selectedProvider?.name?.includes("Manual")) {
          openWhatsAppBooking(
            { id: pending.listingId, is_seeded: String(pending.listingId).startsWith("list-") },
            {
              vendorName: pending.providerName || "Vendor",
              bookingId: result.booking?.id || payment.id,
              serviceName: pending.itemTitle || "Service",
              price: `${amount} FCFA`,
              date: pending.selectedDate || new Date().toLocaleDateString(),
              clientName: pending.buyerName || currentUser?.name || "Guest",
              clientPhone: pending.buyerPhone || currentUser?.phone || "N/A",
              clientEmail: pending.buyerEmail || currentUser?.email || "N/A",
              paymentMethod: selectedProvider?.name,
              amount: amount,
              notes: pending.buyerNotes || ""
            }
          );
        }

        navigate(`/payments/${payment.id}?next=/bookings/${result.booking.id}/voucher`, { replace: true });
        return;
      }

      if (pending.kind === "marketplace_order") {
        const order = createMarketplaceOrder({
          buyer: { ...profile, ...currentUser },
          listingId: pending.listingId,
          productId: pending.productId,
          itemTitle: pending.itemTitle,
          selectedItem: pending.selectedItem,
          packageName: pending.packageName,
          source: pending.source,
          quantity: pending.quantity,
          buyerNotes: pending.buyerNotes,
          selectedDate: pending.selectedDate,
          selectedTime: pending.selectedTime,
          subtotal: pending.subtotal,
          tax: pending.tax,
          platformFee: pending.platformFee,
          amount,
          paymentMethod: selectedProvider?.name || "Manual Payment",
          status: "pending_payment",
        });

        const payment = initiatePayment({
          amount,
          customer: { ...profile, ...currentUser },
          providerId: selectedProviderId,
          orderType: pending.kind,
          orderId: order.id,
          metadata: {
            listingId: pending.listingId,
            productId: pending.productId,
          },
        });
        updatePaymentStatus(payment.id, "awaiting_user_payment", currentUser.id);
        
        localStorage.removeItem("beta_pending_checkout");
        localStorage.removeItem("demo_pending_checkout");
        localStorage.removeItem("demo_marketplace_selected_item");

        if (selectedProvider?.id === "manual_demo" || selectedProvider?.name?.includes("Manual")) {
          openWhatsAppBooking(
            { id: pending.listingId, is_seeded: String(pending.listingId).startsWith("list-") },
            {
              vendorName: pending.providerName || "Vendor",
              bookingId: order.id,
              serviceName: pending.itemTitle || "Marketplace Service",
              price: `${amount} FCFA`,
              date: pending.selectedDate || new Date().toLocaleDateString(),
              clientName: pending.buyerName || currentUser?.name || "Guest",
              clientPhone: pending.buyerPhone || currentUser?.phone || "N/A",
              clientEmail: pending.buyerEmail || currentUser?.email || "N/A",
              paymentMethod: selectedProvider?.name,
              amount: amount,
              notes: pending.buyerNotes || ""
            }
          );
        }

        navigate(`/payments/${payment.id}?next=/marketplace`, { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Checkout failed. Please try again.");
      setProcessing(false);
    }
  };

  if (!pending) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-violet-400">shopping_cart_checkout</span>
          <h1 className="text-2xl font-black text-white">Nothing to Checkout</h1>
          <p className="mt-2 text-sm text-slate-400">Choose an event ticket or marketplace service first.</p>
          <button onClick={() => navigate("/events")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Browse Events</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false}>
      <div className="mx-auto grid max-w-5xl gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Checkout</p>
          <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">Payment processing is simulated in beta mode.</p>

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Payment Method</h2>
            <PaymentMethodSelector selectedProviderId={selectedProviderId} onSelect={setSelectedProviderId} />
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl self-start">
          <h2 className="text-lg font-black text-white">Order Summary</h2>
          <div className="mt-5 space-y-4 border-b border-white/10 pb-5">
            <SummaryRow label="Type" value={pending.kind === "event_ticket" ? "Event Ticket" : "Marketplace Order"} />
            {pending.ticketType ? <SummaryRow label="Ticket" value={pending.ticketType} /> : null}
            {pending.selectedDate ? <SummaryRow label="Date" value={pending.selectedDate} /> : null}
            {pending.quantity ? <SummaryRow label="Quantity" value={pending.quantity} /> : null}
            <SummaryRow label="Subtotal" value={`FCFA ${Number(pending.subtotal || amount).toLocaleString()}`} />
            {pending.tax ? <SummaryRow label="Tax" value={`FCFA ${Number(pending.tax).toLocaleString()}`} /> : null}
            {pending.platformFee ? <SummaryRow label="Fee" value={`FCFA ${Number(pending.platformFee).toLocaleString()}`} /> : null}
            {pending.buyerNotes ? <SummaryRow label="Notes" value={pending.buyerNotes} /> : null}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total</span>
            <span className="text-2xl font-black text-emerald-300">FCFA {amount.toLocaleString()}</span>
          </div>
          <button
            disabled={processing || !selectedProviderId}
            onClick={startPaymentFlow}
            className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500 disabled:opacity-60"
          >
            {processing ? "Processing..." : "Proceed to Pay"}
          </button>
        </aside>
      </div>
    </Layout>
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
