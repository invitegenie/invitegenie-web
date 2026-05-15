﻿import { useState } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

const STORAGE_KEY = "invitegenie_integrations";

const availableIntegrations = [
  {
    id: 1,
    name: "Slack",
    description: "Get event notifications in Slack",
    icon: "ðŸ””",
    connected: false,
  },
  {
    id: 2,
    name: "Google Calendar",
    description: "Sync events with Google Calendar",
    icon: "ðŸ“…",
    connected: true,
  },
  {
    id: 3,
    name: "Mailchimp",
    description: "Email marketing integration",
    icon: "ðŸ“§",
    connected: false,
  },
  {
    id: 4,
    name: "Zapier",
    description: "Automate workflows",
    icon: "âš™ï¸",
    connected: false,
  },
  {
    id: 5,
    name: "Google Drive",
    description: "Back up event memories automatically",
    icon: "☁️",
    connected: false,
  },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : availableIntegrations;
    } catch {
      return availableIntegrations;
    }
  });

  const toggleIntegration = (id) => {
    setIntegrations((prev) => {
      const next = prev.map((int) => {
        if (int.id === id) {
          const nextState = !int.connected;
          if (nextState && int.name === "Google Drive") {
            alert("Google Drive connected! Your event memories will now be backed up automatically.");
          }
          return { ...int, connected: nextState };
        }
        return int;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Integrations"
          subtitle="Connect external apps and services."
        />

        <div className="grid gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="p-6 bg-slate-900/60 border border-white/10 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{integration.icon}</span>
                <div>
                  <p className="font-bold text-white text-lg">{integration.name}</p>
                  <p className="text-slate-400 text-sm">{integration.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleIntegration(integration.id)}
                className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                  integration.connected
                    ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    : "bg-slate-950/50 text-slate-300 hover:bg-white/5"
                }`}
              >
                {integration.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
