// ─── Per-topic UI configuration (§7.2 handoff doc) ────────────────────────────
// When a new topic is added to the backend, add ONE entry here.
// No other frontend file should change.

export interface TopicUIConfig {
  exampleQuestions: string[];
  inputPlaceholder: string;
  sidebarDescription: string;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  chips: string[]; // emoji per question chip
}

export const TOPIC_UI_CONFIG: Record<string, TopicUIConfig> = {
  nz_employment_law: {
    exampleQuestions: [
      "What is the minimum wage in NZ?",
      "How much notice does an employer need to give?",
      "What are my rights if I'm made redundant?",
      "How many sick days am I entitled to?",
      "What counts as unjustified dismissal?",
      "Can my employer change my hours without consent?",
    ],
    chips: ["💼", "📋", "🚪", "🤒", "⚠️", "🕐"],
    inputPlaceholder: "Ask a question about NZ employment law…",
    sidebarDescription:
      "A free AI-powered tool for understanding New Zealand employment law — for employees and employers alike.",
    emptyStateTitle: "Ask anything about NZ employment law",
    emptyStateSubtitle:
      "Clear, cited answers grounded in official NZ government sources.",
  },

  // ── Add future topics below — no other file needs to change ─────────────────
  // health_and_safety: { ... },
};

const DEFAULT_TOPIC_UI: TopicUIConfig = {
  exampleQuestions: [],
  chips: [],
  inputPlaceholder: "Ask a question…",
  sidebarDescription: "AI-powered answers from official sources.",
  emptyStateTitle: "Ask anything",
  emptyStateSubtitle: "Powered by official sources.",
};

export function getTopicUI(topicId: string): TopicUIConfig {
  return TOPIC_UI_CONFIG[topicId] ?? DEFAULT_TOPIC_UI;
}
