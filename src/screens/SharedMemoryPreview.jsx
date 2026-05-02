import { Link, useParams } from "react-router-dom";
import { getEventById } from "../services/mockData";
import { getEventMemories, getMemoryById } from "../services/socialService";

export default function SharedMemoryPreview() {
  const { eventId, memoryId } = useParams();
  const memory = memoryId ? getMemoryById(memoryId) : null;
  const event = eventId ? getEventById(eventId) : memory ? getEventById(memory.eventId) : null;
  const memories = (() => {
    if (!event) return memory ? [memory] : [];
    const eventMems = getEventMemories(event.id, "Most Liked");
    if (!memory) return eventMems.slice(0, 3);
    const others = eventMems.filter((m) => String(m.id) !== String(memory.id)).slice(0, 2);
    return [memory, ...others];
  })();

  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 py-8 text-white">
      <main className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Shared InviteGenie Preview</p>
          <h1 className="mt-3 text-3xl font-black text-white">{event?.title || memory?.eventName || "Shared Memory"}</h1>
          {event ? <p className="mt-2 text-sm text-slate-400">{event.location} - {formatDate(event.date)}</p> : null}
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {memories.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.caption} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-slate-300">{item.caption}</p>
                <p className="mt-4 text-xs font-bold text-violet-300">{item.likesCount} likes - {item.commentsCount} comments</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6 text-center">
          <h2 className="text-2xl font-black text-white">Create a free InviteGenie account to view more memories, comment, and join events.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Create Account</Link>
            <Link to="/login" className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Login</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
