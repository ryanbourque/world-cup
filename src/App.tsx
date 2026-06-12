import { useState } from "react";
import type { DraftState, Player } from "../shared/types";
import { DraftScreen } from "./components/DraftScreen";
import { SquadScreen } from "./components/SquadScreen";

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<"draft" | "squad">("draft");
  const [draftState, setDraftState] = useState<DraftState>({
    roster: [],
    assignments: {},
  });

  const handlePick = (player: Player) => {
    const updatedRoster = [...draftState.roster, player];
    setDraftState({
      ...draftState,
      roster: updatedRoster,
    });

    if (updatedRoster.length === 14) {
      setScreen("squad");
    }
  };

  return (
    <div className="app">
      <h1>Dream Squad Builder</h1>
      {screen === "draft" && <DraftScreen roster={draftState.roster} onPick={handlePick} />}
      {screen === "squad" && <SquadScreen initialDraftState={draftState} />}
    </div>
  );
}

export default App;
