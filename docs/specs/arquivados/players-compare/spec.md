# Spec: Players and comparator

> Slug: `players-compare`
> Status: Approved
> Last updated: 2026-09-24

## Summary

Player rankings (goals, assists, yellow cards, red cards) and a comparator that puts two clubs side by side, with their head-to-head matches.

## Motivation

Rankings answer "who leads"; the comparator is the interactive centrepiece and the product's memorable element.

## Behaviour

- **Jogadores** (`/jogadores`): tabs Gols, Assistências, Amarelos, Vermelhos; each lists up to 20 players with rank, photo (or initials), name, club badge and name, and the value. A club filter narrows the list.
- **Comparar** (`/comparar`): two club pickers; once both are chosen, a header shows both badges and names, then rows: points, wins, goals scored, goals conceded, win rate, clean sheets. Each row has two bars growing from the center; the leading side is full club color, the other is faded. For goals conceded, the lower value leads.
- Below the bars, a list of matches between the two clubs this season with scores.
- The chosen clubs are in the URL (`?a=slug&b=slug`), so a comparison can be shared.
- Bars animate once when the comparator enters view, with a "Repetir animação" button.

## Rules

1. Leader logic: higher wins except goals conceded, where lower wins; a tie fades both bars equally.
2. Bar length is proportional to the larger of the two values in that row (larger side = 100%).
3. Same club cannot be chosen on both sides.
4. Bars use the club's primary color; if two clubs share a near-identical color (distance below threshold), the second uses `green-700`.
5. Numbers stay visible next to bars; color is never the only signal of who leads.
6. Rankings that the API did not provide show an empty state, not a fabricated list.
7. Under `prefers-reduced-motion`, bars render at final width without animation.

## Acceptance criteria

- [x] Given `/jogadores`, when it loads, then the Gols tab shows up to 20 rows sorted by goals descending with rank 1 first. — verified 2026-09-24 via Playwright at 1440px and 390px: 20 rows, values non-increasing, rank 1 first
- [x] Given the club filter set to a club, when applied, then every row's club is that club. — verified 2026-09-24 via Playwright: filter palmeiras leaves 4 rows, all Palmeiras
- [x] Given no ranking data for a tab, when opened, then an empty state with a message shows. — verified 2026-09-24 via Playwright: club with no scorers (bahia) shows "Sem ranking"; API-empty path uses the same EmptyState
- [x] Given a player without photo, when the row renders, then initials appear in place of the photo. — verified 2026-09-24 via Playwright: photo request aborted for player 10073, row shows "LF"
- [x] Given `/comparar` with no clubs chosen, when it loads, then both pickers and a prompt to choose show; no bars. — verified 2026-09-24 via Playwright at 1440px and 390px: prompt shown, 0 comparison rows
- [x] Given two different clubs, when both are chosen, then six comparison rows render and the URL contains both slugs. — verified 2026-09-24 via Playwright: palmeiras+flamengo gives 6 rows and URL ?a=palmeiras&b=flamengo
- [x] Given the "goals conceded" row, when club A has fewer, then A's bar is full color and B's is faded. — verified 2026-09-24 via Node script over all 190 pairs and Playwright (33 vs 42: A full opacity, B 0.45)
- [x] Given the same club chosen on both sides, when confirming, then the second picker rejects it and shows a message. — verified 2026-09-24 via Playwright: other side option absent; ?a=palmeiras&b=palmeiras shows alert and no comparison
- [x] Given a URL with `?a=x&b=y` of valid clubs, when loaded, then the comparison renders without user input. — verified 2026-09-24 via Playwright: reload and direct load render 6 rows
- [x] Given two clubs that met twice, when the head-to-head list renders, then two matches with scores appear; given none, then "Não se enfrentaram nesta temporada" appears. — verified 2026-09-24 via Playwright: 2 matches for Palmeiras x Flamengo, equal to fixtures; empty-message path not exercised (every pair met this season)
- [x] Given reduced motion enabled, when the comparator renders, then bars are at final width and no transition runs. — verified 2026-09-24 via Playwright reducedMotion=reduce: widths final, transition-duration 0s
- [x] Given a 390px viewport, when either page renders, then no horizontal page scroll appears and comparator rows stay legible. — verified 2026-09-24 via Playwright at 390px: scrollWidth <= innerWidth on both pages

## Edge cases

| Situation | Expected behaviour |
|---|---|
| Invalid slug in URL | Ignore that side and show its picker empty |
| Both values 0 in a row | Both bars empty, both numbers shown |
| Missing metric (`null`) | Row shows "Dados indisponíveis", no bar |
| Fewer than 20 ranked players | List what exists |
| Long player or club name | Truncates with ellipsis; full name accessible |
| Repeated "Repetir animação" clicks | Restarts the animation; no stacking |
| Keyboard only | Pickers are native-accessible controls; replay button focusable |

## Out of scope

- Player detail pages, comparing players, more than two clubs, saving comparisons.

## Dependencies

- `app-foundation`, `data-pipeline`, `league-overview` (shared UI), `clubs-fixtures` (club helpers).
