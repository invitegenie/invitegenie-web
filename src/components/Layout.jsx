import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import FloatingGenieButton from "./FloatingGenieButton";
import { useAuth } from "../auth/AuthContext";
import Header from "./Header";
import Icon from "./Icon";
import { hasAnyPermission } from "../services/roles";

export default function Layout({ children, showHeader = true }) {
  const { currentUser, profile, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const showBackButton = !["/dashboard", "/home"].includes(location.pathname);
  const canCreateMarketplace = hasAnyPermission(profile || role, ["create_marketplace_listing", "create_marketplace_product", "manage_all_storefronts"]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  useEffect(() => {
    const closeSidebar = () => setIsSidebarOpen(false);
    window.addEventListener("popstate", closeSidebar);
    return () => window.removeEventListener("popstate", closeSidebar);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] selection:bg-[#8B5CF6]/30 font-sans antialiased overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] xl:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex w-full transition-all duration-300`}>
        {/* Sidebar Navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)} 
          onToggleCollapse={toggleCollapse}
        />
        
        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 max-w-full">
          <main className={`p-4 sm:p-6 xl:p-8 space-y-6 min-h-screen pb-28 xl:pb-8 transition-all`}>
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="sticky top-0 z-[90] -mx-4 -mt-4 mb-3 border-b border-white/10 bg-[#0B0F19]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:-mt-6 sm:px-6 xl:hidden">
              <div className="flex h-11 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:bg-white/10 hover:text-white"
                    aria-label="Open navigation menu"
                  >
                    <Icon name="menu" className="text-[28px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="min-w-0 truncate text-left text-xl font-black tracking-tight bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] bg-clip-text text-transparent drop-shadow-sm"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    InviteGenie
                  </button>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {canCreateMarketplace ? (
                    <button
                      type="button"
                      onClick={() => navigate("/marketplace/new")}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/10 hover:text-white"
                      aria-label="Create listing"
                    >
                      <Icon name="add_box" className="text-[25px]" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition hover:bg-white/10 hover:text-white"
                    aria-label="Notifications"
                  >
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#E1306C]" />
                    <Icon name="favorite" className="text-[25px]" />
                  </button>
                </div>
              </div>
            </div>

            {showHeader ? <Header name={currentUser?.name} tier={currentUser?.tier} /> : null}
            {showBackButton ? (
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate("/dashboard");
                  }
                }}
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-violet-400/40 hover:text-white"
              >
                <Icon name="arrow_back" className="text-[18px]" />
                Back
              </button>
            ) : null}
            {children || <Outlet />}
          </main>
        </div>
      </div>
      <FloatingGenieButton />
      <BottomNav className="xl:hidden" />
    </div>
  );
}
