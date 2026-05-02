import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../auth/AuthContext";
import { canCreateMarketplaceListing } from "../services/roles";

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

  const { currentUser } = useAuth();

  return (
    <div className="fixed bottom-6 left-1/2 z-[150] w-[92%] -translate-x-1/2 sm:w-[420px] xl:hidden">
      <nav className="flex items-center justify-between rounded-full border border-[#2A3342] bg-[#0B0F19]/90 p-2 shadow-2xl backdrop-blur-xl relative">
        {/* Quick Action for Create Listing on Mobile */}
        <button
          onClick={() => navigate("/marketplace/new")}
          className="absolute -top-14 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] text-white shadow-xl shadow-purple-900/40"
          title="Create Listing"
        >
          <Icon name="add_business" className="text-[22px]" />
        </button>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] text-white shadow-lg shadow-[#8B5CF6]/30 scale-110" 
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="text-[24px]" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}