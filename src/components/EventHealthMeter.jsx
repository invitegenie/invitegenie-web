import React from 'react';

export default function EventHealthMeter({ score = 100, status = 'Excellent' }) {
  const getGradient = () => {
    if (score > 90) return 'from-emerald-500 to-green-400';
    if (score > 70) return 'from-blue-500 to-cyan-400';
    if (score > 50) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50%" cy="50%" />
        <circle className={`bg-gradient-to-r ${getGradient()}`} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="url(#gradient)" fill="transparent" r="45" cx="50%" cy="50%" />
        <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={getGradient().split(' ')[0].replace('from-','')} /><stop offset="100%" stopColor={getGradient().split(' ')[1].replace('to-','')} /></linearGradient></defs>
      </svg>
      <div className="text-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{status}</p>
      </div>
    </div>
  );
}