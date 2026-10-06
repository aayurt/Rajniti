import { describe, expect, it } from 'vitest';
import type { Tile } from '../data/tiles';
import {
  advanceTurn,
  applyMove,
  applyRent,
  buyTile,
  createGame,
  eliminateIfBankrupt,
  rentFor,
} from './engine';

describe('createGame', () => {
  it('places players at pos 0 with startingCash and current index 0', () => {
    const s = createGame(['A', 'B'], 1500);
    expect(s.players).toHaveLength(2);
    expect(s.players[0]).toMatchObject({ name: 'A', pos: 0, cash: 1500 });
    expect(s.players[1]).toMatchObject({ name: 'B', pos: 0, cash: 1500 });
    expect(s.current).toBe(0);
  });

  it('starts with no owners', () => {
    const s = createGame(['A', 'B'], 1500);
    expect(Object.keys(s.owners)).toHaveLength(0);
  });

  it('marks players as not out initially', () => {
    const s = createGame(['A'], 1500);
    expect(s.players[0].out).toBe(false);
  });
});

describe('applyMove', () => {
  it('moves the current player forward without passing START', () => {
    const s = createGame(['A', 'B'], 1500);
    const events = applyMove(s, 5);
    expect(s.players[0].pos).toBe(5);
    expect(s.players[0].cash).toBe(1500);
    expect(events.length).toBeGreaterThan(0);
  });

  it('wraps around the 40-tile board and grants +$200 for passing START', () => {
    const s = createGame(['A', 'B'], 1500);
    s.players[0].pos = 38;
    const events = applyMove(s, 5);
    expect(s.players[0].pos).toBe(3);
    expect(s.players[0].cash).toBe(1700);
    expect(events.some((e) => /start/i.test(e.message ?? e.type))).toBe(true);
  });

  it('does not move other players', () => {
    const s = createGame(['A', 'B'], 1500);
    applyMove(s, 6);
    expect(s.players[1].pos).toBe(0);
  });
});

describe('rentFor', () => {
  it('is 20% of tile price rounded', () => {
    const tile = { id: 1, name: 'X', kind: 'property', price: 100 } as Tile;
    expect(rentFor(tile)).toBe(20);
  });

  it('rounds the 20% value', () => {
    const tile = { id: 7, name: 'X', kind: 'property', price: 110 } as Tile;
    expect(rentFor(tile)).toBe(22);
  });

  it('has a $10 minimum', () => {
    const tile = { id: 1, name: 'X', kind: 'property', price: 30 } as Tile;
    expect(rentFor(tile)).toBe(10);
  });

  it('returns 0 for tiles with no price', () => {
    const tile = { id: 0, name: 'START', kind: 'start' } as Tile;
    expect(rentFor(tile)).toBe(0);
  });
});

describe('buyTile', () => {
  it('deducts price and records owner on success', () => {
    const s = createGame(['A', 'B'], 1500);
    const events = buyTile(s, 1); // Salvador, price 60
    expect(s.owners[1]).toBe(0);
    expect(s.players[0].cash).toBe(1440);
    expect(events.some((e) => e.type === 'error')).toBe(false);
  });

  it('fails cleanly when already owned (no state change + error event)', () => {
    const s = createGame(['A', 'B'], 1500);
    buyTile(s, 1);
    const cashBefore = s.players[1].cash;
    s.current = 1;
    const events = buyTile(s, 1);
    expect(events.some((e) => e.type === 'error')).toBe(true);
    expect(s.owners[1]).toBe(0);
    expect(s.players[1].cash).toBe(cashBefore);
  });

  it('fails cleanly when unaffordable (no state change + error event)', () => {
    const s = createGame(['A', 'B'], 50);
    const events = buyTile(s, 1);
    expect(events.some((e) => e.type === 'error')).toBe(true);
    expect(s.owners[1]).toBeUndefined();
    expect(s.players[0].cash).toBe(50);
  });

  it('fails cleanly for non-buyable tiles (no state change + error event)', () => {
    const s = createGame(['A', 'B'], 1500);
    const events = buyTile(s, 0); // START
    expect(events.some((e) => e.type === 'error')).toBe(true);
    expect(s.owners[0]).toBeUndefined();
    expect(s.players[0].cash).toBe(1500);
  });
});

describe('applyRent', () => {
  it('tenant pays rentFor to owner', () => {
    const s = createGame(['A', 'B'], 1500);
    buyTile(s, 1); // A buys for 60 -> 1440
    s.current = 1;
    s.players[1].pos = 1;
    const events = applyRent(s, 1);
    // rent = 20% of 60 = 12
    expect(s.players[1].cash).toBe(1500 - 12);
    expect(s.players[0].cash).toBe(1440 + 12);
    expect(events.length).toBeGreaterThan(0);
  });

  it('skips payment when tile is unowned', () => {
    const s = createGame(['A', 'B'], 1500);
    s.current = 1;
    const events = applyRent(s, 3);
    expect(s.players[0].cash).toBe(1500);
    expect(s.players[1].cash).toBe(1500);
    expect(events).toHaveLength(0);
  });

  it('skips payment when tenant is the owner', () => {
    const s = createGame(['A', 'B'], 1500);
    buyTile(s, 1);
    const cashBefore = s.players[0].cash;
    const events = applyRent(s, 1);
    expect(s.players[0].cash).toBe(cashBefore);
    expect(events).toHaveLength(0);
  });
});

describe('eliminateIfBankrupt', () => {
  it('flags player out when cash < 0', () => {
    const s = createGame(['A', 'B'], 1500);
    s.players[0].cash = -1;
    eliminateIfBankrupt(s, 0);
    expect(s.players[0].out).toBe(true);
  });

  it('keeps player in when cash is zero or positive', () => {
    const s = createGame(['A', 'B'], 1500);
    s.players[0].cash = 0;
    eliminateIfBankrupt(s, 0);
    expect(s.players[0].out).toBe(false);
  });

  it('releases all owned tiles and emits release events when bankrupt', () => {
    const s = createGame(['A', 'B'], 1500);
    s.owners[1] = 0; // A owns 1
    s.owners[3] = 0; // A owns 3
    s.owners[5] = 1; // B owns 5

    s.players[0].cash = -1;
    const events = eliminateIfBankrupt(s, 0);

    expect(s.players[0].out).toBe(true);
    expect(s.owners[1]).toBeUndefined();
    expect(s.owners[3]).toBeUndefined();
    expect(s.owners[5]).toBe(1); // B's ownership untouched

    // Check events
    const releaseEvents = events.filter(e => e.type === 'release');
    expect(releaseEvents).toHaveLength(2);
    expect(releaseEvents.some(e => e.tileId === 1)).toBe(true);
    expect(releaseEvents.some(e => e.tileId === 3)).toBe(true);

    // Ensure applyRent charges nothing on released tiles
    s.current = 1; // B's turn
    s.players[1].pos = 1;
    const rentEvents = applyRent(s, 1);
    expect(rentEvents).toHaveLength(0);
    expect(s.players[1].cash).toBe(1500);
  });
});

describe('advanceTurn', () => {
  it('moves current to the next player', () => {
    const s = createGame(['A', 'B'], 1500);
    advanceTurn(s);
    expect(s.current).toBe(1);
  });

  it('wraps around to the first player', () => {
    const s = createGame(['A', 'B'], 1500);
    s.current = 1;
    advanceTurn(s);
    expect(s.current).toBe(0);
  });

  it('skips players who are out', () => {
    const s = createGame(['A', 'B', 'C'], 1500);
    s.players[1].out = true;
    advanceTurn(s);
    expect(s.current).toBe(2);
  });
});
