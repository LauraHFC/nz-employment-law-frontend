"use client";
import { useState } from "react";
import { sendFeedback } from "@/lib/api";

interface FeedbackRowProps {
  answer: string;         // bot answer text — copied to clipboard
  traceId: string | null; // Langfuse trace ID; null if tracing disabled
}

export function FeedbackRow({ answer, traceId }: FeedbackRowProps) {
  const [fb, setFb] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFeedback = async (rating: "up" | "down") => {
    if (fb) return;
    setFb(rating);
    if (traceId) {
      await sendFeedback(traceId, rating);
    }
    // If traceId is null (Langfuse disabled in env), feedback is silently
    // dropped — there is no durable store to write to without Langfuse.
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer).catch(() => {});
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
