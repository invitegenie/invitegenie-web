import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getPricingPlans, selectPlanForUser } from "../services/pricingService";

export default function Pricing() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, setUser } = useAuth();
  const [toast, setToast] = useState("");
  const plans = getPricingPlans();

  const selectPlan = (plan) => {
    if (plan.id === "enterprise") {
      navigate("/support");
      return;
    }
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    const result = selectPlanForUser(currentUser, plan.id);
    if (result?.profile) setUser(result.profile);
    setToast(`${plan.name} selected locally.`);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1300px] space-y-7 pb-24">
        {toast ? <div className="fixed right-6 top-6 z-[200] rounded-2xl border border-emerald-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div> : null}
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-md">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Pricing</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">InviteGenie Plans</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Choose a role-aware demo plan. Selections update localStorage now and can map to Supabase billing later.</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-lg">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">{plan.roleTarget}</p>
                <h2 className="mt-3 text-2xl font-black text-white">{plan.name}</h2>
                <div className="mt-5">
                  {plan.price === null ? (
                    <p className="text-3xl font-black text-white">Custom</p>
                  ) : (
                    <p className="text-3xl font-black text-white">FCFA {Number(plan.price).toLocaleString()}<span className="text-sm text-slate-500">/{plan.interval}</span></p>
                  )}
                </div>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-base text-emerald-300">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => selectPlan(plan)} className="mt-6 rounded-2xl bg-violet-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">
                {plan.id === "enterprise" ? "Contact Sales" : "Select Plan"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
}
