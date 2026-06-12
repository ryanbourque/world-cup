import { useState } from "react";
import type { Player } from "../../shared/types";
import { draw } from "../api/client";
import { PlayerCard } from "./PlayerCard";
import { RosterSidebar } from "./RosterSidebar";

interface DraftScreenProps {
  roster: Player[];
  onPick: (player: Player) => void;
}

export function DraftScreen({ roster, onPick }: DraftScreenProps): React.JSX.Element {
  const [options, setOptions] = useState<Player[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const picksRemaining = 14 - roster.length;

  const handleDrawClick = () => {
    setIsDrawing(true);
    void draw({
      draftedIds: roster.map((p) => p.id),
      picksRemaining,
    })
      .then((response) => {
        setOptions(response.options);
      })
      .finally(() => {
        setIsDrawing(false);
      });
  };

  const handlePick = (player: Player) => {
    onPick(player);
    setOptions(null);
  };

  const drawButtonDisabled = isDrawing || options !== null || picksRemaining === 0;

  return (
    <main>
      <div>
        <button onClick={handleDrawClick} disabled={drawButtonDisabled}>
          Draw
        </button>
      </div>

      {options && (
        <div>
          {options.map((player) => (
            <PlayerCard key={player.id} player={player} onPick={handlePick} />
          ))}
        </div>
      )}

      <RosterSidebar roster={roster} picksRemaining={picksRemaining} />
    </main>
  );
}
