import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { CATEGORY_LABELS, NAV_ITEMS } from "../navigation/navItems";
import * as Engine from "../auth/coreEngine";
import { useAuth } from "../auth/AuthContext";
import { hasPermission, canCreateMarketplaceListing, USER_ROLES } from "../services/roles";

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, profile, logout } = useAuth();
  const user = currentUser || Engine.getCurrentUser();

  const isSuperAdmin = user?.role === USER_ROLES.SUPER_ADMIN;
  const showMyListings = isSuperAdmin || [USER_ROLES.VENDOR_PRO, USER_ROLES.TASKER, USER_ROLES.VENDOR_BASIC].includes(user?.role);

  const groupedNavItems = NAV_ITEMS.filter((item) => {
    if (isSuperAdmin || !item.requiredPermission) return true;
    if (Array.isArray(item.requiredPermission)) {
      return item.requiredPermission.some(perm => hasPermission(profile || user?.role, perm));
    }
    return hasPermission(profile || user?.role, item.requiredPermission);
  }).reduce((groups, item) => {
    const category = item.category || "main";
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  const isNavActive = (item) => {
    if (location.pathname === item.path) return true;
    return (item.activePaths || []).some((activePath) => location.pathname.startsWith(activePath));
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-[200] flex flex-col bg-[#111827] border-r border-[#2A3342] transition-all duration-300
        xl:sticky xl:top-0 xl:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
        ${isCollapsed ? "xl:w-20" : "xl:w-72 w-72"}
      `}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#2A3342]">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { navigate("/dashboard"); onClose(); }}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] flex-shrink-0" />
          {!isCollapsed && <h2 className="text-xl font-bold tracking-tighter text-[#F9FAFB] group-hover:text-white transition-colors">InviteGenie</h2>}
        </div>
        <button onClick={onToggleCollapse} className="hidden xl:flex text-[#6B7280] hover:text-white transition-colors">
          <Icon name={isCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"} />
        </button>
        <button onClick={onClose} className="xl:hidden text-[#6B7280]">
          <Icon name="close" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-6">
        {Object.entries(groupedNavItems).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {!isCollapsed && (
              <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#6B7280]">
                {CATEGORY_LABELS[category] || category}
              </p>
            )}
            {items.map((item) => {
              const isActive = isNavActive(item);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); onClose(); }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${isActive 
                      ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20" 
                      : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"}
                  `}
                  title={item.label}
                >
                  <Icon name={item.icon} className={`text-[22px] ${isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#A78BFA]"}`} />
                  {!isCollapsed && <span className="text-sm font-medium tracking-tight truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}

        {/* Marketplace Management (Vendor/Tasker specific) */}
        {showMyListings && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#6B7280] mt-4">
                Your Business
              </p>
            )}
            <button
              onClick={() => { navigate("/marketplace/my-listings"); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${location.pathname === "/marketplace/my-listings" 
                  ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20" 
                  : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"}
              `}
              title="My Listings"
            >
              <Icon name="inventory_2" className={`text-[22px] ${location.pathname === "/marketplace/my-listings" ? "text-white" : "text-[#6B7280] group-hover:text-[#A78BFA]"}`} />
              {!isCollapsed && <span className="text-sm font-medium tracking-tight">My Listings</span>}
            </button>
          </div>
        )}

        {/* Create Listing Action */}
        <div className="mt-4 px-2 space-y-2">
          <button
            onClick={() => { navigate("/events/new"); onClose(); }}
            className={`
              flex items-center justify-center bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-purple-900/30
              ${isCollapsed ? "w-10 h-10" : "w-full py-3.5 gap-2 px-4"}
            `}
            title="Create Event"
          >
            <Icon name="add_circle" className="text-[20px]" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Create Event</span>}
          </button>

          <button
            onClick={() => { navigate("/marketplace/new"); onClose(); }}
            className={`
              flex items-center justify-center border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-white rounded-2xl hover:bg-[#8B5CF6]/20 transition-all
              ${isCollapsed ? "w-10 h-10" : "w-full py-3.5 gap-2 px-4"}
            `}
            title="Create Listing"
          >
            <Icon name="add_business" className="text-[20px] text-[#A78BFA]" />
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Create Listing</span>}
          </button>
        </div>

        {/* Promotional upgrade card: only show if user is below PRO tier */}
        {!isCollapsed && (!user?.tier || user.tier === "BASIC") && (
          <div className="mt-8 px-2">
            <div className="bg-[#1F2937] border border-[#2A3342] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="diamond" className="text-4xl text-[#A78BFA]" /></div>
              <p className="text-[10px] font-black text-[#A78BFA] uppercase tracking-widest mb-1">PRO ACCOUNT</p>
              <h3 className="text-xs font-bold text-white mb-4">Unlimited Invitations & Scans</h3>
              <button onClick={() => navigate("/payments")} className="w-full py-2 bg-[#8B5CF6] text-white text-[10px] font-black uppercase rounded-lg hover:bg-[#7C3AED] transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#2A3342]">
        <div className="space-y-1">
           <button 
            onClick={() => navigate("/help")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#9CA3AF] hover:bg-[#1F2937] transition-all"
           >
            <Icon name="help" className="text-[#6B7280]" />
            {!isCollapsed && <span className="text-sm font-medium">Support</span>}
           </button>
           <button 
            onClick={() => { 
              if (confirm("Are you sure you want to sign out?")) { 
                // DEMO ONLY: Clear temporary admin session
                localStorage.removeItem("ig_demo_admin_user");
                sessionStorage.removeItem("super_admin_2fa_verified");
                
                Engine.logoutUser();
                logout?.();
                // Redirect to admin login if signing out from administrative area
                const isAdminArea = location.pathname.startsWith("/admin");
                navigate(isAdminArea ? "/admin/login" : "/login", { replace: true });
                onClose();
              } 
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
           >
            <Icon name="logout" />
            {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
           </button>
        </div>
      </div>
    </aside>
  );
}
