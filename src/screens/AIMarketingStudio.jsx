import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import AIStudioSidebar from "../components/AIStudioSidebar";
import MarketingOutputCard from "../components/MarketingOutputCard";
import PlanLimitModal from "../components/PlanLimitModal";
import { useAuth } from "../auth/AuthContext";
import { getMarketplaceProviders } from "../services/mockData";
import {
  getOwnedProviderForUser,
  getStorefrontProducts,
  getStorefrontSettings,
} from "../services/marketplaceStorefrontService";
import { ACCOUNT_TYPES, getAccountType } from "../services/accountCapabilities";
import { hasPermission } from "../services/permissions";
import {
  BRAND_VOICE_PRESETS,
  MARKETING_MODULES,
  canUseMarketingModule,
  generateCompetitorPricingAnalysis,
  generateEmailCampaign,
  generateFlyerConcept,
  generateInstagramCarousel,
  generatePricingSuggestion,
  generatePromoCaptions,
  generateWhatsAppAd,
  getBrandVoice,
  getGenerationHistory,
  getMarketingUsage,
  getSavedCampaigns,
  saveBrandVoice,
  saveCampaign,
  saveGeneration,
  trackGenerationUsage,
} from "../services/aiMarketingStudioService";

const CAMPAIGN_GOALS = [
  "Get more bookings",
  "Promote discount",
  "Launch new service",
  "Fill weekend slots",
  "Build brand awareness",
];

const TONES = ["Luxury", "Friendly", "Professional", "Energetic", "Romantic", "Corporate"];
const AUDIENCES = ["Brides", "Event planners", "Corporate clients", "Birthday hosts", "Beauty clients", "General public"];
const PLATFORMS = ["WhatsApp", "Instagram", "Facebook", "Email", "Flyer"];
const LANGUAGES = ["English", "French", "Bilingual"];

export default function AIMarketingStudio({ entry = "studio" }) {
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();
  const actor = profile || currentUser || { accountType: ACCOUNT_TYPES.FREE };
  const accountType = getAccountType(actor);
  const userId = actor?.id || currentUser?.id || "demo-user";
  const [activeModule, setActiveModule] = useState("promo_caption");
  const [output, setOutput] = useState(null);
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const [toast, setToast] = useState("");
  const [limitModal, setLimitModal] = useState(null);
  const [usage, setUsage] = useState(() => getMarketingUsage(userId, accountType));
  const [history, setHistory] = useState(() => getGenerationHistory(userId));
  const [savedCampaigns, setSavedCampaigns] = useState(() => getSavedCampaigns(userId));
  const [brandVoice, setBrandVoice] = useState(() => getBrandVoice(userId));

  const vendorContext = useMemo(() => resolveVendorContext(currentUser || profile), [currentUser, profile]);
  const { provider, settings, services } = vendorContext;
  const [form, setForm] = useState(() => ({
    serviceId: services[0]?.id || "",
    campaignGoal: "Get more bookings",
    tone: "Luxury",
    targetAudience: "Beauty clients",
    platform: "Instagram",
    offer: "",
    city: settings?.location || provider?.location || "Douala",
    language: "Bilingual",
  }));

  useEffect(() => {
    const refreshStudioState = () => {
      setUsage(getMarketingUsage(userId, accountType));
      setHistory(getGenerationHistory(userId));
      setSavedCampaigns(getSavedCampaigns(userId));
      setBrandVoice(getBrandVoice(userId));
    };
    const timeoutId = window.setTimeout(refreshStudioState, 0);
    window.addEventListener("invitegenie:data-change", refreshStudioState);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("invitegenie:data-change", refreshStudioState);
    };
  }, [accountType, userId]);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === String(form.serviceId)) || services[0] || buildFallbackService(provider),
    [form.serviceId, provider, services]
  );

  const activeModuleConfig = MARKETING_MODULES.find((module) => module.id === activeModule) || MARKETING_MODULES[0];
  const locked = isModuleLocked(activeModuleConfig);
  const context = {
    ...form,
    service: selectedService,
    selectedService,
    provider: { ...provider, ...settings },
    brandVoice,
    accountType,
  };

  function isModuleLocked(module) {
    if (!module || module.passive) return false;
    if (hasPermission(actor, "all_permissions") || hasPermission(actor, module.permission)) return false;
    return !canUseMarketingModule(actor, module.id).allowed;
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBrandVoiceChange(value) {
    setBrandVoice(saveBrandVoice(userId, value));
    showToast("Brand voice saved locally.");
  }

  function handleModuleChange(moduleId) {
    setActiveModule(moduleId);
    setOutput(null);
    setCurrentGeneration(null);
  }

  function assertCanGenerate(module) {
    if (module.passive) return { allowed: false, passive: true };
    if (isModuleLocked(module)) {
      return {
        allowed: false,
        limit: {
          reason: "aiMarketingAccess",
          current: 0,
          limit: 1,
          recommendedPlan: module.minimumPlan,
          message: `${module.label} is available on ${module.minimumPlan} and higher plans.`,
        },
      };
    }

    const currentUsage = getMarketingUsage(userId, accountType);
    if (currentUsage.limit !== Infinity && currentUsage.used >= currentUsage.limit) {
      return {
        allowed: false,
        limit: {
          reason: "aiMarketingUsage",
          current: currentUsage.used,
          limit: currentUsage.limit,
          recommendedPlan: accountType === ACCOUNT_TYPES.FREE ? ACCOUNT_TYPES.PRO : accountType === ACCOUNT_TYPES.PRO ? ACCOUNT_TYPES.BUSINESS : ACCOUNT_TYPES.ENTERPRISE,
          message: "You've reached your AI Marketing Studio limit for this month.",
        },
      };
    }

    return { allowed: true };
  }

  function handleGenerate() {
    const gate = assertCanGenerate(activeModuleConfig);
    if (!gate.allowed) {
      if (gate.limit) setLimitModal(gate.limit);
      return;
    }

    const nextOutput = runGenerator(activeModule, context);
    const nextUsage = trackGenerationUsage(userId, accountType);
    const generation = saveGeneration(userId, {
      type: activeModule,
      input: {
        ...form,
        brandVoice,
        serviceId: selectedService?.id,
        providerId: provider?.id,
      },
      output: nextOutput,
      serviceId: selectedService?.id,
    });

    setOutput(nextOutput);
    setCurrentGeneration(generation);
    setUsage(nextUsage);
    setHistory(getGenerationHistory(userId));
    showToast("AI marketing asset generated.");
  }

  async function handleCopy(value) {
    const text = typeof value === "string" ? value : serializeOutput(value || output);
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard.");
    } catch {
      showToast("Copy failed. Select and copy the text manually.");
    }
  }

  function handleSave() {
    if (!currentGeneration && !output) return;
    const generation = currentGeneration || {
      type: activeModule,
      input: { ...form, brandVoice, serviceId: selectedService?.id, providerId: provider?.id },
      output,
      serviceId: selectedService?.id,
    };
    const saved = saveCampaign(userId, generation);
    setCurrentGeneration(saved);
    setSavedCampaigns(getSavedCampaigns(userId));
    setHistory(getGenerationHistory(userId));
    showToast("Saved to campaigns.");
  }

  function handleOpenWhatsApp(value) {
    const text = typeof value === "string" ? value : serializeOutput(value || output);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  const usageLimitText = usage.limit === Infinity ? "Unlimited" : Number(usage.limit || 0).toLocaleString();

  return (
    <Layout>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-28">
        {toast ? <Toast message={toast} /> : null}

        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0D12] shadow-2xl shadow-black/25">
          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-orange-500 to-violet-500" />
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300">
                  {entry === "vendor-genie" ? "Vendor Genie upgraded" : "Vendor Growth AI"}
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">AI Marketing Studio</h1>
                <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                  Create campaigns, flyers, captions, WhatsApp ads and pricing strategies for your services.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[430px]">
                <Metric label="Monthly usage" value={`${usage.used} / ${usageLimitText}`} />
                <button
                  onClick={() => navigate("/pricing")}
                  className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-left text-sm font-black text-amber-100 transition hover:bg-amber-300/20"
                >
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-amber-300">Current Plan</span>
                  <span className="mt-1 flex items-center gap-2 text-xl text-white">
                    {accountType}
                    <Icon name="arrow_forward" className="text-[18px] text-amber-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)_330px]">
          <AIStudioSidebar
            modules={MARKETING_MODULES}
            activeModule={activeModule}
            onChange={handleModuleChange}
            isModuleLocked={isModuleLocked}
            usage={usage}
            accountType={accountType}
          />

          <main className="space-y-5">
            {activeModule === "saved_campaigns" ? (
              <SavedCampaigns campaigns={savedCampaigns} onCopy={handleCopy} />
            ) : (
              <>
                <WorkspaceForm
                  module={activeModuleConfig}
                  locked={locked}
                  form={form}
                  services={services}
                  selectedService={selectedService}
                  brandVoice={brandVoice}
                  onField={updateForm}
                  onBrandVoice={handleBrandVoiceChange}
                  onGenerate={handleGenerate}
                  onUpgrade={() => setLimitModal({
                    reason: "aiMarketingAccess",
                    current: 0,
                    limit: 1,
                    recommendedPlan: activeModuleConfig.minimumPlan,
                    message: `${activeModuleConfig.label} is available on ${activeModuleConfig.minimumPlan} and higher plans.`,
                  })}
                />
                <MarketingOutputCard
                  type={activeModule}
                  title={activeModuleConfig.label}
                  output={output}
                  service={selectedService}
                  provider={{ ...provider, ...settings }}
                  onCopy={handleCopy}
                  onSave={handleSave}
                  onRegenerate={handleGenerate}
                  onOpenWhatsApp={handleOpenWhatsApp}
                />
              </>
            )}
          </main>

          <RightSidebar
            provider={{ ...provider, ...settings }}
            service={selectedService}
            brandVoice={brandVoice}
            history={history}
            onCopy={handleCopy}
            onNavigatePricing={() => navigate("/pricing")}
          />
        </div>

        <PlanLimitModal open={Boolean(limitModal)} limit={limitModal} onClose={() => setLimitModal(null)} />
      </div>
    </Layout>
  );
}

function WorkspaceForm({ module, locked, form, services, selectedService, brandVoice, onField, onBrandVoice, onGenerate, onUpgrade }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-4 shadow-xl shadow-black/20 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">{module.label}</p>
          <h2 className="mt-1 text-2xl font-black text-white">Campaign input</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{module.description}</p>
        </div>
        {locked ? (
          <button onClick={onUpgrade} className="rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-black">
            Upgrade
          </button>
        ) : (
          <button onClick={onGenerate} className="rounded-full bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg shadow-orange-950/20">
            Generate
          </button>
        )}
      </div>

      {locked ? (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
          {module.label} is locked for your current plan. You can still use basic captions and WhatsApp ads on Free.
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Select label="Select service/product" value={form.serviceId || selectedService?.id} onChange={(value) => onField("serviceId", value)}>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.title}</option>
          ))}
        </Select>
        <Select label="Campaign goal" value={form.campaignGoal} onChange={(value) => onField("campaignGoal", value)}>
          {CAMPAIGN_GOALS.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select label="Tone" value={form.tone} onChange={(value) => onField("tone", value)}>
          {TONES.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select label="Target audience" value={form.targetAudience} onChange={(value) => onField("targetAudience", value)}>
          {AUDIENCES.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select label="Platform" value={form.platform} onChange={(value) => onField("platform", value)}>
          {PLATFORMS.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select label="Language" value={form.language} onChange={(value) => onField("language", value)}>
          {LANGUAGES.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Input label="Offer / discount" value={form.offer} onChange={(value) => onField("offer", value)} placeholder="Example: 10% off weekend bookings" />
        <Input label="City / location" value={form.city} onChange={(value) => onField("city", value)} />
        <Select label="Brand voice" value={brandVoice} onChange={onBrandVoice}>
          {BRAND_VOICE_PRESETS.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selected offer</p>
          <p className="mt-2 text-sm font-black text-white">{selectedService?.title}</p>
          <p className="mt-1 text-sm text-amber-200">FCFA {Number(selectedService?.price || 0).toLocaleString("fr-CM")}</p>
        </div>
      </div>
    </section>
  );
}

function RightSidebar({ provider, service, brandVoice, history, onCopy, onNavigatePricing }) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Business Context</p>
        <div className="mt-4 flex gap-3">
          <img src={provider?.avatar || provider?.image || provider?.coverImage} alt={provider?.businessName || provider?.name || "Vendor"} className="h-14 w-14 rounded-2xl object-cover" />
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-white">{provider?.businessName || provider?.name || "InviteGenie Vendor"}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">{provider?.category || "Marketplace vendor"} in {provider?.location || "Cameroon"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniStat label="Rating" value={provider?.rating || "4.8"} />
          <MiniStat label="Reviews" value={provider?.reviews || provider?.reviewCount || "64"} />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Selected Service</p>
        <h3 className="mt-3 text-lg font-black text-white">{service?.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{service?.description}</p>
        <p className="mt-3 text-sm font-black text-amber-200">FCFA {Number(service?.price || 0).toLocaleString("fr-CM")}</p>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Brand Voice</p>
        <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white">{brandVoice}</p>
        <button onClick={onNavigatePricing} className="mt-4 w-full rounded-full border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10">
          View plan features
        </button>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Recent Generations</p>
        <div className="mt-4 space-y-3">
          {history.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => onCopy?.(serializeOutput(item.output))} className="w-full rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left hover:bg-white/[0.06]">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{formatModuleLabel(item.type)}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">{serializeOutput(item.output)}</p>
            </button>
          ))}
          {!history.length ? <p className="py-6 text-center text-xs text-slate-500">No generations yet.</p> : null}
        </div>
      </section>
    </aside>
  );
}

function SavedCampaigns({ campaigns, onCopy }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Saved Campaigns</p>
          <h2 className="mt-1 text-2xl font-black text-white">Marketing history you approved</h2>
        </div>
        <p className="text-sm font-bold text-slate-500">{campaigns.length} saved</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">{formatModuleLabel(campaign.type)}</p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-300">{serializeOutput(campaign.output)}</pre>
            <button onClick={() => onCopy?.(serializeOutput(campaign.output))} className="mt-4 rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
              Copy
            </button>
          </article>
        ))}
        {!campaigns.length ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500 lg:col-span-2">
            Saved flyers, captions, WhatsApp ads, and campaigns will appear here.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function runGenerator(moduleId, context) {
  if (moduleId === "flyer") return generateFlyerConcept(context);
  if (moduleId === "whatsapp_ad") return generateWhatsAppAd(context);
  if (moduleId === "instagram_carousel") return generateInstagramCarousel(context);
  if (moduleId === "email_campaign") return generateEmailCampaign(context);
  if (moduleId === "pricing_suggestions") return generatePricingSuggestion(context);
  if (moduleId === "competitor_analysis") return generateCompetitorPricingAnalysis(context);
  return generatePromoCaptions(context);
}

function resolveVendorContext(user) {
  const providers = getMarketplaceProviders();
  const ownedProvider = getOwnedProviderForUser(user?.id);
  const provider = ownedProvider || providers.find((item) => String(item.ownerId || item.userId || item.sellerId) === String(user?.id)) || providers[0] || {};
  const settings = provider?.id ? getStorefrontSettings(provider.id) : {};
  const storefrontServices = provider?.id ? getStorefrontProducts(provider.id, { includeDrafts: true, includeHidden: true }) : [];
  const packageServices = (provider.packages || []).map((pack, index) => ({
    id: `${provider.id || "provider"}-package-${index}`,
    providerId: provider.id,
    ownerId: provider.ownerId,
    title: pack.name || provider.title,
    category: provider.category || "Service",
    type: "package",
    price: pack.price || provider.price,
    currency: "FCFA",
    description: pack.description || provider.description,
    included: provider.included || provider.tags || [],
    duration: "Confirmed after booking",
    requirements: ["Date and location confirmation"],
    image: provider.image,
    tags: provider.tags || [],
  }));
  const services = storefrontServices.length ? storefrontServices : packageServices.length ? packageServices : [buildFallbackService(provider)];
  return { provider, settings, services };
}

function buildFallbackService(provider = {}) {
  return {
    id: provider.id || "demo-premium-service",
    providerId: provider.id || "demo-provider",
    ownerId: provider.ownerId,
    title: provider.title || "Premium Event Service",
    category: provider.category || "Event Service",
    type: provider.type || "service",
    price: provider.price || provider.startingPrice || 75000,
    currency: "FCFA",
    description: provider.description || "Premium service package ready for InviteGenie marketplace campaigns.",
    included: provider.included || provider.tags || ["Consultation", "Premium setup", "Booking support"],
    duration: "Confirmed after booking",
    requirements: ["Preferred date", "Event location"],
    image: provider.image || provider.coverImage || "",
    tags: provider.tags || [],
  };
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <select value={value || ""} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-amber-300">
        {children}
      </select>
    </label>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-300" />
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fixed right-5 top-5 z-[520] rounded-2xl border border-amber-300/30 bg-black/90 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur">
      {message}
    </div>
  );
}

function serializeOutput(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(serializeOutput).join("\n\n");
  if (!value || typeof value !== "object") return String(value ?? "");
  return Object.entries(value)
    .map(([key, item]) => `${formatLabel(key)}: ${Array.isArray(item) ? item.map(serializeOutput).join("; ") : typeof item === "object" && item !== null ? serializeOutput(item) : item}`)
    .join("\n");
}

function formatLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatModuleLabel(value) {
  return MARKETING_MODULES.find((module) => module.id === value)?.label || formatLabel(value);
}
