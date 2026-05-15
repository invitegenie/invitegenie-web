import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { createTicketPurchase } from "../services/ticketingService";
import { useAuth } from "../auth/AuthContext";
import { getEventById } from "../services/mockData";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { PAYMENT_PROVIDERS } from "../services/paymentProviderConfig";
import { initiatePayment } from "../services/paymentGatewayService";

const VIP_TABLES = [
  { id: "T1", label: "Table 1 (Front Row)", price: 150000, capacity: 4, available: true },
  { id: "T2", label: "Table 2 (Front Row)", price: 150000, capacity: 4, available: false },
  { id: "T3", label: "Table 3 (Lounge)", price: 100000, capacity: 6, available: true },
  { id: "T4", label: "Table 4 (Lounge)", price: 100000, capacity: 6, available: true },
  { id: "T5", label: "Table 5 (Balcony)", price: 80000, capacity: 4, available: true },
  { id: "T6", label: "Table 6 (Balcony)", price: 80000, capacity: 4, available: true },
];

export default function EventCheckout() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const [payload, setPayload] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(PAYMENT_PROVIDERS[0].id);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const event = getEventById(eventId);

  useEffect(() => {
    const pending = localStorage.getItem("demo_pending_checkout");
    if (pending) {
      const data = JSON.parse(pending);
      if (String(data.eventId) === String(eventId)) {
        setPayload(data);
      } else {
        navigate(`/events/${eventId}`);
      }
    } else {
      navigate(`/events/${eventId}`);
    }
  }, [eventId, navigate]);

  if (!payload || !event) return <Layout><div className="p-10 text-center text-white">Loading...</div></Layout>;

  const baseAmount = payload.amount || 0;
  const totalAmount = baseAmount + (selectedTable ? selectedTable.price : 0);
  const isFree = totalAmount === 0;
  
  const selectedProvider = PAYMENT_PROVIDERS.find(p => p.id === selectedProviderId);

  const startPaymentFlow = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = createTicketPurchase({
        user: currentUser || profile || { id: "guest", name: payload.buyerName },
        eventId: payload.eventId,
        ticketType: payload.ticketType,
        quantity: payload.quantity,
        buyerName: payload.buyerName,
        buyerEmail: payload.buyerEmail,
        buyerPhone: payload.buyerPhone,
        paymentMethod: isFree ? "Free" : selectedProvider?.name,
        tableAddon: selectedTable,
        initialStatus: isFree ? "valid" : "pending_payment",
        initialPaymentStatus: isFree ? "paid" : "unpaid",
      });

      localStorage.removeItem("demo_pending_checkout");

      if (isFree) {
        navigate("/my-tickets");
        return;
      }

      const payment = initiatePayment({
        amount: totalAmount,
        customer: currentUser || profile || { id: "guest", name: payload.buyerName },
        providerId: selectedProviderId,
        orderType: "event_ticket",
        orderId: result.ticket.id,
        metadata: {
          bookingId: result.booking.id,
          eventId: payload.eventId,
        },
      });

      navigate(`/payments/${payment.id}?next=/bookings/${result.booking.id}/voucher`, { replace: true });
    } catch (err) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-xl pt-10 pb-28">
        <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-white mb-6">Complete Checkout</h1>
          
          <div className="mb-6 rounded-2xl border border-white/5 bg-slate-900 p-5">
            <h2 className="text-lg font-bold text-white">{event.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{payload.ticketType} Ticket x{payload.quantity}</p>
            
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-sm font-bold text-slate-300">Base Total</span>
              <span className="text-sm font-black text-white">{baseAmount === 0 ? "FREE" : `FCFA ${baseAmount.toLocaleString()}`}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Optional: Reserve a VIP Table</h2>
            <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
              <div className="mb-6 w-full rounded-xl bg-violet-900/30 py-3 text-center text-xs font-black uppercase tracking-widest text-violet-400">Main Stage</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {VIP_TABLES.map(t => (
                  <button
                    key={t.id}
                    disabled={!t.available || isProcessing}
                    onClick={() => setSelectedTable(selectedTable?.id === t.id ? null : t)}
                    className={`relative flex flex-col items-center justify-center aspect-square rounded-full p-4 transition-all ${!t.available ? 'opacity-50 cursor-not-allowed bg-slate-800' : selectedTable?.id === t.id ? 'bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <span className="material-symbols-outlined mb-1 text-2xl text-white/50">table_restaurant</span>
                    <span className="text-xs font-bold text-white">{t.id}</span>
                    <span className="text-[9px] text-slate-400 mt-1">FCFA {t.price.toLocaleString()}</span>
                    {!t.available && <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-[10px] font-black uppercase tracking-widest text-rose-400 backdrop-blur-sm">Reserved</span>}
                  </button>
                ))}
              </div>
              {selectedTable && (
                 <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
                   <div>
                     <p className="text-xs font-bold text-violet-300">Selected: {selectedTable.label}</p>
                     <p className="text-[10px] text-slate-400 mt-1">Seats up to {selectedTable.capacity} guests</p>
                   </div>
                   <p className="font-black text-white shrink-0">+ FCFA {selectedTable.price.toLocaleString()}</p>
                 </div>
              )}
            </div>
          </div>

          {!isFree && (
            <div className="mb-8">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Payment Method</label>
              <PaymentMethodSelector selectedProviderId={selectedProviderId} onSelect={setSelectedProviderId} />
            </div>
          )}
          
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Final Total</span>
            <span className="text-2xl font-black text-white">{isFree ? "FREE" : `FCFA ${totalAmount.toLocaleString()}`}</span>
          </div>
          
          <button disabled={isProcessing || (!isFree && !selectedProviderId)} onClick={startPaymentFlow} className="w-full rounded-2xl bg-violet-600 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-violet-500 disabled:opacity-50">
            {isProcessing ? "Processing..." : isFree ? "Complete Registration" : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
