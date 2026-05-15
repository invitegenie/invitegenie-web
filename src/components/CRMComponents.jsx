import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { getNotes, saveNote } from "../services/vendorCRMService";

export function CRMStatCard({ label, value, icon, color = "text-violet-400", bg = "bg-violet-400/10" }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 shadow-xl transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
          <Icon name={icon} className="text-xl" />
        </div>
      </div>
    </div>
  );
}

export function LeadCard({ lead, onClick }) {
  const statusColors = {
    new: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    contacted: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    qualified: "bg-violet-400/10 text-violet-400 border-violet-400/20",
    proposal_sent: "bg-fuchsia-400/10 text-fuchsia-400 border-fuchsia-400/20",
    won: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    lost: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  };

  return (
    <div onClick={onClick} className="cursor-pointer rounded-2xl border border-white/5 bg-slate-900/80 p-4 transition-colors hover:bg-white/[0.04] shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-white line-clamp-1">{lead.customerName}</h3>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${statusColors[lead.status] || statusColors.new}`}>
          {lead.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400 line-clamp-1">{lead.interestedService}</p>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-xs font-bold text-emerald-400">FCFA {Number(lead.estimatedValue || 0).toLocaleString("fr-CM")}</span>
        {lead.nextFollowUpAt && <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-300"><Icon name="schedule" className="text-[12px]" /> {new Date(lead.nextFollowUpAt).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}

export function CustomerCard({ customer, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer rounded-2xl border border-white/10 bg-[#111827] p-5 transition-colors hover:border-violet-500/50 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-emerald-400 text-lg font-black text-white">
          {customer.fullName.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-white">{customer.fullName}</h3>
          <p className="truncate text-xs text-slate-400">{customer.email || customer.phone}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4 text-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bookings</p>
          <p className="mt-1 text-sm font-bold text-white">{customer.totalBookings || 0}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Spent</p>
          <p className="mt-1 text-sm font-bold text-emerald-400">FCFA {Number(customer.totalSpent || 0).toLocaleString("fr-CM")}</p>
        </div>
      </div>
    </div>
  );
}

export function FollowUpCard({ followup, onComplete }) {
  return (
    <div className={`flex items-start gap-4 rounded-2xl border border-white/10 p-4 transition-all ${followup.status === 'completed' ? 'opacity-60 bg-black/20' : 'bg-[#111827] hover:bg-white/[0.03]'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); onComplete(followup); }} 
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${followup.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500 hover:border-emerald-400'}`}
      >
        {followup.status === 'completed' && <Icon name="check" className="text-[12px]" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-bold ${followup.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>{followup.title}</p>
        <p className="mt-1 text-xs text-slate-400">Due: {new Date(followup.dueDate).toLocaleDateString()}</p>
        {followup.note && <p className="mt-2 text-xs italic text-slate-500">"{followup.note}"</p>}
      </div>
      <div className="shrink-0 text-slate-500">
        <Icon name={followup.channel === 'whatsapp' ? 'chat' : followup.channel === 'phone' ? 'call' : 'mail'} className="text-[18px]" />
      </div>
    </div>
  );
}

export function InvoiceCard({ invoice, onClick }) {
  const statusColors = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    overdue: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div onClick={onClick} className="cursor-pointer flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:bg-white/[0.04]">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-violet-400">
          <Icon name="receipt_long" />
        </div>
        <div>
          <p className="font-bold text-white">{invoice.invoiceNumber}</p>
          <p className="text-xs text-slate-400">{invoice.customerName} â€¢ {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">FCFA {Number(invoice.total || 0).toLocaleString("fr-CM")}</p>
        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${statusColors[invoice.status] || statusColors.draft}`}>
          {invoice.status}
        </span>
      </div>
    </div>
  );
}

export function CustomerNotesPanel({ entityId, ownerId }) {
  const [notes, setNotes] = useState(() => getNotes(entityId));
  const [newNote, setNewNote] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    saveNote({ entityId, ownerId, text: newNote, type: "general" });
    setNotes(getNotes(entityId));
    setNewNote("");
  };

  return (
    <div className="flex h-[400px] flex-col rounded-3xl border border-white/10 bg-[#111827] shadow-xl">
      <div className="border-b border-white/5 p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Private Notes</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {notes.length === 0 && <p className="text-center text-xs text-slate-500 italic">No notes added yet.</p>}
        {notes.map(note => (
          <div key={note.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${note.type === 'booking' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {note.type}
              </span>
              <span className="text-[10px] text-slate-500">{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="border-t border-white/5 p-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newNote} 
            onChange={e => setNewNote(e.target.value)} 
            placeholder="Type a private note..." 
            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-violet-500" 
          />
          <button type="submit" disabled={!newNote.trim()} className="rounded-xl bg-violet-600 px-4 py-2 text-white hover:bg-violet-500 disabled:opacity-50">
            <Icon name="send" className="text-sm" />
          </button>
        </div>
      </form>
    </div>
  );
}

export function CRMRevenueChart({ invoices = [] }) {
  // Simple mock chart representation
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data = months.map(m => Math.floor(Math.random() * 500000) + 100000);
  const max = Math.max(...data);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Revenue Trend</h3>
        <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">6 Months</span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-2 border-b border-white/10 pb-2">
        {data.map((val, i) => (
          <div key={i} className="group relative flex w-full flex-col justify-end">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 z-10 whitespace-nowrap">
              FCFA {val.toLocaleString("fr-CM")}
            </div>
            <div 
              className="w-full rounded-t-md bg-gradient-to-t from-violet-600/50 to-violet-400 hover:from-violet-500 hover:to-violet-300 transition-all" 
              style={{ height: `${(val / max) * 100}%`, minHeight: '10%' }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {months.map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}