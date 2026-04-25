"use client";
import { useState } from "react";
import type { LegalSource } from "@/lib/types";

interface SourcesPanelProps {
  sources: LegalSource[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  const [open, setOpen] = useState(false);

  // Deduplicate by URL (§5.5 handoff doc)
  const unique = sources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i
  );
  if (!unique.length) return null;

  return (
    <div className="sources-area">
      <button
        className={`sources-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${open ? "Hide" : "Show"} ${unique.length} source${unique.length > 1 ? "s" : ""}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M3 4.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unique.length} source{unique.length > 1 ? "s" : ""}
      </button>

      {open && (
        <div className="sources-list">
          {unique.map((s, i) => (
            <div className="source-card" key={i}>
              <div className="src-title">
                {s.title}
                <ContentTypeBadge type={s.content_type} />
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                ↗ {s.url}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentTypeBadge({ type }: { type: string }) {
  if (!type) return null;
  const cls =
    type === "guide"
      ? "ct-guide"
      : type === "legislation"
      ? "ct-legislation"
      : "ct-case";
  return <span className={`ct-badge ${cls}`}>{type}</span>;
}
