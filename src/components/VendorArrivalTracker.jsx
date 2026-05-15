import React from "react";
import Icon from "./Icon";

const defaultMockVendors = [
  { id: 'v1', businessName: 'Luxe Catering', category: 'F&B', status: 'Setup Complete', time: '14:00', zone: 'Main Hall' },
  { id: 'v2', businessName: 'Harmony Audio', category: 'A/V', status: 'Checked In', time: '15:30', zone: 'Main Stage' },
  { id: 'v3', businessName: 'Floral Magic', category: 'Decor', status: 'Delayed', time: '13:00', zone: 'Entrance' },
  { id: 'v4', businessName: 'Elite Security', category: 'Security', status: 'Expected', time: '17:00', zone: 'All Gates' },
];

const statusConfig = {
  'Expected': { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: 'local_shipping' },
  'Checked In': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'check' },
  'Setup Complete': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'done_all' },
  'Delayed': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'schedule' },
  'Missing': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'warning' },
};

export default function VendorArrivalTracker({ vendors = [] }) {
  const displayVendors = vendors.length > 0 ? vendors : defaultMockVendors;
  
  const checkedInCount = displayVendors.filter(v => v.status === 'Checked In' || v.status === 'Setup Complete').length;

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Icon name="local_shipping" className="text-amber-400" /> Vendor Arrivals
        </h2>
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          {checkedInCount} / {displayVendors.length} Arrived
        </span>
      </div>

      <div className="space-y-3">
        {displayVendors.map(vendor => {
          const style = statusConfig[vendor.status] || statusConfig['Expected'];
          return (
            <div key={vendor.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${style.bg} ${style.border} ${style.color}`}>
                  <Icon name={style.icon} className="text-[20px]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{vendor.businessName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{vendor.category} &bull; {vendor.zone || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 sm:gap-0 mt-2 sm:mt-0">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${style.bg} ${style.color}`}>
                  {vendor.status}
                </span>
                <span className="text-[10px] font-bold text-slate-500 mt-1">
                  {vendor.status === 'Expected' || vendor.status === 'Delayed' ? 'ETA: ' : 'Time: '} {vendor.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}