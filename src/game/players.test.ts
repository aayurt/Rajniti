import { describe, it, expect } from 'vitest';
import { createPlayer, isPlayerOut, playerCash, playerPos, playerName } from './players';

describe('createPlayer', () => {
  it('creates a player with default position 0 and not out', () => {
    const p = createPlayer('Alice', 1500);
    expect(p).toMatchObject({ name: 'Alice', cash: 1500, pos: 0, out: false });
  });

  it('accepts custom cash amount', () => {
    const p = createPlayer('Bob', 1000);
    expect(p.cash).toBe(1000);
  });
});

describe('isPlayerOut', () => {
  it('returns false for a new player', () => {
    const p = createPlayer('Alice', 1500);
    expect(isPlayerOut(p)).toBe(false);
  });

  it('returns true for an out player', () => {
    const p = createPlayer('Alice', 1500);
    p.out = true;
    expect(isPlayerOut(p)).toBe(true);
  });
});

describe('playerCash', () => {
  it('returns the player cash', () => {
    const p = createPlayer('Alice', 1500);
    expect(playerCash(p)).toBe(1500);
  });
});

describe('playerPos', () => {
  it('returns the player position', () => {
    const p = createPlayer('Alice', 1500);
    expect(playerPos(p)).toBe(0);
  });
});

describe('playerName', () => {
  it('returns the player name', () => {
    const p = createPlayer('Alice', 1500);
    expect(playerName(p)).toBe('Alice');
  });
});