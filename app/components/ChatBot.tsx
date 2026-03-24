"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  X,
  Send,
  Package,
  RotateCcw,
  MessageCircle,
  MessageSquareMore,
} from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user" | "agent";
  time: string;
};

const DEFAULT_WHATSAPP_NUMBER = "256781662904";

export default function ChatBot({
  logoUrl,
  phoneNumber,
}: {
  logoUrl?: string;
  phoneNumber?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const whatsappNumber = (phoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    "",
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const existingSessionId =
      window.localStorage.getItem("royal_braids_chat_session") ||
      crypto.randomUUID();

    window.localStorage.setItem("royal_braids_chat_session", existingSessionId);
    setSessionId(existingSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function initializeSession() {
      try {
        const response = await fetch("/api/chat/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!cancelled && Array.isArray(data?.messages)) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
      }
    }

    void initializeSession();

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(
          `/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
          },
        );
        const data = await response.json();

        if (!cancelled && Array.isArray(data?.messages)) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to refresh chat messages:", error);
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sessionId]);

  async function sendMessage(text: string) {
    if (!sessionId) return;

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, text }),
      });

      const data = await response.json();

      if (Array.isArray(data?.messages)) {
        setMessages((prev) => {
          const knownIds = new Set(prev.map((message) => message.id));
          const nextMessages = [...prev];

          data.messages.forEach((message: Message) => {
            if (!knownIds.has(message.id)) {
              nextMessages.push(message);
            }
          });

          return nextMessages;
        });
      }
    } catch (error) {
      console.error("Failed to send chat message:", error);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSend() {
    if (!input.trim()) return;

    const text = input.trim();
    setInput("");
    void sendMessage(text);
  }

  function handleQuickReply(text: string) {
    void sendMessage(text);
  }

  const whatsappUrl = useMemo(() => {
    const transcript = messages
      .map((msg) => {
        const sender = msg.sender === "user" ? "Customer" : "Royal Assistant";
        return `${sender}: ${msg.text}`;
      })
      .join("\n");

    const finalMessage =
      `Hello Royal Braids, I was chatting on your website.\n\n` +
      `Chat transcript:\n${transcript}\n\n` +
      `Please continue with me here on WhatsApp.`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      finalMessage,
    )}`;
  }, [messages, whatsappNumber]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[370px] overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-black px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#b88a2d] bg-[#111]">
                  <img
                    src={logoUrl || "/royal-braids-logo.png"}
                    alt="Royal Braids Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-black bg-[#00d26a]" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">
                  Royal Assistant
                </h3>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#00d26a]">
                  Online Now
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white transition hover:opacity-80"
              aria-label="Close chat"
            >
              <X size={22} />
            </button>
          </div>

          <div className="bg-[#f6f6f6] px-5 py-5">
            <div
              ref={scrollRef}
              className="h-[310px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300"
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[255px] rounded-[18px] px-4 py-3 shadow-sm ${
                        message.sender === "user"
                          ? "bg-black text-white"
                          : message.sender === "agent"
                            ? "border border-[#d3f3df] bg-[#ecfff4] text-[#1f4d31]"
                            : "border border-[#e4e4e4] bg-white text-[#333]"
                      }`}
                    >
                      <p className="text-[15px] leading-6">{message.text}</p>
                      <span
                        className={`mt-2 block text-[11px] ${
                          message.sender === "user"
                            ? "text-white/70"
                            : message.sender === "agent"
                              ? "text-[#5a8b68]"
                              : "text-[#999]"
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-[18px] border border-[#e4e4e4] bg-white px-4 py-3 shadow-sm">
                      <p className="text-sm text-[#777]">Typing...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleQuickReply("Track My Order")}
                className="flex items-center gap-2 rounded-full border border-[#dbdbdb] bg-white px-4 py-3 text-[14px] font-medium text-[#444] transition hover:bg-[#f2f2f2]"
              >
                <Package size={16} />
                Track My Order
              </button>

              <button
                onClick={() => handleQuickReply("Returns & Exchanges")}
                className="flex items-center gap-2 rounded-full border border-[#dbdbdb] bg-white px-4 py-3 text-[14px] font-medium text-[#444] transition hover:bg-[#f2f2f2]"
              >
                <RotateCcw size={16} />
                Returns & Exchanges
              </button>
            </div>

            <div className="mt-5 rounded-full border border-[#dfdfdf] bg-white px-4 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="h-10 flex-1 bg-transparent text-[14px] text-[#333] outline-none placeholder:text-[#c8c8c8]"
                />

                <button
                  onClick={handleSend}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ededed] text-[#9a9a9a] transition hover:bg-black hover:text-white"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <MessageSquareMore size={18} />
              Continue on WhatsApp
            </a>

            <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[1.4px] text-[#c6c6c6]">
              AI Assistant Powered by Royal Braids
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
