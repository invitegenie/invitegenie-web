import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getMarketplaceProviders, getProviderById } from "../services/mockData";
import {
  STOREFRONT_STORAGE_KEYS,
  canCreateStorefrontProduct,
  canModerateStorefronts,
  generateProductSuggestionFromPhoto,
  getAllStorefrontProducts,
  getStorefrontCommissionRate,
  getStorefrontProducts,
  getStorefrontSettings,
  saveStorefrontCommissionRate,
  saveStorefrontProduct,
  updateStorefrontProductStatus,
  updateStorefrontSettings,
} from "../services/marketplaceStorefrontService";
import AvailabilityBadge from "../components/AvailabilityBadge";
import { calculateAvailabilityStatus } from "../services/availabilityService";
import { getTenantBySlug, getTenantByProviderId } from "../services/tenantService";
import { getThemeSettings } from "../services/storefrontThemeService";
import PublicStorefrontLayout from "../components/PublicStorefrontLayout";
import StorefrontHero from "../components/StorefrontHero";
import StorefrontServiceGrid from "../components/StorefrontServiceGrid";
import { trackBookingClick } from "../services/storefrontAnalyticsService";
import { openWhatsAppBooking } from "../services/whatsappMessageFormatter";
import * as Engine from "../auth/coreEngine";

const tabs = ["All", "Packages", "Services", "Products", "Featured", "Custom"];
const sampleUpload = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1100";

export default function MarketplaceStorefront() {
  const { providerId, slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, profile, role } = useAuth();
  const actor = profile || currentUser || role;
  const [activeTab, setActiveTab] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dismissedQueryProductId, setDismissedQueryProductId] = useState("");
  const [toast, setToast] = useState("");
  const [, setVersion] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [tenant, setTenant] = useState(null);
  const [theme, setTheme] = useState(null);
  
  useEffect(() => {
    let t = slug ? getTenantBySlug(slug) : getTenantByProviderId(providerId);
    setTenant(t);
    if (t?.id) setTheme(getThemeSettings(t.id));
  }, [slug, providerId]);

  const activeProviderId = tenant?.providerId || providerId;
  
  const mockProvider = getProviderById(activeProviderId);
  const engineProvider = (Engine.getCollection(Engine.KEYS.VENDORS) || []).find(v => String(v.id) === String(activeProviderId));
  const provider = mockProvider || engineProvider;

  useEffect(() => {
    const loadAvailability = async () => {
      if (activeProviderId) {
        const status = await calculateAvailabilityStatus(activeProviderId, new Date().toISOString().slice(0, 10));
        setAvailabilityStatus(status);
      }
    };
    loadAvailability();
  }, [activeProviderId]);

  const settings = getStorefrontSettings(activeProviderId);
  const canAdd = canCreateStorefrontProduct(actor, provider);
  const canModerate = canModerateStorefronts(actor);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("invitegenie:data-change", refresh);
    return () => window.removeEventListener("invitegenie:data-change", refresh);
  }, []);

  const products = getStorefrontProducts(activeProviderId, {
    includeDrafts: canAdd || canModerate,
    includeHidden: canModerate,
  });

  const queryProductId = searchParams.get("product") || "";
  const queryProduct =
    !queryProductId || dismissedQueryProductId === queryProductId
      ? null
      : products.find((item) => String(item.id) === String(queryProductId)) || null;
  const activeProduct = selectedProduct || queryProduct;

  if (!provider) {
    return (
      <Layout showHeader={false}>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-amber-500/20 bg-black/60 p-8 text-center">
          <Icon name="storefront" className="mb-4 text-5xl text-amber-300" />
          <h1 className="text-2xl font-black text-white">Storefront Not Found</h1>
          <p className="mt-2 text-sm text-stone-400">This provider storefront is not available yet.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-6 rounded-full bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-widest text-black">
            Back to Marketplace
          </button>
        </div>
      </Layout>
    );
  }

  const filteredProducts = products.filter((product) => {
    if (activeTab === "All") return true;
    if (activeTab === "Packages") return product.type === "package";
    if (activeTab === "Services") return product.type === "service";
    if (activeTab === "Products") return product.type === "product";
    if (activeTab === "Featured") return product.tags?.includes("featured");
    if (activeTab === "Custom") return /custom|sur mesure|bespoke/i.test(`${product.category} ${(product.tags || []).join(" ")}`);
    return true;
  });

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const shareStorefront = async () => {
    const url = tenant?.slug ? `${window.location.origin}/s/${tenant.slug}` : `${window.location.origin}/marketplace/${activeProviderId}/storefront`;
    if (navigator.share) await navigator.share({ title: settings.businessName, text: settings.description, url });
    else await navigator.clipboard.writeText(url);
    showToast("Storefront link copied.");
  };

  const contactProvider = () => {
    openWhatsAppBooking(provider, {
      vendorName: settings.businessName || provider.businessName || provider.name,
      clientName: profile?.full_name || currentUser?.name || "Client",
      serviceName: "Demande via Storefront",
      notes: "J'aimerais avoir plus d'informations sur vos services.",
    });
  };

  const bookProduct = (product) => {
    const actorId = profile?.id || currentUser?.id;
    const ownerId = product.ownerId || provider.ownerId || provider.userId || provider.sellerId;
    if (!actorId) {
      navigate("/login");
      return;
    }
    if (actorId && ownerId && String(actorId) === String(ownerId)) {
      showToast("You cannot book your own service.");
      return;
    }
    if (tenant?.id) trackBookingClick(tenant.id, product.id);
    const selected = {
      providerId: activeProviderId,
      tenantId: tenant?.id,
      storefrontSlug: tenant?.slug,
      source: "storefront",
      productId: product.id,
      ownerId,
      title: product.title,
      category: product.category,
      type: product.type,
      price: product.price,
      currency: product.currency,
      duration: product.duration,
      image: product.image,
      description: product.description,
      included: product.included,
      requirements: product.requirements,
    };
    localStorage.setItem(STOREFRONT_STORAGE_KEYS.selectedItem, JSON.stringify(selected));
    navigate(`/marketplace/${activeProviderId}/book?product=${product.id}`, { state: { selectedMarketplaceProduct: selected } });
  };

  const moderateProduct = (productId, status) => {
    updateStorefrontProductStatus(productId, status);
    showToast(status === "hidden" ? "Listing hidden from public storefront." : "Listing approved and published.");
  };

  const renderContent = () => (
      <div className="mx-auto max-w-[1500px] space-y-8 pb-28">
        {toast ? <Toast message={toast} /> : null}

        {theme ? (
          <StorefrontHero tenant={tenant} settings={settings} provider={provider} theme={theme} availabilityStatus={availabilityStatus} onShare={shareStorefront} onContact={contactProvider} onAvailability={() => navigate(`/marketplace/${activeProviderId}/availability`)} onBack={() => navigate("/marketplace")} />
        ) : (
          <section className="overflow-hidden rounded-[2rem] border border-amber-500/20 bg-[#090806] shadow-2xl shadow-black/30">
             <div className="relative min-h-[360px]">
              <img src={settings.coverImage || provider.image} alt={settings.businessName} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090806] via-[#090806]/70 to-black/25" />
              <div className="absolute left-5 top-5 flex gap-2">
                <button onClick={() => navigate("/marketplace")} className="rounded-full border border-white/10 bg-black/45 p-3 text-white backdrop-blur hover:bg-white/10"><Icon name="arrow_back" /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                    <img src={settings.avatar || provider.image} alt={settings.businessName} className="h-24 w-24 rounded-3xl border-4 border-[#090806] object-cover shadow-xl" />
                    <div className="min-w-0">
                      <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{settings.businessName}</h1>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={contactProvider} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-amber-100">Contact</button>
                    <button onClick={() => navigate(`/marketplace/${activeProviderId}/availability`)} className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Availability</button>
                    <button onClick={shareStorefront} className="rounded-full bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-black">Share</button>
                  </div>
                </div>
              </div>
             </div>
          </section>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                activeTab === tab
                  ? "shadow-lg shadow-black/20"
                  : "border opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: activeTab === tab ? (theme?.primaryColor || '#fbbf24') : 'transparent', color: activeTab === tab ? '#000' : (theme?.textColor || '#fff'), borderColor: activeTab !== tab ? `${theme?.textColor || '#fff'}20` : 'transparent' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {theme ? (
          <StorefrontServiceGrid products={filteredProducts} theme={theme} tenantId={tenant?.id} onBook={bookProduct} onDetails={setSelectedProduct} />
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <StorefrontProductCard
                key={product.id}
                product={product}
                onBook={() => bookProduct(product)}
                onDetails={() => setSelectedProduct(product)}
                canModerate={canModerate}
                onApprove={() => moderateProduct(product.id, "published")}
                onHide={() => moderateProduct(product.id, "hidden")}
              />
            ))}
          </section>
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#11100d] p-8 text-center">
            <p className="text-sm font-bold text-stone-300">No listings in this category yet.</p>
          </div>
        ) : null}

        {canAdd ? (
          <section className="rounded-[2rem] border border-amber-400/20 bg-gradient-to-br from-[#171109] to-[#090806] p-5 shadow-xl sm:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Vendor Tools</p>
                <h2 className="mt-2 text-2xl font-black text-white">Add Product / Service</h2>
                <p className="mt-1 max-w-2xl text-sm text-stone-400">Upload a photo, let the Genie suggest listing details, then publish instantly to this storefront.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate(`/ai-marketing-studio?provider=${activeProviderId}`)} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-amber-100 hover:bg-amber-300/20">
                  AI Marketing Studio
                </button>
                <button onClick={() => setDrawerOpen(true)} className="rounded-full bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-amber-100">
                  Add Product / Service
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {drawerOpen ? (
          <ListingDrawer
            provider={provider}
            settings={settings}
            onClose={() => setDrawerOpen(false)}
            onSaved={(product, status) => {
              setDrawerOpen(false);
              showToast(status === "draft" ? "Draft saved locally." : `${product.title} is live on the storefront.`);
            }}
          />
        ) : null}

        {activeProduct ? (
          <ProductDetailsModal
            product={activeProduct}
            onClose={() => {
              setSelectedProduct(null);
              if (queryProductId) setDismissedQueryProductId(queryProductId);
            }}
            onBook={() => bookProduct(activeProduct)}
          />
        ) : null}
      </div>
  );

  if (theme) {
    return (
      <PublicStorefrontLayout tenant={tenant} theme={theme}>
        {renderContent()}
      </PublicStorefrontLayout>
    );
  }

  return <Layout showHeader={false}>{renderContent()}</Layout>;
}

export function StorefrontModeration() {
  const { profile, role, isSuperAdmin } = useAuth();
  const actor = profile || role;
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setVersion] = useState(0);
  const [commissionRate, setCommissionRate] = useState(getStorefrontCommissionRate());
  const providers = getMarketplaceProviders();
  const providerMap = new Map(providers.map((provider) => [String(provider.id), provider]));
  const canModerate = canModerateStorefronts(actor);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("invitegenie:data-change", refresh);
    return () => window.removeEventListener("invitegenie:data-change", refresh);
  }, []);

  const allProducts = getAllStorefrontProducts({ includeHidden: true });
  const products = statusFilter === "all"
    ? allProducts
    : allProducts.filter((product) => (product.status || "published") === statusFilter);

  const setProductStatus = (productId, status) => {
    updateStorefrontProductStatus(productId, status);
    setVersion((value) => value + 1);
  };

  const toggleFeatured = (providerId) => {
    const settings = getStorefrontSettings(providerId);
    updateStorefrontSettings(providerId, { featured: !settings.featured });
    setVersion((value) => value + 1);
  };

  if (!canModerate) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0D1320] p-8 text-center">
        <h1 className="text-2xl font-black text-white">Storefront Moderation</h1>
        <p className="mt-2 text-sm text-slate-400">Your admin role does not include storefront moderation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#FBBF24]">Marketplace Storefronts</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Storefront Moderation</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Approve pending products, hide inappropriate listings, and manage featured storefronts in beta.
          </p>
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-[#0D1320] px-4 py-3 text-sm font-bold text-white outline-none">
          {["all", "published", "draft", "pending", "hidden"].map((status) => <option key={status}>{status}</option>)}
        </select>
      </header>

      {isSuperAdmin ? (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Commission Rate</p>
            <div className="mt-3 flex gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(event) => setCommissionRate(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300"
              />
              <button
                onClick={() => setCommissionRate(saveStorefrontCommissionRate(commissionRate))}
                className="rounded-xl bg-amber-300 px-4 py-3 text-xs font-black uppercase tracking-widest text-black"
              >
                Save
              </button>
            </div>
          </div>
          <Metric label="Products" value={products.length} />
          <Metric label="Hidden" value={getAllStorefrontProducts({ includeHidden: true }).filter((item) => item.status === "hidden").length} />
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const provider = providerMap.get(String(product.providerId));
          const settings = getStorefrontSettings(product.providerId);
          return (
            <article key={product.id} className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
              <div className="flex gap-4">
                <img src={product.image} alt={product.title} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <StatusPill status={product.status || "published"} />
                    {settings.featured ? <span className="rounded-full bg-amber-300/15 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-200">Featured storefront</span> : null}
                  </div>
                  <h2 className="truncate text-lg font-black text-white">{product.title}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{provider?.businessName || settings.businessName} - {product.category}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{product.description}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-sm font-black text-emerald-300">FCFA {Number(product.price || 0).toLocaleString()}</p>
                <div className="flex flex-wrap gap-2">
                  {product.status !== "published" ? (
                    <button onClick={() => setProductStatus(product.id, "published")} className="rounded-xl bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">
                      Approve
                    </button>
                  ) : null}
                  {product.status !== "hidden" ? (
                    <button onClick={() => setProductStatus(product.id, "hidden")} className="rounded-xl border border-rose-400/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-200">
                      Hide
                    </button>
                  ) : (
                    <button onClick={() => setProductStatus(product.id, "draft")} className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                      Restore Draft
                    </button>
                  )}
                  {isSuperAdmin ? (
                    <button onClick={() => toggleFeatured(product.providerId)} className="rounded-xl border border-amber-300/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-100">
                      {settings.featured ? "Unfeature" : "Feature"}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function StorefrontProductCard({ product, onBook, onDetails, canModerate, onApprove, onHide }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11100d] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-400/40">
      <div className="relative h-64 overflow-hidden">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-100 backdrop-blur">{product.category}</span>
          <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">{product.type}</span>
          {product.status !== "published" ? <StatusPill status={product.status} /> : null}
        </div>
        <img src={product.qrCodeUrl} alt={`${product.title} QR code`} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl bg-white p-2 shadow-lg" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-xl font-black text-white">{product.title}</h2>
            <p className="mt-1 text-sm font-black text-amber-300">FCFA {Number(product.price || 0).toLocaleString()}</p>
          </div>
          <p className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold text-stone-300">{product.duration}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-400">{product.description}</p>
        <ul className="space-y-2">
          {(product.included || []).slice(0, 4).map((item) => (
            <li key={item} className="flex gap-2 text-sm text-stone-300">
              <Icon name="check_circle" className="text-[18px] text-amber-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
          <button onClick={onBook} className="rounded-full bg-gradient-to-r from-amber-300 to-orange-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-black">
            Book Now
          </button>
          <button onClick={onDetails} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/[0.08]">
            View Details
          </button>
        </div>
        {canModerate ? (
          <div className="flex gap-2 border-t border-white/10 pt-4">
            {product.status !== "published" ? <button onClick={onApprove} className="rounded-full bg-emerald-300 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black">Approve</button> : null}
            {product.status !== "hidden" ? <button onClick={onHide} className="rounded-full border border-rose-300/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-100">Hide</button> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ListingDrawer({ provider, settings, onClose, onSaved }) {
  const { currentUser } = useAuth();
  const [image, setImage] = useState("");
  const [form, setForm] = useState(() => ({
    title: "",
    category: settings.category || "",
    type: "service",
    price: "",
    description: "",
    included: [],
    duration: "",
    requirements: [],
    tags: [],
    ctaText: "Book Now",
  }));
  const [status, setStatus] = useState("");

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = String(reader.result || "");
      setImage(nextImage);
      setForm((prev) => ({ ...prev, image: nextImage }));
    };
    reader.readAsDataURL(file);
  };

  const generateSuggestion = () => {
    const suggestion = generateProductSuggestionFromPhoto(image || sampleUpload, settings.category);
    setForm((prev) => ({ ...prev, ...suggestion, image: image || sampleUpload }));
    setStatus("Genie suggestions are ready. Edit anything before publishing.");
  };

  const save = (nextStatus) => {
    if (!form.title.trim() || !form.category.trim() || !Number(form.price || 0)) {
      setStatus("Title, category, and FCFA price are required.");
      return;
    }
    const product = saveStorefrontProduct(
      {
        ...form,
        providerId: provider.id,
        ownerId: provider.ownerId || provider.userId || currentUser?.id,
        image: form.image || image || provider.image,
        included: form.included,
        requirements: form.requirements,
        tags: form.tags,
      },
      nextStatus
    );
    onSaved(product, nextStatus);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur">
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-amber-400/20 bg-[#090806] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090806]/95 p-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">AI-Assisted Listing</p>
            <h2 className="mt-1 text-2xl font-black text-white">Add Product / Service</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 p-3 text-white hover:bg-white/10">
            <Icon name="close" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#11100d] p-4">
              <p className="text-sm font-black text-white">Photo</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">Upload or take a photo of the product, service setup, treatment room, or business location.</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                {image || form.image ? (
                  <img src={image || form.image} alt="Listing preview" className="h-72 w-full object-cover" />
                ) : (
                  <div className="flex h-72 items-center justify-center text-sm text-stone-600">Image preview</div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-black">
                  Upload Photo
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handlePhoto(event.target.files?.[0])} />
                </label>
                <button onClick={() => { setImage(sampleUpload); updateField("image", sampleUpload); }} className="rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                  Use Sample
                </button>
                <button onClick={generateSuggestion} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-amber-100">
                  Regenerate Suggestions
                </button>
              </div>
            </div>
            {status ? <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{status}</p> : null}
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#11100d] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Product / service name" value={form.title} onChange={(value) => updateField("title", value)} />
              <Input label="Category" value={form.category} onChange={(value) => updateField("category", value)} />
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Type</span>
                <select value={form.type} onChange={(event) => updateField("type", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300">
                  {["service", "product", "package"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <Input label="Price FCFA" type="number" value={form.price} onChange={(value) => updateField("price", Number(value))} />
              <Input label="Duration" value={form.duration} onChange={(value) => updateField("duration", value)} />
              <Input label="CTA text" value={form.ctaText} onChange={(value) => updateField("ctaText", value)} />
            </div>
            <Textarea label="Short description" value={form.description} onChange={(value) => updateField("description", value)} />
            <ArrayTextarea label="Included items / services" value={form.included} onChange={(value) => updateField("included", value)} />
            <ArrayTextarea label="Booking requirements" value={form.requirements} onChange={(value) => updateField("requirements", value)} />
            <ArrayTextarea label="Tags" value={form.tags} onChange={(value) => updateField("tags", value)} />
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => save("published")} className="rounded-full bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-black">
                Accept & Publish
              </button>
              <button onClick={() => save("draft")} className="rounded-full border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                Save Draft
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsModal({ product, onClose, onBook }) {
  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/75 p-4 backdrop-blur">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-amber-300/20 bg-[#090806] shadow-2xl">
        <img src={product.image} alt={product.title} className="h-72 w-full object-cover" />
        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">{product.category}</p>
              <h2 className="mt-2 text-3xl font-black text-white">{product.title}</h2>
              <p className="mt-2 text-xl font-black text-amber-300">FCFA {Number(product.price || 0).toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="rounded-full border border-white/10 p-3 text-white hover:bg-white/10">
              <Icon name="close" />
            </button>
          </div>
          <p className="text-sm leading-7 text-stone-300">{product.description}</p>
          <div className="grid gap-5 md:grid-cols-[1fr_180px]">
            <div className="space-y-4">
              <ListBlock title="Included" items={product.included} />
              <ListBlock title="Requirements" items={product.requirements} fallback="Provider will confirm any special requirements after booking." />
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <img src={product.qrCodeUrl} alt={`${product.title} QR code`} className="mx-auto h-36 w-36 rounded-2xl bg-white p-2" />
              <p className="mt-3 text-xs text-stone-400">Scan to reopen this listing.</p>
            </div>
          </div>
          <button onClick={onBook} className="w-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-4 text-xs font-black uppercase tracking-widest text-black">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{label}</span>
      <input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="mt-4 block">
      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{label}</span>
      <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-amber-300" />
    </label>
  );
}

function ArrayTextarea({ label, value, onChange }) {
  return (
    <label className="mt-4 block">
      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{label}</span>
      <textarea
        value={(value || []).join("\n")}
        onChange={(event) => onChange(event.target.value.split(/\n|,/).map((item) => item.trim()).filter(Boolean))}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-amber-300"
      />
    </label>
  );
}

function ListBlock({ title, items = [], fallback }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => (
          <p key={item} className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-stone-300">
            <Icon name="check_circle" className="text-[18px] text-amber-300" />
            {item}
          </p>
        )) : <p className="text-sm text-stone-500">{fallback}</p>}
      </div>
    </div>
  );
}

function Badge({ label, icon, tone = "dark" }) {
  const cls = tone === "gold" ? "bg-amber-300 text-black" : tone === "orange" ? "bg-orange-500 text-black" : "bg-black/60 text-amber-100";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls}`}>
      {icon ? <Icon name={icon} className="text-[14px]" /> : null}
      {label}
    </span>
  );
}

function StatusPill({ status = "published" }) {
  const cls =
    status === "hidden"
      ? "bg-rose-500/20 text-rose-100"
      : status === "draft"
        ? "bg-slate-500/20 text-slate-100"
        : status === "pending"
          ? "bg-amber-500/20 text-amber-100"
          : "bg-emerald-500/20 text-emerald-100";
  return <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${cls}`}>{status}</span>;
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fixed right-5 top-5 z-[360] rounded-2xl border border-amber-300/30 bg-black/90 px-5 py-3 text-sm font-bold text-white shadow-xl backdrop-blur">
      {message}
    </div>
  );
}
