"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  TrendingUp,
  Bot
} from "lucide-react";

const primaryNavItems = [
  { name: "Getting Started", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Lead Engine", href: "/leads", icon: Target },
  { name: "Proposal Automation", href: "/proposals", icon: FileText },
  { name: "Revenue Management", href: "/earnings", icon: TrendingUp },
  { name: "Ask Co-Founder", href: "/ai-co-founder", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("gigforge_token");
    localStorage.removeItem("gigforge_user");

    router.push("/login");
  };

  return (
    <aside className="w-72 h-screen bg-[var(--bg-primary)] fixed left-0 top-0 z-40 flex flex-col border-r border-[var(--border-default)] font-sans">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-8 mb-2 border-b border-[var(--border-default)]">
        <h1 className="font-serif font-bold text-2xl tracking-tight text-[var(--text-primary)]">
          GigForge
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8">
        
        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest mb-4">
            Feature Explorer
          </p>
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--bg-secondary)] text-[var(--accent-primary)] border border-[var(--border-default)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Account card */}
      <div className="p-4 border-t border-[var(--border-default)]">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center font-serif text-[var(--text-primary)] text-sm">
              SJ
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--text-primary)]">Sarah Jenkins</span>
              <button
                onClick={handleLogout}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-left transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
