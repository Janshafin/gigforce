"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#051424] text-[#f1f5f9] font-mono flex flex-col selection:bg-[#22d3ee]/30 selection:text-[#22d3ee]">
      {/* 1. NAVBAR */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[#030d18] border-b border-slate-800/60 px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl z-20"
      >
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#a855f7] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#f1f5f9] font-mono">
              GigForge
            </span>
          </div>
          <span className="text-[#22d3ee] text-xs font-mono font-medium tracking-wide mt-1.5 sm:pl-14">
            Your AI Co-Founder for Freelancing
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-full border border-[#22d3ee]/50 text-[#f1f5f9] text-xs font-mono font-semibold tracking-wider uppercase hover:border-[#22d3ee] hover:bg-[#22d3ee]/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all duration-200"
          >
            SIGN-IN
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-full border border-[#22d3ee]/50 text-[#f1f5f9] text-xs font-mono font-semibold tracking-wider uppercase hover:border-[#22d3ee] hover:bg-[#22d3ee]/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all duration-200"
          >
            SIGN-UP
          </Link>
        </div>
      </motion.header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center">
        
        {/* 2. HERO SUBTEXT */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center max-w-3xl mx-auto my-6 sm:my-10 space-y-2 px-2"
        >
          <p className="text-slate-300/90 italic font-mono text-base sm:text-lg md:text-xl leading-relaxed">
            Stop losing 15-25 hours a week to admin, proposals, and client hunting
          </p>
          <p className="text-slate-300/90 italic font-mono text-base sm:text-lg md:text-xl leading-relaxed">
            let your AI co-founder handle it while you focus on the work.
          </p>
        </motion.div>

        {/* 3. PRIMARY CTA BUTTON (HEXAGON) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="my-8 sm:my-12"
        >
          <Link href="/dashboard" className="block group">
            <div 
              className="relative inline-block filter drop-shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-transform duration-300 group-hover:scale-105"
              style={{
                clipPath: "polygon(22px 0%, calc(100% - 22px) 0%, 100% 50%, calc(100% - 22px) 100%, 22px 100%, 0% 50%)",
                background: "linear-gradient(135deg, #2dd4bf, #22d3ee, #0d9488)",
                padding: "2px",
              }}
            >
              <div 
                className="px-8 sm:px-12 py-4 sm:py-5 bg-[#14332e] group-hover:bg-[#184039] text-[#f1f5f9] font-mono font-bold text-sm sm:text-base tracking-wider uppercase transition-colors text-center min-w-[260px] sm:min-w-[320px]"
                style={{
                  clipPath: "polygon(21px 0%, calc(100% - 21px) 0%, 100% 50%, calc(100% - 21px) 100%, 21px 100%, 0% 50%)",
                }}
              >
                GET STARTED FOR FREE
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 4. TWO-COLUMN LAYOUT (FEATURES & HOW IT WORKS) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start my-8 sm:my-16">
          
          {/* LEFT COLUMN: FEATURES */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-slate-100 mb-8 uppercase text-left">
              FEATURES
            </h2>

            {/* 2x2 FEATURE GRID WITH TOUCHING BORDERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
              
              {/* Top-Left: Smart Profile Optimization */}
              <div className="bg-[#112a1f] p-6 sm:p-7 flex flex-col justify-start border-b sm:border-r border-slate-700/50 min-h-[190px] transition-colors hover:bg-[#153426]">
                <h3 className="font-mono font-bold italic text-sm sm:text-base text-[#6ee7b7] tracking-wide mb-3 uppercase leading-snug">
                  SMART PROFILE OPTIMIZATION
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Auto-refines your Upwork, Fiverr, and LinkedIn profiles to attract higher-paying clients.
                </p>
              </div>

              {/* Top-Right: AI-Written Proposals */}
              <div className="bg-[#1d1738] p-6 sm:p-7 flex flex-col justify-start border-b border-slate-700/50 min-h-[190px] transition-colors hover:bg-[#231c44]">
                <h3 className="font-mono font-bold italic text-sm sm:text-base text-[#c084fc] tracking-wide mb-3 uppercase leading-snug">
                  AI-WRITTEN PROPOSALS
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Generates tailored, winning proposals in seconds - you just review and send.
                </p>
              </div>

              {/* Bottom-Left: Contracts & Invoicing */}
              <div className="bg-[#371224] p-6 sm:p-7 flex flex-col justify-start border-b sm:border-b-0 sm:border-r border-slate-700/50 min-h-[190px] transition-colors hover:bg-[#42162b]">
                <h3 className="font-mono font-bold italic text-sm sm:text-base text-[#f472b6] tracking-wide mb-3 uppercase leading-snug">
                  CONTRACTS AND INVOICING
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Manages contracts and invoices automatically, so payments never slip through the cracks.
                </p>
              </div>

              {/* Bottom-Right: Lead Finding & Qualification */}
              <div className="bg-[#441126] p-6 sm:p-7 flex flex-col justify-start min-h-[190px] transition-colors hover:bg-[#50142d]">
                <h3 className="font-mono font-bold italic text-sm sm:text-base text-[#f472b6] tracking-wide mb-3 uppercase leading-snug">
                  LEAD FINDING AND QUALIFICATION
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Finds and scores the best-fit gigs so you stop wasting time on dead-end leads.
                </p>
              </div>

            </div>
          </motion.div>

          {/* RIGHT COLUMN: HOW IT WORKS? */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative flex flex-col pt-4 lg:pt-0"
          >
            {/* Desktop & Mobile Layout for Step Cards and Heading */}
            <div className="relative w-full flex flex-col space-y-6 lg:space-y-8">
              
              {/* SVG Connecting Arrows (Visible on lg screens) */}
              <svg 
                className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                style={{ minHeight: "520px" }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="8"
                    refX="9"
                    refY="4"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 4, 0 8" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Arrow 1: From Card 1 bottom right to Card 2 top right/middle */}
                <path
                  d="M 330 90 C 440 90, 440 210, 430 220"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="none"
                  markerEnd="url(#arrowhead)"
                />

                {/* Arrow 2: From Card 2 bottom left to Card 3 top right */}
                <path
                  d="M 350 330 C 350 430, 290 430, 280 435"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="none"
                  markerEnd="url(#arrowhead)"
                />
              </svg>

              {/* CARD 1: Connect Your Accounts */}
              <div className="lg:w-[68%] lg:ml-[5%] bg-[#1c3c37] p-6 sm:p-7 rounded-3xl border border-[#22d3ee]/20 shadow-xl transition-all duration-300 hover:border-[#22d3ee]/40 relative z-20">
                <h3 className="font-mono font-bold italic text-base sm:text-lg text-slate-100 mb-2">
                  1. Connect Your Accounts
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Link Upwork, Fiverr, or LinkedIn in seconds.
                </p>
              </div>

              {/* MIDDLE ROW: "HOW IT WORKS?" HEADING & CARD 2 */}
              <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 relative z-20">
                {/* Heading positioned vertically between Card 1 & Card 2 on desktop */}
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-slate-100 uppercase text-center lg:text-left lg:w-[45%] self-center my-2 lg:my-0">
                  HOW IT WORKS?
                </h2>

                {/* CARD 2: Your Agent Gets to Work (Largest card, shifted right) */}
                <div className="w-full lg:w-[72%] bg-[#0d4576] p-7 sm:p-8 rounded-3xl border border-[#38bdf8]/30 shadow-2xl transition-all duration-300 hover:border-[#38bdf8]/50">
                  <h3 className="font-mono font-bold italic text-lg sm:text-xl text-slate-100 mb-3">
                    2. Your Agent Gets to Work
                  </h3>
                  <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                    It finds leads, drafts proposals, and manages the busywork in the background.
                  </p>
                </div>
              </div>

              {/* CARD 3: Approve & Grow (Shifted back left near Card 1's position) */}
              <div className="lg:w-[70%] lg:ml-[3%] bg-[#3f6597] p-6 sm:p-7 rounded-3xl border border-blue-300/20 shadow-xl transition-all duration-300 hover:border-blue-300/40 relative z-20">
                <h3 className="font-mono font-bold italic text-base sm:text-lg text-slate-100 mb-2">
                  3. Approve & Grow
                </h3>
                <p className="text-slate-200 italic font-mono text-xs sm:text-sm leading-relaxed">
                  Review everything before it's sent - you stay in control while your income scales.
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 5. SECONDARY CTA (HEXAGON) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-12 sm:my-20 text-center"
        >
          <Link href="/dashboard" className="block group">
            <div 
              className="relative inline-block filter drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-transform duration-300 group-hover:scale-105"
              style={{
                clipPath: "polygon(22px 0%, calc(100% - 22px) 0%, 100% 50%, calc(100% - 22px) 100%, 22px 100%, 0% 50%)",
                background: "linear-gradient(135deg, #2dd4bf, #22d3ee, #0d9488)",
                padding: "2px",
              }}
            >
              <div 
                className="px-8 sm:px-14 py-6 sm:py-7 bg-[#14332e] group-hover:bg-[#184039] text-[#f1f5f9] transition-colors text-center min-w-[300px] sm:min-w-[420px] flex flex-col items-center justify-center space-y-1.5"
                style={{
                  clipPath: "polygon(21px 0%, calc(100% - 21px) 0%, 100% 50%, calc(100% - 21px) 100%, 21px 100%, 0% 50%)",
                }}
              >
                <p className="font-mono font-bold italic text-base sm:text-lg text-slate-100">
                  Ready to build your freelance business faster?
                </p>
                <span className="font-mono italic text-sm sm:text-base text-[#22d3ee] group-hover:underline">
                  [Get Started Free]
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

      </main>

      {/* 6. FOOTER */}
      <footer className="w-full bg-[#3a5e8c] border-t border-slate-700/40 py-6 px-4 text-center mt-auto">
        <div className="max-w-4xl mx-auto space-y-1.5 font-mono">
          <p className="font-bold text-slate-100 text-sm sm:text-base">
            GigForge - Your AI Co-Founder for Freelancers
          </p>
          <p className="text-slate-200/80 text-xs sm:text-sm">
            © 2026 GigForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
