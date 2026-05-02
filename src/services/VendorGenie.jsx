import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = [
  "Write Promo",
  "Create Package Description",
  "Price Comparison",
  "Improve Listing Description",
  "Create WhatsApp Message",
  "Suggest Pricing"
];

function generateVendorGenieResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("wedding photography")) {
    return "Capture the magic of your special day with our premium wedding photography packages. We offer full-day coverage, drone shots, and a beautifully crafted photo album that preserves your memories forever.";
  }
  if (p.includes("catering")) {
    return "Our African fusion catering package brings the best of local and continental flavors to your event. Includes a full buffet setup, dedicated servers, and a premium selection of mocktails and appetizers for up to 100 guests.";
  }
  if (p.includes("price") || p.includes("pricing")) {
    return "Based on current market rates in Douala and Yaoundé:\n- Basic Package: FCFA 50,000 - 75,000\n- Standard Package: FCFA 100,000 - 150,000\n- Premium Package: FCFA 200,000+\nI suggest offering an introductory rate of FCFA 120,000 for your standard tier to build reviews.";
  }
  if (p.includes("promo") || p.includes("whatsapp")) {
    return "🎉 *Special Event Offer!* 🎉\n\nPlanning an event? Let us handle the details while you enjoy the moment! Book any of our premium packages this week and get a 10% discount.\n\n✅ Professional Service\n✅ On-time Delivery\n✅ 5-Star Experience\n\nReply to this message or visit our InviteGenie profile to secure your date today! 🔥";
  }
  return "I'm your Vendor Genie! I can help you craft compelling service descriptions, analyze local pricing in FCFA, and write marketing copy. Could you provide a bit more detail about your service?";
}

export default function VendorGenie() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "genie", text: "Welcome! I'm your Vendor Assistant. I can help you write attractive service descriptions, create promo messages, or advise on market pricing. How can I help your business grow today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("demo_vendor_genie_history")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem("demo_vendor_genie_history", JSON.stringify(newHistory));
  };

  const handleSend = (text = input) => {
    if (!text.trim() || loading) return;
    
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = generateVendorGenieResponse(text);
      setMessages(prev => [...prev, { role: "genie", text: response }]);
      
      const newHist = [{ text: response, prompt: text, date: new Date().toISOString() }, ...history].slice(0, 10);
      saveHistory(newHist);
      
      setLoading(false);
    }, 1000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-28 pt-4">
        <header className="flex justify-between items-end bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-amber-400 flex items-center justify-center shadow-lg">
              <Icon name="auto_awesome" className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Genie for Vendors</h1>
              <p className="text-[10px] text-amber-400 uppercase font-black tracking-widest mt-1">AI Marketing & Strategy</p>
            </div>
          </div>
          <button onClick={() => navigate("/vendor-insights")} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Business Insights
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[600px]">
          {/* Chat Interface */}
          <div className="bg-[#111827] border border-white/10 rounded-[2rem] shadow-xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    {m.role === 'genie' && i > 0 && (
                      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10">
                        <button onClick={() => handleCopy(m.text)} className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white transition">
                          <Icon name="content_copy" className="text-[14px]" /> Copy
                        </button>
                        <button onClick={() => alert("Saved to listing drafts!")} className="flex items-center gap-1 text-[10px] uppercase font-bold text-violet-400 hover:text-violet-300 transition">
                          <Icon name="save" className="text-[14px]" /> Save to Listing
                        </button>
                        <div className="flex items-center text-amber-400 ml-auto">
                          <Icon name="star" className="text-[14px] cursor-pointer" /><Icon name="star" className="text-[14px] cursor-pointer" /><Icon name="star" className="text-[14px] cursor-pointer" /><Icon name="star_outline" className="text-[14px] cursor-pointer" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/10 flex gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-900/50">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => setInput(s)} className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/10 hover:text-white transition">
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Genie to generate an offer or description..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white outline-none focus:border-violet-500 transition"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white disabled:opacity-50 hover:bg-violet-500 transition"
                >
                  <Icon name="send" className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-[#111827] border border-white/10 rounded-[2rem] shadow-xl p-5 overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Recent Generations</h3>
            <div className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition" onClick={() => handleCopy(h.text)}>
                  <p className="text-[10px] font-bold text-violet-400 truncate mb-1">"{h.prompt}"</p>
                  <p className="text-xs text-slate-300 line-clamp-3">{h.text}</p>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-10">No recent history.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}