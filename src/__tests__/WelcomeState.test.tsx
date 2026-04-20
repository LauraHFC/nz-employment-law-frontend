import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeState } from "@/components/WelcomeState";
import { TopicProvider } from "@/contexts/TopicContext";

// Mock fetchTopics so TopicProvider doesn't hit the network
jest.mock("@/lib/api", () => ({
  fetchTopics: jest.fn().mockResolvedValue([
    {
      id: "nz_employment_law",
      label: "Employment Law",
      description: "NZ employment law",
      chunk_count: 1960,
      active: true,
    },
  ]),
  fetchHealth: jest.fn().mockResolvedValue({ status: "ok" }),
}));

function renderWelcome(onSend = jest.fn()) {
  return render(
    <TopicProvider initialTopicId="nz_employment_law">
      <WelcomeState onSend={onSend} />
    </TopicProvider>
  );
}

describe("WelcomeState", () => {
  it("renders the empty-state heading", async () => {
    renderWelcome();
    expect(
      await screen.findByText(/Ask anything about NZ employment law/i)
    ).toBeInTheDocument();
  });

  it("renders 6 example question chips", async () => {
    renderWelcome();
    const chips = await screen.findAllByRole("listitem");
    expect(chips.length).toBe(6);
  });

  it("calls onSend with the chip question when clicked", async () => {
    const onSend = jest.fn();
    renderWelcome(onSend);
    const chip = await screen.findByText(/minimum wage/i);
    fireEvent.click(chip);
    expect(onSend).toHaveBeenCalledWith("What is the minimum wage in NZ?");
  });
});
