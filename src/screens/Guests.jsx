import { useState } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";
import FormCard from "../components/FormCard";
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";

const initialGuests = [
  {
    id: 1,
    title: "Ms.",
    name: "Aaliyah Rivera",
    email: "aaliyah.rivera@example.com",
    phone: "+1 (415) 555-0124",
  },
  {
    id: 2,
    title: "Mr.",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    phone: "+1 (415) 555-0198",
  },
  {
    id: 3,
    title: "Dr.",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+1 (415) 555-0142",
  },
];

export default function Guests() {
  const [guests, setGuests] = useState(initialGuests);
  const [form, setForm] = useState({ title: "", name: "", email: "", phone: "" });

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAddGuest = () => {
    if (!form.name || !form.email) return;

    const nextGuest = {
      id: guests.length + 1,
      title: form.title || "Guest",
      name: form.name,
      email: form.email,
      phone: form.phone || "—",
    };

    setGuests((current) => [nextGuest, ...current]);
    setForm({ title: "", name: "", email: "", phone: "" });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 pb-28">
        <PageTitle title="Guests" subtitle="Add guests, manage lists, and send invitations." />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <FormCard title="Add Guest">
            <div className="space-y-5">
              <TextInput
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Title e.g. Mr., Mrs., Dr."
              />
              <TextInput
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Full name"
              />
              <TextInput
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Email address"
              />
              <TextInput
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="Phone number"
              />
              <div className="flex justify-end">
                <PrimaryButton type="button" onClick={handleAddGuest}>
                  Add Guest
                </PrimaryButton>
              </div>
            </div>
          </FormCard>

          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Guest list</p>
                <h3 className="text-2xl font-bold text-white">Invited Guests</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                {guests.length} total
              </span>
            </div>

            <div className="space-y-4">
              {guests.map((guest) => (
                <div key={guest.id} className="rounded-3xl bg-slate-950/60 p-4 border border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{guest.title}</p>
                      <p className="text-lg font-bold text-white">{guest.name}</p>
                    </div>
                    <span className="text-xs font-bold uppercase text-slate-400">{guest.phone}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{guest.email}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
