import React, { useState, useEffect } from 'react';
import { getPayments } from '../services/paymentGatewayService';
import { confirmManualPayment, rejectManualPayment } from '../services/paymentVerificationService';

export default function AdminPaymentVerificationPanel({ adminUserId }) {
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  const pendingPayments = payments.filter(p => p.status === 'pending_verification');
  const confirmedPayments = payments.filter(p => p.status === 'confirmed');

  const handleConfirm = (paymentId) => {
    confirmManualPayment(paymentId, adminUserId);
    setPayments(getPayments());
  };

  const handleReject = (paymentId) => {
    if (!rejectionReason) return;
    rejectManualPayment(paymentId, adminUserId, rejectionReason);
    setPayments(getPayments());
    setRejectionReason('');
  };

  return (
    <div className="bg-[#111827] rounded-3xl p-6 border border-white/10 shadow-xl">
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
        <button className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition ${tab === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setTab('pending')}>Pending ({pendingPayments.length})</button>
        <button className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition ${tab === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}`} onClick={() => setTab('confirmed')}>Confirmed ({confirmedPayments.length})</button>
      </div>
      {tab === 'pending' && (
        <div className="space-y-4">
          {pendingPayments.length === 0 && <div className="text-slate-500 text-sm">No pending payments.</div>}
          {pendingPayments.map(payment => (
            <div key={payment.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-black text-white text-lg">{payment.buyerName || payment.customerName || "User"}</div>
                  <div className="text-sm text-emerald-400 font-bold">FCFA {Number(payment.amount).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{payment.method || payment.selectedPaymentMethod}</div>
                  <div className="text-sm font-mono text-amber-200 mt-1">{payment.userPaymentReference}</div>
                  <div className="text-xs text-slate-400 mt-1">{payment.userPaymentPhone}</div>
                </div>
              </div>
              {payment.proofImageUrl && <img src={payment.proofImageUrl} alt="Proof" className="max-h-48 my-4 rounded-xl border border-white/10" />}
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                <button className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition" onClick={() => handleConfirm(payment.id)}>Confirm Received</button>
                <input
                  type="text"
                  placeholder="Rejection reason"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-xl text-sm outline-none focus:border-rose-500 flex-1"
                />
                <button disabled={!rejectionReason} className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition disabled:opacity-50" onClick={() => handleReject(payment.id)}>Reject Proof</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'confirmed' && (
        <div className="space-y-4">
          {confirmedPayments.length === 0 && <div className="text-slate-500 text-sm">No confirmed payments.</div>}
          {confirmedPayments.map(payment => (
            <div key={payment.id} className="p-5 rounded-2xl border border-emerald-500/10 bg-slate-900/50">
              <div className="flex justify-between">
                <div>
                  <div className="font-black text-white">{payment.buyerName || payment.customerName || "User"}</div>
                  <div className="text-sm text-emerald-400 font-bold">FCFA {Number(payment.amount).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{payment.method || payment.selectedPaymentMethod} - {payment.userPaymentReference}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-2">Verified: {new Date(payment.updatedAt || payment.verifiedAt || Date.now()).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
