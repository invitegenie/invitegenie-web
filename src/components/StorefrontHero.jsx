import React from "react";
import Icon from "./Icon";
import AvailabilityBadge from "./AvailabilityBadge";
import { trackWhatsAppClick, trackShareClick } from "../services/storefrontAnalyticsService";

export default function StorefrontHero({ tenant, settings, provider, theme, availabilityStatus, onShare, onContact, onAvailability, onBack }) {
  const handleContact = () => {
    if (tenant?.id) trackWhatsAppClick(tenant.id);
    onContact();
  };

  const handleShare = () => {
    if (tenant?.id) trackShareClick(tenant.id);
    onShare();
  };

  const cover = tenant?.coverImage || settings?.coverImage || provider?.image;
  const avatar = tenant?.logo || settings?.avatar || provider?.image;
  const name = tenant?.businessName || settings?.businessName || provider?.businessName;
  const description = tenant?.description || settings?.description || provider?.description;
  
  const borderRadius = theme?.borderRadius || "1.5rem";
  const heroStyle = theme?.heroStyle || "gradient";

  return (
    <section className="overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 border" style={{ backgroundColor: theme.secondaryColor, borderColor: `${theme.primaryColor}30`, borderRadius }}>
      <div className="relative min-h-[360px] lg:min-h-[460px]">
        {heroStyle === "image" && cover && (
          <img src={cover} alt={name} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        )}
        {heroStyle !== "image" && cover && (
          <img src={cover} alt={name} className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay" />
        )}
        <div className="absolute inset-0" style={{ 
          backgroundImage: heroStyle === "gradient" ? `linear-gradient(to top, ${theme.backgroundColor}, transparent)` : heroStyle === "solid" ? theme.backgroundColor : `linear-gradient(to top, ${theme.backgroundColor} 20%, transparent)`,
          opacity: heroStyle === "solid" ? 0.9 : 1
        }} />
        <div className="absolute left-5 top-5 z-10"><button onClick={onBack} className="border p-3 backdrop-blur transition hover:scale-105" style={{ backgroundColor: `${theme.backgroundColor}80`, borderColor: `${theme.textColor}30`, color: theme.textColor, borderRadius: "50%" }}><Icon name="arrow_back" /></button></div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end z-10">
              {avatar && <img src={avatar} alt={name} className="h-24 w-24 sm:h-32 sm:w-32 border-4 object-cover shadow-xl" style={{ borderColor: theme.backgroundColor, borderRadius }} />}
              <div className="min-w-0 pb-2">
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl" style={{ color: theme.textColor }}>{name}</h1>
                <p className="mt-2 text-sm max-w-xl line-clamp-2" style={{ color: `${theme.textColor}cc` }}>{description}</p>
                <div className="mt-3"><AvailabilityBadge status={availabilityStatus} label={availabilityStatus === 'available' ? 'Available' : availabilityStatus === 'almost_booked' ? 'Almost Booked' : 'Unavailable'} /></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pb-2 z-10">
              <button onClick={handleContact} className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 border" style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor, borderColor: `${theme.primaryColor}50`, borderRadius: "2rem" }}>Contact</button>
              <button onClick={onAvailability} className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 border" style={{ backgroundColor: `${theme.textColor}10`, color: theme.textColor, borderColor: `${theme.textColor}30`, borderRadius: "2rem" }}>Availability</button>
              <button onClick={handleShare} className="px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor, borderRadius: "2rem" }}>Share</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}