export type TurnPhase = 'awaitRoll' | 'rolled' | 'ended';

export interface TurnState {
  phase: TurnPhase;
  timeLeft: number;
}

export function createTurn(): TurnState {
  return { phase: 'awaitRoll', timeLeft: 60 };
}

export function tickTurn(state: TurnState): TurnState {
  if (state.timeLeft <= 0) return state;
  return { ...state, timeLeft: state.timeLeft - 1 };
}

export function rollTurn(state: TurnState): TurnState {
  if (state.phase !== 'awaitRoll') return state;
  return { ...state, phase: 'rolled' };
}

export function endTurn(state: TurnState): TurnState {
  if (state.phase === 'ended') return state;
  return { ...state, phase: 'ended' };
}
