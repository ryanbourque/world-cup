import { useState } from "react";
import type { DraftState, Player } from "../shared/types";
import { DraftScreen } from "./components/DraftScreen";

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
    <div>
      <h1>Dream Squad Builder</h1>
      {screen === "draft" && <DraftScreen roster={draftState.roster} onPick={handlePick} />}
      {screen === "squad" && <div>Squad screen coming soon</div>}
    </div>
  );
}

export default App;
