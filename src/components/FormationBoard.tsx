import type { DraftState, FormationSlot } from "../../shared/types";
import { FormationSlotComponent } from "./FormationSlot";
import { getBenchPlayers } from "../state/draft";

interface FormationBoardProps {
  draftState: DraftState;
  selectedPlayerId: number | null;
  onSlotClick: (slot: FormationSlot, playerId: number | null) => void;
  onBenchPlayerClick: (playerId: number) => void;
}

export function FormationBoard(props: FormationBoardProps): React.JSX.Element {
  const { draftState, selectedPlayerId, onSlotClick, onBenchPlayerClick } = props;

  const selectedPlayer = draftState.roster.find((p) => p.id === selectedPlayerId);

  const isSlotSelectable = (slot: FormationSlot): boolean => {
    if (!selectedPlayer) return false;
    if (slot === "GK") return selectedPlayer.position === "GK";
    return true;
  };

  const benchPlayers = getBenchPlayers(draftState);

  const formationRows = [
    { label: "Forwards", slots: ["FWD1", "FWD2", "FWD3"] as FormationSlot[] },
    { label: "Midfielders", slots: ["MID1", "MID2", "MID3"] as FormationSlot[] },
    {
      label: "Defenders",
      slots: ["DEF1", "DEF2", "DEF3", "DEF4"] as FormationSlot[],
    },
    { label: "Goalkeeper", slots: ["GK"] as FormationSlot[] },
  ];

  return (
    <div className="formation-board">
      {formationRows.map((row) => (
        <div key={row.label} className="formation-row">
          <h3 className="formation-label">{row.label}</h3>
          <div className="slot-container">
            {row.slots.map((slot) => (
              <FormationSlotComponent
                key={slot}
                slot={slot}
                player={
                  draftState.assignments[slot]
                    ? draftState.roster.find((p) => p.id === draftState.assignments[slot])
                    : undefined
                }
                isSelectable={isSlotSelectable(slot)}
                onAssign={() => {
                  if (selectedPlayer) {
                    onSlotClick(slot, selectedPlayer.id);
                  }
                }}
                onUnassign={() => {
                  onSlotClick(slot, null);
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="bench">
        <h3>Bench</h3>
        <div className="bench-players">
          {benchPlayers.map((player) => (
            <button
              key={player.id}
              onClick={(): void => {
                onBenchPlayerClick(player.id);
              }}
              className={`bench-player ${
                selectedPlayerId === player.id ? "bench-player--selected" : ""
              }`}
            >
              {player.name} ({player.position})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
