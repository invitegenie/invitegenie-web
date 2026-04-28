export default function AnalyticsHeader({ selectedEvent }) {
  return (
    <section className="relative pb-8 mb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/80 mb-2">
            Performance Dashboard
          </p>
          <h2 className="text-4xl font-extrabold text-gray-100">Event Analytics</h2>
        </div>

        <div className="relative group min-w-[280px]">
          <label className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">
            Selected Event
          </label>
          <button className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 text-left text-gray-200 transition hover:bg-slate-900/60">
            <span className="font-semibold">{selectedEvent}</span>
            <span className="material-symbols-outlined text-purple-400/80">expand_more</span>
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5 opacity-20"
        style={{
          WebkitMaskImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"10\" viewBox=\"0 0 100 10\"><polygon points=\"0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 100,10 0,10\"/></svg>')",
          maskImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"10\" viewBox=\"0 0 100 10\"><polygon points=\"0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 100,10 0,10\"/></svg>')",
          maskSize: "40px 10px",
          WebkitMaskSize: "40px 10px",
          maskRepeat: "repeat-x",
          WebkitMaskRepeat: "repeat-x",
          maskPosition: "bottom",
          WebkitMaskPosition: "bottom",
        }}
      />
    </section>
  );
}
