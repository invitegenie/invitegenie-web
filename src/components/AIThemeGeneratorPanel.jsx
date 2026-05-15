import React, { useState } from "react";
import Icon from "./Icon";
import BrandAssetUploader from "./BrandAssetUploader";
import ThemeSuggestionCard from "./ThemeSuggestionCard";
import ThemePreviewDevice from "./ThemePreviewDevice";
import ThemeMoodBoard from "./ThemeMoodBoard";
import { generateAIStorefrontThemes, getAIThemeUsage, trackAIThemeUsage } from "../services/aiStorefrontThemeService";
import { useAuth } from "../auth/AuthContext";
import { getAccountType } from "../services/accountCapabilities";
import { hasPermission } from "../services/roles";
import PlanLimitModal from "./PlanLimitModal";

export default function AIThemeGeneratorPanel({ tenant, currentTheme, onApply }) {
  const { currentUser, profile, role } = useAuth();
  const userId = currentUser?.id || "demo-user";
  const accountType = getAccountType(profile || currentUser);
  
  const [step, setStep] = useState(1);
  const [input, setInput] = useState({ category: tenant?.category || "", mood: "Luxury", preferredColors: ["#D4AF37", "#111827"] });
  const [assets, setAssets] = useState({ logo: null, cover: null, gallery: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [limitModal, setLimitModal] = useState(null);

  const usage = getAIThemeUsage(userId);
  const canGenerate = hasPermission(profile || role, "generate_ai_storefront_theme");

  const handleGenerate = () => {
    if (!canGenerate) {
      setLimitModal({ reason: "maxServices", message: "AI Theme Generation is available on Pro and above.", limit: 0, current: 0, recommendedPlan: "PRO" });
      return;
    }
    
    if (usage.limit !== Infinity && usage.used >= usage.limit) {
      setLimitModal({ reason: "maxServices", message: "You have reached your AI generation limit for this month.", limit: usage.limit, current: usage.used, recommendedPlan: "BUSINESS" });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI loading delay
    setTimeout(() => {
      trackAIThemeUsage(userId, accountType);
      const generated = generateAIStorefrontThemes(input);
      setSuggestions(generated);
      setSelectedTheme(generated[0]);
      setStep(2);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PlanLimitModal open={Boolean(limitModal)} limit={limitModal} onClose={() => setLimitModal(null)} />
      
      {step === 1 && (
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in">
          <h2 className="text-xl font-black text-white mb-2">AI Theme Architect</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl">Upload your brand assets and let our AI generate a complete, responsive storefront theme tailored perfectly to your business vibe.</p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <BrandAssetUploader assets={assets} onChange={setAssets} />
            </div>
            <div className="space-y-5">
               <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Category</span><input type="text" value={input.category} onChange={e => setInput({...input, category: e.target.value})} placeholder="e.g. Wedding Photography" className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-400" /></label>
               <label className="block"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Desired Mood</span><select value={input.mood} onChange={e => setInput({...input, mood: e.target.value})} className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-400"><option>Luxury</option><option>Romantic</option><option>Minimal</option><option>Bold</option><option>Afro-Premium</option><option>Corporate</option><option>Soft Beauty</option><option>High Fashion</option></select></label>
               <div><span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Primary Brand Colors</span><div className="flex gap-4"><input type="color" value={input.preferredColors[0]} onChange={e => setInput({...input, preferredColors: [e.target.value, input.preferredColors[1]]})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" /><input type="color" value={input.preferredColors[1]} onChange={e => setInput({...input, preferredColors: [input.preferredColors[0], e.target.value]})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0" /></div></div>
               <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all disabled:opacity-50">
                 {isGenerating ? "Analyzing & Generating..." : "Generate Themes"}
               </button>
               <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{usage.limit === Infinity ? "Unlimited Uses" : `${usage.used} / ${usage.limit} generations used`}</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 animate-in fade-in">
           <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-xl font-black text-white">Generated Concepts</h2><button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-white">Start Over</button></div>
              <div className="grid md:grid-cols-3 gap-4">
                 {suggestions.map(s => <ThemeSuggestionCard key={s.id} theme={s} isSelected={selectedTheme?.id === s.id} onPreview={() => setSelectedTheme(s)} onApply={() => onApply({ ...currentTheme, ...s.colors, ...s.layout, fontStyle: s.typography?.fontStyle })} />)}
              </div>
              <ThemeMoodBoard theme={selectedTheme} />
           </div>
           <div className="hidden xl:block bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center mb-4">Live Preview</p>
              <ThemePreviewDevice theme={{ ...currentTheme, ...selectedTheme?.colors, ...selectedTheme?.layout, fontStyle: selectedTheme?.typography?.fontStyle }} tenant={tenant} />
           </div>
        </div>
      )}
    </div>
  );
}