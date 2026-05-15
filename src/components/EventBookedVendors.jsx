import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function EventBookedVendors({ vendors = [] }) {
  const navigate = useNavigate();
  if (!vendors.length) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Event Partners</h2>
          <p className="mt-1 text-sm text-slate-500">Confirmed vendors providing services for this event.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vendors.filter(v => v.publicVisible).map((vendor) => (
          <div key={vendor.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
            {vendor.logo ? <img src={vendor.logo} alt={vendor.vendorName} className="h-12 w-12 rounded-xl object-cover border border-white/10" /> : <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-600"><Icon name="storefront" /></div>}
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-bold text-white text-sm">{vendor.vendorName}</h3>
              <p className="text-[10px] uppercase tracking-widest text-violet-300">{vendor.category}</p>
            </div>
            {vendor.vendorId && (
               <button onClick={() => navigate(`/marketplace/${vendor.vendorId}`)} className="p-2 text-slate-400 hover:text-white transition-colors" title="View Profile">
                 <Icon name="storefront" className="text-lg" />
               </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}