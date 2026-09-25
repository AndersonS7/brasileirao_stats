# Tasks: App foundation

> Slug: `app-foundation`
> Spec: `spec.md` (same folder)
> Plan: `plan.md` (same folder)
> Status: Complete
> Last updated: 2026-09-24

## Progress

| Block | Name | Status |
|---|---|---|
| 1 | Scaffold, tokens, deploy | Complete |
| 2 | Shell, notice, footer, 404 | Complete |

## Block 1 — Scaffold, tokens, deploy

**Delivers:** empty app builds, styled with tokens, deploy workflow present.
**Depends on:** nothing.

### 1.1 Scaffold project
- **File:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `eslint.config.js`
- **Action:** Vite React-TS in project root; strict TS; `base: '/brasileirao-stats/'`; install deps from plan.
- **Verify:** `npm run build` exits 0.

### 1.2 Repo hygiene
- **File:** `.gitignore`, `.env.example`, `LICENSE`
- **Action:** ignore `node_modules`, `dist`, `.env`, `scripts/.cache`; `.env.example` with `API_FOOTBALL_KEY=`; MIT license.
- **Verify:** `git check-ignore .env scripts/.cache` lists both (after `git init`).

### 1.3 Tokens
- **File:** `src/index.css`
- **Action:** Tailwind import, `@theme` from `docs/design.md`, Figtree import, focus ring, reduced-motion rule (animation/transition 0).
- **Verify:** dev server: body font computed `Figtree`; `bg-green-700` renders `#0B6B39`.

### 1.4 Deploy workflow
- **File:** `.github/workflows/deploy.yml`
- **Action:** on push to main: `npm ci`, `npm run build`, upload `dist`, `actions/deploy-pages`.
- **Verify:** YAML parses (`npx yaml-lint` or Node `js-yaml`); real run verified after user pushes.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0.

---

## Block 2 — Shell, notice, footer, 404

**Delivers:** navigable shell on all routes at 1440px and 390px.
**Depends on:** Block 1

### 2.1 Types, season data, asset helper
- **File:** `src/types/data.ts`, `src/data/season.json`, `src/lib/assets.ts`
- **Action:** `Season` type (rest of contract added by `data-pipeline`); placeholder season file; `img()`.
- **Verify:** `npx tsc --noEmit` exits 0.

### 2.2 Layout, header, search field
- **File:** `src/app/Layout.tsx`, `src/components/ui/Logo.tsx`, `src/components/ui/SearchField.tsx`
- **Action:** skip link, header with nav (current link marked), search pill with `/` hint and shortcut, `<main id="main">`.
- **Verify:** Playwright: Tab once focuses skip link; `/` focuses search.

### 2.3 Notice and footer
- **File:** `src/app/SeasonNotice.tsx`, `src/app/Footer.tsx`
- **Action:** notice from `season.json`; footer with two source links and disclaimer per `docs/brief.md`.
- **Verify:** Playwright: both present on `/` and on a 404 route.

### 2.4 Routes and not-found
- **File:** `src/app/App.tsx`, `src/app/NotFound.tsx`, `src/main.tsx`
- **Action:** `HashRouter`, lazy stub pages for 5 routes, `*` → NotFound with link to Liga, Suspense skeleton.
- **Verify:** Playwright: each route renders its title; `/#/nao-existe` shows not-found.

**Block verification:** `npm run build`, `npx tsc --noEmit`, `npm run lint` exit 0; screenshots at 1440px and 390px saved to `docs/screenshots/foundation-*.png`; no horizontal scroll at 390px; console clean.

## Criteria coverage

| Spec criterion | Tasks |
|---|---|
| Season notice visible | 2.3 |
| Footer credits | 2.3 |
| 390px no scroll, nav reachable | 2.2, block 2 verification |
| Skip link | 2.2 |
| Not-found page | 2.4 |
| Reduced motion | 1.3 |
| Build gates | 1.1, block verifications |
| Pages publish | 1.4 (real check after user pushes) |

## Deferred

- Real Pages deploy check: requires user to create the GitHub repo and push.
