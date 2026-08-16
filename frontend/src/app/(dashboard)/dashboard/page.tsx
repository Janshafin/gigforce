"use client";

import { useState } from "react";
import { Target, FileText, TrendingUp, CheckCircle2 } from "lucide-react";
export default function DashboardPortalPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: "pro" | "elite") => {
    try {
      setLoadingPlan(plan);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create checkout session");
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      
      {/* 1. Welcome & Free Trial Banner */}
      <section className="pt-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-2">
              Welcome to GigForge.
            </h1>
            <p className="font-sans text-[var(--text-secondary)]">
              Your AI Co-Founder is ready to be configured. Let's get you set up.
            </p>
          </div>
          <div className="bg-[var(--bg-primary)] border border-[var(--accent-primary)] px-4 py-3 min-w-[200px]">
            <p className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Current Plan</p>
            <p className="font-sans text-[var(--text-primary)] font-medium text-lg">Free Trial</p>
            <p className="font-mono text-xs text-[var(--accent-primary)] mt-1">3 / 3 Proposals Remaining</p>
          </div>
        </div>
      </section>

      {/* 2. Onboarding Checklist */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--accent-primary)] p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 font-mono text-xs uppercase font-bold">Step 1</div>
            <div className="w-10 h-10 rounded-full border border-[var(--accent-primary)] flex items-center justify-center bg-[var(--bg-primary)] text-[var(--accent-primary)]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg text-[var(--text-primary)] font-medium">Connect Accounts</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Link your Upwork or LinkedIn profiles so the AI can start scanning for tailored leads.
            </p>
            <button className="w-full py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-sm font-medium hover:bg-[#c25e34] transition-colors">
              Connect Now
            </button>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
            <div className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg text-[var(--text-primary)] font-medium">Upload Portfolio</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Give the AI Co-Founder your past work examples to write better, highly-converting proposals.
            </p>
            <button className="w-full py-2 border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors">
              Upload Files
            </button>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-4">
            <div className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-lg text-[var(--text-primary)] font-medium">First Proposal</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Let the AI generate and send your very first client proposal completely on autopilot.
            </p>
            <button className="w-full py-2 border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-medium cursor-not-allowed opacity-50" disabled>
              Locked (Complete Step 1)
            </button>
          </div>
        </div>
      </section>

      {/* 3. Pricing / Upgrade */}
      <section id="pricing" className="pt-12 border-t border-[var(--border-default)]">
        <div className="mb-10">
          <h2 className="font-serif text-3xl text-[var(--text-primary)] mb-2">Select a Plan</h2>
          <p className="font-sans text-[var(--text-secondary)]">Upgrade to unlock unlimited AI proposals, automated lead generation, and contract management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="border border-[var(--border-default)] bg-[var(--bg-secondary)] p-8 flex flex-col hover:border-[var(--text-secondary)] transition-colors">
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-sans text-4xl text-[var(--text-primary)]">$9</span>
              <span className="text-[var(--text-secondary)] font-mono text-sm">/mo</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-8">For freelancers just getting started and looking to secure their first few regular clients.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["50 AI Proposals per month", "Basic Lead Scraping", "Standard Support", "Basic Analytics"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 border border-[var(--border-default)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors">
              Select Starter
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border border-[var(--accent-primary)] bg-[var(--bg-primary)] p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 text-xs font-mono uppercase tracking-widest">
              Recommended
            </div>
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-sans text-4xl text-[var(--text-primary)]">$19</span>
              <span className="text-[var(--text-secondary)] font-mono text-sm">/mo</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-8">For established consultants ready to automate their entire acquisition pipeline.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited AI Proposals", "Priority Lead Scraping", "Contract Generation", "Invoice Management", "Priority Support"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
           <button
  onClick={() => handleCheckout("pro")}
  disabled={loadingPlan === "pro"}
  className="w-full py-3 bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] font-medium transition-colors disabled:opacity-50"
>
  {loadingPlan === "pro" ? "Loading..." : "Upgrade to Pro"}
</button>
          </div>

          {/* Elite Plan */}
          <div className="border border-[var(--border-default)] bg-[var(--bg-secondary)] p-8 flex flex-col hover:border-[var(--text-secondary)] transition-colors">
            <h3 className="font-sans text-xl text-[var(--text-primary)] mb-2">Elite</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-sans text-4xl text-[var(--text-primary)]">$49</span>
              <span className="text-[var(--text-secondary)] font-mono text-sm">/mo</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-8">For agencies and high-volume solo operators needing total autopilot.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {["Everything in Pro", "Full Autopilot Mode", "Custom Branding", "Dedicated Account Manager", "White-glove Setup"].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
  onClick={() => handleCheckout("elite")}
  disabled={loadingPlan === "elite"}
  className="w-full py-3 border border-[var(--border-default)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors disabled:opacity-50"
>
  {loadingPlan === "elite" ? "Loading..." : "Upgrade to Elite"}
</button>
          </div>
        </div>
      </section>

    </div>
  );
}
