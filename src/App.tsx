import type { DraftState, Player } from "../shared/types";
import { SquadScreen } from "./components/SquadScreen";

const DEV_ROSTER: Player[] = [
  {
    id: 1,
    name: "Manuel Neuer",
    country: "Germany",
    position: "GK",
    goals: 1,
    caps: 120,
  },
  {
    id: 2,
    name: "Alisson",
    country: "Brazil",
    position: "GK",
    goals: 0,
    caps: 80,
  },
  {
    id: 3,
    name: "Lionel Messi",
    country: "Argentina",
    position: "RW",
    goals: 81,
    caps: 180,
  },
  {
    id: 4,
    name: "Luka Modrić",
    country: "Croatia",
    position: "CM",
    goals: 31,
    caps: 160,
  },
  {
    id: 5,
    name: "Kylian Mbappé",
    country: "France",
    position: "ST",
    goals: 52,
    caps: 85,
  },
  {
    id: 6,
    name: "Virgil van Dijk",
    country: "Netherlands",
    position: "CB",
    goals: 13,
    caps: 75,
  },
  {
    id: 7,
    name: "Kevin De Bruyne",
    country: "Belgium",
    position: "CAM",
    goals: 33,
    caps: 120,
  },
  {
    id: 8,
    name: "Sergio Busquets",
    country: "Spain",
    position: "CDM",
    goals: 15,
    caps: 143,
  },
  {
    id: 9,
    name: "Harry Kane",
    country: "England",
    position: "ST",
    goals: 60,
    caps: 105,
  },
  {
    id: 10,
    name: "Robert Lewandowski",
    country: "Poland",
    position: "ST",
    goals: 76,
    caps: 145,
  },
  {
    id: 11,
    name: "Cristiano Ronaldo",
    country: "Portugal",
    position: "RW",
    goals: 140,
    caps: 196,
  },
];

const DEV_DRAFT_STATE: DraftState = {
  roster: DEV_ROSTER,
  assignments: {},
};

function App(): React.JSX.Element {
  return (
    <div className="app">
      <h1>Dream Squad Builder</h1>
      <SquadScreen initialDraftState={DEV_DRAFT_STATE} />
    </div>
  );
}

export default App;
