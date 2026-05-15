import Icon from "./Icon";

export default function EventPlanExport({ plan, onExport, onShare, onSave }) {
  if (!plan) return null;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-5 shadow-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Plan Actions</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <Action icon="picture_as_pdf" label="PDF Plan" onClick={() => onExport?.("pdf")} />
        <Action icon="ios_share" label="Share Link" onClick={onShare} />
        <Action icon="dashboard_customize" label="Save to Dashboard" onClick={onSave} />
        <Action icon="table_chart" label="Budget CSV" onClick={() => onExport?.("csv")} />
      </div>
    </div>
  );
}

function Action({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-white transition hover:border-violet-400/40 hover:bg-white/[0.07]">
      <Icon name={icon} className="text-violet-300" />
      {label}
    </button>
  );
}
