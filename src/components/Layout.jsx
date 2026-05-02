import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import FloatingGenieButton from "./FloatingGenieButton";
import { useAuth } from "../auth/AuthContext";
import Header from "./Header";
import Icon from "./Icon";

export default function Layout({ children, showHeader = true }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const showBackButton = !["/dashboard", "/home"].includes(location.pathname);

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
          <main className={`p-4 sm:p-6 xl:p-8 space-y-6 min-h-screen pb-32 xl:pb-8 transition-all`}>
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="xl:hidden flex items-center justify-between mb-2 p-2 gap-4">
              <span className="font-black text-xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] bg-clip-text text-transparent tracking-tighter shrink-0">GENIE</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate("/marketplace/new")}
                  className="p-2 bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] text-white rounded-xl shadow-lg"
                >
                  <Icon name="add_business" className="text-xl" />
                </button>
                <button onClick={toggleSidebar} className="p-2 bg-[#111827] border border-[#2A3342] rounded-xl">
                  <Icon name="menu" />
                </button>
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
