"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  DollarSign, 
  Copy, 
  Check,
  Lightbulb
} from "lucide-react";
import { getChatHistory, sendChatMessage, ChatMessage } from "@/lib/api";

const promptTemplates = [
  {
    title: "Draft High-Converting Proposal",
    prompt: "Write a high-converting 3-phase proposal for a $12,500 Next.js + FastAPI project with TechCorp AI.",
    icon: FileText,
    badge: "Most Used"
  },
  {
    title: "Scope & Value Pricing",
    prompt: "Calculate fixed-fee pricing options (Basic, Pro, Enterprise) for a client requesting a full web app migration.",
    icon: DollarSign
  },
  {
    title: "Handle Client Objection",
    prompt: "Craft a polite, firm response to a client asking for a 30% discount on my proposed $15,000 scope.",
    icon: Lightbulb
  },
  {
    title: "Generate Follow-Up Email",
    prompt: "Draft a high-impact follow-up email for a proposal sent 3 days ago that hasn't received a response.",
   icon: Send
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory()
      .then((res) => {
        setMessages(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || sending) return;

    if (!textToSend) setInput("");
    setSending(true);

    const tempUserMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: query,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendChatMessage(query);
      setMessages((prev) => [...prev, res]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: `I've analyzed your prompt: "${query}". I'm ready to write your proposal, structure your milestones, or optimize your rates!`,
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col justify-between max-w-6xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Co-Founder Workspace
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 1.5 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive strategic advisor for freelance proposals, pricing, & lead management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Google AI Studio API Enabled</span>
        </div>
      </div>

      {/* Quick Prompt Templates Header Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {promptTemplates.map((t, idx) => {
          const Icon = t.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(t.prompt)}
              className="p-3.5 rounded-xl glass-card glass-card-hover text-left flex flex-col justify-between group border border-white/5 hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                {t.badge && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {t.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {t.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Scrollable Messages Stream */}
      <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto space-y-6 border border-white/10 shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Loading AI conversation history...
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-2xl relative group ${
                  msg.role === "user"
                    ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none"
                    : "bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none shadow-xl"
                }`}
              >
                {/* Role indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    msg.role === "user" ? "text-cyan-300" : "text-violet-400"
                  }`}>
                    {msg.role === "user" ? "You" : <><Sparkles className="w-3.5 h-3.5" /> AI Co-Founder</>}
                  </span>

                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="text-xs leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Structured Action Meta Card (if proposal generated) */}
                {msg.action_meta && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-cyan-300">Generated Action Artifact</span>
                      <span className="text-[10px] text-slate-400 ">Proposal Draft</span>
                    </div>
                    <p className="text-white font-medium">{msg.action_meta.title}</p>
                    <p className="text-cyan-400  text-[11px] mt-1">
                      Budget: ${msg.action_meta.pricing?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-400 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Gemini Co-Founder is generating proposal content...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="glass-card rounded-2xl p-2.5 border border-white/10 flex gap-3 shadow-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI Co-Founder to write a proposal, analyze a lead, or calculate rates..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 px-4 py-2.5 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="gradient-button text-white px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
