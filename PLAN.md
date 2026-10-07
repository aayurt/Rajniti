# Rajniti — Overall Plan (Locked to RichUp.io Design)

> Project: **Rajniti** (github: `Rajniti`). A RichUp.io-style multiplayer Monopoly game.
> Prime UI source of truth: **`images/`** — `images/game/` (active game room), `images/settings/` (lobby: appearance picker + game settings + gameplay rules).
> Deep UI source: **`samples/`** (saved RichUp.io pages). Text inventory extracted 2026-10-06:
> board is canvas-rendered on the real site (DOM grid is our reimplementation); shell/panels/chat/modals are DOM.
> Authoritative copy: log lines (`{name} bought {tile}`, `{name} paid $N to {owner}`, `{name} paid a $N tax`,
> `{name} will spend a turn while on vacation`, joins, `Game started with a randomized players order. Good luck!`,
> `Joined room xxxxx`); turn area (`{name} is playing...` + `m:ss` timer + `Roll the dice`/`End turn` button);
> `Host` badge (not crown); Copy/`Copied!` toggle; `Connection lost` banner; Adblock modal copy; lobby states
> (room-full Spectate/Return, login-exclusive, `Waiting for {name} to start the game...`, `Updating settings...`);
> starting cash options $500–$3000; airport is **MUC Airport** $200 (not MUJ).
> `legacy/index.html` is the original single-file demo (reference only). Ignore `sketches/` for styling.

## 0. Stack decision (locked)

- **Vite + React 19 + TS + Tailwind v3** — one codebase for web and mobile.
- **Capacitor 7** (`capacitor.config.ts`, `webDir: dist`, `base: './'`) wraps the static bundle for iOS/Android.
- **Not Next.js:** Capacitor requires static output; Next would be pinned to `output: export` (no SSR/routes/middleware), keeping its complexity with none of its benefits.
- Screens: `Lobby` (appearance + settings) ⇄ `GameRoom` (`LeftPanel` + `Board` + `RightPanel`), state in `src/game/store.tsx`, tiles in `src/data/tiles.ts`.
- Mobile shell: bottom tabs (Board | Players | Chat) < `lg`, `100dvh`, safe-area insets, ≥44px targets; board scrolls horizontally on phones.
> Ignore `sketches/` for styling. All work must match this dark 3-column game-room look.

## 1. Design Lock (do not deviate)

**Layout:** 3 columns, full-viewport, dark.
- Left 300px: logo `RICHUP.io`, Share-game link + Copy + View room settings, ad-block notice, Chat (bubbles, player-only input).
- Center 1fr: 40-tile perimeter board (11×11 grid, center 9×9 stage), 3D white dice, `X is playing...`, game log feed, floating Surprise/Treasure cards.
- Right 310px: player list (avatar blob + name + cash, active highlight, crown), Trades panel, Buy/Trade action box.

**Tokens:**
- bg `#0b0a14`, panel `#1a1830`, tile `#25224a`, border `#34315e`, text `#e8e6ff`, muted `#8f8aa8`
- accents: green `#7dff5e`, purple `#8b7cf0`, orange `#ff9f1c`, pink `#ff6b9d`
- Tiles: rounded 9px, top color-bar (top/bottom) / side-bar (left/right), price pill, circular flag badge overlapping edge, token blobs (`👀` on colored circle) stacked per tile.
- Board order (clockwise from START, 40 tiles — already in `index.html` `T[]`): START → Salvador 60$ → Treasure → Rio 60$ → Earnings Tax → TLV Airport → Tel Aviv → Haifa 110$ → Surprise → Jerusalem 120$ → In Prison → Venice → Power Co 150$ → Milan 140$ → Rome 160$ → MUJ Airport 200$ → Frankfurt 180$ → Treasure → Munich 190$ → Berlin 200$ → Vacation → Shenzhen 210$ → Surprise → Beijing 220$ → Shanghai 240$ → CDG Airport 200$ → Lyon 260$ → Water Co 150$ → Toulouse 270$ → Paris 280$ → Go to prison → Liverpool 290$ → Manchester 300$ → Treasure → London 320$ → JFK Airport 200$ → Surprise → San Francisco 360$ → Premium Tax → New York 400$.

## 2. Scope

**In:** static pixel-perfect UI → board engine → turns/dice/cards/jail/tax → players/trades/chat (local mock, multiplayer-ready) → polish (animations, sound, responsive).
**Out (for now):** auth, rooms/backend, real multiplayer, AI bots, landing pages. No light theme, no alternate board styles.

## 3. Architecture

- `src/App.tsx` — shell: lobby ⇄ game + mobile tab nav.
- `src/game/store.tsx` — reducer state machine (players, dice, log, chat, trades, settings); actions shaped like future WS events.
- `src/data/tiles.ts` — 40-tile board + `tileArea()` grid map + `isBuyable()`.
- `src/components/` — `LeftPanel` (share/chat), `Board` (+`Dice`, tiles, buy prompt), `RightPanel` (players/Bankrupt/Trades/My properties), `Lobby` (appearance picker + settings).
- Current game logic (done): join, roll → move + pass-START +$200, rent 20% of price, buy/skip, bankrupt, chat, trades create/cancel.
- Later: step-by-step token animation, Surprise/Treasure decks, jail, tax rules, auctions, mortgage (P2–P4).

**Core types:**
```ts
Tile = { id, name, price?, flag?, color?, kind: 'property|airport|utility|tax|treasure|surprise|corner', ownedBy? }
Player = { id, name, colorCls, emoji, money, pos, inJail?, properties: number[] }
Event = { type: 'roll|move|buy|rent|card|join|leave|chat', text, at }
```

## 4. Phases

### P0 — Design freeze (done, verify)
- [x] `index.html` matches screenshot layout. Keep screenshot next to build for visual diff.
- Acceptance: side-by-side, tile names/prices/flags correct, no light-theme leakage.

### P1 — Pixel-perfect static (next, ~1 day)
1. Fix tile geometry: uniform gaps, side tiles horizontal (name vertical, price right), flags half-overlapping edge, START/Vacation/Prison corners distinct.
2. Center stage: dice size/tilt/shadow, log max-height + auto-scroll, cards overlap bottom-right of log.
3. Left/right panels spacing, logo weight, player-row active state.
- Acceptance: screenshot overlay at 1440px ≈ identical; no JS errors.

### P2 — Board engine (core rules, local)
1. `tiles.ts`: full 40-tile data with rents, groups, mortgage values.
2. Movement: roll → animate token step-by-step around perimeter (not teleport), pass START +$200, Vacation hold.
3. Buy/rent: land → Buy button enabled → deduct, set `ownedBy`, flag badge; owned → pay rent to owner, update both balances + log.
4. Bankruptcy: money < 0 → eliminate, grey out row.
- Acceptance: 2–4 local players can complete 20 turns with correct balances in console + UI.

### P3 — Turns, dice, cards, jail, tax
1. Turn flow: `ROLL → MOVE → RESOLVE → END`; doubles = extra roll; 3 doubles → jail.
2. Dice: shake animation, pips via `drawDice()`, disable during animation.
3. Surprise/Treasure decks (≥16 cards each): scholarship +$100, phone repair −$50, etc. Card popup with dismiss, applies effect + log.
4. Jail: Go to prison / 3 doubles → token to In Prison, pay/bail or doubles to exit, passing-by vs in-jail state.
5. Tax: Earnings %10 vs fixed, Premium $75; Airport/utility rent scaling (1 airport = $25 × owned count, utility = dice × 4/10).
- Acceptance: each special tile triggers correct effect + log + card 5/5 manual runs.

### P4 — Players, trades, chat (mock → multiplayer-ready)
1. Player list: join/leave, crown = richest/current turn, cash updates animate, avatar colors fixed.
2. Trade modal: offer property + cash, accept/decline, log result. Trades panel lists open offers.
3. Chat: send/receive, system vs player styles, player-only gate message.
4. Room: Copy link works, View room settings modal (starting cash, max players). All state changes emit `Event` so WS can replay later.
- Acceptance: trade completes property swap; chat + log persist per session.

### P5 — Polish
1. Animations: token hop, dice bounce, card slide-in, cash tick.
2. Sound toggle (dice, buy, card) + mute persistence.
3. Responsive: ≥1100px 3-col; below → board first, panels stack; board min 640px, tiles shrink without overlap.
4. A11y: buttons focusable, tile `title`/aria-label, chat input labelled.
- Acceptance: Lighthouse ≥90 on desktop, no horizontal scroll at 1280px, keyboard can roll/buy/end-turn.

## 5. File Plan
- App: `index.html` (Vite entry), `src/`, `capacitor.config.ts`, `tailwind/postcss/vite/ts` configs.
- Docs: `README.md`, `PLAN.md` (this). References: `images/`, `legacy/index.html`.
- Later: wire `store.tsx` to the engine (`src/game/engine.ts`, `cards.ts`, `rules.ts` —
  done, 67 colocated Vitest tests green), `src/components/TradeModal.tsx`, `ios/`/`android/`
  (generated, gitignored). DB: `server/db.ts` (node:sqlite session store, 10 tests green).

## 6. Milestones (repo-level)
- **M1 repo + docs** (this commit): git init, GitHub `Rajniti`, `README.md`, `PLAN.md`, working `index.html` demo.
- **M2 pixel-perfect** (P1): screenshot-identical static UI.
- **M3 local game** (P2–P3): full local rules, winnable 2–4 player game.
- **M4 social** (P4): trades + chat + room settings, WS-ready events.
- **M5 release** (P5): polish, responsive, sound, a11y, tagged `v0.1.0`.

## 7. Risks / Guards
- Scope creep into other sketch styles → reject; every PR references screenshot.
- 11×11 grid drift on small screens → lock aspect + min sizes, test 1280/1440.
- Game-logic-in-DOM → keep `game.ts` pure, DOM only renders.
- Multiplayer premature → local-first, events shaped for WS from P4.

## 8. Next 3 actions
1. P1 tile-geometry pass in `index.html` (flags, side-tile layout, center spacing).
2. Extract `T[]` to `src/tiles.ts` with rents/groups.
3. Implement stepwise movement + pass-START pay.
