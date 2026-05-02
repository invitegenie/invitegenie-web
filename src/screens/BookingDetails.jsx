import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { KEYS } from "../auth/coreEngine";
import useEngineCollection from "./useEngineCollection";
import { MOCK_BOOKINGS } from "./Bookings";
import { getBookingById as getDemoBookingById, getTicketById as getDemoTicketById } from "../services/ticketingService";

export default function BookingDetails() {
  const { bookingId, id } = useParams();
  const navigate = useNavigate();
  const resolvedId = bookingId || id;
  const tickets = useEngineCollection(KEYS.TICKETS);

  const demoBooking = getDemoBookingById(resolvedId);
  const demoTicket = demoBooking ? getDemoTicketById(demoBooking.ticketId) : getDemoTicketById(resolvedId);
  const engineTicket = demoTicket || tickets.find((ticket) => String(ticket.id) === String(resolvedId));
  const mockBooking = MOCK_BOOKINGS.find((booking) => String(booking.id) === String(resolvedId));
  const booking = engineTicket ? normalizeTicket(engineTicket) : mockBooking;

  if (!booking) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-violet-400">confirmation_number</span>
          <h1 className="text-2xl font-black text-white">Booking Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">This ticket may have been removed or has not synced into local storage yet.</p>
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-500"
          >
            Back to Bookings
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">Booking Details</p>
            <h1 className="mt-2 text-3xl font-black text-white">{booking.event}</h1>
            <p className="mt-1 text-sm text-slate-400">Invoice {booking.id}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white"
            >
              Back to Bookings
            </button>
            <button
              type="button"
              onClick={() => navigate(`/bookings/${booking.id}/voucher`)}
              className="rounded-2xl bg-gradient-to-r from-violet-500 to-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-white"
            >
              View Voucher
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard label="Buyer Name" value={booking.name} icon="person" />
          <DetailCard label="Amount" value={`FCFA ${Number(booking.amount || 0).toLocaleString()}`} icon="payments" />
          <DetailCard label="Status" value={booking.status} icon="verified" />
          <DetailCard label="Quantity" value={booking.qty} icon="local_activity" />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InfoRow label="Event Name" value={booking.event} />
            <InfoRow label="Ticket Type" value={booking.category} />
            <InfoRow label="Purchase Date" value={booking.date} />
            <InfoRow label="Unit Price" value={`FCFA ${Number(booking.price || 0).toLocaleString()}`} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            {booking.eventId ? (
              <Link
                to={`/events/${booking.eventId}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white"
              >
                View Event
              </Link>
            ) : null}
            <Link
              to="/scanner"
              className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-emerald-300 hover:bg-emerald-400/20"
            >
              Open Scanner
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DetailCard({ label, value, icon }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <span className="material-symbols-outlined text-violet-400">{icon}</span>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 truncate text-lg font-black text-white">{value}</p>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value || "Not available"}</p>
    </div>
  );
}

function normalizeTicket(ticket) {
  const quantity = Number(ticket.quantity || 1);
  const amount = Number(ticket.amount || ticket.price || 0);

  return {
    id: ticket.id,
    date: formatDate(ticket.createdAt || ticket.date),
    name: ticket.buyerName || "Guest",
    event: ticket.eventName || "Invite Genie Event",
    category: ticket.type || ticket.ticketType || "Standard",
    price: Number(ticket.unitPrice || amount / Math.max(quantity, 1) || 0),
    qty: quantity,
    amount,
    status: String(ticket.status || "Confirmed"),
    eventId: ticket.eventId,
  };
}

function formatDate(value) {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
