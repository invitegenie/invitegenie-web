import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";
import { USER_ROLES } from "../services/roles";
import { useAuth } from "../auth/AuthContext";

export default function PlatformSettings() {
  const { role } = useAuth();
  const [isSaving, setIsCreating] = useState(false);
  const [settings, setSettings] = useState({
    marketplaceFee: 10,
    maintenanceMode: false,
    guestInvitesLimit: 500,
    allowFreelancerSignups: true,
    emergencyFreeze: false,
  });

  // Access Control
  const isAdmin = [USER_ROLES.SUPER_ADMIN, USER_ROLES.APP_ADMIN].includes(role);

  useEffect(() => {
    const savedSettings = localStorage.getItem(KEYS.PLATFORM_SETTINGS);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setIsCreating(true);
    // Simulate network latency for a high-end feel
    setTimeout(() => {
      Engine.createAuditLog(
        "UPDATE_PLATFORM_SETTINGS",
        `Marketplace Fee: ${settings.marketplaceFee}%, Maintenance: ${settings.maintenanceMode}`
      );
      Engine.save(KEYS.PLATFORM_SETTINGS, settings);
      setIsCreating(false);
      alert("Platform magic updated successfully.");
    }, 800);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 shadow-2xl">
            <Icon name="lock" className="text-4xl text-rose-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Forbidden Access</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">Administrative clearance required.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-8 pb-32 font-sans animate-in fade-in duration-500">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F9FAFB]">Platform Engine</h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">Global Configuration & System Sovereignty</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-purple-900/40 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            <Icon name={isSaving ? "sync" : "save"} className={isSaving ? "animate-spin" : ""} />
            {isSaving ? "Syncing..." : "Commit Changes"}
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Financials Section */}
          <section className="rounded-[2.5rem] border border-[#2A3342] bg-[#111827] p-8 shadow-2xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#2A3342] pb-4">
              <Icon name="payments" className="text-[#8B5CF6]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Revenue Policy</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black uppercase text-[#6B7280]">Marketplace Fee</label>
                  <span className="text-xs font-bold text-[#8B5CF6]">{settings.marketplaceFee}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.marketplaceFee}
                  onChange={(e) => setSettings({ ...settings, marketplaceFee: parseInt(e.target.value) })}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#0B0F19] accent-[#8B5CF6]"
                />
                <p className="text-[9px] font-bold italic text-slate-600">Applied to all ticket sales and freelancer bookings.</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#2A3342] bg-[#0B0F19] p-4">
                <span className="text-[10px] font-black uppercase text-slate-300">Invite Limit</span>
                <input
                  type="number"
                  value={settings.guestInvitesLimit}
                  onChange={(e) => setSettings({ ...settings, guestInvitesLimit: parseInt(e.target.value) })}
                  className="w-20 bg-transparent text-right text-xs font-black text-[#22C55E] outline-none"
                />
              </div>
            </div>
          </section>

          {/* System Status Section */}
          <section className="rounded-[2.5rem] border border-[#2A3342] bg-[#111827] p-8 shadow-2xl">
            <div className="mb-6 flex items-center gap-3 border-b border-[#2A3342] pb-4">
              <Icon name="settings_input_component" className="text-[#22C55E]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">System Sovereignty</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0F19] border border-[#2A3342]">
                <div>
                  <p className="text-[10px] font-black uppercase text-white">Maintenance Mode</p>
                  <p className="text-[9px] font-bold text-slate-600">Restrict user access for system updates.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`relative h-6 w-12 rounded-full transition-colors ${settings.maintenanceMode ? "bg-[#8B5CF6]" : "bg-[#1F2937]"}`}
                >
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? "left-7" : "left-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0F19] border border-[#2A3342]">
                <span className="text-[10px] font-black uppercase text-white">Freelancer Registration</span>
                <button
                  onClick={() => setSettings({ ...settings, allowFreelancerSignups: !settings.allowFreelancerSignups })}
                  className={`relative h-6 w-12 rounded-full transition-colors ${settings.allowFreelancerSignups ? "bg-[#22C55E]" : "bg-[#1F2937]"}`}
                >
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settings.allowFreelancerSignups ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Security Protocols */}
          <section className="md:col-span-2 rounded-[2.5rem] border border-[#2A3342] bg-[#111827] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 opacity-5">
              <Icon name="gavel" className="text-8xl text-white" />
            </div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-rose-500">Security Override Protocols</h3>
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs font-bold text-slate-400 max-w-lg italic">
                In the event of a portal breach or financial anomaly, administrators can freeze all marketplace transactions globally. This action is logged and audited.
              </p>
              <button className="w-full md:w-auto px-10 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/20">
                Initialize Emergency Freeze
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
