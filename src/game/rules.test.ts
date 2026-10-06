import { describe, expect, it } from 'vitest';
import { createVacationPot, earningsTax, enterJail, payBail, premiumTax, rollToExit } from './rules';
import type { JailPlayer } from './rules';

function makePlayer(overrides: Partial<JailPlayer> = {}): JailPlayer {
  return { cash: 1500, pos: 0, inJail: false, ...overrides };
}

describe('enterJail', () => {
  it('sets inJail and moves pos to tile 10', () => {
    const next = enterJail(makePlayer({ pos: 24 }));
    expect(next.inJail).toBe(true);
    expect(next.pos).toBe(10);
  });

  it('preserves cash', () => {
    const next = enterJail(makePlayer({ cash: 1234 }));
    expect(next.cash).toBe(1234);
  });

  it('does not mutate the input player', () => {
    const player = makePlayer({ pos: 5 });
    enterJail(player);
    expect(player.inJail).toBe(false);
    expect(player.pos).toBe(5);
  });
});

describe('payBail', () => {
  it('releases the player and deducts $50 by default when affordable', () => {
    const { player, paid } = payBail(enterJail(makePlayer({ cash: 1500 })));
    expect(paid).toBe(true);
    expect(player.inJail).toBe(false);
    expect(player.cash).toBe(1450);
  });

  it('fails cleanly when the player cannot afford bail', () => {
    const jailed = enterJail(makePlayer({ cash: 30 }));
    const { player, paid } = payBail(jailed);
    expect(paid).toBe(false);
    expect(player.inJail).toBe(true);
    expect(player.cash).toBe(30);
    expect(player.pos).toBe(10);
  });

  it('succeeds when cash exactly equals the bail amount', () => {
    const { player, paid } = payBail(enterJail(makePlayer({ cash: 50 })));
    expect(paid).toBe(true);
    expect(player.inJail).toBe(false);
    expect(player.cash).toBe(0);
  });

  it('supports a custom bail amount', () => {
    const { player, paid } = payBail(enterJail(makePlayer({ cash: 200 })), 100);
    expect(paid).toBe(true);
    expect(player.cash).toBe(100);
    expect(player.inJail).toBe(false);
  });

  it('does not mutate the input player', () => {
    const jailed = enterJail(makePlayer({ cash: 1500 }));
    payBail(jailed);
    expect(jailed.cash).toBe(1500);
    expect(jailed.inJail).toBe(true);
  });
});

describe('rollToExit', () => {
  it('releases immediately on a double without paying bail', () => {
    expect(rollToExit(true, 1)).toEqual({ released: true, paidBail: false });
  });

  it('stays in jail after the 1st failed turn', () => {
    expect(rollToExit(false, 1)).toEqual({ released: false, paidBail: false });
  });

  it('stays in jail after the 2nd failed turn', () => {
    expect(rollToExit(false, 2)).toEqual({ released: false, paidBail: false });
  });

  it('pays bail and releases on the 3rd failed turn', () => {
    expect(rollToExit(false, 3)).toEqual({ released: true, paidBail: true });
  });
});

describe('tax', () => {
  it('earningsTax charges 10% rounded', () => {
    expect(earningsTax(1000)).toBe(100);
    expect(earningsTax(1055)).toBe(106);
  });

  it('earningsTax handles zero and small amounts', () => {
    expect(earningsTax(0)).toBe(0);
    expect(earningsTax(5)).toBe(1);
  });

  it('premiumTax is a flat $75', () => {
    expect(premiumTax()).toBe(75);
  });
});

describe('vacationPot', () => {
  it('collect accumulates the balance', () => {
    const pot = createVacationPot();
    pot.collect(100);
    pot.collect(50);
    expect(pot.balance).toBe(150);
  });

  it('award pays out the total and resets to 0', () => {
    const pot = createVacationPot();
    pot.collect(100);
    pot.collect(75);
    expect(pot.award()).toBe(175);
    expect(pot.balance).toBe(0);
  });

  it('award on an empty pot pays 0', () => {
    const pot = createVacationPot();
    expect(pot.award()).toBe(0);
    expect(pot.balance).toBe(0);
  });
});
