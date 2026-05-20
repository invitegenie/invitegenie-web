import React, { useState, useEffect } from 'react';

const SETTINGS_KEY = 'demo_finance_settings';
const ACCOUNTS_KEY = 'demo_invitegenie_receiving_accounts';

export default function FinanceSettingsPanel() {
  const [settings, setSettings] = useState({});
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    setSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    setAccounts(JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'));
  }, []);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    alert('Finance settings saved.');
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex flex-col gap-4">
      <div className="text-lg font-bold text-indigo-300">Finance Settings</div>
      <div className="flex flex-col gap-2">
        <label className="text-sm">MTN MoMo Number</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.mtnMoMoNumber || ''} onChange={e => setAccounts(a => ({ ...a, mtnMoMoNumber: e.target.value }))} />
        <label className="text-sm">MTN Account Name</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.mtnAccountName || ''} onChange={e => setAccounts(a => ({ ...a, mtnAccountName: e.target.value }))} />
        <label className="text-sm">Orange Money Number</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.orangeMoneyNumber || ''} onChange={e => setAccounts(a => ({ ...a, orangeMoneyNumber: e.target.value }))} />
        <label className="text-sm">Orange Account Name</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.orangeAccountName || ''} onChange={e => setAccounts(a => ({ ...a, orangeAccountName: e.target.value }))} />
        <label className="text-sm">Bank Name</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.bankName || ''} onChange={e => setAccounts(a => ({ ...a, bankName: e.target.value }))} />
        <label className="text-sm">Bank Account Name</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.bankAccountName || ''} onChange={e => setAccounts(a => ({ ...a, bankAccountName: e.target.value }))} />
        <label className="text-sm">Bank Account Number</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.bankAccountNumber || ''} onChange={e => setAccounts(a => ({ ...a, bankAccountNumber: e.target.value }))} />
        <label className="text-sm">Wave Account</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.waveAccount || ''} onChange={e => setAccounts(a => ({ ...a, waveAccount: e.target.value }))} />
        <label className="text-sm">CinetPay Merchant</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.cinetPayMerchant || ''} onChange={e => setAccounts(a => ({ ...a, cinetPayMerchant: e.target.value }))} />
        <label className="text-sm">Flutterwave Merchant</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.flutterwaveMerchant || ''} onChange={e => setAccounts(a => ({ ...a, flutterwaveMerchant: e.target.value }))} />
        <label className="text-sm">Paystack Merchant</label>
        <input className="bg-gray-800 text-white rounded px-2 py-1" value={accounts.paystackMerchant || ''} onChange={e => setAccounts(a => ({ ...a, paystackMerchant: e.target.value }))} />
      </div>
      <button className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700" onClick={handleSave}>Save Settings</button>
    </div>
  );
}
