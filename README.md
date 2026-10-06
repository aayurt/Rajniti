# Rajniti

A RichUp.io-style multiplayer Monopoly game — Nepali politics edition. Buy cities, airports, and utilities, dodge taxes and jail, trade your way to power.

> Prime UI is locked to `images/` (game room + lobby/appearance + game settings). See `PLAN.md`.

## Stack

- **Web + mobile, one codebase:** Vite + React 19 + TypeScript + Tailwind CSS
- **Mobile:** Capacitor 7 wraps the same `dist/` build for iOS/Android (`capacitor.config.ts`)
- Why not Next.js: Capacitor needs a static bundle; Next would be forced into `output: export`, losing SSR while adding complexity. If SEO/SSR landing pages are ever needed, add Next as a separate marketing app later.

## Quick start

```bash
npm install
npm run dev      # web dev server → http://localhost:5173
npm run build    # typecheck + static bundle → dist/
npm run preview  # serve the production bundle
```

## Mobile (Capacitor)

```bash
npm run cap:sync              # build web + sync into native projects
npx cap add ios               # once, on a Mac with Xcode
npx cap add android           # once, with Android Studio
npm run cap:ios / cap:android # open native IDEs
```

Mobile adaptations already in the UI:
- Bottom tab bar (Board | Players | Chat) under `lg` breakpoint, `100dvh` layout, safe-area padding
- Touch targets ≥44px, tap highlight removed
- Board scrolls horizontally on narrow screens (pinch-zoom/Haptics are P5 items)

## Screens (match `images/`)

- **Lobby** (`src/components/Lobby.tsx`): blurred board backdrop, 12-blob appearance picker, Join game, Game settings (max players, private room, bots, board map) + Gameplay rules (x2 rent, vacation cash, auction, prison rent, mortgage, even build, starting cash, random order)
- **Game room**: `LeftPanel` (share link + copy, room settings, chat), `Board` (40-tile 11×11 grid, dice, turn label, log, buy prompt), `RightPanel` (players, Bankrupt, Trades + Create, My properties)
- State lives in `src/game/store.tsx` (reducer; WS-ready event-style actions). Tile data in `src/data/tiles.ts`.

## Project layout

```
index.html            Vite entry
src/main.tsx App.tsx  Shell (lobby ⇄ game, mobile tabs)
src/components/       LeftPanel, Board, Dice, RightPanel, Lobby
src/data/tiles.ts     40-tile board definition
src/game/store.tsx    players, dice, log, chat, trades, settings
capacitor.config.ts   appId io.rajniti.game, webDir dist
legacy/index.html     original single-file demo (kept for reference)
images/               prime-UI reference screenshots
sketches/             early explorations (not the direction)
```

## Roadmap (details in PLAN.md)

1. P1 pixel-perfect pass vs `images/` overlay
2. P2 board engine (step movement, rents, bankruptcy)
3. P3 turns/cards/jail/tax decks
4. P4 trades/presence/room settings, WS-ready events
5. P5 polish: animations, sound, Haptics, icons/splash, `v0.1.0`

## License

MIT
