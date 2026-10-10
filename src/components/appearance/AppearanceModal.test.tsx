import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AppearanceModal from "./AppearanceModal";

describe("AppearanceModal", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders closed by default (null)", () => {
    const { container } = render(<AppearanceModal isOpen={false} onClose={() => {}} onSelect={() => {}} />);
    expect(container.innerHTML).toBe("");
  });

  it("opens and shows appearance grid", () => {
    render(<AppearanceModal isOpen={true} onClose={() => {}} onSelect={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onSelect when a color button is clicked", () => {
    const onSelect = vi.fn();
    render(<AppearanceModal isOpen={true} onClose={() => {}} onSelect={onSelect} />);
    const colorBtns = screen.getAllByLabelText(/Appearance #/);
    fireEvent.click(colorBtns[0]);
    expect(onSelect).toHaveBeenCalledWith(expect.stringMatching(/^#/));
  });
});
