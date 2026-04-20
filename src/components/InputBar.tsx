"use client";
import { useRef, useState } from "react";
import { useTopicContext } from "@/contexts/TopicContext";
import { getTopicUI } from "@/config/topics.config";
import type { ModalId } from "./Modal";

interface InputBarProps {
  onSend: (text: string) => void;
  busy: boolean;
  onModal?: (id: ModalId) => void;
}

export function InputBar({ onSend, busy, onModal }: InputBarProps) {
  const { activeTopic } = useTopicContext();
  const ui = getTopicUI(activeTopic?.id ?? "");
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const t = e.target;
    t.style.height = "22px";
    t.style.height = `${Math.min(t.scrollHeight, 130)}px`;
  };

  const submit = () => {
    if (!input.trim() || busy) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "22px";
  };

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder={ui.inputPlaceholder}
          rows={1}
          disabled={busy}
          aria-label="Question input"
        />
        <button
          className="send-btn"
          onClick={submit}
          disabled={busy || !input.trim()}
          aria-label="Send message"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M13 7.5L2 2l2.2 5.5L2 13l11-5.5z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {onModal && (
        <div className="footer-links">
          <button onClick={() => onModal("privacy")}>Privacy</button>
          <button onClick={() => onModal("disclaimer")}>Disclaimer</button>
          <button onClick={() => onModal("terms")}>Terms of Use</button>
          <button style={{ textDecoration: "none", cursor: "default" }}>
            © 2026 Laura Cai
          </button>
        </div>
      )}
    </div>
  );
}
