import { describe, it, expect } from 'vitest';
import { reducer, initialState } from './store';

describe('Store Reducer', () => {
  it('ROLL then LANDED moves token and wait for end turn', () => {
    // 1. Initial state has current player 0 at pos 0
    let state = reducer(initialState, { type: 'JOIN_GAME' });
    expect(state.current).toBe(0);
    expect(state.players[0].pos).toBe(0);

    // 2. Roll dice
    state = reducer(state, { type: 'ROLL', d1: 3, d2: 4 });
    expect(state.rolling).toBe(true);
    expect(state.dice).toEqual([3, 4]);

    // 3. Landed
    state = reducer(state, { type: 'LANDED' });

    // 4. Assert: moves token
    expect(state.players[0].pos).toBe(7); // 3+4 = 7
    // Does NOT advance turn immediately anymore
    expect(state.current).toBe(0);
    expect(state.lastMover).toBe(0);

    // 5. End turn
    state = reducer(state, { type: 'END_TURN' });
    expect(state.current).toBe(1);
  });

  it('BUY assigns owner and deducts cash', () => {
    let state = reducer(initialState, { type: 'JOIN_GAME' });

    // Roll and land on a buyable tile, e.g. tile 1 (price 60)
    state = reducer(state, { type: 'ROLL', d1: 1, d2: 0 });
    state = reducer(state, { type: 'LANDED' });

    // Ensure pendingBuy is set
    expect(state.pendingBuy).toBe(1);
    const initialCash = state.players[0].cash;

    // Last mover was player 0
    state = reducer(state, { type: 'BUY' });

    // pendingBuy should be cleared
    expect(state.pendingBuy).toBe(null);
    // owner assigned
    expect(state.owned[1]).toBe(state.players[0].id);
    // cash deducted
    expect(state.players[0].cash).toBe(initialCash - 60);
  });

  it('SKIP_BUY clears prompt', () => {
    let state = reducer(initialState, { type: 'JOIN_GAME' });

    // Roll and land on a buyable tile
    state = reducer(state, { type: 'ROLL', d1: 1, d2: 0 });
    state = reducer(state, { type: 'LANDED' });

    expect(state.pendingBuy).toBe(1);

    state = reducer(state, { type: 'SKIP_BUY' });

    // pendingBuy should be cleared
    expect(state.pendingBuy).toBe(null);
  });

  it('SEND_CHAT appends to chat log', () => {
    let state = reducer(initialState, { type: 'JOIN_GAME' });

    const chatLength = state.chat.length;

    state = reducer(state, { type: 'SEND_CHAT', text: 'Hello, world!' });

    expect(state.chat.length).toBe(chatLength + 1);
    expect(state.chat[state.chat.length - 1].text).toBe('Hello, world!');
  });

  it('BANKRUPT_ME flags out', () => {    let state = reducer(initialState, { type: 'JOIN_GAME' });

    // The "you" player is player 1 in the dummy setup
    const meIndex = state.players.findIndex(p => p.isYou);
    expect(state.players[meIndex].isOut).toBe(false);

    state = reducer(state, { type: 'BANKRUPT_ME' });

    expect(state.players[meIndex].isOut).toBe(true);
    expect(state.players[meIndex].cash).toBe(0);
  });

  it('SET_MAP switches board and clears ownership', () => {
    let state = reducer(initialState, { type: 'JOIN_GAME' });
    expect(state.mapId).toBe('classic');
    state = reducer(state, { type: 'SET_MAP', mapId: 'deathvalley' });
    expect(state.mapId).toBe('deathvalley');
    expect(state.owned).toEqual({});
    expect(state.pendingBuy).toBe(null);
  });

  it('JOIN_GAME preserves the selected map', () => {
    let state = reducer(initialState, { type: 'SET_MAP', mapId: 'luckywheel' });
    state = reducer(state, { type: 'JOIN_GAME' });
    expect(state.mapId).toBe('luckywheel');
  });

  it('landing on Tax Refund pays the bonus', () => {
    let state = reducer(initialState, { type: 'JOIN_GAME' });
    state = {
      ...state,
      mapId: 'luckywheel',
      players: state.players.map((pl, i) => (i === 0 ? { ...pl, pos: 35 } : pl)),
    };
    const before = state.players[0].cash;
    state = reducer(state, { type: 'ROLL', d1: 1, d2: 1 });
    state = reducer(state, { type: 'LANDED' });
    expect(state.players[0].pos).toBe(37);
    expect(state.players[0].cash).toBe(before + 50);
    expect(state.log[state.log.length - 1].text).toContain('tax refund');
  });
});
