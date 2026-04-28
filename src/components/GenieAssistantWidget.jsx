import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

/**
 * Floating Genie Assistant Widget
 * Can be embedded in any screen for quick AI assistance
 */
export default function GenieAssistantWidget({ context = "general" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm here to help you with ${context}. What would you like assistance with?`,
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

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await getGenieResponse(messages, input);
      const genieMessage = {
        id: messages.length + 2,
        text: response,
        sender: "genie",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, genieMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-28 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group"
        >
          <Icon name="auto_awesome" className="text-[28px]" />
          <div className="absolute inset-0 rounded-full bg-purple-600/30 blur-xl animate-pulse group-hover:animate-none" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-28 right-6 z-50 w-96 h-[500px] flex flex-col rounded-[2rem] border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 flex items-center justify-center">
            <Icon name="auto_awesome" className="text-white text-sm" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Genie Assistant</h3>
            <p className="text-[9px] text-emerald-400">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/summon-genie")}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            title="Open full Genie interface"
          >
            <Icon name="open_in_full" className="text-gray-400 text-sm" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Icon name="close" className="text-gray-400 text-sm" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 text-xs ${
                message.sender === "user"
                  ? "bg-purple-600/30 border border-purple-500/20"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <p className="text-slate-200">{message.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask the genie..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="h-9 w-9 rounded-lg bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Icon name="send" className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
