import Icon from "./Icon";

export default function FlyerPreviewCard({ flyer, service, provider }) {
  if (!flyer) return null;
  const palette = flyer.colorPalette || ["#090806", "#D4AF37", "#F97316"];
  const serviceImage = service?.image || provider?.coverImage || provider?.image || "";

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-amber-300/20 bg-[#080806] shadow-2xl shadow-black/30">
      <div className="relative min-h-[460px]">
        {serviceImage ? (
          <img src={serviceImage} alt={flyer.serviceName || service?.title || "Flyer service"} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${palette[0]} 0%, rgba(8,8,6,.88) 45%, rgba(8,8,6,.45) 100%)` }} />
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, ${palette[1]}, ${palette[2]})` }} />
        <div className="relative flex min-h-[460px] flex-col justify-between p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: palette[1] }}>
                InviteGenie Studio
              </p>
              <p className="mt-2 max-w-[14rem] text-xs font-semibold leading-5 text-white/70">{provider?.businessName || provider?.name || "Premium Vendor"}</p>
            </div>
            <div className="rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur">
              <Icon name="auto_awesome" className="text-[20px]" />
            </div>
          </div>

          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/80 backdrop-blur">
              {flyer.offerText}
            </p>
            <h3 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl">{flyer.headline}</h3>
            <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-white/75">{flyer.subheadline}</p>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-white/15 bg-black/55 p-4 backdrop-blur sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Starting at</p>
              <p className="mt-1 text-2xl font-black" style={{ color: palette[1] }}>{flyer.price}</p>
              <p className="mt-2 text-xs font-semibold text-white/60">{flyer.footerText}</p>
            </div>
            <span className="rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-widest text-black" style={{ background: `linear-gradient(90deg, ${palette[1]}, ${palette[2]})` }}>
              {flyer.cta}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
