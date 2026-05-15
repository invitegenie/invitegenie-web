import React from 'react';
import Icon from './Icon';

export default function EventSponsors({ sponsors = [], onSponsorClick }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Event Sponsors</h2>
          <p className="mt-1 text-sm text-slate-500">The brands and individuals making this possible.</p>
        </div>
        <button onClick={onSponsorClick} className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-300 hover:bg-amber-500/20 transition-colors shrink-0">
          Become a Sponsor
        </button>
      </div>
      
      {sponsors.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {sponsors.map((sponsor) => (
            <a 
              key={sponsor.id} 
              href={sponsor.marketplaceLink || sponsor.profileLink || "#"}
              target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-slate-900/30 p-4 transition-all hover:bg-slate-900/80 hover:border-amber-300/30 w-32"
            >
              {sponsor.sponsorLogo ? (
                <img src={sponsor.sponsorLogo} alt={sponsor.sponsorName} className="h-12 w-full object-contain bg-transparent" />
              ) : (
                <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white/5">
                  <Icon name="verified" className="text-2xl text-amber-300" />
                </div>
              )}
              <div className="text-center mt-1 w-full">
                <h3 className="truncate font-bold text-white text-[10px]">{sponsor.sponsorName}</h3>
                <p className="truncate text-[8px] uppercase tracking-widest text-amber-400 mt-0.5">{sponsor.packageName}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic">No sponsors yet. Be the first!</p>
      )}
    </section>
  );
}