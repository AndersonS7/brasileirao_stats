# Plan: League overview

> Slug: `league-overview`
> Spec: `spec.md` (same folder)
> Status: Approved
> Last updated: 2026-09-24

## Approach

Pure selectors in `src/lib` compute standings variants, highlights, and per-round goals from imported JSON. Feature components in `src/features/league` render them; the table and form badge live in `src/components/ui` for reuse by club pages. Search runs client-side over `teams.json` and mounts inside the existing `SearchField`. Chart uses Recharts.

## Existing code touched

| Path | Change |
|---|---|
| `src/components/ui/SearchField.tsx` | add results popover, keyboard handling |
| `src/app/App.tsx` | replace `/` stub with `LeaguePage` |
| `src/lib/standings.ts` | (from `data-pipeline`) reused for filters |

## New files

| Path | Responsibility |
|---|---|
| `src/features/league/LeaguePage.tsx` | page composition |
| `src/features/league/StandingsTable.tsx` | table with filter, zones, legend, row navigation |
| `src/features/league/Highlights.tsx` | five stat tiles |
| `src/features/league/GoalsPerRound.tsx` | Recharts bar chart |
| `src/lib/highlights.ts` | best attack/defence, average goals, goals per round |
| `src/lib/search.ts` | normalise + match teams |
| `src/components/ui/FormBadges.tsx` | V/E/D badges with accessible label |
| `src/components/ui/StatTile.tsx` | label, value, meta |
| `src/components/ui/Crest.tsx` | badge image, size prop, alt rule |
| `src/components/ui/Skeleton.tsx` | shimmer block |
| `src/components/ui/SegmentedControl.tsx` | pill filter |

## Components / functions

| Name | Inputs | Output | Purpose |
|---|---|---|---|
| `StandingsTable` | none (imports data) | table | filter state local |
| `SegmentedControl` | `options`, `value`, `onChange`, `label` | buttons with `aria-pressed` | Geral/Casa/Fora |
| `Crest` | `team`, `size`, `labelled?` | `<img>` | `alt=""` unless `labelled` |
| `FormBadges` | `form: string` | badges | last 5 |
| `computeStandings(fixtures, teams)` | data | `Standings` | from `data-pipeline` |
| `getHighlights(standings, rankings, fixtures)` | data | `{scorer, assister, attack, defence, avgGoals}` | tiles |
| `goalsPerRound(fixtures)` | fixtures | `{round:number,goals:number\|null}[]` | chart data |
| `searchTeams(teams, query)` | list, string | `Team[]` (max 6) | accent-insensitive match on name and stadium |

## Data shapes

```ts
type Highlights = {
  scorer: { name: string; teamId: number; goals: number } | null
  assister: { name: string; teamId: number; assists: number } | null
  attack: { teamId: number; goals: number }
  defence: { teamId: number; goals: number }
  avgGoals: number
}
```

## Routes and state

Route `/`. Filter is local `useState` (`'all' | 'home' | 'away'`). Search query is local state in `SearchField`; result selection navigates to `/clubes/:slug`.

## Dependencies

| Package | Reason |
|---|---|
| `recharts` | bar chart with accessible tooltip; hand-rolled SVG would need axes, tooltips, keyboard focus |

## Loading / error / empty states

Loading: `Skeleton` table (20 rows) via route Suspense. Empty tiles: "Dados indisponíveis". Search: no results → "Nenhum clube encontrado". No error state (static data).

## Alternatives considered

| Decision | Chosen | Alternative | Why the alternative lost |
|---|---|---|---|
| Search library | own 15-line matcher | Fuse.js | 20 clubs; dependency not justified |
| Filter state | local state | URL param | not needed for sharing in v1 |

## Risks

- Recharts bar focus/keyboard accessibility is limited; mitigated by a visually hidden data table under the chart.
- Tie-break mismatch between API rank and derived rank; check script logs mismatches in `data-pipeline`.

## Verification approach

| Criterion | How verified |
|---|---|
| 20 rows, rank 1 first | Playwright: row count and first cell text |
| Filters re-rank; counts | Playwright: for Casa, each row's played equals home finished fixtures from `fixtures.json` (Node check in test script) |
| Zone bar and legend | Playwright: `tr` with zone class and legend text present |
| Row click navigates | Playwright: click row, URL matches `/clubes/` |
| Highlights consistency | test script compares tile with max goalsFor |
| Chart bars | Playwright: bar count equals distinct rounds; hover shows tooltip |
| `/` focuses search | Playwright key press |
| Search cases | Playwright: type "sao", "zzz" |
| 390px columns | Playwright: visible header cells = 5, `scrollWidth <= innerWidth` |
| Keyboard results | Playwright: ArrowDown, Enter, Escape |
