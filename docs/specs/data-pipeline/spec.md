# Spec: Data pipeline

> Slug: `data-pipeline`
> Status: Approved
> Last updated: 2026-09-24

## Summary

Offline process run by the developer. It collects one season of Série A data from API-Football and club images/metadata from TheSportsDB, and writes static, validated JSON and image files that the site reads. The site never contacts either service.

## Motivation

Free plan allows 100 requests/day and hides the key from browsers; committed static data removes rate limits, key exposure, and network error states from the site.

## Behaviour

- Developer runs a collect command with the API key in `.env`; it fetches standings, all fixtures, per-club statistics, player rankings, squads, and club metadata/images, caching each response locally.
- A transform command turns cached responses into the site's JSON files and downloads club images.
- A check command validates the output and reports counts and warnings.
- Re-running collect skips anything already cached and stops before exceeding the daily request budget.
- The season collected is the latest one the free plan serves; the choice is recorded once in stored season data.

## Rules

1. The API key lives only in `.env`; it never appears in output files, logs, or the built site.
2. The built site makes zero requests to API-Football or TheSportsDB.
3. Collect never exceeds 90 API-Football requests per run (10 reserved margin).
4. Raw API responses stay in a git-ignored cache; only derived JSON and images are committed.
5. Missing metrics are stored as `null`, never estimated or invented.
6. Every image file is stored locally and mapped from its club or player; no runtime hotlinks.
7. Season number is defined in one place; changing it and re-running regenerates all output.
8. Club identity across the two services is matched by an explicit mapping file, not fuzzy guessing at runtime.

## Acceptance criteria

- [ ] Given no key in `.env`, when collect runs, then it exits non-zero with a message naming the missing variable and sends no request.
- [ ] Given a season the free plan rejects, when collect runs, then it prints the API's error and exits non-zero without writing output.
- [ ] Given a prior run used 90 requests, when collect runs again, then cached requests are not repeated and it stops cleanly at the budget with a summary of what remains.
- [ ] Given collect and transform completed, when check runs, then it reports 20 teams, 380 fixtures, 20 standings rows in each of all/home/away, and exits 0.
- [ ] Given a club with no statistics from the API, when check runs, then it lists the club as a warning and exits 0.
- [ ] Given a completed run, when listing the image folders, then each of the 20 clubs has a badge file; missing venue photos are listed as warnings.
- [ ] Given a production build, when searching `dist/` for the key value, then no match is found.
- [ ] Given a fresh clone without `.env`, when running the dev server, then the site works from committed data.

## Edge cases

| Situation | Expected behaviour |
|---|---|
| API returns 429 or 5xx | Retry once after 60 s; then stop, keep cache, exit non-zero |
| API returns empty list for an endpoint | Store empty array; check warns |
| TheSportsDB lacks image or description | Field `null`; site shows fallback |
| Club renamed between services | Mapping file entry resolves it; unmapped club fails check |
| Run interrupted mid-way | Next run resumes from cache |
| Duplicate run same day | No repeated requests for cached items |

## Out of scope

- Per-fixture statistics (possession, shots), live data, scheduled refresh, other leagues.
- Committing raw API payloads.

## Dependencies

- `app-foundation` — project scaffold, `.gitignore`, `src/types/data.ts`.
