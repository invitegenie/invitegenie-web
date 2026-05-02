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

export default function Meetings() {
  const navigate = useNavigate();

  const meetings = [
    {
      title: "Seating Plan Approval Meeting",
      time: "10:00 AM â€“ 10:30 AM",
      contact: "Venue Coordinator â€“ Sophia Reynolds",
    },
    {
      title: "Initial Planning Call for Brann's Birthday Party",
      time: "10:45 AM â€“ 11:15 AM",
      contact: "Client â€“ Brann Callahan",
    },
    {
      title: "Vendor Final Walkthrough",
      time: "2:00 PM â€“ 3:00 PM",
      contact: "DJ & Catering â€“ Michael Torres",
    },
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
          <h1 className="text-3xl font-bold text-white">My Meetings</h1>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting, idx) => (
            <div
              key={`meeting-${idx}`}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl"
            >
              <h3 className="font-bold text-white">{meeting.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{meeting.time}</p>
              <p className="text-sm text-purple-300">{meeting.contact}</p>
              <button className="mt-4 rounded-lg bg-purple-600/30 px-4 py-2 text-sm font-medium text-purple-200 hover:bg-purple-600/50">
                Join Meeting
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
