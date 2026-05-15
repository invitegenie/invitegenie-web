import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import { requestSponsorship } from "../services/eventSponsorService";
import { getMarketplaceProviders } from "../services/mockData";
import { SPONSOR_TIERS } from "../services/eventSponsorBrandingService";

export default function SponsorEventModal({ isOpen, onClose, event, user }) {
  const provider = user?.id ? getMarketplaceProviders().find(p => String(p.ownerId || p.userId || p.sellerId) === String(user.id)) : null;
  
  const [form, setForm] = useState({
    sponsorName: provider?.businessName || user?.name || user?.full_name || "",
    sponsorLogo: provider?.image || "",
    packageName: "Silver Sponsor",
    amount: "150000",
    marketplaceLink: provider ? `${window.location.origin}/marketplace/${provider.id}` : "",
    message: ""
  });
  
  const [status, setStatus] = useState("idle"); // idle, processing, success

  useEffect(() => {
    if (SPONSOR_TIERS[form.packageName] && form.packageName !== "Custom Contribution") {
      setForm(prev => ({ ...prev, amount: SPONSOR_TIERS[form.packageName].amount.toString() }));
    }
  }, [form.packageName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sponsorName || !form.amount) return alert("Name and amount are required.");
    
    setStatus("processing");
    
    // Simulate Payment flow
    setTimeout(() => {
      const visibility = SPONSOR_TIERS[form.packageName] || SPONSOR_TIERS["Custom Contribution"];
      
      requestSponsorship({
        eventId: event.id,
        sponsorUserId: user?.id,
        sponsorType: "brand",
        sponsorName: form.sponsorName,
        sponsorLogo: form.sponsorLogo,
        packageName: form.packageName,
        amount: form.amount,
        marketplaceLink: form.marketplaceLink,
        message: form.message,
        visibility,
        active: true,
        status: "approved" // Auto-approve for demo purposes to show immediate results
      });
      
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {status === "success" ? (
          <div className="text-center py-10 animate-in zoom-in-95">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <Icon name="check_circle" className="text-4xl" />
            </div>
            <h3 className="text-xl font-black text-white">Payment Successful</h3>
            <p className="mt-2 text-sm text-slate-400">Your sponsorship request has been sent to the host for approval.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Icon name="stars" className="text-amber-400" /> Sponsor Event
              </h3>
              <button onClick={onClose} disabled={status === "processing"} className="text-slate-400 hover:text-white"><Icon name="close" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Sponsor Name</label><input value={form.sponsorName} onChange={e=>setForm({...form, sponsorName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" required /></div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Sponsorship Package</label>
                <select value={form.packageName} onChange={e=>setForm({...form, packageName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400">
                  {Object.keys(SPONSOR_TIERS).map(tier => <option key={tier} value={tier}>{tier}</option>)}
                </select>
              </div>
              
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Package Includes:</p>
                <p className="text-xs text-amber-100/70 mt-1">
                   {form.packageName === "Custom Contribution" ? "Event Page & Sponsors Section" : 
                    Object.entries(SPONSOR_TIERS[form.packageName] || {}).filter(([k,v]) => v === true).map(([k]) => k.replace(/([A-Z])/g, ' $1').toLowerCase()).join(", ")}
                </p>
              </div>
              
              <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Amount (FCFA)</label><input type="number" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} disabled={form.packageName !== "Custom Contribution"} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 disabled:opacity-50" required /></div>
              <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Logo URL (Optional)</label><input value={form.sponsorLogo} onChange={e=>setForm({...form, sponsorLogo: e.target.value})} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" /></div>
              <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Website/Marketplace Link (Optional)</label><input value={form.marketplaceLink} onChange={e=>setForm({...form, marketplaceLink: e.target.value})} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" /></div>
              <div><label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Message to Host</label><textarea value={form.message} onChange={e=>setForm({...form, message: e.target.value})} rows={2} className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" /></div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={onClose} disabled={status === "processing"} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={status === "processing"} className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-amber-400 disabled:opacity-50">
                  {status === "processing" ? "Simulating Payment..." : "Confirm & Pay"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}