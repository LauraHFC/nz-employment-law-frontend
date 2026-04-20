// ─── API types (mirrors §3.1 handoff doc) ───────────────────────────────────

export interface Topic {
  id: string;
  label: string;
  description: string;
  chunk_count: number;
  active: boolean;
}

export type ContentType = "guide" | "legislation" | "case";

export interface Source {
  title: string;
  url: string;
  content_type: ContentType;
  source_name: string;
}

export interface QueryResponse {
  answer: string;   // Markdown string — render with react-markdown
  sources: Source[];
  question: string;
}

export interface TopicsResponse {
  topics: Topic[];
}

export interface HealthResponse {
  status: string;
  chunks_loaded: number;
  model: string;
}

// ─── Chat state ──────────────────────────────────────────────────────────────

export type MessageRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text?: string;
  sources?: Source[];
  question?: string;   // original question — used for feedback API
  loading?: boolean;
  error?: boolean;
  errorMsg?: string;
}

// §7.5 — per-topic conversation store
export type ConversationStore = Record<string, ChatMessage[]>;
