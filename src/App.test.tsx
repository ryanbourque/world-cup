import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Dream Squad Builder")).toBeDefined();
  });

  it("renders the draft screen with Draw button and picks remaining", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /draw/i })).toBeDefined();
    expect(screen.getByText(/picks remaining: 14/i)).toBeDefined();
  });
});
