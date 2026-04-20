"use client";
import { useTopicContext } from "@/contexts/TopicContext";
import { getTopicUI } from "@/config/topics.config";
import { TopicSelector } from "./TopicSelector";
import type { ModalId } from "./Modal";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onModal: (id: ModalId) => void;
}

export function Sidebar({ open, onClose, onModal }: SidebarProps) {
  const { activeTopic } = useTopicContext();
  const ui = getTopicUI(activeTopic?.id ?? "");

  return (
    <>
      <div
        className={`sb-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Navigation">
        <button className="sb-close" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>

        <div className="sb-logo">
          <div className="icon" aria-hidden="true">⚖️</div>
          <span>NZ Employment<br />Law Assistant</span>
        </div>

        <TopicSelector />

        <div className="sb-desc">
          {ui.sidebarDescription}
          <br /><br />
          <strong>What it covers:</strong>
          <ul>
            <li>Employment agreements &amp; trial periods</li>
            <li>Leave entitlements (annual, sick, parental)</li>
            <li>Dismissal, redundancy &amp; grievances</li>
            <li>Wages, hours &amp; workplace rights</li>
          </ul>
          <br />
          <strong>Data sources:</strong><br />
          Official NZ government websites only.
          <br /><br />
          <em>Not legal advice. For serious matters, consult a qualified employment lawyer.</em>
        </div>

        <hr className="sb-divider" />

        <div className="sb-footer">
          <a
            href="https://www.linkedin.com/in/laurahfc/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            👤 Built by Laura Cai
            <span className="li-badge">LinkedIn</span>
          </a>
        </div>
      </aside>
    </>
  );
}
