import React, { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { getPayments } from "../services/paymentGatewayService";
import { getEscrowRecords } from "../services/escrowService";
import { confirmManualPayment, rejectManualPayment } from "../services/paymentVerificationService";
import { useAuth } from "../auth/AuthContext";

export default function AdminPayments() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState(getPayments());
  const [escrows, setEscrows] = useState(getEscrowRecords());
  const [filter, setFilter] = useState("pending_verification");
  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const successfulPayments = payments.filter(p => ["confirmed", "successful"].includes(p.status));
  const totalVolume = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = successfulPayments.reduce((sum, p) => sum + (p.fees || 0), 0);
  const escrowVolume = escrows.filter(e => e.status === "held").reduce((sum, e) => sum + e.amount, 0);

  const filtered = payments.filter(p => filter === "all" || p.status === filter);
  
  const handleConfirm = (paymentId) => {
    if (window.confirm("Verify that funds are in the InviteGenie account. Confirm payment?")) {
      confirmManualPayment(paymentId, currentUser?.id || "admin");
      setPayments(getPayments());
      setEscrows(getEscrowRecords());
    }
  };
  
  const handleRejectClick = (paymentId) => {
    setRejectingPaymentId(paymentId);
    setRejectReason("");
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    rejectManualPayment(rejectingPaymentId, currentUser?.id || "admin", rejectReason);
    setPayments(getPayments());
    setRejectingPaymentId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-400">Payment Gateway</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Platform Transactions</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Monitor unified payment flows across MoMo, Orange Money, Flutterwave, and CinetPay.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1320] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Successful Volume</p>
          <p className="text-2xl font-black text-white mt-1">FCFA {totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-[#0D1320] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Collected Fees</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">FCFA {totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-[#0D1320] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Held in Escrow</p>
          <p className="text-2xl font-black text-amber-400 mt-1">FCFA {escrowVolume.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#0D1320] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex gap-2 mb-6">
          {["pending_verification", "confirmed", "awaiting_user_payment", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${filter === f ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="pb-4 px-4">Reference</th>
                <th className="pb-4 px-4">Provider</th>
                <th className="pb-4 px-4">Customer</th>
                <th className="pb-4 px-4">Amount</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Date</th>
                {filter === "pending_verification" && <th className="pb-4 px-4 text-right">Verification</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-4 px-4 font-mono text-xs text-violet-300">{p.id}</td>
                  <td className="py-4 px-4 text-sm font-bold text-white">{p.paymentMethod}</td>
                  <td className="py-4 px-4 text-sm text-slate-300">{p.customerName}</td>
                  <td className="py-4 px-4 text-sm font-bold text-emerald-400">FCFA {Number(p.amount).toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      p.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                      p.status === 'pending_verification' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-xs text-slate-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  {filter === "pending_verification" && (
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {p.proofImageUrl && (
                          <button onClick={() => setSelectedProof(p.proofImageUrl)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" title="View Proof">
                            <Icon name="visibility" className="text-sm" />
                          </button>
                        )}
                        <button onClick={() => handleConfirm(p.id)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" title="Confirm Receipt">
                          <Icon name="check_circle" className="text-sm" />
                        </button>
                        <button onClick={() => handleRejectClick(p.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" title="Reject Proof">
                          <Icon name="cancel" className="text-sm" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedProof(null)}>
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
            <img src={selectedProof} alt="Payment Proof" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Reject Payment Proof</h2>
            <p className="text-sm text-slate-400 mb-4">Please provide a reason for rejecting this payment proof. This will be visible to the customer.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Blurry image, incorrect amount, fake receipt..."
              rows={4}
              className="w-full bg-[#0B0F19] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-rose-500 resize-none mb-6 text-sm"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectingPaymentId(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 uppercase tracking-widest">Cancel</button>
              <button onClick={confirmReject} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-500">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
