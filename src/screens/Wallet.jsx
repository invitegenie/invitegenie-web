import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

export default function Wallet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Transactions");

  const transactions = [
    { id: 1, title: "Early Bird Ticket - Douala Afro Beats Festival", amount: 5000, type: "credit", date: "2026-05-01", status: "Completed" },
    { id: 2, title: "Refund Processed", amount: 1500, type: "debit", date: "2026-04-28", status: "Completed" },
    { id: 3, title: "Sponsorship Payment", amount: 25000, type: "credit", date: "2026-04-20", status: "Completed" },
    { id: 4, title: "Venue Booking Fee", amount: 10000, type: "debit", date: "2026-04-15", status: "Completed" },
    { id: 5, title: "Marketplace Order Payment", amount: 15000, type: "debit", date: "2026-04-10", status: "Completed" },
  ];

  const linkedAccounts = [
    { id: 1, provider: "MTN Mobile Money", account: "+237 670 000 000", status: "Active" },
    { id: 2, provider: "Orange Money", account: "+237 690 000 000", status: "Active" }
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 pb-32 pt-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Financial Hub</p>
            <h1 className="mt-2 text-3xl font-black text-white">My Wallet</h1>
            <p className="mt-2 text-sm text-slate-400">Manage your funds, track payments, and handle payouts securely.</p>
          </div>
          <button onClick={() => alert("Add funds modal opened")} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition">
            <Icon name="add_circle" className="text-[18px]" /> Add Funds
          </button>
        </header>

        <div className="bg-slate-900 border border-emerald-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Balance</p>
          <p className="text-5xl font-black text-white">FCFA 50,000</p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-4">
          {["Transactions", "Withdrawals", "Linked Accounts"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-violet-600 text-white shadow-md' : 'bg-[#111827] border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl min-h-[400px] relative">
          {activeTab === "Transactions" && (
            <div className="space-y-4">
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-white/5 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      <Icon name={t.type === 'credit' ? 'arrow_downward' : 'arrow_upward'} className="text-[20px]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.title}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${t.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                      {t.type === 'credit' ? '+' : '-'} FCFA {t.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Withdrawals" && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Icon name="account_balance" className="text-5xl text-slate-600 mb-4" />
              <p className="text-white font-bold mb-2">Withdrawal History</p>
              <p className="text-sm text-slate-400 mb-6 max-w-md">Transfer your wallet balance to your connected mobile money or bank account.</p>
              <button onClick={() => navigate("/withdrawals")} className="px-6 py-3 bg-violet-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-500 transition shadow-lg">
                Request Withdrawal
              </button>
            </div>
          )}

          {activeTab === "Linked Accounts" && (
            <div className="space-y-4">
              {linkedAccounts.map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Icon name="account_balance" className="text-slate-400 text-[24px]" />
                    <div>
                      <p className="text-sm font-bold text-white">{acc.provider}</p>
                      <p className="text-xs text-slate-400 mt-1">{acc.account}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {acc.status}
                  </span>
                </div>
              ))}
              <button onClick={() => alert("Add Account flow")} className="w-full p-4 border border-dashed border-white/20 rounded-2xl text-slate-400 text-sm font-bold hover:text-white hover:border-violet-500 hover:bg-violet-500/5 transition">
                + Add Linked Account
              </button>
            </div>
          )}

          {/* Floating Action Button */}
          <div className="absolute bottom-6 right-6">
            <button onClick={() => navigate("/withdrawals")} className="w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 active:scale-95 transition-transform" title="Withdraw Funds">
              <Icon name="payments" className="text-[24px]" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}