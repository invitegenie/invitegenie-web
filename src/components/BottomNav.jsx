import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: "dashboard", label: "Home", path: "/dashboard" },
    { icon: "event", label: "Events", path: "/events" },
    { icon: "task_alt", label: "Tasks", path: "/tasks" },
    { icon: "storefront", label: "Market", path: "/marketplace" },
    { icon: "person", label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] w-[92%] -translate-x-1/2 sm:w-[420px] xl:hidden">
      <nav className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/80 p-2 shadow-2xl backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 scale-110" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
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