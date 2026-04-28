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

export default function Support() {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-white">Contact Support</h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Message</label>
              <textarea
                rows={6}
                placeholder="Tell us more about your issue..."
                className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3 font-bold text-white hover:opacity-90"
            >
              Send Message
            </button>
          </form>

          <button
            onClick={() => navigate("/profile")}
            className="mt-6 rounded-xl bg-white/5 px-6 py-2 font-bold text-white hover:bg-white/10"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </Layout>
  );
}
