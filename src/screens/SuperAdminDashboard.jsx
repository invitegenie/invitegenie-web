import { useState, useEffect } from "react";
﻿import { Link } from "react-router-dom";
import { SUPER_ADMIN_PERMISSIONS } from "../services/roles";
import { seedDemoData } from "../auth/coreEngine";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";
import { getMarketplaceProviders } from "../services/mockData";
import { getPayments } from "../services/paymentGatewayService";
import { getEscrowRecords } from "../services/escrowService";
import { getMarketplaceOrders } from "../services/ticketingService";

export default function SuperAdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [escrows, setEscrows] = useState([]);

  useEffect(() => {
    setUsersCount((Engine.getCollection(KEYS.USERS) || []).length);
    setVendors(getMarketplaceProviders() || []);
    setPayments(getPayments() || []);
    setOrders(getMarketplaceOrders() || []);
    setEscrows(getEscrowRecords() || []);
  }, []);

  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const pendingPayments = payments.filter(p => p.status === 'pending_verification').length;
  const escrowVolume = escrows.filter(e => e.status === 'held').reduce((s, e) => s + e.amount, 0);
  const reportedContentCount = 0; // Placeholder
  const auditLogCount = 124; // Placeholder

  const ACTION_MODULES = [
    { title: "User Registry", path: "/admin/users", icon: "group", value: `${usersCount} accounts`, alert: false },
    { title: "Vendor Approvals", path: "/admin/vendors", icon: "storefront", value: `${pendingVendors} pending`, alert: pendingVendors > 0 },
    { title: "Payment Verification", path: "/admin/payments", icon: "payments", value: `${pendingPayments} pending`, alert: pendingPayments > 0 },
    { title: "Withdrawals & Payouts", path: "/admin/withdrawals", icon: "account_balance", value: "Manage payouts", alert: false },
    { title: "Marketplace Orders", path: "/admin/events", icon: "shopping_cart", value: `${orders.length} total orders`, alert: false },
    { title: "Storefront Listings", path: "/admin/marketplace", icon: "inventory_2", value: "Moderate products", alert: false },
    { title: "Reported Content", path: "/admin/feed", icon: "report", value: `${reportedContentCount} flagged`, alert: reportedContentCount > 0 },
    { title: "System Audit Logs", path: "/admin/audit-logs", icon: "manage_search", value: `${auditLogCount} events`, alert: false },
  ];

  const handleRestoreData = async () => {
    if (window.confirm("Are you sure you want to completely wipe and restore all demo data? This cannot be undone.")) {
      await seedDemoData();
      alert("Demo data fully restored! The page will now refresh.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-400/10 to-orange-400/5 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">God Mode Status</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Sovereign Control Center
        </h1>
      <p className="mt-4 max-w-4xl text-sm leading-6 text-amber-50/75">
        Launch control operations. Monitor users, verify marketplace vendors, process manual payments, and oversee global platform health.
        </p>
      </header>

    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Metric label="Total Users" value={usersCount} icon="group" />
      <Metric label="Active Vendors" value={vendors.filter(v => v.status === 'approved').length} icon="storefront" />
      <Metric label="Total Orders" value={orders.length} icon="receipt_long" />
      <Metric label="Escrow Value" value={`FCFA ${escrowVolume.toLocaleString()}`} icon="account_balance" alert={escrowVolume > 0} />
      <Metric label="Account Tier" value="God Mode" icon="security" />
      </section>

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ACTION_MODULES.map((module) => (
          <Link
            key={module.path}
            to={module.path}
          className={`rounded-2xl border ${module.alert ? 'border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-white/10 bg-[#0D1320] hover:bg-white/[0.04]'} p-5 transition-all`}
          >
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${module.alert ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-amber-200'}`}>
              <span className="material-symbols-outlined">{module.icon}</span>
            </div>
            <h2 className="mt-5 font-black text-white">{module.title}</h2>
          <p className={`mt-1 text-sm font-bold ${module.alert ? 'text-amber-400' : 'text-slate-400'}`}>{module.value}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-black text-white">Production security checklist</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add Supabase Phone MFA, server-side admin checks, RLS policies, and immutable audit logs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRestoreData}
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-rose-400 transition hover:bg-rose-500 hover:text-white"
            >
              <span className="material-symbols-outlined text-base">restore</span>
              Restore Demo Data
            </button>
            <Link
              to="/admin/roles"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#070A12] transition hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Configure Roles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, icon, alert }) {
  return (
    <div className={`rounded-2xl border ${alert ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 bg-[#0D1320]'} p-5`}>
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${alert ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-amber-200'}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={`mt-2 truncate text-2xl font-black ${alert ? 'text-amber-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
