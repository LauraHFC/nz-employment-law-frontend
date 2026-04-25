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

// v3: FeedbackRow now takes both `question` (for API) and `answer` (for clipboard)
function renderFeedback(question = "Test question", answer = "Test answer text") {
  return render(
    <TopicProvider initialTopicId="nz_employment_law">
      <FeedbackRow question={question} answer={answer} />
    </TopicProvider>
  );
}

// Wait for TopicProvider's async fetchTopics to resolve before interacting
async function getHelpfulBtn() {
  return screen.findByLabelText(/Mark as helpful/i);
}
async function getNotHelpfulBtn() {
  return screen.findByLabelText(/Mark as not helpful/i);
}

describe("FeedbackRow", () => {
  beforeEach(() => mockSendFeedback.mockClear());

  it("renders helpful and not helpful buttons", async () => {
    renderFeedback();
    // Use findBy* to wait for async topic load
    expect(await getHelpfulBtn()).toBeInTheDocument();
    expect(await getNotHelpfulBtn()).toBeInTheDocument();
  });

  it("calls sendFeedback with 'up' on thumbs-up click", async () => {
    renderFeedback("How many sick days?");
    // Wait for topic to load, then click
    fireEvent.click(await getHelpfulBtn());
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
    fireEvent.click(await getNotHelpfulBtn());
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
    fireEvent.click(await getHelpfulBtn());
    await waitFor(() => {
      expect(screen.getByLabelText(/Mark as helpful/i)).toBeDisabled();
      expect(screen.getByLabelText(/Mark as not helpful/i)).toBeDisabled();
    });
  });

  it("does not call sendFeedback twice if button clicked again", async () => {
    renderFeedback();
    const btn = await getHelpfulBtn();
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => expect(mockSendFeedback).toHaveBeenCalledTimes(1));
  });

  // v3 bug fix: copy button should copy the AI *answer*, not the question
  it("copy button copies the answer text (not the question)", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderFeedback("What is the minimum wage?", "The current minimum wage is $23.15/hr.");
    fireEvent.click(screen.getByLabelText(/Copy answer/i));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("The current minimum wage is $23.15/hr.")
    );
  });

  it("copy button shows '✓ Copied' after click", async () => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    renderFeedback("q", "answer text");
    fireEvent.click(screen.getByLabelText(/Copy answer/i));
    await waitFor(() => expect(screen.getByText(/Copied/)).toBeTruthy());
  });
});
