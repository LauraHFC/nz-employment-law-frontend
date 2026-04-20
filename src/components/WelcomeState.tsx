"use client";
import { useTopicContext } from "@/contexts/TopicContext";
import { getTopicUI } from "@/config/topics.config";

interface WelcomeStateProps {
  onSend: (text: string) => void;
}

export function WelcomeState({ onSend }: WelcomeStateProps) {
  const { activeTopic } = useTopicContext();
  const ui = getTopicUI(activeTopic?.id ?? "");

  return (
    <div className="welcome">
      <div className="welcome-icon" aria-hidden="true">⚖️</div>

      <div className="welcome-heading">
        <h2>{ui.emptyStateTitle}</h2>
        <p>{ui.emptyStateSubtitle}</p>
      </div>

      <div className="chips-grid" role="list">
        {ui.exampleQuestions.map((q, i) => (
          <button
            key={i}
            className="chip"
            role="listitem"
            onClick={() => onSend(q)}
            aria-label={`Ask: ${q}`}
          >
            <span className="chip-icon" aria-hidden="true">
              {ui.chips[i] ?? "💬"}
            </span>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
