import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { getConversations, getMessages, sendMessage, markConversationRead } from "../services/messagingService";

export default function Inbox() {
  const { currentUser, profile } = useAuth();
  const userId = currentUser?.id || "demo-user";
  const userName = profile?.full_name || currentUser?.name || "User";

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const loadData = () => {
    const convos = getConversations(userId);
    setConversations(convos);
    if (activeConvo) {
      setMessages(getMessages(activeConvo.id));
      markConversationRead(activeConvo.id, userId);
    }
  };

  useEffect(() => {
    loadData();
    const handleDataChange = (e) => {
      if (e.detail?.key === "ig_conversations" || e.detail?.key === "ig_messages") {
        loadData();
      }
    };
    window.addEventListener("invitegenie:data-change", handleDataChange);
    return () => window.removeEventListener("invitegenie:data-change", handleDataChange);
  }, [userId, activeConvo?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConvo = (convo) => {
    setActiveConvo(convo);
    setMessages(getMessages(convo.id));
    markConversationRead(convo.id, userId);
    setConversations(getConversations(userId));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;
    
    const receiverId = activeConvo.participant1 === userId ? activeConvo.participant2 : activeConvo.participant1;
    const receiverName = activeConvo.participant1 === userId ? activeConvo.participant2Name : activeConvo.participant1Name;
    
    sendMessage({
      senderId: userId,
      senderName: userName,
      receiverId,
      receiverName,
      text: newMessage,
      listingId: activeConvo.listingId,
      listingName: activeConvo.listingName
    });
    
    setNewMessage("");
  };

  const getOtherName = (convo) => convo.participant1 === userId ? convo.participant2Name : convo.participant1Name;
  const getUnread = (convo) => convo.unreadCount?.[userId] || 0;

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)] min-h-[600px] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-20">
        {/* Conversations List */}
        <div className={`w-full md:w-1/3 flex-col bg-[#111827] border border-white/10 rounded-[2rem] shadow-xl overflow-hidden ${activeConvo ? "hidden md:flex" : "flex"}`}>
          <div className="p-6 border-b border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">Communication</p>
            <h1 className="mt-1 text-2xl font-black text-white">Inbox</h1>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Icon name="chat_bubble" className="text-4xl mb-3 opacity-50" />
                <p className="text-sm font-bold">No messages yet.</p>
              </div>
            ) : (
              conversations.map(c => {
                const unread = getUnread(c);
                const isActive = activeConvo?.id === c.id;
                return (
                  <button key={c.id} onClick={() => handleSelectConvo(c)} className={`w-full p-5 text-left border-b border-white/5 transition-colors flex items-start gap-4 ${isActive ? 'bg-violet-600/10' : 'hover:bg-white/[0.02]'}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-emerald-400 flex items-center justify-center text-white font-black shrink-0 shadow-lg">
                      {getOtherName(c).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-sm truncate ${unread > 0 ? 'font-black text-white' : 'font-bold text-slate-300'}`}>{getOtherName(c)}</p>
                        {unread > 0 && <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">{unread}</span>}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 truncate mb-1">{c.listingName || "Inquiry"}</p>
                      <p className="text-xs text-slate-500 truncate">{new Date(c.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 flex-col bg-[#111827] border border-white/10 rounded-[2rem] shadow-xl overflow-hidden ${!activeConvo ? "hidden md:flex" : "flex"}`}>
          {activeConvo ? (
            <>
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                <button onClick={() => setActiveConvo(null)} className="md:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"><Icon name="arrow_back" /></button>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-emerald-400 flex items-center justify-center text-white font-black shrink-0 shadow-lg">{getOtherName(activeConvo).charAt(0).toUpperCase()}</div>
                <div>
                  <h2 className="text-lg font-black text-white">{getOtherName(activeConvo)}</h2>
                  <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">{activeConvo.listingName}</p>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 bg-[#0a0d14]">
                {messages.length === 0 ? <p className="text-center text-slate-500 text-sm py-10">Start the conversation...</p> : messages.map((m) => {
                  const isMe = String(m.senderId) === String(userId);
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-4 rounded-2xl ${isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${isMe ? 'text-violet-300' : 'text-slate-500'}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <form onSubmit={handleSend} className="flex gap-3"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} placeholder="Type a message..." rows={1} className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-violet-500 resize-none" /><button type="submit" disabled={!newMessage.trim()} className="h-14 w-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 disabled:opacity-50 disabled:grayscale transition-all shadow-lg"><Icon name="send" /></button></form>
              </div>
            </>
          ) : <div className="flex-1 flex flex-col items-center justify-center text-slate-500"><div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"><Icon name="forum" className="text-5xl opacity-50" /></div><p className="text-lg font-black text-white">Your Inbox</p><p className="text-sm mt-2">Select a conversation to start messaging</p></div>}
        </div>
      </div>
    </Layout>
  );
}