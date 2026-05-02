import React from "react";
import { useAuth } from "../auth/AuthContext";
import { USER_ROLES } from "../services/roles";
import Dashboard from "./Dashboard"; // Fixed relative path

export default function RoleDashboard() {
  const { role, currentUser } = useAuth();

  // Logic to switch between specific dashboards
  // If they don't exist yet, we use the fallback cards as requested
  switch (role) {
    case USER_ROLES.PUBLIC_GUEST:
      return <Dashboard title="Guest Portal" />;
    case USER_ROLES.EVENT_HOST:
      return <Dashboard title="Host Control Center" />;
    case USER_ROLES.VENDOR_BASIC:
    case USER_ROLES.VENDOR_PRO:
      return <Dashboard title="Vendor Hub" />;
    case USER_ROLES.STAFF:
      return <Dashboard title="Staff Operations" />;
    case USER_ROLES.FINANCE_ADMIN:
      return <Dashboard title="Finance Dashboard" />;
    case USER_ROLES.APP_ADMIN:
    case USER_ROLES.SUPER_ADMIN:
      return <Dashboard title="Administrative Command" />;
    default:
      return <FallbackDashboard role={role} user={currentUser} />;
  }
}

function FallbackDashboard({ role, user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Welcome back, {user?.name}</h1>
        <p className="text-slate-500 mt-1 uppercase font-bold tracking-widest text-[10px]">Role: {role.replace('_', ' ')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
          <div className="w-12 h-12 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400 mb-6">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Platform Metrics</h3>
          <p className="text-slate-500 text-sm">Real-time data visualization is initializing for your role profile.</p>
        </div>
        
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
            <span className="material-symbols-outlined">notification_important</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Pending Actions</h3>
          <p className="text-slate-500 text-sm">Your task queue is currently synchronized with the cloud.</p>
        </div>
      </div>
    </div>
  );
}
