import type { Player } from "../../shared/types";

interface PlayerCardProps {
  player: Player;
  onPick: (player: Player) => void;
}

export function PlayerCard({ player, onPick }: PlayerCardProps): React.JSX.Element {
  const handleClick = () => {
    onPick(player);
  };

  return (
    <button onClick={handleClick}>
      <div>{player.name}</div>
      <div>{player.country}</div>
      <div>{player.position}</div>
      <div>Goals: {player.goals}</div>
      <div>Caps: {player.caps}</div>
    </button>
  );
}
