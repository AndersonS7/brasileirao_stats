# Brief: Brasileirão Stats

> Last updated: 2026-09-24

## Purpose

Static stats site for one Brazilian Série A season: table, club pages, fixtures, player rankings, club comparator. Demo project built with AI for LinkedIn and GitHub. Not commercial.

## What it must prove

AI under human direction ships a coherent data product: a data pipeline, a clean accessible UI, honest sourcing, and documented process.

## Audience

- Football fans who look up and compare clubs.
- Recruiters and developers viewing the project on LinkedIn/GitHub.

## Tone

Clean, quiet, factual (Google-clean style). Specific copy, no hype, no invented metrics.

## UI language

pt-BR. README in pt-BR. Code, commits, and agent-facing docs in English.

## Data

| Source | Use | Access |
|---|---|---|
| API-Football (free plan, 100 req/day) | standings, fixtures, team statistics, rankings, squads | key in `.env`, build-time only |
| TheSportsDB (free key `123`) | badges, stadium photos, colors, descriptions, player photos | build-time only |

- Season shown: the latest season the free plan serves (not 2026). Validated in the `data-pipeline` spec; stored once in `src/data/season.json`.
- Every page shows the season notice. Credits footer on every page: both sources plus "badges are trademarks of their clubs; demo project, no commercial purpose, no affiliation with CBF or clubs".
- Site never calls external APIs at runtime. JSON and images are committed.

## Stack

Vite + React + TypeScript strict + Tailwind CSS. No backend. Astro not used: multi-route interactive app.

## Decisions

| Decision | Choice |
|---|---|
| Name | Brasileirão Stats |
| Squad tab | In scope |
| Per-fixture stats (possession, shots) | Out of v1 |
| Hosting | GitHub Pages, static |
| Design | `docs/design-system.html` approved 2026-09-24; tokens in `docs/design.md` |

## Specs (build order)

1. `app-foundation`
2. `data-pipeline`
3. `league-overview`
4. `clubs-fixtures`
5. `players-compare`
