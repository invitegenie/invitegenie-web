import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { canCreateMarketplaceListing } from "../services/roles";

export default function HomeNavBar() {
  const { currentUser } = useAuth();
  const showCreateListing = canCreateMarketplaceListing(currentUser?.role);

  const mainItems = [
    { label: "Home / Dashboard", path: "/dashboard", icon: "dashboard", description: "Your event portfolio" },
    { label: "Feed", path: "/feed", icon: "rss_feed", description: "Global highlights" },
    { label: "Marketplace", path: "/marketplace", icon: "storefront", description: "Browse services" },
    { label: "Create an Invitation", path: "/create-invitation", icon: "edit_square", description: "New event" },
    { label: "Events", path: "/events", icon: "event", description: "Manage events" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-[#0f1014] to-slate-950 border-b border-white/10 p-6 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[600px]">
          {mainItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group"
            >
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/5 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-900/20">
                <div className="flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-violet-400 group-hover:text-indigo-300 transition-colors">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-center group-hover:text-violet-300 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}

          {showCreateListing && (
            <Link
              to="/marketplace/new"
              className="group"
            >
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/5 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-900/20">
                <div className="flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-violet-400 group-hover:text-indigo-300 transition-colors">
                    add_business
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-center group-hover:text-violet-300 transition-colors">
                  New Marketplace Listing
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">List your service</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
