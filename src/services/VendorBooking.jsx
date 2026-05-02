import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getProviderById } from "../services/mockData";

export default function VendorBooking() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const provider = getProviderById(providerId);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pkg, setPkg] = useState(null);

  if (!provider) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <p className="text-white">Provider not found.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-4 text-violet-400">Back to Marketplace</button>
        </div>
      </Layout>
    );
  }

  const packages = provider.packages?.length ? provider.packages : [
    { name: "Basic Package", price: 50000, description: "Standard service" },
    { name: "Premium Package", price: 125000, description: "Extended service with priority" },
    { name: "Enterprise Package", price: 250000, description: "Full day coverage and extras" }
  ];

  const subtotal = pkg ? pkg.price : 0;
  const tax = Math.round(subtotal * 0.18);
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + tax + platformFee;

  const handleProceed = () => {
    if (!currentUser) return navigate("/login");
    if (!date || !time || !pkg) return alert("Please select date, time, and package.");
    if (currentUser.id === provider.ownerId) return alert("You cannot book your own service.");

    const order = {
      id: `ORD-${Date.now()}`,
      kind: "marketplace_order",
      listingId: provider.id,
      providerName: provider.businessName,
      packageName: pkg.name,
      selectedDate: date,
      selectedTime: time,
      amount: total,
      subtotal,
      tax,
      platformFee,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("demo_pending_checkout", JSON.stringify(order));
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 pb-32 pt-6">
        <header>
          <button onClick={() => navigate(`/marketplace/${providerId}`)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white mb-6">
            <Icon name="arrow_back" className="text-lg" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-white">Book {provider.businessName}</h1>
          <p className="text-sm text-slate-400 mt-2">Secure your slot with this provider in just a few steps.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Date & Time */}
            <section className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs">1</span>
                Choose Date & Time
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Event Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Slots</label>
                  <div className="flex flex-wrap gap-2">
                    {["09:00", "10:00", "11:00", "14:00", "15:00"].map(t => (
                      <button key={t} onClick={() => setTime(t)} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${time === t ? 'bg-violet-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-400 hover:bg-white/5'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Package */}
            <section className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs">2</span>
                Select Package
              </h2>
              <div className="space-y-3">
                {packages.map((p, idx) => (
                  <div key={idx} onClick={() => setPkg(p)} className={`cursor-pointer border rounded-2xl p-4 flex justify-between items-center transition ${pkg?.name === p.name ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-slate-900 hover:bg-white/5'}`}>
                    <div>
                      <h3 className="font-bold text-white">{p.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>
                    <p className="font-black text-emerald-400">FCFA {p.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-6">
              <h2 className="text-lg font-bold text-white mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <img src={provider.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="text-sm font-bold text-white">{provider.businessName}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{provider.category}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Package</span>
                  <span className="text-white font-bold">{pkg ? pkg.name : "None selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="text-white font-bold">{date && time ? `${date} at ${time}` : "None selected"}</span>
                </div>
              </div>

              <div className="space-y-3 pb-6 border-b border-white/5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">FCFA {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax (18%)</span>
                  <span className="text-white">FCFA {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Platform Fee (5%)</span>
                  <span className="text-white">FCFA {platformFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-black text-white uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black text-emerald-400">FCFA {total.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleProceed}
                disabled={!date || !time || !pkg}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all shadow-xl"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}