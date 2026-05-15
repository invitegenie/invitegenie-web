import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SmartVendorRecommendations from "../components/SmartVendorRecommendations";
import { getEventById } from "../services/mockData";
import {
  buildEventWebsiteInputFromEvent,
  generateEventWebsiteExperience,
  getEventWebsiteExperience,
  saveEventWebsiteExperience,
} from "../services/eventWebsiteGeneratorService";
import {
  buildVendorRecommendationInputFromEvent,
  recommendVendors,
} from "../services/vendorRecommendationEngine";
import { getActiveSponsorBranding, injectSponsorsIntoWebsite } from "../services/eventSponsorBrandingService";
import SponsorLogoStrip from "../components/SponsorLogoStrip";

export default function EventWebsite() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = getEventById(eventId);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  const website = useMemo(() => {
    if (!event) return null;
    const saved = getEventWebsiteExperience(event.id);
    const existing = event.website || event.eventWebsiteExperience;
    return saved || existing || generateEventWebsiteExperience(buildEventWebsiteInputFromEvent(event));
  }, [event]);
  const recommendationInput = useMemo(
    () => (event ? buildVendorRecommendationInputFromEvent(event) : {}),
    [event]
  );
  const smartRecommendations = useMemo(() => {
    if (!event) return [];
    if (Array.isArray(event.recommendations) && event.recommendations.length) return event.recommendations;
    return recommendVendors(recommendationInput, { limit: 6 });
  }, [event, recommendationInput]);
  
  const sponsors = event ? injectSponsorsIntoWebsite(website, getActiveSponsorBranding(event.id)) : [];

  useEffect(() => {
    if (!event || !website || getEventWebsiteExperience(event.id)) return;
    saveEventWebsiteExperience(event.id, website);
  }, [event, website]);

  if (!event || !website) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0A] p-6 text-center text-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-amber-300">InviteGenie Website</p>
          <h1 className="mt-3 text-3xl font-black">Event website not found</h1>
          <button onClick={() => navigate("/events")} className="mt-6 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-black">
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  const branding = website.eventBranding || {};
  const design = website.designSystem || {};
  const hero = website.heroSection || {};
  const rsvp = website.rsvpSection || {};
  const invitation = website.invitation || {};
  const social = website.socialMedia || {};
  const primary = design.primaryColor || "#0B0B0A";
  const secondary = design.secondaryColor || "#F5E6C8";
  const accent = design.accentColor || "#D6A23A";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(social.whatsAppInvitationText || `You are invited to ${branding.eventTitle}`)}`;

  const shareWebsite = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: branding.eventTitle, text: branding.tagline, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden text-[#F5E6C8]"
      style={{
        backgroundColor: primary,
        color: secondary,
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 20px), linear-gradient(90deg, rgba(214,162,58,0.08), transparent 38%, rgba(255,255,255,0.04))",
      }}
    >
      <section className="relative flex min-h-[88vh] items-end overflow-hidden px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <img src={event.coverImage || event.image} alt={branding.eventTitle} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${primary} 8%, rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.2))` }} />
        <div className="absolute inset-x-0 bottom-0 h-28" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${accent}22, transparent)` }} />

        <nav className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-3 sm:left-8 sm:right-8 lg:left-12 lg:right-12">
          <button onClick={() => navigate(-1)} className="rounded-full border border-white/15 bg-black/35 px-4 py-3 text-xs font-black uppercase tracking-widest text-white backdrop-blur">
            Back
          </button>
          <div className="flex gap-2">
            <button onClick={shareWebsite} className="rounded-full border border-white/15 bg-black/35 px-4 py-3 text-xs font-black uppercase tracking-widest text-white backdrop-blur">
              Share
            </button>
            <a href="#rsvp" className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-widest text-black" style={{ backgroundColor: accent }}>
              RSVP
            </a>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl">
          <p className="w-fit rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/80 backdrop-blur">
            {branding.eventType} | {formatDate(branding.eventDate || event.date)}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {hero.headline || branding.eventTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">{hero.subtext || branding.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(hero.ctaButtons || ["RSVP Now", "View Details", "Share Invitation"]).map((label, index) => (
              <a
                key={label}
                href={index === 0 ? "#rsvp" : index === 1 ? "#timeline" : "#share"}
                onClick={index === 2 ? shareWebsite : undefined}
                className={`rounded-full px-5 py-4 text-xs font-black uppercase tracking-widest ${index === 0 ? "text-black" : "border border-white/15 bg-black/25 text-white backdrop-blur"}`}
                style={index === 0 ? { backgroundColor: accent } : undefined}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          <Info label="Location" value={branding.location || event.location} />
          <Info label="Guests" value={`${branding.guestCount || event.totalTickets} expected`} />
          <Info label="Countdown" value={hero.countdownTimerConcept || "Luxury countdown enabled"} />
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>The Experience</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">{branding.eventTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">{branding.description}</p>
          </div>
          <div className="space-y-4 border-l border-white/10 pl-5">
            <Detail label="Visual Direction" value={branding.visualStyleDirection} />
            <Detail label="UI Mood" value={design.uiMood} />
            <Detail label="Decorative Pattern" value={design.decorativePatterns} />
          </div>
        </div>
      </section>

      <section id="timeline" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Programme" title="A beautifully paced event flow" accent={accent} />
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(website.timeline || []).map((item) => (
              <article key={`${item.time}-${item.title}`} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>{item.time}</p>
                <h3 className="mt-3 text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rsvp" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle eyebrow="RSVP" title={rsvp.title || "Reserve Your Presence"} accent={accent} />
            <p className="mt-5 text-sm leading-7 text-white/68">{rsvp.vipGuestFlowSuggestion}</p>
          </div>
          <form
            onSubmit={(eventSubmit) => {
              eventSubmit.preventDefault();
              setRsvpConfirmed(true);
            }}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {(rsvp.fields || []).slice(0, 6).map((field) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/48">{field}</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
                </label>
              ))}
            </div>
            {rsvpConfirmed ? (
              <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100">
                {rsvp.confirmationMessage}
              </p>
            ) : null}
            <button type="submit" className="mt-5 w-full rounded-full px-5 py-4 text-xs font-black uppercase tracking-widest text-black" style={{ backgroundColor: accent }}>
              Confirm RSVP
            </button>
          </form>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Vendor Direction" title="Premium partners to complete the experience" accent={accent} />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(website.vendors || []).map((vendor) => (
              <article key={vendor.category} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <h3 className="font-black text-white">{vendor.category}</h3>
                <p className="mt-3 text-xs leading-5 text-white/62">{vendor.idealVendor}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      {sponsors.length > 0 && (
        <section className="px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Event Partners" title="Official Sponsors" accent={accent} />
            <SponsorLogoStrip sponsors={sponsors} max={10} className="border-t-0 mt-8" />
          </div>
        </section>
      )}

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SmartVendorRecommendations
            event={recommendationInput}
            recommendations={smartRecommendations}
            title="AI-Curated Vendor Matches"
            subtitle="Marketplace partners selected for this event experience"
            limit={6}
            publicView
          />
        </div>
      </section>

      <section id="share" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>Invitation</p>
            <p className="mt-4 text-2xl font-black leading-tight text-white">{invitation.wording}</p>
            <p className="mt-5 text-sm text-white/60">Dress Code: {invitation.dressCode}</p>
            <p className="mt-2 text-sm text-white/60">{invitation.eventSignatureLine}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>Social Ready</p>
            <h3 className="mt-4 text-3xl font-black text-white">{social.instagramHashtag}</h3>
            <p className="mt-4 text-sm leading-6 text-white/64">{social.tiktokCaption}</p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/72">{social.whatsAppInvitationText}</p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="AI Premium Add-ons" title="Make the event feel intelligent" accent={accent} />
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(website.premiumFeatures || []).map((feature) => (
              <p key={feature} className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white/75">{feature}</p>
            ))}
          </div>
        </div>
      </section>

      <a href="#rsvp" className="fixed bottom-4 left-4 right-20 z-40 rounded-full px-5 py-4 text-center text-xs font-black uppercase tracking-widest text-black shadow-2xl sm:hidden" style={{ backgroundColor: accent }}>
        RSVP Now
      </a>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-black shadow-2xl">
        WA
      </a>
    </main>
  );
}

function SectionTitle({ eyebrow, title, accent }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: accent }}>{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">{title}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/44">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/42">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/68">{value}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Date to be announced";
  return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
