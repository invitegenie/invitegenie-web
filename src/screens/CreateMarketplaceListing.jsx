import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import * as Engine from "../auth/coreEngine";
import { updateUserCapabilities } from "../services/accountCapabilities";

export default function CreateMarketplaceListing() {
  const { currentUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    category: "DJ",
    location: "",
    startingPrice: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleImage = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newVendor = {
      id: `vendor-${Date.now()}`,
      ownerId: currentUser?.id || "demo-user",
      name: form.businessName,
      businessName: form.businessName,
      title: form.businessName,
      category: form.category,
      location: form.location,
      startingPrice: Number(form.startingPrice),
      price: Number(form.startingPrice),
      description: form.description,
      image: image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      coverImage: coverImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
      status: "published",
      rating: "5.0",
      reviews: 1,
      pro: false,
      tags: [form.category, "Verified Provider"],
      completedJobs: 1,
      packages: [
        { name: "Standard Package", description: "Comprehensive service coverage for standard events.", price: Number(form.startingPrice) }
      ],
      reviewsList: [
        { userName: "InviteGenie Guest", rating: 5, comment: "Excellent service! Highly recommended.", date: new Date().toISOString().split("T")[0] }
      ],
      type: "service"
    };

    const existing = Engine.getCollection(Engine.KEYS.VENDORS) || [];
    Engine.save(Engine.KEYS.VENDORS, [newVendor, ...existing]);

    if (currentUser) {
      const nextCaps = updateUserCapabilities(currentUser, { vendorMode: true, canSellServices: true });
      setUser({ ...currentUser, capabilities: nextCaps });
    }

    navigate(`/marketplace/${newVendor.id}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 space-y-6 animate-in fade-in duration-500 px-4">
        <button onClick={() => navigate("/marketplace")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
          <Icon name="arrow_back" className="text-lg" /> Back
        </button>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Become a Provider</h1>
          <p className="text-slate-400 text-sm mt-1">Create your storefront, add your service category, and set pricing to appear in the marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Name</span><input required type="text" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="e.g. Luxe Events" /></label>
            <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Category</span><select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500">
              <option>DJ</option><option>Caterer</option><option>Decorator</option><option>Photographer</option><option>Videographer</option><option>Venue</option><option>Makeup Artist</option><option>Security</option>
            </select></label>
            <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</span><input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="e.g. Douala, Cameroon" /></label>
            <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Starting Price (FCFA)</span><input required type="number" min="0" value={form.startingPrice} onChange={e => setForm({...form, startingPrice: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="e.g. 50000" /></label>
          </div>

          <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Service Description</span><textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 resize-none" placeholder="Describe your services, expertise, and what customers can expect..." /></label>

          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Profile Image</span>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer overflow-hidden transition-colors">
                {image ? <img src={image} className="w-full h-full object-cover" alt="Profile" /> : <><Icon name="add_photo_alternate" className="text-slate-400 mb-2 text-2xl" /><span className="text-xs font-bold text-slate-400">Upload Logo/Profile</span></>}
                <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, setImage)} />
              </label>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Cover Banner</span>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer overflow-hidden transition-colors">
                {coverImage ? <img src={coverImage} className="w-full h-full object-cover" alt="Cover" /> : <><Icon name="wallpaper" className="text-slate-400 mb-2 text-2xl" /><span className="text-xs font-bold text-slate-400">Upload Banner</span></>}
                <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, setCoverImage)} />
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button type="submit" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 shadow-lg transition-opacity">
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}