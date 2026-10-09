// Mortgage and unmortgage mechanics for properties. Pure: no React, no DOM.

import type { HouseCount } from './houses';

export interface MortgageState {
  readonly mortgaged: Record<number, boolean>;
}

export function createMortgageState(): MortgageState {
  return { mortgaged: {} };
}

export function isMortgaged(state: MortgageState, tileId: number): boolean {
  return state.mortgaged[tileId] === true;
}

export function mortgageProperty(state: MortgageState, tileId: number, price: number, playerCash: number): { newState: MortgageState; cashGiven: number } {
  const newState = { ...state.mortgaged, [tileId]: true };
  const cashGiven = Math.floor(price / 2);
  return { newState: { mortgaged: newState }, cashGiven };
}

export function unmortgageProperty(state: MortgageState, tileId: number, price: number): { newState: MortgageState; cashRequired: number } {
  const alreadyMortgaged = state.mortgaged[tileId] === true;
  const interest = Math.floor(price / 10);
  const cashRequired = alreadyMortgaged ? price + interest : price;
  const newState = { ...state.mortgaged, [tileId]: false };
  return { newState: { mortgaged: newState }, cashRequired };
}

export function toggleMortgage(state: MortgageState, tileId: number, price: number, playerCash: number): {
  newState: MortgageState;
  cashChanged: number;
  wasMortgaged: boolean;
} {
  const currentlyMortgaged = state.mortgaged[tileId] === true;

  if (currentlyMortgaged) {
    // Unmortgage
    const { newState, cashRequired } = unmortgageProperty(state, tileId, price);
    return { newState, cashChanged: -cashRequired, wasMortgaged: true };
  } else {
    // Mortgage
    const { newState, cashGiven } = mortgageProperty(state, tileId, price, playerCash);
    return { newState, cashChanged: cashGiven, wasMortgaged: false };
  }
}

export function getMortgageRentMultiplier(houseCount: HouseCount): number {
  // Mortgaged properties collect 10% of price as rent (no houses can be on mortgaged property)
  return houseCount === 0 ? 0.1 : 0;
}