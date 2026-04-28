export default function PlaceholderPage({ title = "Page" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f1014] to-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px] top-20 left-1/4" />
          <div className="absolute h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px] -bottom-20 right-1/4" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-900/40">
              <span className="material-symbols-outlined text-white text-4xl">construction</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-white tracking-tighter text-center mb-4">
              {title}
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-center text-lg mb-8 font-medium">
              This module is ready to be connected.
            </p>

            {/* Status badge */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                In Development
              </span>
            </div>

            {/* Features coming */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">
                Coming Soon
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-violet-400 text-[20px]">check_circle</span>
                  <span>Feature integration in progress</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-violet-400 text-[20px]">check_circle</span>
                  <span>UI/UX refinement underway</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-violet-400 text-[20px]">check_circle</span>
                  <span>Ready for deployment</span>
                </li>
              </ul>
            </div>

            {/* Footer message */}
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                ✨ More magic coming soon ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
