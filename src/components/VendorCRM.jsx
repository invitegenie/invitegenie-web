import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getAccountType } from "../services/accountCapabilities";
import PlanLimitModal from "../components/PlanLimitModal";
import {
  checkCRMLimit,
  getLeads,
  getCustomers,
  getFollowUps,
  getInvoices,
  saveLead,
  saveCustomer,
  saveFollowUp,
  saveInvoice
} from "../services/vendorCRMService";
import { sendDesktopNotification } from "../services/browserNotificationService";
import { CRMStatCard, LeadCard, CustomerCard, FollowUpCard, InvoiceCard, CRMRevenueChart } from "../components/CRMComponents";

const TABS = ["Overview", "Leads", "Customers", "Follow-ups", "Invoices", "Revenue"];

export default function VendorCRM() {
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const userId = currentUser?.id || "demo-user";
  const accountType = getAccountType(profile || currentUser);
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [limitModal, setLimitModal] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLeads(getLeads(userId));
    setCustomers(getCustomers(userId));
    setFollowUps(getFollowUps(userId));
    setInvoices(getInvoices(userId));
  }, [userId, refresh]);

  const handleAddLead = () => {
    const gate = checkCRMLimit(userId, accountType, "leads");
    if (!gate.allowed) return setLimitModal(gate);
    
    const name = prompt("Enter lead customer name:");
    if (!name) return;
    
    saveLead({
      ownerId: userId,
      customerName: name,
      source: "manual",
      interestedService: "General Inquiry",
      estimatedValue: 50000,
      status: "new",
      priority: "medium",
      notes: []
    });
    
    sendDesktopNotification("New Lead Captured 🎯", {
      body: `${name} has been added to your CRM pipeline.`
    });
    
    setRefresh(r => r + 1);
  };

  const handleAddCustomer = () => {
    const gate = checkCRMLimit(userId, accountType, "customers");
    if (!gate.allowed) return setLimitModal(gate);
    
    const name = prompt("Enter customer full name:");
    if (!name) return;
    
    const created = saveCustomer({
      ownerId: userId,
      fullName: name,
      email: "",
      phone: "",
      city: "",
      totalBookings: 0,
      totalSpent: 0,
      tags: [],
      notes: []
    });
    navigate(`/vendor-crm/customers/${created.id}`);
  };

  const handleAddInvoice = () => {
    const gate = checkCRMLimit(userId, accountType, "invoices");
    if (!gate.allowed) return setLimitModal(gate);
    
    const customerName = prompt("Enter customer name for invoice:");
    if (!customerName) return;

    const created = saveInvoice({
      ownerId: userId,
      customerName,
      invoiceNumber: `INV-IG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      currency: "FCFA",
      status: "draft",
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0,10)
    });
    navigate(`/vendor-crm/invoices/${created.id}`);
  };

  const completeFollowUp = (fu) => {
    saveFollowUp({ ...fu, status: "completed" });
    setRefresh(r => r + 1);
  };

  // Derived metrics
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total || 0), 0);
  const unpaidRevenue = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + Number(i.total || 0), 0);
  const pendingFollowups = followUps.filter(f => f.status === 'pending');
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status));

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 pb-28 pt-4 px-4 sm:px-6">
        <header className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">Business Operating System</p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Vendor CRM</h1>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl">Manage your leads, client relationships, follow-ups, and invoicing in one secure place.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Icon name="search" className="absolute left-3 top-3 text-sm text-slate-500" />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search CRM..." 
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:border-violet-500" 
                />
              </div>
              <button onClick={() => navigate("/genie")} className="flex shrink-0 items-center justify-center rounded-xl bg-violet-600/20 p-2.5 text-violet-400 hover:bg-violet-600 hover:text-white transition" title="Ask Genie">
                <Icon name="auto_awesome" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "bg-[#111827] border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Routing */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                <CRMStatCard label="Active Leads" value={activeLeads.length} icon="leaderboard" color="text-blue-400" bg="bg-blue-400/10" />
                <CRMStatCard label="Customers" value={customers.length} icon="groups" color="text-emerald-400" bg="bg-emerald-400/10" />
                <CRMStatCard label="Follow-ups" value={pendingFollowups.length} icon="notifications_active" color="text-amber-400" bg="bg-amber-400/10" />
                <CRMStatCard label="Invoices Sent" value={invoices.length} icon="receipt_long" color="text-violet-400" bg="bg-violet-400/10" />
                <CRMStatCard label="Unpaid Revenue" value={`FCFA ${(unpaidRevenue/1000).toFixed(1)}k`} icon="pending_actions" color="text-rose-400" bg="bg-rose-400/10" />
                <CRMStatCard label="Paid Revenue" value={`FCFA ${(totalRevenue/1000).toFixed(1)}k`} icon="account_balance_wallet" color="text-emerald-400" bg="bg-emerald-400/10" />
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-white">Recent Leads</h2>
                    <button onClick={() => setActiveTab("Leads")} className="text-xs font-bold text-violet-400 hover:underline">View All</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {leads.slice(0,4).map(l => <LeadCard key={l.id} lead={l} onClick={() => navigate(`/vendor-crm/leads/${l.id}`)} />)}
                    {leads.length === 0 && <p className="text-sm text-slate-500">No leads yet. Create one or wait for marketplace inquiries.</p>}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl flex flex-col">
                  <h2 className="text-lg font-black text-white mb-6">Upcoming Follow-ups</h2>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {pendingFollowups.slice(0,5).map(f => <FollowUpCard key={f.id} followup={f} onComplete={completeFollowUp} />)}
                    {pendingFollowups.length === 0 && <p className="text-sm text-slate-500">You're all caught up!</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Leads" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Lead Pipeline</h2>
                <button onClick={handleAddLead} className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500 shadow-lg">
                  + Add Lead
                </button>
              </div>
              {/* Simple Kanban Board */}
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {["new", "contacted", "qualified", "proposal_sent", "won", "lost"].map(status => {
                  const columnLeads = leads.filter(l => l.status === status && (l.customerName.toLowerCase().includes(searchQuery.toLowerCase())));
                  return (
                    <div key={status} className="w-72 shrink-0 rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex flex-col max-h-[600px]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{status.replace("_", " ")}</h3>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">{columnLeads.length}</span>
                      </div>
                      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {columnLeads.map(l => <LeadCard key={l.id} lead={l} onClick={() => navigate(`/vendor-crm/leads/${l.id}`)} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "Customers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Customer Directory</h2>
                <button onClick={handleAddCustomer} className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500 shadow-lg">
                  + Add Customer
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {customers.filter(c => c.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                  <CustomerCard key={c.id} customer={c} onClick={() => navigate(`/vendor-crm/customers/${c.id}`)} />
                ))}
                {customers.length === 0 && <p className="col-span-full text-slate-500 py-10 text-center">No customers found.</p>}
              </div>
            </div>
          )}

          {activeTab === "Follow-ups" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Tasks & Follow-ups</h2>
                <button onClick={() => alert("Open new follow-up modal")} className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10">
                  + Schedule Task
                </button>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl space-y-4">
                {followUps.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                  <FollowUpCard key={f.id} followup={f} onComplete={completeFollowUp} />
                ))}
                {followUps.length === 0 && <p className="text-slate-500 text-center py-10">No follow-ups scheduled.</p>}
              </div>
            </div>
          )}

          {activeTab === "Invoices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Invoices</h2>
                <button onClick={handleAddInvoice} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-500 shadow-lg">
                  + Create Invoice
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {invoices.filter(i => i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || i.customerName.toLowerCase().includes(searchQuery.toLowerCase())).map(i => (
                  <InvoiceCard key={i.id} invoice={i} onClick={() => navigate(`/vendor-crm/invoices/${i.id}`)} />
                ))}
                {invoices.length === 0 && <p className="col-span-full text-slate-500 py-10 text-center">No invoices created yet.</p>}
              </div>
            </div>
          )}

          {activeTab === "Revenue" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Revenue Tracking</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CRMRevenueChart invoices={invoices} />
                </div>
                <div className="space-y-6">
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Total Collected</p>
                    <p className="mt-2 text-4xl font-black text-white">FCFA {totalRevenue.toLocaleString("fr-CM")}</p>
                  </div>
                  <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 shadow-xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Awaiting Payment</p>
                    <p className="mt-2 text-4xl font-black text-white">FCFA {unpaidRevenue.toLocaleString("fr-CM")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PlanLimitModal open={Boolean(limitModal)} limit={limitModal} onClose={() => setLimitModal(null)} />
    </Layout>
  );
}