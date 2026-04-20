"use client";
import { useState } from "react";
import { useTopicContext } from "@/contexts/TopicContext";
import { sendFeedback } from "@/lib/api";

interface FeedbackRowProps {
  question: string;
}

export function FeedbackRow({ question }: FeedbackRowProps) {
  const { activeTopic } = useTopicContext();
  const [fb, setFb] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFeedback = async (rating: "up" | "down") => {
    if (fb || !activeTopic) return;
    setFb(rating);
    await sendFeedback(question, rating, activeTopic.id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(question).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="feedback-row">
      <button
        className={`fb-btn ${fb === "up" ? "active-up" : ""}`}
        onClick={() => handleFeedback("up")}
        disabled={!!fb}
        aria-label="Mark as helpful"
        aria-pressed={fb === "up"}
      >
        👍 Helpful
      </button>
      <button
        className={`fb-btn ${fb === "down" ? "active-dn" : ""}`}
        onClick={() => handleFeedback("down")}
        disabled={!!fb}
        aria-label="Mark as not helpful"
        aria-pressed={fb === "down"}
      >
        👎 Not helpful
      </button>
      <button
        className="fb-btn copy-btn"
        onClick={handleCopy}
        aria-label="Copy answer"
      >
        {copied ? "✓ Copied" : "⎘ Copy"}
      </button>
    </div>
  );
}
