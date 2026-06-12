import type { DrawRequest, DrawResponse, Player } from "../../shared/types";
import { db } from "../db/db";

export function getDraw(req: DrawRequest): DrawResponse {
  let query = "SELECT * FROM players";
  if (req.draftedIds.length > 0) {
    query += ` WHERE id NOT IN (${req.draftedIds.join(",")})`;
  }

  const allPlayers: Player[] = db.prepare(query).all() as Player[];

  const shuffled = allPlayers.sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 5);

  return { options };
}
