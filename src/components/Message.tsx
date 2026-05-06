"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SourcesPanel } from "./SourcesPanel";
import { FeedbackRow } from "./FeedbackRow";
import { LoadingDots } from "./LoadingDots";
import { DataChart } from "./DataChart";
import { RiskBadge } from "./RiskBadge";
import type { ChatMessage, LegalSource } from "@/lib/types";

interface MessageProps {
  msg: ChatMessage;
  onRetry: (text: string, loadId: string) => void;
}

export function Message({ msg, onRetry }: MessageProps) {
  const isBot = msg.role === "bot";

  return (
    <div className={`msg ${msg.role}`}>
      <div className={`avatar ${msg.role}`} aria-hidden="true">
        {isBot ? "⚖️" : "👤"}
      </div>
      <div style={{ flex: isBot ? 1 : undefined, minWidth: 0 }}>
        <div className={`bubble ${msg.role}`}>
          {msg.loading ? (
            <LoadingDots label="Searching knowledge base…" />
          ) : msg.error ? (
            <div>
              <div className="error-bubble">⚠️ {msg.errorMsg}</div>
              {msg.question && (
                <button className="retry-btn" onClick={() => onRetry(msg.question!, msg.id)}>
                  ↺ Try again
                </button>
              )}
            </div>
          ) : isBot ? (
            <div className="md-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text ?? ""}</ReactMarkdown>
            </div>
          ) : (
            msg.text
          )}
        </div>

        {/* Risk badge — agent endpoint responses only */}
        {isBot && !msg.loading && !msg.error && msg.riskBadge && (
          <RiskBadge badge={msg.riskBadge} />
        )}

        {/* Chart — data / hybrid responses */}
        {isBot && !msg.loading && !msg.error && msg.chart && (
          <DataChart chart={msg.chart} />
        )}

        {/* Out-of-range warning */}
        {isBot && !msg.loading && !msg.error && msg.outOfRangeWarning && (
          <div className="warning-banner" role="alert">
            ⚠️ {msg.outOfRangeWarning}
          </div>
        )}

        {/* Sources — legal / hybrid responses */}
        {isBot && !msg.loading && !msg.error && (msg.sources?.length ?? 0) > 0 && (
          <SourcesPanel sources={msg.sources as LegalSource[]} />
        )}

        {/* Feedback */}
        {isBot && !msg.loading && !msg.error && (
          <FeedbackRow
            question={msg.question ?? ""}
            answer={msg.text ?? ""}
          />
        )}
      </div>
    </div>
  );
}
