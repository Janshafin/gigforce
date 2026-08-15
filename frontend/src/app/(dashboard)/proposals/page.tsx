"use client";

import { FileText, Wand2, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function ProposalsShowcasePage() {
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-12">
      
      {/* 1. Hero Section */}
      <section className="border-b border-[var(--border-default)] pb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center">
            <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
              Proposal Automation
            </h1>
            <p className="font-mono text-sm text-[var(--accent-secondary)] mt-1 uppercase tracking-widest">
              Feature Showcase
            </p>
          </div>
        </div>
        <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl">
          Writing proposals is soul-crushing. Our AI analyzes the client's job description, references your uploaded portfolio, and crafts a hyper-personalized, winning pitch in 3 seconds.
        </p>
      </section>

      {/* 2. Before & After */}
      <section className="space-y-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">The GigForge Difference</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Without GigForge */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8">
            <div className="inline-block px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-xs uppercase tracking-widest mb-6">
              Without AI
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="font-mono text-[var(--text-secondary)]">01</span>
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Copy-paste templates</p>
                  <p className="text-sm text-[var(--text-secondary)]">Clients spot generic templates instantly and ignore them.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[var(--text-secondary)]">02</span>
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Time intensive</p>
                  <p className="text-sm text-[var(--text-secondary)]">Takes 20-30 minutes to write a good custom proposal.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-[var(--text-secondary)]">03</span>
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Low conversion</p>
                  <p className="text-sm text-[var(--text-secondary)]">Average freelancers win less than 10% of their bids.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* With GigForge */}
          <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)] p-8 relative shadow-lg">
            <div className="inline-block px-3 py-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs font-bold uppercase tracking-widest mb-6">
              With GigForge
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <Wand2 className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Hyper-Personalized</p>
                  <p className="text-sm text-[var(--text-secondary)]">AI addresses specific pain points mentioned in the job post.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ArrowRight className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Instant Generation</p>
                  <p className="text-sm text-[var(--text-secondary)]">1 click. 3 seconds. Ready to review and send.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <UserCheck className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Portfolio Integration</p>
                  <p className="text-sm text-[var(--text-secondary)]">Automatically links to your most relevant past projects.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Action */}
      <section className="text-center pt-8 border-t border-[var(--border-default)]">
        <Link 
          href="/dashboard#pricing"
          className="inline-flex items-center justify-center bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] px-8 py-4 font-medium transition-colors"
        >
          Upgrade for Unlimited Proposals
        </Link>
      </section>

    </div>
  );
}
