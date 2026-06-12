import type { DraftState, FormationSlot, Player } from "../../shared/types";

export function assignToSlot(state: DraftState, slot: FormationSlot, playerId: number): DraftState {
  const newAssignments = { ...state.assignments };
  const playerInSlot = Object.entries(newAssignments).find(([, id]) => id === playerId);
  if (playerInSlot) {
    const slotKey = playerInSlot[0] as FormationSlot;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete newAssignments[slotKey];
  }
  newAssignments[slot] = playerId;
  return { ...state, assignments: newAssignments };
}

export function unassignSlot(state: DraftState, slot: FormationSlot): DraftState {
  const newAssignments = { ...state.assignments };
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete newAssignments[slot];
  return { ...state, assignments: newAssignments };
}

export function getBenchPlayers(state: DraftState): Player[] {
  const assignedIds = new Set(Object.values(state.assignments));
  return state.roster.filter((p) => !assignedIds.has(p.id));
}

export function getStarterIds(state: DraftState): number[] {
  const FORMATION_SLOTS = [
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
  return FORMATION_SLOTS.map((slot) => state.assignments[slot]).filter(
    (id): id is number => id !== undefined
  );
}

export function isFormationComplete(state: DraftState): boolean {
  const FORMATION_SLOTS = [
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
  return FORMATION_SLOTS.every((slot) => state.assignments[slot] !== undefined);
}
