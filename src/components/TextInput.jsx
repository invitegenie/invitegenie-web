export default function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
