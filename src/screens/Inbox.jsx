import { useState } from "react";
import Layout from "../components/Layout";

const categories = [
  { name: "Inbox", icon: "inbox", count: 12 },
  { name: "Starred", icon: "star", count: 2 },
  { name: "Sent", icon: "send", count: 0 },
  { name: "Drafts", icon: "drafts", count: 4 },
  { name: "Spam", icon: "report", count: 0 },
  { name: "Trash", icon: "delete", count: 0 },
];

const messageList = [
  { id: 1, subject: "Sound System Confirmation", sender: "Harmony Audio", time: "10:24 AM", snippet: "Hi Maya, we've finalized the equipment...", unread: true },
  { id: 2, subject: "Feedback on Champions League Event", sender: "Sports Corp", time: "Yesterday", snippet: "The event was a huge success, but we wanted...", unread: false },
  { id: 3, subject: "Request for Invoice Update", sender: "Global Venues", time: "Oct 24", snippet: "Could you please update the billing address...", unread: false },
  { id: 4, subject: "Query Regarding Ticket Availability", sender: "Marcus Lee", time: "Oct 22", snippet: "Are there any VIP tickets left for...", unread: true },
  { id: 5, subject: "Confirmation of Symphony Tickets", sender: "Arts Center", time: "Oct 20", snippet: "Your tickets have been confirmed for the...", unread: false },
  { id: 6, subject: "Final Menu Selection", sender: "Luxe Catering", time: "Oct 18", snippet: "Please choose from the three options provided...", unread: false },
];

export default function Inbox() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-12rem)] gap-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left: Categories */}
        <aside className="hidden w-64 flex-col gap-2 xl:flex">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center justify-between rounded-2xl px-5 py-3.5 transition-all ${
                cat.name === "Inbox"
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 font-medium text-white shadow-lg shadow-purple-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
              </div>
              {cat.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${cat.name === "Inbox" ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Middle: Message List */}
        <section className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
          <div className="border-b border-white/5 p-6">
            <h2 className="text-xl font-semibold font-heading text-white tracking-tight">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {messageList.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={`flex w-full flex-col gap-1 border-b border-white/5 p-6 text-left transition-colors ${
                  selectedId === msg.id ? "bg-white/5" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-widest ${msg.unread ? 'text-purple-600' : 'text-slate-400'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <p className={`truncate text-sm font-semibold ${msg.unread ? 'text-white' : 'text-slate-300'}`}>{msg.subject}</p>
                <p className="truncate text-xs text-slate-400">{msg.snippet}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Right: Detail Panel */}
        <section className="hidden flex-[1.5] flex-col overflow-hidden rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 lg:flex">
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Harmony Audio</p>
                <p className="text-[11px] text-slate-400">support@harmonyaudio.com</p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-400">
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors"><span className="material-symbols-outlined">star</span></button>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors"><span className="material-symbols-outlined">reply</span></button>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8">
              <span className="mb-2 inline-block rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-semibold uppercase text-purple-400">Event Vendor</span>
              <h1 className="text-3xl font-semibold font-heading text-white tracking-tight">Sound System Confirmation</h1>
            </div>
            
            <div className="space-y-6 text-sm leading-relaxed text-slate-300">
              <p>Hi Maya,</p>
              <p>
                Following our discussion earlier, we have finalized the equipment list for the <strong>Champions League Final</strong> event next month.
              </p>
              <div className="rounded-2xl bg-white/5 p-6 border border-white/5 space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-widest mb-3">Equipment Breakdown:</p>
                <div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> 12x Line Array Speakers</div>
                <div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> 4x Digital Mixers</div>
                <div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Professional Wireless Mic Kit</div>
              </div>
              <p>
                We've scheduled the setup for 6:00 AM on the event day to ensure everything is perfect. Please let us know if there are any changes to the venue access or power requirements.
              </p>
              <p>Best regards,<br /><span className="font-bold text-white">The Harmony Audio Team</span></p>
            </div>
            
            <div className="mt-12 flex gap-3">
               <button className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-200">
                 Reply Message
               </button>
               <button className="rounded-xl border border-white/10 px-6 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 transition">
                 Forward
               </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
