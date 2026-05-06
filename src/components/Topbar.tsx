"use client";
import { useEffect } from "react";
import { useTopicContext } from "@/contexts/TopicContext";
import { fetchHealth } from "@/lib/api";

interface TopbarProps {
  onHamburger: () => void;
  onClear: () => void;
  health: "ok" | "error" | null;
  onHealthChange: (h: "ok" | "error") => void;
}

export function Topbar({ onHamburger, onClear, health, onHealthChange }: TopbarProps) {
  const { activeTopic, conversations } = useTopicContext();
  const hasMessages = activeTopic
    ? (conversations[activeTopic.id]?.length ?? 0) > 0
    : false;

  useEffect(() => {
    fetchHealth()
      .then(() => onHealthChange("ok"))
      .catch(() => onHealthChange("error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const healthLabel =
    health === "ok"
      ? "Backend connected"
      : health === "error"
      ? "Backend unavailable"
      : "Checking backend…";

  return (
    <div className="topbar">
      <div className="topbar-title">
        <button
          className="hamburger"
          onClick={onHamburger}
          aria-label="Open navigation"
        >
          ☰
        </button>
        <h1>🧭 NZ Law Compass</h1>
        <span className="badge">Free · Beta</span>
        <div
          className={`health-dot ${health ?? ""}`}
          title={healthLabel}
          aria-label={healthLabel}
          role="status"
        />
      </div>

      <div className="topbar-right">
        {hasMessages && (
          <button className="icon-btn" onClick={onClear} aria-label="Clear conversation">
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
