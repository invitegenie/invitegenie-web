import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FeatureBadge from "../components/FeatureBadge";
import { useAuth } from "../auth/AuthContext";
import { BILLING_CYCLES } from "../services/accountCapabilities";
import { getPlanPrice, getPricingPlans, selectPlanForUser } from "../services/pricingService";

const FAQS = [
  ["Can a Free user sell services?", "Yes. Free accounts can activate Vendor Mode and publish up to 15 services or products."],
  ["Do taskers need a separate account?", "No. Tasker Availability is a capability that any account can activate from Settings."],
  ["Is check-in a separate role?", "No. Check-In Capability is toggled on the same account and gated by plan limits."],
  ["Can I switch plans later?", "Yes. Demo mode updates localStorage today and can map to billing APIs later."],
];

export default function Pricing() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, setUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLES.MONTHLY);
  const [toast, setToast] = useState("");
  const plans = getPricingPlans();

  const selectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    const result = selectPlanForUser(currentUser, plan.id, billingCycle);
    if (result?.profile) setUser(result.profile);
    setToast(`${plan.name} selected locally.`);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1400px] space-y-10 pb-24">
        {toast ? (
          <div className="fixed right-6 top-6 z-[200] rounded-2xl border border-emerald-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl">
            {toast}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#09090d] p-6 shadow-2xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-amber-300">Unified SaaS Plans</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                One account. Four plans. Multiple capabilities.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                InviteGenie now uses Free, Pro, Business, and Enterprise as account type, subscription plan,
                and permission group. Vendor, planner, tasker, and check-in are activated as account capabilities.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] p-1">
              {[
                [BILLING_CYCLES.MONTHLY, "Monthly"],
                [BILLING_CYCLES.YEARLY, "Yearly"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setBillingCycle(value)}
                  className={`rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                    billingCycle === value ? "bg-amber-300 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex min-h-[560px] flex-col rounded-3xl border p-5 shadow-xl transition duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? "border-amber-300/40 bg-gradient-to-b from-amber-300/12 to-[#111827]"
                  : "border-white/10 bg-[#111827]"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950">
                  Most Popular
                </span>
              ) : null}

              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">{plan.accountType}</p>
              <h2 className="mt-3 text-2xl font-black text-white">{plan.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{plan.tagline}</p>
              <div className="mt-5">
                <p className="text-3xl font-black text-white">
                  {getPlanPrice(plan, billingCycle)}
                  <span className="text-sm text-slate-500">/{billingCycle === BILLING_CYCLES.YEARLY ? "year" : "month"}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <FeatureBadge label={plan.limits.unlimitedServices ? "Unlimited services" : `${plan.limits.maxServices} services`} tone="amber" />
                <FeatureBadge label={plan.limits.unlimitedEverything ? "Unlimited guests" : `${Number(plan.limits.maxGuestsPerEvent).toLocaleString()} guests`} tone="emerald" />
              </div>

              <PlanFeatureGroup title="Vendor" features={plan.vendorFeatures.slice(0, 4)} />
              <PlanFeatureGroup title="Events" features={plan.eventFeatures.slice(0, 5)} />
              <PlanFeatureGroup title="Staffing + Check-In" features={[...plan.taskerFeatures, ...plan.checkInFeatures].slice(0, 4)} />

              <button
                onClick={() => selectPlan(plan)}
                className={`mt-auto rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest transition ${
                  plan.featured ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-violet-600 text-white hover:bg-violet-500"
                }`}
              >
                {plan.accountType === "ENTERPRISE" ? "Activate Enterprise" : "Select Plan"}
              </button>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Comparison</p>
              <h2 className="mt-2 text-2xl font-black text-white">Feature limits by plan</h2>
            </div>
            <button onClick={() => navigate("/settings")} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">
              Manage Capabilities
            </button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Services</th>
                  <th className="p-3">Active events</th>
                  <th className="p-3">Guests/event</th>
                  <th className="p-3">Staff accounts</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-t border-white/10 text-slate-300">
                    <td className="p-3 font-black text-white">{plan.name}</td>
                    <td className="p-3">{plan.limits.unlimitedServices ? "Unlimited" : plan.limits.maxServices}</td>
                    <td className="p-3">{plan.limits.unlimitedEvents ? "Unlimited" : plan.limits.maxEvents}</td>
                    <td className="p-3">{plan.limits.unlimitedEverything ? "Unlimited" : Number(plan.limits.maxGuestsPerEvent).toLocaleString()}</td>
                    <td className="p-3">{plan.limits.staffAccounts === Infinity ? "Unlimited" : plan.limits.staffAccounts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {FAQS.map(([question, answer]) => (
            <div key={question} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-black text-white">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{answer}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-violet-500/10 to-emerald-400/10 p-6 text-center">
          <h2 className="text-3xl font-black text-white">Ready to unlock your event ecosystem?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Upgrade when you need more events, larger guest lists, more services, team check-in, or enterprise operations.
          </p>
          <button onClick={() => navigate("/settings")} className="mt-6 rounded-2xl bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-950">
            Configure My Account
          </button>
        </section>
      </div>
    </Layout>
  );
}

function PlanFeatureGroup({ title, features }) {
  return (
    <div className="mt-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-xs leading-5 text-slate-300">
            <span className="material-symbols-outlined text-sm text-emerald-300">check_circle</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
