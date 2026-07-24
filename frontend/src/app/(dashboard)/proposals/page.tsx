"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Sparkles,
  UserCheck,
  Building,
  Briefcase
} from "lucide-react";
import { getProposals, getLeads, createProposal, Proposal, Lead } from "@/lib/api";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"proposals" | "leads">("proposals");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // New Proposal Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPrice, setNewPrice] = useState("10000");

  useEffect(() => {
    Promise.all([getProposals(), getLeads()])
      .then(([propsData, leadsData]) => {
        setProposals(propsData);
        setLeads(leadsData);
        if (propsData.length > 0) setSelectedProposal(propsData[0]);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newClient) return;

    try {
      const created = await createProposal({
        title: newTitle,
        client_name: newClient,
        pricing: parseFloat(newPrice) || 5000,
        status: "Draft",
        executive_summary: `AI co-founder generated proposal for ${newClient}. Covers scope, timelines, and deliverables.`,
        deliverables: ["Architecture & Discovery", "Frontend Implementation", "Backend & Deployment"]
      });
      setProposals((prev) => [created, ...prev]);
      setSelectedProposal(created);
      setShowModal(false);
      setNewTitle("");
      setNewClient("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proposals & Leads Manager</h1>
          <p className="text-xs text-slate-400">Track client opportunities and manage AI-generated proposals</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="gradient-button text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Proposal with Gemini</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("proposals")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
            activeTab === "proposals"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Proposals ({proposals.length})
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
            activeTab === "leads"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Leads Pipeline ({leads.length})
        </button>
      </div>

      {activeTab === "proposals" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Proposal List Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              All Proposal Documents
            </h3>
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs">Loading proposals...</div>
            ) : (
              proposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposal(prop)}
                  className={`p-4 rounded-2xl glass-card cursor-pointer transition-all border ${
                    selectedProposal?.id === prop.id
                      ? "border-cyan-400 shadow-lg shadow-cyan-500/10 bg-slate-900/90"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {prop.status}
                    </span>
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      ${prop.pricing.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{prop.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3" /> {prop.client_name}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Detailed Proposal Viewer */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10">
            {selectedProposal ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedProposal.title}</h2>
                    <p className="text-xs text-slate-400">Client: {selectedProposal.client_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-cyan-300">
                      ${selectedProposal.pricing.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400">Version {selectedProposal.version}.0</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Executive Summary
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-xs leading-relaxed text-slate-200">
                    {selectedProposal.executive_summary || "High performance solution tailored for client specifications."}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Key Deliverables
                  </h4>
                  <div className="space-y-2">
                    {(selectedProposal.deliverables || ["Architecture & Setup", "Development", "Deployment"]).map((d, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200 p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200">
                    Export PDF
                  </button>
                  <button className="gradient-button px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md shadow-cyan-500/20">
                    Send to Client
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-sm">
                Select a proposal from the left list to view details
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Leads Table */
        <div className="glass-card rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-mono">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">{lead.client_name}</td>
                    <td className="py-3.5 px-4 text-slate-200">{lead.project_title}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">${lead.value.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{lead.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating Proposal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Generate Proposal with Gemini
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js Enterprise Frontend Architecture"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. TechCorp AI"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Pricing ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-button px-5 py-2 rounded-xl text-white font-semibold shadow-md shadow-cyan-500/20"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
