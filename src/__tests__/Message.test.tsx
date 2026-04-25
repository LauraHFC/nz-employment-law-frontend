/**
 * Message.test.tsx — unit tests for the v3 Message component
 *
 * Covers the three rendering branches added in v3:
 *   - chart (DataChart rendered below answer)
 *   - outOfRangeWarning (amber warning banner)
 *   - intent field stored on ChatMessage
 *
 * Also covers existing behaviour: loading state, error state, user bubble,
 * sources panel presence, and feedback row presence.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Message } from "@/components/Message";
import type { ChatMessage, ChartConfig } from "@/lib/types";

// ── Mock heavy child components so tests stay fast and focused ────────────────
jest.mock("@/components/DataChart", () => ({
  DataChart: ({ chart }: { chart: ChartConfig }) => (
    <div data-testid="data-chart" data-title={chart.title} />
  ),
}));

jest.mock("@/components/SourcesPanel", () => ({
  SourcesPanel: ({ sources }: { sources: unknown[] }) => (
    <div data-testid="sources-panel" data-count={sources.length} />
  ),
}));

jest.mock("@/components/FeedbackRow", () => ({
  FeedbackRow: () => <div data-testid="feedback-row" />,
}));

jest.mock("@/components/LoadingDots", () => ({
  LoadingDots: ({ label }: { label: string }) => (
    <div data-testid="loading-dots">{label}</div>
  ),
}));

// react-markdown: render children as plain text in tests
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <span>{children}</span>,
}));
jest.mock("remark-gfm", () => ({ __esModule: true, default: () => {} }));

// ── Helpers ───────────────────────────────────────────────────────────────────
const CHART: ChartConfig = {
  type: "line",
  title: "Unemployment Rate",
  x_key: "quarter",
  y_keys: ["rate"],
  y_label: "%",
  data: [{ quarter: "2023 Q1", rate: 3.2 }],
};

function botMsg(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: "msg-1",
    role: "bot",
    text: "Here is your answer.",
    sources: [],
    chart: null,
    outOfRangeWarning: null,
    intent: "legal",
    loading: false,
    error: false,
    ...overrides,
  };
}

const noop = () => {};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Message — user bubble", () => {
  it("renders user text without chart, sources, or feedback", () => {
    const msg: ChatMessage = { id: "u1", role: "user", text: "What is the minimum wage?" };
    render(<Message msg={msg} onRetry={noop} />);
    expect(screen.getByText("What is the minimum wage?")).toBeTruthy();
    expect(screen.queryByTestId("data-chart")).toBeNull();
    expect(screen.queryByTestId("feedback-row")).toBeNull();
  });
});

describe("Message — bot loading state", () => {
  it("shows loading dots and not the answer", () => {
    render(<Message msg={botMsg({ loading: true, text: undefined })} onRetry={noop} />);
    expect(screen.getByTestId("loading-dots")).toBeTruthy();
    expect(screen.queryByTestId("feedback-row")).toBeNull();
  });
});

describe("Message — bot error state", () => {
  it("shows error message and retry button", () => {
    const msg = botMsg({ error: true, errorMsg: "Service unavailable.", question: "test?" });
    const retryFn = jest.fn();
    render(<Message msg={msg} onRetry={retryFn} />);
    expect(screen.getByText(/Service unavailable/)).toBeTruthy();
    const retryBtn = screen.getByText(/Try again/i);
    fireEvent.click(retryBtn);
    expect(retryFn).toHaveBeenCalledWith("test?", "msg-1");
  });

  it("does not show retry button when question is missing", () => {
    render(<Message msg={botMsg({ error: true, errorMsg: "Oops", question: undefined })} onRetry={noop} />);
    expect(screen.queryByText(/Try again/i)).toBeNull();
  });
});

describe("Message — bot answer (v3 legal path)", () => {
  it("renders answer text", () => {
    render(<Message msg={botMsg({ text: "Employees get 10 sick days." })} onRetry={noop} />);
    expect(screen.getByText("Employees get 10 sick days.")).toBeTruthy();
  });

  it("renders feedback row", () => {
    render(<Message msg={botMsg()} onRetry={noop} />);
    expect(screen.getByTestId("feedback-row")).toBeTruthy();
  });

  it("does NOT render DataChart when chart is null", () => {
    render(<Message msg={botMsg({ chart: null })} onRetry={noop} />);
    expect(screen.queryByTestId("data-chart")).toBeNull();
  });

  it("does NOT render warning banner when outOfRangeWarning is null", () => {
    render(<Message msg={botMsg({ outOfRangeWarning: null })} onRetry={noop} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders sources panel when sources are present", () => {
    const sources = [{ title: "Employment NZ", url: "https://employment.govt.nz", content_type: "guide" }];
    render(<Message msg={botMsg({ sources })} onRetry={noop} />);
    expect(screen.getByTestId("sources-panel")).toBeTruthy();
  });

  it("does NOT render sources panel when sources array is empty", () => {
    render(<Message msg={botMsg({ sources: [] })} onRetry={noop} />);
    expect(screen.queryByTestId("sources-panel")).toBeNull();
  });
});

describe("Message — v3 chart rendering (data / hybrid path)", () => {
  it("renders DataChart when chart is non-null", () => {
    render(<Message msg={botMsg({ chart: CHART, intent: "data" })} onRetry={noop} />);
    const chartEl = screen.getByTestId("data-chart");
    expect(chartEl).toBeTruthy();
    expect(chartEl.getAttribute("data-title")).toBe("Unemployment Rate");
  });

  it("does NOT render DataChart during loading even if chart is present", () => {
    render(<Message msg={botMsg({ chart: CHART, loading: true })} onRetry={noop} />);
    expect(screen.queryByTestId("data-chart")).toBeNull();
  });

  it("does NOT render DataChart on error even if chart is present", () => {
    render(<Message msg={botMsg({ chart: CHART, error: true })} onRetry={noop} />);
    expect(screen.queryByTestId("data-chart")).toBeNull();
  });
});

describe("Message — v3 outOfRangeWarning banner", () => {
  it("renders amber warning banner when outOfRangeWarning is set", () => {
    const msg = botMsg({
      outOfRangeWarning: "Data only covers 2018–2024. Your query is outside this range.",
    });
    render(<Message msg={msg} onRetry={noop} />);
    const banner = screen.getByRole("alert");
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain("Data only covers 2018–2024");
  });

  it("does NOT render warning banner during loading", () => {
    render(
      <Message
        msg={botMsg({ loading: true, outOfRangeWarning: "Out of range" })}
        onRetry={noop}
      />
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("Message — v3 hybrid path (chart + sources)", () => {
  it("renders both DataChart and SourcesPanel for hybrid intent", () => {
    const sources = [{ title: "Employment NZ", url: "https://employment.govt.nz", content_type: "guide" }];
    render(
      <Message
        msg={botMsg({ chart: CHART, sources, intent: "hybrid" })}
        onRetry={noop}
      />
    );
    expect(screen.getByTestId("data-chart")).toBeTruthy();
    expect(screen.getByTestId("sources-panel")).toBeTruthy();
  });
});
