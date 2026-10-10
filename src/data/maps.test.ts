import { describe, expect, it } from 'vitest';
import { MAPS, MAP_ORDER } from './maps';
import { TILES, isBuyable } from './tiles';

describe('maps', () => {
  it('registers classic + 3 new maps in order', () => {
    expect(MAP_ORDER).toEqual(['classic', 'worldwide', 'deathvalley', 'luckywheel']);
    expect(Object.keys(MAPS).sort()).toEqual([...MAP_ORDER].sort());
  });

  it('gives every map 40 tiles with unique ids 0-39', () => {
    for (const id of MAP_ORDER) {
      const tiles = MAPS[id].tiles;
      expect(tiles).toHaveLength(40);
      expect([...tiles.map((t) => t.id)].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 40 }, (_, i) => i),
      );
    }
  });

  it('keeps corner kinds at 0/10/20/30 on every map', () => {
    for (const id of MAP_ORDER) {
      const byId = Object.fromEntries(MAPS[id].tiles.map((t) => [t.id, t]));
      expect(byId[0].kind).toBe('start');
      expect(byId[10].kind).toBe('prison-pass');
      expect(byId[20].kind).toBe('vacation');
      expect(byId[30].kind).toBe('goto-prison');
    }
  });

  it('keeps classic identical to TILES', () => {
    expect(MAPS.classic.tiles).toEqual(TILES);
  });

  it('gives every map enough buyable tiles and 4+ airports', () => {
    for (const id of MAP_ORDER) {
      const tiles = MAPS[id].tiles;
      expect(tiles.filter(isBuyable).length).toBeGreaterThanOrEqual(20);
      expect(tiles.filter((t) => t.kind === 'airport').length).toBeGreaterThanOrEqual(4);
    }
  });

  it('worldwide has the India/Japan regional tiles', () => {
    const names = MAPS.worldwide.tiles.map((t) => t.name);
    for (const n of ['Mumbai', 'New Delhi', 'Tokyo', 'Yokohama']) expect(names).toContain(n);
  });

  it('deathvalley has Canada/UK/US regions and YYZ+LHR airports', () => {
    const names = MAPS.deathvalley.tiles.map((t) => t.name);
    for (const n of ['Ottawa', 'Quebec City', 'Montreal', 'Vancouver', 'Toronto', 'Glasgow', 'Cambridge', 'YYZ Airport', 'LHR Airport', 'Chicago', 'Seattle', 'Boston', 'Wolfsburg', 'Cologne', 'Hamburg'])
      expect(names).toContain(n);
  });

  it('luckywheel has Turkey/Romania/Ireland tiles plus the Tax Refund tile', () => {
    const tiles = MAPS.luckywheel.tiles;
    const names = tiles.map((t) => t.name);
    for (const n of ['Antalya', 'Istanbul', 'Brasov', 'Bucharest', 'Dublin', 'Belfast', 'Tax Refund'])
      expect(names).toContain(n);
    const refund = tiles.find((t) => t.kind === 'refund');
    expect(refund?.price).toBe(50);
    expect(tiles.filter((t) => t.kind === 'surprise').length).toBeGreaterThanOrEqual(5);
    expect(tiles.filter((t) => t.kind === 'treasure').length).toBeGreaterThanOrEqual(5);
  });
});
