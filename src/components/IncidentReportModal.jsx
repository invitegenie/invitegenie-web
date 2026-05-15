import React, { useState } from "react";
import Modal from "./Modal";

const INCIDENT_TYPES = [
  "Technical Issue",
  "Medical Emergency",
  "Security Issue",
  "Vendor No-Show",
  "Catering Delay",
  "Timeline Delay",
  "Weather Issue",
  "Other"
];

const SEVERITIES = ["Info", "Warning", "Critical", "Emergency"];

export default function IncidentReportModal({ isOpen, onClose, eventId }) {
  const [form, setForm] = useState({ type: INCIDENT_TYPES[0], severity: "Warning", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return alert("Please provide a description.");
    
    setIsSubmitting(true);
    
    // Simulate API call / saving to mock backend
    setTimeout(() => {
      setIsSubmitting(false);
      
      const newItem = {
        id: Date.now(),
        type: 'alert',
        message: `${form.type} reported: ${form.description}`,
        time: 'Just now',
        icon: form.severity === 'Emergency' ? 'campaign' : form.severity === 'Critical' ? 'error' : 'report_problem',
        color: form.severity === 'Emergency' || form.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400',
        bg: form.severity === 'Emergency' || form.severity === 'Critical' ? 'bg-rose-400/10' : 'bg-amber-400/10'
      };
      window.dispatchEvent(new CustomEvent("invitegenie:new-feed-item", { detail: { eventId, item: newItem } }));

      setForm({ type: INCIDENT_TYPES[0], severity: "Warning", description: "" });
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} title="Log Incident" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Incident Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-amber-400">
            {INCIDENT_TYPES.map(type => <option key={type} value={type} className="bg-slate-900">{type}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Severity</label>
          <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-amber-400">
            {SEVERITIES.map(sev => <option key={sev} value={sev} className="bg-slate-900">{sev}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe what happened..." rows={4} className="w-full resize-none px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm leading-6 text-white outline-none focus:border-amber-400" />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl bg-amber-400 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg hover:bg-amber-300 transition-colors disabled:opacity-50">
            {isSubmitting ? "Logging..." : "Log Incident"}
          </button>
        </div>
      </form>
    </Modal>
  );
}