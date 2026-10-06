import { describe, expect, it } from 'vitest';
import { TILES, isBuyable, tileArea } from './tiles';

// Characterization tests for the board definition (AGENTS.md: 40 tiles, ids 0-39).
describe('tiles', () => {
  it('has exactly 40 tiles with unique ids 0-39', () => {
    expect(TILES).toHaveLength(40);
    expect(new Set(TILES.map((t) => t.id)).size).toBe(40);
    expect([...TILES.map((t) => t.id)].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 40 }, (_, i) => i),
    );
  });

  it('starts at START and has the four corners', () => {
    expect(TILES[0].kind).toBe('start');
    expect(TILES[10].kind).toBe('prison-pass');
    expect(TILES[20].kind).toBe('vacation');
    expect(TILES[30].kind).toBe('goto-prison');
  });

  it('maps every tile to a valid 11x11 grid area', () => {
    for (const t of TILES) {
      const [rs, cs, re, ce] = tileArea(t.id).split('/').map(Number);
      expect(rs).toBeGreaterThanOrEqual(1);
      expect(re).toBeLessThanOrEqual(12);
      expect(cs).toBeGreaterThanOrEqual(1);
      expect(ce).toBeLessThanOrEqual(12);
      expect(re - rs).toBe(1);
      expect(ce - cs).toBe(1);
    }
  });

  it('marks priced properties/airports/utilities buyable, specials not', () => {
    expect(isBuyable(TILES[1])).toBe(true); // Salvador
    expect(isBuyable(TILES[5])).toBe(true); // TLV Airport
    expect(isBuyable(TILES[12])).toBe(true); // Power Company
    expect(isBuyable(TILES[2])).toBe(false); // Treasure
    expect(isBuyable(TILES[8])).toBe(false); // Surprise
    expect(isBuyable(TILES[4])).toBe(false); // Tax
  });
});
