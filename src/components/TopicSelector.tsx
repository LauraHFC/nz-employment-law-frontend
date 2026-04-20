"use client";
// §7.4 — hidden when only 1 topic; auto-renders tabs when 2+ topics exist
import { useTopicContext } from "@/contexts/TopicContext";
import { useRouter } from "next/navigation";

export function TopicSelector() {
  const { topics, activeTopic, setActiveTopic } = useTopicContext();
  const router = useRouter();

  // Hidden until 2+ active topics exist — no conditional logic needed later
  const activeTopics = topics.filter((t) => t.active);
  if (activeTopics.length <= 1) return null;

  const handleSelect = (id: string) => {
    setActiveTopic(id);
    router.push(`/t/${id}`);
  };

  return (
    <nav className="topic-selector" role="tablist" aria-label="Knowledge base">
      {activeTopics.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={t.id === activeTopic?.id}
          className="topic-tab"
          onClick={() => handleSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
