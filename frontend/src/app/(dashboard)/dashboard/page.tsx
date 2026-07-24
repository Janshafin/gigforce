"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  UserCheck,
  ChevronRight,
  Bot
} from "lucide-react";
import { getDashboardSummary, sendChatMessage, DashboardSummary } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hey Sarah! TechCorp AI just submitted their requirements. I can draft a high-converting 3-phase proposal for $12,500 right now. Want me to generate it?"
    }
  ]);
  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userText }]);
    setSendingChat(true);

    try {
      const res = await sendChatMessage(userText);
      setChatMessages((prev) => [...prev, { role: "assistant", content: res.content }]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I've logged your action: "${userText}". Gemini AI co-founder agent is ready!` }
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Welcome back, Sarah <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Your AI co-founder active pipeline summary for today
          </p>
        </div>
        <Link
          href="/chat"
          className="gradient-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Chat Workspace</span>
        </Link>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Proposals Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-cyan-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Proposals
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white font-mono">
              {loading ? "..." : data?.active_proposals_count || 12}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2 this week
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            4 pending client review
          </p>
        </div>

        {/* Leads Pipeline Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-violet-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Leads Pipeline Value
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white font-mono">
              ${loading ? "..." : (data?.leads_pipeline_value || 45200).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            5 qualified high-ticket leads
          </p>
        </div>

        {/* Monthly Earnings Card */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border-t-2 border-t-emerald-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monthly Earnings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white font-mono">
              ${loading ? "..." : (data?.monthly_earnings || 8400).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> On track for $12k
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            100% collected on time
          </p>
        </div>
      </div>

      {/* Main 2-Column Section (70/30 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Recent Leads & Proposals) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Leads Pipeline */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-white">Recent Leads Pipeline</h3>
                <p className="text-xs text-slate-400">AI scored and prioritized lead opportunities</p>
              </div>
              <Link href="/proposals" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Project Title</th>
                    <th className="py-3 px-3">Value</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">Loading leads pipeline...</td>
                    </tr>
                  ) : (
                    (data?.recent_leads || []).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">{lead.client_name}</div>
                          <div className="text-[10px] text-slate-400">{lead.source}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-200">{lead.project_title}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-cyan-300">${lead.value.toLocaleString()}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            lead.status === "In Discussion" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                            lead.status === "Proposal Sent" ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" :
                            lead.status === "Won" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" :
                            "bg-slate-800 text-slate-300 border-slate-700"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link href={`/chat?lead=${lead.id}`} className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold inline-flex items-center gap-1">
                            <span>Write Proposal</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Proposal Drafts */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white">Active Proposal Drafts</h3>
              <span className="text-xs text-slate-400">Auto-saved via Gemini Engine</span>
            </div>

            <div className="space-y-3">
              {(data?.active_proposals || []).map((prop) => (
                <div key={prop.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{prop.title}</h4>
                      <p className="text-xs text-slate-400">{prop.client_name} &bull; ${prop.pricing.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      v{prop.version}.0
                    </span>
                    <Link
                      href="/proposals"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Resume Draft
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Embedded Interactive AI Co-Founder Chat Panel) */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-[620px] border border-cyan-500/20 shadow-xl shadow-cyan-950/30">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center text-slate-950 font-bold">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Co-Founder</h3>
                  <p className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> Gemini 1.5 Pro Active
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                Live Strategist
              </span>
            </div>

            {/* Chat Stream Area */}
            <div className="space-y-4 overflow-y-auto h-[420px] pr-2 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none"
                        : "bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none shadow-md"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold mb-1">
                        <Sparkles className="w-3 h-3" /> Co-Founder Intelligence
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                    <span>Gemini is analyzing lead data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Chat Input Box */}
          <form onSubmit={handleSendChat} className="pt-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask co-founder to write proposal..."
              className="flex-1 bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={sendingChat}
              className="gradient-button text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
