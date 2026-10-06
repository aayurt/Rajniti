import { describe, expect, it } from 'vitest';
import { applyCard, buildDecks, draw } from './cards';
import type { Card, DeckState, PlayerState } from './cards';

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return { cash: 1500, pos: 0, inJail: false, ...overrides };
}

describe('buildDecks', () => {
  it('builds a surprise deck with at least 16 cards', () => {
    const { surprise } = buildDecks();
    expect(surprise.length).toBeGreaterThanOrEqual(16);
  });

  it('builds a treasure deck with at least 16 cards', () => {
    const { treasure } = buildDecks();
    expect(treasure.length).toBeGreaterThanOrEqual(16);
  });

  it('gives every card an {id, deck, text, effect} shape', () => {
    const { surprise, treasure } = buildDecks();
    for (const card of [...surprise, ...treasure]) {
      expect(typeof card.id).toBe('string');
      expect(card.id.length).toBeGreaterThan(0);
      expect(['surprise', 'treasure']).toContain(card.deck);
      expect(typeof card.text).toBe('string');
      expect(card.text.length).toBeGreaterThan(0);
      expect(card.effect).toBeDefined();
    }
  });

  it('tags each card with the deck it belongs to', () => {
    const { surprise, treasure } = buildDecks();
    expect(surprise.every((c) => c.deck === 'surprise')).toBe(true);
    expect(treasure.every((c) => c.deck === 'treasure')).toBe(true);
  });

  it('uses unique ids within each deck', () => {
    const { surprise, treasure } = buildDecks();
    expect(new Set(surprise.map((c) => c.id)).size).toBe(surprise.length);
    expect(new Set(treasure.map((c) => c.id)).size).toBe(treasure.length);
  });

  it('includes a gain-cash effect (scholarship +$100)', () => {
    const { surprise, treasure } = buildDecks();
    const all = [...surprise, ...treasure];
    expect(all.some((c) => c.effect.kind === 'gain' && c.effect.amount === 100)).toBe(true);
  });

  it('includes a lose-cash effect (phone repair -$50)', () => {
    const { surprise, treasure } = buildDecks();
    const all = [...surprise, ...treasure];
    expect(all.some((c) => c.effect.kind === 'lose' && c.effect.amount === 50)).toBe(true);
  });

  it('includes at least one move-to-tile effect', () => {
    const { surprise, treasure } = buildDecks();
    const all = [...surprise, ...treasure];
    expect(all.some((c) => c.effect.kind === 'move')).toBe(true);
  });

  it('includes at least one go-to-jail effect', () => {
    const { surprise, treasure } = buildDecks();
    const all = [...surprise, ...treasure];
    expect(all.some((c) => c.effect.kind === 'jail')).toBe(true);
  });
});

describe('draw', () => {
  it('returns the top card and rotates it to the bottom', () => {
    const { surprise } = buildDecks();
    const before: DeckState = [...surprise];
    const { card, deck } = draw(before);
    expect(card).toEqual(surprise[0]);
    expect(deck).toEqual([...surprise.slice(1), surprise[0]]);
  });

  it('does not mutate the input deck', () => {
    const { treasure } = buildDecks();
    const before: DeckState = [...treasure];
    const snapshot = [...before];
    draw(before);
    expect(before).toEqual(snapshot);
  });

  it('cycles forever: drawing N times over a full deck restores the order', () => {
    const { surprise } = buildDecks();
    let deck: DeckState = [...surprise];
    const drawn: Card[] = [];
    for (let i = 0; i < surprise.length; i += 1) {
      const result = draw(deck);
      drawn.push(result.card);
      deck = result.deck;
    }
    expect(drawn).toEqual(surprise);
    expect(deck).toEqual(surprise);
  });

  it('never empties: deck size stays constant across draws', () => {
    const { treasure } = buildDecks();
    let deck: DeckState = [...treasure];
    for (let i = 0; i < treasure.length * 2; i += 1) {
      const result = draw(deck);
      expect(result.deck.length).toBe(treasure.length);
      deck = result.deck;
    }
  });
});

describe('applyCard', () => {
  it('gain effect adds cash and does not mutate the input', () => {
    const player = makePlayer({ cash: 1500 });
    const card: Card = { id: 't-gain', deck: 'treasure', text: 'Scholarship +$100', effect: { kind: 'gain', amount: 100 } };
    const next = applyCard(player, card);
    expect(next.cash).toBe(1600);
    expect(next.pos).toBe(player.pos);
    expect(next.inJail).toBe(false);
    expect(player.cash).toBe(1500);
  });

  it('lose effect subtracts cash (phone repair -$50)', () => {
    const player = makePlayer({ cash: 1500 });
    const card: Card = { id: 't-lose', deck: 'treasure', text: 'Phone repair -$50', effect: { kind: 'lose', amount: 50 } };
    const next = applyCard(player, card);
    expect(next.cash).toBe(1450);
    expect(player.cash).toBe(1500);
  });

  it('move effect sets pos to the target tile', () => {
    const player = makePlayer({ pos: 5 });
    const card: Card = { id: 's-move', deck: 'surprise', text: 'Advance to START', effect: { kind: 'move', tile: 0 } };
    const next = applyCard(player, card);
    expect(next.pos).toBe(0);
    expect(next.cash).toBe(player.cash);
    expect(player.pos).toBe(5);
  });

  it('jail effect sends the player to tile 10 and sets inJail', () => {
    const player = makePlayer({ pos: 22 });
    const card: Card = { id: 's-jail', deck: 'surprise', text: 'Go to jail', effect: { kind: 'jail' } };
    const next = applyCard(player, card);
    expect(next.pos).toBe(10);
    expect(next.inJail).toBe(true);
    expect(player.inJail).toBe(false);
    expect(player.pos).toBe(22);
  });
});
