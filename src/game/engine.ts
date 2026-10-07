import { TILES, isBuyable, type Tile } from '../data/tiles';

export interface Player {
  name: string;
  cash: number;
  pos: number;
  out: boolean;
}

export interface GameState {
  players: Player[];
  current: number;
  owners: Record<number, number>;
}

export interface GameEvent {
  type: 'move' | 'passed-start' | 'buy' | 'rent' | 'eliminate' | 'turn' | 'error' | 'release';
  message: string;
  player?: number;
  tileId?: number;
  amount?: number;
}

export const BOARD_SIZE = 40;
export const START_BONUS = 200;

export function createGame(playerNames: string[], startingCash: number): GameState {
  return {
    players: playerNames.map((name) => ({ name, cash: startingCash, pos: 0, out: false })),
    current: 0,
    owners: {},
  };
}

export function applyMove(state: GameState, steps: number): GameEvent[] {
  const player = state.players[state.current];
  const events: GameEvent[] = [];
  const from = player.pos;
  player.pos = (from + steps) % BOARD_SIZE;
  events.push({
    type: 'move',
    message: `${player.name} moved from ${from} to ${player.pos}`,
    player: state.current,
    amount: steps,
  });
  if (from + steps >= BOARD_SIZE) {
    player.cash += START_BONUS;
    events.push({
      type: 'passed-start',
      message: `${player.name} passed START and collected $${START_BONUS}`,
      player: state.current,
      amount: START_BONUS,
    });
  }
  return events;
}

export function rentFor(tile: Tile): number {
  if (tile.price === undefined) return 0;
  return Math.max(10, Math.round(tile.price * 0.2));
}

function findTile(tileId: number): Tile | undefined {
  return TILES.find((t) => t.id === tileId);
}

export function buyTile(state: GameState, tileId: number): GameEvent[] {
  const tile = findTile(tileId);
  const player = state.players[state.current];
  if (!tile || !isBuyable(tile)) {
    return [{ type: 'error', message: `Tile ${tileId} is not buyable`, player: state.current, tileId }];
  }
  if (state.owners[tileId] !== undefined) {
    return [{ type: 'error', message: `Tile ${tileId} is already owned`, player: state.current, tileId }];
  }
  const price = tile.price as number;
  if (player.cash < price) {
    return [{ type: 'error', message: `${player.name} cannot afford ${tile.name} ($${price})`, player: state.current, tileId }];
  }
  player.cash -= price;
  state.owners[tileId] = state.current;
  return [{ type: 'buy', message: `${player.name} bought ${tile.name}`, player: state.current, tileId, amount: price }];
}

export function applyRent(state: GameState, tileId: number): GameEvent[] {
  const owner = state.owners[tileId];
  if (owner === undefined || owner === state.current) return [];
  const tile = findTile(tileId);
  if (!tile) return [];
  const rent = rentFor(tile);
  const tenant = state.players[state.current];
  tenant.cash -= rent;
  state.players[owner].cash += rent;
  return [{ type: 'rent', message: `${tenant.name} paid $${rent} to ${state.players[owner].name}`, player: state.current, tileId, amount: rent }];
}

export function eliminateIfBankrupt(state: GameState, playerIndex: number): GameEvent[] {
  const player = state.players[playerIndex];
  if (player.cash < 0 && !player.out) {
    player.out = true;
    const events: GameEvent[] = [{ type: 'eliminate', message: `${player.name} is bankrupt and out`, player: playerIndex }];

    // Release all owned tiles
    for (const tileId of Object.keys(state.owners)) {
      const id = parseInt(tileId, 10);
      if (state.owners[id] === playerIndex) {
        delete state.owners[id];
        events.push({
          type: 'release',
          message: `Tile ${id} released because ${player.name} went bankrupt`,
          player: playerIndex,
          tileId: id,
        });
      }
    }
    return events;
  }
  return [];
}

export function advanceTurn(state: GameState): void {
  const n = state.players.length;
  for (let i = 1; i <= n; i++) {
    const next = (state.current + i) % n;
    if (!state.players[next].out) {
      state.current = next;
      return;
    }
  }
}
