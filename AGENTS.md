# AGENTS.md — Rajniti

Hybrid mobile + web Monopoly game (RichUp.io-style). Prime UI reference: `images/`
(game room + lobby/appearance + game settings). Match it; don't restyle.

## Stack

- Vite 7 + React 19 + TypeScript (strict) + Tailwind v3. No Next.js.
- Capacitor 7 wraps `dist/` for iOS/Android. `base: './'` in `vite.config.ts` — keep it.
- Tests: Vitest, `*.test.ts` colocated with source. Run `npx vitest run <file>`.
- DB (server-side only, never imported by the client bundle): Node built-in
  `node:sqlite` (`DatabaseSync`). No native modules.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc --noEmit && vite build` (must stay green)
- `npx vitest run <path>` — run tests for one file

## Conventions

- Game rules go in pure, UI-free modules under `src/game/` (engine, cards, rules).
  React state in `src/game/store.tsx` only calls into them; never put rules in components.
- Tile data: `src/data/tiles.ts` (40 tiles, ids 0–39 clockwise from START).
- Server/persistence code lives in `server/` and must not be imported from `src/`
  (client bundle). Test with Vitest node environment.
- TDD: write failing tests first, implement minimal code, refactor green.
- Don't touch files outside your task's stated ownership.
- Keep `npm run build` green before finishing.
