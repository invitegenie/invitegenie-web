import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Icon({ name, className = "" }) {
  const iconStyle = {
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };
  return (
    <span className={`material-symbols-outlined ${className}`} style={iconStyle}>
      {name}
    </span>
  );
}

export default function Points() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-8 sm:px-5 xl:px-6">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-white/5 p-2 hover:bg-white/10"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">Convert Points</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 backdrop-blur-xl flex items-center justify-between">
               <div>
                 <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Total Balance</p>
                 <h2 className="text-5xl font-black text-white">1,560 <span className="text-xl text-slate-500">Pts</span></h2>
               </div>
               <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                 <Icon name="stars" className="text-[40px]" />
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-white px-2">Earning History</h3>
            <div className="space-y-3">
               {[
                 { label: "Event 'Afro Beats' Completion", date: "Oct 24, 2024", pts: "+500" },
                 { label: "Successful RSVP Milestone", date: "Oct 22, 2024", pts: "+200" },
                 { label: "New Vendor Referral", date: "Oct 15, 2024", pts: "+800" },
               ].map((item, i) => (
                 <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                    <span className="text-emerald-400 font-black">{item.pts}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-purple-600/20 to-transparent p-8 backdrop-blur-xl">
            <Icon name="redeem" className="text-purple-400 text-[32px] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Redeem Rewards</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">Trade your hard-earned points for exclusive perks.</p>
            <div className="space-y-4">
               <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">1 Month Pro Upgrade (1,000 Pts)</button>
               <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">Custom Email Domain (2,500 Pts)</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
