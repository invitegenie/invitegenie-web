export default function EventCard({
  title,
  date,
  status,
  statusColor,
  progressLabel,
  progress,
  bar,
  image,
}) {
  return (
    <article className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
          <img className="w-full h-full object-cover" src={image} alt={title} />
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
          {status}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>

      <p className="text-gray-400 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
        {date}
      </p>

      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-400">
          <span>{progressLabel}</span>
          <span className="text-emerald-300">{progress}</span>
        </div>

        <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${bar}`} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Action icon="info" label="Details" />
        <Action icon="group" label="Guests" />
        <Action icon="query_stats" label="Insights" />
      </div>
    </article>
  );
}

function Action({ icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
      <span className="material-symbols-outlined text-purple-300 mb-1">{icon}</span>
      <span className="text-[11px] font-bold">{label}</span>
    </button>
  );
}
