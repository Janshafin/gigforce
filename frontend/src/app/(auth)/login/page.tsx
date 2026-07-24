"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { loginDemo, requestMagicLink, loginGoogleSimulated } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await requestMagicLink(email);
      setMagicSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginGoogleSimulated(email || "alex.vance@gigforge.ai", "Alex Vance");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    try {
      await loginDemo();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#051424] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl gradient-button items-center justify-center shadow-lg shadow-cyan-500/25 mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome to <span className="gradient-text">GigForge</span>
          </h1>
          <p className="text-sm text-slate-400">
            Your Freelance AI Co-Founder for Proposals, Leads & Growth
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-200 font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:border-cyan-500/50 mb-4 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-xs text-slate-500 uppercase tracking-wider">or magic link</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {magicSent ? (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
            <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-semibold text-cyan-300 text-sm mb-1">Magic Link Sent!</h3>
            <p className="text-xs text-slate-300 mb-3">
              We sent a sign-in link to <span className="font-mono text-cyan-300">{email}</span>.
            </p>
            <button
              onClick={handleDemoSignIn}
              className="text-xs text-cyan-400 underline hover:text-cyan-300"
            >
              Skip and log in instantly via Demo Mode &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="freelancer@gigforge.ai"
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Send Magic Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Fast Login */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Login (1-Click)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by Gemini AI & Google Cloud Run</span>
        </div>
      </div>
    </div>
  );
}
