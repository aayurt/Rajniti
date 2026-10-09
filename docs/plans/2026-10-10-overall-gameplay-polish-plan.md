# Rajniti — Comprehensive Feature & Polish Implementation Plan

> **For Hermes:** Use `subagent-driven-development` and `test-driven-development` skills to implement this plan task-by-task. Every task follows strict TDD: failing test -> minimal implementation -> passing verification -> commit.

**Goal:** Elevate Rajniti to a feature-complete, rich audiovisual Monopoly web/mobile game with customizable sound packages (Classic, Funny, Game of Thrones), step-by-step token and dice animations, SVG character skins (Fire, One Piece, etc.) in an appearance store, clean atomic UI components, full official gameplay rules (houses/hotels, auctions, mortgages, doubles), and smart AI bot players.

**Architecture:**
- **Pure Rules & Bot Engine (`src/game/`):** Pure functional TypeScript modules with zero React/DOM dependencies for deterministic testing, AI bots, and future multiplayer synchronization.
- **Audio Synthesizer & Soundpacks (`src/audio/`):** Web Audio API hybrid engine with synthesized tone fallbacks (Vitest/headless-friendly, zero external asset blocking) plus package asset profiles (Classic, Funny, Game of Thrones).
- **Presentation & Components (`src/components/ui/`, `src/components/appearance/`, `src/components/animations/`):** Reusable design system primitives following RichUp tokens and Tailwind CSS.

---

## Phase Breakdown Overview

| Phase | Domain | Core Deliverables | Testing Focus |
|---|---|---|---|
| **Phase 1** | Sound Package Selector | Audio engine, sound packs (Classic, Funny, GoT), SoundSelector UI | Mock Web Audio API, sound pack mapping |
| **Phase 2** | Game Animations | Step-by-step token hop, 3D dice roll tumble, cash float tags, tile pulse | RAF ticker hooks, timer mocks, CSS transitions |
| **Phase 3** | SVG Appearances | SVG character tokens (Fire, One Piece, Cyber), Appearance modal | Character SVG renderer, skin selection persistence |
| **Phase 4** | Clean Reusable Components | Atomic UI primitives (Modal, Button, Badge, Tabs, Toast, Avatar) | Component testing-library accessibility & states |
| **Phase 5** | Complete Gameplay Rules | Houses/hotels, auctions, mortgages, 3x doubles jail, bankruptcy liquidation | Pure unit tests on game state transitions |
| **Phase 6** | Players & AI Bots | Player manager, slot assignments, 3 bot strategies (Aggressive, Cautious, Trader) | Bot decision trees, automated full-game simulations |

---

## Detailed Task Breakdown

### Phase 1: Sound Package Selector

#### Task 1.1: Audio Engine & Sound Pack Registry
**Files:**
- Create: `src/audio/types.ts`
- Create: `src/audio/soundEngine.ts`
- Create: `src/audio/packs.ts`
- Test: `src/audio/soundEngine.test.ts`

**TDD Steps:**
1. Write failing tests verifying sound event triggers (`rollDice`, `moveStep`, `buyProperty`, `payRent`, `jail`, `win`, `bankrupt`), volume controls, mute state, and pack switching (`classic`, `funny`, `got`).
2. Run Vitest (`npx vitest run src/audio/soundEngine.test.ts`) -> FAIL.
3. Implement `soundEngine.ts` using Web Audio API synthesis frequencies/waveforms + sample audio triggers so it works immediately without broken remote URL loads.
4. Run tests -> PASS.
5. Commit: `feat(audio): create sound engine and sound pack registry with web audio synth`

#### Task 1.2: Sound Package Assets & Themes (Classic, Funny, Game of Thrones)
**Files:**
- Create: `src/audio/packs/classic.ts`
- Create: `src/audio/packs/funny.ts`
- Create: `src/audio/packs/got.ts`
- Modify: `src/audio/packs.ts`
- Test: `src/audio/packs.test.ts`

**TDD Steps:**
1. Write failing tests checking each sound pack has all mandatory cues (rolling, coin, boing/fanfare, jail door/dungeon, horn).
2. Implement acoustic profiles:
   - `Classic`: Casino dice clatter, retro register chime, wooden thud.
   - `Funny`: Cartoon spring boing, slide whistle, quack, comedic trumpet.
   - `Game of Thrones`: Medieval war horn, sword clash, coronation fanfare, dragon roar rumble.
3. Run tests -> PASS.
4. Commit: `feat(audio): implement sound profiles for classic, funny, and game of thrones`

#### Task 1.3: Sound Package Selector Component & Settings Integration
**Files:**
- Create: `src/components/audio/SoundSelector.tsx`
- Modify: `src/game/store.tsx` (add `soundPack`, `soundEnabled`, `soundVolume` state + actions)
- Modify: `src/components/Lobby.tsx` & `src/components/panels/LeftPanel.tsx`
- Test: `src/components/audio/SoundSelector.test.tsx`

**TDD Steps:**
1. Test rendering sound pack selector dropdown, preview test buttons (plays sample on click), mute toggle, and persistence in `localStorage`.
2. Implement `SoundSelector` component and wire into `store.tsx`.
3. Run Vitest -> PASS.
4. Commit: `feat(audio): add SoundSelector UI and wire to game store`

---

### Phase 2: Game Animations

#### Task 2.1: Step-by-Step Token Hop & Movement Interpolator
**Files:**
- Create: `src/game/movement.ts`
- Create: `src/components/animations/useTokenMovement.ts`
- Modify: `src/components/Board.tsx`
- Test: `src/game/movement.test.ts`
- Test: `src/components/animations/useTokenMovement.test.ts`

**TDD Steps:**
1. Write failing test for path calculator: given start pos 38 and roll 5, generates array of intermediate step positions `[39, 0, 1, 2, 3]` and detects pass-START boundary.
2. Implement step sequencer with configurable delay (e.g., 120ms per tile hop) and hop sound trigger.
3. Test hook with fake timers (`vi.useFakeTimers()`).
4. Run tests -> PASS.
5. Commit: `feat(anim): add step-by-step token path sequencer and hop animation hook`

#### Task 2.2: 3D Dice Roll Animation & Tumble Effect
**Files:**
- Modify: `src/components/Dice.tsx`
- Modify: `src/index.css` (add 3D dice tumble keyframes)
- Test: `src/components/Dice.test.tsx`

**TDD Steps:**
1. Write failing tests verifying rolling state: dice faces randomize during roll, rolling state disables double-clicks, settles on target numbers after 600ms.
2. Implement CSS 3D cube / tumbling animation with realistic shadow bounce.
3. Run tests -> PASS.
4. Commit: `feat(anim): implement 3d rolling dice physics and shake animations`

#### Task 2.3: Cash Floating Tags & Tile Landing Impacts
**Files:**
- Create: `src/components/animations/FloatingCash.tsx`
- Create: `src/components/animations/TilePulse.tsx`
- Modify: `src/components/richtile/RichTile.tsx`
- Test: `src/components/animations/FloatingCash.test.tsx`

**TDD Steps:**
1. Test floating tag rendering: `+$200` green text ascends and fades out; `-$75` red text descends.
2. Implement CSS animated overlay components.
3. Run tests -> PASS.
4. Commit: `feat(anim): add floating cash alerts and tile landing glow effects`

---

### Phase 3: More Appearances & SVG Tokens

#### Task 3.1: SVG Appearance Skin Registry
**Files:**
- Create: `src/components/appearance/skins.ts`
- Create: `src/components/appearance/types.ts`
- Test: `src/components/appearance/skins.test.ts`

**TDD Steps:**
1. Test skin definition registry: contains `default` (eyes), `fire` (flame), `one-piece` (Luffy straw hat / Jolly Roger), `cyberpunk` (visor), `royal` (golden crown), `dragon` (mythic serpent).
2. Implement SVG definitions with clean vector paths, scalable `viewBox="0 0 32 32"`, and currentColor styling.
3. Run tests -> PASS.
4. Commit: `feat(appearance): create SVG skin registry for fire, one-piece, and special tokens`

#### Task 3.2: Extend Character Component to Render SVG Skins
**Files:**
- Modify: `src/components/richtile/Character.tsx`
- Modify: `src/components/richtile/Character.test.tsx`

**TDD Steps:**
1. Write tests verifying `<Character skin="fire" color="#ff4400" />` renders flame SVG, and `<Character skin="one-piece" />` renders Straw Hat SVG, maintaining rotation props.
2. Implement skin prop resolution in `Character.tsx`.
3. Run tests -> PASS.
4. Commit: `feat(character): support custom SVG skins in Character token renderer`

#### Task 3.3: "Get More Appearances" Modal
**Files:**
- Create: `src/components/appearance/AppearanceModal.tsx`
- Modify: `src/components/Lobby.tsx`
- Modify: `src/game/store.tsx` (add `skin` to player state)
- Test: `src/components/appearance/AppearanceModal.test.tsx`

**TDD Steps:**
1. Test modal behavior: clicking "🛒 Get more appearances" in Lobby opens the modal, displays skin cards with live previews, selecting a skin updates store & persists to `localStorage`.
2. Implement `AppearanceModal` with tabs (Basic Colors, Anime/Pop, Elemental, Mythic).
3. Run tests -> PASS.
4. Commit: `feat(lobby): implement Get More Appearances modal and skin selector`

---

### Phase 4: Clean Reusable UI Components

#### Task 4.1: Atomic Primitives: Modal, Dialog, and Backdrop
**Files:**
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Backdrop.tsx`
- Test: `src/components/ui/Modal.test.tsx`

**TDD Steps:**
1. Test Modal keyboard dismiss (ESC key), backdrop click close, focus trapping, header/body/footer slots.
2. Implement accessible, headless-styled Modal using RichUp tokens (`bg-panel`, `border-edge`, `rounded-xl`).
3. Run tests -> PASS.
4. Commit: `feat(ui): create reusable Modal and Backdrop components`

#### Task 4.2: Button, Badge, and Tab Group Primitives
**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Tabs.tsx`
- Test: `src/components/ui/Button.test.tsx`
- Test: `src/components/ui/Tabs.test.tsx`

**TDD Steps:**
1. Test Button variants (`primary`, `secondary`, `danger`, `ghost`), loading spinner state, disabled state.
2. Test Tabs active tab indicator and keyboard arrow navigation.
3. Implement components with Tailwind tokens.
4. Run tests -> PASS.
5. Commit: `feat(ui): create Button, Badge, and Tabs atomic components`

#### Task 4.3: Refactor Existing Modals and Panels to Use UI Primitives
**Files:**
- Modify: `src/components/TradeModal.tsx`
- Modify: `src/components/panels/LeftPanel.tsx`
- Modify: `src/components/panels/RightPanel.tsx`
- Test: `src/components/TradeModal.test.ts`
- Test: `src/components/panels/RightPanel.test.tsx`

**TDD Steps:**
1. Verify existing modal test suites pass before and after refactoring.
2. Replace bespoke divs/buttons with `<Modal>`, `<Button>`, `<Tabs>`.
3. Run tests -> PASS.
4. Commit: `refactor(components): standardize panels and modals with shared UI primitives`

---

### Phase 5: Complete Gameplay Rules

#### Task 5.1: Color Groups, Monopolies, and House/Hotel Construction
**Files:**
- Create: `src/game/houses.ts`
- Modify: `src/data/tiles.ts` (add house cost and progressive rent tiers)
- Test: `src/game/houses.test.ts`

**TDD Steps:**
1. Test monopoly detection (player owns all tiles of a group: USA 2/2, Germany 3/3, etc.).
2. Test even-building rule (cannot build house 2 on one tile until all tiles in group have 1 house).
3. Test maximum 4 houses + 1 hotel per property.
4. Test progressive rent calculation based on house count.
5. Implement pure functional `houses.ts`.
6. Run tests -> PASS.
7. Commit: `feat(rules): implement monopoly detection and even-building house/hotel rules`

#### Task 5.2: Mortgage and Unmortgage Mechanics
**Files:**
- Create: `src/game/mortgage.ts`
- Test: `src/game/mortgage.test.ts`

**TDD Steps:**
1. Test mortgaging: pays 50% of property face value to player; tile marked mortgaged; mortgaged tiles collect $0 rent.
2. Test unmortgaging: costs 55% (face value * 0.5 * 1.10) to lift mortgage.
3. Test restriction: cannot mortgage if buildings exist on any property in the group.
4. Implement pure functions `canMortgage`, `applyMortgage`, `canUnmortgage`, `applyUnmortgage`.
5. Run tests -> PASS.
6. Commit: `feat(rules): implement property mortgage and unmortgage rules`

#### Task 5.3: Property Auctions System
**Files:**
- Create: `src/game/auctions.ts`
- Test: `src/game/auctions.test.ts`

**TDD Steps:**
1. Test auction lifecycle: starting bid ($10), minimum raise ($10), players passing, highest bidder wins property and cash deducted.
2. Test edge cases: all players pass -> property remains unowned.
3. Implement pure auction state machine `createAuction`, `placeBid`, `passBid`.
4. Run tests -> PASS.
5. Commit: `feat(rules): implement property auction bidding state machine`

#### Task 5.4: Speeding Rules (3 Doubles -> Jail) & Full Bankruptcy Liquidation
**Files:**
- Modify: `src/game/engine.ts`
- Modify: `src/game/rules.ts`
- Test: `src/game/engine.test.ts`

**TDD Steps:**
1. Test 3 consecutive doubles in one turn sends player straight to jail (tile 10) and ends turn.
2. Test bankruptcy liquidation: when cash < debt, auto-unmortgage/sell houses calculation; if still bankrupt, all owned assets transfer to creditor (or bank).
3. Implement engine modifications.
4. Run tests -> PASS.
5. Commit: `feat(rules): implement 3-doubles speeding jail and bankruptcy asset liquidation`

---

### Phase 6: Players & AI Bots

#### Task 6.1: Player Slot Configuration & Game Setup
**Files:**
- Create: `src/game/players.ts`
- Modify: `src/game/store.tsx`
- Test: `src/game/players.test.ts`

**TDD Steps:**
1. Test 2-8 player lobby configurations: adding human local player, adding bot player, removing player, assigning turn order.
2. Test player net worth calculation: `cash + sum(property.price) + sum(houses * houseCost) - sum(mortgaged * 0.5 * price)`.
3. Implement player manager.
4. Run tests -> PASS.
5. Commit: `feat(players): implement multi-player slot manager and net worth calculator`

#### Task 6.2: AI Bot Strategies & Decision Trees
**Files:**
- Create: `src/game/bot/strategies.ts`
- Create: `src/game/bot/botEngine.ts`
- Test: `src/game/bot/botEngine.test.ts`

**TDD Steps:**
1. Test 3 bot profiles:
   - **Cautious:** Keeps ≥ $300 cash reserve, only buys low-cost properties or if completes monopoly.
   - **Aggressive:** Buys any unowned tile if cash allows, bids aggressively in auctions, builds houses ASAP.
   - **Trader:** Actively generates trade proposals for missing set pieces.
2. Test decision functions: `shouldBuyTile()`, `shouldBidInAuction()`, `decideTradeOffer()`, `chooseMortgageToSurvive()`.
3. Implement pure bot heuristics.
4. Run tests -> PASS.
5. Commit: `feat(bot): implement AI bot strategies (Cautious, Aggressive, Trader)`

#### Task 6.3: Automated Game Simulation & Stability Suite
**Files:**
- Create: `src/game/simulation.test.ts`
- Test: `src/game/simulation.test.ts`

**TDD Steps:**
1. Write end-to-end automated simulation test: 4 bots play 100 turns without crashes, deadlocks, or negative cash invariants.
2. Verify game correctly terminates with 1 winner and 3 bankruptcies.
3. Run test -> PASS.
4. Commit: `test(simulation): add automated 100-turn bot game simulation stress test`

---

## Verification & Execution Order

1. **Phase 1 (Sounds):** Unit tests pass -> sound selector working in Lobby -> sound cues play on roll/buy.
2. **Phase 2 (Animations):** Vitest passes -> visual verification via browser_exec (token hops tile-by-tile, dice tumble).
3. **Phase 3 (Appearances):** Vitest passes -> Fire & One Piece SVGs render crisply in Lobby and on the board tiles.
4. **Phase 4 (Reusable UI):** Zero regressions on existing panels/modals -> clean atomic component library.
5. **Phase 5 (Rules):** All pure rule tests pass -> houses build evenly, auctions resolve, mortgages work.
6. **Phase 6 (Bots & Players):** 100-turn simulation test runs green with zero errors.
7. Final full suite verification: `npm test` and `npm run build` green.
