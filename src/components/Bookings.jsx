import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useSearch } from "../contexts/SearchContext";

const MOCK_BOOKINGS = [
  { id: "INV10011", date: "2029/02/15 10:30 AM", name: "Jackson Moore", event: "Symphony Under the Stars", category: "Diamond", price: 50000, qty: 2, amount: 100000, status: "Confirmed", voucher: "123456-MUSIC" },
  { id: "INV10012", date: "2029/02/16 03:45 PM", name: "Alicia Smithson", event: "Runway Revolution 2024", category: "Platinum", price: 120000, qty: 1, amount: 120000, status: "Pending", voucher: "-" },
  { id: "INV10013", date: "2029/02/17 01:15 PM", name: "Natalie Johnson", event: "Global Wellness Summit", category: "CAT 1", price: 80000, qty: 3, amount: 240000, status: "Confirmed", voucher: "789101-WELLNESS" },
  { id: "INV10014", date: "2029/02/18 09:00 AM", name: "Patrick Cooper", event: "Champions League Screening Night", category: "CAT 3", price: 30000, qty: 4, amount: 120000, status: "Cancelled", voucher: "-" },
  { id: "INV10015", date: "2029/02/18 05:30 PM", name: "Gilda Ramos", event: "Artistry Unveiled: Modern Art Expo", category: "Silver", price: 25000, qty: 2, amount: 50000, status: "Confirmed", voucher: "202324-ART" },
  { id: "INV10016", date: "2029/02/19 12:00 PM", name: "Clara Simmons", event: "Tech Future Expo", category: "CAT 2", price: 75000, qty: 2, amount: 150000, status: "Confirmed", voucher: "564738-TECH" },
  { id: "INV10017", date: "2029/02/20 02:30 PM", name: "Daniel White", event: "Culinary Delights Festival", category: "Gold", price: 60000, qty: 1, amount: 60000, status: "Cancelled", voucher: "928374-CULINARY" },
  { id: "INV10018", date: "2029/02/21 06:00 PM", name: "Natalie Johnson", event: "Echo Beats Festival", category: "Platinum", price: 70000, qty: 3, amount: 210000, status: "Pending", voucher: "-" },
];

export default function Bookings() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return MOCK_BOOKINGS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "All Category" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500">
      {/* 1. Top Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-violet-400">Bookings</span>
          </div>
          <h1 className="text-2xl font-semibold text-white font-heading mt-1 tracking-tight">Bookings</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-2 text-gray-500 text-sm">search</span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-300 outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => navigate("/notifications")} className="p-2 bg-white/[0.03] border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </button>
            <button onClick={() => navigate("/settings")} className="p-2 bg-white/[0.03] border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
            <div onClick={() => navigate("/profile")} className="flex items-center gap-2.5 pl-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">M</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-200 leading-none">Maya Brooks</p>
                <p className="text-[9px] text-gray-500 mt-1 font-bold uppercase">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Bookings" value="55,000" icon="confirmation_number" />
        <StatCard label="Total Tickets Sold" value="45,000" icon="local_activity" />
        <StatCard label="Total Earnings" value="FCFA 275,450,000" icon="account_balance_wallet" highlight />
      </div>

      {/* 3 & 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <OverviewChart />
        <CategoryCard />
      </div>

      {/* 5. Bookings Table Section */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/5">
            {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status ? "bg-violet-600 text-white shadow-md" : "text-gray-500 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold text-gray-400 outline-none"
            >
              <option>All Category</option>
              <option>Diamond</option>
              <option>Platinum</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>CAT 1</option>
              <option>CAT 2</option>
              <option>CAT 3</option>
            </select>
            <select className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold text-gray-400 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">E-Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`text-[11px] transition-colors cursor-pointer hover:bg-white/[0.01] ${selectedId === row.id ? 'bg-violet-600/5' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-gray-600">{row.id}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 font-semibold text-gray-200">{row.name}</td>
                  <td className="px-6 py-4 text-gray-400 truncate max-w-[150px]">{row.event}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 text-[9px] uppercase font-bold">{row.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">FCFA {row.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-400">{row.qty}</td>
                  <td className="px-6 py-4 text-right font-black text-white">FCFA {row.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      row.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                      row.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-[10px]">{row.voucher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-gray-500 font-bold">Showing {filteredData.length} of {MOCK_BOOKINGS.length} bookings</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                  currentPage === num ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-white/5"
                }`}
              >
                {num}
              </button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 ml-1">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }) {
  return (
    <div className={`p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-all ${highlight && 'ring-1 ring-violet-500/20'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-violet-600 text-white' : 'bg-white/5 text-violet-400'}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-lg font-bold text-white mt-0.5 leading-none">{value}</h3>
        </div>
      </div>
      <button className="text-gray-600 hover:text-white transition-colors">
        <span className="material-symbols-outlined text-[18px]">more_vert</span>
      </button>
    </div>
  );
}

function OverviewChart() {
  return (
    <div className="lg:col-span-8 p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Bookings Overview</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Weekly ticket reservation trends</p>
        </div>
        <button className="px-3 py-1 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[9px] font-black uppercase rounded-full">This Week</button>
      </div>

      <div className="relative flex-1 min-h-[180px] flex items-end justify-between px-2">
        {/* Simple SVG Line Chart Placeholder */}
        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,80 Q15,70 30,75 T60,40 T90,30 L100,20" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" />
          <circle cx="60" cy="40" r="1.5" fill="#a78bfa" />
        </svg>
        
        {/* Marker Tooltip Placeholder */}
        <div className="absolute left-[60%] bottom-[60%] bg-slate-900 border border-violet-500/40 rounded-lg p-2 shadow-xl z-10 -translate-x-1/2">
          <p className="text-[8px] font-black text-gray-500 uppercase">Mar 13, 2029</p>
          <p className="text-[11px] font-black text-white">1,396 Bookings</p>
        </div>

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{day}</span>
        ))}
      </div>
    </div>
  );
}

function CategoryCard() {
  const categories = [
    { name: "Music", percent: 25.77, count: 14172, color: "bg-violet-500" },
    { name: "Sport", percent: 22.68, count: 12476, color: "bg-indigo-500" },
    { name: "Fashion", percent: 17.83, count: 9806, color: "bg-emerald-500" },
    { name: "Art & Design", percent: 13.93, count: 7661, color: "bg-amber-500" },
  ];

  return (
    <div className="lg:col-span-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col">
      <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">Bookings Category</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative mb-6">
        <div className="relative w-28 h-28 rounded-full border-[8px] border-white/5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[8px] border-violet-500 border-t-transparent -rotate-45" />
          <div className="text-center">
            <p className="text-xl font-black text-white">44,115</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase">Total</p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 mb-8">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight">
              <span className="text-gray-400">{cat.name}</span>
              <span className="text-gray-500">{cat.count.toLocaleString()} <span className="text-[7px] opacity-60">({cat.percent}%)</span></span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${cat.color} opacity-80`} style={{ width: `${cat.percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Art & Design Subcategories</p>
        <div className="space-y-3">
          {[
            { label: "Landscape Architecture", val: 3415, max: 4000 },
            { label: "Futuristic Art", val: 2246, max: 2500 },
            { label: "Mixed Media", val: 2000, max: 3200 },
          ].map((sub) => (
            <div key={sub.label} className="flex items-center justify-between text-[8px] font-bold">
              <span className="text-gray-400">{sub.label}</span>
              <span className="text-gray-200">{sub.val.toLocaleString()} / <span className="text-gray-500">{sub.max}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}