# Spec: App foundation

> Slug: `app-foundation`
> Status: Approved
> Last updated: 2026-09-24

## Summary

Site shell shared by every page: header with navigation and club search entry, season notice, credits footer, not-found page, design tokens, and automatic publishing to GitHub Pages.

## Motivation

All later features render inside this shell; season notice and credits are mandatory honesty requirements.

## Behaviour

- Header: logo, links Liga, Jogos, Jogadores, Comparar, and a search field with `/` hint. Current page link is marked.
- Under the header, a notice states which season is shown and that it is a free-plan sample, not the current season.
- Footer lists both data sources with links and the trademark/no-affiliation statement.
- Unknown URLs show a not-found page with a link to Liga.
- Pushing to the main branch publishes the site to GitHub Pages.

## Rules

1. Notice and footer appear on every page, including not-found.
2. Notice reads the season number from stored season data; never hard-coded text.
3. Colors, type, spacing follow `docs/design.md`; green is the only accent.
4. All UI copy pt-BR.
5. Keyboard: a skip link is the first tab stop; every interactive element shows a focus ring.
6. Site works when served from the subpath `/brasileirao-stats/`.

## Acceptance criteria

- [ ] Given any page, when it loads, then the text "Dados da temporada" followed by the season number is visible without scrolling at 1440px and 390px.
- [ ] Given any page, when scrolled to the bottom, then links to API-Football and TheSportsDB and the trademark statement are visible.
- [ ] Given a 390px viewport, when any page renders, then no horizontal page scroll appears and all four nav links are reachable.
- [ ] Given a keyboard user, when pressing Tab once on load, then the skip link is focused; when activated, focus moves to main content.
- [ ] Given the URL `/#/nao-existe`, when it loads, then the not-found page with a link to Liga renders inside the shell.
- [ ] Given the user's OS sets reduced motion, when any page renders, then no CSS animation or transition runs.
- [ ] Given a clean checkout, when running `npm run build`, `npx tsc --noEmit`, and `npm run lint`, then all exit 0.
- [ ] Given a push to main, when the workflow finishes, then the Pages URL returns the site with HTTP 200.

## Edge cases

| Situation | Expected behaviour |
|---|---|
| Missing season data | Build fails with a message naming the missing file |
| Very narrow viewport (320px) | Nav row scrolls horizontally inside itself; page does not |
| Page refreshed on a deep URL | Same page reloads (no 404 from Pages) |
| Keyboard only | Search opens with `/` unless focus is in an input |

## Out of scope

- Dark mode, language switch, user accounts.
- Search results content (see `league-overview`).

## Dependencies

None.
