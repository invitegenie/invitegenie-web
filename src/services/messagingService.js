import { supabase } from "../lib/supabaseClient";
import { sendNotification } from "./notificationService";

const MESSAGES_KEY = "ig_messages";
const CONVERSATIONS_KEY = "ig_conversations";

function readKey(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function writeKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data } }));
  return data;
}

export function getConversations(userId) {
  const convos = readKey(CONVERSATIONS_KEY);
  return convos
    .filter(c => String(c.participant1) === String(userId) || String(c.participant2) === String(userId))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getMessages(conversationId) {
  const msgs = readKey(MESSAGES_KEY);
  return msgs
    .filter(m => String(m.conversationId) === String(conversationId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export async function sendMessage({ senderId, senderName, receiverId, receiverName, text, listingId, listingName }) {
  const now = new Date().toISOString();
  
  // Local demo implementation fallback updates
  let convos = readKey(CONVERSATIONS_KEY);
  let convo = convos.find(c => 
    (String(c.participant1) === String(senderId) && String(c.participant2) === String(receiverId)) ||
    (String(c.participant1) === String(receiverId) && String(c.participant2) === String(senderId))
  );

  if (!convo) {
    convo = {
      id: `conv-${Date.now()}`,
      participant1: senderId,
      participant2: receiverId,
      participant1Name: senderName,
      participant2Name: receiverName,
      listingId,
      listingName,
      updatedAt: now,
      unreadCount: { [receiverId]: 1, [senderId]: 0 }
    };
    convos.unshift(convo);
  } else {
    convo.updatedAt = now;
    convo.unreadCount[receiverId] = (convo.unreadCount[receiverId] || 0) + 1;
    convos = [convo, ...convos.filter(c => c.id !== convo.id)];
  }

  writeKey(CONVERSATIONS_KEY, convos);

  const msgs = readKey(MESSAGES_KEY);
  const newMsg = { id: `msg-${Date.now()}-${Math.random().toString(36).substring(2,9)}`, conversationId: convo.id, senderId, text, createdAt: now };
  msgs.push(newMsg);
  writeKey(MESSAGES_KEY, msgs);

  // Supabase Implementation
  if (supabase) {
    try {
      let { data: supaConvo } = await supabase.from('conversations').select('id').eq('participant1', senderId).eq('participant2', receiverId).single();
      if (!supaConvo) {
        supaConvo = await supabase.from('conversations').select('id').eq('participant1', receiverId).eq('participant2', senderId).single();
      }
      let supaConvoId = supaConvo?.id;
      if (!supaConvoId) {
        const { data } = await supabase.from('conversations').insert([{ participant1: senderId, participant2: receiverId, listing_id: listingId, listing_name: listingName }]).select().single();
        supaConvoId = data.id;
      }
      await supabase.from('messages').insert([{ conversation_id: supaConvoId, sender_id: senderId, text }]);
    } catch (e) {
      console.warn("Supabase messaging failed, fell back to local", e);
    }
  }

  // Fire Notification via Edge Function
  sendNotification({
    userId: receiverId,
    channel: "both",
    template: "new_message",
    data: { senderName, text, listingName }
  });

  return { conversation: convo, message: newMsg };
}

export function subscribeToMessages(conversationId, callback) {
  if (!supabase) return { unsubscribe: () => {} };
  const channel = supabase.channel(`messages:${conversationId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, payload => {
      callback(payload.new);
    }).subscribe();
  return { unsubscribe: () => supabase.removeChannel(channel) };
}

export function markConversationRead(conversationId, userId) {
  const convos = readKey(CONVERSATIONS_KEY);
  const idx = convos.findIndex(c => String(c.id) === String(conversationId));
  if (idx !== -1 && convos[idx].unreadCount[userId] > 0) {
    convos[idx].unreadCount[userId] = 0;
    writeKey(CONVERSATIONS_KEY, convos);
  }
}