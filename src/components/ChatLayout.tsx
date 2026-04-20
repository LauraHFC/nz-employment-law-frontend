"use client";
// Root layout component — wires sidebar + main together
import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ChatArea } from "./ChatArea";
import { InputBar } from "./InputBar";
import { Modal, ModalId } from "./Modal";
import { useTopicContext } from "@/contexts/TopicContext";
import { askQuestion } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

let _id = 0;
const nextId = () => `msg-${++_id}`;

export function ChatLayout() {
  const { activeTopic, setMessages, clearMessages } = useTopicContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<ModalId | null>(null);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<"ok" | "error" | null>(null);

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
          prev.map((m) => (m.id === loadId ? { ...m, loading: true, error: false } : m))
        );
      }

      try {
        const result = await askQuestion(text, activeTopic.id);
        setMessages(activeTopic.id, (prev) =>
          prev.map((m) =>
            m.id === loadId
              ? {
                  id: loadId,
                  role: "bot",
                  text: result.answer,
                  sources: result.sources,
                  question: result.question,
                  loading: false,
                }
              : m
          )
        );
      } catch (err) {
        const raw = err instanceof Error ? err.message : "Unknown error";
        const errorMsg = raw.includes("Failed to fetch")
          ? "Could not reach the server. Please check your connection."
          : raw.length < 200
          ? raw
          : "Service temporarily unavailable. Please try again later.";
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

  const handleClear = () => {
    if (activeTopic && !busy) clearMessages(activeTopic.id);
  };

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onModal={setModal}
      />

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
