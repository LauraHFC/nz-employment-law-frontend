// ─── API client (§6.1 handoff doc) ───────────────────────────────────────────
import type { Topic, QueryResponse, HealthResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── GET /api/topics ──────────────────────────────────────────────────────────
export async function fetchTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE}/api/topics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load topics: ${res.status}`);
  const data = await res.json();
  return data.topics as Topic[];
}

// ── POST /api/query ──────────────────────────────────────────────────────────
// topic param is REQUIRED — never call without it (§3.2)
export async function askQuestion(
  question: string,
  topic: string,
  n_results = 5
): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic, n_results }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "Unknown error");
    throw new Error(detail);
  }
  return res.json() as Promise<QueryResponse>;
}

// ── POST /api/feedback ───────────────────────────────────────────────────────
export async function sendFeedback(
  question: string,
  rating: "up" | "down",
  topic: string
): Promise<void> {
  // Best-effort — do not throw on failure
  await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, rating, topic }),
  }).catch(() => {});
}

// ── GET /api/health ──────────────────────────────────────────────────────────
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("unhealthy");
  return res.json() as Promise<HealthResponse>;
}
