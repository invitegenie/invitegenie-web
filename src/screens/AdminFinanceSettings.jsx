import React, { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

export default function AdminFinanceSettings() {
  const defaultAccounts = {
    mtn_momo: { number: "+237 670 00 00 00", name: "INVITEGENIE SARL" },
    orange_money: { number: "+237 690 00 00 00", name: "INVITEGENIE SARL" },
    bank: { name: "UBA Cameroon", number: "10033 00011 00000001234 56", holder: "InviteGenie Pay" }
  };

  const [accounts, setAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("demo_invitegenie_receiving_accounts")) || defaultAccounts; } 
    catch { return defaultAccounts; }
  });

  const handleSave = () => {
    localStorage.setItem("demo_invitegenie_receiving_accounts", JSON.stringify(accounts));
    alert("Finance settings saved securely.");
  };

  const handleNestedChange = (provider, field, value) => {
    setAccounts(prev => ({ ...prev, [provider]: { ...prev[provider], [field]: value } }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-400">Settings</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Platform Finance Rules</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-white/10 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Icon name="phone_iphone" className="text-yellow-500" /> MTN Mobile Money</h2>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400">MoMo Merchant Number</label>
            <input value={accounts.mtn_momo.number} onChange={e => handleNestedChange("mtn_momo", "number", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
            <label className="block text-xs font-bold text-slate-400">Account Display Name</label>
            <input value={accounts.mtn_momo.name} onChange={e => handleNestedChange("mtn_momo", "name", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Icon name="phone_iphone" className="text-orange-500" /> Orange Money</h2>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400">OM Merchant Number</label>
            <input value={accounts.orange_money.number} onChange={e => handleNestedChange("orange_money", "number", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
            <label className="block text-xs font-bold text-slate-400">Account Display Name</label>
            <input value={accounts.orange_money.name} onChange={e => handleNestedChange("orange_money", "name", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
          </div>
        </div>

        <div className="bg-[#111827] border border-white/10 p-6 rounded-3xl shadow-xl md:col-span-2">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Icon name="account_balance" className="text-blue-400" /> Corporate Bank Account</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400">Bank Name</label>
              <input value={accounts.bank.name} onChange={e => handleNestedChange("bank", "name", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mt-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400">Account Number (RIB/IBAN)</label>
              <input value={accounts.bank.number} onChange={e => handleNestedChange("bank", "number", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mt-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400">Account Holder</label>
              <input value={accounts.bank.holder} onChange={e => handleNestedChange("bank", "holder", e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="px-8 py-3 bg-violet-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-violet-500 transition-colors">Save Configurations</button>
      </div>
    </div>
  );
}