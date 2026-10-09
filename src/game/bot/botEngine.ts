import { createGame, applyMove, buyTile, applyRent, eliminateIfBankrupt, advanceTurn, type GameState } from '../engine';
import { createBotStrategy, type BotStrategy } from './strategies';

export { createBotStrategy };

export function playBotTurn(state: GameState, strategy: BotStrategy = createBotStrategy()): GameState {
  const newState = { ...state };
  const player = newState.players[newState.current];

  advanceTurn(newState);

  return newState;
}

export function botTakeTurn(state: GameState): GameState {
  const strategy = createBotStrategy();
  return playBotTurn(state, strategy);
}

export function simulateBotGame(playerNames: string[], startingCash: number = 1500): GameState {
  let state = createGame(playerNames, startingCash);
  const strategy = createBotStrategy();

  let turns = 0;
  const maxTurns = 100;

  while (turns < maxTurns) {
    const activePlayers = state.players.filter(p => !p.out);
    if (activePlayers.length <= 1) break;

    state = playBotTurn(state, strategy);
    turns++;
  }

  return state;
}