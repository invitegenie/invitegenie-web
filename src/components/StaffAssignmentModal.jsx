import React, { useState } from "react";
import Modal from "./Modal";

const MOCK_STAFF = [
  { id: "s1", name: "Sarah M. (Event Coordinator)" },
  { id: "s2", name: "Brice Tech (A/V Lead)" },
  { id: "s3", name: "Awa Catering (F&B Manager)" },
  { id: "s4", name: "Emmanuel (Logistics)" },
  { id: "s5", name: "Nfor Security (Head of Security)" }
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function StaffAssignmentModal({ isOpen, onClose, eventId }) {
  const [form, setForm] = useState({ title: "", description: "", assignee: MOCK_STAFF[0].id, priority: "Medium", dueTime: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please provide a task title.");
    
    setIsSubmitting(true);
    
    // Simulate API call / saving to mock backend
    setTimeout(() => {
      setIsSubmitting(false);
      const staffName = MOCK_STAFF.find(s => s.id === form.assignee)?.name;
      alert(`Task assigned to ${staffName}: ${form.title}`);
      setForm({ title: "", description: "", assignee: MOCK_STAFF[0].id, priority: "Medium", dueTime: "" });
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} title="Assign Staff" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Task Title</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Check microphone at main stage" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-emerald-400" />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Assign To</label>
          <select value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-emerald-400">
            {MOCK_STAFF.map(staff => <option key={staff.id} value={staff.id} className="bg-slate-900">{staff.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-emerald-400">
              {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Due Time</label>
            <input type="time" value={form.dueTime} onChange={e => setForm({...form, dueTime: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-emerald-400" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Details (Optional)</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Any specific instructions..." rows={3} className="w-full resize-none px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm leading-6 text-white outline-none focus:border-emerald-400" />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
            {isSubmitting ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}