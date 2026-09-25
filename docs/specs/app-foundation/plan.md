# Plan: App foundation

> Slug: `app-foundation`
> Spec: `spec.md` (same folder)
> Status: Approved
> Last updated: 2026-09-24

## Approach

Scaffold Vite + React + TS strict in the project root. Tailwind v4 via `@tailwindcss/vite`; tokens from `docs/design.md` in `@theme`. `HashRouter` so GitHub Pages needs no SPA fallback; Vite `base` set to `/brasileirao-stats/`. Layout component wraps routes. A GitHub Actions workflow builds and deploys `dist/`.

## Existing code touched

None — new project. `docs/` already exists.

## New files

| Path | Responsibility |
|---|---|
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html` | tooling; `base: '/brasileirao-stats/'` |
| `.gitignore`, `.env.example`, `LICENSE` | `node_modules`, `dist`, `.env`, `scripts/.cache`; MIT |
| `src/index.css` | Tailwind import, `@theme` tokens, Figtree import, reduced-motion rule, focus ring |
| `src/main.tsx` | mount, `HashRouter` |
| `src/app/App.tsx` | route table (lazy pages), not-found |
| `src/app/Layout.tsx` | skip link, header, notice, `<main id="main">`, footer, `/` shortcut |
| `src/app/SeasonNotice.tsx` | reads `season.json` |
| `src/app/Footer.tsx` | credits and disclaimer |
| `src/app/NotFound.tsx` | not-found page |
| `src/components/ui/Logo.tsx` | mark + wordmark |
| `src/components/ui/SearchField.tsx` | pill input shell (results in `league-overview`) |
| `src/lib/assets.ts` | `img(path)` → `import.meta.env.BASE_URL + 'img/' + path` |
| `src/data/season.json` | placeholder `{season:0,...}` replaced by `data-pipeline` |
| `src/types/data.ts` | shared data types (contract in `data-pipeline` plan) |
| `.github/workflows/deploy.yml` | build + `actions/deploy-pages` on push to main |

## Components / functions

| Name | Inputs | Output | Purpose |
|---|---|---|---|
| `Layout` | `children` via `<Outlet/>` | shell | shared chrome |
| `SeasonNotice` | none | banner | "Dados da temporada {season}. Amostra do plano gratuito, não é a temporada em andamento." |
| `Footer` | none | footer | credits |
| `img` | `path: string` | URL string | base-path-safe asset URL |

## Data shapes

`season.json`: `{ "season": 2024, "leagueId": 71, "collectedAt": "2026-09-24" }` (typed `Season` in `src/types/data.ts`).

## Routes and state

| Route | Page |
|---|---|
| `/` | Liga (`league-overview`) |
| `/jogos` | Jogos (`clubs-fixtures`) |
| `/clubes/:slug` | Clube (`clubs-fixtures`) |
| `/jogadores` | Jogadores (`players-compare`) |
| `/comparar` | Comparar (`players-compare`) |
| `*` | NotFound |

Until later specs land, unbuilt routes render a stub page titled with the route name. No global state.

## Dependencies

| Package | Reason |
|---|---|
| `react-router-dom` | routing with shareable URLs; no built-in |
| `tailwindcss`, `@tailwindcss/vite` | workspace stack |
| `@fontsource-variable/figtree` | self-host font; no runtime request to Google |
| `lucide-react` | design-system icon set |
| dev: `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks` | lint gate |

## Loading / error / empty states

Route-level `Suspense` fallback: skeleton bar from design system. Missing `season.json` fails the build (static import).

## Alternatives considered

| Decision | Chosen | Alternative | Why the alternative lost |
|---|---|---|---|
| Router mode | `HashRouter` | `BrowserRouter` + `404.html` copy | extra build step; hash URLs are acceptable for a demo |
| Font delivery | `@fontsource` | Google Fonts link | third-party request at runtime contradicts "no external calls" |

## Risks

- Hash URLs look less polished; accepted.
- Pages subpath breaks absolute asset URLs; all image URLs go through `img()`.

## Verification approach

| Criterion | How verified |
|---|---|
| Season notice visible | Playwright at 1440px and 390px, screenshot; text present above the fold |
| Footer credits | Playwright: footer contains both links and disclaimer text |
| No horizontal scroll, nav reachable | Playwright at 390px: `scrollWidth <= innerWidth`; click each link |
| Skip link | Playwright: Tab once, `document.activeElement` is skip link; Enter, focus in `#main` |
| Not-found | Playwright: `/#/nao-existe` shows link "Ir para a Liga" |
| Reduced motion | Playwright `reducedMotion: 'reduce'`; computed transition/animation durations are 0 |
| Build gates | `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0 |
| Pages publish | After user pushes: workflow green, `curl -I` on Pages URL returns 200 |
