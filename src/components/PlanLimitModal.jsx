import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const UNLOCKS = {
  maxEvents: ["More active events", "Higher guest limits", "Advanced event analytics", "Premium invitation tools"],
  maxGuestsPerEvent: ["Larger guest lists", "Advanced RSVP analytics", "QR guest passes at scale", "Team check-in tools"],
  maxServices: ["More storefront products", "AI service generation", "Featured listings", "Advanced vendor analytics"],
};

export default function PlanLimitModal({ open, limit, onClose = () => {} }) {
  const navigate = useNavigate();
  if (!open || !limit) return null;

  const features = UNLOCKS[limit.reason] || ["Higher platform limits", "Premium analytics", "Priority marketplace visibility"];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <section className="w-full max-w-lg overflow-hidden rounded-3xl border border-amber-300/25 bg-[#0B0B10] shadow-2xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-amber-300/15 via-violet-500/10 to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Plan Limit Reached</p>
              <h2 className="mt-2 text-2xl font-black text-white">Upgrade to continue</h2>
            </div>
            <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 hover:bg-white/10">
              <Icon name="close" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{limit.message}</p>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Current usage</p>
            <p className="mt-2 text-lg font-black text-white">
              {Number(limit.current || 0).toLocaleString()} / {Number(limit.limit || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-300">
              {limit.recommendedPlan || "PRO"} unlocks
            </p>
            <div className="mt-3 grid gap-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-200">
                  <Icon name="workspace_premium" className="text-amber-300" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">
              Keep Editing
            </button>
            <button onClick={() => navigate("/pricing")} className="rounded-2xl bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-amber-200">
              View Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
