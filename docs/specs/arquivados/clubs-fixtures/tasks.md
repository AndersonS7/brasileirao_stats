# Tasks: Clubs and fixtures

> Slug: `clubs-fixtures`
> Spec: `spec.md` (same folder)
> Plan: `plan.md` (same folder)
> Status: Complete
> Last updated: 2026-09-24

## Progress

| Block | Name | Status |
|---|---|---|
| 1 | Club page, Resumo, Jogos | Complete |
| 2 | Estatísticas, Elenco | Complete |
| 3 | Fixtures page | Complete |

## Block 1 — Club page, Resumo, Jogos

**Delivers:** `/clubes/:slug` with header, URL-driven tabs, Resumo and Jogos.
**Depends on:** `league-overview` Block 1.

### 1.1 Selectors and formatting
- **File:** `src/lib/club.ts`, `src/lib/format.ts`
- **Action:** `clubMatches`, `clubRecord`, `nextMatch`, `lastMatch`; pt-BR date helpers.
- **Verify:** Node script: for a club, W+D+L equals finished matches.

### 1.2 Tabs and UI primitives
- **File:** `src/components/ui/Tabs.tsx`, `MatchRow.tsx`, `EmptyState.tsx`, `Crest.tsx`
- **Action:** URL-controlled tabs with arrow keys; match row with V/E/D chip; empty state; Crest initials fallback.
- **Verify:** `npx tsc --noEmit` exits 0.

### 1.3 Club page and header
- **File:** `src/features/club/ClubPage.tsx`, `ClubHeader.tsx`, `src/app/App.tsx`
- **Action:** slug lookup, unknown slug → NotFound, header with photo overlay, tab wiring (`?aba=`).
- **Verify:** Playwright: valid slug renders header; invalid slug renders not-found.

### 1.4 Resumo and Jogos tabs
- **File:** `src/features/club/tabs/Summary.tsx`, `Matches.tsx`
- **Action:** position/points/form, last and next match, description, stadium photo; full match list.
- **Verify:** Playwright: Jogos row count equals club's finished fixtures.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0; screenshots 1440px and 390px in `docs/screenshots/club-*.png`; header contrast script over 20 clubs passes.

---

## Block 2 — Estatísticas, Elenco

**Delivers:** remaining tabs with empty and null handling.
**Depends on:** Block 1

### 2.1 Goals by minute chart
- **File:** `src/features/club/GoalsByMinute.tsx`
- **Action:** grouped bars for/against per 15-minute band; hidden data table; no animation under reduced motion.
- **Verify:** Playwright: 6 to 8 band groups render; tooltip on hover.

### 2.2 Estatísticas tab
- **File:** `src/features/club/tabs/Statistics.tsx`
- **Action:** home vs away record from `clubRecord`, streaks, clean sheets, formations, cards; `null` → "Dados indisponíveis".
- **Verify:** Node/Playwright: home+away equals totals; null fixture shows text.

### 2.3 Elenco tab
- **File:** `src/features/club/tabs/Squad.tsx`, `src/components/ui/PersonCard.tsx`
- **Action:** grid of person cards; initials fallback; empty state.
- **Verify:** Playwright: cards count equals `squads[teamId].length`; empty squad shows empty state.

**Block verification:** build, tsc, lint exit 0; Playwright walks all four tabs on one club at 1440px and 390px; screenshots saved.

---

## Block 3 — Fixtures page

**Delivers:** `/jogos` round browser.
**Depends on:** Block 1

### 3.1 Round helper
- **File:** `src/lib/club.ts`
- **Action:** add `latestRound`, `roundFixtures`.
- **Verify:** Node script: `latestRound` equals max round with a finished match.

### 3.2 Fixtures page
- **File:** `src/features/fixtures/FixturesPage.tsx`, `src/app/App.tsx`
- **Action:** round selector + previous/next (disabled at ends), `?rodada=` state, `MatchRow` list, postponed handling.
- **Verify:** Playwright: default round; select 1 shows round-1 matches; last-round next disabled.

**Block verification:** build, tsc, lint exit 0; screenshots 1440px and 390px; console clean.

## Criteria coverage

| Spec criterion | Tasks |
|---|---|
| Header, default tab | 1.3 |
| Jogos rows and chips | 1.4 |
| Tab survives refresh | 1.2, 1.3 |
| Records sum | 2.2 |
| Null metric text | 2.2 |
| Empty squad | 2.3 |
| Unknown slug | 1.3 |
| `/jogos` default and disabled next | 3.1, 3.2 |
| Round selector | 3.2 |
| 390px | block verifications |
| Keyboard tabs | 1.2 |

## Deferred

- None.
