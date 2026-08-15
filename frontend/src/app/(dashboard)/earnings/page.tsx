"use client";

import { TrendingUp, FileSignature, Wallet, LineChart } from "lucide-react";
import Link from "next/link";

export default function EarningsShowcasePage() {
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-12">
      
      {/* 1. Hero Section */}
      <section className="border-b border-[var(--border-default)] pb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
              Revenue Management
            </h1>
            <p className="font-mono text-sm text-[var(--accent-secondary)] mt-1 uppercase tracking-widest">
              Feature Showcase
            </p>
          </div>
        </div>
        <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl">
          Stop chasing invoices and scrambling to write contracts. GigForge automates your back-office so you get paid faster and maintain a professional image.
        </p>
      </section>

      {/* 2. Features Grid */}
      <section className="space-y-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Financial Infrastructure</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8">
            <FileSignature className="w-8 h-8 text-[var(--accent-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">One-Click Contracts</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              When a client accepts your proposal, GigForge instantly generates a legally sound contract based on the agreed terms. E-signatures included.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8">
            <Wallet className="w-8 h-8 text-[var(--accent-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">Automated Invoicing</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Set milestones inside the dashboard. When a milestone is reached, the invoice is automatically generated and sent to the client.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 md:col-span-2">
            <LineChart className="w-8 h-8 text-[var(--accent-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">Income Analytics</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              Track your MRR (Monthly Recurring Revenue), project win rates, and pending payments. Predict your income instead of guessing.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Action */}
      <section className="text-center pt-8 border-t border-[var(--border-default)]">
        <Link 
          href="/dashboard#pricing"
          className="inline-flex items-center justify-center bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] px-8 py-4 font-medium transition-colors"
        >
          Upgrade to Unlock Revenue Tools
        </Link>
      </section>

    </div>
  );
}
