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
          <div className="icon" aria-hidden="true">🧭</div>
          <span>NZ Law<br />Compass</span>
        </div>

        <TopicSelector />

        <div className="sb-desc">
          {ui.sidebarDescription}
          <br /><br />
          <strong>Employment law:</strong>
          <ul>
            <li>Employment agreements &amp; trial periods</li>
            <li>Leave entitlements (annual, sick, parental)</li>
            <li>Dismissal, redundancy &amp; grievances</li>
            <li>Wages, hours &amp; workplace rights</li>
          </ul>
          <br />
          <strong>Tenancy law:</strong>
          <ul>
            <li>Tenancy agreements &amp; bonds</li>
            <li>Rent, repairs &amp; Healthy Homes</li>
            <li>Ending a tenancy &amp; Tenancy Tribunal</li>
            <li>Pet consent, boarding houses &amp; flatting</li>
          </ul>
          <br />
          <strong>Tax rules:</strong>
          <ul>
            <li>GST registration &amp; obligations</li>
            <li>Income tax &amp; PAYE</li>
            <li>KiwiSaver contributions</li>
            <li>Self-employment &amp; business tax basics</li>
          </ul>
          <br />
          <strong>Labour market data:</strong>
          <ul>
            <li>Unemployment &amp; participation rates</li>
            <li>Earnings by industry, region &amp; gender</li>
            <li>Employment trends from Stats NZ</li>
          </ul>
          <br />
          <strong>Data sources:</strong><br />
          Official NZ government websites, Tenancy Services, Inland Revenue (IRD) &amp; Stats NZ.
          <br /><br />
          <em>General information only — not legal or tax advice. For your specific situation, consult a qualified employment lawyer, tax advisor, or accountant.</em>
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
