"use client";

import { Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getChatHistory, sendChatMessage } from "@/lib/api";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

export default function AICoFounderPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const data = await getChatHistory();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(userMessage.content);
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col pt-4">
      <div className="flex-1 overflow-y-auto space-y-6 pb-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 bg-[var(--bg-secondary)]">
              <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-primary)] leading-relaxed">
                Loading AI Co-Founder...
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-4">
            <div className={`w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-primary)]'}`}>
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
              ) : (
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-primary)] leading-relaxed mt-1">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded border border-[var(--border-default)] flex items-center justify-center shrink-0 bg-[var(--bg-secondary)] animate-pulse">
              <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="space-y-4">
              <p className="font-sans text-[var(--text-secondary)] leading-relaxed mt-1">
                Thinking...
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[var(--bg-primary)] pt-4 pb-8 mt-auto shrink-0 border-t border-[var(--border-default)]">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {["Find new clients", "Write a proposal", "Review my rates", "Improve profile"].map((action) => (
            <button 
              key={action} 
              onClick={() => setInput(action)}
              className="whitespace-nowrap px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-[var(--text-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono uppercase tracking-wide transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Co-Founder to do something..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] rounded-none px-4 py-4 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none h-16 outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
