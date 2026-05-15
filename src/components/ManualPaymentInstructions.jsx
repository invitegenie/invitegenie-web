import React, { useState } from 'react';
import Icon from './Icon';
import { submitPaymentProof } from '../services/paymentGatewayService';

export default function ManualPaymentInstructions({ payment, onSubmitted }) {
  const [phone, setPhone] = useState('');
  const [reference, setReference] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instructions = {
    'MTN Mobile Money': {
      code: '*126#',
      name: 'InviteGenie Events',
      number: '670 00 00 00',
      color: 'text-yellow-400'
    },
    'Orange Money': {
      code: '#150#',
      name: 'InviteGenie Events',
      number: '690 00 00 00',
      color: 'text-orange-400'
    },
    'Bank Transfer': {
      code: 'UBA Cameroon',
      name: 'InviteGenie SARL',
      number: '100XXXXXXXXX',
      color: 'text-blue-400'
    }
  };

  const methodDetails = instructions[payment.method || payment.selectedPaymentMethod] || instructions['MTN Mobile Money'];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !reference) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      submitPaymentProof(payment.id, {
        phone,
        reference,
        proofImageUrl: proofUrl
      });
      onSubmitted();
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Complete Payment</h1>
        <p className="text-slate-400 text-sm mt-2">Send your payment using the details below, then submit your proof.</p>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="bg-slate-900/50 rounded-2xl p-5 border border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Amount Due</p>
          <p className="text-3xl font-black text-emerald-400">FCFA {Number(payment.amount).toLocaleString()}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Payment Details</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-sm text-slate-400">Merchant</span>
                <span className="text-sm font-bold text-white">{methodDetails.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-sm text-slate-400">Account / Till</span>
                <span className={`text-sm font-black ${methodDetails.color}`}>{methodDetails.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Dial Code</span>
                <span className="text-sm font-bold text-white">{methodDetails.code}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/50 rounded-2xl p-5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Submit Proof</p>
            <input type="tel" required placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
            <input type="text" required placeholder="Transaction Reference / ID" value={reference} onChange={e => setReference(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-violet-500/50 hover:bg-white/5 transition">{proofUrl ? <span className="text-xs font-bold text-emerald-400 flex items-center gap-2"><Icon name="check_circle" className="text-sm" /> Proof Attached</span> : <><Icon name="add_photo_alternate" className="text-slate-500 mb-1" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attach Screenshot (Optional)</span></>}<input type="file" accept="image/*" className="hidden" onChange={handleUpload} /></label>
            <button type="submit" disabled={isSubmitting || !phone || !reference} className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition disabled:opacity-50 disabled:grayscale">{isSubmitting ? "Submitting..." : "Submit Payment"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}