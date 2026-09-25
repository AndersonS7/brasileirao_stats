# Plan: Data pipeline

> Slug: `data-pipeline`
> Spec: `spec.md` (same folder)
> Status: Approved
> Last updated: 2026-09-24

## Approach

Three Node scripts run with `tsx`: `collect` (network, cached), `transform` (pure + image download), `check` (validation). Requests go through one cached client that counts the daily budget in `scripts/.cache/budget.json`. Output JSON is typed by `src/types/data.ts`, the contract every page spec reads. Home and away standings are derived from fixtures in `src/lib/standings.ts` (no API guess); API standings supply overall rank and zone text.

## Existing code touched

| Path | Change |
|---|---|
| `src/types/data.ts` | add contract types below |
| `src/data/season.json` | replaced by real output |
| `package.json` | scripts `data:collect`, `data:transform`, `data:check`; dev dep `tsx` |

## New files

| Path | Responsibility |
|---|---|
| `scripts/config.ts` | `SEASON`, `LEAGUE_ID = 71`, budget constants |
| `scripts/client.ts` | cached `fetch` wrapper for API-Football; header `x-apisports-key`; budget count; 429/5xx retry |
| `scripts/collect.ts` | endpoint list in priority order; stops at budget |
| `scripts/sportsdb.ts` | TheSportsDB lookups (key `123`, ≥ 2 s between calls) |
| `scripts/team-map.ts` | `{ apiFootballId: number, sportsDbId: string, slug: string }[]` |
| `scripts/transform.ts` | cache → `src/data/*.json`; image download to `public/img/` |
| `scripts/check.ts` | validation and report |
| `src/data/{teams,standings-api,fixtures,team-stats,rankings,squads}.json` | generated output |
| `public/img/{teams,venues,players}/` | generated images |

## Components / functions

| Name | Inputs | Output | Purpose |
|---|---|---|---|
| `apiGet(path, params)` | endpoint, query | JSON | cached, budgeted call |
| `collectAll()` | none | summary | runs endpoint list until done or budget hit |
| `buildTeams(cache, map)` | cached data | `Team[]` | merge both sources |
| `buildStats(cache)` | cached `teams/statistics` | `Record<number, TeamStats>` | reduce to fields the UI uses |
| `checkOutput()` | none | exit code | counts and warnings |

## Data shapes

```ts
export type Season = { season: number; leagueId: number; collectedAt: string }
export type Zone = 'libertadores' | 'sudamericana' | 'relegation' | null
export type Team = {
  id: number; slug: string; name: string; short: string
  founded: number | null; city: string | null
  stadium: string | null; capacity: number | null
  color: string; badge: string; venuePhoto: string | null
  description: string | null
}
export type StandingRow = {
  rank: number; teamId: number; played: number; win: number; draw: number; lose: number
  goalsFor: number; goalsAgainst: number; goalDiff: number; points: number
  form: string; zone: Zone            // form: last 5, e.g. "VVDEV"
}
export type Standings = { all: StandingRow[]; home: StandingRow[]; away: StandingRow[] }
export type Fixture = {
  id: number; round: number; date: string; homeId: number; awayId: number
  homeGoals: number | null; awayGoals: number | null; status: 'finished' | 'scheduled' | 'other'
}
export type Bin = '0-15' | '16-30' | '31-45' | '46-60' | '61-75' | '76-90' | '91-105' | '106-120'
export type TeamStats = {
  teamId: number
  goalsByMinute: Record<Bin, { for: number | null; against: number | null }>
  streak: { wins: number | null; draws: number | null; loses: number | null }
  cleanSheet: { home: number | null; away: number | null }
  formations: { formation: string; played: number }[]
  cards: { yellow: number | null; red: number | null }
}
export type PlayerRow = {
  id: number; name: string; teamId: number; photo: string | null
  goals: number; assists: number; yellow: number; red: number
}
export type Rankings = { scorers: PlayerRow[]; assists: PlayerRow[]; yellow: PlayerRow[]; red: PlayerRow[] }
export type SquadPlayer = { id: number; name: string; position: string | null; number: number | null; age: number | null; photo: string | null }
export type Squads = Record<number, SquadPlayer[]>
```

`standings-api.json`: `StandingRow[]` (overall, from API); `Standings` for site use is built by `src/lib/standings.ts`. Example `StandingRow`: `{ rank: 1, teamId: 121, played: 38, win: 22, draw: 10, lose: 6, goalsFor: 62, goalsAgainst: 31, goalDiff: 31, points: 76, form: "VVEVD", zone: "libertadores" }`.

Zone mapping from API `description`: contains "Libertadores" → `libertadores`; "Sudamericana" → `sudamericana`; "Relegation" → `relegation`; else `null`.

## Routes and state

None.

## Dependencies

| Package | Reason |
|---|---|
| `tsx` (dev) | run TypeScript scripts without a build step |

No zod; `check.ts` validates with plain assertions.

## Loading / error / empty states

Scripts print a summary table (requests used, cached, remaining, warnings). Errors exit non-zero with the endpoint and status.

## Alternatives considered

| Decision | Chosen | Alternative | Why the alternative lost |
|---|---|---|---|
| Home/away standings | derive from fixtures | API `standings` home/away fields | cannot verify field shape (docs blocked); derivation is deterministic |
| Runtime fetch with cache | build-time only | client fetch | exposes key, hits 100/day limit |
| Commit raw responses | no | yes | API terms unverified; derived data is enough |

## Risks

- API-Football field shapes are unverified (docs returned 403). Block 1 makes real calls and records sample payloads in `scripts/.cache`; types adjust after that. Any deviation from this plan's shapes is fixed in `data.ts` and noted in the block report.
- Free plan season limit unknown; block 1 task 1.2 discovers it (try 2024, then 2023, then 2022).
- `players/squads` and card rankings may be unavailable or limited on the free plan → arrays empty, check warns, UI shows empty state.
- TheSportsDB free tier caps some lists at 10 items; venue/badge come from `lookupteam` by id (full record).
- Image and data terms: credits shown in the footer; README repeats them.

## Verification approach

| Criterion | How verified |
|---|---|
| Missing key exits non-zero | run collect with empty `.env`; exit code ≠ 0, message names `API_FOOTBALL_KEY`, no network (no cache files created) |
| Rejected season | run with `SEASON=2026`; API error printed, exit ≠ 0, no `src/data` change |
| Budget and resume | run collect twice; second run's summary shows cached count > 0 and no repeats |
| Counts | `npm run data:check` prints 20 / 380 / 20x3 and exits 0 |
| Warning on missing stats | check output lists any club with null stats, exit 0 |
| Images | `ls public/img/teams` shows 20 files; check lists missing venues |
| Key not in bundle | `npm run build` then `grep -r "$API_FOOTBALL_KEY" dist` returns nothing |
| Works without `.env` | delete `.env`, `npm run dev`, load `/` |
