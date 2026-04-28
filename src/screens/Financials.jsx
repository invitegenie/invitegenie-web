import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { USER_ROLES } from "../auth/roles";
import * as Engine from "../auth/coreEngine";

// Local Helper for FCFA Formatting
const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount).replace('FCFA', 'FCFA ');
};

// Component: Summary Card
const SummaryCard = ({ label, value, trend, icon, highlight }) => (
  <div className={`p-6 rounded-[2rem] border border-white/5 transition-all hover:bg-white/[0.06] shadow-sm flex flex-col justify-between h-full ${highlight ? 'bg-violet-600 shadow-violet-900/20' : 'bg-white/[0.03]'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${highlight ? 'bg-white/20' : 'bg-white/5 text-violet-400'}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${trend.startsWith('+') ? (highlight ? 'bg-white/20 text-white' : 'bg-emerald-400/10 text-emerald-400') : (highlight ? 'bg-white/20 text-white' : 'bg-rose-400/10 text-rose-400')}`}>
        {trend}
      </div>
    </div>
    <div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-purple-200' : 'text-slate-500'}`}>{label}</p>
      <h3 className="text-2xl font-black text-white">{formatFCFA(value)}</h3>
    </div>
  </div>
);

export default function Financials() {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const payments = Engine.getAllPayments().map(p => ({
      id: p.id,
      date: p.date.split('T')[0],
      event: Engine.getEventById(p.eventId)?.title || "Event",
      type: 'income',
      category: 'Ticket Sale',
      amount: p.amount,
      status: p.status
    }));
    setTransactions(payments);
  }, []);

  const canAccess = role !== USER_ROLES.PUBLIC_GUEST;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.event.toLowerCase().includes(search.toLowerCase()) || 
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.income += curr.amount;
      } else {
        acc.expenses += curr.amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    }, { balance: 0, income: 0, expenses: 0 });
  }, [filteredTransactions]);

  if (!canAccess) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
             <span className="material-symbols-outlined text-rose-500 text-4xl">lock</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-500 max-w-sm">You do not have the required permissions to view the Financials dashboard.</p>
          <button onClick={() => navigate("/dashboard")} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all">Back to Dashboard</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-28 font-sans animate-in fade-in duration-500">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-violet-400">Financials</span>
            </div>
            <h1 className="text-2xl font-semibold text-white font-heading tracking-tight">Financial Management</h1>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px]">download</span>
               Export Report
             </button>
             <button className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-[10px] font-black uppercase shadow-lg shadow-violet-900/20 hover:bg-violet-500 transition-all">
               Add Transaction
             </button>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Projected Balance" value={totals.balance} trend="+2.4%" icon="account_balance_wallet" />
          <SummaryCard label="Total Income" value={totals.income} trend="+12.5%" icon="trending_up" highlight />
          <SummaryCard label="Total Expenses" value={totals.expenses} trend="-1.2%" icon="trending_down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Transactions Table */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/[0.01]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Transactions</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-600 text-sm">search</span>
                    <input 
                      type="text" 
                      placeholder="Search events..." 
                      className="bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-300 outline-none w-48 focus:ring-1 focus:ring-violet-500/30"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-gray-400 outline-none"
                  >
                    <option>This Month</option>
                    <option>This Week</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/[0.02] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Event / Entity</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTransactions.map((row) => (
                      <tr key={row.id} className="text-[11px] transition-colors cursor-pointer hover:bg-white/[0.02] group">
                        <td className="px-6 py-4 font-bold text-gray-600">{row.date}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-200">{row.event}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-tighter mt-0.5">{row.category}</p>
                        </td>
                        <td className={`px-6 py-4 text-right font-black ${row.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {row.type === 'income' ? '+' : '-'} {formatFCFA(row.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            row.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Page 1 of 5</p>
                <div className="flex gap-1.5">
                  <button className="w-7 h-7 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <button className="w-7 h-7 rounded-lg bg-violet-600 text-white text-[10px] font-black flex items-center justify-center">1</button>
                  <button className="w-7 h-7 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Charts & Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            {/* Cashflow Bar Chart */}
            <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Cashflow Analysis</h3>
                <div className="flex gap-2 text-[9px] font-bold text-gray-500">
                   <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Income</span>
                   <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Expense</span>
                </div>
              </div>
              <div className="h-48 flex items-end justify-between gap-1.5 px-2">
                {[
                  { month: "Jan", inc: 65, exp: 40 },
                  { month: "Feb", inc: 45, exp: 55 },
                  { month: "Mar", inc: 85, exp: 30 },
                  { month: "Apr", inc: 70, exp: 50 },
                  { month: "May", inc: 95, exp: 45 },
                  { month: "Jun", inc: 60, exp: 70 },
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-0.5 h-full relative">
                      <div className="w-full max-w-[8px] bg-violet-600 rounded-t-sm transition-all group-hover:bg-violet-400" style={{ height: `${d.inc}%` }} />
                      <div className="w-full max-w-[8px] bg-rose-600/60 rounded-t-sm transition-all group-hover:bg-rose-500" style={{ height: `${d.exp}%` }} />
                    </div>
                    <span className="text-[8px] font-black text-gray-600 uppercase">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Revenue Breakdown */}
            <div className="p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Revenue Breakdown</h3>
              <div className="space-y-4">
                {[
                  { cat: "Music Events", val: 32450000, perc: 45, color: "bg-violet-500" },
                  { cat: "Weddings", val: 14200000, perc: 22, color: "bg-indigo-500" },
                  { cat: "Corporate", val: 12500000, perc: 18, color: "bg-blue-500" },
                  { cat: "Cultural Events", val: 5850000, perc: 10, color: "bg-emerald-500" },
                  { cat: "Fashion Shows", val: 3500000, perc: 5, color: "bg-amber-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5 group cursor-pointer">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                         {item.cat}
                       </span>
                       <span className="text-gray-200 font-black">{item.percent}% <span className="text-gray-600 ml-1">({formatFCFA(item.val)})</span></span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color} transition-all duration-700`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="p-6 rounded-[2.5rem] border border-white/5 bg-[#141218] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                 <span className="material-symbols-outlined text-6xl text-violet-400">monitoring</span>
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Expense Categories</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { cat: "Marketing", perc: 15, val: 3483000 },
                  { cat: "Venue", perc: 35, val: 8127000 },
                  { cat: "Staff", perc: 20, val: 4644000 },
                  { cat: "Equipment", perc: 15, val: 3483000 },
                  { cat: "Logistics", perc: 10, val: 2322000 },
                  { cat: "Misc", perc: 5, val: 1161000 },
                ].map((item, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex-1 min-w-[120px]">
                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{item.cat}</p>
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">{item.perc}%</span>
                        <span className="text-[9px] text-gray-600 font-medium">{formatFCFA(item.val)}</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}