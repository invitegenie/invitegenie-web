import React from "react";
import Icon from "./Icon";

export default function VIPAccessBadge({ accessLevel }) {
  const level = String(accessLevel || "standard").toLowerCase();
  if (level === "standard") return null;

  const config = {
    vip: { icon: "stars", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "VIP Access" },
    backstage: { icon: "admin_panel_settings", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", label: "Backstage Pass" },
    staff: { icon: "badge", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "Staff Access" },
    sponsor: { icon: "verified", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", label: "Sponsor" },
    table: { icon: "table_restaurant", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Table Guest" },
  };

  const { icon, color, label } = config[level] || config.vip;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${color}`}>
      <Icon name={icon} className="text-[14px]" />
      {label}
    </span>
  );
}