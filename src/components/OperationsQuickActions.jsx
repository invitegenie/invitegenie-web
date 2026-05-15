import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import IncidentReportModal from "./IncidentReportModal";
import StaffAssignmentModal from "./StaffAssignmentModal";

const actions = [
  { id: 'broadcast', label: 'Broadcast', icon: 'campaign', color: 'text-blue-400', bg: 'bg-blue-400/10', hover: 'hover:bg-blue-400/20' },
  { id: 'assign_staff', label: 'Assign Staff', icon: 'person_add', color: 'text-emerald-400', bg: 'bg-emerald-400/10', hover: 'hover:bg-emerald-400/20' },
  { id: 'incident', label: 'Log Incident', icon: 'report_problem', color: 'text-amber-400', bg: 'bg-amber-400/10', hover: 'hover:bg-amber-400/20' },
  { id: 'emergency', label: 'Emergency', icon: 'warning', color: 'text-rose-400', bg: 'bg-rose-500/10', hover: 'hover:bg-rose-500/20', isCritical: true },
  { id: 'pause', label: 'Pause Line', icon: 'pause_circle', color: 'text-violet-400', bg: 'bg-violet-400/10', hover: 'hover:bg-violet-400/20' },
  { id: 'vendor', label: 'Vendors', icon: 'storefront', color: 'text-indigo-400', bg: 'bg-indigo-400/10', hover: 'hover:bg-indigo-400/20' },
  { id: 'sponsors', label: 'Sponsors', icon: 'stars', color: 'text-amber-400', bg: 'bg-amber-400/10', hover: 'hover:bg-amber-400/20' },
];

export default function OperationsQuickActions({ eventId }) {
  const navigate = useNavigate();
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);

  const handleAction = (action) => {
    if (action.id === 'incident') {
      setIsIncidentModalOpen(true);
    } else if (action.id === 'assign_staff') {
      setIsAssignStaffModalOpen(true);
    } else if (action.id === 'sponsors') {
      navigate(`/events/${eventId}/sponsors/manage`);
    } else {
      // For now, this is a mock trigger to show the interaction
      alert(`Action Triggered: ${action.label}\n\nThis will open the ${action.label} modal/flow for event ID: ${eventId}.`);
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-black text-white flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <Icon name="bolt" className="text-yellow-400" /> Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={`group flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 transition-all duration-200 ${action.bg} ${action.hover} ${action.isCritical ? 'hover:scale-105 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'hover:-translate-y-1'}`}
            >
              <Icon name={action.icon} className={`text-2xl mb-2 transition-transform group-hover:scale-110 ${action.color}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${action.color}`}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <IncidentReportModal isOpen={isIncidentModalOpen} onClose={() => setIsIncidentModalOpen(false)} eventId={eventId} />
      <StaffAssignmentModal isOpen={isAssignStaffModalOpen} onClose={() => setIsAssignStaffModalOpen(false)} eventId={eventId} />
    </>
  );
}
