// Helper functions for InviteGenie

export const formatCurrency = (amount) => {
  if (!amount) return "FCFA 0";
  return `FCFA ${new Intl.NumberFormat("en-US").format(Math.round(amount))}`;
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
};

export const formatDateTime = (date, time) => {
  if (!date) return "";
  const formattedDate = formatDate(date);
  return time ? `${formattedDate} • ${time}` : formattedDate;
};

export const formatTime = (time) => {
  if (!time) return "";
  // Assume time is in HH:MM format
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHours = h % 12 || 12;
  return `${displayHours}:${String(m).padStart(2, "0")} ${ampm}`;
};

export const getStatusColor = (status) => {
  const colors = {
    "Confirmed": "text-emerald-400 bg-emerald-500/10",
    "Pending": "text-amber-400 bg-amber-500/10",
    "Cancelled": "text-rose-400 bg-rose-500/10",
    "ACTIVE": "text-emerald-400 bg-emerald-500/10",
    "UPCOMING": "text-amber-400 bg-amber-500/10",
    "COMPLETED": "text-blue-400 bg-blue-500/10",
  };
  return colors[status] || "text-gray-400 bg-gray-500/10";
};

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getEventById = (id, events) => {
  return events?.find((e) => e.id == id);
};

export const getBookingById = (id, bookings) => {
  return bookings?.find((b) => b.id == id);
};

export const calculateProgress = (current, total) => {
  if (!total) return 0;
  return Math.round((current / total) * 100);
};
