# Plan: Players and comparator

> Slug: `players-compare`
> Spec: `spec.md` (same folder)
> Status: Approved
> Last updated: 2026-09-24

## Approach

Rankings page reads `rankings.json` and filters client-side. Comparator builds rows from `computeStandings`, `clubRecord`, and `team-stats.json` via one selector, renders bars with plain CSS (`--w` variable, `transition: width`) as in the approved design system, and lists head-to-head from `fixtures.json`. Clubs live in the URL query.

## Existing code touched

| Path | Change |
|---|---|
| `src/app/App.tsx` | replace `/jogadores`, `/comparar` stubs |
| `src/components/ui/PersonCard.tsx` | reuse for initials fallback (avatar variant) |
| `src/components/ui/Tabs.tsx` | reuse for ranking tabs |
| `src/lib/club.ts` | reuse `clubRecord` |

## New files

| Path | Responsibility |
|---|---|
| `src/features/players/PlayersPage.tsx` | tabs, club filter, list |
| `src/features/players/RankingList.tsx` | rows with photo, club, value |
| `src/features/compare/ComparePage.tsx` | pickers, URL state, layout |
| `src/features/compare/ComparisonRows.tsx` | header + six rows |
| `src/features/compare/HeadToHead.tsx` | shared matches list |
| `src/features/compare/TeamPicker.tsx` | labelled native `<select>` with crest preview |
| `src/lib/compare.ts` | `buildComparison`, `headToHead`, `seriesColors` |

## Components / functions

| Name | Inputs | Output | Purpose |
|---|---|---|---|
| `buildComparison(a, b, data)` | team ids, data | `CompareRow[]` | six rows with values, lead side, widths |
| `headToHead(fixtures, a, b)` | ids | `Fixture[]` | finished and scheduled matches between them |
| `seriesColors(a, b)` | teams | `[string, string]` | primary colors; second falls back to `#0B6B39` if RGB distance < 60 |
| `useInView(ref)` | ref | boolean | triggers animation once via `IntersectionObserver` |
| `TeamPicker` | `value`, `exclude`, `onChange`, `label` | select | excludes the other side's club |

## Data shapes

```ts
type CompareRow = {
  key: 'points' | 'wins' | 'goalsFor' | 'goalsAgainst' | 'winRate' | 'cleanSheets'
  label: string
  a: number | null; b: number | null
  lead: 'a' | 'b' | 'tie' | null       // null when a value is null
  widthA: number; widthB: number       // 0-100
}
```

Example: `{ key: 'goalsAgainst', label: 'Gols sofridos', a: 14, b: 19, lead: 'a', widthA: 74, widthB: 100 }`.

Win rate = wins / played, shown as percent. Clean sheets from `TeamStats.cleanSheet` (home + away); `null` if either is null.

## Routes and state

| Route | State |
|---|---|
| `/jogadores?aba=gols\|assistencias\|amarelos\|vermelhos&clube=slug` | tab and club filter in query |
| `/comparar?a=slug&b=slug` | clubs in query; invalid slug ignored |

## Dependencies

None new.

## Loading / error / empty states

Route Suspense skeleton. Empty ranking → `EmptyState`. No clubs chosen → prompt "Escolha dois clubes para comparar". Null metric → "Dados indisponíveis".

## Alternatives considered

| Decision | Chosen | Alternative | Why the alternative lost |
|---|---|---|---|
| Bars | CSS width transition | Recharts | symmetric center-out bars are simpler in CSS and match the design system |
| Picker | native `<select>` | custom combobox | native is accessible and needs no code |
| Animation trigger | `IntersectionObserver` | scroll library | one hook suffices |

## Risks

- Two clubs with similar colors (both dark) → `seriesColors` fallback covers it; tested on all 190 pairs in a script.
- Rankings may be capped or partial on the free plan; empty-state path tested.
- Player photos missing for many players; initials fallback is the common path, not an exception.

## Verification approach

| Criterion | How verified |
|---|---|
| Gols tab sorted, 20 max | Playwright: row count ≤ 20, values non-increasing |
| Club filter | Playwright: all rows show chosen club |
| Empty ranking | Test with emptied `yellow` array; empty state shown |
| Initials fallback | Playwright: row of player with `photo: null` has initials |
| No clubs prompt | Playwright on `/#/comparar` |
| Six rows, URL slugs | Playwright: choose two clubs; six rows; URL has `a=` and `b=` |
| Goals-conceded lead | Node script over `buildComparison` |
| Same club rejected | Playwright: option for the other club is absent/disabled |
| Deep link | Playwright: load `?a=..&b=..`, rows render |
| Head-to-head | Playwright: match count equals fixtures between the pair |
| Reduced motion | Playwright `reducedMotion: 'reduce'`: bars at final width, transition 0 |
| 390px | Playwright `scrollWidth <= innerWidth`; screenshots 1440px and 390px |
| Color fallback | Node script over all club pairs: no pair with distance < 60 |
