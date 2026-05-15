import React, { useState } from "react";
import Icon from "../components/Icon";
import { STORAGE_RENDER_KEY } from "./venueObjectCatalog";

export default function MobileGenieRender({ eventId }) {
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    const payload = { id: `mobile_render_${Date.now()}`, eventId, brief, createdAt: new Date().toISOString(), status: "queued" };
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_RENDER_KEY) || "[]");
      localStorage.setItem(STORAGE_RENDER_KEY, JSON.stringify([payload, ...existing]));
    } catch (e) {
      localStorage.setItem(STORAGE_RENDER_KEY, JSON.stringify([payload]));
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050812] p-5 text-white">
      <div className="mx-auto max-w-md pt-10">
        <div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600"><Icon name="auto_awesome" /></div><div><h1 className="text-xl font-black">Genie Venue Render</h1><p className="text-sm text-slate-400">The full venue studio is available on PC.</p></div></div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl"><p className="mb-3 text-sm font-bold text-slate-300">Describe the venue layout you want Genie to render.</p><textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={7} placeholder="Example: 150 guest wedding, round tables, VIP head table, DJ booth, dance floor, buffet, entrance arch..." className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-violet-400" /><button onClick={submit} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-sm font-black uppercase tracking-widest">Render With Genie</button>{submitted && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-200">Request saved. Open InviteGenie on PC to edit the generated venue layout.</p>}</div>
      </div>
    </div>
  );
}
