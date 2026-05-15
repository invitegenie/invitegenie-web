import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { getEventById } from "../services/mockData";
import { getSponsorsForEvent, updateSponsorStatus } from "../services/eventSponsorService";
import { sendDesktopNotification } from "../services/browserNotificationService";

export default function EventSponsorManagement() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = getEventById(eventId);
  const [sponsors, setSponsors] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (eventId) {
      setSponsors(getSponsorsForEvent(eventId));
    }
  }, [eventId]);

  if (!event) return <Layout><div className="p-10 text-center text-white">Event not found</div></Layout>;

  const filtered = sponsors.filter(s => s.status === activeTab);

  const handleStatusChange = (id, newStatus) => {
    const sponsor = sponsors.find(s => s.id === id);
    updateSponsorStatus(id, newStatus);
    setSponsors(getSponsorsForEvent(eventId));
    
    if (newStatus === "approved" && sponsor) {
      sendDesktopNotification("Sponsorship Approved 🎉", {
        body: `${sponsor.sponsorName} is now an official sponsor for ${event.title}!`,
      });
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate(`/events/${eventId}/operations`)} className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
              <Icon name="arrow_back" className="text-lg" /> Back to Operations
            </button>
            <h1 className="text-3xl font-black text-white">Manage Sponsors</h1>
            <p className="mt-1 text-sm text-slate-400">{event.title}</p>
          </div>
        </header>

        <div className="flex gap-2 border-b border-white/10 pb-4">
          {["pending", "approved", "rejected"].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${activeTab === tab ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}
            >
              {tab} ({sponsors.filter(s => s.status === tab).length})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-white/5 text-slate-500 text-sm">
              No {activeTab} sponsors found.
            </div>
          ) : (
            filtered.map(sponsor => (
              <div key={sponsor.id} className="flex flex-col sm:flex-row justify-between gap-4 p-5 bg-[#111827] border border-white/10 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  {sponsor.sponsorLogo ? <img src={sponsor.sponsorLogo} alt="" className="w-16 h-16 rounded-xl object-contain bg-white/5 p-1" /> : <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-slate-600"><Icon name="store" /></div>}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white truncate">{sponsor.sponsorName}</h3>
                      {activeTab === "approved" && sponsor.visibility && (
                         <div className="flex gap-1 ml-2">
                           {sponsor.visibility.tickets && <Icon name="confirmation_number" className="text-[14px] text-violet-400" title="Visible on Tickets" />}
                           {sponsor.visibility.websites && <Icon name="language" className="text-[14px] text-emerald-400" title="Visible on Website" />}
                           {sponsor.visibility.flyers && <Icon name="image" className="text-[14px] text-amber-400" title="Visible on Flyers" />}
                         </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">{sponsor.packageName}</p>
                      <p className="text-xs font-bold text-slate-400">FCFA {Number(sponsor.amount).toLocaleString()}</p>
                    </div>
                    {sponsor.message && <p className="text-sm text-slate-300 mt-3 bg-black/30 border border-white/5 p-3 rounded-xl italic line-clamp-2">"{sponsor.message}"</p>}
                    {sponsor.marketplaceLink && (
                      <a href={sponsor.marketplaceLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 mt-2 inline-flex items-center gap-1"><Icon name="open_in_new" className="text-[14px]" /> View Profile</a>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                  {activeTab !== "approved" && <button onClick={() => handleStatusChange(sponsor.id, "approved")} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/30">Approve</button>}
                  {activeTab !== "rejected" && <button onClick={() => handleStatusChange(sponsor.id, "rejected")} className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/30">Reject</button>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}