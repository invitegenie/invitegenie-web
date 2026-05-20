﻿import { useState } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";
import FeatureBadge from "../components/FeatureBadge";
import { useAuth } from "../auth/AuthContext";
import { DEMO_ACCOUNTS } from "../services/roles";
import {
  getAccountType,
  getEffectiveCapabilities,
  getPlanLimits,
  normalizeCapabilities,
  saveTaskerProfile,
  updateUserCapabilities,
} from "../services/accountCapabilities";

const PLAN_DEMO_ACCOUNT_IDS = ["normal-marie", "pro-estelle", "vendor-brice", "enterprise-mtn"];

function CapabilityToggle({ title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`rounded-2xl border p-4 text-left transition ${
        checked ? "border-amber-300/35 bg-amber-300/10" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.055]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <span className={`mt-1 h-6 w-11 rounded-full p-1 transition ${checked ? "bg-emerald-400" : "bg-slate-700"}`}>
          <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
        </span>
      </div>
    </button>
  );
}

export default function Settings() {
  const { currentUser, setUser } = useAuth();
  const [capabilityDraft, setCapabilityDraft] = useState(() => normalizeCapabilities(currentUser || {}));
  const planDemoAccounts = DEMO_ACCOUNTS.filter((user) => PLAN_DEMO_ACCOUNT_IDS.includes(user.id));
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    theme: "dark",
    autoSave: true,
    language: "en",
    // This is a settings screen, global search doesn't apply directly here.
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("invitegenie_settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleCapabilityToggle = (key) => {
    const nextCapabilities = updateUserCapabilities(currentUser, {
      ...capabilityDraft,
      [key]: !capabilityDraft[key],
    });
    if (!nextCapabilities) return;

    setCapabilityDraft(nextCapabilities);
    const nextUser = setUser({ ...currentUser, capabilities: nextCapabilities });
    if (key === "taskerMode" && nextCapabilities.taskerMode) {
      saveTaskerProfile({
        userId: currentUser.id,
        active: true,
        skills: ["event staff", "usher", "check-in staff"],
        availability: "Flexible",
        verificationStatus: getAccountType(nextUser || currentUser) === "FREE" ? "basic" : "verified",
        preferredLocations: [currentUser.city || "Douala"].filter(Boolean),
      });
    }
  };

  const handleDemoUserChange = (userId) => {
    const nextUser = DEMO_ACCOUNTS.find((user) => user.id === userId);
    if (!nextUser) return;
    setUser({
      ...nextUser,
      plan: nextUser.accountType || "FREE",
    });
    setCapabilityDraft(normalizeCapabilities(nextUser));
  };

  const accountType = getAccountType(currentUser);
  const effectiveCapabilities = getEffectiveCapabilities({ ...currentUser, capabilities: capabilityDraft });
  const limits = getPlanLimits(accountType);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Settings"
          subtitle="Customize your InviteGenie experience."
        />

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-2">Preview Account Plans</h3>
          <p className="mb-5 text-sm text-slate-400">
            Preview the different subscription tiers. Vendor, planner, tasker, and check-in access are controlled by the capability toggles below.
          </p>
          <select
            value={currentUser?.id || ""}
            onChange={(event) => handleDemoUserChange(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50"
          >
            {planDemoAccounts.map((user) => (
              <option key={user.id} value={user.id}>
                {getAccountType(user)} - {user.full_name}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-3xl border border-amber-300/15 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Unified Account</p>
              <h3 className="mt-2 text-2xl font-black text-white">{accountType} Plan</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Activate marketplace, staffing, planning, and check-in capabilities without changing account type.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FeatureBadge label={`${limits.unlimitedEverything ? "Unlimited" : limits.maxEvents} events`} tone="amber" />
              <FeatureBadge label={`${limits.unlimitedEverything ? "Unlimited" : limits.maxGuestsPerEvent.toLocaleString()} guests/event`} tone="emerald" />
              <FeatureBadge label={`${limits.unlimitedServices ? "Unlimited" : limits.maxServices} services`} tone="violet" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <CapabilityToggle
              title="Vendor Mode"
              description="Sell services, publish a storefront, receive bookings, and join the marketplace."
              checked={Boolean(capabilityDraft.vendorMode)}
              onChange={() => handleCapabilityToggle("vendorMode")}
            />
            <CapabilityToggle
              title="Planner Mode"
              description="Create events, manage guests, publish RSVP pages, and use event tools."
              checked={Boolean(capabilityDraft.plannerMode)}
              onChange={() => handleCapabilityToggle("plannerMode")}
            />
            <CapabilityToggle
              title="Tasker Availability"
              description="Become visible for event staffing jobs like usher, waiter, helper, or assistant."
              checked={Boolean(capabilityDraft.taskerMode)}
              onChange={() => handleCapabilityToggle("taskerMode")}
            />
            <CapabilityToggle
              title="Check-In Capability"
              description="Scan QR codes, validate passes, and help manage guest arrivals."
              checked={Boolean(capabilityDraft.checkInMode)}
              onChange={() => handleCapabilityToggle("checkInMode")}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <FeatureBadge label={effectiveCapabilities.hasPriorityVisibility ? "Priority visibility" : "Basic visibility"} active={effectiveCapabilities.hasPriorityVisibility} />
            <FeatureBadge label={effectiveCapabilities.hasVerifiedBadge ? "Verified badge" : "Basic badge"} active={effectiveCapabilities.hasVerifiedBadge} tone="amber" />
            <FeatureBadge label={effectiveCapabilities.hasAnalytics ? "Analytics enabled" : "Basic analytics"} active={effectiveCapabilities.hasAnalytics} tone="emerald" />
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-slate-400 text-sm">Receive updates via email</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle("emailNotifications")}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.emailNotifications ? "bg-purple-500" : "bg-slate-600"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.emailNotifications ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-slate-400 text-sm">Get SMS alerts for events</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle("smsNotifications")}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.smsNotifications ? "bg-purple-500" : "bg-slate-600"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.smsNotifications ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="en">English</option>
                <option value="es">EspaÃ±ol</option>
                <option value="fr">FranÃ§ais</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-save Drafts</p>
                <p className="text-slate-400 text-sm">Automatically save event drafts</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={() => handleToggle("autoSave")}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoSave ? "bg-purple-500" : "bg-slate-600"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.autoSave ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            className="flex-1 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
          >
            Save Settings
          </button>
          <button className="flex-1 bg-slate-900/60 border border-white/10 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/5 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>
    </Layout>
  );
}
