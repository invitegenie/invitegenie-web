import React from "react";
import Icon from "./Icon";

const defaultMockStaff = [
  { id: 's1', name: 'Sarah M.', role: 'Event Coordinator', status: 'Available', avatar: 'S' },
  { id: 's2', name: 'Brice Tech', role: 'A/V Lead', status: 'Busy', avatar: 'B', currentTask: 'Main Stage Setup' },
  { id: 's3', name: 'Awa Catering', role: 'F&B Manager', status: 'On Break', avatar: 'A' },
  { id: 's4', name: 'Emmanuel', role: 'Logistics', status: 'Offline', avatar: 'E' },
  { id: 's5', name: 'Nfor Security', role: 'Head of Security', status: 'Handling Emergency', avatar: 'N', location: 'Gate B' },
];

const statusConfig = {
  'Available': { color: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  'Busy': { color: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/20' },
  'On Break': { color: 'bg-amber-500', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  'Handling Emergency': { color: 'bg-rose-500 animate-pulse', text: 'text-rose-400', ring: 'ring-rose-500/20' },
  'Offline': { color: 'bg-slate-600', text: 'text-slate-500', ring: 'ring-transparent' },
};

export default function StaffStatusPanel({ staff = [] }) {
  const displayStaff = staff.length > 0 ? staff : defaultMockStaff;
  const onlineCount = displayStaff.filter(s => s.status !== 'Offline').length;

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 shrink-0">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Icon name="groups" className="text-blue-400" /> Staff Coordination
        </h2>
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          {onlineCount} Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {displayStaff.map((member) => {
          const style = statusConfig[member.status] || statusConfig['Offline'];

          return (
            <div key={member.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-colors">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-black shadow-inner">
                  {member.avatar || member.name.charAt(0)}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e293b] ${style.color} ring-2 ${style.ring}`} />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-white truncate pr-2">{member.name}</p>
                  <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest ${style.text}`}>{member.status}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5 truncate">{member.role}</p>
                {(member.currentTask || member.location) && (
                  <p className="text-xs text-slate-400 mt-1.5 truncate flex items-center gap-1"><Icon name={member.location ? "location_on" : "task_alt"} className="text-[14px]" />{member.currentTask || member.location}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}