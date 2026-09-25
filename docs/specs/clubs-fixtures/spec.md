# Spec: Clubs and fixtures

> Slug: `clubs-fixtures`
> Status: Approved
> Last updated: 2026-09-24

## Summary

A page per club with tabs Resumo, Jogos, Estatísticas, Elenco, plus a Jogos page listing every match by round.

## Motivation

Club pages are the depth of the product; the fixtures page lets fans browse results round by round.

## Behaviour

- Club header: stadium photo tinted with the club color, badge, name, stadium, city, founding year.
- **Resumo:** position, points, record, last-5 form, last result and next scheduled match (if any), description, stadium photo and capacity.
- **Jogos:** every match of the club in date order, with round, date, opponent badge and name, home/away marker, score, and a V/E/D chip for finished matches.
- **Estatísticas:** home vs away record; goals scored and conceded per 15-minute band (bar chart); longest streaks; clean sheets home/away; most used formations; yellow and red cards.
- **Elenco:** players with photo (or initials), name, position, number, age.
- The selected tab is part of the URL, so a tab can be shared.
- **Jogos page** (`/jogos`): one round at a time with previous/next buttons and a round selector; each match shows both badges, names, score or date.

## Rules

1. Club header text is white on the club-color overlay and meets 4.5:1 contrast; if a club color is too light, the overlay darkens (never dark text).
2. Any metric that is `null` renders "Dados indisponíveis", never 0.
3. A club with no squad or no statistics shows an empty state in that tab; other tabs still work.
4. Unfinished matches show date and time, no score, no chip.
5. Opening `/jogos` lands on the latest round with finished matches.
6. Tab and round selection survive a page refresh.
7. Badges use empty `alt` when the club name is adjacent.

## Acceptance criteria

- [ ] Given a valid club URL, when it loads, then the header shows the club name, stadium, and badge, and Resumo is the active tab.
- [ ] Given the club has 38 finished matches, when opening Jogos, then 38 rows appear ordered by date, each with a V, E, or D chip matching its score.
- [ ] Given a tab is opened, when the page is refreshed, then the same tab is active.
- [ ] Given Estatísticas, when it renders, then home and away records sum to the club's total wins, draws, losses.
- [ ] Given a `null` statistic, when rendered, then the text "Dados indisponíveis" appears and no "0" stands in its place.
- [ ] Given no squad data, when opening Elenco, then an empty state with a message appears and other tabs still work.
- [ ] Given an unknown club slug, when it loads, then the not-found page renders inside the shell.
- [ ] Given `/jogos`, when it loads, then the latest finished round is shown; when pressing next on the last round, then the button is disabled.
- [ ] Given a round, when the selector changes to round 1, then exactly the matches of round 1 show.
- [ ] Given a 390px viewport, when a club page renders, then no horizontal page scroll appears and tabs scroll inside their own row.
- [ ] Given a keyboard user, when focused on the tab list, then arrow keys move between tabs.

## Edge cases

| Situation | Expected behaviour |
|---|---|
| Missing stadium photo | Header uses solid club color |
| Missing badge | Initials in a green-50 circle |
| Postponed match | Row shows "Adiado" and date, no score |
| Very long club or stadium name | Wraps in header; truncates in table rows |
| Fewer than 38 finished matches | Lists what exists |
| Slow route load | Skeleton header and tab panel |
| Reduced motion | No transitions between tabs |

## Out of scope

- Per-match detail pages, lineups, events, player detail pages, transfers.

## Dependencies

- `app-foundation`, `data-pipeline`, `league-overview` (shared UI primitives, standings selectors).
