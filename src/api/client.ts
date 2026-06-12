import type {
  DrawRequest,
  DrawResponse,
  ScoreRequest,
  ScoreResponse,
  ValidateRequest,
  ValidateResponse,
  Player,
} from "../../shared/types";

const stubPlayers: Player[] = [
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
    name: "Alisson",
    country: "Brazil",
    position: "GK",
    goals: 0,
    caps: 80,
  },
  {
    id: 3,
    name: "Lionel Messi",
    country: "Argentina",
    position: "RW",
    goals: 81,
    caps: 180,
  },
  {
    id: 4,
    name: "Luka Modrić",
    country: "Croatia",
    position: "CM",
    goals: 31,
    caps: 160,
  },
  {
    id: 5,
    name: "Kylian Mbappé",
    country: "France",
    position: "ST",
    goals: 52,
    caps: 85,
  },
  {
    id: 6,
    name: "Virgil van Dijk",
    country: "Netherlands",
    position: "CB",
    goals: 13,
    caps: 75,
  },
  {
    id: 7,
    name: "Kevin De Bruyne",
    country: "Belgium",
    position: "CAM",
    goals: 33,
    caps: 120,
  },
  {
    id: 8,
    name: "Sergio Busquets",
    country: "Spain",
    position: "CDM",
    goals: 15,
    caps: 143,
  },
];

export function draw(req: DrawRequest): Promise<DrawResponse> {
  const eligible = stubPlayers.filter((p) => !req.draftedIds.includes(p.id));
  const shuffled = eligible.sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 5);
  return Promise.resolve({ options });
}

export function validate(_req: ValidateRequest): Promise<ValidateResponse> {
  return Promise.resolve({ valid: true, errors: [] });
}

export function score(req: ScoreRequest): Promise<ScoreResponse> {
  const players = stubPlayers.filter((p) => req.starterIds.includes(p.id));
  const breakdown = players.map((p) => ({
    playerId: p.id,
    points: p.goals * 2 + p.caps,
  }));
  const total = breakdown.reduce((sum, ps) => sum + ps.points, 0);
  return Promise.resolve({ total, breakdown });
}
