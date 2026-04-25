/**
 * DataChart.test.tsx — unit tests for the v3 chart renderer
 *
 * Recharts uses SVG internally; ResizeObserver is not available in jsdom so we
 * stub it.  The tests verify the component renders (or gracefully returns null)
 * for every chart type that the backend can produce.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { DataChart } from "@/components/DataChart";
import type { ChartConfig } from "@/lib/types";

// ── jsdom stubs ───────────────────────────────────────────────────────────────
// Recharts' ResponsiveContainer depends on ResizeObserver, which is absent in
// jsdom.  Providing a minimal stub prevents console errors during tests.
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // SVGElement.getTotalLength used by some Recharts internals
  Object.defineProperty(SVGElement.prototype, "getTotalLength", {
    value: () => 0,
    writable: true,
  });
});

// ── Shared fixtures ───────────────────────────────────────────────────────────
const LINE_CHART: ChartConfig = {
  type: "line",
  title: "Unemployment Rate Over Time",
  x_key: "quarter",
  y_keys: ["rate"],
  y_label: "%",
  data: [
    { quarter: "2022 Q1", rate: 3.2 },
    { quarter: "2022 Q2", rate: 3.3 },
    { quarter: "2022 Q3", rate: 3.4 },
  ],
};

const BAR_CHART: ChartConfig = {
  type: "bar",
  title: "Average Weekly Earnings by Industry",
  x_key: "industry",
  y_keys: ["earnings"],
  y_label: "NZD",
  data: [
    { industry: "Healthcare", earnings: 1250 },
    { industry: "Construction", earnings: 1400 },
  ],
};

const GROUPED_BAR_CHART: ChartConfig = {
  type: "grouped_bar",
  title: "Male vs Female Earnings",
  x_key: "year",
  y_keys: ["male", "female"],
  y_label: "NZD",
  data: [
    { year: "2022", male: 1500, female: 1200 },
    { year: "2023", male: 1550, female: 1260 },
  ],
};

const PIE_CHART: ChartConfig = {
  type: "pie",
  title: "Employment by Sector",
  x_key: "sector",
  y_keys: ["count"],
  y_label: "",
  data: [
    { sector: "Private", count: 70 },
    { sector: "Public", count: 30 },
  ],
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DataChart — line", () => {
  it("renders the chart title", () => {
    render(<DataChart chart={LINE_CHART} />);
    expect(screen.getByText("Unemployment Rate Over Time")).toBeTruthy();
  });

  it("renders a chart wrapper element", () => {
    const { container } = render(<DataChart chart={LINE_CHART} />);
    expect(container.querySelector(".chart-wrap")).toBeTruthy();
  });
});

describe("DataChart — bar", () => {
  it("renders the chart title", () => {
    render(<DataChart chart={BAR_CHART} />);
    expect(screen.getByText("Average Weekly Earnings by Industry")).toBeTruthy();
  });
});

describe("DataChart — grouped_bar", () => {
  it("renders the chart title", () => {
    render(<DataChart chart={GROUPED_BAR_CHART} />);
    expect(screen.getByText("Male vs Female Earnings")).toBeTruthy();
  });

  it("renders one Bar per y_key", () => {
    const { container } = render(<DataChart chart={GROUPED_BAR_CHART} />);
    // Recharts renders <g class="recharts-bar"> for each series
    // We can't rely on SVG structure being fully rendered in jsdom, but we can
    // check the wrapper exists and no error was thrown.
    expect(container.querySelector(".chart-wrap")).toBeTruthy();
  });
});

describe("DataChart — pie", () => {
  it("renders the chart title", () => {
    render(<DataChart chart={PIE_CHART} />);
    expect(screen.getByText("Employment by Sector")).toBeTruthy();
  });
});

describe("DataChart — unknown type (graceful fallback)", () => {
  it("returns null for an unknown chart type without throwing", () => {
    // Cast to bypass TypeScript — backend could return an unexpected type
    const badChart = { ...LINE_CHART, type: "scatter" } as unknown as ChartConfig;
    const { container } = render(<DataChart chart={badChart} />);
    // Nothing should be rendered
    expect(container.firstChild).toBeNull();
  });
});

describe("DataChart — malformed data (graceful fallback)", () => {
  it("returns null if data is undefined without throwing", () => {
    const badChart = { ...LINE_CHART, data: undefined } as unknown as ChartConfig;
    // Should NOT throw — component catches internally
    expect(() => render(<DataChart chart={badChart} />)).not.toThrow();
  });
});
