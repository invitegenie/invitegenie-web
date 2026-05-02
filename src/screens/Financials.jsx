import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { USER_ROLES } from "../services/roles";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { useSearch } from "../contexts/SearchContext";

// Local Helper for FCFA Formatting
const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount).replace('FCFA', 'FCFA ');
};

// Component: Summary Card
const SummaryCard = ({ label, value, trend, icon, highlight, color = "text-violet-400" }) => (
  <div className={`p-6 rounded-[2rem] border border-[#2A3342] bg-[#111827] transition-all hover:border-[#8B5CF6]/50 shadow-lg flex flex-col justify-between h-full ${highlight ? 'ring-1 ring-[#8B5CF6]/40' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${highlight ? 'bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white' : `bg-[#1F2937] ${color}`}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${trend.startsWith('+') ? 'bg-emerald-500/10 text-[#22C55E]' : 'bg-rose-500/10 text-rose-400'}`}>
        {trend}
      </div>
    </div>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-purple-200' : 'text-slate-500'}`}>{label}</p>
      <h3 className="text-2xl font-bold text-white">{formatFCFA(value)}</h3>
    </div>
  </div>
);

export default function Financials() {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  
  const { searchQuery, setSearchQuery } = useSearch();
  const [timeFilter, setTimeFilter] = useState("All Time");

  const events = useEngineCollection(KEYS.EVENTS);
  const payments = useEngineCollection(KEYS.PAYMENTS);

  const PLATFORM_FEE_RATE = 0.10; // 10% Platform Fee

  const transactions = useMemo(() => {
    return (payments || []).map(p => {
      const event = (events || []).find(e => e.id === p.eventId);
      return {
        ...p,
        eventTitle: event?.title || "Unknown Event",
        hostId: p.hostId || event?.hostId,
        platformFee: p.amount * PLATFORM_FEE_RATE,
        hostNet: p.amount * (1 - PLATFORM_FEE_RATE)
      };
    });
  }, [payments, events]);

  const canAccess = [USER_ROLES.SUPER_ADMIN, USER_ROLES.APP_ADMIN, USER_ROLES.FINANCE_ADMIN, USER_ROLES.EVENT_HOST].includes(role);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesOwner = role === USER_ROLES.EVENT_HOST
        ? String(t.hostId || "") === String(currentUser?.id || "")
        : true;
      const matchesSearch = t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (t.id || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOwner && matchesSearch;
    });
  }, [searchQuery, transactions, role, currentUser]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      acc.totalGross += curr.amount;
      acc.totalFees += curr.platformFee;
      acc.totalPayouts += curr.hostNet;
      return acc;
    }, { totalGross: 0, totalFees: 0, totalPayouts: 0 });
  }, [filteredTransactions]);

  // Data grouped by event for the analytics breakdown
  const eventFinancials = useMemo(() => {
    const grouped = {};
    filteredTransactions.forEach(t => {
      if (!grouped[t.eventId]) {
        grouped[t.eventId] = { title: t.eventTitle, sales: 0, fees: 0, payouts: 0 };
      }
      grouped[t.eventId].sales += t.amount;
      grouped[t.eventId].fees += t.platformFee;
      grouped[t.eventId].payouts += t.hostNet;
    });
    return Object.values(grouped).sort((a, b) => b.sales - a.sales);
  }, [filteredTransactions]);

  if (!canAccess) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
             <span className="material-symbols-outlined text-rose-500 text-4xl">lock</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Access Restricted</h2>
          <p className="text-slate-500 max-w-sm">You do not have the required permissions to view the Financials dashboard.</p>
          <button onClick={() => navigate("/dashboard")} className="mt-8 px-10 py-3 bg-[#1F2937] border border-[#2A3342] rounded-xl text-white font-bold hover:bg-[#2A3342] transition-all">Back to Dashboard</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-8 pb-28 font-sans animate-in fade-in duration-500">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tighter uppercase">Financial Operations</h1>
            <p className="text-[#9CA3AF] text-xs mt-1 uppercase font-bold tracking-wider">Global Platform Ledger â€¢ 10% Service Fee</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-5 py-2.5 rounded-xl border border-[#2A3342] bg-[#111827] text-[10px] font-bold uppercase text-[#9CA3AF] hover:text-white transition-all flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">download</span>
               Export Report
             </button>
             <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-[10px] font-bold uppercase shadow-lg shadow-purple-900/40 hover:opacity-90 transition-all">
               Processing Console
             </button>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Platform Sales (Gross)" value={totals.totalGross} trend="+12.5%" icon="payments" highlight />
          <SummaryCard label="Commission Earned (Fees)" value={totals.totalFees} trend="+12.5%" icon="stars" color="text-[#22C55E]" />
          <SummaryCard label="Total Host Payouts" value={totals.totalPayouts} trend="+12.5%" icon="account_balance_wallet" color="text-[#A78BFA]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Transactions Table */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-[#111827] border border-[#2A3342] rounded-[2rem] overflow-hidden shadow-lg">
              <div className="p-6 border-b border-[#2A3342] flex flex-wrap items-center justify-between gap-4 bg-[#151A25]">
                <div>
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transaction Ledger</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Real-time Ticket Settlement</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2 text-[#6B7280] text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="Invoice or Event..." 
                      className="bg-[#0B0F19] border border-[#2A3342] rounded-xl pl-9 pr-4 py-2 text-xs text-gray-300 outline-none w-48 focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-[#0B0F19] border border-[#2A3342] rounded-xl px-3 py-2 text-[10px] font-bold text-[#9CA3AF] outline-none"
                  >
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>This Week</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0B0F19] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Invoice</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4 text-right">Fee (10%)</th>
                      <th className="px-6 py-4 text-right">Net Payout</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A3342]">
                    {filteredTransactions.map((row) => (
                      <tr key={row.id} className="text-[11px] text-[#F9FAFB] transition-colors hover:bg-white/[0.02] group">
                        <td className="px-6 py-4 font-mono text-[#8B5CF6] uppercase">{row.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold">{row.eventTitle}</p>
                          <p className="text-[9px] text-[#6B7280] uppercase font-bold tracking-tighter mt-0.5">{formatDate(row.date)}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-rose-400">
                          {formatFCFA(row.platformFee)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#22C55E]">
                          {formatFCFA(row.hostNet)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase ${
                            row.status === 'completed' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Charts & Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            {/* Platform Revenue Breakdown by Event */}
            <div className="p-8 rounded-[2.5rem] border border-[#2A3342] bg-[#111827] shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 border-b border-[#2A3342] pb-4">Revenue per Event</h3>
              <div className="space-y-4">
                {eventFinancials.slice(0, 5).map((item, i) => (
                  <div key={i} className="space-y-1.5 group cursor-pointer">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-[#9CA3AF] uppercase tracking-tighter flex items-center gap-2 truncate max-w-[150px]">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                         {item.title}
                       </span>
                       <span className="text-[#F9FAFB] font-bold">{formatFCFA(item.sales)}</span>
                    </div>
                    <div className="h-1 w-full bg-[#0B0F19] rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] transition-all duration-700" style={{ width: `${Math.min(100, (item.sales / totals.totalGross) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee Policy Quick Look */}
            <div className="p-8 rounded-[2.5rem] border border-[#2A3342] bg-[#111827] relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <span className="material-symbols-outlined text-6xl text-white">verified_user</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Fee Summary</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                    <span className="text-[#9CA3AF] font-bold">Standard Fee</span>
                    <span className="text-[#F9FAFB] font-bold">10.00%</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-[#9CA3AF] font-bold">Processing Tax</span>
                    <span className="text-[#F9FAFB] font-bold">Inc.</span>
                 </div>
                 <div className="pt-4 border-t border-[#2A3342]">
                   <button className="w-full py-3 bg-[#1F2937] border border-[#2A3342] text-[10px] font-bold text-white uppercase tracking-wider rounded-xl hover:bg-[#2A3342] transition-all">Adjust Global Fees</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function formatDate(val) {
  if (!val) return "";
  const date = new Date(val);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
