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

  it('matches all 40 tiles order, names and prices exactly against ground truth', () => {
    const expected = [
      { name: 'START' },
      { name: 'Salvador', price: 60 },
      { name: 'Treasure' },
      { name: 'Rio', price: 60 },
      { name: 'Earnings Tax' }, // prompt specifies sub %10, no price
      { name: 'TLV Airport', price: 200 },
      { name: 'Tel Aviv', price: 100 },
      { name: 'Haifa', price: 110 },
      { name: 'Surprise' },
      { name: 'Jerusalem', price: 120 },
      { name: 'In Prison' }, // Prompt mentioned 'Passing by/In Prison'
      { name: 'Venice', price: 130 },
      { name: 'Power Company', price: 150 },
      { name: 'Milan', price: 140 },
      { name: 'Rome', price: 160 },
      { name: 'MUC Airport', price: 200 },
      { name: 'Frankfurt', price: 180 },
      { name: 'Treasure' },
      { name: 'Munich', price: 190 },
      { name: 'Berlin', price: 200 },
      { name: 'Vacation' },
      { name: 'Shenzhen', price: 210 },
      { name: 'Surprise' },
      { name: 'Beijing', price: 220 },
      { name: 'Shanghai', price: 240 },
      { name: 'CDG Airport', price: 200 },
      { name: 'Lyon', price: 260 },
      { name: 'Water Company', price: 150 },
      { name: 'Toulouse', price: 270 },
      { name: 'Paris', price: 280 },
      { name: 'Go to prison' },
      { name: 'Liverpool', price: 290 },
      { name: 'Manchester', price: 300 },
      { name: 'Treasure' },
      { name: 'London', price: 320 },
      { name: 'JFK Airport', price: 200 },
      { name: 'Surprise' },
      { name: 'San Francisco', price: 360 },
      { name: 'Premium Tax', price: 75 },
      { name: 'New York', price: 400 },
    ];
    for (let i = 0; i < 40; i++) {
      expect(TILES[i].name).toBe(expected[i].name);
      if (expected[i].price !== undefined) {
        expect(TILES[i].price).toBe(expected[i].price);
      }
    }
  });
});
