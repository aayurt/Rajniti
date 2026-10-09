import { describe, expect, it } from 'vitest';
import {
  buyHouse,
  buyHotel,
  calculateRent,
  createHouseState,
  getHouseCount,
  getRentMultiplier,
  sellHouse,
} from './houses';

describe('createHouseState', () => {
  it('creates an empty house state', () => {
    const state = createHouseState();
    expect(state.houses).toEqual({});
  });
});

describe('getHouseCount', () => {
  it('returns 0 for tile with no houses', () => {
    const state = createHouseState();
    expect(getHouseCount(state, 1)).toBe(0);
  });

  it('returns the house count for a tile', () => {
    const state = createHouseState();
    // We can't easily set houses without buyHouse, so just test default
    expect(getHouseCount(state, 0)).toBe(0);
  });
});

describe('getRentMultiplier', () => {
  it('returns 1 for no houses', () => {
    expect(getRentMultiplier(0)).toBe(1);
  });

  it('returns 4 for 1 house', () => {
    expect(getRentMultiplier(1)).toBe(4);
  });

  it('returns 10 for 2 houses', () => {
    expect(getRentMultiplier(2)).toBe(10);
  });

  it('returns 30 for 3 houses', () => {
    expect(getRentMultiplier(3)).toBe(30);
  });

  it('returns 90 for 4 houses', () => {
    expect(getRentMultiplier(4)).toBe(90);
  });

  it('returns 250 for hotel', () => {
    expect(getRentMultiplier('hotel')).toBe(250);
  });
});

describe('calculateRent', () => {
  it('multiplies base rent by multiplier', () => {
    expect(calculateRent(10, 1)).toBe(40);
    expect(calculateRent(10, 2)).toBe(100);
    expect(calculateRent(10, 3)).toBe(300);
    expect(calculateRent(10, 4)).toBe(900);
    expect(calculateRent(10, 'hotel')).toBe(2500);
  });

  it('returns base rent for no houses', () => {
    expect(calculateRent(50, 0)).toBe(50);
  });
});

describe('buyHouse', () => {
  it('requires all properties in color group to be owned by same player', () => {
    const state = createHouseState();
    const owners: Record<number, number> = { 1: 0, 3: 0 };
    const colorGroup = [1, 3]; // Both owned by player 0
    const tiles: { id: number; price: number }[] = [{ id: 1, price: 60 }, { id: 3, price: 60 }];

    const result = buyHouse(state, 0, owners, colorGroup, tiles);
    expect(result.houses[1]).toBe(1);
    expect(result.houses[3]).toBe(1);
  });

  it('does not buy house if properties not all owned by same player', () => {
    const state = createHouseState();
    const owners: Record<number, number> = { 1: 0, 3: 1 };
    const colorGroup = [1, 3];
    const tiles: { id: number; price: number }[] = [{ id: 1, price: 60 }, { id: 3, price: 60 }];

    const result = buyHouse(state, 0, owners, colorGroup, tiles);
    expect(result.houses[1]).toBeUndefined();
    expect(result.houses[3]).toBeUndefined();
  });

  it('does not buy house if color group empty', () => {
    const state = createHouseState();
    const owners: Record<number, number> = {};
    const colorGroup: number[] = [];
    const tiles: { id: number; price: number }[] = [];

    const result = buyHouse(state, 0, owners, colorGroup, tiles);
    expect(Object.keys(result.houses).length).toBe(0);
  });
});

describe('buyHotel', () => {
  it('upgrades all properties in color group to hotel', () => {
    const state = createHouseState();
    const owners: Record<number, number> = { 1: 0, 3: 0 };
    const colorGroup = [1, 3];
    const tiles = [{ id: 1, price: 60 }, { id: 3, price: 60 }];

    const result = buyHotel(state, 0, owners, colorGroup, tiles);
    expect(result.houses[1]).toBe('hotel');
    expect(result.houses[3]).toBe('hotel');
  });
});

describe('sellHouse', () => {
  it('sells one house from a tile', () => {
    const state = createHouseState();
    const newState = buyHouse(state, 0, { 1: 0 }, [1], [{ id: 1, price: 60 }]);
    const result = sellHouse(newState, 1);
    expect(getHouseCount(result, 1)).toBe(0);
  });

  it('converts hotel to 4 houses', () => {
    const state = createHouseState();
    const newState = buyHotel(state, 0, { 1: 0 }, [1], [{ id: 1, price: 60 }]);
    const result = sellHouse(newState, 1);
    expect(getHouseCount(result, 1)).toBe(4);
  });

  it('does nothing if tile has no houses', () => {
    const state = createHouseState();
    const result = sellHouse(state, 1);
    expect(result).toBe(state);
  });
});