import type { DrawRequest, DrawResponse, Player } from "../../shared/types";
import { db } from "../db/db";

export function getDraw(req: DrawRequest): DrawResponse {
  const draftedSet = new Set(req.draftedIds);

  // Count countries already in the drafted roster
  const countryCounts = new Map<string, number>();
  if (req.draftedIds.length > 0) {
    const placeholders = req.draftedIds.map(() => "?").join(",");
    const drafted = db
      .prepare(`SELECT country FROM players WHERE id IN (${placeholders})`)
      .all(...req.draftedIds) as Array<{ country: string }>;
    for (const p of drafted) {
      countryCounts.set(p.country, (countryCounts.get(p.country) ?? 0) + 1);
    }
  }

  // Eligible: not already drafted, country not at cap
  const allPlayers = db.prepare("SELECT * FROM players").all() as Player[];
  const eligible = allPlayers.filter(
    (p) => !draftedSet.has(p.id) && (countryCounts.get(p.country) ?? 0) < 4
  );

  // GK guarantee: if drafted roster has no GK and ≤3 picks remain, ensure ≥1 GK in options
  const draftedHasGK =
    req.draftedIds.length > 0 &&
    (() => {
      const placeholders = req.draftedIds.map(() => "?").join(",");
      const result = db
        .prepare(`SELECT id FROM players WHERE id IN (${placeholders}) AND position = 'GK' LIMIT 1`)
        .get(...req.draftedIds);
      return result !== undefined;
    })();

  const needsGKGuarantee = !draftedHasGK && req.picksRemaining <= 3;

  if (needsGKGuarantee) {
    const eligibleGKs = eligible.filter((p) => p.position === "GK");
    const eligibleNonGKs = eligible.filter((p) => p.position !== "GK");

    if (eligibleGKs.length > 0) {
      const shuffledGKs = eligibleGKs.sort(() => Math.random() - 0.5);
      const shuffledNonGKs = eligibleNonGKs.sort(() => Math.random() - 0.5);
      const options = [shuffledGKs[0]!, ...shuffledNonGKs.slice(0, 4)];
      return { options };
    }
  }

  const shuffled = eligible.sort(() => Math.random() - 0.5);
  return { options: shuffled.slice(0, 5) };
}
