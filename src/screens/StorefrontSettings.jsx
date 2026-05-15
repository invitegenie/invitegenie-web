import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getTenantByProviderId, saveTenant, isSlugAvailable } from "../services/tenantService";

export default function StorefrontSettings() {
  const { currentUser, profile } = useAuth();
  const providerId = currentUser?.id || "demo";
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const existing = getTenantByProviderId(providerId);
    if (existing) {
      setTenant(existing);
      setForm(existing);
    } else {
      setForm({ businessName: profile?.businessName || profile?.full_name || "", slug: "" });
    }
  }, [providerId, profile]);

  const handleSlugChange = (e) => {
    const raw = e.target.value;
    const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, slug: clean });
  };

  const handleSave = () => {
    if (form.slug && !isSlugAvailable(form.slug, tenant?.id)) {
      setToast("Slug is not available. Please choose another.");
      return;
    }
    const updated = saveTenant({ ...form, ownerId: currentUser?.id, providerId });
    setTenant(updated);
    setToast("Settings saved successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Storefront Settings</h1>
        {toast && <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-lg mb-4 text-sm font-bold border border-emerald-500/30">{toast}</div>}
        
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
          <label className="block"><span className="text-sm text-slate-400">Business Name</span><input type="text" value={form.businessName || ""} onChange={e => setForm({...form, businessName: e.target.value})} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" /></label>
          <label className="block"><span className="text-sm text-slate-400">Storefront URL Slug</span><div className="flex mt-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-violet-500"><span className="px-4 py-3 text-slate-500 border-r border-white/10 bg-black/20">invitegenie.com/s/</span><input type="text" value={form.slug || ""} onChange={handleSlugChange} placeholder="my-business" className="flex-1 bg-transparent px-4 py-3 text-white outline-none" /></div>{form.slug && isSlugAvailable(form.slug, tenant?.id) ? <p className="text-xs text-emerald-400 mt-2 font-bold">Slug is available!</p> : form.slug && <p className="text-xs text-rose-400 mt-2 font-bold">Slug is taken or reserved.</p>}</label>
          <label className="block"><span className="text-sm text-slate-400">Category</span><input type="text" value={form.category || ""} onChange={e => setForm({...form, category: e.target.value})} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" /></label>
          <label className="block"><span className="text-sm text-slate-400">Description</span><textarea value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" /></label>
          <label className="block"><span className="text-sm text-slate-400">WhatsApp Number</span><input type="text" value={form.whatsapp || ""} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" /></label>
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
            <button onClick={handleSave} className="bg-violet-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-violet-500">Save Settings</button>
            {tenant?.slug && <a href={`/s/${tenant.slug}`} target="_blank" rel="noreferrer" className="bg-white/[0.05] border border-white/10 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10">Preview Storefront</a>}
          </div>
        </div>
      </div>
    </Layout>
  );
}