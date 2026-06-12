import type { Player } from "../../shared/types";

interface RosterSidebarProps {
  roster: Player[];
  picksRemaining: number;
}

export function RosterSidebar({ roster, picksRemaining }: RosterSidebarProps): React.JSX.Element {
  return (
    <aside>
      <h2>Picks remaining: {picksRemaining}</h2>
      <ol>
        {roster.map((player) => (
          <li key={player.id}>
            {player.name} ({player.position})
          </li>
        ))}
      </ol>
    </aside>
  );
}
