import { useState } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    theme: "dark",
    autoSave: true,
    language: "en",
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Settings"
          subtitle="Customize your InviteGenie experience."
        />

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
                <option value="es">Español</option>
                <option value="fr">Français</option>
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
