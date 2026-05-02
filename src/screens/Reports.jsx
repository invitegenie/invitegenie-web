import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

const mockReports = [
  {
    id: 1,
    title: "Event Performance Report - Q4 2024",
    date: "2024-10-15",
    type: "Performance",
  },
  {
    id: 2,
    title: "Guest Engagement Metrics",
    date: "2024-10-10",
    type: "Engagement",
  },
  {
    id: 3,
    title: "RSVP Analysis Summary",
    date: "2024-10-05",
    type: "RSVP",
  },
];

export default function Reports() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Reports"
          subtitle="View analytics and detailed event reports."
        />

        <div className="space-y-4">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="p-6 bg-slate-900/60 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white text-lg mb-1">{report.title}</p>
                  <p className="text-slate-400 text-sm">{report.date}</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold">
                  {report.type}
                </span>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-lg transition-colors">
                View Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
