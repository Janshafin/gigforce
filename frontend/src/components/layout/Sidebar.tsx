"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  TrendingUp,
  Bot,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("gigforge_token");
    localStorage.removeItem("gigforge_user");

    router.push("/login");
  };

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-8 mb-2 border-b border-[var(--border-default)]">
        <h1 className="font-serif font-bold text-2xl tracking-tight text-[var(--text-primary)]">
          GigForge
        </h1>
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-5 left-4 z-50 p-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: slide-in drawer */}
      <aside
        className={`
          w-72 h-screen bg-[var(--bg-primary)] fixed left-0 top-0 z-50 flex flex-col border-r border-[var(--border-default)] font-sans
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
