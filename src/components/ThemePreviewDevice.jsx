import React from "react";
import Icon from "./Icon";

export default function ThemePreviewDevice({ theme, tenant }) {
  if (!theme) return null;

  const { primaryColor, secondaryColor, backgroundColor, textColor, borderRadius, cardStyle, heroStyle, fontStyle } = theme;
  const name = tenant?.businessName || "Your Business";

  const getCardStyle = () => {
    const base = { borderRadius, overflow: "hidden" };
    if (cardStyle === "flat") return { ...base, backgroundColor: "transparent", border: "none" };
    if (cardStyle === "bordered") return { ...base, backgroundColor: "transparent", border: `1px solid ${textColor}30` };
    if (cardStyle === "minimal") return { ...base, backgroundColor: `${secondaryColor}50`, border: `1px solid ${primaryColor}20` };
    return { ...base, backgroundColor: secondaryColor, border: `1px solid ${textColor}10`, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border-[8px] border-slate-800 bg-[#090806] overflow-hidden shadow-2xl relative h-[600px] flex flex-col" style={{ backgroundColor, color: textColor, fontFamily: fontStyle === 'serif' ? 'serif' : 'sans-serif' }}>
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-2xl w-32 mx-auto z-50"></div>
      
      {/* Hero */}
      <div className="relative h-48 shrink-0 flex flex-col justify-end p-5" style={{ 
        background: heroStyle === "gradient" ? `linear-gradient(to top, ${backgroundColor}, ${primaryColor}40)` : heroStyle === "solid" ? secondaryColor : backgroundColor
      }}>
        <h1 className="text-2xl font-black">{name}</h1>
        <p className="text-[10px] opacity-80 mt-1 uppercase tracking-widest">Storefront Preview</p>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 space-y-4">
        <div className="flex gap-2"><span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: primaryColor, color: backgroundColor, borderRadius: "2rem" }}>Services</span><span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest border" style={{ borderColor: `${textColor}30`, borderRadius: "2rem" }}>Packages</span></div>
        <div style={getCardStyle()} className="p-4"><div className="h-24 w-full mb-3 opacity-20" style={{ backgroundColor: textColor, borderRadius: borderRadius === "0" ? "0" : "0.5rem" }} /><h3 className="font-bold text-sm">Premium Service</h3><p className="text-xs opacity-70 mt-1 line-clamp-2">Example description showing how your offerings will look in this specific layout style.</p><div className="mt-3 flex justify-between items-center"><span className="font-black text-xs" style={{ color: primaryColor }}>FCFA 50,000</span><button className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: primaryColor, color: backgroundColor, borderRadius: "2rem" }}>Book</button></div></div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-around" style={{ borderColor: `${textColor}10`, backgroundColor: secondaryColor }}><Icon name="home" className="text-sm opacity-50" /><Icon name="search" className="text-sm opacity-50" /><Icon name="shopping_bag" className="text-sm opacity-50" /></div>
    </div>
  );
}