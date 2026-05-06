"use client";
import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatArea } from "./ChatArea";
import { InputBar } from "./InputBar";
import { Modal, ModalId } from "./Modal";
import { DisclaimerModal, useDisclaimerGate } from "./DisclaimerModal";
import { useTopicContext } from "@/contexts/TopicContext";
import { askAgentQuestion } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

let _id = 0;
const nextId = () => `msg-${++_id}`;

export function ChatLayout() {
  const { activeTopic, setMessages, clearMessages } = useTopicContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalId | null>(null);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<"ok" | "error" | null>(null);
  // Disclaimer gate — show blocking modal until user accepts
  const showDisclaimer = useDisclaimerGate();
  const [disclaimerDone, setDisclaimerDone] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleSend = useCallback(
    async (text: string, retryId?: string) => {
      if (!text.trim() || busy || !activeTopic) return;
      setBusy(true);

      const loadId = retryId ?? nextId();

      if (!retryId) {
        const userMsg: ChatMessage = { id: nextId(), role: "user", text };
        const loadMsg: ChatMessage = { id: loadId, role: "bot", loading: true };
        setMessages(activeTopic.id, (prev) => [...prev, userMsg, loadMsg]);
      } else {
        setMessages(activeTopic.id, (prev) =>
          prev.map((m) => m.id === loadId ? { ...m, loading: true, error: false } : m)
        );
      }

      try {
        const result = await askAgentQuestion(text);
        const botMsg: ChatMessage = {
          id: loadId, role: "bot",
          text: result.answer,
          sources: result.sources,
          chart: result.chart,
          outOfRangeWarning: null,
          question: result.question,
          riskBadge: result.risk_badge,
          refused: result.refused,
          loading: false,
        };
        setMessages(activeTopic.id, (prev) =>
          prev.map((m) => m.id === loadId ? botMsg : m)
        );
      } catch (err) {
        const raw = err instanceof Error ? err.message : "Unknown error";
        const errorMsg = raw.includes("Failed to fetch")
          ? "Could not reach the server. Please check your connection."
          : raw.length < 200 ? raw : "Service temporarily unavailable. Please try again later.";
        setMessages(activeTopic.id, (prev) =>
          prev.map((m) =>
            m.id === loadId
              ? { id: loadId, role: "bot", loading: false, error: true, errorMsg, question: text }
              : m
          )
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, activeTopic, setMessages]
  );

  const handleClear = () => { if (activeTopic && !busy) clearMessages(activeTopic.id); };

  // Declined state — show a locked screen with referral info
  if (declined) {
    return (
      <div className="app-shell disclaimer-declined-shell">
        <div className="disclaimer-declined-card">
          <span aria-hidden="true" style={{ fontSize: "2rem" }}>⚖️</span>
          <h1>This tool is not available without accepting the disclaimer.</h1>
          <p>
            If you need legal help, please contact:
          </p>
          <ul>
            <li>
              <a href="https://communitylaw.org.nz" target="_blank" rel="noopener noreferrer">
                Community Law
              </a>{" "}— free legal help
            </li>
            <li>Citizens Advice Bureau — 0800 367 222</li>
          </ul>
          <button
            className="disclaimer-modal__btn disclaimer-modal__btn--accept"
            style={{ marginTop: "1.5rem" }}
            onClick={() => {
              setDeclined(false);
              // sessionStorage key is absent so modal will reappear
            }}
          >
            Review disclaimer again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Blocking disclaimer modal — shown until user accepts */}
      {showDisclaimer && !disclaimerDone && (
        <DisclaimerModal
          onAccept={() => setDisclaimerDone(true)}
          onDecline={() => setDeclined(true)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onModal={setModal} />
      <div className="main">
        <Topbar
          onHamburger={() => setSidebarOpen(true)}
          onClear={handleClear}
          health={health}
          onHealthChange={setHealth}
        />
        <ChatArea onSend={handleSend} onRetry={handleSend} />
        <InputBar onSend={handleSend} busy={busy} onModal={setModal} />
      </div>
      {modal && <Modal id={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
