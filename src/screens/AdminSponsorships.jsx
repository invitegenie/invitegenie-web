import React, { useState, useMemo, useEffect } from "react";
import Icon from "../components/Icon";
import { getSponsors, updateSponsorStatus } from "../services/eventSponsorService";
import { getEventById } from "../services/mockData";
import { sendDesktopNotification } from "../services/browserNotificationService";

export default function AdminSponsorships() {
  const [sponsors, setSponsors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setSponsors(getSponsors());
  }, []);

  const filteredSponsors = useMemo(() => {
    return sponsors.filter((s) => {
      const matchesSearch = 
        s.sponsorName?.toLowerCase().includes(search.toLowerCase()) || 
        s.packageName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || s.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [sponsors, search, statusFilter]);

  const stats = {
    total: sponsors.length,
    approved: sponsors.filter((s) => s.status === "approved").length,
    pending: sponsors.filter((s) => s.status === "pending").length,
    flagged: sponsors.filter((s) => s.status === "flagged" || s.status === "rejected").length,
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "flagged" && !window.confirm("Are you sure you want to flag and hide this sponsorship?")) return;
    
    const sponsor = sponsors.find((s) => s.id === id);
    updateSponsorStatus(id, newStatus);
    setSponsors(getSponsors());

    if (newStatus === "flagged" && sponsor) {
      sendDesktopNotification("Sponsorship Flagged 🚨", {
        body: `${sponsor.sponsorName}'s sponsorship has been flagged and removed from the platform.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#A78BFA]">Oversight</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Sponsorship Moderation</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Review platform-wide event sponsorships, verify brand legitimacy, and flag inappropriate content.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Sponsorships" value={stats.total} icon="campaign" color="text-blue-400" />
        <MetricCard title="Approved" value={stats.approved} icon="verified" color="text-emerald-400" />
        <MetricCard title="Pending Review" value={stats.pending} icon="pending_actions" color="text-amber-400" />
        <MetricCard title="Flagged / Rejected" value={stats.flagged} icon="report" color="text-rose-400" />
      </div>

      <div className="bg-[#0D1320] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="search" className="absolute left-3 top-3 text-slate-500 text-sm" />
            <input 
              type="text" 
              placeholder="Search sponsors or packages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#070A12] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070A12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500/50"
          >
            <option>All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredSponsors.length === 0 ? (
            <div className="text-center py-10 bg-white/5 rounded-xl text-slate-500 text-sm">No sponsorships found.</div>
          ) : (
            filteredSponsors.map((sponsor) => {
              const event = getEventById(sponsor.eventId);
              return (
                <div key={sponsor.id} className="flex flex-col sm:flex-row justify-between gap-4 p-5 bg-[#111827] border border-white/10 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    {sponsor.sponsorLogo ? <img src={sponsor.sponsorLogo} alt="" className="w-16 h-16 rounded-xl object-contain bg-white/5 p-1 border border-white/10" /> : <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-slate-600"><Icon name="store" /></div>}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {sponsor.sponsorName} 
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${sponsor.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : sponsor.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{sponsor.status}</span>
                      </h3>
                      <p className="text-xs font-black uppercase tracking-widest text-amber-400 mt-1">{sponsor.packageName} • FCFA {Number(sponsor.amount).toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-2">Target Event: <span className="font-bold text-slate-300">{event?.title || "Unknown Event"}</span></p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                    {sponsor.status !== "approved" && <button onClick={() => handleStatusChange(sponsor.id, "approved")} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors">Approve</button>}
                    {sponsor.status !== "rejected" && <button onClick={() => handleStatusChange(sponsor.id, "rejected")} className="px-4 py-2 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-500/20 transition-colors">Reject</button>}
                    {sponsor.status !== "flagged" && <button onClick={() => handleStatusChange(sponsor.id, "flagged")} className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-colors">Flag / Remove</button>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-[#0D1320] border border-white/10 p-5 rounded-2xl">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
        <Icon name={icon} className="text-[20px]" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </div>
  );
}
