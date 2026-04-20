import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/Modal";

describe("Modal", () => {
  it("renders Privacy Policy content", () => {
    render(<Modal id="privacy" onClose={jest.fn()} />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText(/does not collect, store/i)).toBeInTheDocument();
  });

  it("renders Disclaimer content", () => {
    render(<Modal id="disclaimer" onClose={jest.fn()} />);
    expect(screen.getByText("Disclaimer")).toBeInTheDocument();
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
  });

  it("renders Terms of Use content", () => {
    render(<Modal id="terms" onClose={jest.fn()} />);
    expect(screen.getByText("Terms of Use")).toBeInTheDocument();
    expect(screen.getByText(/not a substitute for legal advice/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<Modal id="privacy" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = jest.fn();
    render(<Modal id="privacy" onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when modal body is clicked", () => {
    const onClose = jest.fn();
    render(<Modal id="privacy" onClose={onClose} />);
    fireEvent.click(screen.getByText("Privacy Policy"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
