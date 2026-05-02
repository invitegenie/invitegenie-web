import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { MOCK_TEMPLATES } from "../services/mockData";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { useAuth } from "../auth/AuthContext";
import { useSearch } from "../contexts/SearchContext";

export default function MyTemplates() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const events = useEngineCollection(KEYS.EVENTS);

  const templates = useMemo(() => {
    const eventRows = events || [];
    const userEvents = eventRows.filter((event) => String(event.hostId || event.userId || "") === String(currentUser?.id || ""));
    const generated = userEvents.map((event) => ({
      id: `event-${event.id}`,
      name: event.templateName || `${event.title || "Event"} Invite`,
      category: event.category || "Custom",
      preview: event.image || event.coverImage || MOCK_TEMPLATES[0].preview,
      eventId: event.id,
      usage: Number(event.ticketsSold || 0),
      updatedAt: event.updatedAt || event.createdAt || event.date,
      source: "event",
    }));

    const saved = safeParse(localStorage.getItem("invitegenie_saved_templates"), []);
    return [...generated, ...saved];
  }, [events, currentUser]);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return templates.filter((template) => {
      return (
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    });
  }, [templates, searchQuery]);

  const handleUseTemplate = (template) => {
    localStorage.setItem("selectedTemplate", template.name);
    navigate(template.eventId ? `/events/${template.eventId}` : "/events/new");
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-28">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8B5CF6]">
              Design Library
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">My Templates</h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">Reusable invitation designs generated from your events and saved selections.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[260px]">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6B7280]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search templates..."
                className="w-full rounded-xl border border-[#2A3342] bg-[#111827] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate("/invitations/templates")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#7C3AED]"
            >
              <Icon name="add" className="text-[18px]" />
              Browse
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Metric label="Saved Designs" value={templates.length} icon="view_quilt" />
          <Metric label="Used on Events" value={templates.filter((template) => template.eventId).length} icon="event_available" />
          <Metric label="Top Category" value={topCategory(templates)} icon="category" />
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.length ? (
            filteredTemplates.map((template) => (
              <article key={template.id} className="overflow-hidden rounded-2xl border border-[#2A3342] bg-[#111827] shadow-lg">
                <button type="button" onClick={() => handleUseTemplate(template)} className="block aspect-video w-full overflow-hidden bg-[#0B0F19]">
                  <img src={template.preview} alt={template.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                </button>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">
                      {template.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                      {formatDate(template.updatedAt)}
                    </span>
                  </div>
                  <h2 className="truncate text-lg font-black text-white">{template.name}</h2>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{template.usage || 0} confirmed uses</p>
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#F3F4F6]"
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(template.eventId ? `/events/${template.eventId}` : "/templates")}
                      className="rounded-xl border border-[#2A3342] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#F9FAFB] transition hover:border-[#8B5CF6]/50"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[#2A3342] bg-[#111827] p-10 text-center">
              <Icon name="view_quilt" className="mx-auto text-4xl text-[#6B7280]" />
              <h2 className="mt-4 text-lg font-black text-white">No matching templates</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">Create an event or save a template to build your library.</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
      <Icon name={icon} className="mb-4 text-[#A78BFA]" />
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6B7280]">{label}</p>
      <p className="mt-1 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function topCategory(templates) {
  if (!templates.length) return "None";
  const counts = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function formatDate(value) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
