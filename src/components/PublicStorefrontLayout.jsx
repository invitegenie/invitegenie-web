import React, { useEffect } from "react";
import { trackStorefrontView } from "../services/storefrontAnalyticsService";

export default function PublicStorefrontLayout({ tenant, theme, children }) {
  useEffect(() => {
    if (tenant?.id) {
      trackStorefrontView(tenant.id);
    }
  }, [tenant?.id]);

  const bgColor = theme?.backgroundColor || "#090806";
  const textColor = theme?.textColor || "#FFFFFF";

  return (
    <div className="min-h-screen pt-4 sm:pt-6" style={{ backgroundColor: bgColor, color: textColor, fontFamily: theme?.fontStyle === 'serif' ? 'serif' : 'sans-serif' }}>
      {children}
    </div>
  );
}