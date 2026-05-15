import React, { useState, useEffect } from "react";
import Icon from "./Icon";

const mockFeed = [
  { id: 1, type: 'task', message: 'Technical team completed "Sound & Light Check"', time: '2 mins ago', icon: 'task_alt', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 2, type: 'vendor', message: 'Luxe Catering checked in at Gate B', time: '15 mins ago', icon: 'local_shipping', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 3, type: 'alert', message: 'Medical emergency reported at Main Stage', time: '22 mins ago', icon: 'campaign', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 4, type: 'staff', message: 'Sarah (Coordinator) marked status as "Busy"', time: '1 hour ago', icon: 'person', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 5, type: 'timeline', message: 'Phase "Vendor Briefing" started', time: '2 hours ago', icon: 'schedule', color: 'text-violet-400', bg: 'bg-violet-400/10' },
];

export default function LiveOperationsFeed({ eventId }) {
  const [feed, setFeed] = useState(mockFeed);

  useEffect(() => {
    const handleNewItem = (e) => {
      if (e.detail.eventId === eventId) {
        setFeed((prev) => [e.detail.item, ...prev]);
      }
    };
    window.addEventListener("invitegenie:new-feed-item", handleNewItem);
    return () => window.removeEventListener("invitegenie:new-feed-item", handleNewItem);
  }, [eventId]);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 shrink-0">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Icon name="rss_feed" className="text-emerald-400" /> Live Feed
        </h2>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
        {feed.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className={`mt-1 shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}><Icon name={item.icon} className="text-[20px]" /></div>
            <div><p className="text-sm font-medium text-slate-200 leading-snug">{item.message}</p><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.time}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}