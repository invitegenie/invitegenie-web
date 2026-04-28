import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import * as Engine from "../auth/coreEngine";

export default function EventMemories() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Recent");
  const [memories, setMemories] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const foundEvent = Engine.getEventById(eventId);
    setEvent(foundEvent);
    setMemories(Engine.getMemories());
  }, [eventId]);

  const filteredMemories = useMemo(() => {
    if (!eventId) return [];
    const list = memories.filter(m => m.eventId?.toString() === eventId.toString());

    if (activeTab === "Recent") {
      return [...list].sort((a, b) => b.timestamp - a.timestamp);
    }
    return [...list].sort((a, b) => b.likes - a.likes);
  }, [activeTab, memories, eventId]);

  const handleLike = (id) => {
    Engine.likeMemory(id);
    setMemories(Engine.getMemories());
  };

  if (!event) return null;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 font-sans animate-in fade-in duration-500">
      {/* Event Header */}
      <div className="relative h-[300px] rounded-[3rem] overflow-hidden group shadow-2xl">
        <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-10 left-10">
          <h1 className="text-4xl font-bold text-white font-heading tracking-tight">{event.title}</h1>
          <p className="text-gray-300 mt-2 flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-violet-400">location_on</span>
            {event.location} • {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sorting Tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {["Recent", "Most Liked"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40" : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMemories.map((m) => (
          <MemoryCard key={m.id} memory={m} onLike={() => handleLike(m.id)} />
        ))}
        {filteredMemories.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-white/10 block mb-4">photo_library</span>
            <p className="text-gray-500 font-bold uppercase tracking-widest">No memories shared for this event yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryCard({ memory, onLike }) {
  return (
    <div className="bg-white/[0.04] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:bg-white/[0.06] transition-all">
      {/* User Info */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
          {memory.userAvatar}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-100">{memory.userName}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{memory.postedAt}</p>
        </div>
      </div>

      {/* Media */}
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={memory.image} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt="Memory" 
        />
      </div>

      {/* Caption & Stats */}
      <div className="p-6">
        <p className="text-xs text-gray-300 leading-relaxed min-h-[40px] italic">"{memory.caption}"</p>
        
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onLike}
              className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors group/btn"
            >
              <span className="material-symbols-outlined text-[20px] group-active/btn:scale-125 transition-transform">favorite</span>
              <span className="text-xs font-black">{memory.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              <span className="text-xs font-black">{memory.comments}</span>
            </button>
          </div>
          <button className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>
    </div>
  );
}