"use client";
// DisclaimerModal.tsx — First-message disclaimer modal (v4 risk controls)
//
// Behaviour:
//   - Shown on first page load if sessionStorage key "disclaimer_v1_accepted" is absent.
//   - Non-dismissible: cannot be closed by clicking outside or pressing Escape.
//   - Three required checkboxes — all must be checked before "I Accept" is enabled.
//   - "I Accept" → POSTs event_type "first_message_disclaimer", sets sessionStorage flag,
//     calls onAccept().
//   - "I Disagree" → POSTs event_type "disclaimer_declined", calls onDecline() which
//     should redirect or show a locked state.
//   - Consent POST is best-effort (failure does not block acceptance).

import { useState, useEffect, useId } from "react";
import { acknowledgeConsent } from "@/lib/api";
import type { ConsentAcknowledgeRequest } from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────
const DISCLAIMER_VERSION = "1.0";
const PRIVACY_POLICY_VERSION = "1.0";
const SESSION_KEY = "disclaimer_v1_accepted";

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
  const [checks, setChecks] = useState({
    general_info: false,
    no_reliance: false,
    read_policies: false,
  });
  const [posting, setPosting] = useState(false);

  const allChecked = checks.general_info && checks.no_reliance && checks.read_policies;

  const toggle = (key: keyof typeof checks) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const postConsent = async (
    event_type: ConsentAcknowledgeRequest["event_type"]
  ): Promise<void> => {
    try {
      const payload: ConsentAcknowledgeRequest = {
        session_id: getOrCreateSessionId(),
        event_type,
        checkbox_states: { ...checks },
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
    if (!allChecked || posting) return;
    setPosting(true);
    await postConsent("first_message_disclaimer");
    sessionStorage.setItem(SESSION_KEY, "true");
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
            Before you continue — please read this
          </h2>
        </div>

        <div id={`${uid}-modal-desc`} className="disclaimer-modal__body">
          <p>
            This tool provides <strong>general legal information</strong> about New Zealand
            employment and tax law. It is <strong>not legal advice</strong> and does not create
            a lawyer–client relationship.
          </p>
          <p>
            The information is drawn from publicly available sources last retrieved as of the
            date shown in each response. Laws change — always verify with an authoritative
            source before acting.
          </p>
          <p>
            <strong>Do not rely on this tool</strong> for decisions about your specific
            situation. If you need advice, please consult a qualified legal professional or
            contact{" "}
            <a href="https://communitylaw.org.nz" target="_blank" rel="noopener noreferrer">
              Community Law
            </a>{" "}
            (free help available) or{" "}
            <a href="https://www.cab.org.nz" target="_blank" rel="noopener noreferrer">
              Citizens Advice Bureau
            </a>
            .
          </p>
        </div>

        <fieldset className="disclaimer-modal__checks">
          <legend className="disclaimer-modal__checks-legend">
            Please confirm you understand:
          </legend>

          <label className="disclaimer-modal__check-row">
            <input
              type="checkbox"
              checked={checks.general_info}
              onChange={() => toggle("general_info")}
            />
            <span>
              I understand this is <strong>general information only</strong>, not legal advice.
            </span>
          </label>

          <label className="disclaimer-modal__check-row">
            <input
              type="checkbox"
              checked={checks.no_reliance}
              onChange={() => toggle("no_reliance")}
            />
            <span>
              I will <strong>not rely</strong> on this information for decisions about my
              specific situation without consulting a professional.
            </span>
          </label>

          <label className="disclaimer-modal__check-row">
            <input
              type="checkbox"
              checked={checks.read_policies}
              onChange={() => toggle("read_policies")}
            />
            <span>
              I have read and accept the{" "}
              <a href="/disclaimer" target="_blank" rel="noopener noreferrer">
                Disclaimer
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </fieldset>

        <div className="disclaimer-modal__actions">
          <button
            className="disclaimer-modal__btn disclaimer-modal__btn--accept"
            onClick={handleAccept}
            disabled={!allChecked || posting}
            aria-disabled={!allChecked || posting}
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

// ── Hook: useDisclaimerGate ────────────────────────────────────────────────────
// Returns whether the modal should be shown.
// Safe to call during SSR (defaults to false until hydration).
export function useDisclaimerGate(): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const accepted = sessionStorage.getItem(SESSION_KEY);
    if (!accepted) setShow(true);
  }, []);
  return show;
}
