import { useState, useMemo } from "react";
import Layout from "../components/Layout";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";

export default function Feed() {
  const { currentUser } = useAuth();
  const feedItems = useEngineCollection(KEYS.POSTS);
  const memories = useEngineCollection(KEYS.MEMORIES);
  const events = useEngineCollection(KEYS.EVENTS);

  const globalFeed = useMemo(() => {
    const combined = [
      ...feedItems.map(p => ({ ...p, type: 'post' })),
      ...memories.map(m => ({ ...m, type: 'memory' })),
      ...events.map(e => ({ ...e, type: 'event' }))
    ];
    return combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [feedItems, memories, events]);

  return (
    <Layout>
      <main className="p-6 space-y-6 bg-[#0B0F19] min-h-screen font-sans">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">Social Feed</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Real-time magical moments from the coven.</p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Create Post Card */}
          <div className="bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0) || 'G'}
              </div>
              <textarea 
                placeholder="Share a magical moment..."
                className="flex-1 bg-[#0F172A] border border-[#2A3342] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none h-20"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="text-[#A78BFA] flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">image</span>
                <span className="text-xs font-bold uppercase">Media</span>
              </button>
              <button className="bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-widest shadow-lg">
                Post
              </button>
            </div>
          </div>

          {/* Feed List */}
          {globalFeed.map((item, i) => (
            <FeedCard key={item.id || i} item={item} />
          ))}
        </div>
      </main>
    </Layout>
  );
}

function FeedCard({ item }) {
  const isEvent = item.type === 'event';
  const isMemory = item.type === 'memory';

  return (
    <div className="bg-[#111827] rounded-2xl border border-[#2A3342] shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F2937] border border-[#2A3342] flex items-center justify-center text-[#A78BFA] font-bold">
            {item.userName?.charAt(0) || item.vendorName?.charAt(0) || 'I'}
          </div>
          <div>
            <p className="text-sm font-bold text-[#F9FAFB]">{item.userName || item.vendorName || "Invite Genie"}</p>
            <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
              {isEvent ? 'New Event' : isMemory ? 'Magical Memory' : 'Post'} • Just now
            </p>
          </div>
        </div>
        <button className="text-[#6B7280] hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>

      {(item.image || item.media) && (
        <div className="aspect-video w-full overflow-hidden border-y border-[#2A3342]">
          <img src={item.image || item.media} className="w-full h-full object-cover" alt="Feed content" />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-[#F9FAFB] font-semibold text-base mb-2">{item.title || item.caption || item.content}</h3>
        {isEvent && (
          <div className="p-4 bg-[#1F2937] rounded-xl border border-[#2A3342] flex items-center justify-between">
             <div>
               <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-widest">Entry Fee</p>
               <p className="text-[#22C55E] font-black text-sm">FCFA {item.price?.toLocaleString()}</p>
             </div>
             <button className="px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-[10px] font-black uppercase">Tickets</button>
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-6 border-t border-[#2A3342] pt-4">
          <button className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            <span className="text-xs font-bold">142</span>
          </button>
          <button className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#8B5CF6] transition-colors">
            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
            <span className="text-xs font-bold">24</span>
          </button>
        </div>
      </div>
    </div>
  );
}