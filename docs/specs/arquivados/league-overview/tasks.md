# Tasks: League overview

> Slug: `league-overview`
> Spec: `spec.md` (same folder)
> Plan: `plan.md` (same folder)
> Status: Complete
> Last updated: 2026-09-24

## Progress

| Block | Name | Status |
|---|---|---|
| 1 | Standings table | Complete |
| 2 | Highlights, chart, search | Complete |

## Block 1 — Standings table

**Delivers:** `/` shows the working table with filters and zones at 1440px and 390px.
**Depends on:** `app-foundation` Block 2, `data-pipeline` Block 2.

### 1.1 Shared UI primitives
- **File:** `src/components/ui/Crest.tsx`, `FormBadges.tsx`, `SegmentedControl.tsx`, `Skeleton.tsx`
- **Action:** implement per design system; `Crest` builds URL via `img()`.
- **Verify:** `npx tsc --noEmit` exits 0.

### 1.2 Standings table
- **File:** `src/features/league/StandingsTable.tsx`
- **Action:** rows from `computeStandings`; filter; zone bar + legend; row navigates; responsive columns (<600px: 5 columns); tabular numerals.
- **Verify:** Playwright: 20 rows; Casa/Fora re-rank; click row changes URL.

### 1.3 League page
- **File:** `src/features/league/LeaguePage.tsx`, `src/app/App.tsx`
- **Action:** compose page title, table, legend; wire route; Suspense skeleton.
- **Verify:** screenshots 1440px and 390px; no horizontal scroll; console clean.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0; screenshots saved to `docs/screenshots/league-table-*.png`.

---

## Block 2 — Highlights, chart, search

**Delivers:** complete home page and working search.
**Depends on:** Block 1

### 2.1 Selectors
- **File:** `src/lib/highlights.ts`, `src/lib/search.ts`
- **Action:** `getHighlights`, `goalsPerRound`, `searchTeams` (accent-insensitive, name + stadium, max 6).
- **Verify:** Node script asserts: best attack equals max goalsFor; `searchTeams(teams,'sao')` includes "São Paulo".

### 2.2 Highlight tiles
- **File:** `src/components/ui/StatTile.tsx`, `src/features/league/Highlights.tsx`
- **Action:** five tiles; null data → "Dados indisponíveis".
- **Verify:** Playwright: 5 tiles visible; values match `getHighlights`.

### 2.3 Goals chart
- **File:** `src/features/league/GoalsPerRound.tsx`
- **Action:** Recharts bars in `green-700`, thin axes; unplayed rounds "sem jogos"; hidden data table for screen readers; no animation under reduced motion.
- **Verify:** Playwright: bar count equals rounds; tooltip on hover.

### 2.4 Search results
- **File:** `src/components/ui/SearchField.tsx`
- **Action:** results list with crest + name; arrows/Enter/Escape; empty state; `/` shortcut already present.
- **Verify:** Playwright: "sao" shows São Paulo; "zzz" shows empty text; Enter navigates.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0; screenshots at 1440px and 390px saved to `docs/screenshots/league-*.png`; console clean.

## Criteria coverage

| Spec criterion | Tasks |
|---|---|
| 20 rows, rank 1 | 1.2 |
| Filters re-rank, counts | 1.2 |
| Zone bar and legend | 1.2 |
| Row click | 1.2 |
| Best attack equals max | 2.1, 2.2 |
| Chart bars and tooltip | 2.3 |
| `/` focuses search | `app-foundation` 2.2, 2.4 |
| Search cases | 2.1, 2.4 |
| 390px five columns | 1.2, 1.3 |
| Keyboard results | 2.4 |

## Deferred

- None.
