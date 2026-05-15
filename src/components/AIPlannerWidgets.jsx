import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

export function PlannerPromptInput({ value, onChange, onSubmit, isGenerating }) {
  return (
    <form onSubmit={onSubmit} className="relative mt-6 max-w-3xl">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Icon name="auto_awesome" className="text-violet-400 text-xl" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={isGenerating}
        placeholder="e.g., Traditional wedding under 2M FCFA in Douala..."
        className="w-full bg-[#1e293b] border border-violet-500/30 text-white rounded-full py-4 pl-12 pr-32 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition placeholder:text-slate-500 shadow-xl shadow-violet-900/20"
      />
      <button
        type="submit"
        disabled={!value.trim() || isGenerating}
        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-6 rounded-full hover:opacity-90 disabled:opacity-50 transition text-sm"
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}

export function AISuggestionChips({ onSelect }) {
  const chips = [
    "Traditional wedding under 2M FCFA",
    "Corporate gala for 500 guests in Douala",
    "Luxury birthday dinner for 80 guests",
    "Baby shower under 300K FCFA"
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-4 max-w-3xl">
      {chips.map(chip => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="bg-white/[0.03] border border-white/10 hover:border-violet-400/50 hover:bg-violet-400/10 text-slate-300 text-xs py-2 px-4 rounded-full transition"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

export function BudgetBreakdownCard({ budget, currency }) {
  const total = Object.values(budget).reduce((a, b) => a + b, 0);
  
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Icon name="account_balance_wallet" /></div>
        <div>
          <h3 className="text-white font-black text-lg">AI Budget Allocation</h3>
          <p className="text-emerald-400 font-bold text-sm">Total: {total.toLocaleString()} {currency}</p>
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(budget).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300 capitalize">{key}</span>
              <span className="text-white">{value.toLocaleString()} {currency}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanningTimeline({ timeline }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl h-full">
      <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
        <Icon name="calendar_month" className="text-violet-400" /> Event Timeline
      </h3>
      <div className="space-y-6">
        {timeline.map((phase, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-violet-500/30 pb-2 last:border-0 last:pb-0">
            <div className="absolute w-3 h-3 bg-violet-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            <h4 className="text-violet-300 font-bold text-sm mb-2">{phase.phase}</h4>
            <ul className="space-y-2">
              {phase.tasks.map((task, j) => (
                <li key={j} className="text-slate-400 text-xs flex items-start gap-2">
                  <Icon name="check" className="text-[14px] text-emerald-400 mt-0.5" /> {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChecklistSection({ checklist, onToggle }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="fact_check" className="text-amber-400" /> Smart Checklist
      </h3>
      <div className="space-y-2">
        {checklist.map(task => (
          <label key={task.id} className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-900 border border-white/5 rounded-xl cursor-pointer transition">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={(e) => onToggle(task.id, e.target.checked)}
              className="w-4 h-4 accent-violet-500 rounded border-white/20 bg-slate-800" 
            />
            <div className="flex-1">
              <p className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-black/40 px-2 py-1 rounded-full">{task.category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function GuestEstimator({ guestCount, catering, seating }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="groups" className="text-blue-400" /> Logistics & Capacity
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-3xl font-black text-white">{guestCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Total Guests</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-3xl font-black text-white">{seating.tableCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Guest Tables</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-xl font-black text-white mt-1">{catering.estimatedMeals}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Estimated Meals</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 text-center">
          <p className="text-xl font-black text-white mt-1">{catering.serviceStaff}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Service Staff</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 leading-relaxed bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
        <strong>Seating Layout:</strong> {seating.layoutStyle}. Includes {seating.vipTables} VIP tables and {seating.familyTables} Family tables.
      </p>
    </div>
  );
}

export function VendorSuggestionCard({ vendor }) {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col transition hover:border-violet-500/30 hover:-translate-y-1 shadow-lg">
      <img src={vendor.image} alt={vendor.name} className="h-32 w-full object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full">{vendor.category}</span>
          <span className="flex items-center text-xs font-bold text-amber-400"><Icon name="star" className="text-[12px] mr-1" />{vendor.rating}</span>
        </div>
        <h4 className="text-white font-bold text-sm mb-1">{vendor.name}</h4>
        <p className="text-xs text-slate-400 flex-1">Est. {vendor.estimatedPrice.toLocaleString()} FCFA</p>
        <button onClick={() => navigate(`/marketplace/${vendor.vendorId}`)} className="mt-3 w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-xl border border-white/10 transition">
          View Profile
        </button>
      </div>
    </div>
  );
}

export function DecorMoodBoard({ theme }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="palette" className="text-fuchsia-400" /> Theme & Decor
      </h3>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 h-24 rounded-2xl shadow-inner border border-white/10" style={{ backgroundColor: theme.primaryColor }} />
        <div className="flex-1 h-24 rounded-2xl shadow-inner border border-white/10" style={{ backgroundColor: theme.secondaryColor }} />
      </div>
      <h4 className="text-white font-bold">{theme.aesthetic}</h4>
      <p className="text-sm text-slate-400 mt-1">Vibe: {theme.vibe}</p>
      <p className="text-sm text-slate-400">Dress Code: {theme.dressCode}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {theme.decorKeywords.map(kw => (
          <span key={kw} className="text-[10px] font-bold uppercase tracking-widest text-slate-300 border border-white/10 px-3 py-1 rounded-full">{kw}</span>
        ))}
      </div>
    </div>
  );
}

export function SeatingLayoutPreview({ seating }) {
  if (!seating) return null;
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="table_restaurant" className="text-violet-400" /> Seating Structure
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">Layout Style</span>
          <span className="text-white font-bold text-right max-w-[60%]">{seating.layoutStyle}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">Total Tables</span>
          <span className="text-white font-bold">{seating.tableCount}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">VIP Tables</span>
          <span className="text-white font-bold">{seating.vipTables}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">Family Tables</span>
          <span className="text-white font-bold">{seating.familyTables}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Stage Placement</span>
          <span className="text-white font-bold">{seating.stagePlacement}</span>
        </div>
      </div>
    </div>
  );
}

export function EventPlanExport({ plan, onExport, onShare, onSave }) {
  if (!plan) return null;
  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl space-y-4">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="ios_share" className="text-emerald-400" /> Export & Share
      </h3>
      <button onClick={() => onExport("pdf")} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition text-sm font-bold border border-white/10">
        <Icon name="picture_as_pdf" className="text-rose-400 text-lg" /> Download PDF
      </button>
      <button onClick={() => onExport("csv")} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition text-sm font-bold border border-white/10">
        <Icon name="table_chart" className="text-emerald-400 text-lg" /> Export Budget CSV
      </button>
      <button onClick={onShare} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl transition text-sm font-bold shadow-lg shadow-violet-900/20">
        <Icon name="share" className="text-white text-lg" /> Share Plan Link
      </button>
    </div>
  );
}
