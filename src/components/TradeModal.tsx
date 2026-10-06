import React from 'react';
import { Tile } from '../data/tiles';
import { Player } from '../game/store';

export interface TradeState {
  isOpen: boolean;
  selectedProperties: number[];
  cashAmount: number;
  targetPlayerId: string | null;
}

export const initialTradeState: TradeState = {
  isOpen: false,
  selectedProperties: [],
  cashAmount: 0,
  targetPlayerId: null,
};

export type TradeAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE_PROP'; id: number }
  | { type: 'SET_CASH'; amount: number }
  | { type: 'SET_TARGET'; playerId: string };

export function tradeReducer(state: TradeState, action: TradeAction): TradeState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...initialTradeState };
    case 'TOGGLE_PROP':
      if (state.selectedProperties.includes(action.id)) {
        return { ...state, selectedProperties: state.selectedProperties.filter((id) => id !== action.id) };
      } else {
        return { ...state, selectedProperties: [...state.selectedProperties, action.id] };
      }
    case 'SET_CASH':
      return { ...state, cashAmount: action.amount };
    case 'SET_TARGET':
      return { ...state, targetPlayerId: action.playerId };
    default:
      return state;
  }
}

export function buildSummary(state: TradeState, myProperties: Tile[], otherPlayers: Player[]): string {
  if (!state.targetPlayerId) {
    return 'Select a player to trade with.';
  }

  const targetPlayer = otherPlayers.find((p) => p.id === state.targetPlayerId);
  const targetName = targetPlayer ? targetPlayer.name : 'Unknown';

  const items: string[] = [];
  if (state.cashAmount > 0) items.push(`$${state.cashAmount}`);

  const offeredProps = myProperties.filter((p) => state.selectedProperties.includes(p.id));
  if (offeredProps.length > 0) {
    items.push(offeredProps.map((p) => p.name).join(', '));
  }

  if (items.length === 0) {
    return `Offer nothing to ${targetName}`;
  }

  return `Offer ${items.join(' and ')} to ${targetName}`;
}

interface TradeModalProps {
  state: TradeState;
  dispatch: React.Dispatch<TradeAction>;
  myProperties: Tile[];
  otherPlayers: Player[];
  onConfirm: (summary: string) => void;
}

export function TradeModal({ state, dispatch, myProperties, otherPlayers, onConfirm }: TradeModalProps) {
  if (!state.isOpen) return null;

  const summary = buildSummary(state, myProperties, otherPlayers);
  const isValid = state.targetPlayerId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-panel border border-edge rounded-xl w-full max-w-sm flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-edge flex justify-between items-center">
          <h2 className="text-lav font-bold">Create Trade</h2>
          <button
            className="text-fog min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
            onClick={() => dispatch({ type: 'CLOSE' })}
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <label className="text-sm text-fog block mb-2">Select Target Player:</label>
            <div className="flex flex-col gap-2">
              {otherPlayers.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm min-h-[44px]">
                  <input
                    type="radio"
                    name="targetPlayer"
                    value={p.id}
                    checked={state.targetPlayerId === p.id}
                    onChange={() => dispatch({ type: 'SET_TARGET', playerId: p.id })}
                    className="w-4 h-4"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-fog block mb-2">Offer Cash:</label>
            <input
              type="number"
              min="0"
              value={state.cashAmount || ''}
              onChange={(e) => dispatch({ type: 'SET_CASH', amount: parseInt(e.target.value) || 0 })}
              className="w-full bg-tile border border-edge rounded-lg px-3 min-h-[44px] text-sm text-white"
              placeholder="$0"
            />
          </div>

          <div>
            <label className="text-sm text-fog block mb-2">Offer Properties:</label>
            {myProperties.length === 0 ? (
              <p className="text-xs text-fog italic">No properties owned.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {myProperties.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={state.selectedProperties.includes(p.id)}
                      onChange={() => dispatch({ type: 'TOGGLE_PROP', id: p.id })}
                      className="w-4 h-4"
                    />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color ?? '#8f8aa8' }} />
                    {p.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-edge bg-tile rounded-b-xl">
          <p className="text-sm mb-3 text-center min-h-[40px] flex items-center justify-center">
            {summary}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'CLOSE' })}
              className="flex-1 bg-panel border border-line rounded-lg px-3 py-2 text-sm min-h-[44px]"
            >
              Cancel
            </button>
            <button
              disabled={!isValid}
              onClick={() => onConfirm(summary)}
              className="flex-1 bg-[#5b34e8] text-white font-bold rounded-lg px-3 py-2 text-sm min-h-[44px] disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
