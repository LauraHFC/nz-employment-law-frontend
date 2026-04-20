"use client";

// §5.6 — verbatim legal disclaimer text (legal requirement — do not paraphrase)
const MODALS = {
  privacy: {
    title: "Privacy Policy",
    body: "This tool does not collect, store, or transmit any personal data. Conversations are temporary and exist only within your browser session — permanently deleted when you close or refresh the page. No account registration is required.",
  },
  disclaimer: {
    title: "Disclaimer",
    body: "Information is sourced from official NZ government websites including Employment New Zealand and MBIE. For general informational purposes only — not legal advice. Laws change. Always verify with an official source or qualified employment lawyer.",
  },
  terms: {
    title: "Terms of Use",
    body: "Provided free of charge for personal and educational use. By using this tool you agree that responses are for general reference only, not a substitute for legal advice.",
  },
} as const;

export type ModalId = keyof typeof MODALS;

interface ModalProps {
  id: ModalId;
  onClose: () => void;
}

export function Modal({ id, onClose }: ModalProps) {
  const m = MODALS[id];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 id="modal-title">{m.title}</h2>
        <p>{m.body}</p>
      </div>
    </div>
  );
}
