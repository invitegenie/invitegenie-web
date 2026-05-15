import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PaymentReceiptCard from "../components/PaymentReceiptCard";
import ManualPaymentInstructions from "../components/ManualPaymentInstructions";
import { getPaymentById, updatePaymentStatus } from "../services/paymentGatewayService";
import Icon from "../components/Icon";

export default function PaymentStatus({ status }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { paymentId: routePaymentId } = useParams();
  const paymentId = routePaymentId || searchParams.get("paymentId");
  const nextUrl = searchParams.get("next") || "/dashboard";
  const [refresh, setRefresh] = useState(0);
  
  const payment = getPaymentById(paymentId);

  if (!payment) {
    if (status) {
      const statusCopy = {
        success: {
          icon: "verified",
          title: "Payment Successful",
          message: "Your payment has been recorded successfully.",
          tone: "text-emerald-400",
        },
        failed: {
          icon: "error",
          title: "Payment Failed",
          message: "We could not complete this payment. Please try again.",
          tone: "text-rose-400",
        },
        pending: {
          icon: "hourglass_empty",
          title: "Payment Pending",
          message: "Your payment is pending verification.",
          tone: "text-amber-400",
        },
      }[status] || {
        icon: "payments",
        title: "Payment Status",
        message: "Payment status is not available yet.",
        tone: "text-violet-400",
      };

      return (
        <Layout>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-white">
            <Icon name={statusCopy.icon} className={`mb-4 text-6xl ${statusCopy.tone}`} />
            <h1 className="mb-2 text-2xl font-black uppercase">{statusCopy.title}</h1>
            <p className="max-w-md text-sm text-slate-400">{statusCopy.message}</p>
            <button onClick={() => navigate(nextUrl)} className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-xs font-black uppercase">Continue</button>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white">
          <h1 className="text-2xl font-black uppercase mb-2">Transaction Not Found</h1>
          <button onClick={() => navigate(nextUrl)} className="mt-4 px-6 py-3 bg-violet-600 rounded-xl text-xs font-black uppercase">Continue</button>
        </div>
      </Layout>
    );
  }

  const handleReupload = () => {
    updatePaymentStatus(payment.id, "awaiting_user_payment", "system", "User requested to re-upload proof");
    setRefresh(r => r + 1);
  };

  if (payment.status === "awaiting_user_payment") {
    return (
      <Layout showHeader={false}>
        <div className="py-12">
          <ManualPaymentInstructions payment={payment} onSubmitted={() => setRefresh(r => r + 1)} />
        </div>
      </Layout>
    );
  }

  if (payment.status === "pending_verification") {
    return (
      <Layout showHeader={false}>
        <div className="max-w-md mx-auto py-20 text-center animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border-4 border-amber-500/20">
            <Icon name="hourglass_empty" className="text-5xl text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Verifying Payment</h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-sm">
            Payment submitted — awaiting InviteGenie confirmation.
          </p>
          <div className="mt-8 bg-[#111827] border border-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Reference Code</p>
            <p className="font-mono text-white bg-black/40 py-2 rounded-xl border border-white/5">{payment.userPaymentReference}</p>
          </div>
          <button onClick={() => navigate(nextUrl)} className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors">
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  if (payment.status === "failed") {
    return (
      <Layout showHeader={false}>
        <div className="max-w-md mx-auto py-20 text-center animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border-4 border-rose-500/20">
            <Icon name="error" className="text-5xl text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Payment Rejected</h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-sm">
            Your payment proof was reviewed and could not be verified.
          </p>
          {payment.rejectionReason && (
            <div className="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Reason for Rejection</p>
              <p className="text-sm text-rose-200">{payment.rejectionReason}</p>
            </div>
          )}
          
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={handleReupload} className="w-full px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors shadow-lg shadow-violet-900/20">
              Re-upload Proof
            </button>
            <button onClick={() => navigate(nextUrl)} className="w-full px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 transition-colors">
              Return to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false}>
      <div className="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center">
        <PaymentReceiptCard payment={payment} />
        
        <div className="mt-10 flex gap-4 print:hidden">
          <button onClick={() => window.print()} className="px-6 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/5">
            Print Receipt
          </button>
          <button onClick={() => navigate(nextUrl)} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg">
            Continue to App
          </button>
        </div>
      </div>
    </Layout>
  );
}
