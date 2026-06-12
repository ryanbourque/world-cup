import type { FormationSlot, Player } from "../../shared/types";

interface FormationSlotProps {
  slot: FormationSlot;
  player: Player | undefined;
  isSelectable: boolean;
  onAssign: () => void;
  onUnassign: () => void;
}

export function FormationSlotComponent(props: FormationSlotProps): React.JSX.Element {
  const { slot, player, isSelectable, onAssign, onUnassign } = props;

  const handleClick = (): void => {
    if (player) {
      onUnassign();
    } else if (isSelectable) {
      onAssign();
    }
  };

  const slotLabel = slot === "GK" ? "GK" : slot.replace(/(\d+)/, " $1");

  return (
    <button
      onClick={handleClick}
      disabled={!player && !isSelectable}
      className={`slot ${player ? "slot--filled" : ""} ${isSelectable ? "slot--selectable" : ""}`}
      aria-label={`${slot}: ${player ? player.name : "empty"}`}
    >
      {player ? (
        <div className="slot-content">
          <div className="slot-name">{player.name}</div>
          <div className="slot-position">{player.position}</div>
        </div>
      ) : (
        <div className="slot-label">{slotLabel}</div>
      )}
    </button>
  );
}
