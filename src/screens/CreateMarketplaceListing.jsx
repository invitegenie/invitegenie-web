import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { canCreateMarketplaceListing, normalizeRole } from "../services/roles";
import { getListingQrCodeUrl, saveMarketplaceListing, saveMarketplaceListingDraft } from "../services/mockData";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";
import * as AIService from "../services/aiAssistantService";

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=900";
const LISTING_TYPES = ["vendor", "freelancer", "tasker", "product"];

const EMPTY_LISTING = {
  businessName: "",
  title: "",
  type: "vendor",
  category: "Caterer",
  location: "Douala",
  startingPrice: 75000,
  shortDescription: "",
  fullDescription: "",
  tags: [],
  included: [],
  requirements: [],
  availability: "Available this week",
  serviceTime: "1-2 days",
  contactPhone: "",
  packages: [],
};

export default function CreateMarketplaceListing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("vendor");
  const [image, setImage] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [listing, setListing] = useState(EMPTY_LISTING);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hasAccess = canCreateMarketplaceListing(currentUser);

  const finalPreview = useMemo(() => {
    const id = listing.id || "preview";
    return {
      ...listing,
      image,
      qrCodeUrl: listing.qrCodeUrl || getListingQrCodeUrl(id),
    };
  }, [listing, image]);

  if (!hasAccess) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-2xl border border-[#2A3342] bg-[#111827] p-8 text-center">
          <Icon name="lock" className="mb-4 text-5xl text-[#8B5CF6]" />
          <h1 className="text-2xl font-bold text-white">Access Restricted</h1>
          <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
            Marketplace publishing is available to vendors, freelancers, taskers, admins, and super admins.
            Event hosts can create events, but marketplace listings require a provider account.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate("/marketplace")} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
              Back to Marketplace
            </button>
            <button onClick={() => navigate("/support")} className="rounded-xl bg-[#8B5CF6] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
              Apply as Vendor/Tasker
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handlePhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const generateSuggestion = async () => {
    setIsAnalyzing(true);
    setStatus("AI Vision is examining your photo...identifying objects and service quality...");
    try {
      const nextSuggestion = await AIService.analyzeMarketplaceImage(image, selectedType);
      setSuggestion(nextSuggestion);
      setListing(nextSuggestion);
      setStatus("AI analysis complete. Details extracted from image.");
      setStep(2);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setStatus("Recognition failed. Please fill details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!listing.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!listing.title.trim()) newErrors.title = "Listing title is required";
    if (!listing.category.trim()) newErrors.category = "Category is required";
    if (!listing.location.trim()) newErrors.location = "Location is required";
    if (!listing.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required";
    if (listing.startingPrice <= 0) newErrors.startingPrice = "Price must be greater than 0";
    if (!listing.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setListing((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinueToPreview = () => {
    if (validate()) {
      setStatus("");
      setStep(4);
    } else {
      setStatus("Please fix the errors before continuing.");
    }
  };

  const publish = () => {
    if (!validate()) return setStep(3);

    const id = `lst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const qrCodeUrl = getListingQrCodeUrl(id);
    const newListing = {
      ...EMPTY_LISTING,
      ...listing,
      id,
      ownerId: currentUser?.id,
      ownerRole: normalizeRole(currentUser?.role),
      image,
      status: "published",
      verified: ["admin", "super_admin"].includes(normalizeRole(currentUser?.role)),
      rating: listing.rating || 0,
      reviews: 0,
      completedJobs: 0,
      currency: "FCFA",
      qrCodeUrl,
      createdAt: new Date().toISOString(),
      name: listing.businessName || "New Service Provider",
    };

    // Save to Engine for real-time reactivity
    const currentFreelancers = Engine.getCollection(KEYS.FREELANCERS) || [];
    Engine.save(KEYS.FREELANCERS, [newListing, ...currentFreelancers]);
    saveMarketplaceListing(newListing);

    // Post to the social feed
    const existingPosts = Engine.getCollection(KEYS.POSTS) || [];
    const feedPost = {
      id: `post-${id}`,
      userId: currentUser?.id,
      userName: currentUser?.name || listing.businessName,
      content: `Manifested a new listing: ${listing.title}. Starting at FCFA ${Number(listing.startingPrice || 0).toLocaleString()}. Check it out in the Marketplace!`,
      media: image,
      postType: "post",
      timestamp: Date.now(),
    };
    Engine.save(KEYS.POSTS, [feedPost, ...existingPosts]);

    showToast(`Listing "${listing.title}" published successfully!`);
    setTimeout(() => {
      navigate("/marketplace");
    }, 2500); // Navigate after toast is visible
  };

  const saveDraft = () => {
    const id = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    saveMarketplaceListingDraft({
      ...listing,
      id,
      ownerId: currentUser?.id,
      ownerRole: normalizeRole(currentUser?.role),
      image,
      qrCodeUrl: getListingQrCodeUrl(id),
      createdAt: new Date().toISOString(),
    });
    setStatus("Draft saved locally.");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <header className="flex flex-col gap-4 rounded-2xl border border-[#2A3342] bg-[#111827] p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">AI Marketplace Listing</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Create Listing</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#9CA3AF]">
              Upload a photo, review local AI suggestions, edit the details, and publish a marketplace listing with a QR code.
            </p>
          </div>
          <StepPills step={step} />
        </header>

        {toast ? (
          <div className="fixed right-6 top-6 z-[220] rounded-2xl border border-violet-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/30 backdrop-blur">
            {toast}
          </div>
        ) : null}
        {status ? <p className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-3 text-sm text-violet-100">{status}</p> : null}

        {step === 1 ? (
          <StepUpload
            image={image}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            isAnalyzing={isAnalyzing}
            onPhoto={handlePhoto}
            onSample={() => setImage(SAMPLE_IMAGE)}
            onContinue={() => {
              if (!image) {
                setStatus("Add a photo or use the sample photo first.");
                return;
              }
              generateSuggestion();
            }}
          />
        ) : null}

        {step === 2 ? (
          <StepSuggestions
            suggestion={suggestion}
            onEdit={() => setStep(3)}
            onRegenerate={generateSuggestion}
            onBack={() => setStep(1)}
          />
        ) : null}

        {step === 3 ? (
          <StepEdit 
            listing={listing} 
            updateField={updateField} 
            onBack={() => setStep(2)} 
            onContinue={handleContinueToPreview} 
            errors={errors}
            setErrors={setErrors}
          />
        ) : null}

        {step === 4 ? (
          <StepPublish
            listing={finalPreview}
            onPublish={publish}
            onSaveDraft={saveDraft}
            onRegenerate={generateSuggestion}
            onEdit={() => setStep(3)}
          />
        ) : null}
      </div>
    </Layout>
  );
}

function StepUpload({ image, selectedType, setSelectedType, onPhoto, onSample, onContinue, isAnalyzing }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
        <h2 className="text-lg font-bold text-white">Step 1: Upload Photo</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Use a clear picture of the item, service setup, business location, or task context.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {LISTING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`rounded-xl border px-4 py-3 text-sm font-bold capitalize ${selectedType === type ? "border-[#8B5CF6] bg-[#8B5CF6]/15 text-white" : "border-[#2A3342] text-[#9CA3AF]"}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-xl bg-[#8B5CF6] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
            Upload Photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => onPhoto(event.target.files?.[0])} />
          </label>
          <button type="button" onClick={onSample} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
            Use Sample Photo
          </button>
          <button 
            type="button" 
            onClick={onContinue} 
            disabled={isAnalyzing}
            className="rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Continue"}
          </button>
        </div>
      </div>
      <PreviewImage image={image} />
    </section>
  );
}

function StepSuggestions({ suggestion, onEdit, onRegenerate, onBack }) {
  if (!suggestion) return null;
  return (
    <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
      <h2 className="text-lg font-bold text-white">Step 2: AI Suggestions</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SummaryItem label="Business" value={suggestion.businessName} />
        <SummaryItem label="Title" value={suggestion.title} />
        <SummaryItem label="Type / Category" value={`${suggestion.type} / ${suggestion.category}`} />
        <SummaryItem label="Starting Price" value={`FCFA ${Number(suggestion.startingPrice).toLocaleString("fr-CM")}`} />
        <SummaryItem label="Suggested Range" value={suggestion.suggestedPriceRange} />
        <SummaryItem label="Location" value={suggestion.location} />
        <SummaryItem label="Availability" value={suggestion.availability} />
      </div>
      <p className="mt-5 text-sm leading-6 text-[#D1D5DB]">{suggestion.fullDescription}</p>
      <div className="mt-5 rounded-xl border border-[#2A3342] bg-[#0B0F19] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Confidence Notes</p>
        <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
          {suggestion.confidenceNotes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onEdit} className="rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black">Review & Edit</button>
        <button type="button" onClick={onRegenerate} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Regenerate Suggestions</button>
        <button type="button" onClick={onBack} className="rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Back</button>
      </div>
    </section>
  );
}

function StepEdit({ listing, updateField, onBack, onContinue, errors }) {
  return (
    <section className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
      <h2 className="text-lg font-bold text-white">Step 3: Review & Edit</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Input label="Business/listing name" value={listing.businessName} error={errors.businessName} onChange={(value) => updateField("businessName", value)} />
        <Input label="Title" value={listing.title} error={errors.title} onChange={(value) => updateField("title", value)} />
        <Select label="Type" value={listing.type} options={LISTING_TYPES} onChange={(value) => updateField("type", value)} />
        <Input label="Category" value={listing.category} error={errors.category} onChange={(value) => updateField("category", value)} />
        <Input label="Location" value={listing.location} error={errors.location} onChange={(value) => updateField("location", value)} />
        <Input label="Starting price FCFA" type="number" value={listing.startingPrice} error={errors.startingPrice} onChange={(value) => updateField("startingPrice", Number(value))} />
        <Input label="Availability" value={listing.availability} onChange={(value) => updateField("availability", value)} />
        <Input label="Service time" value={listing.serviceTime} onChange={(value) => updateField("serviceTime", value)} />
        <Input label="Contact phone" value={listing.contactPhone} error={errors.contactPhone} onChange={(value) => updateField("contactPhone", value)} />
        <Input label="Short description" value={listing.shortDescription} error={errors.shortDescription} onChange={(value) => updateField("shortDescription", value)} />
        <ArrayInput label="Tags" values={listing.tags} onChange={(values) => updateField("tags", values)} />
        <ArrayInput label="What is included" values={listing.included} onChange={(values) => updateField("included", values)} />
        <ArrayInput label="Customer requirements" values={listing.requirements} onChange={(values) => updateField("requirements", values)} />
      </div>
      <Textarea label="Description" value={listing.fullDescription} onChange={(value) => updateField("fullDescription", value)} />
      <PackageEditor packages={listing.packages} onChange={(packages) => updateField("packages", packages)} />
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onContinue} className="rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black">Continue</button>
        <button type="button" onClick={onBack} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Back</button>
      </div>
    </section>
  );
}

function StepPublish({ listing, onPublish, onSaveDraft, onRegenerate, onEdit }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="overflow-hidden rounded-2xl border border-[#2A3342] bg-[#111827]">
        <img src={listing.image || SAMPLE_IMAGE} alt={listing.title} className="h-64 w-full object-cover" />
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Badge label={listing.type} />
            <Badge label={listing.category} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#A78BFA]">{listing.businessName}</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{listing.title}</h2>
          </div>
          <p className="text-sm leading-6 text-[#D1D5DB]">{listing.fullDescription}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryItem label="Location" value={listing.location} />
            <SummaryItem label="Starting at" value={`FCFA ${Number(listing.startingPrice).toLocaleString("fr-CM")}`} />
            <SummaryItem label="Availability" value={listing.availability} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={onPublish} className="rounded-xl bg-[#8B5CF6] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Accept & Publish</button>
            <button type="button" onClick={onSaveDraft} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Save Draft</button>
            <button type="button" onClick={onRegenerate} className="rounded-xl border border-[#2A3342] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Regenerate Suggestions</button>
            <button type="button" onClick={onEdit} className="rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Back to Edit</button>
          </div>
        </div>
      </article>
      <aside className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Listing QR Code</p>
        <img src={listing.qrCodeUrl} alt="Listing QR code" className="mx-auto mt-5 h-44 w-44 rounded-xl bg-white p-3" />
        <p className="mt-4 text-sm text-[#9CA3AF]">Scan to open this listing after publishing.</p>
      </aside>
    </section>
  );
}

function StepPills({ step }) {
  return (
    <div className="flex flex-wrap gap-2">
      {["Upload", "AI", "Edit", "Publish"].map((label, index) => (
        <span key={label} className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${step === index + 1 ? "bg-[#8B5CF6] text-white" : "bg-[#1F2937] text-[#9CA3AF]"}`}>
          {index + 1}. {label}
        </span>
      ))}
    </div>
  );
}

function PreviewImage({ image }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2A3342] bg-[#111827]">
      {image ? <img src={image} alt="Listing preview" className="h-[360px] w-full object-cover" /> : <div className="flex h-[360px] items-center justify-center text-sm text-[#6B7280]">Photo preview</div>}
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#2A3342] bg-[#0B0F19] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-xl border bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60 ${error ? 'border-red-500/50' : 'border-[#2A3342]'}`} />
      {error && <p className="mt-1 text-[10px] font-bold text-red-400 uppercase">{error}</p>}
    </label>
  );
}

function Select({ label, value, options, onChange, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-xl border bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60 ${error ? 'border-red-500/50' : 'border-[#2A3342]'}`}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <p className="mt-1 text-[10px] font-bold text-red-400 uppercase">{error}</p>}
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="w-full resize-none rounded-xl border border-[#2A3342] bg-[#0B0F19] px-4 py-3 text-sm leading-6 text-white outline-none focus:border-[#8B5CF6]/60" />
    </label>
  );
}

function ArrayInput({ label, values, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</span>
      <textarea value={(values || []).join("\n")} onChange={(event) => onChange(splitLines(event.target.value))} rows={4} className="w-full resize-none rounded-xl border border-[#2A3342] bg-[#0B0F19] px-4 py-3 text-sm text-white outline-none focus:border-[#8B5CF6]/60" />
    </label>
  );
}

function PackageEditor({ packages, onChange }) {
  const updatePackage = (index, field, value) => {
    onChange(packages.map((pack, i) => (i === index ? { ...pack, [field]: field === "price" ? Number(value) : value } : pack)));
  };
  return (
    <div className="mt-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Package options</h3>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        {(packages || []).map((pack, index) => (
          <div key={`${pack.name}-${index}`} className="space-y-3 rounded-xl border border-[#2A3342] bg-[#0B0F19] p-4">
            <Input label="Name" value={pack.name} onChange={(value) => updatePackage(index, "name", value)} />
            <Input label="Price" type="number" value={pack.price} onChange={(value) => updatePackage(index, "price", value)} />
            <Input label="Delivery" value={pack.deliveryTime} onChange={(value) => updatePackage(index, "deliveryTime", value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ label }) {
  return <span className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">{label}</span>;
}

function splitLines(value) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}
