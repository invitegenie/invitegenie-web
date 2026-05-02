import { DEMO_STORAGE_KEYS, ensureDemoData, getEventById, getEvents, getMemories, getTickets } from "./mockData";
import { getDemoUserById, getDemoUsers } from "./demoUsers";

function readKey(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("invitegenie:data-change", { detail: { key, data: value } }));
  if (key === DEMO_STORAGE_KEYS.memories) localStorage.setItem("ig_memories", JSON.stringify(value));
  if (key === DEMO_STORAGE_KEYS.posts) localStorage.setItem("ig_posts", JSON.stringify(value));
  if (key === DEMO_STORAGE_KEYS.comments) localStorage.setItem("ig_comments", JSON.stringify(value));
  return value;
}

function memoryLikes(memory) {
  return Array.isArray(memory.likes) ? memory.likes.length : Number(memory.likes || 0);
}

function memoryTime(memory) {
  return Number(memory.timestamp || new Date(memory.createdAt || 0).getTime() || 0);
}

function enrichMemory(memory) {
  const comments = readKey(DEMO_STORAGE_KEYS.comments).filter((comment) => String(comment.memoryId) === String(memory.id));
  const user = getDemoUserById(memory.userId);
  return {
    ...memory,
    userName: memory.userName || user?.full_name || "InviteGenie User",
    userAvatar: memory.userAvatar || user?.avatar || "IG",
    likesCount: memoryLikes(memory),
    commentsCount: comments.length || Number(memory.commentsCount || 0),
    commentsList: comments,
  };
}

export function canPostMemory(userId, eventId) {
  ensureDemoData();
  const event = getEventById(eventId);
  if (!event || !userId) return false;
  return getTickets().some(
    (ticket) =>
      String(ticket.userId) === String(userId) &&
      String(ticket.eventId) === String(eventId) &&
      ["valid", "confirmed", "completed", "used"].includes(String(ticket.status || "").toLowerCase())
  );
}

export function createMemory({ userId, eventId, image, caption }) {
  ensureDemoData();
  if (!canPostMemory(userId, eventId)) {
    throw new Error("You can only post memories for events you attended.");
  }

  const event = getEventById(eventId);
  const user = getDemoUserById(userId);
  const memory = {
    id: `mem-${Date.now()}`,
    userId,
    userName: user?.full_name || "InviteGenie User",
    userAvatar: user?.avatar || "IG",
    eventId,
    eventName: event.title,
    image: image || event.image,
    caption: caption || `A new memory from ${event.title}.`,
    likes: [],
    commentsCount: 0,
    shares: 0,
    status: "published",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  const memories = [memory, ...getMemories()];
  writeKey(DEMO_STORAGE_KEYS.memories, memories);

  const posts = readKey(DEMO_STORAGE_KEYS.posts);
  writeKey(DEMO_STORAGE_KEYS.posts, [
    {
      id: `post-${memory.id}`,
      userId,
      userName: memory.userName,
      userAvatar: memory.userAvatar,
      eventId,
      postType: "memory",
      content: memory.caption,
      media: memory.image,
      likes: [],
      commentsCount: 0,
      shares: 0,
      createdAt: memory.createdAt,
      timestamp: memory.timestamp,
    },
    ...posts,
  ]);

  return memory;
}

export function getUserGallery(userId) {
  ensureDemoData();
  const attendedEventIds = new Set(
    getTickets()
      .filter((ticket) => String(ticket.userId) === String(userId))
      .map((ticket) => String(ticket.eventId))
  );
  const memories = getMemories().filter((memory) => String(memory.userId) === String(userId));
  return getEvents()
    .filter((event) => attendedEventIds.has(String(event.id)) || memories.some((memory) => String(memory.eventId) === String(event.id)))
    .map((event) => ({
      event,
      memories: memories.filter((memory) => String(memory.eventId) === String(event.id)).map(enrichMemory),
    }));
}

export function getEventMemories(eventId, sortMode = "Recent") {
  ensureDemoData();
  const list = getMemories()
    .filter((memory) => String(memory.eventId) === String(eventId))
    .map(enrichMemory);

  if (sortMode === "Most Liked") return list.sort((a, b) => memoryLikes(b) - memoryLikes(a) || memoryTime(b) - memoryTime(a));
  return list.sort((a, b) => memoryTime(b) - memoryTime(a));
}

function chooseFrontMemory(memories) {
  return [...memories].sort((a, b) => memoryLikes(b) - memoryLikes(a) || memoryTime(b) - memoryTime(a))[0] || null;
}

export function getFeedMemoryGroups(sortMode = "Recent", filter = "Recent") {
  ensureDemoData();
  const usersById = new Map(getDemoUsers().map((user) => [String(user.id), user]));
  const events = getEvents();
  const memories = getMemories().map(enrichMemory);

  const groups = events
    .map((event) => {
      const eventMemories = memories.filter((memory) => String(memory.eventId) === String(event.id));
      if (!eventMemories.length) return null;

      const contributors = Array.from(new Set(eventMemories.map((memory) => String(memory.userId))))
        .map((userId) => usersById.get(userId))
        .filter(Boolean);
      const totalLikes = eventMemories.reduce((sum, memory) => sum + memoryLikes(memory), 0);
      const lastPostedAt = Math.max(...eventMemories.map(memoryTime));
      const frontMemory = chooseFrontMemory(eventMemories);

      return {
        event,
        eventId: event.id,
        eventTitle: event.title,
        category: event.category,
        location: event.location,
        date: event.date,
        coverImage: event.image || event.coverImage,
        frontImage: frontMemory?.image || event.image,
        frontMemory,
        totalMemories: eventMemories.length,
        totalLikes,
        contributors,
        topContributorAvatars: contributors.slice(0, 5).map((user) => user.avatar),
        lastPostedAt,
        memories: eventMemories,
      };
    })
    .filter(Boolean)
    .filter((group) => {
      if (["Recent", "Trending"].includes(filter)) return true;
      return String(group.category || "").toLowerCase().includes(filter.toLowerCase().replace(/s$/, ""));
    });

  if (sortMode === "Trending") return groups.sort((a, b) => b.totalLikes - a.totalLikes || b.lastPostedAt - a.lastPostedAt);
  return groups.sort((a, b) => b.lastPostedAt - a.lastPostedAt);
}

export function likeMemory(memoryId, userId) {
  ensureDemoData();
  const memories = getMemories().map((memory) => {
    if (String(memory.id) !== String(memoryId)) return memory;
    const likes = Array.isArray(memory.likes) ? memory.likes : [];
    return likes.includes(userId) ? memory : { ...memory, likes: [...likes, userId] };
  });
  writeKey(DEMO_STORAGE_KEYS.memories, memories);

  const likes = readKey(DEMO_STORAGE_KEYS.likes);
  if (!likes.some((like) => String(like.memoryId) === String(memoryId) && String(like.userId) === String(userId))) {
    writeKey(DEMO_STORAGE_KEYS.likes, [
      { id: `like-${memoryId}-${userId}`, memoryId, userId, createdAt: new Date().toISOString() },
      ...likes,
    ]);
  }
  return memories.find((memory) => String(memory.id) === String(memoryId));
}

export function unlikeMemory(memoryId, userId) {
  ensureDemoData();
  const memories = getMemories().map((memory) => {
    if (String(memory.id) !== String(memoryId)) return memory;
    const likes = Array.isArray(memory.likes) ? memory.likes : [];
    return { ...memory, likes: likes.filter((id) => String(id) !== String(userId)) };
  });
  writeKey(DEMO_STORAGE_KEYS.memories, memories);
  writeKey(
    DEMO_STORAGE_KEYS.likes,
    readKey(DEMO_STORAGE_KEYS.likes).filter((like) => !(String(like.memoryId) === String(memoryId) && String(like.userId) === String(userId)))
  );
  return memories.find((memory) => String(memory.id) === String(memoryId));
}

export function commentOnMemory(memoryId, userId, text) {
  ensureDemoData();
  const user = getDemoUserById(userId);
  const comment = {
    id: `comment-${Date.now()}`,
    memoryId,
    userId,
    userName: user?.full_name || "InviteGenie User",
    userAvatar: user?.avatar || "IG",
    text,
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };
  writeKey(DEMO_STORAGE_KEYS.comments, [comment, ...readKey(DEMO_STORAGE_KEYS.comments)]);
  const memories = getMemories().map((memory) =>
    String(memory.id) === String(memoryId)
      ? { ...memory, commentsCount: Number(memory.commentsCount || 0) + 1 }
      : memory
  );
  writeKey(DEMO_STORAGE_KEYS.memories, memories);
  return comment;
}

export async function shareMemory(memoryId) {
  ensureDemoData();
  const memory = getMemories().find((item) => String(item.id) === String(memoryId));
  if (!memory) return null;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}/shared/memory/${memoryId}`;

  const memories = getMemories().map((item) =>
    String(item.id) === String(memoryId) ? { ...item, shares: Number(item.shares || 0) + 1 } : item
  );
  writeKey(DEMO_STORAGE_KEYS.memories, memories);

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title: memory.eventName || "InviteGenie Memory", text: memory.caption, url });
  } else if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(url);
  }
  return url;
}

export function getMemoryById(memoryId) {
  ensureDemoData();
  const memory = getMemories().find((item) => String(item.id) === String(memoryId));
  return memory ? enrichMemory(memory) : null;
}
