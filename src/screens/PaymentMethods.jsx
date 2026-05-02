import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

const STORAGE_KEY = "invitegenie_payment_methods";
const DEFAULT_METHODS = [
  { id: "pm-mtn", type: "Mobile Money", provider: "MTN MoMo", account: "+237 6XX XXX 120", default: true, status: "Verified" },
  { id: "pm-orange", type: "Mobile Money", provider: "Orange Money", account: "+237 6XX XXX 804", default: false, status: "Verified" },
];

export default function PaymentMethods() {
  const [methods, setMethods] = useState(() => safeParse(localStorage.getItem(STORAGE_KEY), DEFAULT_METHODS));
  const [form, setForm] = useState({ provider: "MTN MoMo", account: "", type: "Mobile Money" });

  const defaultMethod = useMemo(() => methods.find((method) => method.default), [methods]);

  const persist = (nextMethods) => {
    setMethods(nextMethods);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMethods));
  };

  const addMethod = (event) => {
    event.preventDefault();
    if (!form.account.trim()) return;
    const nextMethod = {
      id: `pm-${Date.now()}`,
      ...form,
      account: form.account.trim(),
      default: methods.length === 0,
      status: "Pending",
    };
    persist([nextMethod, ...methods]);
    setForm({ provider: "MTN MoMo", account: "", type: "Mobile Money" });
  };

  const setDefault = (id) => {
    persist(methods.map((method) => ({ ...method, default: method.id === id })));
  };

  const removeMethod = (id) => {
    const next = methods.filter((method) => method.id !== id);
    if (next.length && !next.some((method) => method.default)) next[0] = { ...next[0], default: true };
    persist(next);
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-28">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8B5CF6]">Wallet Setup</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Payment Methods</h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">Manage payout and checkout rails for event ticket sales.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Connected Methods" value={methods.length} icon="credit_card" />
          <Metric label="Default Rail" value={defaultMethod?.provider || "None"} icon="stars" />
          <Metric label="Settlement" value="FCFA" icon="payments" />
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            {methods.map((method) => (
              <article key={method.id} className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1F2937] text-[#A78BFA]">
                      <Icon name={method.type === "Card" ? "credit_card" : "phone_iphone"} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-black text-white">{method.provider}</h2>
                      <p className="mt-1 truncate text-xs text-[#9CA3AF]">{method.account}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${method.status === "Verified" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                      {method.status}
                    </span>
                    {method.default ? (
                      <span className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Default</span>
                    ) : (
                      <button type="button" onClick={() => setDefault(method.id)} className="rounded-full border border-[#2A3342] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#F9FAFB] hover:border-[#8B5CF6]/50">
                        Make Default
                      </button>
                    )}
                    <button type="button" onClick={() => removeMethod(method.id)} className="rounded-full border border-[#2A3342] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-300 hover:border-rose-400/50">
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5 shadow-lg lg:col-span-5">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Add Method</h2>
            <form onSubmit={addMethod} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Type</span>
                <select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#2A3342] bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
                >
                  <option>Mobile Money</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Provider</span>
                <input
                  value={form.provider}
                  onChange={(event) => setForm({ ...form, provider: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#2A3342] bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Account</span>
                <input
                  value={form.account}
                  onChange={(event) => setForm({ ...form, account: event.target.value })}
                  placeholder="+237 6XX XXX XXX"
                  className="mt-2 w-full rounded-xl border border-[#2A3342] bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
                />
              </label>
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] px-4 py-3 text-xs font-black uppercase tracking-widest text-white">
                Add Payment Method
              </button>
            </form>
          </section>
        </div>
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

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
