import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import * as AIService from "../services/aiAssistantService";

export default function SummonGenie() {
  const [messages, setMessages] = useState([
    { role: "model", text: "Greetings! I am your Invite Genie. I can help you brainstorm themes, write invitation text, or plan your entire event. What shall we conjure today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await AIService.getGenieResponse(messages, text);
      setMessages(prev => [...prev, { role: "model", text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", text: "Apologies, my magic is flickering. Please check your connection or API key in .env.local." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { label: "Event Ideas", prompt: "Suggest 3 unique event concepts for a summer gala in Douala." },
    { label: "Invite Text", prompt: "Write a magical formal invitation for a royal-themed wedding." },
    { label: "Theme Suggestion", prompt: "Suggest a futuristic cyberpunk theme for a product launch party." },
    { label: "Event Plan", prompt: "Create a detailed 5-hour event plan for a corporate networking evening." },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-500">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between bg-white/[0.03] p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-900/20">
              <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">Summon Genie</h1>
              <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Brainstorming Active
              </p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white rounded-tr-sm shadow-xl shadow-violet-900/20' 
                  : 'bg-white/[0.05] text-gray-200 rounded-tl-sm border border-white/10 backdrop-blur-md'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.03] p-4 rounded-3xl rounded-tl-sm border border-white/5 flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions & Input */}
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSend(s.prompt)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all active:scale-95"
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-violet-600/10 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your wish... (e.g. 'Plan a cocktail night')"
              className="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-6 pr-14 py-5 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all backdrop-blur-xl"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-2.5 w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-all active:scale-90 disabled:opacity-50 disabled:grayscale"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}