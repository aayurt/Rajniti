import { describe, it, expect } from 'vitest';
import { tradeReducer, initialTradeState, buildSummary } from './TradeModal';

describe('tradeHelper', () => {
  it('opens and closes', () => {
    let state = tradeReducer(initialTradeState, { type: 'OPEN' });
    expect(state.isOpen).toBe(true);
    state = tradeReducer(state, { type: 'CLOSE' });
    expect(state.isOpen).toBe(false);
    expect(state.cashAmount).toBe(0); // reset state on close
  });

  it('toggles properties', () => {
    let state = tradeReducer(initialTradeState, { type: 'TOGGLE_PROP', id: 5 });
    expect(state.selectedProperties).toEqual([5]);
    state = tradeReducer(state, { type: 'TOGGLE_PROP', id: 10 });
    expect(state.selectedProperties).toEqual([5, 10]);
    state = tradeReducer(state, { type: 'TOGGLE_PROP', id: 5 });
    expect(state.selectedProperties).toEqual([10]);
  });

  it('sets cash and target', () => {
    let state = tradeReducer(initialTradeState, { type: 'SET_CASH', amount: 150 });
    expect(state.cashAmount).toBe(150);
    state = tradeReducer(state, { type: 'SET_TARGET', playerId: 'p3' });
    expect(state.targetPlayerId).toBe('p3');
  });

  it('builds summary', () => {
    let state = {
      ...initialTradeState,
      selectedProperties: [1, 3],
      cashAmount: 200,
      targetPlayerId: 'p2'
    };

    const props: any = [{ id: 1, name: 'Salvador' }, { id: 3, name: 'Rio' }];
    const players: any = [{ id: 'p2', name: 'Bob' }];

    expect(buildSummary(state, props, players)).toBe('Offer $200 and Salvador, Rio to Bob');
  });

  it('builds summary when nothing is offered', () => {
    let state = {
      ...initialTradeState,
      targetPlayerId: 'p2'
    };
    const players: any = [{ id: 'p2', name: 'Bob' }];
    expect(buildSummary(state, [], players)).toBe('Offer nothing to Bob');
  });

  it('prompts to select player if none selected', () => {
    expect(buildSummary(initialTradeState, [], [])).toBe('Select a player to trade with.');
  });
});
