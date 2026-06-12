import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SquadScreen } from "./SquadScreen";
import type { DraftState, Player } from "../../shared/types";

const TEST_PLAYERS: Player[] = [
  {
    id: 1,
    name: "Manuel Neuer",
    country: "Germany",
    position: "GK",
    goals: 1,
    caps: 120,
  },
  {
    id: 2,
    name: "Virgil van Dijk",
    country: "Netherlands",
    position: "CB",
    goals: 13,
    caps: 75,
  },
  {
    id: 3,
    name: "Harry Kane",
    country: "England",
    position: "ST",
    goals: 60,
    caps: 105,
  },
  {
    id: 4,
    name: "Kevin De Bruyne",
    country: "Belgium",
    position: "CAM",
    goals: 33,
    caps: 120,
  },
  {
    id: 5,
    name: "Lionel Messi",
    country: "Argentina",
    position: "RW",
    goals: 81,
    caps: 180,
  },
  {
    id: 6,
    name: "Sergio Busquets",
    country: "Spain",
    position: "CDM",
    goals: 15,
    caps: 143,
  },
  {
    id: 7,
    name: "Robert Lewandowski",
    country: "Poland",
    position: "ST",
    goals: 76,
    caps: 145,
  },
  {
    id: 8,
    name: "Cristiano Ronaldo",
    country: "Portugal",
    position: "RW",
    goals: 140,
    caps: 196,
  },
  {
    id: 9,
    name: "Luka Modrić",
    country: "Croatia",
    position: "CM",
    goals: 31,
    caps: 160,
  },
  {
    id: 10,
    name: "Kylian Mbappé",
    country: "France",
    position: "ST",
    goals: 52,
    caps: 85,
  },
  {
    id: 11,
    name: "Alisson",
    country: "Brazil",
    position: "GK",
    goals: 0,
    caps: 80,
  },
  {
    id: 12,
    name: "Sergio Ramos",
    country: "Spain",
    position: "CB",
    goals: 21,
    caps: 180,
  },
];

const TEST_DRAFT_STATE: DraftState = {
  roster: TEST_PLAYERS,
  assignments: {},
};

describe("SquadScreen", () => {
  it("renders formation slots with correct labels", () => {
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);
    expect(screen.getByText("GK")).toBeDefined();
    expect(screen.getByText("Defenders")).toBeDefined();
    expect(screen.getByText("Midfielders")).toBeDefined();
    expect(screen.getByText("Forwards")).toBeDefined();
  });

  it("shows all roster players in bench initially", () => {
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);
    TEST_PLAYERS.forEach((player) => {
      expect(screen.getByText(new RegExp(player.name))).toBeDefined();
    });
  });

  it("allows selecting a bench player", async () => {
    const user = userEvent.setup();
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);

    const benchPlayer = screen.getByText(/Manuel Neuer/);
    await user.click(benchPlayer);

    const selectedPlayer = benchPlayer.closest("button");
    expect(selectedPlayer?.classList.contains("bench-player--selected")).toBe(true);
  });

  it("allows deselecting a bench player by clicking again", async () => {
    const user = userEvent.setup();
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);

    const benchPlayer = screen.getByText(/Manuel Neuer/);
    await user.click(benchPlayer);
    await user.click(benchPlayer);

    const button = benchPlayer.closest("button");
    expect(button?.classList.contains("bench-player--selected")).toBe(false);
  });

  it("assigns selected player to empty slot", async () => {
    const user = userEvent.setup();
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);

    const neuer = screen.getByText(/Manuel Neuer/);
    await user.click(neuer);

    const gkSlot = screen.getByLabelText("GK: empty");
    await user.click(gkSlot);

    expect(screen.getByText(/Manuel Neuer/)).toBeDefined();
    const gkSlotFilled = screen.getByLabelText("GK: Manuel Neuer");
    expect(gkSlotFilled).toBeDefined();
  });

  it("prevents assigning non-GK to goalkeeper slot", async () => {
    const user = userEvent.setup();
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);

    const kane = screen.getByText(/Harry Kane \(ST\)/);
    await user.click(kane);

    const gkSlot = screen.getByLabelText("GK: empty");
    expect(gkSlot.hasAttribute("disabled")).toBe(true);
  });

  it("unassigns player from slot when clicked", async () => {
    const user = userEvent.setup();
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);

    const neuer = screen.getByText(/Manuel Neuer/);
    await user.click(neuer);

    const gkSlot = screen.getByLabelText("GK: empty");
    await user.click(gkSlot);

    const filledSlot = screen.getByLabelText(/GK: Manuel Neuer/);
    await user.click(filledSlot);

    expect(screen.getByLabelText("GK: empty")).toBeDefined();
  });

  it("disables score button when formation incomplete", () => {
    render(<SquadScreen initialDraftState={TEST_DRAFT_STATE} />);
    const scoreButton = screen.getByRole("button", { name: /Score/ });
    expect(scoreButton.hasAttribute("disabled")).toBe(true);
  });

  it("enables score button when all 11 slots filled", () => {
    const initialState: DraftState = {
      roster: TEST_PLAYERS,
      assignments: {
        GK: 1,
        DEF1: 2,
        DEF2: 12,
        DEF3: 6,
        DEF4: 4,
        MID1: 6,
        MID2: 9,
        MID3: 4,
        FWD1: 3,
        FWD2: 7,
        FWD3: 5,
      },
    };
    render(<SquadScreen initialDraftState={initialState} />);
    const scoreButton = screen.getByRole("button", { name: /Score/ });
    expect(scoreButton.hasAttribute("disabled")).toBe(false);
  });

  it("calls score endpoint and displays result", async () => {
    const user = userEvent.setup();
    const initialState: DraftState = {
      roster: TEST_PLAYERS,
      assignments: {
        GK: 1,
        DEF1: 2,
        DEF2: 12,
        DEF3: 6,
        DEF4: 4,
        MID1: 6,
        MID2: 9,
        MID3: 4,
        FWD1: 3,
        FWD2: 7,
        FWD3: 5,
      },
    };
    render(<SquadScreen initialDraftState={initialState} />);

    const scoreButton = screen.getByRole("button", { name: /Score/ });
    await user.click(scoreButton);

    const totalScore = screen.getByText(/Score:/);
    expect(totalScore).toBeDefined();
  });
});
