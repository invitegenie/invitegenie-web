export default function PrimaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-400 px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
    >
      {children}
    </button>
  );
}
