import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getUserGallery } from "../services/socialService";

export default function Gallery() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const groups = getUserGallery(currentUser?.id);

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1300px] space-y-7 pb-24">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Personal Gallery</p>
            <h1 className="mt-3 text-3xl font-black text-white">My Gallery</h1>
            <p className="mt-2 text-sm text-slate-400">Memories grouped by events you attended.</p>
          </div>
          <button onClick={() => navigate("/feed")} className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-200 hover:bg-white/[0.08]">
            Open Feed
          </button>
        </header>

        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.event.id} className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">{group.event.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{group.event.location} - {formatDate(group.event.date)}</p>
                </div>
                <button onClick={() => navigate(`/events/${group.event.id}/memories`)} className="w-fit rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
                  View Event Memories
                </button>
              </div>

              {group.memories.length ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
                  {group.memories.map((memory) => (
                    <button key={memory.id} onClick={() => navigate(`/events/${group.event.id}/memories`)} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-left">
                      <div className="aspect-square overflow-hidden">
                        <img src={memory.image} alt={memory.caption} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 text-xs text-slate-300">{memory.caption}</p>
                        <p className="mt-2 text-[10px] font-bold text-violet-300">{memory.likesCount} likes</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
                  <p className="font-bold text-white">No memories from you yet</p>
                  <p className="mt-1 text-sm text-slate-500">You attended this event, so you can post one from the event memories page.</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {!groups.length ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-700">photo_library</span>
            <p className="mt-4 font-bold text-white">No attended events yet</p>
            <p className="mt-1 text-sm text-slate-500">Buy a ticket to start building your gallery.</p>
            <button onClick={() => navigate("/events")} className="mt-5 rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Browse Events</button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
