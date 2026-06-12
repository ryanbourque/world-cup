import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Player } from "../../shared/types";
import * as client from "../api/client";
import { DraftScreen } from "./DraftScreen";

vi.mock("../api/client");

const MOCK_OPTIONS: Player[] = [
  { id: 1, name: "Manuel Neuer", country: "Germany", position: "GK", goals: 1, caps: 120 },
  { id: 3, name: "Lionel Messi", country: "Argentina", position: "RW", goals: 81, caps: 180 },
  { id: 4, name: "Luka Modrić", country: "Croatia", position: "CM", goals: 31, caps: 160 },
  { id: 5, name: "Kylian Mbappé", country: "France", position: "ST", goals: 52, caps: 85 },
  { id: 6, name: "Virgil van Dijk", country: "Netherlands", position: "CB", goals: 13, caps: 75 },
];

beforeEach(() => {
  vi.mocked(client.draw).mockResolvedValue({ options: MOCK_OPTIONS });
});

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
        text.includes("Lionel") ||
        text.includes("Luka") ||
        text.includes("Kylian") ||
        text.includes("Virgil")
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
        text.includes("Argentina") ||
        text.includes("Croatia") ||
        text.includes("France") ||
        text.includes("Netherlands")
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
