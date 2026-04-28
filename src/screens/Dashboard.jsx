import { useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { KEYS } from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";
import useEngineCollection from "./useEngineCollection";
import Layout from "../components/Layout";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const allEvents = useEngineCollection(KEYS.EVENTS);
  const allPayments = useEngineCollection(KEYS.PAYMENTS);
  const allBookings = useEngineCollection(KEYS.TICKETS);

  const formatFCFA = (amount) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount).replace('FCFA', 'FCFA ');
  };

  // Dynamic KPIs derived from Engine
  const kpis = [
    { label: "Active Events", value: allEvents.filter(e => e.status === 'ACTIVE').length.toString(), icon: "calendar_today", trend: "Live Now" },
    { label: "Recent Bookings", value: allBookings.length.toLocaleString(), icon: "confirmation_number", trend: "+124 today" },
    { label: "Tickets Sold", value: allEvents.reduce((sum, e) => sum + (e.ticketsSold || 0), 0).toLocaleString(), icon: "local_activity", trend: "Active Sales" },
    { label: "Total Revenue", value: formatFCFA(allPayments.reduce((sum, p) => sum + p.amount, 0)), icon: "account_balance_wallet", trend: "Total Volume", highlight: true },
  ];

  const categories = [
    { name: "Weddings", percent: 40, color: "bg-violet-500" },
    { name: "Corporate Events", percent: 25, color: "bg-indigo-500" },
    { name: "Concerts", percent: 20, color: "bg-emerald-500" },
    { name: "Traditional Ceremonies", percent: 15, color: "bg-amber-500" },
  ];

  const filteredBookings = useMemo(() => {
    return allBookings.filter(b => 
      (b.buyerName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.eventName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allBookings, searchQuery]);

  return (
    <Layout>
      <main className="p-6 space-y-6 bg-[#0B0F19] min-h-screen font-sans">
        
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Dashboard</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Magical oversight for your event portfolio.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[300px]">
              <span className="material-symbols-outlined absolute left-3 top-2 text-gray-500 text-sm">search</span>
              <input 
                type="text"
                placeholder="Search..."
                className="w-full bg-[#0F172A] border border-[#2A3342] text-white rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <KPICard 
              key={i}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              highlight={kpi.highlight}
            />
          ))}
        </div>

        <section>
          <div className="flex justify-between items-end mb-3">
            <div>
              <h3 className="text-lg font-bold text-[#F9FAFB]">Event Memories</h3>
              <p className="text-xs text-[#6B7280] uppercase tracking-widest mt-1">Recent Captures</p>
            </div>
            <button onClick={() => navigate("/feed")} className="text-xs font-bold text-[#A78BFA] hover:text-[#8B5CF6] flex items-center gap-1 uppercase tracking-widest transition-colors">
              View Full Feed
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {allEvents.slice(0, 4).map((ev) => (
              <div 
                key={ev.id} 
                onClick={() => navigate(`/events/${ev.id}/memories`)}
                className="min-w-[240px] group cursor-pointer"
              >
                <div className="relative h-36 rounded-2xl overflow-hidden mb-3 border border-[#2A3342]">
                  <img src={ev.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={ev.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-tighter">
                      Magical Capture
                    </span>
                  </div>
                </div>
                <h4 className="text-[11px] font-bold text-white group-hover:text-violet-400 transition-colors truncate">{ev.title}</h4>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5 flex items-center gap-1 font-black tracking-widest">
                  <span className="material-symbols-outlined text-[12px] text-violet-400">location_on</span>
                  {ev.location} • {ev.date}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales Revenue Chart */}
          <div className="lg:col-span-8 p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F9FAFB] uppercase tracking-widest">Sales Revenue</h3>
                <p className="text-xs text-[#6B7280] mt-1">Marketplace performance summary</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Growth</span>
                </div>
              </div>
            </div>
            {/* Mock Chart Area */}
            <div className="flex items-end justify-between gap-2 h-44">
              {[70, 45, 90, 65, 80, 55, 95, 75].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    <div className="w-1.5 md:w-2.5 bg-violet-500/60 rounded-t-sm transition-all group-hover:bg-violet-400" style={{ height: `${val}%` }} />
                    <div className="w-1.5 md:w-2.5 bg-emerald-500/60 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: `${val * 0.7}%` }} />
                  </div>
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Month {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg flex flex-col">
            <h3 className="text-base font-bold text-[#F9FAFB] uppercase tracking-widest mb-4">Invitation Stats</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="relative w-32 h-32 rounded-full border-[8px] border-white/5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[8px] border-[#8B5CF6] border-t-transparent -rotate-45 shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">2,780</p>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Total</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-4 mt-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Sent</p>
                <p className="text-sm font-bold text-white">1,124</p>
              </div>
              <div className="space-y-1 border-l border-white/5 pl-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Opened</p>
                <p className="text-sm font-bold text-emerald-400">834</p>
              </div>
              <div className="space-y-1 pt-3 border-t border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Confirmed</p>
                <p className="text-sm font-bold text-[#8B5CF6]">695</p>
              </div>
              <div className="space-y-1 pt-3 pl-4 border-t border-l border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase">RSVP Rate</p>
                <p className="text-sm font-bold text-indigo-400">83.3%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories */}
          <div className="lg:col-span-3 p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg">
            <h3 className="text-base font-bold text-[#F9FAFB] uppercase tracking-widest mb-6">Market Sectors</h3>
            <div className="space-y-7">
              {[...categories].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-wider">{cat.name}</span>
                    <span className="text-gray-500 font-black">{cat.percent}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} transition-all duration-1000`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Event Card */}
          <div className="lg:col-span-5 p-1 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg flex flex-col">
            <div className="h-44 rounded-xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Afro Beats"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
              <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-[#8B5CF6]/90 backdrop-blur-md text-[10px] font-black uppercase text-white shadow-xl">Trending Now</div>
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-white leading-tight">Douala Afro Beats Festival</h3>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8B5CF6] text-[14px]">location_on</span>
                Canal Olympia, Douala, Cameroon
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Entry Fee</p>
                  <p className="text-sm font-black text-[#22C55E]">FCFA 15,000</p>
                </div>
                <button onClick={() => navigate("/events")} className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-[10px] font-bold uppercase transition-all shadow-md">
                  DETAILS
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#F9FAFB] uppercase tracking-widest">Upcoming</h3>
              <button onClick={() => navigate("/calendar")} className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8B5CF6]">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { day: "12", month: "MAY", title: "Panel Discussion", loc: "Tech Hub Yaoundé", color: "bg-[#8B5CF6]" },
                { day: "20", month: "MAY", title: "Live Concert", loc: "Afro Beats Douala", color: "bg-[#22C55E]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-white ${item.color} shadow-sm transition-transform group-hover:scale-105`}>
                    <span className="text-[8px] font-black">{item.month}</span>
                    <span className="text-base font-black leading-none">{item.day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Bookings Table */}
          <div className="lg:col-span-9 bg-[#111827] rounded-2xl border border-[#2A3342] overflow-hidden shadow-lg">
            <div className="p-6 border-b border-[#2A3342] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#F9FAFB] uppercase tracking-widest">Recent Bookings</h3>
              <div className="p-2 bg-[#1F2937] border border-[#2A3342] rounded-lg text-[#9CA3AF]">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2937]/50 text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-3">Invoice</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Event</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3342]">
                  {filteredBookings.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => navigate(`/bookings/${row.id}/voucher`)}
                      className={`text-[11px] text-[#F9FAFB] transition-colors cursor-pointer hover:bg-white/[0.02]`}
                    >
                      <td className="px-6 py-4 font-mono text-[#8B5CF6]">{row.id}</td>
                      <td className="px-6 py-4 font-semibold">{row.buyerName}</td>
                      <td className="px-6 py-4 text-[#9CA3AF]">{row.eventName}</td>
                      <td className="px-6 py-4 text-center font-bold">1</td>
                      <td className="px-6 py-4 font-black text-[#22C55E]">{formatFCFA(row.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          row.status === 'Confirmed' || row.status === 'Valid' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                          row.status === 'Pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#EF4444]/10 text-[#EF4444]'
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

          <div className="lg:col-span-3 p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-widest">RSVP Live Feed</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[9px] font-black text-[#22C55E] uppercase tracking-tighter">Live</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

function KPICard({ label, value, icon, trend, highlight }) {
  return (
    <div className={`p-6 bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg hover:border-[#8B5CF6]/50 transition-all group ${highlight && 'ring-1 ring-[#8B5CF6]/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white' : 'bg-[#1F2937] text-[#A78BFA]'}`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <span className="text-[10px] font-black text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-lg uppercase tracking-wider">{trend}</span>
      </div>
      <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-[0.1em]">{label}</p>
      <h3 className="text-2xl font-bold text-[#F9FAFB] mt-1">{value}</h3>
    </div>
  );
}