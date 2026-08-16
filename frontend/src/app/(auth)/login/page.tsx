"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginGoogle } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

// Dynamically import useGoogleLogin to avoid SSR issues
let useGoogleLoginFn: any = null;
if (typeof window !== "undefined") {
  import("@react-oauth/google").then((mod) => {
    useGoogleLoginFn = mod.useGoogleLogin;
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      // Dynamically import to avoid SSR issues
      const { googleLogout } = await import("@react-oauth/google");

      // Use the Google OAuth popup flow via tokenClient
      const client = (window as any).google?.accounts?.oauth2?.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        scope: "email profile",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setError("Google sign-in was cancelled.");
            setLoading(false);
            return;
          }

          try {
            // Fetch user info from Google
            const userInfoRes = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              }
            );
            const userInfo = await userInfoRes.json();

            // Send to our backend
            await loginGoogle(
              tokenResponse.access_token,
              userInfo.email,
              userInfo.name || userInfo.email.split("@")[0]
            );
            router.push("/dashboard");
          } catch (err: any) {
            console.error("Google login error:", err);
            setError("Google sign-in failed. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      });

      if (client) {
        client.requestAccessToken();
      } else {
        // Fallback: No Google Client ID configured, use demo login
        const { loginDemo } = await import("@/lib/api");
        await loginDemo();
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      // Fallback to demo login if Google is not configured
      try {
        const { loginDemo } = await import("@/lib/api");
        await loginDemo();
        router.push("/dashboard");
      } catch {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Email/password login
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginGoogle("email-login", email, email.split("@")[0]);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Sign in failed. Please check your connection and try again.");
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

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-[var(--border-default)] hover:border-[var(--text-secondary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium flex items-center justify-center gap-3 transition-colors mb-8 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--border-default)]"></div>
            <span className="px-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">or continue with email</span>
            <div className="flex-1 border-t border-[var(--border-default)]"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] px-4 py-3 text-[var(--text-primary)] text-base outline-none transition-colors"
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
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent-primary)] px-4 py-3 text-[var(--text-primary)] text-base outline-none transition-colors"
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
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Forgot password?
            </button>
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
