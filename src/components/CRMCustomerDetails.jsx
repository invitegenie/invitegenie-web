import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getCustomer, saveCustomer, getInvoices } from "../services/vendorCRMService";
import { CustomerNotesPanel, InvoiceCard } from "../components/CRMComponents";

export default function CRMCustomerDetails() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "demo-user";
  
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const data = getCustomer(customerId);
    if (data && String(data.ownerId) === String(userId)) {
      setCustomer(data);
      setInvoices(getInvoices(userId).filter(i => String(i.customerId) === String(data.id) || i.customerName === data.fullName));
    }
  }, [customerId, userId]);

  const handleWhatsApp = () => {
    if (!customer?.phone) return alert("No phone number saved for this customer.");
    const digits = String(customer.phone).replace(/\D/g, "");
    window.open(`https://wa.me/${digits}?text=Hello ${encodeURIComponent(customer.fullName)}, `, "_blank");
  };

  if (!customer) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-white">
          <p>Customer not found.</p>
          <button onClick={() => navigate("/vendor-crm")} className="mt-4 text-violet-400">Back to CRM</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 pb-28 pt-4 px-4 sm:px-6">
        <button onClick={() => navigate("/vendor-crm")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
          <Icon name="arrow_back" className="text-lg" /> Back to CRM
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Profile Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-2xl text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-emerald-400 text-3xl font-black text-white shadow-lg">
                {customer.fullName.substring(0, 2).toUpperCase()}
              </div>
              <h1 className="mt-4 text-2xl font-black text-white">{customer.fullName}</h1>
              <p className="text-sm text-slate-400">{customer.email || "No email"}</p>
              <p className="text-sm text-slate-400">{customer.phone || "No phone"}</p>
              
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={handleWhatsApp} className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition">
                  <Icon name="chat" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition">
                  <Icon name="mail" />
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Customer Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Total Bookings</span>
                  <span className="font-bold text-white">{customer.totalBookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Total Spent</span>
                  <span className="font-bold text-emerald-400">FCFA {Number(customer.totalSpent || 0).toLocaleString("fr-CM")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Last Active</span>
                  <span className="font-bold text-white">{customer.lastBookingAt ? new Date(customer.lastBookingAt).toLocaleDateString() : "Never"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerNotesPanel entityId={customer.id} ownerId={userId} />

            <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Invoices & History</h3>
                <button onClick={() => navigate("/vendor-crm")} className="text-xs font-bold text-violet-400 hover:underline">New Invoice</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {invoices.map(i => (
                  <InvoiceCard key={i.id} invoice={i} onClick={() => navigate(`/vendor-crm/invoices/${i.id}`)} />
                ))}
                {invoices.length === 0 && <p className="text-xs text-slate-500 italic">No invoices linked to this customer.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}