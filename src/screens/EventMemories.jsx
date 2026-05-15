import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getEventById } from "../services/mockData";
import {
  canPostMemory,
  commentOnMemory,
  createMemory,
  getEventMemories,
  likeMemory,
  shareMemory,
  unlikeMemory,
} from "../services/socialService";

export default function EventMemories() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Recent");
  const [postOpen, setPostOpen] = useState(false);
  const [commentingId, setCommentingId] = useState(null);
  const [, setRefresh] = useState(0);
  const [toast, setToast] = useState("");

  const event = getEventById(eventId);
  const memories = getEventMemories(eventId, activeTab);
  const heroMemory = useMemo(() => [...memories].sort((a, b) => b.likesCount - a.likesCount || b.timestamp - a.timestamp)[0], [memories]);
  const canPost = canPostMemory(currentUser?.id, eventId);
  const totalLikes = memories.reduce((sum, memory) => sum + memory.likesCount, 0);
  const contributors = new Set(memories.map((memory) => memory.userId)).size;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const handleLike = (memory) => {
    if (!currentUser) return navigate("/login");
    const liked = Array.isArray(memory.likes) && memory.likes.includes(currentUser.id);
    liked ? unlikeMemory(memory.id, currentUser.id) : likeMemory(memory.id, currentUser.id);
    setRefresh((value) => value + 1);
  };

  const handleShare = async (memoryId) => {
    await shareMemory(memoryId);
    showToast("Share link ready.");
    setRefresh((value) => value + 1);
  };

  if (!event) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-violet-400">photo_library</span>
          <h1 className="text-2xl font-black text-white">Memories Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">Choose an event first to view its memories.</p>
          <button onClick={() => navigate("/events")} className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white">
            Back to Events
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1300px] space-y-6 pb-24">
        {toast ? <div className="fixed right-6 top-6 z-[200] rounded-2xl border border-violet-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div> : null}

        <section className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
          <img src={heroMemory?.image || event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <button onClick={() => navigate(-1)} className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 p-3 text-white backdrop-blur hover:bg-white/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="mb-3 w-fit rounded-full bg-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">{event.category}</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">{event.title}</h1>
            <p className="mt-3 text-sm font-semibold text-slate-300">{formatDate(event.date)} - {event.location}</p>
            <div className="mt-5 grid max-w-2xl grid-cols-3 gap-3">
              <HeroStat label="Memories" value={memories.length} />
              <HeroStat label="Likes" value={totalLikes} />
              <HeroStat label="Contributors" value={contributors} />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {["Recent", "Most Liked"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider ${activeTab === tab ? "bg-white text-slate-950" : "bg-white/[0.04] text-slate-400 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <button onClick={() => setPostOpen(true)} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">
              Post Memory
            </button>
            {!canPost ? <p className="text-xs text-amber-300">You can only post memories for events you attended.</p> : null}
          </div>
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              liked={Array.isArray(memory.likes) && memory.likes.includes(currentUser?.id)}
              onLike={() => handleLike(memory)}
              onShare={() => handleShare(memory.id)}
              commenting={commentingId === memory.id}
              onCommentToggle={() => setCommentingId(commentingId === memory.id ? null : memory.id)}
              onComment={(text) => {
                commentOnMemory(memory.id, currentUser.id, text);
                setCommentingId(null);
                setRefresh((value) => value + 1);
              }}
            />
          ))}
        </section>

        {!memories.length ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-700">photo_library</span>
            <p className="mt-4 font-bold text-white">No memories shared for this event yet</p>
          </div>
        ) : null}

        {postOpen ? (
          <PostMemoryModal
            event={event}
            canPost={canPost}
            onClose={() => setPostOpen(false)}
            onPost={(payload) => {
              createMemory({ userId: currentUser.id, eventId: event.id, ...payload });
              setPostOpen(false);
              setRefresh((value) => value + 1);
              
              // Simulate automatic Google Drive backup if connected
              try {
                const integrations = JSON.parse(localStorage.getItem("invitegenie_integrations") || "[]");
                const drive = integrations.find(i => i.name === "Google Drive");
                if (drive?.connected) {
                  setTimeout(() => showToast("Memory successfully backed up to Google Drive ☁️"), 1500);
                }
              } catch (error) {
                console.warn("Memory backup integration check failed.", error);
              }
            }}
          />
        ) : null}
      </div>
    </Layout>
  );
}

function MemoryCard({ memory, liked, onLike, onShare, commenting, onCommentToggle, onComment }) {
  const [text, setText] = useState("");
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-lg">
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 text-xs font-black text-white">{memory.userAvatar}</div>
        <div>
          <p className="text-sm font-bold text-white">{memory.userName}</p>
          <p className="text-xs text-slate-500">{relativeTime(memory.timestamp)}</p>
        </div>
      </div>
      <div className="aspect-square overflow-hidden">
        <img src={memory.image} alt={memory.caption} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-300">{memory.caption}</p>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-4">
            <button onClick={onLike} className={`flex items-center gap-2 text-sm font-bold ${liked ? "text-rose-300" : "text-slate-400 hover:text-rose-300"}`}>
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              {memory.likesCount}
            </button>
            <button onClick={onCommentToggle} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-violet-300">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              {memory.commentsCount}
            </button>
          </div>
          <button onClick={onShare} className="rounded-xl bg-white/[0.05] p-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
        {commenting ? (
          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
            {memory.commentsList && memory.commentsList.length > 0 ? (
              <div className="max-h-40 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {memory.commentsList.map((c) => (
                  <div key={c.id} className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 text-[10px] font-black text-white">{c.userAvatar}</div>
                    <div className="flex-1 rounded-2xl bg-white/[0.04] px-3 py-2">
                      <p className="text-[10px] font-bold text-violet-300">{c.userName}</p>
                      <p className="text-xs text-slate-300">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                try {
                  if (!text.trim()) return;
                  onComment(text.trim());
                  setText("");
                } catch (err) {
                  alert("Error posting comment: " + err.message);
                  console.error(err);
                }
              }}
              className="flex gap-2"
            >
              <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none" />
              <button className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold uppercase text-white">Post</button>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function PostMemoryModal({ event, canPost, onClose, onPost }) {
  const [form, setForm] = useState({ image: event.image, caption: "" });
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <form
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          if (canPost) onPost(form);
        }}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Post Memory</h2>
            <p className="mt-1 text-sm text-slate-400">{event.title}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/5 p-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {!canPost ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm font-semibold text-amber-100">
            You can only post memories for events you attended.
          </div>
        ) : (
          <div className="space-y-4">
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="Image URL" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
            <textarea value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} placeholder="Caption" rows={4} className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none" />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300">Cancel</button>
          <button disabled={!canPost} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50">Post</button>
        </div>
      </form>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(value) {
  const diff = Math.max(Date.now() - Number(value || Date.now()), 0);
  const hours = Math.max(Math.floor(diff / 3600000), 1);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
