export type Position = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "LW" | "RW" | "ST";

export interface Player {
  id: number;
  name: string;
  country: string;
  position: Position;
  goals: number;
  caps: number;
}

export interface DrawRequest {
  draftedIds: number[];
  picksRemaining: number;
}

export interface DrawResponse {
  options: Player[];
}

export interface ScoreRequest {
  starterIds: number[];
}

export interface PlayerScore {
  playerId: number;
  points: number;
}

export interface ScoreResponse {
  total: number;
  breakdown: PlayerScore[];
}

export interface ValidateRequest {
  rosterIds: number[];
  starterIds: number[];
}

export interface ValidateResponse {
  valid: boolean;
  errors: string[];
}

export const FORMATION_SLOTS = [
  "GK",
  "DEF1",
  "DEF2",
  "DEF3",
  "DEF4",
  "MID1",
  "MID2",
  "MID3",
  "FWD1",
  "FWD2",
  "FWD3",
] as const;

export type FormationSlot = (typeof FORMATION_SLOTS)[number];

export interface DraftState {
  roster: Player[];
  assignments: Partial<Record<FormationSlot, number>>;
}
