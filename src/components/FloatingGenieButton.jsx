import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";

export default function FloatingGenieButton() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch(); // Not directly used for filtering here, but available
  return (
    <button
      onClick={() => navigate("/summon-genie")}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 shadow-2xl shadow-violet-900/50 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all"
      title="Summon Genie"
    >
      <span className="material-symbols-outlined text-white text-5xl animate-pulse group-hover:animate-none">
        magic_button
      </span>
    </button>
  );
}
