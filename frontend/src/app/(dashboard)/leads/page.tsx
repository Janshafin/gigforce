"use client";

import { Target, Search, Filter, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function LeadsShowcasePage() {
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-12">
      
      {/* 1. Hero Section */}
      <section className="border-b border-[var(--border-default)] pb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center">
            <Target className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
              AI Lead Discovery Engine
            </h1>
            <p className="font-mono text-sm text-[var(--accent-secondary)] mt-1 uppercase tracking-widest">
              Feature Showcase
            </p>
          </div>
        </div>
        <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl">
          Stop scrolling through job boards for hours. Our AI Lead Engine runs 24/7 in the background, 
          identifying high-ticket clients that perfectly match your skills and budget requirements.
        </p>
      </section>

      {/* 2. How It Works Pipeline */}
      <section className="space-y-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Discovery Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 relative">
            <div className="absolute top-0 right-0 bg-[var(--bg-primary)] border-l border-b border-[var(--border-default)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">01</div>
            <Search className="w-8 h-8 text-[var(--text-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">Continuous Scanning</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We monitor Upwork, LinkedIn, Fiverr, and remote job boards every 5 minutes for new postings.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 relative">
            <div className="absolute top-0 right-0 bg-[var(--bg-primary)] border-l border-b border-[var(--border-default)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]">02</div>
            <Filter className="w-8 h-8 text-[var(--text-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">Smart Filtering</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              The AI reads the job description to ensure the budget, timeline, and tech stack match your profile.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--accent-primary)] p-8 relative shadow-[0_0_15px_rgba(216,107,61,0.1)]">
            <div className="absolute top-0 right-0 bg-[var(--accent-primary)] px-3 py-1 font-mono text-xs text-[var(--bg-primary)] font-bold">03</div>
            <ShieldCheck className="w-8 h-8 text-[var(--accent-primary)] mb-6" />
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-3">Quality Scoring</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We score the client's history. No more dealing with bad clients or race-to-the-bottom pricing.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Demo / Visualization */}
      <section className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 sm:p-12 mt-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h3 className="font-serif text-3xl text-[var(--text-primary)]">
              Only see leads with a 90%+ match.
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              When you upgrade your plan, the AI will populate your dashboard with curated opportunities. You simply review the lead and click one button to generate a proposal.
            </p>
            <ul className="space-y-4">
              {["Eliminates 10+ hours of searching per week", "Guarantees client budget alignment", "Alerts you instantly when high-fit jobs drop"].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-primary)] font-medium">
                  <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:w-1/2 w-full">
            {/* Abstract visual representation of a lead card */}
            <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)] p-6 transform rotate-2 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs font-mono font-bold px-3 py-1">
                98% FIT SCORE
              </div>
              <div className="space-y-4 opacity-80">
                <div className="flex justify-between items-start border-b border-[var(--border-default)] pb-4">
                  <div>
                    <div className="h-4 w-24 bg-[var(--border-default)] rounded mb-2"></div>
                    <div className="h-6 w-48 bg-[var(--text-secondary)] rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-[var(--accent-primary)] rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[var(--border-default)] rounded"></div>
                  <div className="h-3 w-5/6 bg-[var(--border-default)] rounded"></div>
                  <div className="h-3 w-4/6 bg-[var(--border-default)] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action */}
      <section className="text-center pt-8">
        <Link 
          href="/dashboard#pricing"
          className="inline-flex items-center justify-center bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] px-8 py-4 font-medium transition-colors"
        >
          Upgrade to Unlock Lead Engine
        </Link>
      </section>

    </div>
  );
}
