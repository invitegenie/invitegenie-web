import React from "react";
import Icon from "./Icon";

export default function PaymentReceiptCard({ payment }) {
  if (!payment) return null;
  
  return (
    <div className="w-full max-w-md mx-auto bg-[#141218] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:border-slate-200 print:bg-white print:text-black">
      <div className="p-8 text-center border-b border-white/5 print:border-slate-200">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-emerald-500 text-white mb-4">
          <Icon name="verified" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-white print:text-black">Payment Receipt</h2>
        <p className="text-sm text-slate-400 mt-1">{payment.reference}</p>
      </div>
      
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Amount Paid</span>
          <span className="text-xl font-black text-white print:text-black">FCFA {Number(payment.amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Date</span>
          <span className="font-bold text-slate-300 print:text-black">{new Date(payment.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Provider</span>
          <span className="font-bold text-slate-300 print:text-black">{payment.paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Customer</span>
          <span className="font-bold text-slate-300 print:text-black">{payment.customerName}</span>
        </div>
      </div>
      
      <div className="bg-white/5 p-4 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest print:bg-slate-50">
        Secured by InviteGenie Pay
      </div>
    </div>
  );
}