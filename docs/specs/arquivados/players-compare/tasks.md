# Tasks: Players and comparator

> Slug: `players-compare`
> Spec: `spec.md` (same folder)
> Plan: `plan.md` (same folder)
> Status: Complete
> Last updated: 2026-09-24

## Progress

| Block | Name | Status |
|---|---|---|
| 1 | Rankings | Complete |
| 2 | Comparator | Complete |

## Block 1 — Rankings

**Delivers:** `/jogadores` with four tabs and club filter.
**Depends on:** `clubs-fixtures` Block 1.

### 1.1 Ranking list
- **File:** `src/features/players/RankingList.tsx`
- **Action:** rows with rank, photo/initials, name, club crest+name, value; ellipsis on long names.
- **Verify:** `npx tsc --noEmit` exits 0.

### 1.2 Players page
- **File:** `src/features/players/PlayersPage.tsx`, `src/app/App.tsx`
- **Action:** `Tabs` (`?aba=`), club `<select>` (`?clube=`), empty state per tab.
- **Verify:** Playwright: tab switch changes list; filter limits rows to one club; sorted descending.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0; screenshots 1440px and 390px in `docs/screenshots/players-*.png`.

---

## Block 2 — Comparator

**Delivers:** `/comparar` with bars, head-to-head, shareable URL.
**Depends on:** Block 1.

### 2.1 Comparison selectors
- **File:** `src/lib/compare.ts`
- **Action:** `buildComparison`, `headToHead`, `seriesColors` (fallback when color distance < 60).
- **Verify:** Node script: goals-conceded lead correct; no club pair leaves both series within distance 60.

### 2.2 Pickers and page
- **File:** `src/features/compare/TeamPicker.tsx`, `ComparePage.tsx`, `src/app/App.tsx`
- **Action:** two labelled selects excluding each other; URL `?a=&b=`; prompt when fewer than two chosen; invalid slug ignored.
- **Verify:** Playwright: choose two clubs, URL updated; reload restores.

### 2.3 Comparison rows and animation
- **File:** `src/features/compare/ComparisonRows.tsx`, `src/lib/useInView.ts`
- **Action:** header with crests and names, six rows with center-out bars, values visible, leader full color and other faded; grow once when in view; "Repetir animação" button; reduced motion → final width.
- **Verify:** Playwright: six rows; reduced-motion emulation shows final widths and transition 0.

### 2.4 Head-to-head
- **File:** `src/features/compare/HeadToHead.tsx`
- **Action:** matches between the pair with scores via `MatchRow`; none → "Não se enfrentaram nesta temporada".
- **Verify:** Playwright: count equals fixtures between the pair.

**Block verification:** build, tsc, lint exit 0; screenshots 1440px and 390px in `docs/screenshots/compare-*.png`; no horizontal scroll at 390px; console clean.

## Criteria coverage

| Spec criterion | Tasks |
|---|---|
| Gols tab sorted, ≤ 20 | 1.2 |
| Club filter | 1.2 |
| Empty ranking | 1.2 |
| Initials fallback | 1.1 |
| No clubs prompt | 2.2 |
| Six rows, URL slugs | 2.2, 2.3 |
| Goals-conceded lead | 2.1, 2.3 |
| Same club rejected | 2.2 |
| Deep link | 2.2 |
| Head-to-head | 2.4 |
| Reduced motion | 2.3 |
| 390px | block verifications |

## Deferred

- None.
