import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvents } from "../services/mockData";
import { getFeedMemoryGroups } from "../services/socialService";

const tabs = ["Recent", "Trending", "Weddings", "Concerts", "Corporate", "Cultural"];

export default function Feed() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Recent");
  const [query, setQuery] = useState("");
  const sortMode = activeTab === "Trending" ? "Trending" : "Recent";

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getFeedMemoryGroups(sortMode, activeTab).filter((group) => {
      if (!q) return true;
      return [group.eventTitle, group.location, group.category].join(" ").toLowerCase().includes(q);
    });
  }, [activeTab, query, sortMode]);

  const trending = getFeedMemoryGroups("Trending").slice(0, 4);
  const suggested = getEvents().filter((event) => !trending.some((group) => String(group.eventId) === String(event.id))).slice(0, 4);
  const contributors = useMemo(() => getTopContributors(getFeedMemoryGroups("Trending")), []);

  const shareEvent = async (eventId, title) => {
    const url = `${window.location.origin}/shared/event/${eventId}`;
    if (navigator.share) await navigator.share({ title, text: `View memories from ${title} on InviteGenie`, url });
    else await navigator.clipboard.writeText(url);
  };

  const saveEvent = (eventId) => {
    const saved = JSON.parse(localStorage.getItem("demo_saved_events") || "[]");
    if (!saved.includes(eventId)) localStorage.setItem("demo_saved_events", JSON.stringify([eventId, ...saved]));
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1500px] space-y-5 pb-24">
        <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#0B0F19]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Event Memories</p>
              <h1 className="mt-1 text-2xl font-black text-white">Feed</h1>
            </div>
            <div className="relative w-full lg:max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events, city, category..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-violet-400/50"
              />
            </div>
          </div>
          <div className="mx-auto mt-4 flex max-w-[1500px] gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                  activeTab === tab ? "bg-white text-slate-950" : "border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-5">
            {groups.map((group) => (
              <article key={group.eventId} className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-xl">
                <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
                  <div className="relative min-h-[260px] overflow-hidden">
                    <img src={group.coverImage} alt={group.eventTitle} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur w-fit">
                        {group.category}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-slate-200">{formatDate(group.date)}</p>
                    </div>
                  </div>

                  <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-black tracking-tight text-white">{group.eventTitle}</h2>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                            <span className="material-symbols-outlined text-base text-violet-300">location_on</span>
                            {group.location}
                          </p>
                        </div>
                        <div className="flex -space-x-2">
                          {group.topContributorAvatars.map((avatar, index) => (
                            <div key={`${avatar}-${index}`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111827] bg-gradient-to-br from-violet-500 to-emerald-400 text-xs font-black text-white">
                              {avatar}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <Stat label="Memories" value={group.totalMemories} />
                        <Stat label="Likes" value={group.totalLikes} />
                        <Stat label="Last Post" value={relativeTime(group.lastPostedAt)} />
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button onClick={() => navigate(`/events/${group.eventId}/memories`)} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-violet-500">
                          View Memories
                        </button>
                        <button onClick={() => shareEvent(group.eventId, group.eventTitle)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-200 hover:bg-white/[0.08]">
                          Share
                        </button>
                        <button onClick={() => saveEvent(group.eventId)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-200 hover:bg-white/[0.08]">
                          Save
                        </button>
                      </div>
                    </div>

                    <button onClick={() => navigate(`/events/${group.eventId}/memories`)} className="group relative min-h-[260px] overflow-hidden border-t border-white/10 text-left md:border-l md:border-t-0">
                      <img src={group.frontImage} alt="Top memory" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">Front memory</p>
                        <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{group.frontMemory?.caption}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {!groups.length ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-700">photo_library</span>
                <p className="mt-4 font-bold text-white">No event memory groups found</p>
                <p className="mt-1 text-sm text-slate-500">Try a different tab or search term.</p>
              </div>
            ) : null}
          </main>

          <aside className="space-y-5">
            <SidebarPanel title="Trending Events">
              {trending.map((group) => (
                <MiniEvent key={group.eventId} title={group.eventTitle} image={group.frontImage} meta={`${group.totalLikes} likes`} onClick={() => navigate(`/events/${group.eventId}/memories`)} />
              ))}
            </SidebarPanel>
            <SidebarPanel title="Suggested Events">
              {suggested.map((event) => (
                <MiniEvent key={event.id} title={event.title} image={event.image} meta={event.location} onClick={() => navigate(`/events/${event.id}`)} />
              ))}
            </SidebarPanel>
            <SidebarPanel title="Top Contributors">
              {contributors.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 text-xs font-black text-white">{user.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.count} memories</p>
                  </div>
                </div>
              ))}
            </SidebarPanel>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-lg font-black text-white">{value}</p>
    </div>
  );
}

function SidebarPanel({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-4 shadow-lg">
      <h3 className="mb-4 text-sm font-black text-white">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function MiniEvent({ title, image, meta, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-left transition hover:border-violet-400/40">
      <img src={image} alt={title} className="h-14 w-14 rounded-xl object-cover" />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">{title}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{meta}</p>
      </div>
    </button>
  );
}

function getTopContributors(groups) {
  const counts = new Map();
  groups.forEach((group) => {
    group.contributors.forEach((user) => {
      const current = counts.get(user.id) || { id: user.id, name: user.full_name, avatar: user.avatar, count: 0 };
      counts.set(user.id, { ...current, count: current.count + group.memories.filter((memory) => String(memory.userId) === String(user.id)).length });
    });
  });
  return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 5);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(value) {
  const diff = Math.max(Date.now() - Number(value || Date.now()), 0);
  const hours = Math.max(Math.floor(diff / 3600000), 1);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
