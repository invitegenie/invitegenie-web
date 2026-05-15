import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { getRecommendationInsight } from "../services/vendorRecommendationEngine";

export default function SmartVendorRecommendations({
  event,
  recommendations = [],
  title = "Smart Vendor Recommendations",
  subtitle = "Recommended for your event profile",
  limit = 8,
  compact = false,
  publicView = false,
  showActions = true,
  className = "",
}) {
  const navigate = useNavigate();
  const visibleRecommendations = useMemo(
    () => (Array.isArray(recommendations) ? recommendations.slice(0, limit) : []),
    [limit, recommendations]
  );
  const insight = useMemo(
    () => getRecommendationInsight(event || {}, visibleRecommendations),
    [event, visibleRecommendations]
  );

  if (!visibleRecommendations.length) return null;

  const openVendor = (vendor) => {
    const providerId = getProviderId(vendor);
    navigate(providerId ? `/marketplace/${providerId}` : "/marketplace");
  };

  const bookVendor = (vendor) => {
    const providerId = getProviderId(vendor);
    navigate(providerId ? `/marketplace/${providerId}/book` : "/marketplace");
  };

  if (compact) {
    return (
      <section className={`rounded-2xl border border-amber-300/15 bg-slate-950/70 p-4 ${className}`}>
        <RecommendationHeader title={title} subtitle={subtitle} insight={insight} compact publicView={publicView} />
        <div className="mt-4 grid gap-3">
          {visibleRecommendations.map((vendor) => (
            <button
              key={vendor.id}
              type="button"
              onClick={() => openVendor(vendor)}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-amber-300/40 hover:bg-amber-300/[0.06]"
            >
              <img src={vendor.profileImage || vendor.coverImage} alt={vendor.name} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-black text-white">{vendor.name}</p>
                  <ScoreBadge score={vendor.score} small />
                </div>
                <p className="mt-1 text-xs text-slate-400">{vendor.category} | {vendor.location}</p>
              </div>
              <Icon name="chevron_right" className="text-slate-500 transition group-hover:text-amber-200" />
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-xl ${className}`}>
      <RecommendationHeader title={title} subtitle={subtitle} insight={insight} publicView={publicView} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleRecommendations.map((vendor) => (
          <article
            key={vendor.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-amber-300/35 hover:shadow-amber-950/30"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={vendor.coverImage || vendor.profileImage} alt={vendor.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                  {vendor.recommendationLabel || "Recommended"}
                </span>
                <AvailabilityBadge availability={vendor.availability} />
              </div>
              <div className="absolute bottom-3 right-3">
                <ScoreBadge score={vendor.score} />
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">{vendor.category}</p>
                  <h3 className="mt-1 truncate text-lg font-black text-white">{vendor.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Icon name="location_on" className="text-sm text-slate-500" />
                    {vendor.location}
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                  <p className="text-sm font-black text-white">{Number(vendor.rating || 0).toFixed(1)}</p>
                  <p className="text-[10px] font-bold text-amber-200">{vendor.reviewCount || 0} reviews</p>
                </div>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-400">{vendor.description}</p>

              <div className="flex flex-wrap gap-2">
                {(vendor.services || []).slice(0, 3).map((service) => (
                  <span key={service} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[11px] font-semibold text-slate-300">
                    {service}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-200">Why AI picked this</p>
                <ul className="mt-2 space-y-1">
                  {(vendor.matchReasons || []).slice(0, 3).map((reason) => (
                    <li key={reason} className="flex gap-2 text-xs leading-5 text-amber-50/75">
                      <Icon name="auto_awesome" className="mt-0.5 text-sm text-amber-300" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {showActions ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => bookVendor(vendor)}
                    className="rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-950 transition hover:bg-amber-100"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={() => openVendor(vendor)}
                    className="rounded-2xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-amber-300/40 hover:text-white"
                  >
                    View Vendor
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecommendationHeader({ title, subtitle, insight, compact = false, publicView = false }) {
  return (
    <div className={compact ? "space-y-3" : "grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"}>
      <div>
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
          <Icon name="auto_awesome" className="text-base" />
          InviteGenie AI
        </p>
        <h2 className={`${compact ? "text-base" : "text-2xl"} mt-2 font-black text-white`}>{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className={`rounded-2xl border ${publicView ? "border-amber-200/20 bg-black/20" : "border-violet-300/15 bg-violet-500/[0.07]"} p-4`}>
        <p className="text-sm leading-6 text-slate-200">{insight}</p>
      </div>
    </div>
  );
}

function ScoreBadge({ score = 0, small = false }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/15 font-black text-emerald-100 ${small ? "px-2 py-1 text-[10px]" : "h-16 w-16 text-sm"}`}>
      {small ? `${score}%` : <span><span className="block text-center text-lg">{score}</span><span className="block text-[9px] uppercase tracking-widest">match</span></span>}
    </span>
  );
}

function AvailabilityBadge({ availability }) {
  const status = String(availability?.status || availability || "available").toLowerCase();
  const isAvailable = status.includes("available");
  const isLimited = status.includes("limited");
  const className = isAvailable
    ? "bg-emerald-400/20 text-emerald-100"
    : isLimited
      ? "bg-amber-300/20 text-amber-100"
      : "bg-rose-400/20 text-rose-100";

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur ${className}`}>
      {isAvailable ? "Available" : isLimited ? "Limited" : "Check dates"}
    </span>
  );
}

function getProviderId(vendor) {
  return vendor?.marketplaceProviderId || vendor?.providerId || vendor?.listingId || vendor?.id;
}
