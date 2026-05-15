import React from "react";
export default function TaskProgressRing({ progress, size = 24 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90"><circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="10%" className="text-slate-700" /><circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="10%" strokeDasharray={`${progress * 2.5} 250`} className="text-emerald-400" /></svg>
    </div>
  );
}