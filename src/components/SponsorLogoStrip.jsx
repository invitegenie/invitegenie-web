import React from "react";

export default function SponsorLogoStrip({ sponsors = [], max = 5, className = "" }) {
  if (!sponsors.length) return null;
  
  const visibleSponsors = sponsors.slice(0, max);
  const remaining = Math.max(0, sponsors.length - max);

  return (
    <div className={`mt-6 pt-6 border-t border-white/5 ${className}`}>
      <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 text-center lg:text-left">
        Official Sponsors
      </p>
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
        {visibleSponsors.map(s => (
          s.sponsorLogo ? (
            <img key={s.id} src={s.sponsorLogo} alt={s.sponsorName} className="h-6 sm:h-8 max-w-[100px] object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer" title={s.sponsorName} />
          ) : (
            <span key={s.id} className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer">{s.sponsorName}</span>
          )
        ))}
        {remaining > 0 && (
          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md">+{remaining} Partners</span>
        )}
      </div>
    </div>
  );
}