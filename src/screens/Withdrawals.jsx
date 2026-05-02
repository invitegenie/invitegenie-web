import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasPermission } from "../services/roles";
import * as Engine from "../auth/coreEngine";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

const DEMO_WITHDRAWALS_KEY = "demo_withdrawals";

const INITIAL_WITHDRAWALS = [
  {
    id: "w-101",
    userId: "marie.user@invitegenie.cm",
    userName: "Marie Ngalle",
    role: "event_planner",
    amount: 250000,
    method: "Bank Transfer",
    account: "Afriland Bank - 0011223344",
    accountName: "Marie Ngalle",
    status: "Completed",
    reference: "REF-BK-250K",
    createdAt: "2026-04-22T10:00:00Z",
  },
  {
    id: "w-102",
    userId: "marie.user@invitegenie.cm",
    userName: "Marie Ngalle",
    role: "event_planner",
    amount: 300000,
    method: "Orange Money",
    account: "+237 690 11 22 33",
    accountName: "Marie Ngalle",
    status: "Pending",
    reference: "REF-OM-300K",
    createdAt: "2026-04-20T14:30:00Z",
  },
  {
    id: "w-103",
    userId: "marie.user@invitegenie.cm",
    userName: "Marie Ngalle",
    role: "event_planner",
    amount: 1150000,
    method: "MTN Mobile Money",
    account: "+237 670 44 55 66",
    accountName: "Marie Ngalle",
    status: "Failed",
    reference: "REF-MOMO-1.15M",
    createdAt: "2026-04-18T09:15:00Z",
  },
  {
    id: "w-104",
    userId: "marie.user@invitegenie.cm",
    userName: "Marie Ngalle",
    role: "event_planner",
    amount: 700000,
    method: "Bank Transfer",
    account: "UBA Cameroon - 9988776655",
    accountName: "Marie Ngalle",
    status: "Completed",
    reference: "REF-BK-700K",
    createdAt: "2026-04-12T16:45:00Z",
  },
];

export default function Withdrawals() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  const { currentUser, profile } = useAuth();
  const user = currentUser || Engine.getCurrentUser();
  const isPayoutAdmin = hasPermission(profile || user?.role, "manage_payouts");

  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState("All");
  
  // Stats state
  const [availableBalance, setAvailableBalance] = useState(1250000);
  const totalEarnings = 7350000;

  // Form State
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MTN Mobile Money");
  const [account, setAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Initialize or load demo withdrawals
    const stored = localStorage.getItem(DEMO_WITHDRAWALS_KEY);
    if (!stored) {
      localStorage.setItem(DEMO_WITHDRAWALS_KEY, JSON.stringify(INITIAL_WITHDRAWALS));
      setWithdrawals(INITIAL_WITHDRAWALS);
    } else {
      setWithdrawals(JSON.parse(stored));
    }
  }, []);

  const handleRequestPayout = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg("Amount must be greater than 0.");
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMsg("Amount cannot exceed available balance.");
      return;
    }
    if (!account || !accountName) {
      setErrorMsg("Please fill all required account details.");
      return;
    }

    const newWithdrawal = {
      id: `w-${Date.now()}`,
      userId: user.id,
      userName: user.full_name || "InviteGenie User",
      role: user.role,
      amount: numAmount,
      method,
      account,
      accountName,
      notes,
      status: "Pending",
      reference: `REF-${method.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newWithdrawal, ...withdrawals];
    setWithdrawals(updated);
    localStorage.setItem(DEMO_WITHDRAWALS_KEY, JSON.stringify(updated));
    setAvailableBalance(prev => prev - numAmount);
    
    setAmount("");
    setAccount("");
    setAccountName("");
    setNotes("");
    setSuccessMsg("Payout request submitted successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleAdminAction = (id, newStatus) => {
    const updated = withdrawals.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: newStatus,
          reviewedBy: user.id,
          reviewedAt: new Date().toISOString()
        };
      }
      return w;
    });
    setWithdrawals(updated);
    localStorage.setItem(DEMO_WITHDRAWALS_KEY, JSON.stringify(updated));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Failed": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Filter withdrawals: admins see all, normal users see their own
  const visibleWithdrawals = withdrawals.filter(w => {
    if (!isPayoutAdmin && w.userId !== user?.id) return false;
    if (filter !== "All" && w.status !== filter) return false;
    return true;
  });

  const pendingTotal = withdrawals.filter(w => w.status === "Pending" && (isPayoutAdmin || w.userId === user?.id)).reduce((acc, w) => acc + w.amount, 0);
  const completedTotal = withdrawals.filter(w => w.status === "Completed" && (isPayoutAdmin || w.userId === user?.id)).reduce((acc, w) => acc + w.amount, 0);

  const Wrapper = isAdminRoute ? "div" : Layout;
  const wrapperProps = isAdminRoute ? {} : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8 font-sans">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {isPayoutAdmin ? "Payout Control Center" : "My Withdrawals"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage payouts from ticket sales, marketplace orders and service earnings
            </p>
          </div>
          {isPayoutAdmin && (
            <div className="rounded-xl bg-violet-600/10 px-4 py-2 border border-violet-500/20">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Admin Mode Active</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
                <Icon name="account_balance_wallet" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Available Balance</p>
            <p className="mt-1 text-2xl font-black text-white">FCFA {availableBalance.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                <Icon name="hourglass_empty" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Pending</p>
            <p className="mt-1 text-2xl font-black text-white">FCFA {pendingTotal.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Icon name="check_circle" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Completed</p>
            <p className="mt-1 text-2xl font-black text-white">FCFA {completedTotal.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                <Icon name="trending_up" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">Total Earnings</p>
            <p className="mt-1 text-2xl font-black text-white">FCFA {totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Request Form (Hidden if strict admin only and not requesting for self, but usually hybrid roles exist) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white">Request Payout</h2>
              <form onSubmit={handleRequestPayout} className="mt-6 space-y-4">
                
                {successMsg && (
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Withdrawal Amount (FCFA)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Paystack">Paystack</option>
                    <option value="Flutterwave">Flutterwave</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Account / Phone Number</label>
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="e.g. +237 6XX XXX XXX"
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. Marie Ngalle"
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional details..."
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
                    rows="2"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
                >
                  Request Payout
                </button>
              </form>
            </div>
            
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#111827] to-[#0B0F19] p-6 text-center">
              <Icon name="shield" className="text-3xl text-violet-400/50 mb-3" />
              <p className="text-xs font-medium text-slate-400">
                Africa's trusted payout network — secure via InviteGenie Escrow.
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111827] shadow-xl overflow-hidden">
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                  {isPayoutAdmin && (
                    <div className="flex space-x-2">
                      {["All", "Pending", "Completed", "Failed"].map(f => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filter === f ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {isPayoutAdmin && (
                  <p className="mt-2 text-xs text-amber-400/80">
                    Demo payout controls — connect to Supabase and payment provider before production.
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0B0F19] text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      {isPayoutAdmin && <th className="px-6 py-4 font-semibold">User</th>}
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Method & Account</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      {isPayoutAdmin && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {visibleWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={isPayoutAdmin ? 6 : 4} className="p-8 text-center text-slate-500">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      visibleWithdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            <div className="text-[10px] text-slate-500 mt-1">{w.reference}</div>
                          </td>
                          {isPayoutAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-white">{w.userName}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{w.userId}</div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                            FCFA {w.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{w.method}</div>
                            <div className="text-xs text-slate-500 mt-1">{w.account}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(w.status)}`}>
                              {w.status}
                            </span>
                          </td>
                          {isPayoutAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {w.status === "Pending" ? (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleAdminAction(w.id, "Completed")} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500/20 transition" title="Approve & Mark Paid">
                                    <Icon name="check" className="text-sm" />
                                  </button>
                                  <button onClick={() => handleAdminAction(w.id, "Failed")} className="rounded-lg bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition" title="Reject">
                                    <Icon name="close" className="text-sm" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600">Reviewed</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Wrapper>
  );
}
