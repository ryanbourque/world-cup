import type { ScoreRequest, ScoreResponse, PlayerScore } from "../../shared/types";
import { db } from "../db/db";

export function scoreStarters(req: ScoreRequest): ScoreResponse {
  const placeholders = req.starterIds.map(() => "?").join(",");
  const query = `SELECT id, goals, caps FROM players WHERE id IN (${placeholders})`;
  const players: Array<{ id: number; goals: number; caps: number }> = db
    .prepare(query)
    .all(...req.starterIds) as Array<{ id: number; goals: number; caps: number }>;

  const breakdown: PlayerScore[] = players.map((p) => ({
    playerId: p.id,
    points: p.goals * 2 + p.caps,
  }));

  const total = breakdown.reduce((sum, ps) => sum + ps.points, 0);

  return { total, breakdown };
}
