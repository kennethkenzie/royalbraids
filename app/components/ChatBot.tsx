"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Maximize2, 
  Minimize2,
  Sparkles,
  User,
  Package,
  RefreshCcw,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "Track My Order", icon: <Package className="h-4 w-4" />, message: "I want to track my order." },
  { label: "Returns & Exchanges", icon: <RefreshCcw className="h-4 w-4" />, message: "How do I start a return?" },
  { label: "Product Help", icon: <Sparkles className="h-4 w-4" />, message: "I need a product recommendation." },
  { label: "General Help", icon: <HelpCircle className="h-4 w-4" />, message: "I have a general question." },
];

export default function ChatBot({ logoUrl }: { logoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi there! Welcome to Royal Braids. How can I help you today?", time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newUserMessage = { role: "user", content, time: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "Thanks for your message! Our team will get back to you shortly. For immediate answers, check our Help & FAQ center.";
      
      if (content.toLowerCase().includes("track")) {
        botResponse = "You can track your order live on our 'Track Order' page. You'll need your order number and email.";
      } else if (content.toLowerCase().includes("return")) {
        botResponse = "Our returns center is open 24/7! You can start a return within 14 days of delivery for any unopened products.";
      } else if (content.toLowerCase().includes("product") || content.toLowerCase().includes("recommend")) {
        botResponse = "I'd love to help! Are you looking for braids, weaves, or specific textures like crochet?";
      }

      setMessages(prev => [...prev, { role: "bot", content: botResponse, time: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-zinc-100"
          >
            {/* Header */}
            <div className="flex h-20 items-center justify-between bg-black px-6 text-white border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center transition-transform group-hover:scale-110 overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Bot Avatar" className="h-full w-full object-contain" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-amber-500" />
                  )}
                  <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold tracking-tight">Royal Assistant</h3>
                  <p className="text-[11px] font-medium text-emerald-400 uppercase tracking-widest">Online Now</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-[#fafafa] p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-br-none shadow-md" 
                      : "bg-white text-zinc-800 border border-zinc-100 rounded-bl-none shadow-sm"
                  }`}>
                    {msg.content}
                    <div className={`mt-1 text-[9px] uppercase font-bold tracking-tighter ${
                      msg.role === "user" ? "text-white/40" : "text-zinc-400"
                    }`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 delay-100" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input */}
            <div className="border-t border-zinc-100 bg-white p-4">
              {/* Quick Actions Scrollable */}
              {messages.length < 3 && !isTyping && (
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                  {QUICK_ACTIONS.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.message)}
                      className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-[12px] font-semibold text-zinc-700 transition hover:bg-black hover:text-white hover:border-black"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <form 
                className="relative flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-5 pr-12 text-[14px] outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black/5"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-black text-white transition disabled:bg-zinc-200 hover:scale-105 active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] uppercase font-bold tracking-widest text-zinc-300">
                AI Assistant Powered by Royal Braids
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-500 ${
          isOpen ? "bg-black text-white rotate-90" : "bg-black text-white hover:bg-zinc-800"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-7 w-7" />}
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
