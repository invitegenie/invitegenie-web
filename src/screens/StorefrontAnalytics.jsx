import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getTenantByProviderId } from "../services/tenantService";
import { getStorefrontAnalytics } from "../services/storefrontAnalyticsService";
import Icon from "../components/Icon";

export default function StorefrontAnalytics() {
  const { currentUser } = useAuth();
  const providerId = currentUser?.id || "demo";
  const tenant = getTenantByProviderId(providerId);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (tenant?.id) {
      setStats(getStorefrontAnalytics(tenant.id));
    }
  }, [tenant]);

  if (!tenant) return <Layout><div className="p-8 text-white flex flex-col items-center justify-center min-h-[50vh]"><Icon name="query_stats" className="text-6xl text-violet-400 mb-4" /><h2 className="text-xl font-bold">No Storefront Found</h2><p className="text-slate-400 mt-2">Create your storefront settings first to start collecting analytics.</p></div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">Insights</p>
          <h1 className="text-3xl font-black text-white mt-1">Storefront Analytics</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl leading-6">Track visitors, service engagements, and lead conversions on your public storefront in real-time.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <StatCard title="Total Visits" value={stats?.visits || 0} icon="visibility" />
          <StatCard title="Service Views" value={stats?.serviceViews || 0} icon="touch_app" />
          <StatCard title="Bookings Initiated" value={stats?.bookings || 0} icon="shopping_cart" highlight />
          <StatCard title="WhatsApp Leads" value={stats?.whatsappClicks || 0} icon="chat" />
        </div>
        
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 md:p-8 mt-8 shadow-xl">
          <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2"><Icon name="trending_up" className="text-emerald-400" /> Popular Services</h3>
          {stats?.productViews && Object.keys(stats.productViews).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.productViews).map(([id, views]) => <div key={id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5"><span className="text-sm font-bold text-slate-300">Service ID: {id}</span><span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{views} Views</span></div>)}
            </div>
          ) : <div className="text-center py-8 bg-black/20 rounded-2xl border border-white/5 border-dashed"><p className="text-sm font-bold text-slate-500">Not enough data yet. Share your storefront link!</p></div>}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, highlight }) {
  return <div className={`bg-[#111827] border rounded-3xl p-6 shadow-lg transition-transform hover:-translate-y-1 ${highlight ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10'}`}><div className="flex justify-between items-start"><p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] max-w-[70%] leading-relaxed">{title}</p><Icon name={icon} className={`text-xl ${highlight ? 'text-violet-400' : 'text-slate-400'}`} /></div><p className={`text-4xl font-black mt-4 ${highlight ? 'text-white' : 'text-slate-200'}`}>{value}</p></div>;
}