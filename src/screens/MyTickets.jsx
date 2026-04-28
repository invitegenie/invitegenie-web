import { useEffect, useState } from "react";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";

const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount).replace('FCFA', 'FCFA ');
};

export default function MyTickets() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setTickets(Engine.getTicketsByUser(currentUser.id));
    }
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">MY TICKETS</h1>
        <p className="text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Vouchers & Digital Passes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.length > 0 ? tickets.map((tkt) => (
          <div key={tkt.id} className="bg-white/[0.035] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{tkt.eventName}</h3>
                <p className="text-xs text-violet-400 font-black mt-1 uppercase tracking-widest">{tkt.id}</p>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                {tkt.status}
              </div>
            </div>
            <div className="space-y-3 border-t border-white/5 pt-4">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                <span>Buyer</span>
                <span className="text-white">{tkt.buyerName}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                <span>Date</span>
                <span className="text-white">{tkt.date}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase pt-2 border-t border-white/5">
                <span>Total Paid</span>
                <span className="text-emerald-400 font-bold">{formatFCFA(tkt.price)}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center p-4 bg-white rounded-2xl shadow-xl shadow-black/20">
               <div className="w-32 h-32 bg-slate-100 flex items-center justify-center border-2 border-slate-200 rounded-lg">
                  <span className="material-symbols-outlined text-5xl text-slate-300">qr_code_2</span>
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No tickets purchased yet</p>
          </div>
        )}
      </div>
    </div>
  );
}