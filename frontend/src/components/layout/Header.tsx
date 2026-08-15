"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-[var(--bg-primary)] border-b border-[var(--border-default)] px-8 flex items-center justify-between sticky top-0 z-30 ml-72 font-sans">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search leads, proposals..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] px-4 pl-10 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
        />
      </div>

      {/* Quick Action Badges */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full"></span>
        </button>

        {/* New Proposal Quick Action Button */}
        <button
          className="bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] text-sm font-medium px-5 py-2 transition-colors"
        >
          Ask Co-Founder
        </button>
      </div>
    </header>
  );
}
