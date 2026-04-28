export default function FormCard({ title, children }) {
  return (
    <section className="max-w-xl rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
