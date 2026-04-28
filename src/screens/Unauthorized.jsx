import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute h-[300px] w-[300px] rounded-full bg-rose-600/5 blur-[80px]" />
      
      <div className="relative z-10 max-w-md">
        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 border border-rose-500/20 mx-auto shadow-2xl">
          <span className="material-symbols-outlined text-rose-500 text-4xl">lock_person</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">Restricted Realm</h1>
        <p className="text-slate-500 mb-10 leading-relaxed uppercase font-bold text-xs tracking-widest">
          The spirits indicate you do not have the clearance to enter this section. Please consult your administrator.
        </p>
        <button onClick={() => navigate("/dashboard")} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl">Return to Dashboard</button>
      </div>
    </div>
  );
}