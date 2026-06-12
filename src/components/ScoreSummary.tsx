import type { Player, ScoreResponse } from "../../shared/types";

interface ScoreSummaryProps {
  roster: Player[];
  result: ScoreResponse;
}

export function ScoreSummary(props: ScoreSummaryProps): React.JSX.Element {
  const { roster, result } = props;

  const playerMap = new Map(roster.map((p) => [p.id, p]));

  return (
    <div className="score-summary">
      <h2>Score: {result.total}</h2>
      <table className="score-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Position</th>
            <th>Goals</th>
            <th>Caps</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {result.breakdown.map((ps) => {
            const player = playerMap.get(ps.playerId);
            if (!player) return null;
            return (
              <tr key={ps.playerId}>
                <td>{player.name}</td>
                <td>{player.position}</td>
                <td>{player.goals}</td>
                <td>{player.caps}</td>
                <td>{ps.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
