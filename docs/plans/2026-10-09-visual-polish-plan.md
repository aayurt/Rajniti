# Rajniti UI/UX Visual Polish Implementation Plan

> **For Hermes:** Execute this plan task-by-task. Maintain 100% Vitest pass rate and keep `npm run build` green.

**Goal:** Transform the current cluttered and clipped Rajniti UI into a pixel-accurate match of the RichUp.io dark theme reference (`images/game/` and `images/settings/`).

**Architecture:** Maintain strict separation between UI rendering and game engine. Pure CSS grid layout with responsive square board constraints, corrected CSS writing modes for board perimeter tiles, unified badge alignment, and proportional center stage components.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, Vitest, Vite 7.

---

## Root Cause Analysis

1. **Center Stage Grid Bounds Bug (`Board.tsx:133`):**
   - Current: `gridArea: '2 / 2 / 12 / 12'`.
   - In an 11×11 CSS grid, line 12 is the outer boundary of the 11th track. Spanning to line 12 draws the center stage directly over the entire bottom row and right column of tiles.
   - Fix: Set `gridArea: '2 / 2 / 11 / 11'`.

2. **Aspect Ratio Distortion:**
   - The board stretches across whatever width is available in the center column, turning into a wide horizontal rectangle that vertically squashes tiles on standard screens.
   - Fix: Apply `aspect-square`, `max-h-[calc(100dvh-24px)]`, and `mx-auto` so the board stays a perfect square.

3. **Text Fragmentation & Overlap on Side Tiles:**
   - `writing-mode: horizontal-tb` was forced in `src/index.css` on side tiles, attempting to cram 12+ letter city names into ~50px width.
   - Fix: Restore `writing-mode: vertical-rl` with symmetrical mirroring: prices on the outer perimeter, color bars and names in the center, flag badges on the inner perimeter.

4. **Conflicting Tile Direction Classes (`Board.tsx:15`):**
   - `${isTop || (t.id >= 20 && t.id <= 30) ? 'top-tile bottom-tile' : ''}` applied both classes simultaneously to all top and bottom tiles, breaking flag positioning.
   - Fix: Mutually exclusive classes (`top-tile`, `bottom-tile`, `side-tile left`, `side-tile right`, `corner-tile`).

5. **Oversized Center Stage Elements:**
   - 92px dice and an unconstrained event log overflow the center stage and crowd the board.
   - Fix: Scale dice to 68px, wrap the game log in a dedicated scroll container with maximum height.

6. **Redundant Adblock UI:**
   - Two competing adblock elements (inline card + floating toast) cause layout collision in the left panel.
   - Fix: Clean single-notice placement matching reference.

---

## Tasks

### Phase 1: Board Geometry & Grid Bounds

#### Task 1: Fix Center Stage Grid Area Line Overlap
- **Files to modify:** `src/components/Board.tsx:133`
- **Objective:** Change center stage `gridArea` from `'2 / 2 / 12 / 12'` to `'2 / 2 / 11 / 11'` so it no longer overlaps bottom and right tiles.
- **Verification:** Run Vitest (`npx vitest run src/components/Board.test.tsx`), check DOM in browser to ensure all 40 tiles have unobstructed borders.

#### Task 2: Lock Board to Responsive Square Aspect Ratio
- **Files to modify:** `src/components/Board.tsx:114`, `src/App.tsx:21-27`
- **Objective:** Constrain the board container with `aspect-square w-full max-h-[calc(100dvh-24px)] max-w-[calc(100dvh-24px)] mx-auto flex flex-col justify-center`.
- **Verification:** Resize browser from 1280px to 1920px width; verify board remains a perfect square without horizontal or vertical stretching.

#### Task 3: Disambiguate Tile Side Classes
- **Files to modify:** `src/components/Board.tsx:7-25`, `src/data/tiles.ts`
- **Objective:** Replace buggy `top-tile bottom-tile` logic with clean classification:
  - IDs 0, 10, 20, 30: `corner-tile`
  - IDs 1-9: `top-tile`
  - IDs 11-19: `side-tile right`
  - IDs 21-29: `bottom-tile`
  - IDs 31-39: `side-tile left`
- **Verification:** Run `npx vitest run src/components/Board.test.tsx`.

---

### Phase 2: Tile Typography, Mirroring & Badge Layout

#### Task 4: Restore Vertical Text & Symmetrical Mirroring for Side Tiles
- **Files to modify:** `src/index.css:93-116`, `src/components/Board.tsx`
- **Objective:**
  - Left column (tiles 31–39): Price on outer left, vertical property name in middle (`writing-mode: vertical-rl; transform: rotate(180deg)`), flag badge on inner right.
  - Right column (tiles 11–19): Flag badge on inner left, vertical property name in middle (`writing-mode: vertical-rl; transform: rotate(0deg)`), price on outer right.
  - Set `white-space: nowrap`, `text-overflow: ellipsis` to completely eliminate word breaking.
- **Verification:** Visual check in browser; ensure names like "San Francisco", "Manchester", "Frankfurt", "Berlin" are clean and legible.

#### Task 5: Top & Bottom Tile Alignment
- **Files to modify:** `src/index.css:44-92`, `src/components/Board.tsx`
- **Objective:**
  - Top edge (tiles 1–9): Color bar at top (outer), property name & price in center, flag badge overlapping inner bottom edge facing center.
  - Bottom edge (tiles 21–29): Color bar at bottom (outer), property name & price in center, flag badge overlapping inner top edge facing center.
- **Verification:** Flags must float neatly along the inside track perimeter without obscuring text.

#### Task 6: Corner Tiles Polish
- **Files to modify:** `src/components/Board.tsx`, `src/index.css`
- **Objective:**
  - START: Green badge, double arrow, clean token stacking container.
  - In Prison: Diagonal partition / jail bar icon with clear "Passing by" subtitle.
  - Vacation: Palm island icon with clean label.
  - Go to Prison: White skull icon with legible label.
- **Verification:** Corners must render with uniform square dimensions and distinct visual cues.

---

### Phase 3: Center Stage Sizing & Event Feed

#### Task 7: Rescale Dice to Proportional Size
- **Files to modify:** `src/components/Dice.tsx`, `src/index.css:180-213`
- **Objective:** Reduce dice size from 92px to 68px (`w-[68px] h-[68px] rounded-[16px]`), resize pips to 10px, preserve 3D shadow and tilt.
- **Verification:** Dice fit gracefully above the turn pill without pushing action buttons down.

#### Task 8: Restyle Turn Status & Action Buttons
- **Files to modify:** `src/components/Board.tsx:146-200`
- **Objective:**
  - Turn pill: Player avatar blob + name + "is playing..." + digital timer (`00:59`).
  - "Roll the dice" button: High-contrast neon lime (`#7dff5e`), rounded-xl, bold font.
  - Buy/Skip card: Clean floating card with property color accent and price pill.
- **Verification:** Action buttons are distinct, accessible, and do not displace board elements.

#### Task 9: Clean Event Log Feed
- **Files to modify:** `src/components/Board.tsx:202-208`
- **Objective:**
  - Limit event log to a clean, scrollable container with subtle backdrop.
  - Highlight player names in bold white, system messages in muted purple-gray.
  - Auto-scroll to latest event.
- **Verification:** Run a simulated 5-turn game; verify log reads cleanly without text collision.

---

### Phase 4: Left & Right Panels Alignment

#### Task 10: De-duplicate Adblock Notice
- **Files to modify:** `src/components/LeftPanel.tsx`, `src/components/LeftPanel.test.tsx`
- **Objective:** Remove the duplicate bottom-left floating toast; maintain the clean dashed inline notice above chat matching RichUp.io screenshot.
- **Verification:** `npx vitest run src/components/LeftPanel.test.tsx` passes; left column is no longer overcrowded.

#### Task 11: Right Panel Player Roster & Bankrupt Button
- **Files to modify:** `src/components/RightPanel.tsx`
- **Objective:**
  - Move "Bankrupt" button directly beneath the player roster.
  - Host row shows gold crown icon; active player has subtle accent glow/indicator.
  - Cash amounts aligned cleanly on the right.
- **Verification:** Visual comparison against `images/game/Screenshot 2026-10-06 at 20.26.30.png`.

#### Task 12: Trades and Properties Cards Polish
- **Files to modify:** `src/components/RightPanel.tsx`
- **Objective:** Ensure "+ Create" trade button is neatly placed, dismissible trade hint matches design, and "My properties" deed cards list cleanly.
- **Verification:** Check empty and populated states.

---

### Phase 5: Lobby Screen & Responsive Pass

#### Task 13: Lobby Screen Centering
- **Files to modify:** `src/components/Lobby.tsx`
- **Objective:** Ensure "Select your player appearance" modal is centered over the blurred square board without distortion, and right-hand settings list scrolls smoothly.
- **Verification:** `npx vitest run src/components/Lobby.test.tsx` passes; verify visual match with `images/settings/` screenshots.

#### Task 14: Mobile Responsive Shell Validation
- **Files to modify:** `src/App.tsx`
- **Objective:** Verify mobile tab navigation (Board | Players | Chat) operates cleanly under `< lg` breakpoints.
- **Verification:** Test at 390px (mobile) and 1440px (desktop) in browser. All 106 existing tests stay green.
