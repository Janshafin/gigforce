"use client";

import { Bell, Search, Bot, Cloud, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="h-16 glass-panel border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-30 ml-72">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads, proposals, client chats..."
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-4">
        {/* Gemini Engine Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">Model:</span>
          <span className="text-cyan-300 font-mono font-semibold">Gemini 1.5 (AI Studio API)</span>
        </div>

        {/* Cloud Run Readiness Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300">
          <Cloud className="w-4 h-4 text-violet-400" />
          <span>Cloud Run Ready</span>
        </div>

        {/* Notifications Button */}
        <button className="relative p-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </button>

        {/* New Proposal Quick Action Button */}
        <Link
          href="/chat"
          className="gradient-button text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
        >
          <span>Ask Co-Founder</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
