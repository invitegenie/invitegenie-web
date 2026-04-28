import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Icon({ name, className = "" }) {
  const iconStyle = {
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };
  return (
    <span className={`material-symbols-outlined ${className}`} style={iconStyle}>
      {name}
    </span>
  );
}

export default function Notifications() {
  const navigate = useNavigate();

  const settings = [
    { label: "Event Reminders", enabled: true },
    { label: "Guest RSVP Updates", enabled: true },
    { label: "Payment Notifications", enabled: true },
    { label: "Vendor Updates", enabled: false },
    { label: "Marketing Emails", enabled: false },
  ];

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-8 sm:px-5 xl:px-6">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-white/5 p-2 hover:bg-white/10"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">Notification Settings</h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl">
          {settings.map((setting, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-b-0"
            >
              <span className="text-white font-medium">{setting.label}</span>
              <button
                className={`rounded-full w-12 h-7 flex items-center transition ${
                  setting.enabled ? "bg-purple-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition transform ${
                    setting.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-2 font-bold text-white"
        >
          Back to Profile
        </button>
      </div>
    </Layout>
  );
}
