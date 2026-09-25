# Spec: League overview

> Slug: `league-overview`
> Status: Approved
> Last updated: 2026-09-24

## Summary

Home page (Liga): the season table with Geral/Casa/Fora filters, league highlights, a goals-per-round chart, and a club search available from every page.

## Motivation

The table is what fans open first; highlights and chart give the site its statistical character.

## Behaviour

- Table lists 20 clubs: position, badge and name, played, wins, draws, losses, goal difference, points, last-5 form. Filter switches between Geral, Casa, Fora and re-ranks.
- A 3px bar beside the position marks Libertadores, Sul-Americana, and relegation zones; a legend names them.
- Clicking a club row opens that club's page.
- Highlight tiles: top scorer, top assister, best attack, best defence, average goals per match.
- Chart: total goals per round across the season.
- Search field (header, focus with `/`) lists matching clubs as the visitor types; choosing one opens its page.

## Rules

1. Geral order follows API rank; Casa and Fora sort by points, wins, goal difference, goals for.
2. Zones show as bar plus legend; color is never the only signal.
3. Numbers use tabular figures and are right-aligned.
4. Best attack/defence, average goals, and goals per round derive from stored fixtures; scorer/assister come from stored rankings.
5. Search matches club name ignoring case and accents, and also the stadium name.
6. Below 600px the table shows only position, club, played, goal difference, points.
7. Rounds not yet played appear as zero-height bars labelled "sem jogos"; never fabricated values.

## Acceptance criteria

- [x] Given the page loads, when the table renders, then 20 rows show and the top row's rank is 1. — verified 2026-09-24 via Playwright at 1440px: 20 rows, first rank 1
- [x] Given the Geral filter, when switching to Casa then Fora, then the table re-ranks and each filter's played counts equal the number of that club's home or away finished games. — verified 2026-09-24 via Playwright: Casa/Fora played equals finished home/away fixtures per club (fixtures.json)
- [x] Given a Libertadores-zone club, when its row renders, then a left bar and a legend entry "Libertadores" exist. — verified 2026-09-24 via Playwright: zone bars present and legend Libertadores/Sul-Americana/Rebaixamento
- [x] Given a click on any club row, when it completes, then the URL is that club's page. — verified 2026-09-24 via Playwright: row click navigates to /clubes/flamengo
- [x] Given the highlight tiles, when compared with data, then best attack equals the maximum goals-for in the table. — verified 2026-09-24 via Node assert (tsx): best attack goals equal max goalsFor; Playwright tile Flamengo 61 gols
- [x] Given the chart, when it renders, then one bar per round exists and hovering or focusing a bar shows round number and total goals. — verified 2026-09-24 via Playwright at 1440px: 38 bars for 38 rounds, hover tooltip 'Rodada 5, 20 gols'; keyboard access via visually hidden data table (Recharts bars not focusable)
- [x] Given focus outside inputs, when pressing `/`, then the search field is focused. — verified 2026-09-24 via Playwright: pressing / focuses Buscar clube
- [x] Given the query "sao", when results show, then "São Paulo" appears; given "zzz", then "Nenhum clube encontrado" appears. — verified 2026-09-24 via Playwright: 'sao' lists Sao Paulo, 'zzz' shows Nenhum clube encontrado
- [x] Given a 390px viewport, when the page renders, then the table shows exactly the five allowed columns and the page has no horizontal scroll. — verified 2026-09-24 via Playwright at 390px: 5 visible headers, scrollWidth <= innerWidth
- [x] Given a keyboard user, when tabbing through results, then Enter opens the focused club and Escape closes the list. — verified 2026-09-24 via Playwright: ArrowDown+Enter opens club (#/clubes/botafogo), Escape hides list

## Edge cases

| Situation | Expected behaviour |
|---|---|
| Missing top scorer or assister data | Tile shows "Dados indisponíveis" |
| Tie on all tie-break fields | Alphabetical by club name |
| Long club name | Truncates with ellipsis; full name in accessible name |
| Loading route | Skeleton table (20 rows) |
| Query with only spaces | No results list |
| Reduced motion | No chart animation |

## Out of scope

- Live scores, round selector for the table, club comparison (see `players-compare`).

## Dependencies

- `app-foundation` — layout and search field shell.
- `data-pipeline` — teams, fixtures, rankings, API standings.
