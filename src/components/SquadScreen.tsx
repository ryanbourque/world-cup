import { useState } from "react";
import type { DraftState, FormationSlot, ScoreResponse } from "../../shared/types";
import { FormationBoard } from "./FormationBoard";
import { ScoreSummary } from "./ScoreSummary";
import { assignToSlot, unassignSlot, isFormationComplete } from "../state/draft";
import { getStarterIds } from "../state/draft";
import { score, validate } from "../api/client";

interface SquadScreenProps {
  initialDraftState: DraftState;
}

export function SquadScreen(props: SquadScreenProps): React.JSX.Element {
  const { initialDraftState } = props;
  const [draftState, setDraftState] = useState<DraftState>(initialDraftState);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResponse | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSlotClick = (slot: FormationSlot, playerId: number | null): void => {
    if (playerId === null) {
      setDraftState(unassignSlot(draftState, slot));
    } else {
      setDraftState(assignToSlot(draftState, slot, playerId));
      setSelectedPlayerId(null);
    }
    setValidationErrors([]);
    setScoreResult(null);
  };

  const handleBenchPlayerClick = (playerId: number): void => {
    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
    } else {
      setSelectedPlayerId(playerId);
    }
  };

  const handleScore = async (): Promise<void> => {
    setIsScoring(true);
    setValidationErrors([]);
    try {
      const rosterIds = draftState.roster.map((p) => p.id);
      const starterIds = getStarterIds(draftState);

      const validation = await validate({ rosterIds, starterIds });
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        return;
      }

      const result = await score({ starterIds });
      setScoreResult(result);
    } finally {
      setIsScoring(false);
    }
  };

  const formationComplete = isFormationComplete(draftState);

  return (
    <div className="squad-screen">
      <FormationBoard
        draftState={draftState}
        selectedPlayerId={selectedPlayerId}
        onSlotClick={handleSlotClick}
        onBenchPlayerClick={handleBenchPlayerClick}
      />

      <div className="score-controls">
        <button
          onClick={(): void => {
            void handleScore();
          }}
          disabled={!formationComplete || isScoring}
          className="score-button"
        >
          {isScoring ? "Scoring..." : "Score"}
        </button>

        {validationErrors.length > 0 && (
          <ul className="validation-errors">
            {validationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      {scoreResult && <ScoreSummary roster={draftState.roster} result={scoreResult} />}
    </div>
  );
}
