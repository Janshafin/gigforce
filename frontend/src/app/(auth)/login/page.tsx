"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, loginDemo } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Quick demo sign-in (no account needed)
  const handleDemoSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await loginDemo();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError("Demo sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Real email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Left Side (Editorial) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--border-default)]"
      >
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-[var(--text-primary)] mb-6">
          Your work<br />
          deserves<br />
          more time.
        </h1>
        <p className="font-sans text-lg text-[var(--text-secondary)] max-w-md">
          Sign in and let your AI Co-Founder take care of the repetitive work.
        </p>
      </motion.div>

      {/* Right Side (Auth Panel) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[var(--bg-primary)]"
      >
        <div className="max-w-md w-full mx-auto">
          <h2 className="font-sans text-2xl font-medium text-[var(--text-primary)] mb-8">
            Welcome back.
          </h2>

          {error && (
            <div className="mb-6 p-4 border border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
              {error}
            </div>
          )}

          {/* Quick Demo Access */}
          <button
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-[var(--border-default)] hover:border-[var(--text-secondary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium flex items-center justify-center gap-3 transition-colors mb-8 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Try Demo (No Account Needed)
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--border-default)]"></div>
            <span className="px-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">or sign in with email</span>
            <div className="flex-1 border-t border-[var(--border-default)]"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] px-4 py-3 text-[var(--text-primary)] text-base outline-none transition-colors placeholder:text-[var(--text-secondary)]/40"
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] px-4 py-3 text-[var(--text-primary)] text-base outline-none transition-colors placeholder:text-[var(--text-secondary)]/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-primary)] hover:bg-[#c25e34] text-[var(--bg-primary)] font-medium py-3 text-base transition-colors disabled:opacity-70 mt-4"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 text-sm font-sans">
            <div className="text-[var(--text-secondary)]">
              New to GigForge?{" "}
              <Link href="/signup" className="text-[var(--accent-primary)] hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
