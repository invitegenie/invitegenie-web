import React from "react";
import { trackServiceView } from "../services/storefrontAnalyticsService";

export default function StorefrontServiceGrid({ products, theme, onBook, onDetails, tenantId }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-3xl border p-8 text-center mx-4 sm:mx-6 lg:mx-8" style={{ borderColor: `${theme.primaryColor}30`, backgroundColor: `${theme.primaryColor}05` }}>
        <p className="text-sm font-bold" style={{ color: theme.textColor }}>No listings available yet.</p>
      </div>
    );
  }

  const borderRadius = theme?.borderRadius || "1.5rem";
  const cardStyle = theme?.cardStyle || "elevated";
  
  const getCardStyleProps = () => {
    const base = { borderRadius, overflow: "hidden", transition: "transform 0.2s" };
    if (cardStyle === "flat") return { ...base, backgroundColor: "transparent", border: "none" };
    if (cardStyle === "bordered") return { ...base, backgroundColor: "transparent", border: `1px solid ${theme.textColor}30` };
    if (cardStyle === "minimal") return { ...base, backgroundColor: `${theme.secondaryColor}50`, border: `1px solid ${theme.primaryColor}20` };
    return { ...base, backgroundColor: theme.secondaryColor, border: `1px solid ${theme.textColor}10`, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" };
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 mx-4 sm:mx-6 lg:mx-8">
      {products.map((product) => (
        <article key={product.id} className="group hover:-translate-y-1" style={getCardStyleProps()}>
          <div className="relative h-64 overflow-hidden">
            {product.image && <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur" style={{ backgroundColor: `${theme.backgroundColor}cc`, color: theme.primaryColor, borderRadius: "2rem" }}>{product.category}</span>
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor, borderRadius: "2rem" }}>{product.type}</span>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-xl font-black" style={{ color: theme.textColor }}>{product.title}</h2>
                <p className="mt-1 text-sm font-black" style={{ color: theme.primaryColor }}>FCFA {Number(product.price || 0).toLocaleString()}</p>
              </div>
              <p className="shrink-0 border px-3 py-1 text-[10px] font-bold" style={{ borderColor: `${theme.textColor}30`, color: `${theme.textColor}cc`, borderRadius: "2rem" }}>{product.duration}</p>
            </div>
            <p className="line-clamp-2 text-sm leading-6" style={{ color: `${theme.textColor}99` }}>{product.description}</p>
            <div className="grid gap-3 border-t pt-4 sm:grid-cols-2" style={{ borderColor: `${theme.textColor}20` }}>
              <button onClick={() => { if (tenantId) trackServiceView(tenantId, product.id); onBook(product); }} className="px-4 py-3 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-90" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor, borderRadius: "2rem" }}>Book Now</button>
              <button onClick={() => { if (tenantId) trackServiceView(tenantId, product.id); onDetails(product); }} className="border px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors" style={{ borderColor: `${theme.textColor}30`, color: theme.textColor, backgroundColor: `${theme.textColor}05`, borderRadius: "2rem" }}>View Details</button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}