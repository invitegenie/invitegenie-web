import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Wish() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10 text-center pt-10 pb-20">
        <header className="space-y-4">
           <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-amber-400 shadow-2xl animate-bounce">
              <span className="material-symbols-outlined text-4xl text-white">magic_button</span>
           </div>
           <h1 className="text-5xl font-black text-white font-heading tracking-tight">Make a Wish</h1>
           <p className="text-slate-400 text-lg">What magic should InviteGenie perform for your next event?</p>
        </header>

        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           <div className="relative bg-[#141218] rounded-[2.5rem] border border-white/10 p-10">
              <textarea 
                rows={6}
                placeholder="I wish for an invitation that feels like a neon forest at midnight..."
                className="w-full bg-transparent text-white text-xl font-medium outline-none resize-none placeholder-slate-700"
              />
              <div className="mt-8 flex justify-center">
                 <button className="px-12 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-purple-900/30">
                    Summon Wish
                 </button>
              </div>
           </div>
        </div>

        <button onClick={() => navigate(-1)} className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
           Return to Realm
        </button>
      </div>
    </Layout>
  );
}
