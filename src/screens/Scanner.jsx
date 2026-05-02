import { useState, useMemo, useEffect } from "react";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";

export default function Scanner() {
  const [scanCode, setScanCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(Engine.getCollection(KEYS.TICKETS));
    // Subscribe to updates so scan history stays current
    return Engine.subscribe(KEYS.TICKETS, setTickets);
  }, []);

  const handleValidateGuest = () => {
    setError("");
    setIsLoading(true);

    if (!scanCode.trim()) {
      setIsLoading(false);
      setError("Please enter a QR/check-in code");
      return;
    }

    // Simulate network delay for "professional" feel
    setTimeout(() => {
      const result = Engine.validateTicket(scanCode);
      if (result.success) {
        setValidationResult(result);
        setScanCode("");
      } else {
        setError(result.message);
        setValidationResult(null);
      }
      setIsLoading(false);
    }, 600);
  };

  const recentCheckins = useMemo(() => {
    return tickets
      .filter(t => t.status === "Validated")
      .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt))
      .slice(0, 10);
  }, [tickets]);

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-black text-white tracking-tighter">STAFF AGENT SCANNER</h1>
             <p className="text-gray-500 text-xs mt-1 uppercase font-bold tracking-[0.2em]">Validate Access â€¢ {recentCheckins.length} Recent Scans</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-all">Select Event</button>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Center Column: Scanner Viewfinder */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-[3rem] bg-[#0c0c0e] border border-white/10 overflow-hidden shadow-2xl group">
              {/* Simulated Viewfinder */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-64 h-64 border-2 border-violet-500/40 rounded-3xl relative">
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-xl" />
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute inset-x-4 top-0 h-0.5 bg-violet-400/50 blur-sm animate-[scan_3s_infinite]" />
                 </div>
              </div>
              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-10">
                 <div className="w-full flex justify-between items-center">
                    <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">Camera ID: Genie-Front-01</div>
                    <button className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"><span className="material-symbols-outlined">flashlight_on</span></button>
                 </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                   <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                   <p className="text-xs font-black text-violet-400 uppercase tracking-[0.3em]">Querying Realm...</p>
                </div>
              )}
            </div>

            {/* Manual Entry Fallback */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl">
               <div className="flex gap-4">
                 <div className="relative flex-1">
                   <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-500">confirmation_number</span>
                   <input 
                    type="text" 
                    placeholder="Manually enter Ticket ID or Unique ID..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleValidateGuest()}
                   />
                 </div>
                 <button 
                   onClick={handleValidateGuest}
                   disabled={isLoading || !scanCode}
                   className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 active:scale-95 transition-all shadow-lg shadow-violet-900/40 disabled:opacity-50"
                 >
                   Validate
                 </button>
               </div>
               {error && <p className="mt-4 text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-[14px]">error</span> {error}</p>}
            </div>
          </div>

          {/* Right Column: Active Result & History */}
          <div className="lg:col-span-4 space-y-6">
            {/* Validation Feedback */}
            <div className={`p-8 rounded-[2.5rem] border transition-all h-[320px] flex flex-col items-center justify-center text-center ${
              validationResult ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 border-dashed'
            }`}>
               {validationResult ? (
                 <div className="animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-emerald-500/40">
                       <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase">{validationResult.ticket.buyerName}</h3>
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">{validationResult.ticket.type} Pass</p>
                    <div className="mt-6 pt-6 border-t border-emerald-500/10 flex flex-col gap-2">
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Event: <span className="text-gray-300">{validationResult.ticket.eventName}</span></p>
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">ID: <span className="text-gray-300">{validationResult.ticket.id}</span></p>
                    </div>
                 </div>
               ) : (
                 <div className="text-gray-600">
                    <span className="material-symbols-outlined text-5xl mb-4 opacity-20">qr_code_2</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Scan...</p>
                 </div>
               )}
            </div>

            {/* Scan History */}
            <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex-1 min-h-[400px]">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 px-2">Live Activity Log</h3>
               <div className="space-y-3">
                  {recentCheckins.map((tkt, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-all">
                       <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          {tkt.buyerName?.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">{tkt.buyerName}</p>
                          <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter truncate">{tkt.eventName}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-emerald-500 font-black">VALID</p>
                          <p className="text-[7px] text-gray-600 font-bold uppercase">{new Date(tkt.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </div>
                  ))}
                  {recentCheckins.length === 0 && (
                    <p className="text-center py-20 text-[10px] text-gray-600 font-bold uppercase tracking-widest">No entries recorded yet</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS for scanning line animation */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </Layout>
  );
}
