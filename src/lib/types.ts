// lib/types.ts — v4 (risk-control fields + consent) (hub endpoint)

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
  // Risk-control fields (agent endpoint)
  riskBadge?: AgentQueryResponse["risk_badge"];
  refused?: boolean;
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

// ── Agent endpoint types (v4 — risk-control pipeline) ─────────────────────────

export interface AgentQueryResponse {
  question: string;
  answer: string;
  sources: LegalSource[];
  domains_used: string[];
  tool_calls: Record<string, unknown>[];
  refused: boolean;
  refusal_reason: string | null;
  chart: ChartConfig | null;
  // Risk-control metadata
  intent_class: "LOOKUP" | "ADVICE" | "HIGH_STAKES";
  domain_tier: "H1" | "H2" | "H3" | "M" | "L";
  domain_label: string;
  routing_outcome: "DIRECT_ANSWER" | "STRUCTURED_INFORMATIONAL" | "STRUCTURED_ADVICE_SKELETON" | "REFUSE_WITH_REFERRAL";
  crisis_route_fired: boolean;
  regeneration_count: number;
  risk_badge: "general_info" | "high_care" | "please_get_advice" | "refused";
}

// ── Consent types (v4) ────────────────────────────────────────────────────────

export type ConsentEventType =
  | "first_message_disclaimer"
  | "disclaimer_declined"
  | "reprompt"
  | "policy_version_bump";

export interface ConsentAcknowledgeRequest {
  session_id: string;
  event_type: ConsentEventType;
  checkbox_states: { general_info: boolean; no_reliance: boolean; read_policies: boolean };
  user_id?: string;
  user_agent?: string;
  ui_locale?: string;
  question_hash?: string;
  disclaimer_version?: string;
  privacy_policy_version?: string;
}

export interface ConsentAcknowledgeResponse {
  ok: boolean;
  event_id: string;
}
