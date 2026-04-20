import { render, screen } from "@testing-library/react";
import { TopicSelector } from "@/components/TopicSelector";
import { TopicProvider } from "@/contexts/TopicContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const ONE_TOPIC = [
  { id: "nz_employment_law", label: "Employment Law", description: "", chunk_count: 1960, active: true },
];
const TWO_TOPICS = [
  ...ONE_TOPIC,
  { id: "health_safety", label: "Health & Safety", description: "", chunk_count: 500, active: true },
];

jest.mock("@/lib/api", () => ({ fetchTopics: jest.fn(), fetchHealth: jest.fn().mockResolvedValue({ status: "ok" }) }));
import { fetchTopics } from "@/lib/api";
const mockFetchTopics = fetchTopics as jest.MockedFunction<typeof fetchTopics>;

describe("TopicSelector", () => {
  it("renders nothing when only 1 topic exists", async () => {
    mockFetchTopics.mockResolvedValue(ONE_TOPIC);
    const { container } = render(
      <TopicProvider initialTopicId="nz_employment_law">
        <TopicSelector />
      </TopicProvider>
    );
    // Wait a tick for effects
    await new Promise((r) => setTimeout(r, 50));
    expect(container.firstChild).toBeNull();
  });

  it("renders tab nav when 2+ topics exist", async () => {
    mockFetchTopics.mockResolvedValue(TWO_TOPICS);
    render(
      <TopicProvider initialTopicId="nz_employment_law">
        <TopicSelector />
      </TopicProvider>
    );
    expect(await screen.findByRole("tablist")).toBeInTheDocument();
    expect(await screen.findByText("Employment Law")).toBeInTheDocument();
    expect(await screen.findByText("Health & Safety")).toBeInTheDocument();
  });
});
