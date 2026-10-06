# Rajniti

A RichUp.io-style multiplayer Monopoly game — Nepali politics edition. Buy cities, airports, and utilities, dodge taxes and jail, trade your way to power.

> Design locked to the RichUp.io dark 3-column game-room UI. See `PLAN.md` for the full build plan.

## Quick start

No build step (single-file demo):

```bash
open index.html
# or serve locally:
npx serve .
```

## What exists now

- `index.html` — playable local demo: 40-tile perimeter board (11×11 grid), 3D dice, game log, Surprise/Treasure cards, player list, trades box, chat
- `PLAN.md` — overall plan: design lock, phases P0–P5, data model, acceptance criteria
- `sketches/` — early UI explorations (not the design direction)
- `images/` — reference screenshots

## Controls (demo)

- **ROLL DICE** — roll, auto-move current player token, log the result
- **Click a tile** — select it, then **Buy** / **Trade**
- **Chat** — type in the left panel input and hit Enter

## Roadmap

1. P1 pixel-perfect static pass (flags, side tiles, center stage)
2. P2 board engine (rents, step movement, pass-START pay, bankruptcy)
3. P3 turns/cards/jail/tax (doubles, decks, jail, airport/utility scaling)
4. P4 players/trades/chat (trade modal, presence, room settings, WS-ready events)
5. P5 polish (animations, sound, responsive, a11y)

## Contributing

Every UI change must match the RichUp.io screenshot baseline. Keep `index.html` working at every phase.

## License

MIT
