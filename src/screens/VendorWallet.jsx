import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getMarketplaceProviders } from "../services/mockData";
import { getMarketplaceOrdersForSeller } from "../services/ticketingService";

export default function VendorWallet() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const myOrders = useMemo(() => getMarketplaceOrdersForSeller(currentUser?.id), [currentUser]);
  const totalEarnings = useMemo(() => myOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0), [myOrders]);
  const pendingPayouts = totalEarnings * 0.15; // Mock pending amount
  const withdrawable = totalEarnings - pendingPayouts;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8 pb-32 pt-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Financial Overview</p>
            <h1 className="mt-2 text-3xl font-black text-white">Vendor Wallet</h1>
            <p className="mt-2 text-sm text-slate-400">Track your earnings, manage payouts, and view transaction history.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/withdrawals")} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-950 shadow-lg hover:opacity-90">
              Request Payout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Icon name="account_balance_wallet" className="text-[24px]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available Balance</p>
            <p className="mt-2 text-3xl font-black text-white">FCFA {withdrawable.toLocaleString()}</p>
          </div>
          
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <Icon name="pending" className="text-[24px]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pending Clearance</p>
            <p className="mt-2 text-3xl font-black text-white">FCFA {pendingPayouts.toLocaleString()}</p>
          </div>
          
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
              <Icon name="insights" className="text-[24px]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Lifetime Earnings</p>
            <p className="mt-2 text-3xl font-black text-white">FCFA {totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl">
            <h2 className="mb-6 text-lg font-bold text-white">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="pb-4 pr-4">Date</th>
                    <th className="pb-4 pr-4">Description</th>
                    <th className="pb-4 pr-4">Status</th>
                    <th className="pb-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myOrders.length > 0 ? myOrders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="py-4 pr-4 text-slate-400">{new Date(order.timestamp).toLocaleDateString()}</td>
                      <td className="py-4 pr-4 text-white">{order.listingTitle || "Service Booking"}</td>
                      <td className="py-4 pr-4">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald-400">Completed</span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-400">+ FCFA {Number(order.amount).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500">No transactions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl h-fit">
            <h2 className="mb-6 text-lg font-bold text-white">Quick Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Profile Views</span><span className="font-bold text-white">342</span></div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5"><div className="h-full w-3/4 bg-violet-500"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Quote Conversions</span><span className="font-bold text-white">68%</span></div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5"><div className="h-full w-[68%] bg-emerald-500"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Avg. Rating</span><span className="font-bold text-amber-400">4.9 â˜…</span></div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5"><div className="h-full w-[98%] bg-amber-400"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}