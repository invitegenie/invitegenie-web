﻿﻿﻿import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { sendMessage } from "../services/messagingService";
import { getProviderById } from "../services/mockData";

const BookingModal = ({ isOpen, onClose, vendor, onSubmit }) => {
  const [formData, setFormData] = useState({ date: '', requirements: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-[#2A3342] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-[#2A3342]">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Manifest Inquiry</h2>
          <p className="text-xs text-[#9CA3AF] mt-1 font-bold uppercase tracking-widest">To: {vendor.name}</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Desired Event Date</label>
            <input 
              type="date" 
              required
              className="w-full bg-[#0B0F19] border border-[#2A3342] text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#8B5CF6]/50 outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Service Requirements</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-[#0B0F19] border border-[#2A3342] text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#8B5CF6]/50 outline-none transition-all resize-none"
              placeholder="Describe what you need from this partner... (e.g. 5-hour DJ set, specific genre, equipment provided)"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 px-4 py-4 rounded-2xl border border-[#2A3342] text-[#9CA3AF] text-xs font-black uppercase tracking-widest hover:bg-[#1F2937] transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
            >
              Send Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function VendorDetails() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const allVendors = useEngineCollection(KEYS.VENDORS) || [];
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const vendor = useMemo(() => {
    const engineVendor = allVendors.find(v => String(v.id) === String(vendorId));
    if (engineVendor) return engineVendor;
    return getProviderById(vendorId);
  }, [allVendors, vendorId]);

  const handleInquirySubmit = (data) => {
    // For now, mock the submission. Later this will sync to Supabase.
    alert(`Inquiry sent to ${vendor.name} for ${data.date}. The Genie will notify you once they respond!`);
    setIsBookingModalOpen(false);

    const existingNotifs = Engine.getCollection(KEYS.NOTIFICATIONS) || [];
    Engine.save(KEYS.NOTIFICATIONS, [
      {
        id: `notif-inquiry-${Date.now()}`,
        userId: vendor.ownerId || vendor.userId || vendor.id,
        type: "vendor",
        title: "New Vendor Inquiry",
        message: `You have received a new inquiry for ${data.date}.`,
        path: "/dashboard?panel=quotes",
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...existingNotifs
    ]);
  };

  // Local mocks for detailed content not currently stored in the core engine keys
  const portfolio = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?w=800",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
  ];

  const pricingPlans = [
    { name: "Essential", price: "50,000 FCFA", features: ["Standard Equipment", "4 Hours Coverage", "Basic Editing"] },
    { name: "Premium", price: "150,000 FCFA", features: ["Professional Gear", "Full Event Coverage", "Advanced Post-Production", "Genie Priority Support"], popular: true },
    { name: "Royal", price: "Custom Quote", features: ["Full Production Team", "Drone Coverage", "Live Streaming", "Unlimited Revisions"] }
  ];

  const reviews = [
    { user: "Marie N.", rating: 5, comment: "Absolutely magical service! They handled everything perfectly.", date: "2 days ago" },
    { user: "Tunde A.", rating: 4, comment: "Very professional and on time. Would recommend for corporate events.", date: "1 week ago" }
  ];

  if (!vendor) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <Icon name="person_off" className="text-5xl text-[#2A3342] mb-4" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Partner Not Found</h2>
          <button onClick={() => navigate("/marketplace")} className="mt-6 px-10 py-3 bg-[#1F2937] border border-[#2A3342] rounded-xl text-white font-bold hover:bg-[#2A3342] transition-all">Back to Marketplace</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 font-sans">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/marketplace")} 
          className="flex items-center gap-2 text-xs font-black text-[#6B7280] uppercase tracking-widest hover:text-[#8B5CF6] transition-colors group"
        >
          <Icon name="arrow_back" className="text-[18px] transition-transform group-hover:-translate-x-1" />
          Back to Marketplace
        </button>

        {/* Hero Identity Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#111827] border border-[#2A3342] shadow-2xl">
          <div className="h-48 bg-gradient-to-r from-[#8B5CF6]/20 to-[#22C55E]/10" />
          <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6 text-center md:text-left">
            <div className="mx-auto md:mx-0 w-32 h-32 rounded-[2rem] border-4 border-[#0B0F19] bg-[#1F2937] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden shrink-0">
              {vendor.image ? <img src={vendor.image} className="w-full h-full object-cover" /> : (vendor.name ? vendor.name[0] : "V")}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{vendor.name}</h1>
                {vendor.isVerified && <Icon name="verified" className="text-[#8B5CF6]" />}
              </div>
              <p className="text-[#A78BFA] text-sm font-bold uppercase tracking-widest">{vendor.service || vendor.category}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-[#9CA3AF] font-medium uppercase tracking-tighter">
                <span className="flex items-center gap-1.5"><Icon name="star" className="text-amber-400 text-sm" /> {vendor.rating || "New"}</span>
                <span className="flex items-center gap-1.5"><Icon name="location_on" className="text-sm" /> {vendor.location || "Cameroon"}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mx-auto md:mx-0">
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="px-10 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Inquire Now
              </button>
              <button 
                onClick={() => setIsMessageModalOpen(true)}
                className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-white/10 active:scale-95 transition-all"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Navigation Tabs */}
        <div className="flex gap-1 p-1 bg-[#111827] border border-[#2A3342] rounded-2xl w-fit">
          {["portfolio", "pricing", "reviews"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20" : "text-[#9CA3AF] hover:text-[#F9FAFB]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Viewport */}
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {portfolio.map((img, i) => (
                <div key={`portfolio-${i}`} className="aspect-square rounded-[2.5rem] overflow-hidden border border-[#2A3342] bg-[#111827] group cursor-pointer shadow-lg hover:border-[#8B5CF6]/50 transition-all">
                  <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Work sample" />
                </div>
              ))}
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <div key={`pricing-${i}`} className={`p-8 rounded-[2.5rem] bg-[#111827] border flex flex-col shadow-xl transition-all hover:scale-[1.02] ${plan.popular ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6]/30' : 'border-[#2A3342]'}`}>
                  {plan.popular && <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.2em] mb-4">Genie Recommendation</span>}
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-[#22C55E] font-black mt-2 text-lg">{plan.price}</p>
                  <ul className="mt-10 space-y-5 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={`feature-${i}-${j}`} className="flex items-center gap-3 text-xs text-[#9CA3AF] font-bold">
                        <Icon name="check_circle" className="text-[#22C55E] text-sm" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-12 w-full py-4 bg-[#1F2937] border border-[#2A3342] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#8B5CF6] hover:border-transparent transition-all shadow-md">Select Package</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-4xl">
              {reviews.map((rev, i) => (
                <div key={`review-${i}`} className="p-8 rounded-[2.5rem] bg-[#111827] border border-[#2A3342] shadow-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#22C55E]/10 flex items-center justify-center text-[#A78BFA] font-black shadow-inner border border-[#2A3342]">{rev.user[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-[#F9FAFB]">{rev.user}</p>
                        <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-widest mt-0.5">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Icon key={`star-${i}-${j}`} name="star" className={`text-sm ${j < rev.rating ? 'text-amber-400' : 'text-[#2A3342]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed pl-16 border-l-2 border-[#8B5CF6]/20">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        vendor={vendor} 
        onSubmit={handleInquirySubmit}
      />
      <MessageModal provider={vendor} open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} onInbox={() => navigate("/inbox")} />
    </Layout>
  );
}

function MessageModal({ provider, open, onClose, onInbox }) {
  const { currentUser, profile } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    setSending(true);
    setTimeout(() => {
      sendMessage({
        senderId: currentUser?.id || "demo-user",
        senderName: profile?.full_name || currentUser?.name || "Guest",
        receiverId: provider.ownerId || provider.userId || provider.sellerId || provider.id || "vendor",
        receiverName: provider.businessName || provider.name || "Vendor",
        text,
        listingId: provider.id,
        listingName: provider.title || provider.businessName || provider.name
      });
      setSending(false);
      onClose();
      onInbox();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 text-left">
          <h2 className="text-xl font-black text-white">Message {provider.businessName || provider.name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="close" /></button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Hi, I'm interested in your services for my upcoming event..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-violet-500 resize-none mb-4" />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">Cancel</button>
          <button disabled={!text.trim() || sending} onClick={handleSend} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500 disabled:opacity-50">{sending ? "Sending..." : "Send Message"}</button>
        </div>
      </div>
    </div>
  );
}
