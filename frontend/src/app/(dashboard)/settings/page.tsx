"use client";

import { useState } from "react";
import { 
  Settings, 
  Key, 
  User, 
  Cpu, 
  Cloud, 
  Database, 
  Save, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState("Sarah Jenkins");
  const [rate, setRate] = useState("120");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Settings & Configuration <Sparkles className="w-5 h-5 text-cyan-400" />
        </h1>
        <p className="text-xs text-slate-400">Configure your Gemini AI Studio API key, AI co-founder preferences, and platform stack</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully! AI co-founder agent updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini AI API Key Section */}
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google AI Studio API Key</h3>
              <p className="text-xs text-slate-400">Powers all co-founder chat, proposal writing, and lead reasoning</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (Enter your Google AI Studio API key)"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Don't have a key? Get one for free at{" "}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                aistudio.google.com
              </a>
            </p>
          </div>
        </div>

        {/* AI Co-Founder Model Selection */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Co-Founder Reasoning Engine</h3>
              <p className="text-xs text-slate-400">Select the Gemini model variant for generation and analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
              model === "gemini-1.5-flash"
                ? "bg-cyan-500/15 border-cyan-400 text-white"
                : "bg-slate-900/60 border-white/5 text-slate-400"
            }`}>
              <input
                type="radio"
                name="model"
                value="gemini-1.5-flash"
                checked={model === "gemini-1.5-flash"}
                onChange={() => setModel("gemini-1.5-flash")}
                className="sr-only"
              />
              <div className="font-bold text-sm text-white mb-1">Gemini 1.5 Flash (Recommended)</div>
              <div className="text-xs text-slate-400">Ultra-fast latency for real-time chat & proposal drafts</div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
              model === "gemini-1.5-pro"
                ? "bg-cyan-500/15 border-cyan-400 text-white"
                : "bg-slate-900/60 border-white/5 text-slate-400"
            }`}>
              <input
                type="radio"
                name="model"
                value="gemini-1.5-pro"
                checked={model === "gemini-1.5-pro"}
                onChange={() => setModel("gemini-1.5-pro")}
                className="sr-only"
              />
              <div className="font-bold text-sm text-white mb-1">Gemini 1.5 Pro</div>
              <div className="text-xs text-slate-400">Complex multi-page technical proposal reasoning</div>
            </label>
          </div>
        </div>

        {/* Freelancer Profile */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Freelancer Profile</h3>
              <p className="text-xs text-slate-400">Used by AI Co-Founder to customize proposal messaging and rates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Target Hourly Rate ($/hr)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Infrastructure & Stack Diagnostics */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-base text-white">Hackathon Architecture Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
              <Cloud className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-semibold text-white">Google Cloud Run</p>
                <p className="text-slate-400 text-[11px]">Backend & Next.js standalone container target</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
              <Database className="w-5 h-5 text-violet-400" />
              <div>
                <p className="font-semibold text-white">PostgreSQL (Docker)</p>
                <p className="text-slate-400 text-[11px]">Local port 5432 (AsyncPG & SQLAlchemy)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="gradient-button px-6 py-3 rounded-xl text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
