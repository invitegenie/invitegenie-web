import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getTenantByProviderId } from "../services/tenantService";
import { getThemeSettings, saveThemeSettings, THEME_PRESETS } from "../services/storefrontThemeService";
import AIThemeGeneratorPanel from "../components/AIThemeGeneratorPanel";

export default function StorefrontThemeEditor() {
  const { currentUser } = useAuth();
  const providerId = currentUser?.id || "demo";
  const tenant = getTenantByProviderId(providerId);
  const [theme, setTheme] = useState(THEME_PRESETS["luxury"]);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(() => {
    if (tenant?.id) {
      setTheme(getThemeSettings(tenant.id));
    }
  }, [tenant]);

  const handleSave = () => {
    if (tenant?.id) {
      saveThemeSettings(tenant.id, theme);
      setToast("Theme saved successfully!");
      setTimeout(() => setToast(""), 3000);
    } else {
      setToast("Create your storefront settings first.");
    }
  };

  const applyPreset = (presetKey) => {
    setTheme(THEME_PRESETS[presetKey]);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Theme Editor</h1>
        {toast && <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-lg border border-emerald-500/30 text-sm font-bold">{toast}</div>}
        
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
          <button 
            onClick={() => setActiveTab("manual")} 
            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${activeTab === "manual" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}
          >
            Manual Editor
          </button>
          <button 
            onClick={() => setActiveTab("ai")} 
            className={`px-4 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${activeTab === "ai" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-orange-500/20" : "bg-white/5 text-slate-400 hover:text-white"}`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            AI Theme Generator
          </button>
        </div>

        {activeTab === "manual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-white border-b border-white/10 pb-3 mb-4">Quick Presets</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(THEME_PRESETS).map(key => <button key={key} onClick={() => applyPreset(key)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full capitalize text-xs font-bold text-white hover:bg-white/10">{key.replace("-", " ")}</button>)}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white border-b border-white/10 pb-3 mb-4">Custom Colors</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Primary Brand Color</span><div className="flex gap-2"><input type="color" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" /><input type="text" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg w-24 px-3 text-white outline-none text-sm" /></div></label>
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Background Color</span><div className="flex gap-2"><input type="color" value={theme.backgroundColor} onChange={e => setTheme({...theme, backgroundColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" /><input type="text" value={theme.backgroundColor} onChange={e => setTheme({...theme, backgroundColor: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg w-24 px-3 text-white outline-none text-sm" /></div></label>
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Secondary Area Color</span><div className="flex gap-2"><input type="color" value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" /><input type="text" value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg w-24 px-3 text-white outline-none text-sm" /></div></label>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white border-b border-white/10 pb-3 mb-4">Style Elements</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Border Radius</span><select value={theme.borderRadius || "1rem"} onChange={e => setTheme({...theme, borderRadius: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-sm"><option value="0">Square (0)</option><option value="0.5rem">Small (0.5rem)</option><option value="1rem">Medium (1rem)</option><option value="2rem">Large (2rem)</option></select></label>
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Card Style</span><select value={theme.cardStyle || "elevated"} onChange={e => setTheme({...theme, cardStyle: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-sm"><option value="flat">Flat</option><option value="elevated">Elevated</option><option value="bordered">Bordered</option><option value="minimal">Minimal</option></select></label>
                <label className="flex items-center justify-between"><span className="text-sm text-slate-400">Hero Style</span><select value={theme.heroStyle || "gradient"} onChange={e => setTheme({...theme, heroStyle: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-sm"><option value="solid">Solid Color</option><option value="gradient">Gradient</option><option value="image">Full Image</option><option value="soft">Soft Fade</option></select></label>
              </div>
            </div>
            <button onClick={handleSave} className="w-full bg-violet-600 text-white px-4 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-violet-500 shadow-lg">Save Theme Changes</button>
          </div>
          <div className="border border-white/10 rounded-3xl overflow-hidden min-h-[500px] flex flex-col shadow-2xl transition-colors duration-300" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}><div className="p-8 border-b" style={{ borderColor: `${theme.primaryColor}30` }}><h2 className="text-3xl font-black tracking-tight mb-2">Live Preview</h2><p className="text-sm opacity-80">Changes apply instantly to your public storefront.</p></div><div className="p-8 space-y-6"><button className="px-8 py-3 font-black uppercase tracking-widest text-xs shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor, borderRadius: theme.borderRadius || "1rem" }}>Primary Action</button><div className="p-6 border shadow-lg" style={{ borderColor: theme.cardStyle === "bordered" ? `${theme.textColor}20` : "transparent", backgroundColor: theme.cardStyle === "flat" || theme.cardStyle === "bordered" ? "transparent" : theme.secondaryColor, borderRadius: theme.borderRadius || "1rem", boxShadow: theme.cardStyle === "elevated" ? "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" : "none" }}><h4 className="font-bold text-lg mb-2">Featured Service Card</h4><p className="text-sm opacity-80 leading-relaxed">Your professional services will be displayed beautifully using your exact brand colors to build trust with customers.</p><div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: `${theme.textColor}20` }}><span className="font-black" style={{ color: theme.primaryColor }}>FCFA 50,000</span><span className="text-xs font-bold uppercase" style={{ color: `${theme.textColor}80` }}>View</span></div></div></div></div>
        </div>
        ) : (
          <AIThemeGeneratorPanel 
            tenant={tenant} 
            currentTheme={theme} 
            onApply={(newTheme) => {
              setTheme(newTheme);
              saveThemeSettings(tenant?.id, newTheme);
              setToast("AI Theme applied successfully to your storefront!");
              setTimeout(() => setToast(""), 3000);
            }} 
          />
        )}
      </div>
    </Layout>
  );
}