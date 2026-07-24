const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  gemini_api_key?: string;
}

export interface Lead {
  id: string;
  client_name: string;
  company?: string;
  project_title: string;
  description?: string;
  value: number;
  status: string;
  source: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  status: string;
  executive_summary?: string;
  deliverables?: string[];
  pricing: number;
  full_content?: string;
  version: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action_type?: string;
  action_meta?: any;
  created_at: string;
}

export interface DashboardSummary {
  active_proposals_count: number;
  leads_pipeline_value: number;
  monthly_earnings: number;
  recent_leads: Lead[];
  active_proposals: Proposal[];
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return await res.json();
  } catch (e) {
    return { status: "offline", error: String(e) };
  }
}

export async function loginDemo() {
  const res = await fetch(`${API_BASE}/api/auth/demo`, { method: "POST" });
  if (!res.ok) throw new Error("Demo login failed");
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("gigforge_token", data.access_token);
    localStorage.setItem("gigforge_user", JSON.stringify(data.user));
  }
  return data;
}

export async function requestMagicLink(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function loginGoogleSimulated(email: string, full_name: string) {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: "google-simulated-token", email, full_name }),
  });
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("gigforge_token", data.access_token);
    localStorage.setItem("gigforge_user", JSON.stringify(data.user));
  }
  return data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/api/dashboard/summary`);
  if (!res.ok) throw new Error("Failed to load dashboard summary");
  return await res.json();
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/api/chat/history`);
  if (!res.ok) throw new Error("Failed to load chat history");
  return await res.json();
}

export async function sendChatMessage(content: string): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/api/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return await res.json();
}

export async function getProposals(): Promise<Proposal[]> {
  const res = await fetch(`${API_BASE}/api/proposals`);
  if (!res.ok) throw new Error("Failed to fetch proposals");
  return await res.json();
}

export async function getLeads(): Promise<Lead[]> {
  const res = await fetch(`${API_BASE}/api/leads`);
  if (!res.ok) throw new Error("Failed to fetch leads");
  return await res.json();
}

export async function createProposal(data: Partial<Proposal>): Promise<Proposal> {
  const res = await fetch(`${API_BASE}/api/proposals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create proposal");
  return await res.json();
}
