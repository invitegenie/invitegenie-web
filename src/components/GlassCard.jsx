export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={`rounded-[32px] border border-white/5 bg-white/[0.03] p-8 shadow-md backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
