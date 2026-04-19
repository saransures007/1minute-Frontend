"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, RefreshCw, WandSparkles, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import MainLayout from "@/components/MainLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { apiService } from "@/lib/api/api";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isNew?: boolean;
};

export default function SmartStoreGenie() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Vanakkam! ✨ I'm Genie, your magical smart store assistant.\nAsk me anything about products, prices, availability or recommendations.\nI speak English, Tamil & Tanglish!",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // Render content with proper line breaks
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await apiService.chat(currentInput);

      const replyText =
        apiResponse?.data?.reply ||
        apiResponse?.reply ||
        "Sorry, Genie couldn't understand your wish.";

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: replyText,
        timestamp: new Date(),
        isNew: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToBottom();

      // Remove animation flag after effect
setTimeout(() => {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === assistantMessage.id
        ? { ...msg, isNew: false }
        : msg
    )
  );
}, 2300); // match animation
    } catch (err) {
      console.error(err);
      setError("Genie is trapped in the lamp... Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "⚠️ The magic failed. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm("Clear your chat with Genie?")) {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: "✨ Poof! Chat has been cleared.\Vanakkam! I'm Genie — ready for your next wish!",
        },
      ]);
    }
  };

  // ==================== QUICK SUGGESTIONS ====================
  const quickSuggestions = [
    "What cold drinks do you have?",
    "Is the store open right now?",
    "Show me snacks under ₹50",
    "Do you have Dairy Milk?",
    "What is the price of KitKat?",
    "Suggest something good for evening",
    "Any new arrivals?",
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    if (loading) return;
    setInput(suggestion);
    // Small delay for better UX
    setTimeout(() => {
      sendMessage();
    }, 80);
  };

  return (
    <MainLayout>
      <AnimatedSection className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-card px-8 py-4 rounded-3xl shadow mb-6 border">
              <WandSparkles className="w-10 h-10 text-amber-500" />
              <h1 className="text-5xl font-display font-bold tracking-tight">
                Meet <span className="text-gradient-hero">Genie</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Your magical AI store assistant • Real-time • English  &amp; Tamil  supported
            </p>
          </div>

          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-card h-[720px] flex flex-col">
            {/* Genie Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent px-6 py-5 flex items-center justify-between border-b">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                  🧞
                  <div className="absolute -top-1 -right-1 text-amber-300 animate-spin-slow">
                    ✨
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-semibold">Genie</p>
                  <p className="text-xs text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Magical Mode • Always Ready
                  </p>
                </div>
              </div>

              <Button
                onClick={clearChat}
                variant="ghost"
                className="text-sm hover:bg-red-50 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Wish
              </Button>
            </div>

            {/* Chat Messages Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-9 bg-[radial-gradient(#f1f1f1_1px,transparent_1px)] bg-[length:28px_28px]"
            >

{messages.map((msg) => (
  <div
    key={msg.id}
    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
  >
    {/* Genie Avatar */}
    {msg.role === "assistant" && (
      <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex-shrink-0 mr-4 flex items-center justify-center text-2xl shadow-inner relative">
        🧞
      </div>
    )}

    {/* Message Bubble */}
<motion.div
  initial={
    msg.role === "assistant" && msg.isNew
      ? {
          opacity: 0,
          filter: "blur(14px)",
          clipPath: "inset(0 100% 0 0)",
        }
      : false
  }
  animate={{
    opacity: 1,
    filter: "blur(0px)",
    clipPath: "inset(0 0% 0 0)",
  }}
  transition={{
    duration: 2.2,
    ease: [0.22, 1, 0.36, 1],
  }}
  className={`relative max-w-[78%] px-7 py-5 rounded-3xl text-[15.5px] leading-relaxed shadow
    ${
      msg.role === "user"
        ? "bg-primary text-primary-foreground rounded-br-none"
        : "bg-gradient-to-br from-amber-50 via-white to-amber-50 border border-amber-100 rounded-bl-none overflow-hidden"
    }`}
>
      {/* Content */}
      {msg.role === "assistant" ? (
        <div className="whitespace-pre-line">{renderContent(msg.content)}</div>
      ) : (
        msg.content
      )}

      {/* ✨ SPARKLE SYSTEM */}
{msg.role === "assistant" && msg.isNew && (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(22)].map((_, i) => {
      const progress = i / 22;

      return (
        <span
          key={i}
          className="dust-ltr"
          style={{
            left: `${progress * 100}%`,
            animationDelay: `${progress * 1.3}s`,
          }}
        />
      );
    })}
  </div>
)}
    </motion.div>

    {/* User Avatar */}
    {msg.role === "user" && (
      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex-shrink-0 ml-4 flex items-center justify-center">
        👤
      </div>
    )}
  </div>
))}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-4 bg-gradient-to-br from-amber-50 to-white px-7 py-5 rounded-3xl border border-amber-200">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl relative">
                      🧞
                      <div className="absolute inset-0 rounded-2xl border-4 border-amber-300/60 animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-amber-700 font-medium">Genie is weaving magic...</p>
                      <p className="text-xs text-amber-600">Please wait</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length < 1 && (
              <div className="px-6 py-4 border-t bg-card">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 px-1">
                  Quick Wishes
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      disabled={loading}
                      className="text-sm px-5 py-2.5 bg-white hover:bg-amber-50 border border-amber-200 hover:border-amber-400 rounded-3xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t bg-card">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Tell Genie your wish..."
                  className="flex-1 py-7 px-6 rounded-3xl text-base border-2 focus:border-amber-500 shadow-inner"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="h-14 w-14 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground mt-3">
                ✨ Powered by Magic & Real Store Data
              </p>
            </div>
          </Card>
        </div>
      </AnimatedSection>
    </MainLayout>
  );
}