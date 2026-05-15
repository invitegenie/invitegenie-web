import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import { initiateMoMoPayment } from "../services/mobileMoneyService";

export default function PaymentConfirmationModal({ payment, onComplete, onCancel }) {
  const [status, setStatus] = useState("initiating"); // initiating, pending_auth, success

  useEffect(() => {
    if (!payment) return;
    
    const process = async () => {
      if (payment.provider === "mtn_momo" || payment.provider === "orange_money") {
        await initiateMoMoPayment(payment);
        setStatus("pending_auth");
        
        // Simulate user entering PIN on their phone
        setTimeout(() => {
          setStatus("success");
          setTimeout(() => onComplete(true), 1500);
        }, 3000);
      } else {
        // Standard Gateway Mock
        setTimeout(() => {
          setStatus("success");
          setTimeout(() => onComplete(true), 1500);
        }, 2000);
      }
    };
    
    process();
  }, [payment]);

  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-900 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        {status === "success" ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 mb-6">
            <Icon name="check_circle" className="text-5xl text-emerald-400" />
          </div>
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20 mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
            <Icon name={payment.provider.includes("momo") || payment.provider.includes("orange") ? "phone_iphone" : "payments"} className="text-3xl text-violet-400" />
          </div>
        )}
        
        <h3 className="text-xl font-black text-white mb-2">{status === "success" ? "Payment Successful!" : status === "pending_auth" ? "Check your phone" : "Processing Payment..."}</h3>
        <p className="text-sm text-slate-400 mb-6">{status === "pending_auth" ? "Please enter your PIN on your mobile device to authorize FCFA " + payment.amount.toLocaleString() : status === "success" ? "Your transaction has been securely recorded." : "Connecting to " + payment.paymentMethod}</p>
        
        {status !== "success" && (
           <button onClick={onCancel} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Cancel Request</button>
        )}
      </div>
    </div>
  );
}