import { describe, expect, it } from 'vitest';
import {
  createMortgageState,
  getMortgageRentMultiplier,
  isMortgaged,
  mortgageProperty,
  toggleMortgage,
  unmortgageProperty,
} from './mortgage';
import type { HouseCount } from './houses';

describe('createMortgageState', () => {
  it('creates an empty mortgage state', () => {
    const state = createMortgageState();
    expect(state.mortgaged).toEqual({});
  });
});

describe('isMortgaged', () => {
  it('returns false for non-mortgaged tile', () => {
    const state = createMortgageState();
    expect(isMortgaged(state, 1)).toBe(false);
  });

  it('returns true for mortgaged tile', () => {
    const state = { mortgaged: { 1: true } };
    expect(isMortgaged(state, 1)).toBe(true);
  });
});

describe('mortgageProperty', () => {
  it('mortgages a property and gives cash = floor(price/2)', () => {
    const state = createMortgageState();
    const { newState, cashGiven } = mortgageProperty(state, 1, 60, 1500);
    expect(cashGiven).toBe(30);
    expect(isMortgaged(newState, 1)).toBe(true);
  });

  it('creates new state without mutating original', () => {
    const state = createMortgageState();
    const { newState } = mortgageProperty(state, 1, 60, 1500);
    expect(state.mortgaged[1]).toBeUndefined();
    expect(newState.mortgaged[1]).toBe(true);
  });
});

describe('unmortgageProperty', () => {
  it('calculates cash required = price + interest when mortgaged', () => {
    const state = { mortgaged: { 1: true } };
    const { newState, cashRequired } = unmortgageProperty(state, 1, 60);
    expect(cashRequired).toBe(66); // 60 + floor(60/10) = 60 + 6
    expect(isMortgaged(newState, 1)).toBe(false);
  });

  it('calculates cash required = price when not mortgaged', () => {
    const state = { mortgaged: {} };
    const { cashRequired } = unmortgageProperty(state, 1, 60);
    expect(cashRequired).toBe(60);
  });

  it('creates new state without mutating original', () => {
    const state = { mortgaged: { 1: true } };
    const { newState } = unmortgageProperty(state, 1, 60);
    expect(state.mortgaged[1]).toBe(true);
    expect(newState.mortgaged[1]).toBe(false);
  });
});

describe('toggleMortgage', () => {
  it('mortgages a property when not already mortgaged', () => {
    const state = createMortgageState();
    const { newState, cashChanged, wasMortgaged } = toggleMortgage(state, 1, 60, 1500);
    expect(wasMortgaged).toBe(false);
    expect(cashChanged).toBe(30); // floor(60/2)
    expect(isMortgaged(newState, 1)).toBe(true);
  });

  it('unmortgages a property when already mortgaged', () => {
    const state = { mortgaged: { 1: true } };
    const { newState, cashChanged, wasMortgaged } = toggleMortgage(state, 1, 60, 1500);
    expect(wasMortgaged).toBe(true);
    expect(cashChanged).toBe(-66); // -(60 + floor(60/10))
    expect(isMortgaged(newState, 1)).toBe(false);
  });

  it('does not change state if tile not in state', () => {
    const state = createMortgageState();
    const { newState, cashChanged, wasMortgaged } = toggleMortgage(state, 99, 60, 1500);
    expect(wasMortgaged).toBe(false);
    expect(cashChanged).toBe(30);
    expect(isMortgaged(newState, 99)).toBe(true);
  });
});

describe('getMortgageRentMultiplier', () => {
  it('returns 0.1 for base rent when tile is mortgaged and no houses', () => {
    expect(getMortgageRentMultiplier(0)).toBe(0.1);
  });

  it('returns 0 for rent when tile is mortgaged and has houses', () => {
    expect(getMortgageRentMultiplier(1)).toBe(0);
    expect(getMortgageRentMultiplier('hotel')).toBe(0);
  });
});
