﻿import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import { getDashboardToolsForRole, hasPermission } from "../services/roles";
import { ensureDemoData, getEvents, getMarketplaceProviders, getQuoteRequests } from "../services/mockData";
import { getFeedMemoryGroups } from "../services/socialService";
import { getBookingsByUser, getMarketplaceOrdersForSeller, getTicketsByUser } from "../services/ticketingService";

const roleLabels = {
  normal_user: "Free User",
  pro_user: "Pro User",
  vendor: "Vendor",
  event_planner: "Event Planner",
  enterprise_client: "Enterprise Client",
  tasker: "Tasker",
  checkin_agent: "Check-in Agent",
  finance_admin: "Finance Admin",
  app_admin: "App Admin",
  super_admin: "Super Admin",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activePanel = searchParams.get("panel");
  const { currentUser, profile, role } = useAuth();
  const [teamAssignments, setTeamAssignments] = useState(() => loadAssignments(currentUser?.id));
  const [toast, setToast] = useState("");
  const [respondingQuote, setRespondingQuote] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const data = ensureDemoData();
  const tools = getDashboardToolsForRole(role);
  const events = getEvents() || [];
  const listings = getMarketplaceProviders() || [];
  const myTickets = getTicketsByUser(currentUser?.id) || [];
  const myBookings = getBookingsByUser(currentUser?.id) || [];
  const myListings = listings.filter((listing) => String(listing.ownerId || listing.userId) === String(currentUser?.id));
  const sellerOrders = getMarketplaceOrdersForSeller(currentUser?.id) || [];
  const quoteRequests = (getQuoteRequests() || []).filter((request) => String(request.sellerId || request.providerId) === String(currentUser?.id) || myListings.some((listing) => String(listing.id) === String(request.providerId)));
  const memoryGroups = (getFeedMemoryGroups("Trending") || []).slice(0, 3);

  const ownedEvents = useMemo(
    () => (events || []).filter((event) => String(event.hostId) === String(currentUser?.id)),
    [events, currentUser]
  );

  const metrics = [
    { label: "Tickets", value: myTickets.length, icon: "confirmation_number", path: "/my-tickets" },
    { label: "Bookings", value: myBookings.length, icon: "event_seat", path: "/bookings" },
    { label: "Owned Events", value: ownedEvents.length, icon: "event_available", path: "/events" },
    { label: "Listings", value: myListings.length, icon: "storefront", path: "/marketplace" },
  ];

  if (role === "vendor" || role === "tasker") {
    metrics.push({ label: "Orders", value: sellerOrders.length, icon: "shopping_bag", path: "/dashboard?panel=orders" });
    metrics.push({ label: "Quote Requests", value: quoteRequests.length, icon: "request_quote", path: "/dashboard?panel=quotes" });
  }

  const assignRole = (assignment) => {
    const next = [
      {
        id: `assign-${Date.now()}`,
        assignedBy: currentUser.id,
        createdAt: new Date().toISOString(),
        ...assignment,
      },
      ...teamAssignments,
    ];
    setTeamAssignments(next);
    localStorage.setItem(`demo_role_assignments_${currentUser.id}`, JSON.stringify(next));
    setToast("Role assignment saved locally.");
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <Layout showHeader={false}>
      <div className="mx-auto max-w-[1400px] space-y-6 pb-24">
        {toast ? (
          <div className="fixed right-6 top-6 z-[200] rounded-2xl border border-emerald-400/30 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-xl">
            {toast}
          </div>
        ) : null}

        <header className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-md backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">
                {roleLabels[role] || role}
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Welcome, {profile?.full_name || currentUser?.name || "InviteGenie User"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Your dashboard tools are based on your active demo role and permissions. Data is localStorage-ready for Supabase later.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              {hasPermission(profile || role, "create_event") ? (
                <button onClick={() => navigate("/events/new")} className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500">
                  Create Event
                </button>
              ) : null}
              {hasPermission(profile || role, "create_marketplace_listing") ? (
                <button onClick={() => navigate("/marketplace/new")} className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20">
                  Create Listing
                </button>
              ) : null}
              {hasPermission(profile || role, "use_ai_marketing_studio") ? (
                <button onClick={() => navigate("/ai-marketing-studio")} className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-amber-100 hover:bg-amber-400/20">
                  AI Marketing
                </button>
              ) : null}
              <Link to="/pricing" className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-200 hover:bg-white/[0.08]">
                Plans
              </Link>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <button
              key={metric.label}
              onClick={() => navigate(metric.path)}
              className="rounded-2xl border border-white/10 bg-[#111827] p-5 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-violet-400/40"
            >
              <span className="material-symbols-outlined text-violet-300">{metric.icon}</span>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{metric.value}</p>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(tools || []).map((tool) => (
            <button
              key={`${tool.label}-${tool.path}`}
              onClick={() => navigate(tool.path)}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-violet-400/40 hover:bg-white/[0.06]"
            >
              <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-violet-300 group-hover:text-white">
                {tool.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{tool.label}</p>
                <p className="mt-1 text-xs text-slate-500">{tool.path.replace("/", "") || "dashboard"}</p>
              </div>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {activePanel === "quotes" && (role === "vendor" || role === "tasker") ? (
              <Panel title="Quote Requests" subtitle="Incoming inquiries and quote requests">
                <div className="space-y-4">
                  {quoteRequests.length > 0 ? quoteRequests.map((req) => (
                    <div key={req.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{req.providerName || req.serviceNeeded || "Service Inquiry"}</h3>
                        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">{req.status || "Pending"}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3">
                        <span>From: {req.buyerName || req.userName || "Guest User"}</span>
                        <span>Date: {req.date || new Date(req.createdAt).toLocaleDateString()}</span>
                        {req.location && <span>Location: {req.location}</span>}
                        {req.budget && <span className="font-bold text-emerald-400">Budget: FCFA {Number(req.budget).toLocaleString()}</span>}
                      </div>
                      <p className="text-sm text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5">{req.description || "No additional details provided."}</p>
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => setRespondingQuote(req)} className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors">Respond & Invoice</button>
                        <button className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors">Mark Read</button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 py-4">No new quote requests at this time.</p>
                  )}
                </div>
              </Panel>
            ) : activePanel === "orders" && (role === "vendor" || role === "tasker") ? (
              <Panel title="Recent Orders" subtitle="Marketplace orders and bookings">
                <div className="space-y-4">
                  {sellerOrders.length > 0 ? sellerOrders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                       <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{order.listingTitle || "Service Booking"}</h3>
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">Confirmed</span>
                      </div>
                      <p className="text-xs text-slate-400">Date: {new Date(order.timestamp).toLocaleDateString()}</p>
                      <p className="mt-2 text-sm font-bold text-emerald-400">+ FCFA {Number(order.amount).toLocaleString()}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 py-4">No recent orders.</p>
                  )}
                </div>
              </Panel>
            ) : null}

            <Panel title="Role Workspace" subtitle="Live local data tied to this account">
              <RoleWorkspace
                role={role}
                currentUser={currentUser}
                ownedEvents={ownedEvents}
                myListings={myListings}
                sellerOrders={sellerOrders}
                quoteRequests={quoteRequests}
                assignments={teamAssignments}
                onAssign={assignRole}
                data={data}
              />
            </Panel>

            <Panel title="Trending Event Memories" subtitle="Grouped by event, not loose photos">
              <div className="grid gap-4 md:grid-cols-3">
                {memoryGroups.map((group) => (
                  <button
                    key={group.eventId}
                    onClick={() => navigate(`/events/${group.eventId}/memories`)}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 text-left transition hover:border-violet-400/40"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={group.frontImage} alt={group.eventTitle} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 text-sm font-bold text-white">{group.eventTitle}</p>
                      <p className="mt-1 text-xs text-slate-500">{group.totalMemories} memories - {group.totalLikes} likes</p>
                    </div>
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel title="Demo Accounts" subtitle="Quick ecosystem size">
              <div className="grid grid-cols-2 gap-3">
                <MiniStat label="Users" value={data?.users?.length || 0} />
                <MiniStat label="Events" value={data?.events?.length || 0} />
                <MiniStat label="Listings" value={data?.listings?.length || 0} />
                <MiniStat label="Memories" value={data?.memories?.length || 0} />
              </div>
            </Panel>
            <Panel title="Next Actions" subtitle="Useful shortcuts">
              <div className="space-y-3">
                <ActionButton label="Browse Events" icon="event" onClick={() => navigate("/events")} />
                <ActionButton label="Open Feed" icon="dynamic_feed" onClick={() => navigate("/feed")} />
                <ActionButton label="View Marketplace" icon="storefront" onClick={() => navigate("/marketplace")} />
                <ActionButton label="My Tickets" icon="confirmation_number" onClick={() => navigate("/my-tickets")} />
              </div>
            </Panel>
          </aside>
        </section>
        
        {/* Quote Response Modal */}
        {respondingQuote && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#111827] border border-[#2A3342] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-[#2A3342]">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Respond to Quote</h2>
                <p className="text-xs text-[#9CA3AF] mt-1 font-bold uppercase tracking-widest">To: {respondingQuote.buyerName || respondingQuote.userName || "Guest"}</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                setToast(`Response sent and invoice generated for FCFA ${Number(invoiceAmount).toLocaleString()}`);
                window.setTimeout(() => setToast(""), 2400);
                setRespondingQuote(null);
                setInvoiceAmount("");
                setResponseMessage("");
              }} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Message</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-[#0B0F19] border border-[#2A3342] text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#8B5CF6]/50 outline-none transition-all resize-none"
                    placeholder="Type your response here..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Invoice Amount (FCFA)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full bg-[#0B0F19] border border-[#2A3342] text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#8B5CF6]/50 outline-none transition-all"
                    placeholder="Enter amount to generate invoice..."
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setRespondingQuote(null);
                      setInvoiceAmount("");
                      setResponseMessage("");
                    }} 
                    className="flex-1 px-4 py-4 rounded-2xl border border-[#2A3342] text-[#9CA3AF] text-xs font-black uppercase tracking-widest hover:bg-[#1F2937] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
                  >
                    Send & Generate Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function RoleWorkspace({ role, currentUser, ownedEvents, myListings, sellerOrders, quoteRequests, assignments, onAssign, data }) {
  if (role === "enterprise_client") {
    return <AssignmentPanel title="Assign Company Users" roles={["enterprise_manager", "event_creator", "finance_viewer", "guest_manager", "checkin_staff"]} assignments={assignments} onAssign={onAssign} />;
  }
  if (role === "event_planner") {
    return <AssignmentPanel title="Assign Event Team Roles" roles={["event_manager", "guest_manager", "scanner_agent", "finance_viewer"]} assignments={assignments} onAssign={onAssign} />;
  }
  if (role === "vendor" || role === "tasker") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat label="Active Listings" value={myListings.length} />
        <MiniStat label="Orders" value={sellerOrders.length} />
        <MiniStat label="Quote Requests" value={quoteRequests.length} />
      </div>
    );
  }
  if (role === "checkin_agent") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <MiniStat label="Today's Events" value={(data?.events || []).slice(0, 5).length} />
        <MiniStat label="Checked-in Guests" value={42} />
        <MiniStat label="Validation Logs" value={128} />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MiniStat label="Events Attended" value={(data?.tickets || []).filter((ticket) => String(ticket.userId) === String(currentUser?.id)).length} />
      <MiniStat label="Owned Events" value={ownedEvents.length} />
      <MiniStat label="Platform Memories" value={data?.memories?.length || 0} />
    </div>
  );
}

function AssignmentPanel({ title, roles, assignments, onAssign }) {
  const [form, setForm] = useState({ email: "", role: roles[0] });
  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.email) return;
          onAssign(form);
          setForm({ email: "", role: roles[0] });
        }}
        className="grid gap-3 md:grid-cols-[1fr_220px_auto]"
      >
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="teammate@company.cm" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50" />
        <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
          {roles.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="rounded-2xl bg-violet-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">Assign</button>
      </form>
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {assignments.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-sm font-bold text-white">{item.email}</p>
              <p className="mt-1 text-xs text-violet-300">{item.role}</p>
            </div>
          ))}
          {!assignments.length ? <p className="text-sm text-slate-500">No local assignments yet.</p> : null}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111827] p-5 shadow-lg">
      <div className="mb-5">
        <h2 className="text-lg font-black text-white">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ActionButton({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-left text-sm font-bold text-white hover:border-violet-400/40">
      <span className="material-symbols-outlined text-violet-300">{icon}</span>
      {label}
    </button>
  );
}

function loadAssignments(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`demo_role_assignments_${userId}`) || "[]");
  } catch {
    return [];
  }
}
