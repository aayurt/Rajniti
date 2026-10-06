// Surprise + Treasure card decks. Pure, UI-free: no React, no DOM, no imports.

export type DeckKind = 'surprise' | 'treasure';

export type CardEffect =
  | { kind: 'gain'; amount: number }
  | { kind: 'lose'; amount: number }
  | { kind: 'move'; tile: number }
  | { kind: 'jail' };

export interface Card {
  id: string;
  deck: DeckKind;
  text: string;
  effect: CardEffect;
}

export type DeckState = Card[];

export interface PlayerState {
  cash: number;
  pos: number;
  inJail: boolean;
}

export const JAIL_TILE = 10;

function surpriseCards(): Card[] {
  return [
    { id: 'surprise-01', deck: 'surprise', text: 'Scholarship award +$100', effect: { kind: 'gain', amount: 100 } },
    { id: 'surprise-02', deck: 'surprise', text: 'Phone repair -$50', effect: { kind: 'lose', amount: 50 } },
    { id: 'surprise-03', deck: 'surprise', text: 'Advance to START', effect: { kind: 'move', tile: 0 } },
    { id: 'surprise-04', deck: 'surprise', text: 'Go to jail', effect: { kind: 'jail' } },
    { id: 'surprise-05', deck: 'surprise', text: 'Tax refund +$150', effect: { kind: 'gain', amount: 150 } },
    { id: 'surprise-06', deck: 'surprise', text: 'Speeding fine -$75', effect: { kind: 'lose', amount: 75 } },
    { id: 'surprise-07', deck: 'surprise', text: 'Advance to Vacation', effect: { kind: 'move', tile: 20 } },
    { id: 'surprise-08', deck: 'surprise', text: 'Birthday gift +$50', effect: { kind: 'gain', amount: 50 } },
    { id: 'surprise-09', deck: 'surprise', text: 'Car repair -$100', effect: { kind: 'lose', amount: 100 } },
    { id: 'surprise-10', deck: 'surprise', text: 'Visit Jerusalem', effect: { kind: 'move', tile: 9 } },
    { id: 'surprise-11', deck: 'surprise', text: 'Freelance payout +$200', effect: { kind: 'gain', amount: 200 } },
    { id: 'surprise-12', deck: 'surprise', text: 'Dental bill -$125', effect: { kind: 'lose', amount: 125 } },
    { id: 'surprise-13', deck: 'surprise', text: 'Advance to Paris', effect: { kind: 'move', tile: 29 } },
    { id: 'surprise-14', deck: 'surprise', text: 'Lottery win +$75', effect: { kind: 'gain', amount: 75 } },
    { id: 'surprise-15', deck: 'surprise', text: 'Laptop repair -$60', effect: { kind: 'lose', amount: 60 } },
    { id: 'surprise-16', deck: 'surprise', text: 'Go back to Rio', effect: { kind: 'move', tile: 3 } },
  ];
}

function treasureCards(): Card[] {
  return [
    { id: 'treasure-01', deck: 'treasure', text: 'Found treasure +$200', effect: { kind: 'gain', amount: 200 } },
    { id: 'treasure-02', deck: 'treasure', text: 'Phone repair -$50', effect: { kind: 'lose', amount: 50 } },
    { id: 'treasure-03', deck: 'treasure', text: 'Sail to New York', effect: { kind: 'move', tile: 39 } },
    { id: 'treasure-04', deck: 'treasure', text: 'Caught smuggling — go to jail', effect: { kind: 'jail' } },
    { id: 'treasure-05', deck: 'treasure', text: 'Scholarship award +$100', effect: { kind: 'gain', amount: 100 } },
    { id: 'treasure-06', deck: 'treasure', text: 'Storm damage -$150', effect: { kind: 'lose', amount: 150 } },
    { id: 'treasure-07', deck: 'treasure', text: 'Advance to START', effect: { kind: 'move', tile: 0 } },
    { id: 'treasure-08', deck: 'treasure', text: 'Pearl diving +$125', effect: { kind: 'gain', amount: 125 } },
    { id: 'treasure-09', deck: 'treasure', text: 'Bribe the guards -$100', effect: { kind: 'lose', amount: 100 } },
    { id: 'treasure-10', deck: 'treasure', text: 'Fly to London', effect: { kind: 'move', tile: 34 } },
    { id: 'treasure-11', deck: 'treasure', text: 'Sunken gold +$300', effect: { kind: 'gain', amount: 300 } },
    { id: 'treasure-12', deck: 'treasure', text: 'Lost cargo -$200', effect: { kind: 'lose', amount: 200 } },
    { id: 'treasure-13', deck: 'treasure', text: 'Advance to Vacation', effect: { kind: 'move', tile: 20 } },
    { id: 'treasure-14', deck: 'treasure', text: 'Antique sale +$80', effect: { kind: 'gain', amount: 80 } },
    { id: 'treasure-15', deck: 'treasure', text: 'Harbor fee -$40', effect: { kind: 'lose', amount: 40 } },
    { id: 'treasure-16', deck: 'treasure', text: 'Visit Berlin', effect: { kind: 'move', tile: 19 } },
  ];
}

export function buildDecks(): { surprise: DeckState; treasure: DeckState } {
  return { surprise: surpriseCards(), treasure: treasureCards() };
}

/** Draw the top card and rotate it to the bottom. The deck cycles forever. Pure: input is not mutated. */
export function draw(deck: DeckState): { card: Card; deck: DeckState } {
  const [top, ...rest] = deck;
  return { card: top, deck: [...rest, top] };
}

/** Apply a card effect. Pure: returns a new player object, input is not mutated. */
export function applyCard(player: PlayerState, card: Card): PlayerState {
  switch (card.effect.kind) {
    case 'gain':
      return { ...player, cash: player.cash + card.effect.amount };
    case 'lose':
      return { ...player, cash: player.cash - card.effect.amount };
    case 'move':
      return { ...player, pos: card.effect.tile };
    case 'jail':
      return { ...player, pos: JAIL_TILE, inJail: true };
  }
}
