export default function FloatingGenieButton() {
  return (
    <div className="fixed bottom-24 right-8 z-50">
      <button className="group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-transform duration-300 hover:scale-110">
        <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-12">
          auto_awesome
        </span>
      </button>
    </div>
  );
}
