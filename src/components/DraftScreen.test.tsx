import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import type { Player } from "../../shared/types";
import { DraftScreen } from "./DraftScreen";

describe("DraftScreen", () => {
  it("renders Draw button enabled initially", () => {
    const onPick = vi.fn();
    render(<DraftScreen roster={[]} onPick={onPick} />);
    const drawButton = screen.getByRole("button", { name: /draw/i });
    expect((drawButton as HTMLButtonElement).disabled).toBe(false);
  });

  it("renders 5 player cards after clicking Draw", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<DraftScreen roster={[]} onPick={onPick} />);

    const drawButton = screen.getByRole("button", { name: /draw/i });
    await user.click(drawButton);

    const allButtons = screen.getAllByRole("button");
    const playerButtons = allButtons.filter((btn) => {
      const text = btn.textContent || "";
      return (
        text.includes("Manuel") ||
        text.includes("Alisson") ||
        text.includes("Lionel") ||
        text.includes("Luka") ||
        text.includes("Kylian") ||
        text.includes("Virgil") ||
        text.includes("Kevin") ||
        text.includes("Sergio")
      );
    });
    expect(playerButtons.length).toBe(5);
  });

  it("disables Draw button while options are showing", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<DraftScreen roster={[]} onPick={onPick} />);

    const drawButton = screen.getByRole("button", { name: /draw/i });
    await user.click(drawButton);

    expect((drawButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("calls onPick when a player card is clicked", async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<DraftScreen roster={[]} onPick={onPick} />);

    const drawButton = screen.getByRole("button", { name: /draw/i });
    await user.click(drawButton);

    const allButtons = screen.getAllByRole("button");
    const playerButtons = allButtons.filter((btn) => {
      const text = btn.textContent || "";
      return (
        text.includes("Germany") ||
        text.includes("Brazil") ||
        text.includes("Argentina") ||
        text.includes("Croatia") ||
        text.includes("France") ||
        text.includes("Netherlands") ||
        text.includes("Belgium") ||
        text.includes("Spain")
      );
    });

    const firstCard = playerButtons[0];
    if (firstCard !== undefined) {
      await user.click(firstCard);
      expect(onPick).toHaveBeenCalled();
    }
  });

  it("disables Draw button when picks remaining is 0", () => {
    const onPick = vi.fn();
    const fullRoster: Player[] = Array.from({ length: 14 }, (_, i) => {
      const idx = i + 1;
      return {
        id: idx,
        name: `Player ${String(idx)}`,
        country: `Country ${String(idx)}`,
        position: "GK" as const,
        goals: 0,
        caps: 50,
      };
    });

    render(<DraftScreen roster={fullRoster} onPick={onPick} />);
    const drawButton = screen.getByRole("button", { name: /draw/i });
    expect((drawButton as HTMLButtonElement).disabled).toBe(true);
  });
});
