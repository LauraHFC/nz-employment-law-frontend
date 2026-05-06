"use client";
// RiskBadge.tsx — per-message risk level indicator (v4 risk controls)
// Keyed off AgentQueryResponse.risk_badge field.
//
// Colours:
//   general_info      → grey   (informational, low risk)
//   high_care         → amber  (employment/tax — handle with care)
//   please_get_advice → red    (H1/H2 domains — strongly recommend legal advice)
//   refused           → dark   (refused — referral only)

import type { AgentQueryResponse } from "@/lib/types";

interface RiskBadgeProps {
  badge: AgentQueryResponse["risk_badge"];
}

const BADGE_CONFIG: Record<
  AgentQueryResponse["risk_badge"],
  { label: string; emoji: string; className: string }
> = {
  general_info: {
    label: "General information",
    emoji: "ℹ️",
    className: "risk-badge risk-badge--info",
  },
  high_care: {
    label: "Handle with care — verify with a professional",
    emoji: "⚠️",
    className: "risk-badge risk-badge--care",
  },
  please_get_advice: {
    label: "Please get legal advice",
    emoji: "🔴",
    className: "risk-badge risk-badge--advice",
  },
  refused: {
    label: "Outside scope — referral provided",
    emoji: "🚫",
    className: "risk-badge risk-badge--refused",
  },
};

export function RiskBadge({ badge }: RiskBadgeProps) {
  const cfg = BADGE_CONFIG[badge] ?? BADGE_CONFIG["general_info"];
  return (
    <div className={cfg.className} role="status" aria-label={`Risk level: ${cfg.label}`}>
      <span aria-hidden="true">{cfg.emoji}</span>{" "}
      <span className="risk-badge__label">{cfg.label}</span>
    </div>
  );
}
