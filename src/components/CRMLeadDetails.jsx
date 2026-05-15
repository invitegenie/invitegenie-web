import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getLead, saveLead, saveCustomer, saveNote } from "../services/vendorCRMService";
import { CustomerNotesPanel } from "../components/CRMComponents";

const STAGES = ["new", "contacted", "qualified", "proposal_sent", "won", "lost"];

export default function CRMLeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "demo-user";
  
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const data = getLead(leadId);
    if (data && String(data.ownerId) === String(userId)) {
      setLead(data);
      setForm(data);
    }
  }, [leadId, userId]);

  const handleSave = () => {
    const updated = saveLead(form);
    setLead(updated);
    setIsEditing(false);
  };

  const handleStageChange = (status) => {
    const updated = saveLead({ ...lead, status });
    setLead(updated);
    setForm(updated);
  };

  const handleConvertToCustomer = () => {
    if (!window.confirm("Convert this lead to a permanent customer?")) return;
    
    const customer = saveCustomer({
      ownerId: userId,
      fullName: lead.customerName,
      email: lead.email || "",
      phone: lead.phone || "",
      city: "",
      totalBookings: 0,
      totalSpent: 0,
      tags: ["Converted Lead"],
      notes: []
    });
    
    saveNote({
      entityId: customer.id,
      ownerId: userId,
      text: `Converted from lead interested in: ${lead.interestedService}`,
      type: "general"
    });
    
    saveLead({ ...lead, status: "won" });
    navigate(`/vendor-crm/customers/${customer.id}`);
  };

  if (!lead) return <Layout><div className="p-10 text-center text-white">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6 pb-28 pt-4 px-4 sm:px-6">
        <button onClick={() => navigate("/vendor-crm")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white">
          <Icon name="arrow_back" className="text-lg" /> Back to CRM
        </button>

        {/* Pipeline Stage Bar */}
        <div className="flex bg-[#111827] border border-white/10 rounded-2xl p-2 overflow-x-auto no-scrollbar">
          {STAGES.map((stage, idx) => {
            const isActive = lead.status === stage;
            const isPast = STAGES.indexOf(lead.status) > idx;
            return (
              <button 
                key={stage}
                onClick={() => handleStageChange(stage)}
                className={`flex-1 min-w-[120px] py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${
                  isActive ? "bg-violet-600 text-white shadow-md" : isPast ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:bg-white/5"
                }`}
              >
                {stage.replace("_", " ")}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Info */}
          <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white">Lead Details</h2>
              <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="text-xs font-bold text-violet-400 hover:text-white">
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
            
            <div className="space-y-4">
              <DetailRow label="Name" value={form.customerName} isEditing={isEditing} onChange={v => setForm({...form, customerName: v})} />
              <DetailRow label="Phone" value={form.phone || ""} isEditing={isEditing} onChange={v => setForm({...form, phone: v})} />
              <DetailRow label="Email" value={form.email || ""} isEditing={isEditing} onChange={v => setForm({...form, email: v})} />
              <DetailRow label="Interested In" value={form.interestedService} isEditing={isEditing} onChange={v => setForm({...form, interestedService: v})} />
              <DetailRow label="Est. Value (FCFA)" value={form.estimatedValue} isEditing={isEditing} type="number" onChange={v => setForm({...form, estimatedValue: Number(v)})} />
              <DetailRow label="Source" value={form.source} isEditing={false} />
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button onClick={handleConvertToCustomer} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg hover:opacity-90">
                Convert to Customer
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-6">
            <CustomerNotesPanel entityId={lead.id} ownerId={userId} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function DetailRow({ label, value, isEditing, onChange, type = "text" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-1/3">{label}</span>
      {isEditing && onChange ? (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-violet-500 outline-none" />
      ) : (
        <span className="flex-1 text-sm font-bold text-white text-right sm:text-left">{type === "number" ? Number(value || 0).toLocaleString("fr-CM") : (value || "—")}</span>
      )}
    </div>
  );
}