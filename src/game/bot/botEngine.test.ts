import { describe, it, expect } from 'vitest';
import { createGame, type GameState } from '../engine';
import { playBotTurn, botTakeTurn, simulateBotGame, createBotStrategy } from './botEngine';
import { DefaultStrategy } from './strategies';

describe('createBotStrategy', () => {
  it('creates a default strategy instance', () => {
    const strategy = createBotStrategy();
    expect(strategy).toBeInstanceOf(DefaultStrategy);
  });
});

describe('playBotTurn', () => {
  it('advances the turn to the next player', () => {
    const state = createGame(['A', 'B'], 1500);
    const nextState = playBotTurn(state);
    expect(nextState.current).toBe(1);
  });

  it('wraps around to the first player when at the end', () => {
    const state = createGame(['A', 'B', 'C'], 1500);
    state.current = 2;
    const nextState = playBotTurn(state);
    expect(nextState.current).toBe(0);
  });
});

describe('botTakeTurn', () => {
  it('advances the turn to the next player', () => {
    const state = createGame(['A', 'B'], 1500);
    const result = botTakeTurn(state);
    expect(result.current).toBe(1);
  });

  it('wraps around to the first player when at the end', () => {
    const state = createGame(['A', 'B', 'C'], 1500);
    state.current = 2;
    const result = botTakeTurn(state);
    expect(result.current).toBe(0);
  });
});

describe('simulateBotGame', () => {
  it('runs without throwing', () => {
    const state = simulateBotGame(['A', 'B'], 1500);
    expect(state).toBeDefined();
  });

  it('handles single player', () => {
    const state = simulateBotGame(['A'], 1500);
    expect(state).toBeDefined();
  });

  it('handles four players', () => {
    const state = simulateBotGame(['A', 'B', 'C', 'D'], 1500);
    expect(state).toBeDefined();
  });
});