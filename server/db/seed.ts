import type { Player } from "../../shared/types";

// 52 players, 14 countries, max 4 per country, 8 GKs, all positions covered.
// Stats are illustrative for game scoring — not authoritative facts.
export const seedPlayers: Player[] = [
  // ── Germany (4) ──────────────────────────────────────────────────────────
  { id: 1, name: "Manuel Neuer", country: "Germany", position: "GK", goals: 1, caps: 124 },
  { id: 2, name: "Mats Hummels", country: "Germany", position: "CB", goals: 6, caps: 76 },
  { id: 3, name: "Philipp Lahm", country: "Germany", position: "LB", goals: 5, caps: 113 },
  { id: 4, name: "Toni Kroos", country: "Germany", position: "CM", goals: 17, caps: 106 },

  // ── Brazil (4) ───────────────────────────────────────────────────────────
  { id: 5, name: "Alisson Becker", country: "Brazil", position: "GK", goals: 1, caps: 82 },
  { id: 6, name: "Thiago Silva", country: "Brazil", position: "CB", goals: 7, caps: 112 },
  { id: 7, name: "Marcelo", country: "Brazil", position: "LB", goals: 6, caps: 80 },
  { id: 8, name: "Neymar Jr", country: "Brazil", position: "LW", goals: 79, caps: 128 },

  // ── France (4) ───────────────────────────────────────────────────────────
  { id: 9, name: "Hugo Lloris", country: "France", position: "GK", goals: 0, caps: 145 },
  { id: 10, name: "Raphaël Varane", country: "France", position: "CB", goals: 11, caps: 93 },
  { id: 11, name: "Kylian Mbappé", country: "France", position: "LW", goals: 52, caps: 89 },
  { id: 12, name: "Paul Pogba", country: "France", position: "CM", goals: 11, caps: 91 },

  // ── Argentina (4) ────────────────────────────────────────────────────────
  { id: 13, name: "Lionel Messi", country: "Argentina", position: "RW", goals: 109, caps: 191 },
  { id: 14, name: "Ángel Di María", country: "Argentina", position: "CAM", goals: 32, caps: 145 },
  { id: 15, name: "Gonzalo Higuaín", country: "Argentina", position: "ST", goals: 31, caps: 75 },
  { id: 16, name: "Nahuel Molina", country: "Argentina", position: "RB", goals: 10, caps: 50 },

  // ── Portugal (4) ─────────────────────────────────────────────────────────
  { id: 17, name: "Cristiano Ronaldo", country: "Portugal", position: "RW", goals: 130, caps: 220 },
  { id: 18, name: "Pepe", country: "Portugal", position: "CB", goals: 7, caps: 141 },
  { id: 19, name: "Bernardo Silva", country: "Portugal", position: "CM", goals: 10, caps: 88 },
  { id: 20, name: "João Cancelo", country: "Portugal", position: "RB", goals: 3, caps: 60 },

  // ── Spain (4) ────────────────────────────────────────────────────────────
  { id: 21, name: "Iker Casillas", country: "Spain", position: "GK", goals: 0, caps: 167 },
  { id: 22, name: "Sergio Busquets", country: "Spain", position: "CDM", goals: 15, caps: 143 },
  { id: 23, name: "David Silva", country: "Spain", position: "CAM", goals: 35, caps: 125 },
  { id: 24, name: "David Villa", country: "Spain", position: "ST", goals: 59, caps: 98 },

  // ── England (4) ──────────────────────────────────────────────────────────
  { id: 25, name: "Jordan Pickford", country: "England", position: "GK", goals: 0, caps: 72 },
  { id: 26, name: "John Stones", country: "England", position: "CB", goals: 4, caps: 78 },
  { id: 27, name: "Declan Rice", country: "England", position: "CDM", goals: 8, caps: 58 },
  { id: 28, name: "Harry Kane", country: "England", position: "ST", goals: 68, caps: 98 },

  // ── Netherlands (4) ──────────────────────────────────────────────────────
  { id: 29, name: "Virgil van Dijk", country: "Netherlands", position: "CB", goals: 13, caps: 79 },
  { id: 30, name: "Denzel Dumfries", country: "Netherlands", position: "RB", goals: 9, caps: 60 },
  { id: 31, name: "Memphis Depay", country: "Netherlands", position: "CAM", goals: 45, caps: 95 },
  {
    id: 32,
    name: "Robin van Persie",
    country: "Netherlands",
    position: "ST",
    goals: 50,
    caps: 102,
  },

  // ── Croatia (4) ──────────────────────────────────────────────────────────
  { id: 33, name: "Luka Modrić", country: "Croatia", position: "CM", goals: 31, caps: 174 },
  { id: 34, name: "Marcelo Brozović", country: "Croatia", position: "CDM", goals: 11, caps: 107 },
  { id: 35, name: "Ivan Perišić", country: "Croatia", position: "RW", goals: 33, caps: 137 },
  { id: 36, name: "Dejan Lovren", country: "Croatia", position: "CB", goals: 9, caps: 72 },

  // ── Belgium (4) ──────────────────────────────────────────────────────────
  { id: 37, name: "Kevin De Bruyne", country: "Belgium", position: "CM", goals: 33, caps: 121 },
  { id: 38, name: "Eden Hazard", country: "Belgium", position: "CAM", goals: 33, caps: 126 },
  { id: 39, name: "Dries Mertens", country: "Belgium", position: "RW", goals: 21, caps: 109 },
  { id: 40, name: "Romelu Lukaku", country: "Belgium", position: "ST", goals: 68, caps: 111 },

  // ── Italy (3) ────────────────────────────────────────────────────────────
  { id: 41, name: "Gianluigi Buffon", country: "Italy", position: "GK", goals: 0, caps: 176 },
  { id: 42, name: "Andrea Pirlo", country: "Italy", position: "CM", goals: 13, caps: 116 },
  { id: 43, name: "Alessandro Del Piero", country: "Italy", position: "ST", goals: 27, caps: 91 },

  // ── Senegal (3) ──────────────────────────────────────────────────────────
  { id: 44, name: "Édouard Mendy", country: "Senegal", position: "GK", goals: 0, caps: 35 },
  { id: 45, name: "Sadio Mané", country: "Senegal", position: "LW", goals: 35, caps: 94 },
  { id: 46, name: "Kalidou Koulibaly", country: "Senegal", position: "CB", goals: 4, caps: 62 },

  // ── Uruguay (3) ──────────────────────────────────────────────────────────
  { id: 47, name: "Fernando Muslera", country: "Uruguay", position: "GK", goals: 0, caps: 130 },
  { id: 48, name: "Diego Godín", country: "Uruguay", position: "CB", goals: 18, caps: 159 },
  { id: 49, name: "Luis Suárez", country: "Uruguay", position: "ST", goals: 68, caps: 133 },

  // ── Morocco (3) ──────────────────────────────────────────────────────────
  { id: 50, name: "Achraf Hakimi", country: "Morocco", position: "RB", goals: 10, caps: 71 },
  { id: 51, name: "Hakim Ziyech", country: "Morocco", position: "CAM", goals: 17, caps: 61 },
  { id: 52, name: "Youssef En-Nesyri", country: "Morocco", position: "ST", goals: 25, caps: 62 },
];
