import { render, screen, fireEvent } from "@testing-library/react";
import { SourcesPanel } from "@/components/SourcesPanel";
import type { Source } from "@/lib/types";

const MOCK_SOURCES: Source[] = [
  {
    title: "Minimum wage | Employment New Zealand",
    url: "https://www.employment.govt.nz/minimum-wage",
    content_type: "guide",
    source_name: "employment_govt_nz",
  },
  {
    title: "Employment Relations Act 2000",
    url: "https://www.legislation.govt.nz/act/2000",
    content_type: "legislation",
    source_name: "legislation_govt_nz",
  },
  // duplicate — should be deduplicated
  {
    title: "Minimum wage | Employment New Zealand",
    url: "https://www.employment.govt.nz/minimum-wage",
    content_type: "guide",
    source_name: "employment_govt_nz",
  },
];

describe("SourcesPanel", () => {
  it("renders the sources toggle button", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows '2 sources' after deduplication", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    expect(screen.getByText(/2 sources/i)).toBeInTheDocument();
  });

  it("sources are collapsed by default", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    expect(screen.queryByText(/employment\.govt\.nz/)).not.toBeInTheDocument();
  });

  it("expands when toggle is clicked", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/Minimum wage | Employment New Zealand/i)).toBeInTheDocument();
  });

  it("collapses again on second click", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(screen.queryByText(/Minimum wage | Employment New Zealand/i)).not.toBeInTheDocument();
  });

  it("renders content type badges", () => {
    render(<SourcesPanel sources={MOCK_SOURCES} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("guide")).toBeInTheDocument();
    expect(screen.getByText("legislation")).toBeInTheDocument();
  });

  it("returns null when sources array is empty", () => {
    const { container } = render(<SourcesPanel sources={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
