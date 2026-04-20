import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FeedbackRow } from "@/components/FeedbackRow";
import { TopicProvider } from "@/contexts/TopicContext";
import { sendFeedback, fetchTopics, fetchHealth } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  fetchTopics: jest.fn().mockResolvedValue([
    { id: "nz_employment_law", label: "Employment Law", description: "", chunk_count: 1960, active: true },
  ]),
  fetchHealth: jest.fn().mockResolvedValue({ status: "ok" }),
  sendFeedback: jest.fn().mockResolvedValue(undefined),
}));

const mockSendFeedback = sendFeedback as jest.MockedFunction<typeof sendFeedback>;

function renderFeedback(question = "Test question") {
  return render(
    <TopicProvider initialTopicId="nz_employment_law">
      <FeedbackRow question={question} />
    </TopicProvider>
  );
}

describe("FeedbackRow", () => {
  beforeEach(() => mockSendFeedback.mockClear());

  it("renders helpful and not helpful buttons", () => {
    renderFeedback();
    expect(screen.getByLabelText(/Mark as helpful/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mark as not helpful/i)).toBeInTheDocument();
  });

  it("calls sendFeedback with 'up' on thumbs-up click", async () => {
    renderFeedback("How many sick days?");
    fireEvent.click(screen.getByLabelText(/Mark as helpful/i));
    await waitFor(() =>
      expect(mockSendFeedback).toHaveBeenCalledWith(
        "How many sick days?",
        "up",
        "nz_employment_law"
      )
    );
  });

  it("calls sendFeedback with 'down' on thumbs-down click", async () => {
    renderFeedback("How many sick days?");
    fireEvent.click(screen.getByLabelText(/Mark as not helpful/i));
    await waitFor(() =>
      expect(mockSendFeedback).toHaveBeenCalledWith(
        "How many sick days?",
        "down",
        "nz_employment_law"
      )
    );
  });

  it("disables both buttons after feedback is given", async () => {
    renderFeedback();
    fireEvent.click(screen.getByLabelText(/Mark as helpful/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/Mark as helpful/i)).toBeDisabled();
      expect(screen.getByLabelText(/Mark as not helpful/i)).toBeDisabled();
    });
  });

  it("does not call sendFeedback twice if button clicked again", async () => {
    renderFeedback();
    const btn = screen.getByLabelText(/Mark as helpful/i);
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => expect(mockSendFeedback).toHaveBeenCalledTimes(1));
  });
});
