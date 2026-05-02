import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

export default function Templates() {
  const navigate = useNavigate();

  const handleSelectTemplate = (templateName) => {
    // Store selected template in localStorage
    localStorage.setItem("selectedTemplate", templateName);
    // Navigate to create event page
    navigate("/create-event");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Templates"
          subtitle="Choose from our collection of beautiful invitation templates."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
              <span className="text-4xl">ðŸ’œ</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wedding Classic</h3>
            <p className="text-gray-400 mb-4">Purple romantic invitation with elegant typography.</p>
            <button 
              onClick={() => handleSelectTemplate("Wedding Classic")}
              className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Select Template
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl mb-4 flex items-center justify-center">
              <span className="text-4xl">ðŸ’¼</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Corporate Pass</h3>
            <p className="text-gray-400 mb-4">Clean event access design for professional gatherings.</p>
            <button 
              onClick={() => handleSelectTemplate("Corporate Pass")}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Select Template
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl mb-4 flex items-center justify-center">
              <span className="text-4xl">ðŸŽ‰</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Party Fun</h3>
            <p className="text-gray-400 mb-4">Colorful and energetic design for celebrations.</p>
            <button 
              onClick={() => handleSelectTemplate("Party Fun")}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Select Template
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
