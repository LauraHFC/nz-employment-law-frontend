"use client";
// ─── TopicContext (§7.1 handoff doc) ─────────────────────────────────────────
// Single source of truth for available topics and the active one.
// Components MUST read from this context — never hardcode a topic id.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchTopics } from "@/lib/api";
import type { Topic, ChatMessage, ConversationStore } from "@/lib/types";

interface TopicContextValue {
  topics: Topic[];
  activeTopic: Topic | null;
  setActiveTopic: (id: string) => void;
  topicsLoading: boolean;

  // §7.5 — per-topic isolated conversation store
  conversations: ConversationStore;
  setMessages: (topicId: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  clearMessages: (topicId: string) => void;
}

const TopicContext = createContext<TopicContextValue | null>(null);

export function useTopicContext(): TopicContextValue {
  const ctx = useContext(TopicContext);
  if (!ctx) throw new Error("useTopicContext must be used inside <TopicProvider>");
  return ctx;
}

interface TopicProviderProps {
  children: ReactNode;
  /** Optional: override the initial active topic (e.g. from URL param) */
  initialTopicId?: string;
}

// Fallback when API is unavailable — keeps UI functional during development
const FALLBACK_TOPICS: Topic[] = [
  {
    id: "nz_employment_law",
    label: "Employment Law",
    description: "NZ employment rights, obligations, leave, and dismissal",
    chunk_count: 1960,
    active: true,
  },
];

export function TopicProvider({ children, initialTopicId }: TopicProviderProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(
    initialTopicId ?? null
  );
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationStore>({});

  useEffect(() => {
    fetchTopics()
      .then((t) => {
        setTopics(t);
        if (!activeTopicId) {
          const first = t.find((x) => x.active);
          if (first) setActiveTopicId(first.id);
        }
      })
      .catch(() => {
        setTopics(FALLBACK_TOPICS);
        if (!activeTopicId) setActiveTopicId(FALLBACK_TOPICS[0].id);
      })
      .finally(() => setTopicsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMessages = useCallback(
    (topicId: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) => ({
        ...prev,
        [topicId]: updater(prev[topicId] ?? []),
      }));
    },
    []
  );

  const clearMessages = useCallback((topicId: string) => {
    setConversations((prev) => ({ ...prev, [topicId]: [] }));
  }, []);

  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? null;

  return (
    <TopicContext.Provider
      value={{
        topics,
        activeTopic,
        setActiveTopic: setActiveTopicId,
        topicsLoading,
        conversations,
        setMessages,
        clearMessages,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
}
