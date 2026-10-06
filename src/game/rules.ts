// Jail + tax rules. Pure, UI-free: no React, no DOM, no imports.

export interface JailPlayer {
  cash: number;
  pos: number;
  inJail: boolean;
}

export const JAIL_TILE = 10;
export const BAIL_AMOUNT = 50;
export const PREMIUM_TAX = 75;
const MAX_FAILED_ROLLS = 3;

/** Send a player to jail (tile 10). Pure: input is not mutated. */
export function enterJail(player: JailPlayer): JailPlayer {
  return { ...player, pos: JAIL_TILE, inJail: true };
}

export interface PayBailResult {
  player: JailPlayer;
  paid: boolean;
}

/** Pay bail to leave jail. Fails cleanly (player unchanged, paid=false) when unaffordable. */
export function payBail(player: JailPlayer, amount: number = BAIL_AMOUNT): PayBailResult {
  if (player.cash < amount) {
    return { player: { ...player }, paid: false };
  }
  return { player: { ...player, cash: player.cash - amount, inJail: false }, paid: true };
}

export interface RollToExitResult {
  released: boolean;
  paidBail: boolean;
}

/**
 * Attempt to leave jail via dice. turnsInJail is the 1-based count of the
 * current failed attempt: a double releases immediately, otherwise the
 * 3rd failed turn pays bail and releases.
 */
export function rollToExit(rolledDouble: boolean, turnsInJail: number): RollToExitResult {
  if (rolledDouble) {
    return { released: true, paidBail: false };
  }
  if (turnsInJail >= MAX_FAILED_ROLLS) {
    return { released: true, paidBail: true };
  }
  return { released: false, paidBail: false };
}

/** Earnings tax: 10% of cash, rounded to the nearest dollar. */
export function earningsTax(cash: number): number {
  return Math.round(cash * 0.1);
}

/** Premium tax: flat $75. */
export function premiumTax(): number {
  return PREMIUM_TAX;
}

export interface VacationPot {
  readonly balance: number;
  collect(amount: number): number;
  award(): number;
}

/** Shared vacation pot: collect() accumulates, award() pays out the total and resets to 0. */
export function createVacationPot(): VacationPot {
  let total = 0;
  return {
    get balance(): number {
      return total;
    },
    collect(amount: number): number {
      total += amount;
      return total;
    },
    award(): number {
      const payout = total;
      total = 0;
      return payout;
    },
  };
}
