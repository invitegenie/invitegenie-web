import React from "react";
import Icon from "./Icon";

const defaultMockTimeline = [
  { id: 'tl-1', time: '08:00 AM', title: 'Venue Setup', status: 'completed', description: 'Decorators and technical team arrive for staging.' },
  { id: 'tl-2', time: '11:00 AM', title: 'Sound & Light Check', status: 'completed', description: 'Audio engineering tests main stage equipment.' },
  { id: 'tl-3', time: '02:00 PM', title: 'Vendor Briefing', status: 'current', description: 'Final alignment with catering, security, and ushers.' },
  { id: 'tl-4', time: '04:00 PM', title: 'Guest Arrival', status: 'upcoming', description: 'Doors open, VIP red carpet and check-in begins.' },
  { id: 'tl-5', time: '06:30 PM', title: 'Opening Ceremony', status: 'upcoming', description: 'Host welcomes guests, dinner service starts.' },
  { id: 'tl-6', time: '09:00 PM', title: 'Main Entertainment', status: 'upcoming', description: 'Headline performances and DJ sets.' },
];

const statusStyles = {
  completed: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  current: {
    dot: "bg-blue-500 animate-pulse",
    ring: "ring-blue-500/30",
    text: "text-blue-400",
    bg: "bg-blue-500/10 border border-blue-500/20",
  },
  delayed: {
    dot: "bg-amber-500",
    ring: "ring-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  upcoming: {
    dot: "bg-slate-600",
    ring: "ring-transparent",
    text: "text-slate-500",
    bg: "bg-transparent",
  }
};

export default function EventTimelineTracker({ timeline = [] }) {
  const displayTimeline = timeline.length > 0 ? timeline : defaultMockTimeline;

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2"><Icon name="schedule" className="text-violet-400" /> Live Timeline</h2>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-white/5">Schedule</span>
      </div>
      
      <div className="relative border-l-2 border-slate-800 ml-3 md:ml-4 space-y-6 pb-2">
        {displayTimeline.map((item) => {
          const style = statusStyles[item.status || 'upcoming'];
          
          return (
            <div key={item.id} className="relative pl-6 sm:pl-8">
              <span className={`absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 ring-4 ${style.ring}`}>
                <div className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
              </span>
              <div className={`p-4 rounded-2xl transition-all duration-300 ${style.bg}`}><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2"><h3 className="text-sm font-bold text-white">{item.title}</h3><span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${style.text}`}>{item.time}</span></div>{item.description && <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}