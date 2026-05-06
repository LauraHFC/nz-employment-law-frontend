// lib/api.ts — v4
import type {
  Topic,
  HubQueryResponse,
  QueryResponse,
  HealthResponse,
  AgentQueryResponse,
  ConsentAcknowledgeRequest,
  ConsentAcknowledgeResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Primary endpoint (v3) — no topic param needed ────────────────────────────
export async function askHubQuestion(
  question: string,
  n_results = 5
): Promise<HubQueryResponse> {
  const res = await fetch(`${API_BASE}/api/hub/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, n_results }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Unknown error"));
  return res.json();
}

// ── Agent endpoint (v4 — full risk-control pipeline) ─────────────────────────
export async function askAgentQuestion(
  question: string
): Promise<AgentQueryResponse> {
  const res = await fetch(`${API_BASE}/api/agent/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Unknown error"));
  return res.json();
}

// ── Consent acknowledgement (v4) ──────────────────────────────────────────────
export async function acknowledgeConsent(
  payload: ConsentAcknowledgeRequest
): Promise<ConsentAcknowledgeResponse> {
  const res = await fetch(`${API_BASE}/api/consent/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Consent log failed"));
  return res.json();
}

// ── Supporting endpoints ──────────────────────────────────────────────────────
export async function fetchTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE}/api/topics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load topics: ${res.status}`);
  return (await res.json()).topics;
}

export async function sendFeedback(
  question: string, rating: "up" | "down", topic: string
): Promise<void> {
  await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, rating, topic }),
  }).catch(() => {});
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("unhealthy");
  return res.json();
}

// ── Legacy (backward compat only — do not use for new work) ──────────────────
export async function askQuestion(
  question: string, topic: string, n_results = 5
): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic, n_results }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Unknown error"));
  return res.json();
}
