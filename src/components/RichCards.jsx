import { useNavigate } from "react-router-dom";

export function TemplateCard({ id, title, image, category, onClick }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/[0.04] bg-[#141218] shadow-sm transition-all hover:border-violet-500/40 hover:-translate-y-1">
      <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute bottom-0 p-6">
        <span className="mb-2 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-300 backdrop-blur-md">
          {category}
        </span>
        <h3 className="text-xl font-semibold font-heading text-white">{title}</h3>
        <button onClick={onClick} className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-300 opacity-0 transition-all group-hover:opacity-100">
          Select Design <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export function VendorCard({ name, service, image, rating, price }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition hover:bg-white/[0.06]">
      <div className="relative mb-4 h-40 overflow-hidden rounded-2xl">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2 rounded-full bg-slate-950/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-md">
          ★ {rating}
        </div>
      </div>
      <h4 className="text-lg font-bold text-white">{name}</h4>
      <p className="text-sm text-slate-400">{service}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-tight">{price}</span>
        <button className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">
          View Profile
        </button>
      </div>
    </div>
  );
}

export function EventStatCard({ label, value, icon, color }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md transition hover:bg-white/[0.05]">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}

export function ImageCard({ title, subtitle, image, badge }) {
  return (
    <div className="relative h-64 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl group">
      <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      {badge && (
        <div className="absolute right-6 top-6 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-black uppercase text-slate-950">
          {badge}
        </div>
      )}
      <div className="absolute bottom-8 left-8 right-8">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}