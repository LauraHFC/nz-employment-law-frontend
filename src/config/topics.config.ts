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
      "What are my rights if I'm made redundant?",
      "How do GST rules apply to small businesses?",
      "How is PAYE calculated on my salary?",
      "How has the unemployment rate changed over time?",
      "Compare male vs female earnings by industry",
    ],
    chips: ["💼", "🚪", "🧾", "💰", "📈", "⚖️"],
    inputPlaceholder: "Ask about NZ law, tax, or labour market data…",
    sidebarDescription:
      "Knowledge from official NZ government sources — employment law, tax rules, and labour market statistics. Information only, not legal or tax advice.",
    emptyStateTitle: "Find your way through NZ law",
    emptyStateSubtitle:
      "Employment law · Tax rules · Labour market data · Powered by official NZ government sources",
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
