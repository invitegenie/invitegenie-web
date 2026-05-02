import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { getMarketplaceProviders, saveMarketplaceListings } from "../services/mockData";

export default function AdminVendorManagement() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(getMarketplaceProviders());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.businessName?.toLowerCase().includes(search.toLowerCase()) || v.category?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || v.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  const stats = {
    new: vendors.filter(v => new Date(v.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length,
    pending: vendors.filter(v => v.status === "pending").length,
    active: vendors.filter(v => v.status === "approved" || v.status === "active").length,
    reported: vendors.filter(v => v.reported).length,
  };

  const updateVendor = (id, updates) => {
    const updated = vendors.map(v => v.id === id ? { ...v, ...updates } : v);
    setVendors(updated);
    saveMarketplaceListings(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#A78BFA]">Oversight</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Vendor Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Manage marketplace partners, review reports, and handle verification.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="New This Month" value={stats.new} icon="fiber_new" color="text-emerald-400" />
        <MetricCard title="Pending Verification" value={stats.pending} icon="pending_actions" color="text-amber-400" />
        <MetricCard title="Active Vendors" value={stats.active} icon="storefront" color="text-violet-400" />
        <MetricCard title="Reported" value={stats.reported} icon="report" color="text-rose-400" />
      </div>

      <div className="bg-[#0D1320] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="search" className="absolute left-3 top-3 text-slate-500 text-sm" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
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
            <option value="approved">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="pb-4 px-4">Vendor</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">Location</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-white/[0.02]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={vendor.image} alt={vendor.businessName} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          {vendor.businessName}
                          {vendor.verified && <Icon name="verified" className="text-violet-400 text-[14px]" />}
                        </p>
                        <p className="text-xs text-slate-400">★ {vendor.rating || "N/A"} ({vendor.completedJobs || 0} jobs)</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-300">{vendor.category}</td>
                  <td className="py-4 px-4 text-sm text-slate-300">{vendor.location}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      vendor.status === 'approved' || vendor.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      vendor.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      vendor.status === 'suspended' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {vendor.status === 'approved' ? 'Active' : vendor.status}
                    </span>
                    {vendor.reported && (
                      <span className="ml-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400">
                        Reported
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button onClick={() => navigate(`/marketplace/${vendor.id}`)} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition" title="View Profile">
                      <Icon name="visibility" className="text-[18px]" />
                    </button>
                    {(vendor.status === 'pending' || vendor.status === 'suspended') && (
                      <button onClick={() => updateVendor(vendor.id, { status: 'approved' })} className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition" title="Approve">
                        <Icon name="check_circle" className="text-[18px]" />
                      </button>
                    )}
                    {(vendor.status === 'approved' || vendor.status === 'active') && (
                      <button onClick={() => updateVendor(vendor.id, { status: 'suspended' })} className="p-2 bg-rose-500/10 rounded-lg text-rose-400 hover:bg-rose-500/20 transition" title="Suspend">
                        <Icon name="block" className="text-[18px]" />
                      </button>
                    )}
                    {!vendor.verified && (
                      <button onClick={() => updateVendor(vendor.id, { verified: true })} className="p-2 bg-violet-500/10 rounded-lg text-violet-400 hover:bg-violet-500/20 transition" title="Verify">
                        <Icon name="verified" className="text-[18px]" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">No vendors found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
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