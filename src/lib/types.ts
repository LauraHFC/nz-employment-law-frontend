// lib/types.ts — Sprint 6 (slim risk-control fields)
//
// Sprint 6 changes vs v4:
//   AgentQueryResponse:
//     - DROPPED: intent_class, domain_tier, routing_outcome, risk_badge,
//                classifier_confidence
//     - KEPT:    domain_label, crisis_route_fired, regeneration_count,
//                refused, refusal_reason, trace_id
//   ChatMessage:
//     - DROPPED: riskBadge (per-message badge tier removed; RiskBadge now
//                renders only when refused=true)
//   ConsentAcknowledgeRequest:
//     - checkbox_states is now a single {acknowledged: bool} (was 3 keys)

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
  // Sprint 6: refused drives the only risk-badge render site.
  refused?: boolean;
  // Observability (Sprint 5)
  traceId?: string | null;
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

// ── Agent endpoint types (Sprint 6 — slim risk-control) ───────────────────────

export interface AgentQueryResponse {
  question: string;
  answer: string;
  sources: LegalSource[];
  domains_used: string[];
  tool_calls: Record<string, unknown>[];
  refused: boolean;
  refusal_reason: string | null;
  chart: ChartConfig | null;
  // Slim risk-control metadata (Sprint 6)
  domain_label: string;
  crisis_route_fired: boolean;
  regeneration_count: number;
  // Observability (Sprint 5)
  trace_id: string | null;
}

// ── Consent types (Sprint 6) ──────────────────────────────────────────────────

export type ConsentEventType =
  | "first_message_disclaimer"
  | "disclaimer_declined"
  | "reprompt"
  | "policy_version_bump";

export interface ConsentAcknowledgeRequest {
  session_id: string;
  event_type: ConsentEventType;
  // Sprint 6: single-checkbox model. Backend still accepts the freeform dict.
  checkbox_states: Record<string, boolean>;
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
