import { useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";

const STORAGE_KEY = "invitegenie_notification_settings";
const DEFAULT_SETTINGS = {
  eventReminders: true,
  rsvpUpdates: true,
  paymentAlerts: true,
  providerUpdates: false,
  productNews: false,
  channelEmail: true,
  channelSms: false,
  channelPush: true,
};

export default function NotificationSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return DEFAULT_SETTINGS;
    }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-4xl space-y-6 pb-28">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8B5CF6]">
            Notification Controls
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Notification Settings</h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">Choose what deserves your attention and where it should arrive.</p>
        </header>

        <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5 shadow-lg">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white">Activity Types</h2>
          <SettingRow icon="event" label="Event reminders" text="Countdowns, schedule changes, and day-of notices." checked={settings.eventReminders} onClick={() => toggle("eventReminders")} />
          <SettingRow icon="how_to_reg" label="Guest RSVP updates" text="Acceptances, declines, and guest list changes." checked={settings.rsvpUpdates} onClick={() => toggle("rsvpUpdates")} />
          <SettingRow icon="payments" label="Payment notifications" text="Ticket payments, invoices, refunds, and payouts." checked={settings.paymentAlerts} onClick={() => toggle("paymentAlerts")} />
          <SettingRow icon="storefront" label="Provider updates" text="Vendor quotes, booking status, and marketplace requests." checked={settings.providerUpdates} onClick={() => toggle("providerUpdates")} />
          <SettingRow icon="campaign" label="Product news" text="New features, platform announcements, and tips." checked={settings.productNews} onClick={() => toggle("productNews")} last />
        </section>

        <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5 shadow-lg">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white">Delivery Channels</h2>
          <SettingRow icon="mail" label="Email" text="Send account and event updates to your inbox." checked={settings.channelEmail} onClick={() => toggle("channelEmail")} />
          <SettingRow icon="sms" label="SMS" text="Use phone alerts for time-sensitive updates." checked={settings.channelSms} onClick={() => toggle("channelSms")} />
          <SettingRow icon="notifications" label="In-app push" text="Show alerts inside InviteGenie while you work." checked={settings.channelPush} onClick={() => toggle("channelPush")} last />
        </section>

        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-purple-900/30 transition hover:opacity-90"
        >
          <Icon name={saved ? "check_circle" : "save"} className="text-[18px]" />
          {saved ? "Saved" : "Save Settings"}
        </button>
      </div>
    </Layout>
  );
}

function SettingRow({ icon, label, text, checked, onClick, last }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 py-4 text-left ${last ? "" : "border-b border-[#2A3342]"}`}
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F2937] text-[#A78BFA]">
          <Icon name={icon} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-white">{label}</span>
          <span className="mt-1 block text-xs leading-relaxed text-[#9CA3AF]">{text}</span>
        </span>
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-[#8B5CF6]" : "bg-[#374151]"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}
