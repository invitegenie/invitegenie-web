import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import FloatingGenieButton from "./FloatingGenieButton";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#0b0a0f] text-white selection:bg-violet-500/30 font-sans antialiased">
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-36 pt-4 sm:px-5 xl:px-6 xl:pb-8">
        
        {/* Mobile Header */}
        <div className="xl:hidden flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
           <h2 className="font-heading font-black text-xl bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">Genie</h2>
           <button onClick={toggleSidebar} className="p-2">
              <span className="material-symbols-outlined">menu</span>
           </button>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[280px_1fr] xl:items-start">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="min-w-0 space-y-5 overflow-visible">
            <Header name={currentUser?.name} tier={currentUser?.tier} />
            <Outlet />
          </main>
        </div>
      </div>
      <FloatingGenieButton />
      <BottomNav className="xl:hidden" />
    </div>
  );
}