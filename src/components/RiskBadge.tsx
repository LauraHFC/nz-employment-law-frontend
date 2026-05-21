"use client";
// RiskBadge.tsx — Sprint 6 simplified
//
// Sprint 4 had 4 colour-coded tiers (general_info / high_care /
// please_get_advice / refused) rendered on EVERY assistant message.
// Sprint 6 tears that out — risk_badge is dropped from the API response,
// and this component only renders for refused answers.
//
// Render-site (Message.tsx) must check `refused === true` before mounting.

export function RiskBadge() {
  return (
    <div
      className="risk-badge risk-badge--refused"
      role="status"
      aria-label="This question is outside the scope of this tool — referral provided"
    >
      <span aria-hidden="true">🚫</span>{" "}
      <span className="risk-badge__label">
        Outside scope — referral provided
      </span>
    </div>
  );
}
