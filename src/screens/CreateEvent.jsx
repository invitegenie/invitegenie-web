import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";
import { generateEventDescription } from "../services/aiAssistantService";
import { TemplateCard } from "../components/RichCards";

const TEMPLATE_CARDS = [
  {
    label: "Neon Nights",
    category: "Cyberpunk",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTcM_myt0RvmGSyzUUMlyrYj2vfvM9JPbpwMoG3dpQaUqlYh5DUVXuBCVulTRzE8Kn_5Tn6QV-gxiEgJmWlZNIIXjAcv0BQP0Ux0NvJVQLvmarq-Wili3ZzomKXezpkZiXYS50H1auIRU-oBTV1xal7AIX9geEfklOTH8IKrUFpUKPwZ5adOTYCtoQjCxHT5QdBfA7T0ob_qNwNlLUYSulkGpCBIPd9BFuJeRI5Q3FtGf_6-98O-Ajc5FecgH9QY8OjVLcJjjOPDNk",
  },
  {
    label: "Royal Velvet",
    category: "Elegant",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLIdPPILLoXypmI1UVGc_D0DqGp4quhvFRG8tb892M6DhGZa7PDmyJesPthhdmxZICtrLYUiWH5eX_YFORFdrL217OVPZ0PwM_xrx_7WUDg18yEDqoBDrrIpBzI8zLhWDKJ42KsWT2XeY4WzoFW5dl64WO9JxLERtCpOLQzbhShxTYqdaOm9SEPt5Iq3YFj2CfNWGsikulyAeWKdFaKhSHA9ZpjuljlQWo2YNLWJdikae12K1D1kISWlllTYVjMf0EbCc_w8gsGtP4",
  },
  {
    label: "Futura Minimal",
    category: "Modern",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8VChMvjL05iKPATdVx5aLvxpTeOfS4Dy4PYhzcL7gob3DeUSRKgta281VwNvtL941RWkFtvN_kJiA_jt7p1xLD-qbjwvfsqwgy9qoZA_VptWgViiFgGBfLbRY986QTgGWcg-4jy1BgYM8sEIKCRK5-84ZxqCJXvUubMx_yQU-Rg5Doo4v1ssimYg-3PVR02s9CqQfNTfnYZY0Yz3qpkegvvUPunIZf7kTh9EKdvSzA0L0RGwLHZ9SNxmFpRlKRZe-gChXDHCrXpoT",
  },
];

function formatPreviewDate(dateValue) {
  if (!dateValue) return "Friday, Oct 27";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatPreviewTime(timeValue) {
  if (!timeValue) return "9:00 PM";
  const [hours, minutes] = timeValue.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [eventName, setEventName] = useState("Midnight Masquerade Gala");
  const [date, setDate] = useState("2024-10-27");
  const [time, setTime] = useState("21:00");
  const [location, setLocation] = useState("The Glass Observatory, Neo-Tokyo");
  const [price, setPrice] = useState(0); // New state for Price
  const [totalTickets, setTotalTickets] = useState(100); // New state for Total Tickets
  const [description, setDescription] = useState(
    "A neon-lit cyberpunk cocktail night with jazz lo-fi beats and a formal dress code."
  );
  
  // Get selected template from localStorage or use default
  const defaultTemplate = localStorage.getItem("selectedTemplate") || "Neon Nights";
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewDate = useMemo(() => formatPreviewDate(date), [date]);
  const previewTime = useMemo(() => formatPreviewTime(time), [time]);

  const handleSummonGenie = async () => {
    if (!description) return alert("Please provide a brief vibe in the description field first!");
    
    setIsGenerating(true);
    try {
      const aiText = await generateEventDescription(eventName, description);
      setDescription(aiText);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage or API
    const draft = {
      eventName,
      date,
      time,
      location,
      description,
      selectedTemplate,
    };
    localStorage.setItem("eventDraft", JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  const handleGenerateInvitations = () => {
    if (!currentUser) {
      alert("You must be logged in to create an event.");
      return;
    }

    // Validate form
    if (!eventName || !date || !time || !location) {
      alert("Please fill in all event details");
      return;
    }

    const template = TEMPLATE_CARDS.find((c) => c.label === selectedTemplate);

    // Save to localStorage via coreEngine
    const newEvent = Engine.createEvent({
      title: eventName,
      date,
      time,
      location,
      description,
      image: template?.src,
      category: template?.category || "General",
      hostId: currentUser.id,
      vendorName: currentUser.name,
      price: price,
      totalTickets: totalTickets,
      status: 'ACTIVE',
      ticketsSold: 0,
      availableTickets: totalTickets
    });

    alert(`Event "${newEvent.title}" created successfully!`);
    // Navigate to events page
    navigate("/events");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/events");
    }
  };

  const handleViewAllTemplates = () => {
    // Could open a modal or navigate to templates page
    alert("View All Templates - Feature coming soon!");
  };

  return (
      <div className="max-w-5xl mx-auto px-6 pb-32">
        <div className="mb-12">
          <h2 className="font-h1 text-h1 text-on-surface mb-2">Create New Event</h2>
          <p className="text-on-surface-variant font-body-lg">
            Conjure a magical invitation in seconds with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-10">
            <section className="bg-surface-container-low backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl glass-rim-light-top">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h3 className="font-h3 text-h3 text-primary-fixed-dim">Event Essence</h3>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="block font-label-caps text-on-surface-variant mb-2">Title</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                    className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Midnight Masquerade Gala"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-on-surface-variant mb-2">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-caps text-on-surface-variant mb-2">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2">Location</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-sm">location_on</span>
                    <input
                      type="text"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="w-full bg-surface-container-highest border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="The Glass Observatory, Neo-Tokyo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-on-surface-variant mb-2">Price (FCFA)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(event) => setPrice(parseInt(event.target.value) || 0)}
                      className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-on-surface-variant mb-2">Total Tickets</label>
                    <input
                      type="number"
                      value={totalTickets}
                      onChange={(event) => setTotalTickets(parseInt(event.target.value) || 0)}
                      className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="100"
                      min="0"
                    />
                  </div>
                </div>


                <div>
                  <label className="block font-label-caps text-on-surface-variant mb-2">Make a Wish (AI Description)</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full bg-surface-container-highest border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Describe the vibe... 'A neon-lit cyberpunk cocktail night with jazz lo-fi beats and a formal dress code.'"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSummonGenie}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-button py-4 rounded-xl flex items-center justify-center gap-2 genie-glow hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    {isGenerating ? "hourglass_top" : "magic_button"}
                  </span>
                  {isGenerating ? "Generating..." : "Summon Genie Content"}
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-h3 text-h3">Visual Style</h3>
                <button
                  onClick={handleViewAllTemplates}
                  className="text-primary text-sm font-semibold hover:text-primary-fixed-dim transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TEMPLATE_CARDS.map((card) => {
                  const isSelected = card.label === selectedTemplate;
                  return (
                    <div key={card.label} className={isSelected ? 'ring-4 ring-purple-500 rounded-[2rem]' : ''}>
                      <TemplateCard title={card.label} category={card.category} image={card.src} onClick={() => setSelectedTemplate(card.label)} />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">visibility</span>
              <p className="font-label-caps text-on-surface-variant">Live Invitation Preview</p>
            </div>

            <div className="bg-surface-container-high rounded-[32px] p-6 border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 blur-[100px]" />
              <div className="relative z-10 space-y-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                  <div className="relative h-full">
                    <img
                      className="w-full h-full object-cover"
                      src={TEMPLATE_CARDS.find((card) => card.label === selectedTemplate)?.src}
                      alt={selectedTemplate}
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8">
                      <div className="h-1 w-16 bg-primary mb-6 rounded-full" />
                      <h4 className="font-h2 text-h2 text-white mb-4">{eventName || "Event Title"}</h4>
                      <p className="font-label-caps text-tertiary-fixed mb-8">
                        {previewDate} • {previewTime}
                      </p>
                      <p className="text-white/80 italic">"{description || "Event description will appear here..."}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <p className="font-label-caps text-white/40 text-[10px] mb-1">SCAN TO RSVP</p>
                    <p className="font-body-md text-white">{location || "Location"}</p>
                    {price > 0 && (
                      <p className="text-xs text-white/60">Price: FCFA {price.toLocaleString()}</p>
                    )}
                    
                    <p className="text-xs text-white/60">Level 42, Tokyo Skytree</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <img
                      alt="Event QR Code"
                      className="w-12 h-12"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZMzNRiQkumBq418b7MnWgAh9Xe8lWyJhDxYrzQ2G4otEYZ3XxjZ2--zsBqC3rEyXAYPksRd9KOlarnrHvQOXy4B7S21o8r7HyFepSzgJVpuaTwgldQhQM3-gldLZ4oDalBYohOItvGDQu-fjg5P1zGRmNsMKGwoYYlMw9f66pXBgrj1_Om5luduyh6n2Niah6kJBPpIn_uGzTGC9A_o0EvLRXbXHtiFZctM3taBShzv14H6h7IDw2QiBOWlTkoHcbETBg-__wurkj"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-2xl border-t border-white/10 h-24 px-8 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] glass-rim-light-top">
          <button
            onClick={handleCancel}
            className="font-button text-on-surface-variant hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">close</span>
            Cancel
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              className="bg-surface-container-highest text-on-surface font-button px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleGenerateInvitations}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-on-secondary font-button px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Generate Invitations
            </button>
          </div>
        </footer>

        <div className="fixed bottom-28 right-8 z-[60] group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
          <button className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-emerald-400 rounded-full text-white shadow-2xl flex items-center justify-center genie-glow animate-pulse active:scale-95 duration-150">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </button>
        </div>
      </div>
  );
}