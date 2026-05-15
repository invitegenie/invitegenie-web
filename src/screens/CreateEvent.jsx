﻿﻿﻿import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PlanLimitModal from "../components/PlanLimitModal";
import SmartVendorRecommendations from "../components/SmartVendorRecommendations";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";
import { generateEventDraft } from "../services/aiAssistantService";
import { getEvents } from "../services/mockData";
import {
  generateEventWebsiteExperience,
  saveEventWebsiteExperience,
} from "../services/eventWebsiteGeneratorService";
import { checkEventPlanLimit } from "../services/accountCapabilities";
import {
  buildVendorRecommendationInputFromEvent,
  recommendVendors,
} from "../services/vendorRecommendationEngine";
import { generateInviteImage } from "../lib/inviteImageGenerator";

const CATEGORIES = [
  "Corporate",
  "Wedding",
  "Gala",
  "Music",
  "Conference",
  "Fashion",
  "Cultural",
  "Private Event",
  "Fundraiser",
  "Networking",
];

const DEFAULT_FORM = {
  title: "",
  category: "Corporate",
  status: "DRAFT",
  visibility: "public",
  accessMode: "instant_ticket",
  date: "",
  startTime: "18:00",
  endTime: "22:00",
  venueName: "",
  city: "",
  country: "Cameroon",
  address: "",
  shortSummary: "",
  description: "",
  price: 0,
  vipPrice: "",
  earlyBirdPrice: "",
  totalTickets: 100,
  image: "",
  aiArtDirection: null,
  eventWebsiteExperience: null,
  recommendations: [],
  termsAccepted: false,
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { currentUser, profile } = useAuth();

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [eventIdea, setEventIdea] = useState("");
  const [pendingDraft, setPendingDraft] = useState(null);
  const [pendingWebsite, setPendingWebsite] = useState(null);
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [isAiFilling, setIsAiFilling] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [autoGenerateImage, setAutoGenerateImage] = useState(true);
  const [aiStatus, setAiStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [planLimit, setPlanLimit] = useState(null);

  const usageStats = useMemo(() => {
    return checkEventPlanLimit({
      user: profile || currentUser,
      existingEvents: getEvents(),
      guestCount: 0, // Evaluating the active event count specifically
    });
  }, [profile, currentUser]);

  const eventLocation = useMemo(() => {
    return [formData.venueName, formData.city, formData.country]
      .filter(Boolean)
      .join(", ");
  }, [formData.venueName, formData.city, formData.country]);

  const formattedPrice = useMemo(() => {
    return Number(formData.price || 0).toLocaleString("fr-CM");
  }, [formData.price]);

  useEffect(() => {
    if (!autoGenerateImage || !formData.title.trim()) return undefined;

    const timeoutId = window.setTimeout(async () => {
      setIsGeneratingImage(true);
      setAiStatus("Updating event cover image preview...");

      const nextImage = await generateInviteImage({
        title: formData.title,
        category: formData.category,
        date: formData.date,
        time: formData.startTime,
        location: eventLocation,
        description: formData.description,
        price: formData.price,
        totalTickets: formData.totalTickets,
        aiArtDirection: formData.aiArtDirection,
        artSeed: `${formData.title}-${formData.category}-${formData.date}-${formData.startTime}-${eventLocation}`,
      });

      setFormData((prev) => ({ ...prev, image: nextImage }));
      setIsGeneratingImage(false);
      setAiStatus("Cover image preview updated.");
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [
    autoGenerateImage,
    eventLocation,
    formData.aiArtDirection,
    formData.category,
    formData.date,
    formData.description,
    formData.price,
    formData.startTime,
    formData.title,
    formData.totalTickets,
  ]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function getBudgetLabel(source) {
    const standard = Number(source.price || 0);
    const vip = Number(source.vipPrice || 0);
    const capacity = Number(source.totalTickets || 0);
    const highestTicket = Math.max(standard, vip);
    if (highestTicket >= 75000 || capacity >= 300) return "Luxury";
    if (highestTicket >= 25000 || capacity >= 120) return "Premium";
    return "Elegant";
  }

  function buildWebsiteInput(source = formData, prompt = eventIdea) {
    return {
      event_type: source.category,
      user_prompt: prompt || source.description || source.shortSummary || source.title,
      location: [source.venueName, source.city, source.country].filter(Boolean).join(", "),
      guest_count: source.totalTickets,
      budget: getBudgetLabel(source),
      theme_preference: source.aiArtDirection?.style || source.category || "Modern African luxury",
      primary_colors: source.primaryColors || "",
      event_date: source.date,
      host_names: currentUser?.name || currentUser?.full_name || "InviteGenie Hosts",
    };
  }

  function buildRecommendationInput(source = formData) {
    return buildVendorRecommendationInputFromEvent({
      ...source,
      eventType: source.category,
      location: [source.venueName, source.city, source.country].filter(Boolean).join(", "),
      guestCount: source.totalTickets,
      budget: getBudgetLabel(source),
      theme: source.aiArtDirection?.style || source.category || "Modern African luxury",
      style: [source.shortSummary, source.description, eventIdea].filter(Boolean).join(" "),
    });
  }

  function generateSmartRecommendations(source = formData) {
    return recommendVendors(buildRecommendationInput(source), { limit: 8 });
  }

  function handleGenerateRecommendations() {
    const recommendations = generateSmartRecommendations(formData);
    setFormData((prev) => ({ ...prev, recommendations }));
    setAiStatus("Smart vendor recommendations generated for this event.");
  }

  function handleGenerateWebsite(source = formData) {
    const website = generateEventWebsiteExperience(buildWebsiteInput(source));
    setFormData((prev) => ({ ...prev, eventWebsiteExperience: website }));
    setPendingWebsite(null);
    setAiStatus("Premium event website experience generated and attached to this event.");
    return website;
  }

  async function handleGenerateDraft() {
    if (!eventIdea.trim()) {
      setAiStatus("Please describe the event you want to create.");
      return;
    }

    try {
      setIsAiFilling(true);
      setAiStatus("AI is preparing a professional event draft...");

      const draft = await generateEventDraft(eventIdea, formData);
      const eventDate = getDateFromOffset(draft.dateOffsetDays);
      const nextDraft = {
        title: draft.title || "Professional Event Experience",
        category: CATEGORIES.includes(draft.category) ? draft.category : "Corporate",
        date: eventDate,
        startTime: draft.time || "18:00",
        endTime: draft.endTime || "22:00",
        venueName: draft.venueName || draft.location || "Premium Event Venue",
        city: draft.city || "Douala",
        country: draft.country || "Cameroon",
        address: draft.address || "",
        shortSummary:
          draft.shortSummary ||
          "A professionally curated event experience designed for a high-quality audience.",
        description:
          draft.description ||
          "A structured event experience designed for guests, hosts, sponsors and partners. The programme includes guest reception, coordinated access, premium hospitality and a professional event flow.",
        price: Number(draft.price ?? 25000),
        totalTickets: Number(draft.totalTickets ?? 150),
        aiArtDirection: draft.artDirection,
      };
      const website = generateEventWebsiteExperience(buildWebsiteInput(nextDraft, eventIdea));
      const recommendations = generateSmartRecommendations(nextDraft);

      setPendingDraft(nextDraft);
      setPendingWebsite(website);
      setPendingRecommendations(recommendations);

      setAiStatus("Professional event draft, premium website, and smart vendor matches prepared. Review before applying.");
    } catch (error) {
      console.error("AI draft failed:", error);
      setAiStatus("AI draft could not finish. You can still complete the form manually.");
    } finally {
      setIsAiFilling(false);
    }
  }

  async function applyDraft() {
    if (!pendingDraft) return;

    setIsGeneratingImage(true);
    setAiStatus("Applying draft and preparing event cover image...");

    const nextImage = await generateInviteImage({
      ...formData,
      ...pendingDraft,
      time: pendingDraft.startTime,
      location: [pendingDraft.venueName, pendingDraft.city, pendingDraft.country]
        .filter(Boolean)
        .join(", "),
      artSeed: `${pendingDraft.title}-${Date.now()}`,
    });

    setFormData((prev) => ({
      ...prev,
      ...pendingDraft,
      image: nextImage,
      eventWebsiteExperience: pendingWebsite || generateEventWebsiteExperience(buildWebsiteInput(pendingDraft, eventIdea)),
      recommendations: pendingRecommendations.length ? pendingRecommendations : generateSmartRecommendations(pendingDraft),
    }));

    setPendingDraft(null);
    setPendingWebsite(null);
    setPendingRecommendations([]);
    setAutoGenerateImage(true);
    setErrors({});
    setIsGeneratingImage(false);
    setAiStatus("Draft applied. Review and publish when ready.");
  }

  async function handleRegenerateImage() {
    setAutoGenerateImage(true);
    setIsGeneratingImage(true);
    setAiStatus("Generating a new event cover image...");

    const nextImage = await generateInviteImage({
      ...formData,
      time: formData.startTime,
      location: eventLocation,
      artSeed: `${formData.title}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });

    setFormData((prev) => ({ ...prev, image: nextImage }));
    setIsGeneratingImage(false);
    setAiStatus("New cover image generated.");
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Event title is required.";
    if (!formData.date) nextErrors.date = "Event date is required.";
    if (!formData.startTime) nextErrors.startTime = "Start time is required.";
    if (!formData.venueName.trim()) nextErrors.venueName = "Venue name is required.";
    if (!formData.city.trim()) nextErrors.city = "City is required.";
    if (formData.totalTickets < 1) nextErrors.totalTickets = "Must have at least 1 ticket.";
    if (formData.price < 0) nextErrors.price = "Price cannot be negative.";

    if (formData.status === "ACTIVE" && formData.description.trim().length < 30) {
      nextErrors.description = "Published events need a fuller description.";
    }

    if (formData.status === "ACTIVE" && !formData.termsAccepted) {
      nextErrors.termsAccepted = "Please confirm the event details before publishing.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const actor = profile || currentUser || {};
      const planCheck = checkEventPlanLimit({
        user: actor,
        existingEvents: getEvents(),
        guestCount: formData.totalTickets,
      });
      if (!planCheck.allowed) {
        setPlanLimit(planCheck);
        setIsSubmitting(false);
        return;
      }

      const finalInviteImage =
        formData.image ||
        (await generateInviteImage({
          ...formData,
          time: formData.startTime,
          location: eventLocation,
          artSeed: `${formData.title}-${Date.now()}`,
        }));

      const eventWebsiteExperience =
        formData.eventWebsiteExperience || generateEventWebsiteExperience(buildWebsiteInput(formData));
      const recommendations = formData.recommendations?.length
        ? formData.recommendations
        : generateSmartRecommendations(formData);

      const newEvent = await Engine.createEvent({
        ...formData,
        time: formData.startTime,
        location: eventLocation,
        image: finalInviteImage,
        coverImage: finalInviteImage,
        inviteImage: finalInviteImage,
        aiGeneratedInvite: Boolean(formData.aiArtDirection),
        website: eventWebsiteExperience,
        eventWebsiteExperience,
        aiGeneratedWebsite: true,
        recommendations,
        eventPlanType: (profile || currentUser)?.accountType || "FREE",
        guestLimit: formData.totalTickets,
        ownerId: currentUser?.id || "user-pro-001",
        assignedCheckInStaff: [],
        staffingRequests: [],
        hostId: currentUser?.id || "user-pro-001",
        hostName: currentUser?.name || "InviteGenie Pro",
        vendorName: currentUser?.name || "InviteGenie Pro",
        ticketsSold: 0,
        availableTickets: formData.totalTickets,
      });

      saveEventWebsiteExperience(newEvent.id, eventWebsiteExperience);

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + "/events/" + newEvent.id)}`;
      if (newEvent.qrCodeUrl !== qrCodeUrl) {
        await Engine.updateEvent?.(newEvent.id, { qrCodeUrl });
        newEvent.qrCodeUrl = qrCodeUrl;
      }

      await Engine.createInvitation?.({
        eventId: newEvent.id,
        userId: currentUser?.id || "user-pro-001",
        title: newEvent.title,
        image: finalInviteImage,
        status: "published",
        aiGenerated: Boolean(formData.aiArtDirection),
      });

      navigate("/events", { state: { createdEventId: newEvent.id } });
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <PlanLimitModal open={Boolean(planLimit)} limit={planLimit} onClose={() => setPlanLimit(null)} />
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <header className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-gray-500">Events / Create</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-100">Create a new event</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Build a polished event listing with professional details, ticketing, venue
              information and a live preview before publishing.
            </p>

                {usageStats && usageStats.limit !== Infinity && (
                  <div className="mt-6 max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>Plan Usage (Active Events)</span>
                      <span className={usageStats.current >= usageStats.limit ? "text-rose-400" : "text-amber-300"}>
                        {usageStats.current} / {usageStats.limit}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/50 border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${usageStats.current >= usageStats.limit ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-gradient-to-r from-amber-400 to-orange-500"}`} 
                        style={{ width: `${Math.min((usageStats.current / usageStats.limit) * 100, 100)}%` }} 
                      />
                    </div>
                    {usageStats.current >= usageStats.limit && (
                      <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-rose-400">Limit Reached. Please upgrade your plan.</p>
                    )}
                  </div>
                )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/ai-planner")}
              className="rounded-xl border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-100 hover:bg-violet-400/20"
            >
              Plan with AI
            </button>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/[0.04]"
            >
              Back to Events
            </button>
          </div>
        </header>

        <section className="rounded-2xl border border-violet-400/10 bg-white/[0.035] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-violet-200">
                AI Event Assistant
              </label>
              <p className="mt-1 text-sm text-gray-400">
                Describe your event idea and InviteGenie will prepare a professional draft.
              </p>

              <textarea
                value={eventIdea}
                onChange={(event) => setEventIdea(event.target.value)}
                placeholder="Example: A premium corporate networking dinner in Douala for 150 executives, with keynote speakers, cocktail reception, VIP seating and sponsor branding."
                rows="3"
                className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-violet-400/50"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={isAiFilling}
              className="rounded-2xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAiFilling ? "Preparing..." : "Generate Event Draft"}
            </button>
          </div>

          {aiStatus ? <p className="mt-3 text-xs font-medium text-violet-200">{aiStatus}</p> : null}

          {pendingDraft ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-100">Suggested Event Draft</h2>
                  <p className="text-xs text-gray-500">Review before applying to your form.</p>
                </div>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                  AI Suggested
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DraftItem label="Title" value={pendingDraft.title} />
                <DraftItem label="Category" value={pendingDraft.category} />
                <DraftItem label="Venue" value={`${pendingDraft.venueName}, ${pendingDraft.city}`} />
                <DraftItem label="Date" value={pendingDraft.date} />
                <DraftItem label="Ticket Price" value={`FCFA ${pendingDraft.price.toLocaleString("fr-CM")}`} />
                <DraftItem label="Capacity" value={`${pendingDraft.totalTickets} tickets`} />
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-300">{pendingDraft.description}</p>

              {pendingWebsite ? <WebsiteDraftSummary website={pendingWebsite} /> : null}
              {pendingRecommendations.length ? (
                <SmartVendorRecommendations
                  event={buildRecommendationInput(pendingDraft)}
                  recommendations={pendingRecommendations}
                  title="Suggested Vendor Matches"
                  subtitle="AI-ranked partners for this draft"
                  limit={3}
                  compact
                  showActions={false}
                  className="mt-4"
                />
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={applyDraft}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                >
                  Apply Draft
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/[0.04]"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingDraft(null);
                    setPendingWebsite(null);
                    setPendingRecommendations([]);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <FormSection title="Event Overview">
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g. Douala Executive Networking Dinner"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={CATEGORIES}
                />

                <Select
                  label="Publishing Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={["DRAFT", "ACTIVE"]}
                />
              </div>

              <Input
                label="Short Summary"
                name="shortSummary"
                value={formData.shortSummary}
                onChange={handleChange}
                placeholder="One sentence that clearly explains the event."
              />

              <Textarea
                label="Full Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Describe the event programme, audience, value, experience and guest expectations."
              />
            </FormSection>

            <FormSection title="Schedule & Venue">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Event Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                />
                <Input
                  label="Start Time"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  error={errors.startTime}
                />
                <Input
                  label="End Time"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Venue Name"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                error={errors.venueName}
                placeholder="e.g. Akwa Palace Hotel"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Douala"
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, district or landmark"
              />
            </FormSection>

            <FormSection title="Privacy & Visibility">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">Event Visibility</span>
                  <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-100 outline-none focus:border-violet-400/50">
                    <option value="public" className="bg-slate-950">Public (Visible to everyone)</option>
                    <option value="vip_request" className="bg-slate-950">VIP Request (Needs host approval)</option>
                    <option value="invite_only" className="bg-slate-950">Invite Only (Visible to invited)</option>
                    <option value="private_hidden" className="bg-slate-950">Hidden Private (Link access only)</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">Access Mode</span>
                  <select name="accessMode" value={formData.accessMode} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-100 outline-none focus:border-violet-400/50">
                    <option value="instant_ticket" className="bg-slate-950">Instant Ticket Purchase</option>
                    <option value="request_approval" className="bg-slate-950">Request Approval First</option>
                    <option value="invite_required" className="bg-slate-950">Invitation Code Required</option>
                  </select>
                </label>
              </div>
            </FormSection>

            <FormSection title="Ticketing">
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Standard Price (FCFA)"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  min="0"
                />
                <Input
                  label="VIP Price Optional"
                  type="number"
                  name="vipPrice"
                  value={formData.vipPrice}
                  onChange={handleChange}
                  min="0"
                />
                <Input
                  label="Early Bird Optional"
                  type="number"
                  name="earlyBirdPrice"
                  value={formData.earlyBirdPrice}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <Input
                label="Total Tickets"
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                error={errors.totalTickets}
                min="1"
              />
            </FormSection>

            <FormSection title="Branding & Image">
              <Input
                label="Event Cover Image URL"
                name="image"
                value={formData.image}
                onChange={(event) => {
                  setAutoGenerateImage(false);
                  handleChange(event);
                }}
                placeholder="Generated automatically or paste a custom image URL"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRegenerateImage}
                  disabled={isGeneratingImage}
                  className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-200 hover:bg-violet-500/20 disabled:opacity-60"
                >
                  {isGeneratingImage ? "Generating..." : "Regenerate Cover"}
                </button>

                <label className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <input
                    type="checkbox"
                    checked={autoGenerateImage}
                    onChange={(event) => setAutoGenerateImage(event.target.checked)}
                    className="h-4 w-4 accent-violet-500"
                  />
                  Live image preview
                </label>
              </div>
            </FormSection>

            <FormSection title="Premium Website Experience">
              <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
                <p className="text-sm font-semibold text-amber-100">
                  InviteGenie AI can generate the event website concept, design system, RSVP flow,
                  vendor plan, seating logic, social copy, and premium add-ons.
                </p>
                <p className="mt-2 text-xs leading-5 text-amber-100/70">
                  This is saved with the event in demo mode and powers the public website preview.
                </p>
              </div>

              {formData.eventWebsiteExperience ? (
                <WebsiteDraftSummary website={formData.eventWebsiteExperience} compact />
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleGenerateWebsite()}
                  className="rounded-xl bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-amber-200"
                >
                  {formData.eventWebsiteExperience ? "Regenerate Website" : "Generate Website"}
                </button>
                {formData.eventWebsiteExperience ? (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, eventWebsiteExperience: null }))}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:bg-white/[0.04]"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </FormSection>

            <FormSection title="Smart Vendor Recommendations">
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-4">
                <p className="text-sm font-semibold text-emerald-100">
                  InviteGenie AI ranks vendors by event type, city, budget fit, guest capacity,
                  availability, rating, and style compatibility.
                </p>
                <p className="mt-2 text-xs leading-5 text-emerald-100/70">
                  These recommendations are saved with the event and power the event details and public website.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateRecommendations}
                className="rounded-xl bg-emerald-300 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-emerald-200"
              >
                {formData.recommendations?.length ? "Regenerate Vendors" : "Generate Vendor Matches"}
              </button>

              {formData.recommendations?.length ? (
                <SmartVendorRecommendations
                  event={buildRecommendationInput(formData)}
                  recommendations={formData.recommendations}
                  title="Recommended Vendors"
                  subtitle="Preview of AI-ranked marketplace partners"
                  limit={4}
                  compact
                  showActions={false}
                />
              ) : null}
            </FormSection>

            <FormSection title="Publishing">
              <label className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-violet-500"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-200">
                    I confirm these event details are accurate.
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Review the event title, venue, date, ticketing and publishing status before
                    creating the listing.
                  </span>
                </span>
              </label>
              {errors.termsAccepted ? (
                <p className="text-xs text-red-400">{errors.termsAccepted}</p>
              ) : null}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/events")}
                  className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </button>
              </div>
            </FormSection>
          </div>

          <aside className="space-y-5">
            <section className="sticky top-6 rounded-2xl border border-white/5 bg-white/[0.035] p-4">
              <h2 className="text-base font-semibold text-gray-100">Live Event Preview</h2>
              <p className="mt-1 text-xs text-gray-500">This is how your event will appear.</p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                <div className="h-56 bg-slate-900">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Event cover"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-600">
                      Cover image preview
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                      {formData.category}
                    </span>
                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
                      {formData.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-100">
                    {formData.title || "Event title"}
                  </h3>

                  <div className="space-y-2 text-xs text-gray-400">
                    <p>{formData.date || "Event date"} Â· {formData.startTime} â€“ {formData.endTime}</p>
                    <p>{eventLocation || "Venue and city"}</p>
                    <p>FCFA {formattedPrice} Â· {formData.totalTickets} tickets</p>
                  </div>

                  <p className="line-clamp-4 text-sm leading-6 text-gray-400">
                    {formData.shortSummary ||
                      formData.description ||
                      "Your event description will appear here once added."}
                  </p>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                  >
                    Preview Listing
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </Layout>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.035] p-5">
      <h2 className="text-base font-semibold text-gray-100">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-violet-400/50 ${
          error ? "border-red-500/50" : "border-white/10"
        } ${className}`}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <select
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-100 outline-none focus:border-violet-400/50"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <textarea
        {...props}
        rows={5}
        className={`w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3 text-sm leading-6 text-gray-100 outline-none placeholder:text-gray-600 focus:border-violet-400/50 ${
          error ? "border-red-500/50" : "border-white/10"
        }`}
      />
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

function DraftItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-200">{value}</p>
    </div>
  );
}

function WebsiteDraftSummary({ website, compact = false }) {
  if (!website) return null;
  const branding = website.eventBranding || {};
  const design = website.designSystem || {};
  const features = website.premiumFeatures || [];

  return (
    <div className={`mt-4 rounded-2xl border border-amber-400/20 bg-slate-950/60 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">Premium Website Ready</p>
          <h3 className="mt-2 text-lg font-black text-white">{branding.eventTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{branding.tagline}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {[design.primaryColor, design.secondaryColor, design.accentColor].filter(Boolean).map((color) => (
            <span key={color} className="h-8 w-8 rounded-full border border-white/20" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>
      {!compact ? (
        <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
          <p className="text-xs text-slate-400"><span className="font-black text-white">{(website.timeline || []).length}</span> timeline sections</p>
          <p className="text-xs text-slate-400"><span className="font-black text-white">{(website.vendors || []).length}</span> vendor categories</p>
          <p className="text-xs text-slate-400"><span className="font-black text-white">{features.length}</span> premium add-ons</p>
        </div>
      ) : null}
    </div>
  );
}

function getDateFromOffset(offsetDays = 21) {
  const date = new Date();
  date.setDate(date.getDate() + Number(offsetDays || 21));
  return date.toISOString().slice(0, 10);
}
