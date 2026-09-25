# Design: Brasileirão Stats

> Source of truth for visuals: `docs/design-system.html` (approved 2026-09-24). This file holds the tokens implemented in Tailwind `@theme`. On conflict, the HTML wins; update this file.

## Direction

White background, graphite text, one green accent. Thin borders and whitespace instead of shadows or repeated cards. Shadow only on floating menus. One motion: comparator bars grow once on entering view.

## Tokens

| Group | Token | Value |
|---|---|---|
| Green | `green-50/100/200` | `#EDF6F0` `#D3EADB` `#A9D5B9` |
| | `green-500/600/700/800/900` | `#1F9A55` `#0F8046` `#0B6B39` `#085530` `#063D22` |
| Neutral | `ink` / `ink-2` / `muted` | `#14201A` `#44524B` `#65726B` |
| | `line` / `line-strong` / `surface` | `#E1E7E3` `#C9D2CD` `#F5F8F6` |
| Meaning | `draw` / `draw-bg` | `#8A6A0B` `#FBF1CF` |
| | `loss` / `loss-bg` | `#B42B2B` `#FBE4E4` |
| | `sula` / `sula-bg` | `#0E7C86` `#DDF1F3` |
| | card yellow / red (icon only) | `#F2B705` `#D33B3B` |
| Type | `font-sans` | Figtree (self-hosted via `@fontsource-variable/figtree`) |
| Radius | `sm` / `md` / pill | 6px / 10px / 999px |
| Space | base | 4px scale: 4 8 12 16 24 32 48 72 |
| Focus | ring | 2px `green-700`, 2px offset |
| Motion | `ease-out` | `cubic-bezier(.2,.7,.2,1)` |

Type scale: display 52/56 700, h1 28/34 700, h2 20/28 600, body 16/25 400, small 14/21, caption 12/16 500. Tabular numerals on every number column. Headings letter-spacing −0.01em to −0.02em.

## Rules

- `green-700` is the only action/accent color. Text on it is white (6.6:1).
- Draw, loss, sula, cards carry meaning only; never decoration.
- Club colors appear only in the club header overlay and comparator series.
- Zone marks (table): 3px left bar + legend; color is never the only signal.
- Form badges: V `green-700`, E `draw`, D `loss`, letter always inside.
- Body text at least 4.5:1. Verified in design-system contrast table.
- Icons: Lucide, stroke 1.75. No emoji.
- Badges: transparent PNG, `alt=""` when the club name is adjacent, club name as `alt` when alone.
- Club header: stadium photo, overlay `color-mix(club 94% → 40%)` left to right, white text, badge in white circle.
- Breakpoint: 900px collapses sidebar-style nav to a top row. Table below 600px keeps rank, club, played, goal difference, points.
- `prefers-reduced-motion`: no bar growth, no skeleton shimmer.

## Components (see design-system.html for markup)

Button (primary, outline, ghost), search pill with `/` hint, tabs, segmented filter, standings table, stat tile, form badge, pill, comparator row, club header, photo card, person card with initials fallback, skeleton, empty state, error state, season notice, credits footer.
