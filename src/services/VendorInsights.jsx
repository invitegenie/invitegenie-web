import React, { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

export default function VendorInsights() {
  const [range, setRange] = useState("Last 30 Days");

  const handleExport = (type) => {
    if (type === 'pdf') window.print();
    else alert("CSV export initiated.");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-32 pt-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Analytics</p>
            <h1 className="mt-2 text-3xl font-black text-white">Business Insights</h1>
            <p className="mt-2 text-sm text-slate-400">Track your marketplace performance and client satisfaction.</p>
          </div>
          <div className="flex gap-2 bg-slate-900 border border-white/10 rounded-2xl p-1 w-fit">
            {["Last 30 Days", "Last 90 Days", "All Time"].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${range === r ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value="FCFA 12,450,000" trend="+15%" positive icon="payments" color="text-emerald-400" bg="bg-emerald-400/10" />
          <StatCard label="Bookings" value="48" trend="+8" positive icon="event_available" color="text-violet-400" bg="bg-violet-400/10" />
          <StatCard label="Profile Views" value="312" trend="+45" positive icon="visibility" color="text-blue-400" bg="bg-blue-400/10" />
          <StatCard label="Conversion Rate" value="15.2%" trend="+2.1%" positive icon="trending_up" color="text-amber-400" bg="bg-amber-400/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Revenue Trend</h3>
            <div className="h-64 flex items-end gap-2">
              {/* Dummy Chart */}
              {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-violet-600/20 rounded-t-lg relative group hover:bg-violet-600/40 transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity text-white">FCFA {h*10}k</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Customer Satisfaction</h3>
            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-5xl font-black text-white">4.8</p>
                <div className="flex text-amber-400 my-2">
                  <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star_half" />
                </div>
                <p className="text-xs text-slate-400">125 reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                <RatingBar stars="5" percent={70} />
                <RatingBar stars="4" percent={20} />
                <RatingBar stars="3" percent={5} />
                <RatingBar stars="2" percent={3} />
                <RatingBar stars="1" percent={2} />
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Top Categories</p>
                <p className="text-sm font-bold text-white mt-1">Weddings, Corporate, Birthdays</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Repeat Clients</p>
                <p className="text-sm font-bold text-emerald-400 mt-1">25 (+5 this month)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-colors">
            <Icon name="download" className="text-[18px]" /> Export CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-6 py-3 bg-violet-600 rounded-xl text-xs font-bold text-white uppercase tracking-widest hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/20">
            <Icon name="picture_as_pdf" className="text-[18px]" /> Export PDF
          </button>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, trend, positive, icon, color, bg }) {
  return (
    <div className="bg-[#111827] border border-white/10 p-5 rounded-3xl shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
          <Icon name={icon} className="text-[24px]" />
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-2xl font-black text-white mt-1 truncate">{value}</p>
    </div>
  );
}

function RatingBar({ stars, percent }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-12 text-slate-400 font-bold">{stars} stars</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 text-right text-slate-400">{percent}%</span>
    </div>
  );
}