// lib/types.ts — v3 (hub endpoint)

// ── Legacy types (kept for backward compat) ───────────────────────────────────
export interface Topic {
  id: string; label: string; description: string; chunk_count: number; active: boolean;
}
export type ContentType = "guide" | "legislation" | "case";
export interface Source {
  title: string; url: string; content_type: ContentType; source_name: string;
}
export interface QueryResponse {
  answer: string; sources: Source[]; question: string;
}
export interface HealthResponse {
  status: string; chunks_loaded: number; model: string;
}
export type MessageRole = "user" | "bot";
export interface ChatMessage {
  id: string; role: MessageRole;
  text?: string; sources?: LegalSource[]; question?: string;
  chart?: ChartConfig | null;
  outOfRangeWarning?: string | null;
  intent?: HubQueryResponse["intent"];
  loading?: boolean; error?: boolean; errorMsg?: string;
}
export type ConversationStore = Record<string, ChatMessage[]>;

// ── Hub endpoint types (v3) ───────────────────────────────────────────────────
export interface HubQueryRequest {
  question: string;
  n_results?: number;
}

export interface LegalSource {
  title: string; url: string; content_type: string;
}

export interface ChartConfig {
  type: "line" | "bar" | "grouped_bar" | "pie";
  title: string;
  x_key: string;
  y_keys: string[];
  y_label: string;
  data: Record<string, string | number>[];
}

export interface HubQueryResponse {
  question: string;
  intent: "legal" | "data" | "hybrid";
  confidence: "high" | "medium" | "low";
  answer: string;
  sources: LegalSource[];
  data_sql: string | null;
  data_rows: number | null;
  out_of_range_warning: string | null;
  router_reasoning: string;
  chart: ChartConfig | null;
}
