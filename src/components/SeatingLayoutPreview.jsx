import Icon from "./Icon";

export default function SeatingLayoutPreview({ seating }) {
  if (!seating) return null;
  const tableCount = Math.min(Number(seating.tableCount || 0), 36);
  const vipTables = Math.min(Number(seating.vipTables || 0), tableCount);
  const familyTables = Math.min(Number(seating.familyTables || 0), Math.max(tableCount - vipTables, 0));

  return (
    <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
        <Icon name="table_restaurant" className="text-amber-400" /> Seating Preview
      </h3>
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <div className="mx-auto mb-5 max-w-[220px] rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-amber-100">
          {seating.stagePlacement || "Main stage"}
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: tableCount }).map((_, index) => {
            const tone = index < vipTables ? "bg-amber-300 text-black" : index < vipTables + familyTables ? "bg-violet-500/30 text-violet-100" : "bg-white/10 text-slate-300";
            return (
              <div key={index} className={`aspect-square rounded-full grid place-items-center text-[10px] font-black ${tone}`}>
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-400">{seating.layoutStyle}</p>
    </div>
  );
}
