interface LoadingDotsProps {
  label?: string;
}

export function LoadingDots({ label }: LoadingDotsProps) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <div className="loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {label && <span className="loading-label">{label}</span>}
    </div>
  );
}
