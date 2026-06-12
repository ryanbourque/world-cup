import { describe, it, expect } from "vitest";
import { seedPlayers } from "./seed";
import type { Position } from "../../shared/types";

describe("seedPlayers dataset", () => {
  it("has between 40 and 60 players", () => {
    expect(seedPlayers.length).toBeGreaterThanOrEqual(40);
    expect(seedPlayers.length).toBeLessThanOrEqual(60);
  });

  it("has sequential ids starting at 1", () => {
    const ids = seedPlayers.map((p) => p.id);
    ids.forEach((id, i) => {
      expect(id).toBe(i + 1);
    });
  });

  it("has unique ids", () => {
    const ids = seedPlayers.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least 6 goalkeepers", () => {
    const gkCount = seedPlayers.filter((p) => p.position === "GK").length;
    expect(gkCount).toBeGreaterThanOrEqual(6);
  });

  it("has every position represented at least once", () => {
    const allPositions: Position[] = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];
    const presentPositions = new Set(seedPlayers.map((p) => p.position));
    allPositions.forEach((pos) => {
      expect(presentPositions.has(pos)).toBe(true);
    });
  });

  it("no country exceeds 4 players in the seed", () => {
    const countByCountry = new Map<string, number>();
    for (const player of seedPlayers) {
      countByCountry.set(player.country, (countByCountry.get(player.country) ?? 0) + 1);
    }
    countByCountry.forEach((count, country) => {
      expect(count, `${country} exceeds 4 players`).toBeLessThanOrEqual(4);
    });
  });
});
