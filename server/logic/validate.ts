import type { ValidateRequest, ValidateResponse } from "../../shared/types";
import { db } from "../db/db";

export function validateSquad(req: ValidateRequest): ValidateResponse {
  const errors: string[] = [];

  if (req.rosterIds.length !== 14) {
    errors.push("Roster must have exactly 14 players");
  }

  if (req.starterIds.length !== 11) {
    errors.push("Starting XI must have exactly 11 players");
  }

  const rosterSet = new Set(req.rosterIds);
  const startersNotInRoster = req.starterIds.filter((id) => !rosterSet.has(id));
  if (startersNotInRoster.length > 0) {
    errors.push("Starters must be drawn from the roster");
  }

  if (req.starterIds.length > 0) {
    const placeholders = req.starterIds.map(() => "?").join(",");
    const starters = db
      .prepare(`SELECT position FROM players WHERE id IN (${placeholders})`)
      .all(...req.starterIds) as Array<{ position: string }>;

    const hasGK = starters.some((p) => p.position === "GK");
    if (!hasGK) {
      errors.push("No goalkeeper in starting XI");
    }
  }

  if (req.rosterIds.length > 0) {
    const placeholders = req.rosterIds.map(() => "?").join(",");
    const rosterPlayers = db
      .prepare(`SELECT country FROM players WHERE id IN (${placeholders})`)
      .all(...req.rosterIds) as Array<{ country: string }>;

    const countryCounts = new Map<string, number>();
    for (const p of rosterPlayers) {
      countryCounts.set(p.country, (countryCounts.get(p.country) ?? 0) + 1);
    }
    for (const [country, count] of countryCounts) {
      if (count > 4) {
        errors.push(`Max 4 players per country: ${country}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
