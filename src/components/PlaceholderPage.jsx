import { useNavigate } from "react-router-dom";

export default function PlaceholderPage({ title, description, icon, backLink, actions }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        {icon && (
          <div className="mb-6 flex justify-center">
            <span className="material-symbols-outlined text-6xl text-violet-400 opacity-30">
              {icon}
            </span>
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {backLink && (
            <button
              onClick={() => navigate(backLink.path)}
              className="px-6 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
            >
              {backLink.label || "Back"}
            </button>
          )}

          {actions && actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => action.onClick ? action.onClick() : navigate(action.path)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                action.primary
                  ? "bg-violet-600 text-white hover:bg-violet-500"
                  : "border border-white/10 text-white hover:bg-white/5"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
