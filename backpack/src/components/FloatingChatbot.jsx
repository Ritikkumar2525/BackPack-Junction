"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, Bot, User, Map, X, MessageSquare } from "lucide-react";

const suggestions = [
  "What's the best time to visit Spiti Valley?",
  "Suggest a 4-day trip under ₹8000",
  "Is Kedarnath safe in winter?",
  "Recommend a trek for beginners",
];

// Helper to format basic markdown from Gemini (bold and bullet points)
const formatMessage = (text) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-1" />;
    
    let isBullet = false;
    let content = line;
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      isBullet = true;
      content = line.trim().substring(2);
    } else if (line.trim().match(/^\d+\.\s/)) {
      isBullet = true;
      const match = line.trim().match(/^(\d+\.)\s(.*)/);
      if (match) {
        content = match[2];
        return (
          <span key={i} className="pl-5 relative block mb-1.5 leading-relaxed text-[13px]">
            <span className="absolute left-0 top-0 text-burnt-orange font-bold">{match[1]}</span>
            {parseBold(content)}
          </span>
        );
      }
    }

    if (isBullet) {
      return (
        <span key={i} className="pl-4 relative block mb-1.5 leading-relaxed text-[13px]">
          <span className="absolute left-0 top-0 text-burnt-orange font-bold">•</span>
          {parseBold(content)}
        </span>
      );
    }

    return <span key={i} className="block mb-2 last:mb-0 leading-relaxed text-[13px]">{parseBold(content)}</span>;
  });
};

const parseBold = (content) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={j}>{part}</span>;
  });
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", content: "Namaste! I'm Jerry, your personal Himalayan travel assistant. I can help you plan itineraries, estimate budgets, give packing tips, and recommend actual trips we offer. How can I help you plan your next adventure?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when chatbot is open (especially for mobile/touch)
      document.body.style.overflow = "hidden";
      scrollToBottom();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: "model", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "model", content: data.error || "Sorry, I am facing some technical difficulties right now. Please try again later." }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "model", content: "Sorry, I am unable to connect to the server right now. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-[96px] right-6 md:bottom-[108px] md:right-8 z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="absolute bottom-[75px] right-0 w-[calc(100vw-48px)] sm:w-[380px] h-[calc(100dvh-260px)] max-h-[550px] min-h-[350px] flex flex-col bg-[#0C1420]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#141F33]/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between shrink-0 shadow-sm z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burnt-orange to-[#a35e27] flex items-center justify-center shadow-lg shadow-burnt-orange/20 relative">
                  <Bot size={20} className="text-white" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#141F33]" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-cream">Jerry</h3>
                  <p className="text-[10px] text-cream/40 uppercase tracking-wider font-semibold">Travel Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/20 relative z-10 overscroll-contain"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md mt-1 ${
                      msg.role === "user" ? "bg-white/10 text-cream/50" : "bg-burnt-orange/20 text-burnt-orange border border-burnt-orange/30"
                    }`}>
                      {msg.role === "user" ? <User size={14} /> : <Map size={14} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-sm ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-white/10 to-white/5 text-cream border border-white/10 rounded-tr-sm" 
                        : "bg-[#141F33]/90 text-cream/90 border border-burnt-orange/10 rounded-tl-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                    }`}>
                      {formatMessage(msg.content)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Thinking Animation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-burnt-orange/20 text-burnt-orange flex items-center justify-center shrink-0 border border-burnt-orange/30 mt-1">
                    <Map size={14} />
                  </div>
                  <div className="bg-[#141F33]/90 rounded-2xl rounded-tl-sm px-4 py-3 border border-burnt-orange/10 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.2)] h-[42px]">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-burnt-orange" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-burnt-orange" />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-burnt-orange" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#0C1420]/95 backdrop-blur-xl border-t border-white/5 shrink-0 z-20">
              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex overflow-x-auto gap-2 pb-3 custom-scrollbar snap-x">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="shrink-0 snap-start text-[10px] sm:text-[11px] text-cream/70 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-burnt-orange/40 hover:text-cream hover:bg-burnt-orange/10 transition-all font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Jerry..."
                  className="w-full bg-[#141F33]/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-cream focus:outline-none focus:border-burnt-orange/50 focus:ring-1 focus:ring-burnt-orange/50 transition-all text-[13px] placeholder:text-cream/30 shadow-inner"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-8 h-8 rounded-lg bg-gradient-to-r from-burnt-orange to-[#D4842A] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-burnt-orange/20 transition-all"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Cinematic Floating Button */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)} 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="w-[60px] h-[60px] rounded-full bg-[#0C1420]/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(198,122,60,0.3)] transition-all duration-500 border border-burnt-orange/20 relative z-10 group overflow-hidden"
      >
        {/* Hardware-accelerated rotating gradient border */}
        <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(198,122,60,0.8)_360deg)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ animationPlayState: "running" }} />
        
        {/* Inner dark circle to hollow out the border */}
        <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-[#0C1420] to-[#141F33] z-0" />
        
        {/* Inner ambient glow on hover */}
        <div className="absolute inset-0 rounded-full bg-burnt-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        
        {/* Dynamic Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center justify-center"
            >
              <Bot size={28} className="text-burnt-orange drop-shadow-[0_0_12px_rgba(198,122,60,0.6)] group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Notification Dot */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3.5 h-3.5 z-20">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            <span className="absolute inset-0 bg-green-500 border-[2.5px] border-[#0C1420] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
