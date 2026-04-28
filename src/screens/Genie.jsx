import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getGenieResponse } from "../services/aiAssistantService";

function Icon({ name, className = "" }) {
  const iconStyle = {
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };
  return (
    <span className={`material-symbols-outlined ${className}`} style={iconStyle}>
      {name}
    </span>
  );
}

const QUICK_PROMPTS = [
  { icon: "event", text: "Event Ideas", prompt: "Generate 3 unique event concepts for a wedding celebration" },
  { icon: "mail", text: "Invitation Text", prompt: "Write a compelling wedding invitation message" },
  { icon: "palette", text: "Theme Ideas", prompt: "Suggest 5 creative event themes for a gala" },
  { icon: "description", text: "Improve Description", prompt: "Help me write a better event description" },
];

export default function Genie() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm the Genie of Invite Genie! 🧞 I can help you:\n• Create event descriptions and ideas\n• Write invitation text\n• Suggest themes and layouts\n• Improve your event details\n\nWhat would you like help with today?",
      sender: "genie",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Get Genie response
      const response = await getGenieResponse(messages, text);
      const genieMessage = {
        id: messages.length + 2,
        text: response,
        sender: "genie",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, genieMessage]);
    } catch (error) {
      console.error("Error getting Genie response:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I encountered an error while conjuring my response. Please try again!",
        sender: "genie",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-8 sm:px-5 xl:px-6">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-white/5 p-2 hover:bg-white/10 transition-colors"
          >
            <Icon name="arrow_back" className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Summon a Genie</h1>
            <p className="text-xs text-gray-400 mt-1">AI-powered event planning assistant</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto h-[700px] flex flex-col rounded-[2.5rem] border border-white/10 bg-slate-950/70 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
              <Icon name="auto_awesome" className="text-white text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">Genie AI Assistant</h3>
              <p className="text-[10px] text-emerald-400 uppercase font-black">
                {loading ? "Thinking..." : "Online & Ready to Conjure"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 ${
                    message.sender === "user"
                      ? "bg-purple-600/30 border border-purple-500/20 rounded-tr-none"
                      : "bg-white/5 border border-white/10 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm text-slate-200 whitespace-pre-line">{message.text}</p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (shown when no substantial conversation) */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4 border-b border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left group"
                  >
                    <Icon name={prompt.icon} className="text-purple-400 text-lg mb-2" />
                    <p className="text-[10px] font-bold text-white group-hover:text-purple-300 transition-colors">
                      {prompt.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="relative flex gap-2">
              <input
                type="text"
                placeholder="Ask the genie anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={loading || !input.trim()}
                className="h-14 w-14 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="send" className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
