import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders with initial count", () => {
    render(<App />);
    expect(screen.getByText("count is 0")).toBeDefined();
  });

  it("increments count on button click", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole("button", { name: /count is/u });
    await user.click(button);

    expect(screen.getByText("count is 1")).toBeDefined();
  });
});
