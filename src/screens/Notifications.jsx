import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { KEYS } from "../auth/coreEngine";
import * as Engine from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { useAuth } from "../auth/AuthContext";

export default function Notifications() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const notifications = useEngineCollection(KEYS.NOTIFICATIONS);

  const visibleNotifications = useMemo(() => {
    return (notifications || [])
      .filter((item) => !item.userId || String(item.userId) === String(currentUser?.id))
      .sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
  }, [notifications, currentUser]);

  const unreadCount = visibleNotifications.filter((item) => !item.read).length;

  const markAllRead = () => {
    const next = (notifications || []).map((item) => {
      if (item.userId && String(item.userId) !== String(currentUser?.id)) return item;
      return { ...item, read: true, readAt: new Date().toISOString() };
    });
    Engine.save(KEYS.NOTIFICATIONS, next);
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl space-y-6 pb-28">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8B5CF6]">
              Activity Center
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Notifications</h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Ticket sales, RSVP changes, provider updates, and platform alerts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2A3342] bg-[#111827] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#F9FAFB] transition hover:border-[#8B5CF6]/50"
            >
              <Icon name="done_all" className="text-[18px]" />
              Mark Read
            </button>
            <button
              type="button"
              onClick={() => navigate("/notification-settings")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#7C3AED]"
            >
              <Icon name="settings" className="text-[18px]" />
              Settings
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Metric label="Unread" value={unreadCount} icon="notifications_active" />
          <Metric label="Total Alerts" value={visibleNotifications.length} icon="campaign" />
          <Metric label="Synced" value="Live" icon="sync" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#2A3342] bg-[#111827] shadow-lg">
          {visibleNotifications.length ? (
            visibleNotifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  Engine.markNotificationRead?.(item.id);
                  if (item.path) navigate(item.path);
                }}
                className="flex w-full items-start gap-4 border-b border-[#2A3342] px-5 py-4 text-left transition last:border-b-0 hover:bg-white/[0.03]"
              >
                <span className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.read ? "bg-[#1F2937] text-[#6B7280]" : "bg-[#8B5CF6]/15 text-[#A78BFA]"}`}>
                  <Icon name={iconForType(item.type)} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-black text-white">{item.title || titleForType(item.type)}</span>
                    {!item.read ? <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> : null}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[#9CA3AF]">{item.message}</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                    {formatWhen(item.createdAt || item.created_at || item.date)}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="p-10 text-center">
              <Icon name="notifications_off" className="mx-auto text-4xl text-[#6B7280]" />
              <h2 className="mt-4 text-lg font-black text-white">No notifications yet</h2>
              <p className="mt-1 text-sm text-[#9CA3AF]">New platform activity will appear here automatically.</p>
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
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#A78BFA]">
        <Icon name={icon} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6B7280]">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function iconForType(type) {
  const icons = {
    booking: "confirmation_number",
    payment: "payments",
    guest: "groups",
    system: "auto_awesome",
    vendor: "storefront",
  };
  return icons[type] || "notifications";
}

function titleForType(type) {
  const titles = {
    booking: "Booking update",
    payment: "Payment update",
    guest: "Guest update",
    system: "System alert",
    vendor: "Vendor update",
  };
  return titles[type] || "Notification";
}

function formatWhen(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
