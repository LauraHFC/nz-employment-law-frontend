import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FeedbackRow } from "@/components/FeedbackRow";
import { sendFeedback } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  sendFeedback: jest.fn().mockResolvedValue(undefined),
}));

const mockSendFeedback = sendFeedback as jest.MockedFunction<typeof sendFeedback>;

const TEST_TRACE_ID = "trace-abc-123";

// Sprint 5: FeedbackRow now takes traceId (not question/topic) — Langfuse-backed
function renderFeedback(answer = "Test answer text", traceId: string | null = TEST_TRACE_ID) {
  return render(<FeedbackRow answer={answer} traceId={traceId} />);
}

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
    expect(await getHelpfulBtn()).toBeInTheDocument();
    expect(await getNotHelpfulBtn()).toBeInTheDocument();
  });

  it("calls sendFeedback with trace_id and 'up' on thumbs-up click", async () => {
    renderFeedback("The answer", TEST_TRACE_ID);
    fireEvent.click(await getHelpfulBtn());
    await waitFor(() =>
      expect(mockSendFeedback).toHaveBeenCalledWith(TEST_TRACE_ID, "up")
    );
  });

  it("calls sendFeedback with trace_id and 'down' on thumbs-down click", async () => {
    renderFeedback("The answer", TEST_TRACE_ID);
    fireEvent.click(await getNotHelpfulBtn());
    await waitFor(() =>
      expect(mockSendFeedback).toHaveBeenCalledWith(TEST_TRACE_ID, "down")
    );
  });

  it("does NOT call sendFeedback when traceId is null (Langfuse disabled)", async () => {
    renderFeedback("The answer", null);
    fireEvent.click(await getHelpfulBtn());
    await waitFor(() => expect(mockSendFeedback).not.toHaveBeenCalled());
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

  it("copy button copies the answer text", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderFeedback("The current minimum wage is $23.15/hr.");
    fireEvent.click(screen.getByLabelText(/Copy answer/i));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("The current minimum wage is $23.15/hr.")
    );
  });

  it("copy button shows '✓ Copied' after click", async () => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    renderFeedback("answer text");
    fireEvent.click(screen.getByLabelText(/Copy answer/i));
    await waitFor(() => expect(screen.getByText(/Copied/)).toBeTruthy());
  });
});
