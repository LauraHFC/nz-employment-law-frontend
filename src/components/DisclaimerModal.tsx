"use client";
// DisclaimerModal.tsx — First-message disclaimer modal (Sprint 6 simplified)
//
// Sprint 6: 3 checkboxes → 1 checkbox.
// Sprint 4's three-checkbox modal was friction without proportionate safety
// value — users either checked all three reflexively or bounced. One clear
// affirmative is enough.
//
// Behaviour:
//   - NOT shown on page load. Triggered by ChatLayout when the user first submits
//     a question and localStorage key "disclaimer_v1_accepted" is absent.
//   - Non-dismissible: cannot be closed by clicking outside or pressing Escape.
//   - ONE required checkbox — must be checked before "I Accept" is enabled.
//   - "I Accept" → POSTs event_type "first_message_disclaimer", sets localStorage flag,
//     calls onAccept().
//   - "I Disagree" → POSTs event_type "disclaimer_declined", calls onDecline() which
//     should redirect or show a locked state.
//   - Consent POST is best-effort (failure does not block acceptance).

import { useState, useEffect, useId } from "react";
import { acknowledgeConsent } from "@/lib/api";
import type { ConsentAcknowledgeRequest } from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────
const DISCLAIMER_VERSION = "2.0";  // bump on Sprint 6 (single-checkbox model)
const PRIVACY_POLICY_VERSION = "1.0";
const STORAGE_KEY = "disclaimer_v2_accepted";  // bump key so existing users re-prompt

// ── Public util — used by ChatLayout to check acceptance without mounting hook ─
export function hasAcceptedDisclaimer(): boolean {
  if (typeof window === "undefined") return true; // SSR: don't block
  return !!localStorage.getItem(STORAGE_KEY);
}

// Stable session ID: generate once per browser session, persist in sessionStorage.
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "nzlaw_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface DisclaimerModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function DisclaimerModal({ onAccept, onDecline }: DisclaimerModalProps) {
  const uid = useId();
  const [acknowledged, setAcknowledged] = useState(false);
  const [posting, setPosting] = useState(false);

  const postConsent = async (
    event_type: ConsentAcknowledgeRequest["event_type"]
  ): Promise<void> => {
    try {
      const payload: ConsentAcknowledgeRequest = {
        session_id: getOrCreateSessionId(),
        event_type,
        // Sprint 6: single ack flag. Backend schema still accepts the
        // checkbox_states dict; we send one key for forward-compat with audit
        // reports that aggregate by checkbox.
        checkbox_states: { acknowledged },
        user_agent: navigator.userAgent,
        ui_locale: navigator.language || "en-NZ",
        disclaimer_version: DISCLAIMER_VERSION,
        privacy_policy_version: PRIVACY_POLICY_VERSION,
      };
      await acknowledgeConsent(payload);
    } catch {
      // Best-effort — do not block UX on audit failure.
    }
  };

  const handleAccept = async () => {
    if (!acknowledged || posting) return;
    setPosting(true);
    await postConsent("first_message_disclaimer");
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    onAccept();
  };

  const handleDecline = async () => {
    if (posting) return;
    setPosting(true);
    await postConsent("disclaimer_declined");
    onDecline();
  };

  // Trap focus inside modal.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const firstFocusable = document.getElementById(`${uid}-modal-title`);
    firstFocusable?.focus();
    return () => { prev?.focus(); };
  }, [uid]);

  return (
    <div
      className="disclaimer-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-modal-title`}
      aria-describedby={`${uid}-modal-desc`}
      // Non-dismissible: do NOT handle clicks on backdrop
    >
      <div className="disclaimer-modal">
        <div className="disclaimer-modal__header">
          <span className="disclaimer-modal__icon" aria-hidden="true">⚖️</span>
          <h2 id={`${uid}-modal-title`} className="disclaimer-modal__title" tabIndex={-1}>
            Before you continue
          </h2>
        </div>

        <div id={`${uid}-modal-desc`} className="disclaimer-modal__body">
          <p>
            This tool provides <strong>general legal information</strong> about New Zealand
            employment and tax law. It is <strong>not legal advice</strong>, does not create a
            lawyer–client relationship, and should not be relied on for decisions about your
            specific situation.
          </p>
          <p>
            For tailored help, contact{" "}
            <a href="https://communitylaw.org.nz" target="_blank" rel="noopener noreferrer">
              Community Law
            </a>{" "}
            (free) or{" "}
            <a href="https://www.cab.org.nz" target="_blank" rel="noopener noreferrer">
              Citizens Advice Bureau
            </a>
            . See our{" "}
            <a href="/disclaimer" target="_blank" rel="noopener noreferrer">Disclaimer</a>
            {" "}and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </p>
        </div>

        <fieldset className="disclaimer-modal__checks">
          <legend className="disclaimer-modal__checks-legend visually-hidden">
            Please confirm to continue
          </legend>

          <label className="disclaimer-modal__check-row">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={() => setAcknowledged((v) => !v)}
            />
            <span>
              I understand this is <strong>AI-generated general legal information</strong>,
              not professional advice.
            </span>
          </label>
        </fieldset>

        <div className="disclaimer-modal__actions">
          <button
            className="disclaimer-modal__btn disclaimer-modal__btn--accept"
            onClick={handleAccept}
            disabled={!acknowledged || posting}
            aria-disabled={!acknowledged || posting}
          >
            {posting ? "Please wait…" : "I Accept — Continue"}
          </button>

          <button
            className="disclaimer-modal__btn disclaimer-modal__btn--decline"
            onClick={handleDecline}
            disabled={posting}
          >
            I Disagree — Leave
          </button>
        </div>

        <p className="disclaimer-modal__footer">
          Free confidential help:{" "}
          <a href="https://communitylaw.org.nz" target="_blank" rel="noopener noreferrer">
            Community Law
          </a>{" "}
          · Citizens Advice Bureau 0800 367 222
        </p>
      </div>
    </div>
  );
}
