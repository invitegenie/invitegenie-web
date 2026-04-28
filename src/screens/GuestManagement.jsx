import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";
import { EventStatCard } from "../components/RichCards";
import * as Engine from "../auth/coreEngine"; // Assuming this points to the new engine logic
import { KEYS } from "../auth/coreEngine";

export default function GuestManagement() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Initial load
    setTickets(Engine.getCollection(KEYS.TICKETS));

    // Subscribe to live updates from the engine
    const unsubscribe = Engine.subscribe(KEYS.TICKETS, (updatedTickets) => {
      setTickets(updatedTickets);
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const total = tickets.length;
    const confirmed = tickets.filter(t => t.status === 'Confirmed' || t.status === 'Validated').length;
    // Calculate open rate based on whether the lastActivity contains a view or open event
    const engaged = tickets.filter(t => t.lastActivity && (t.lastActivity.includes('VIEW') || t.lastActivity.includes('OPEN'))).length;
    const openRate = total > 0 ? Math.round((engaged / total) * 100) : 0;

    return { total, confirmed, openRate };
  }, [tickets]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <PageTitle title="Guest Management" subtitle="Track invitations and guest satisfaction in real-time." />
          <button className="rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500">
            + Invite Guest
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <EventStatCard label="Total Guests" value={stats.total.toLocaleString()} icon="groups" color="text-purple-400" />
          <EventStatCard label="Confirmed" value={stats.confirmed.toLocaleString()} icon="check_circle" color="text-emerald-400" />
          <EventStatCard label="Open Rate" value={`${stats.openRate}%`} icon="mail" color="text-amber-400" />
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last Activity</th>
                <th className="px-8 py-5 text-center">Views</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((tkt) => (
                <tr key={tkt.id} className="group transition hover:bg-white/[0.02]">
                  <td className="px-8 py-5">
                    <p className="font-bold text-white">{tkt.buyerName}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">{tkt.id}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                      tkt.status === 'Confirmed' || tkt.status === 'Validated' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tkt.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-tighter">
                      {tkt.lastActivity ? tkt.lastActivity.split(' ')[0].replace('_', ' ') : 'NO ACTIVITY'}
                    </p>
                    <p className="text-[9px] text-slate-600 font-medium">{tkt.lastActivity ? new Date(tkt.lastActivity.split(' ')[1]).toLocaleString() : 'Pending'}</p>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-black text-violet-400">
                    {tkt.totalInvitationViews || 0}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}