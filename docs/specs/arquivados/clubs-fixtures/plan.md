# Plan: Clubs and fixtures

> Slug: `clubs-fixtures`
> Spec: `spec.md` (same folder)
> Status: Approved
> Last updated: 2026-09-24

## Approach

`/clubes/:slug` loads one team from `teams.json` by slug and renders the header plus four tab panels. Selected tab lives in the URL query (`?aba=jogos`) inside the hash route. Match rows and stats are computed by selectors from `fixtures.json` and `team-stats.json`. `/jogos` reads the round from `?rodada=N`.

## Existing code touched

| Path | Change |
|---|---|
| `src/app/App.tsx` | replace `/clubes/:slug` and `/jogos` stubs |
| `src/components/ui/Crest.tsx` | add initials fallback |
| `src/lib/standings.ts` | reused for record and position |

## New files

| Path | Responsibility |
|---|---|
| `src/features/club/ClubPage.tsx` | slug lookup, header, tabs, not-found |
| `src/features/club/ClubHeader.tsx` | photo overlay, badge, meta |
| `src/features/club/tabs/Summary.tsx` | Resumo |
| `src/features/club/tabs/Matches.tsx` | Jogos |
| `src/features/club/tabs/Statistics.tsx` | Estatísticas |
| `src/features/club/tabs/Squad.tsx` | Elenco |
| `src/features/fixtures/FixturesPage.tsx` | round view |
| `src/lib/club.ts` | `clubMatches`, `clubRecord`, `nextMatch`, `lastMatch` |
| `src/lib/format.ts` | pt-BR date/number formatting via `Intl` |
| `src/components/ui/Tabs.tsx` | accessible tabs, arrow-key navigation, URL-controlled |
| `src/components/ui/MatchRow.tsx` | shared match row |
| `src/components/ui/EmptyState.tsx` | title, message |
| `src/components/ui/PersonCard.tsx` | photo or initials |

## Components / functions

| Name | Inputs | Output | Purpose |
|---|---|---|---|
| `Tabs` | `tabs`, `value`, `onChange`, `label` | tablist + panel slot | roles `tab`/`tabpanel`, arrows |
| `MatchRow` | `fixture`, `perspectiveTeamId?` | row | shows chip when perspective given |
| `clubMatches(fixtures, teamId)` | data | `Fixture[]` sorted by date | Jogos tab |
| `clubRecord(fixtures, teamId)` | data | `{home: SideRecord, away: SideRecord}` | Estatísticas |
| `nextMatch` / `lastMatch` | fixtures, teamId | `Fixture \| null` | Resumo |
| `latestRound(fixtures)` | fixtures | number | default for `/jogos` |
| `GoalsByMinute` | `stats: TeamStats` | Recharts grouped bars | goals for/against per band |

## Data shapes

Uses `Team`, `Fixture`, `TeamStats`, `SquadPlayer` from `src/types/data.ts`. No new types except:

```ts
type SideRecord = { w: number; d: number; l: number; gf: number; ga: number }
```

## Routes and state

| Route | State |
|---|---|
| `/clubes/:slug?aba=resumo\|jogos\|estatisticas\|elenco` | tab in query; default `resumo` |
| `/jogos?rodada=N` | round in query; default latest finished round |

## Dependencies

None new (Recharts, Router already present).

## Loading / error / empty states

Route Suspense → skeleton header + panel. Unknown slug → `NotFound`. `null` metric → "Dados indisponíveis". Empty squad or stats → `EmptyState`. Missing stadium photo → solid club color.

## Alternatives considered

| Decision | Chosen | Alternative | Why the alternative lost |
|---|---|---|---|
| Tab state | URL query | local state | spec requires refresh/shareable |
| Separate route per tab | no | nested routes | more files, no gain |

## Risks

- Club color too light for white text → overlay darkens via `color-mix` toward black; verified by contrast script over all 20 clubs.
- `teams/statistics` fields may be null for some clubs; every field typed nullable.
- Squads may be capped by the free plan; UI states this in the empty state text only when the list is empty.

## Verification approach

| Criterion | How verified |
|---|---|
| Header content, default tab | Playwright on `/#/clubes/<slug>` |
| Jogos rows and chips | Playwright: count equals finished fixtures for the club; chip text matches score (test script) |
| Tab survives refresh | Playwright: open `?aba=estatisticas`, reload, tab active |
| Records sum | Playwright/Node: home+away equals total W/D/L |
| Null metric text | unit script with a null `TeamStats` fixture rendered; text present |
| Empty squad | temporarily empty squad for a club; empty state shown |
| Unknown slug | Playwright: not-found in shell |
| `/jogos` default round and disabled next | Playwright |
| Round selector | Playwright: select 1; row count equals round-1 fixtures |
| 390px | Playwright `scrollWidth <= innerWidth`; tabs row scrolls |
| Keyboard tabs | Playwright: ArrowRight changes active tab |
| Header contrast | Node script: for each club, contrast of white vs overlay end color ≥ 4.5 |
