import React, { useState } from "react";
import Icon from "./Icon";

const severityStyles = {
  'Info': 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  'Warning': 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  'Critical': 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  'Emergency': 'bg-rose-500/10 border-rose-500/30 text-rose-400',
};

const iconMap = {
  'Info': 'info',
  'Warning': 'warning',
  'Critical': 'error',
  'Emergency': 'campaign',
};

const defaultMockAlerts = [
  { id: 'alert-1', severity: 'Emergency', type: 'Medical Incident', message: 'Medical assistance requested at Main Stage (Guest fainted).' },
  { id: 'alert-2', severity: 'Warning', type: 'Timeline Delay', message: 'Catering setup is running 15 minutes behind schedule.' }
];

export default function EmergencyAlertBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState([]);

  const displayAlerts = alerts.length > 0 ? alerts : defaultMockAlerts;
  const activeAlerts = displayAlerts.filter(a => !dismissed.includes(a.id));

  if (!activeAlerts.length) return null;

  return (
    <div className="space-y-3 mb-6">
      {activeAlerts.map(alert => {
        const style = severityStyles[alert.severity] || severityStyles['Info'];
        const icon = iconMap[alert.severity] || 'info';

        return (
          <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border ${style} backdrop-blur-sm shadow-lg`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/10 shrink-0 ${alert.severity === 'Emergency' ? 'animate-pulse' : ''}`}><Icon name={icon} className="text-xl" /></div>
              <div><p className="font-black text-sm uppercase tracking-widest">{alert.title || alert.type}</p><p className="text-sm font-medium mt-1 opacity-90">{alert.message || alert.description}</p></div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Take Action</button>
              <button onClick={() => setDismissed([...dismissed, alert.id])} className="p-2 hover:bg-white/20 rounded-xl transition-colors shrink-0"><Icon name="close" className="text-sm" /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}