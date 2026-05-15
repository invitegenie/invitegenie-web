import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: "home", label: "Home", path: "/dashboard" },
    { icon: "rss_feed", label: "Feed", path: "/feed" },
    { icon: "event", label: "Events", path: "/events" },
    { icon: "storefront", label: "Market", path: "/marketplace" },
    { icon: "person", label: "Profile", path: "/my-account" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] border-t border-white/10 bg-[#0B0F19]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl xl:hidden">
      <nav className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(`${item.path}/`));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-colors ${
                isActive 
                  ? "bg-gradient-to-t from-[#8B5CF6] to-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" 
                  : "text-[#9CA3AF] hover:text-white"
              }`}
              aria-label={item.label}
            >
              <Icon name={item.icon} className={`text-[25px] ${isActive ? "bg-gradient-to-t from-[#8B5CF6] to-[#22C55E] bg-clip-text text-transparent" : ""}`} />
              <span className={`truncate text-[10px] font-semibold leading-none ${isActive ? "bg-gradient-to-t from-[#8B5CF6] to-[#22C55E] bg-clip-text text-transparent" : ""}`}>{item.label}</span>
              {isActive ? <span className="absolute -top-2 h-0.5 w-7 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E]" /> : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
