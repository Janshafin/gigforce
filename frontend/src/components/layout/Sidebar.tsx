"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  FileText, 
  Settings, 
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Chat Workspace", href: "/chat", icon: MessageSquareCode, badge: "Gemini 1.5" },
  { name: "Proposals & Leads", href: "/proposals", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen glass-panel fixed left-0 top-0 z-40 flex flex-col justify-between p-5 border-r border-white/10 text-slate-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              GigForge <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Freelancer AI Co-Founder</p>
          </div>
        </div>

        {/* AI Co-Founder Active Status Pill */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">Co-Founder Agent</p>
              <p className="text-cyan-400 text-[10px]">Gemini 1.5 Flash Active</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Account card */}
      <div className="pt-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">
              SJ
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sarah Jenkins</p>
              <p className="text-[11px] text-slate-400">Pro Freelancer</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
}
