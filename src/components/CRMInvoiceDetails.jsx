import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getInvoice, saveInvoice } from "../services/vendorCRMService";

export default function CRMInvoiceDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const userId = currentUser?.id || "demo-user";
  const vendorName = profile?.businessName || currentUser?.name || "InviteGenie Vendor";
  
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const data = getInvoice(invoiceId);
    if (data && String(data.ownerId) === String(userId)) {
      setInvoice(data);
    }
  }, [invoiceId, userId]);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkPaid = () => {
    const updated = saveInvoice({ ...invoice, status: "paid" });
    setInvoice(updated);
  };

  if (!invoice) return <Layout><div className="p-10 text-center text-white">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 pb-28 pt-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <button onClick={() => navigate("/vendor-crm")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
            <Icon name="arrow_back" className="text-lg" /> Back to CRM
          </button>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10">
              Print / PDF
            </button>
            {invoice.status !== "paid" && (
              <button onClick={handleMarkPaid} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-emerald-500">
                Mark Paid
              </button>
            )}
          </div>
        </div>

        {/* Printable Invoice Paper */}
        <div className="rounded-[2rem] border border-white/10 bg-white p-8 sm:p-12 text-slate-900 shadow-2xl print:m-0 print:border-none print:shadow-none print:bg-white">
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">INVOICE</h1>
              <p className="text-sm font-bold text-slate-500 mt-1">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-violet-600">{vendorName}</p>
              <p className="text-xs text-slate-500">Generated via InviteGenie CRM</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-b">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Billed To</p>
              <p className="text-base font-bold text-slate-900">{invoice.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Details</p>
              <p className="text-sm"><span className="font-bold">Issue Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p className="text-sm"><span className="font-bold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p className="text-sm mt-2 font-black uppercase text-violet-600 border border-violet-200 inline-block px-2 py-0.5 rounded bg-violet-50">Status: {invoice.status}</p>
            </div>
          </div>

          <div className="py-8">
            <table className="w-full text-left">
              <thead className="border-b-2 border-slate-200">
                <tr>
                  <th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                  <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items && invoice.items.length > 0 ? invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-4 font-bold text-slate-800">{item.description}</td>
                    <td className="py-4 text-right font-medium">FCFA {Number(item.amount).toLocaleString("fr-CM")}</td>
                  </tr>
                )) : (
                  <tr>
                    <td className="py-4 font-bold text-slate-800">Professional Services rendering</td>
                    <td className="py-4 text-right font-medium">FCFA {Number(invoice.total || 0).toLocaleString("fr-CM")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-8">
            <div className="w-64 space-y-3">
              <div className="flex justify-between border-b pb-3 text-2xl font-black">
                <span>Total</span>
                <span className="text-emerald-600">FCFA {Number(invoice.total || 0).toLocaleString("fr-CM")}</span>
              </div>
              <p className="text-xs text-center text-slate-400">Thank you for your business.</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}