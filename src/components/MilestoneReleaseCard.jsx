import React, { useState } from "react";
import Icon from "./Icon";
import ProofUploadBox from "./ProofUploadBox";
import { submitMilestoneProof } from "../services/escrowService";

export default function MilestoneReleaseCard({ escrow, onUpdate }) {
  const [uploadingFor, setUploadingFor] = useState(null);

  const handleUpload = (milestoneId, imgUrl) => {
    submitMilestoneProof(escrow.id, milestoneId, imgUrl, "Vendor submitted proof of setup");
    setUploadingFor(null);
    if (onUpdate) onUpdate();
  };

  if (!escrow) return null;

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest text-amber-400">Escrow Milestones</h3>
        <span className="text-xs font-black text-emerald-400">FCFA {escrow.amount.toLocaleString()}</span>
      </div>
      
      <div className="space-y-4">
        {escrow.milestones?.map(m => (
          <div key={m.id} className="border border-white/5 bg-slate-900/50 rounded-xl p-4 relative overflow-hidden group">
            {m.status === "released" && <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />}
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-bold ${m.status === "released" ? "text-slate-300 line-through" : "text-white"}`}>{m.title}</span>
              <span className="text-xs font-bold text-emerald-300">FCFA {m.releaseAmount.toLocaleString()} ({m.releasePercentage}%)</span>
            </div>
            
            {m.status === "pending" && !uploadingFor && (
              <button onClick={() => setUploadingFor(m.id)} className="text-[10px] font-black uppercase tracking-widest text-violet-400 hover:text-white mt-2">Submit Proof to Release</button>
            )}
            
            {uploadingFor === m.id && (
              <div className="mt-3"><ProofUploadBox onUpload={(url) => handleUpload(m.id, url)} label="Upload Event Proof Photo" /></div>
            )}
            
            {m.status === "proof_submitted" && (
              <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded border border-amber-500/20">Awaiting Planner Approval</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}