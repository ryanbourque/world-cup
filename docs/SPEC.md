# Dream Squad Builder — Build Spec

> Spec-first AI coding workshop. 8 participants → 4 teams of 2. Target: 1 hour.
> This document **is** the prompt source. Each team feeds its assigned section to the AI rather than free-prompting.

---

## 1. Product Summary

A single-player draft game. The user drafts a 14-player squad from a pool of World Cup–era players (2010–present), choosing 1 of 5 revealed players per round. They assign 11 of the 14 as starters into a formation, and the app scores the starting XI from player stats.

**Game loop:**
`Draw (5 options) → Pick 1 → repeat ×14 → Assign 11 starters → Score → Summary`

---

## 2. Defined Rules (locked)

| Rule                | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Player era          | 2010 → present                                        |
| Roster size         | 14                                                    |
| Starters            | 11                                                    |
| Draft reveal        | 5 players per draw                                    |
| Pick per draw       | 1 of 5                                                |
| Draft order         | User-controlled (user clicks to draw)                 |
| Pick finality       | Final — no drop/re-draft                              |
| Position assignment | User assigns starters to slots manually               |
| Mandatory           | ≥1 goalkeeper in starting XI                          |
| Country cap         | Max 4 players per country (across full 14-man roster) |
| Displayed stats     | `goals`, `caps`                                       |
| Scoring inputs      | `goals`, `caps`                                       |
| Scoring formula     | `playerPoints = goals×2 + caps`                       |
| Squad score         | Σ playerPoints over the **11 starters**               |

### Inferred decisions (flag for next pass — override if wrong)

1. **Score counts starting XI only**, not bench. Makes starter selection meaningful. _(Alt: score all 14.)_
2. **Single fixed formation: 4-3-3** (1 GK, 4 DEF, 3 MID, 3 FWD). Slots are positional buckets, not exact roles.
3. **Slot assignment is permissive** for outfield (any non-GK fills any outfield slot); the **GK slot requires a GK-position player**. _(Alt: enforce strict position→slot matching.)_
4. **Country cap enforced at draw time** — players from maxed-out countries are excluded from future draws.
5. **GK guarantee:** if the user has drafted no GK and ≤3 picks remain, every draw forces ≥1 GK into the 5 options.

---

## 3. Architecture

Stateless server + client-held draft state. Server = data + draw logic + scoring. Client = session state + UI. This minimizes cross-team dependencies: everything is built against a locked contract, mocked, then swapped to real in integration.

```
dream-squad-builder/
├── shared/            # contract: types shared by client + server
│   └── types.ts
├── server/            # Node + Express + better-sqlite3
│   ├── db/
│   │   ├── schema.sql
│   │   ├── seed.ts
│   │   └── db.ts
│   ├── logic/
│   │   ├── draw.ts
│   │   └── score.ts
│   ├── routes/
│   │   └── api.ts
│   └── index.ts
└── client/            # React (Vite + TS)
    ├── src/
    │   ├── api/client.ts      # swappable mock → real
    │   ├── state/draft.ts
    │   ├── components/
    │   └── App.tsx
```

**Stack:** React + Vite (TS), Express, `better-sqlite3` (synchronous, zero-config). TypeScript is non-negotiable here — the shared types are the parallelization backbone.

---

## 4. Data Model

### `players` table

```sql
CREATE TABLE players (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL,
  country   TEXT    NOT NULL,
  position  TEXT    NOT NULL,  -- GK|CB|LB|RB|CDM|CM|CAM|LW|RW|ST
  goals     INTEGER NOT NULL,
  caps      INTEGER NOT NULL
);
```

Positions pool: `GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST`.

**Seed target:** 40–60 players, spread across countries and positions, with enough GKs (≥6) and country spread to keep draws solvable under the country cap. Stats are illustrative for the game — verify before relying on them as fact.

Example rows (illustrative only):

```
name              country     position  goals  caps
Lionel Messi      Argentina   RW        --     --
Manuel Neuer      Germany     GK        --     --
Luka Modrić       Croatia     CM        --     --
```

---

## 5. Shared Contract (`shared/types.ts`)

This is locked in Phase 0. Everything else builds against it.

```ts
export type Position = "GK" | "CB" | "LB" | "RB" | "CDM" | "CM" | "CAM" | "LW" | "RW" | "ST";

export interface Player {
  id: number;
  name: string;
  country: string;
  position: Position;
  goals: number;
  caps: number;
}

// ---- Draw ----
export interface DrawRequest {
  draftedIds: number[]; // already on roster
  picksRemaining: number; // 14 - draftedIds.length
}
export interface DrawResponse {
  options: Player[]; // exactly 5
}

// ---- Score ----
export interface ScoreRequest {
  starterIds: number[]; // exactly 11
}
export interface PlayerScore {
  playerId: number;
  points: number; // goals*2 + caps
}
export interface ScoreResponse {
  total: number;
  breakdown: PlayerScore[];
}

// ---- Validate ----
export interface ValidateRequest {
  rosterIds: number[]; // 14
  starterIds: number[]; // 11
}
export interface ValidateResponse {
  valid: boolean;
  errors: string[]; // e.g. "No goalkeeper in starting XI"
}

// ---- Client draft state (flows draft screen → squad screen) ----
export const FORMATION_SLOTS = [
  "GK",
  "DEF1",
  "DEF2",
  "DEF3",
  "DEF4",
  "MID1",
  "MID2",
  "MID3",
  "FWD1",
  "FWD2",
  "FWD3",
] as const;
export type FormationSlot = (typeof FORMATION_SLOTS)[number];

export interface DraftState {
  roster: Player[]; // up to 14
  assignments: Partial<Record<FormationSlot, number>>; // slot → playerId
}
```

---

## 6. API Contract

| Method | Path                  | Body              | Returns            |
| ------ | --------------------- | ----------------- | ------------------ |
| GET    | `/api/health`         | —                 | `{ ok: true }`     |
| POST   | `/api/draft/draw`     | `DrawRequest`     | `DrawResponse`     |
| POST   | `/api/squad/validate` | `ValidateRequest` | `ValidateResponse` |
| POST   | `/api/squad/score`    | `ScoreRequest`    | `ScoreResponse`    |

### Server logic rules

**`/api/draft/draw`**

1. Eligible pool = all players where `id ∉ draftedIds`.
2. Exclude players whose country already appears 4× in the drafted roster.
3. If roster has no GK **and** `picksRemaining ≤ 3`: guarantee ≥1 GK in the 5 options.
4. Return 5 random eligible players (or fewer only if pool is exhausted — shouldn't happen with a 40+ seed).

**`/api/squad/score`**

- `points(p) = p.goals*2 + p.caps`; `total = Σ points`.

**`/api/squad/validate`** — returns errors for any of:

- roster ≠ 14, starters ≠ 11
- starters ⊄ roster
- no GK-position player in the GK slot
- any country > 4 in roster

---

## 7. Workstreams (Phase 1 — parallel)

All four build against the Phase 0 contract using mocks, then swap to real in Phase 2.

### Stream A — Data & Seed

- Implement `schema.sql`, `db.ts` (better-sqlite3 connection), `seed.ts`.
- Seed 40–60 players (≥6 GK, broad country spread).
- **Produces:** real data that replaces the foundation's stub seed.
- **Depends on:** schema (locked in Phase 0).

### Stream B — Backend Logic

- Implement `draw.ts` (eligibility, country cap, GK guarantee, random 5), `score.ts`, and validation.
- Wire into `routes/api.ts`.
- **Develops against:** stub seed from Phase 0; swaps to Stream A data at merge.
- **Depends on:** shared types.

### Stream C — Draft UI

- Draft screen: **Draw** button → renders 5 player cards → click to pick → updates roster sidebar + "picks remaining" counter.
- Card shows: name, country, position, goals, caps.
- Disables Draw at 14; transitions to squad screen.
- **Depends on:** `DrawRequest`/`DrawResponse` contract; uses mock client until Phase 2.

### Stream D — Squad & Summary UI

- Formation board (4-3-3 slots) — assign roster players to the 11 slots + bench (3).
- Score button → calls score endpoint → renders total + per-player breakdown.
- Summary view: final XI on the formation + total score (both, per spec).
- **Depends on:** `DraftState`, `ScoreRequest`/`ScoreResponse`; uses mock score until Phase 2.

---

## 8. Dependency & Merge Map

```
Phase 0 (Foundation, blocking)
  └─ locks: shared/types.ts, schema.sql, API stubs (mock data), stub seed, run scripts
        │
        ├──► Stream A (Data)      ─┐
        ├──► Stream B (Logic)      ├─ build in parallel against contract + mocks
        ├──► Stream C (Draft UI)   │
        └──► Stream D (Squad UI)  ─┘
                                    │
Phase 2 (Integration)
  ├─ MERGE A → B    (blocking: B needs real data for meaningful draws)
  ├─ swap C, D mock client → real endpoints  (non-blocking)
  └─ E2E: draft 14 → assign 11 → score → summary
```

**Blocking edges:** only A→B. Everything else is contract-isolated.
**Handoff edge:** C→D pass `DraftState` (shape locked in Phase 0).

---

## 9. Timeline (60 min)

| Time      | Phase               | Activity                                                                                                                     |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:10 | **0 — Foundation**  | One pair scaffolds repo, commits `shared/types.ts`, `schema.sql`, mock API stubs, stub seed (~8 players), run scripts. Push. |
| 0:10–0:45 | **1 — Parallel**    | 4 streams build against contract + mocks (35 min).                                                                           |
| 0:45–0:55 | **2 — Integration** | Merge A→B, swap C/D to real endpoints, E2E.                                                                                  |
| 0:55–1:00 | **Demo**            | Each team drafts live; reveal scores.                                                                                        |

> If Phase 0 is shared setup friction, do it as a pre-workshop step or screen-share so the full hour goes to streams + integration.

---

## 10. Spec-First Mechanic (the teaching point)

Each team prompts the AI with **its section of this spec verbatim** as the requirement, not a freehand description. The lesson: a tight, shared spec lets four AI-assisted streams converge without integration chaos, because the contract (§5, §6) is the single source of truth every prompt references.

Reinforce by contrast: ask one team to prompt _without_ the contract and watch the integration diverge.
