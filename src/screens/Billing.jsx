import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";

const PLANS = {
  BASIC: { name: "Basic", price: 0, events: 3, scans: 250 },
  PRO: { name: "Pro", price: 25000, events: 50, scans: 10000 },
  BUSINESS: { name: "Business", price: 75000, events: 250, scans: 50000 },
};

export default function Billing() {
  const navigate = useNavigate();
  const { currentUser, setUser } = useAuth();
  const events = useEngineCollection(KEYS.EVENTS);
  const tickets = useEngineCollection(KEYS.TICKETS);
  const payments = useEngineCollection(KEYS.PAYMENTS);

  const currentTier = String(currentUser?.tier || "BASIC").toUpperCase();
  const plan = PLANS[currentTier] || PLANS.BASIC;

  const usage = useMemo(() => {
    const eventRows = events || [];
    const ticketRows = tickets || [];
    const paymentRows = payments || [];
    const myEvents = eventRows.filter((event) => String(event.hostId || event.userId || "") === String(currentUser?.id || ""));
    const myEventIds = new Set(myEvents.map((event) => String(event.id)));
    const myTickets = ticketRows.filter((ticket) => myEventIds.has(String(ticket.eventId)) || String(ticket.userId || "") === String(currentUser?.id || ""));
    const monthlyRevenue = paymentRows.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return {
      events: myEvents.length || eventRows.length,
      scans: myTickets.length,
      revenue: monthlyRevenue,
    };
  }, [events, tickets, payments, currentUser]);

  const changePlan = (tier) => {
    setUser({ ...currentUser, tier, accountType: tier.toLowerCase(), plan: `${PLANS[tier].name} Account` });
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-28">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8B5CF6]">
              Subscription Center
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Billing</h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">Manage plan limits, subscription status, and billing usage.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/payment-methods")}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#2A3342] bg-[#111827] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:border-[#8B5CF6]/50"
          >
            <Icon name="credit_card" className="text-[18px]" />
            Payment Methods
          </button>
        </header>

        <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-6 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
                Active
              </span>
              <h2 className="mt-4 text-2xl font-black text-white">{plan.name} Account</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">
                {plan.price ? `${formatFCFA(plan.price)} per month` : "Free plan"} with {plan.events} event slots and {plan.scans.toLocaleString()} scans.
              </p>
            </div>
            <div className="grid min-w-[260px] grid-cols-2 gap-3 text-center">
              <Usage label="Events" used={usage.events} limit={plan.events} />
              <Usage label="Scans" used={usage.scans} limit={plan.scans} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Monthly Charge" value={formatFCFA(plan.price)} icon="receipt_long" />
          <Metric label="Tracked Revenue" value={formatFCFA(usage.revenue)} icon="monitoring" />
          <Metric label="Renewal" value="May 30" icon="event_repeat" />
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {Object.entries(PLANS).map(([tier, item]) => {
            const active = tier === currentTier;
            return (
              <article key={tier} className={`rounded-2xl border bg-[#111827] p-5 shadow-lg ${active ? "border-[#8B5CF6] ring-1 ring-[#8B5CF6]/40" : "border-[#2A3342]"}`}>
                <h2 className="text-lg font-black text-white">{item.name}</h2>
                <p className="mt-2 text-2xl font-black text-[#A78BFA]">{formatFCFA(item.price)}</p>
                <p className="mt-1 text-xs text-[#9CA3AF]">per month</p>
                <div className="mt-5 space-y-3 text-sm text-[#D1D5DB]">
                  <PlanLine text={`${item.events} active event slots`} />
                  <PlanLine text={`${item.scans.toLocaleString()} ticket scans`} />
                  <PlanLine text="Dashboard analytics and reports" />
                </div>
                <button
                  type="button"
                  onClick={() => changePlan(tier)}
                  disabled={active}
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition ${active ? "bg-[#1F2937] text-[#6B7280]" : "bg-white text-black hover:bg-[#F3F4F6]"}`}
                >
                  {active ? "Current Plan" : "Switch Plan"}
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
      <Icon name={icon} className="mb-4 text-[#A78BFA]" />
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6B7280]">{label}</p>
      <p className="mt-1 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Usage({ label, used, limit }) {
  const percent = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  return (
    <div className="rounded-xl border border-[#2A3342] bg-[#0B0F19] p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{used}/{limit}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function PlanLine({ text }) {
  return (
    <p className="flex items-center gap-2">
      <Icon name="check_circle" className="text-[18px] text-[#22C55E]" />
      {text}
    </p>
  );
}

function formatFCFA(amount) {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  })
    .format(Number(amount || 0))
    .replace("FCFA", "FCFA ");
}
