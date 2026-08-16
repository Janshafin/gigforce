"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Clock, FileText, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col selection:bg-[var(--accent-primary)]/30 selection:text-white">
      {/* 1. HEADER */}
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-20"
      >
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--text-primary)]">
            GigForge
          </span>
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-[var(--text-secondary)] text-xs font-mono tracking-wide mt-1 uppercase"
          >
            Your AI Co-Founder for Freelancing
          </motion.span>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 mt-4 sm:mt-0"
        >
          <Link
            href="/login"
            className="px-5 py-2 text-[var(--text-primary)] text-sm font-medium hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] text-sm font-medium hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
          >
            Sign Up
          </Link>
        </motion.div>
      </motion.header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center">
        
        {/* 2. HERO */}
        <div className="text-center max-w-4xl mx-auto my-12 sm:my-20 space-y-6">
          {/* Gemini Badge */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D86B3D" />
            </svg>
            Powered by Google Gemini
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight text-[var(--text-primary)]"
          >
            Stop losing 15–25 hours a week to admin, proposals, and client hunting.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="text-[var(--text-secondary)] font-sans text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Let your AI co-founder handle it while you focus on the work.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="pt-8"
          >
            <Link href="/signup" className="inline-block group">
              <div 
                className="relative inline-flex items-center justify-center bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 py-4 font-sans font-medium text-lg transition-all duration-300 group-hover:bg-[#c25e34] group-hover:shadow-lg group-hover:shadow-[var(--accent-primary)]/20"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 2.5. SOCIAL PROOF / STATS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full my-16 sm:my-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Clock, value: "15+", label: "Hours Saved Weekly" },
              { icon: FileText, value: "500+", label: "Proposals Generated" },
              { icon: TrendingUp, value: "3×", label: "Revenue Growth" },
              { icon: Zap, value: "< 10s", label: "Proposal Draft Time" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 text-center hover:border-[var(--text-secondary)] transition-colors"
                >
                  <Icon className="w-5 h-5 text-[var(--accent-primary)] mx-auto mb-3" />
                  <p className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-1">{stat.value}</p>
                  <p className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 3. FEATURES SECTION */}
        <div className="w-full my-24 sm:my-32">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-12"
          >
            Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "01",
                title: "Smart Profile Optimization",
                desc: "Auto-refines your Upwork, Fiverr, and LinkedIn profiles to attract higher-paying clients."
              },
              {
                id: "02",
                title: "AI-Written Proposals",
                desc: "Generates tailored, winning proposals in seconds — you just review and send."
              },
              {
                id: "03",
                title: "Contracts and Invoicing",
                desc: "Manages contracts and invoices automatically, so payments never slip through the cracks."
              },
              {
                id: "04",
                title: "Lead Finding and Qualification",
                desc: "Finds and scores the best-fit gigs so you stop wasting time on dead-end leads."
              }
            ].map((feature, i) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text-secondary)] flex flex-col"
              >
                <span className="font-mono text-xs text-[var(--text-secondary)] mb-4 uppercase tracking-widest">{feature.id} // Feature</span>
                <h3 className="font-sans font-medium text-xl text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] font-sans text-base leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. HOW IT WORKS */}
        <div className="w-full my-24 sm:my-32">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-16 text-center"
          >
            How It Works
          </motion.h2>

          <div className="relative max-w-3xl mx-auto space-y-12 sm:space-y-24">
            
            {/* Subtle connecting line */}
            <div className="absolute left-8 sm:left-1/2 top-10 bottom-10 w-px bg-[var(--border-default)] -translate-x-1/2 z-0 hidden sm:block"></div>

            {[
              {
                step: "1",
                title: "Connect Your Accounts",
                desc: "Link Upwork, Fiverr, or LinkedIn in seconds."
              },
              {
                step: "2",
                title: "Your Agent Gets to Work",
                desc: "It finds leads, drafts proposals, and manages the busywork in the background."
              },
              {
                step: "3",
                title: "Approve & Grow",
                desc: "Review everything before it's sent — you stay in control while your income scales."
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}
              >
                <div className="w-16 h-16 shrink-0 bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center font-serif text-2xl text-[var(--text-primary)]">
                  {item.step}
                </div>
                <div className={`bg-[var(--bg-secondary)] border border-[var(--border-default)] p-8 flex-1 w-full ${i % 2 === 1 ? 'sm:text-right' : ''}`}>
                  <h3 className="font-sans font-medium text-xl text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-base">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full my-24 sm:my-32 text-center"
        >
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-12 sm:p-20 flex flex-col items-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-8">
              Ready to build your freelance business faster?
            </h2>
            <Link href="/signup" className="inline-block group">
              <div 
                className="relative inline-flex items-center justify-center bg-[var(--accent-primary)] text-[var(--bg-primary)] px-8 py-4 font-sans font-medium text-lg transition-all duration-300 group-hover:bg-[#c25e34] group-hover:shadow-lg group-hover:shadow-[var(--accent-primary)]/20"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </motion.div>

      </main>

      {/* 6. FOOTER */}
      <footer className="w-full border-t border-[var(--border-default)] py-8 px-6 text-center mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-sans text-[var(--text-primary)] text-sm">
            GigForge — Your AI Co-Founder for Freelancers
          </p>
          <p className="text-[var(--text-secondary)] text-xs">
            © 2026 GigForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
