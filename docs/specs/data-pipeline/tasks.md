# Tasks: Data pipeline

> Slug: `data-pipeline`
> Spec: `spec.md` (same folder)
> Plan: `plan.md` (same folder)
> Status: Complete
> Last updated: 2026-09-24

## Progress

| Block | Name | Status |
|---|---|---|
| 1 | Collect (API risk first) | Complete |
| 2 | Transform, images, check | Complete |

## Block 1 — Collect (API risk first)

**Delivers:** cached raw responses for all endpoints; season and real field shapes known.
**Depends on:** `app-foundation` Block 1.
**Needs from user:** `API_FOOTBALL_KEY` in `.env`.

### 1.1 Config and client
- **File:** `scripts/config.ts`, `scripts/client.ts`
- **Action:** constants; cached `apiGet` with budget file, header key, one retry on 429/5xx; fail fast if key missing.
- **Verify:** `npx tsx scripts/collect.ts` with empty key exits ≠ 0, names `API_FOOTBALL_KEY`, creates no cache.

### 1.2 Discover season
- **File:** `scripts/collect.ts`
- **Action:** call `standings?league=71&season=N` for N = 2024, 2023, 2022; first that returns data becomes `SEASON`; write it to `scripts/config.ts` and `src/data/season.json`.
- **Verify:** `season.json` holds the season; standings cache file has 20 teams.

### 1.3 Collect base endpoints
- **File:** `scripts/collect.ts`
- **Action:** in order: `teams`, `fixtures`, `players/topscorers`, `players/topassists`, `players/topyellowcards`, `players/topredcards`, `teams/statistics` x20, `players/squads` x20; stop at 90 requests.
- **Verify:** summary lists requests used and remaining; re-run repeats none.

### 1.4 Record real shapes
- **File:** `src/types/data.ts`
- **Action:** compare cached payloads with plan shapes; adjust types; list deviations in the block report.
- **Verify:** `npx tsc --noEmit` exits 0.

**Block verification:** cache holds standings, teams, fixtures (380), 4 rankings; stats/squads either cached or listed as remaining; `npm run build` exits 0.

---

## Block 2 — Transform, images, check

**Delivers:** committed JSON + images; check passes.
**Depends on:** Block 1.

### 2.1 Team map
- **File:** `scripts/team-map.ts`, `scripts/sportsdb.ts`
- **Action:** map 20 API-Football ids to TheSportsDB ids and slugs (lookup by name, reviewed by hand); `lookupteam` per id.
- **Verify:** all 20 map entries resolve to a team record.

### 2.2 Transform to JSON
- **File:** `scripts/transform.ts`, `src/lib/standings.ts`
- **Action:** build `teams`, `standings-api`, `fixtures`, `team-stats`, `rankings`, `squads` JSON; `standings.ts` derives `home`/`away`, ranked by points, wins, goal difference, goals for; `all` keeps API rank.
- **Verify:** `npx tsc --noEmit` exits 0; Node script compares derived `all` with API rank and prints mismatches.

### 2.3 Download images
- **File:** `scripts/transform.ts`
- **Action:** save badges (`/small` size), venue photos, player photos to `public/img/...`; paths stored relative; ≥ 2 s between requests; skip existing files.
- **Verify:** `ls public/img/teams` lists 20 files.

### 2.4 Check command
- **File:** `scripts/check.ts`, `package.json`
- **Action:** assert counts (20 teams, 380 fixtures, 20 rows x3), references (every `teamId` exists), image files exist; warnings for null stats and missing photos.
- **Verify:** `npm run data:check` exits 0 and prints the report.

**Block verification:** `npm run data:check`, `npm run build`, `npx tsc --noEmit` exit 0; `grep -r "$API_FOOTBALL_KEY" dist src public` empty.

## Criteria coverage

| Spec criterion | Tasks |
|---|---|
| Missing key exits | 1.1 |
| Rejected season | 1.2 |
| Budget and resume | 1.1, 1.3 |
| Counts and exit 0 | 2.4 |
| Warning for missing stats | 2.4 |
| Badge per club | 2.3, 2.4 |
| Key not in bundle | block 2 verification |
| Works from fresh clone | 2.2 (committed data), block 2 verification |

## Deferred

- Days 2+ of collection if 20 `teams/statistics` plus 20 `players/squads` exceed the budget: run collect again next day.
