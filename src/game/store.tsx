import { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { TILES, isBuyable } from '../data/tiles';
import { createTurn, tickTurn, rollTurn, endTurn, TurnState } from './turn';
import { applyMove, buyTile, applyRent, advanceTurn, eliminateIfBankrupt, GameState } from './engine';

export interface Player {
  id: string;
  name: string;
  color: string;
  cash: number;
  pos: number;
  isYou?: boolean;
  isOwner?: boolean;
  isOut?: boolean;
}

export interface LogEntry {
  id: number;
  text: string;
  muted?: boolean;
}

export interface ChatMsg {
  id: number;
  from: string;
  color: string;
  text: string;
}

export interface Trade {
  id: number;
  text: string;
}

export type MobileTab = 'board' | 'players' | 'chat';

interface State {
  screen: 'lobby' | 'game';
  players: Player[];
  current: number;
  lastMover: number;
  dice: [number, number];
  rolling: boolean;
  log: LogEntry[];
  chat: ChatMsg[];
  owned: Record<number, string>;
  pendingBuy: number | null;
  selected: number | null;
  trades: Trade[];
  tradeHint: boolean;
  appearance: string;
  maxPlayers: number;
  startingCash: number;
  rules: Record<string, boolean>;
  mobileTab: MobileTab;
  turn: TurnState;
}

type Action =
  | { type: 'JOIN_GAME' }
  | { type: 'BACK_TO_LOBBY' }
  | { type: 'ROLL'; d1: number; d2: number }
  | { type: 'LANDED' }
  | { type: 'BUY' }
  | { type: 'SKIP_BUY' }
  | { type: 'BANKRUPT_ME' }
  | { type: 'SEND_CHAT'; text: string }
  | { type: 'SELECT'; id: number | null }
  | { type: 'CREATE_TRADE'; text?: string }
  | { type: 'CANCEL_TRADE'; id: number }
  | { type: 'DISMISS_TRADE_HINT' }
  | { type: 'SET_APPEARANCE'; color: string }
  | { type: 'SET_MAX_PLAYERS'; n: number }
  | { type: 'SET_STARTING_CASH'; n: number }
  | { type: 'TOGGLE_RULE'; key: string }
  | { type: 'SET_TAB'; tab: MobileTab }
  | { type: 'END_TURN' }
  | { type: 'TICK_TURN' };

let uid = 1;
const nid = () => uid++;

const BASE_PLAYERS: Player[] = [
  { id: 'p1', name: 'Tan Drama', color: '#f5c518', cash: 1500, pos: 0 },
  { id: 'me', name: 'aaa', color: '#e5484d', cash: 1500, pos: 0, isYou: true, isOwner: true },
  { id: 'p3', name: 'Novel Kitchen', color: '#2dd4bf', cash: 1500, pos: 0 },
  { id: 'p4', name: 'Primary Slide', color: '#ec4899', cash: 1500, pos: 0 },
];

export const initialState: State = {
  screen: 'lobby',
  players: BASE_PLAYERS,
  current: 0,
  lastMover: 0,
  dice: [5, 3],
  rolling: false,
  log: [],
  chat: [],
  owned: {},
  pendingBuy: null,
  selected: null,
  trades: [],
  tradeHint: true,
  appearance: '#7fd4e8',
  maxPlayers: 4,
  startingCash: 1500,
  rules: {
    doubleRent: false,
    vacationCash: false,
    auction: false,
    noRentInPrison: false,
    mortgage: false,
    evenBuild: true,
    randomOrder: true,
  },
  mobileTab: 'board',
  turn: createTurn(),
};

function joinLog(startingCash: number): LogEntry[] {
  return [
    { id: nid(), text: `Joined room jfwq6`, muted: true },
    { id: nid(), text: `Tan Drama joined the game`, muted: true },
    { id: nid(), text: `Primary Slide joined the game`, muted: true },
    { id: nid(), text: `Novel Kitchen joined the game`, muted: true },
    {
      id: nid(),
      text: `Game started with a randomized players order. Good luck! (starting cash $${startingCash})`,
    },
  ];
}

function nextAlive(players: Player[], from: number): number {
  for (let step = 1; step <= players.length; step++) {
    const i = (from + step) % players.length;
    if (!players[i].isOut) return i;
  }
  return from;
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'JOIN_GAME': {
      const players = BASE_PLAYERS.map((p) => ({ ...p, cash: s.startingCash, pos: 0, isOut: false }));
      return {
        ...s,
        screen: 'game',
        players,
        current: 0,
        lastMover: 0,
        owned: {},
        trades: [],
        tradeHint: true,
        pendingBuy: null,
        selected: null,
        rolling: false,
        chat: [],
        log: joinLog(s.startingCash),
        mobileTab: 'board',
        turn: createTurn(),
      };
    }
    case 'BACK_TO_LOBBY':
      return { ...s, screen: 'lobby' };
    case 'ROLL':
      if (s.rolling || s.turn.phase !== 'awaitRoll') return s;
      return { ...s, rolling: true, dice: [a.d1, a.d2], pendingBuy: null, turn: rollTurn(s.turn) };
    case 'LANDED': {
      const moverIndex = s.current;
      const p = s.players[moverIndex];
      const steps = s.dice[0] + s.dice[1];

      // Convert current state to GameState for engine
      const engineState: GameState = {
        players: s.players.map(pl => ({ name: pl.name, cash: pl.cash, pos: pl.pos, out: !!pl.isOut })),
        current: s.current,
        owners: {},
      };

      // Map owned ids back to indices for engineState.owners
      for (const pos in s.owned) {
        const ownerId = s.owned[pos];
        const idx = s.players.findIndex(pl => pl.id === ownerId);
        if (idx !== -1) {
          engineState.owners[pos] = idx;
        }
      }

      const events = applyMove(engineState, steps);

      const newPos = engineState.players[engineState.current].pos;
      const tile = TILES[newPos];

      const log: LogEntry[] = [
        ...s.log,
        { id: nid(), text: `${p.name} rolled ${s.dice[0]}+${s.dice[1]} → ${tile.name}` },
      ];

      for (const ev of events) {
        if (ev.type === 'passed-start') {
          log.push({ id: nid(), text: `${p.name} passed START +$200`, muted: true });
        }
      }

      const rentEvents = applyRent(engineState, newPos);
      for (const ev of rentEvents) {
        if (ev.type === 'rent') {
          log.push({ id: nid(), text: ev.message });
        }
      }

      if (tile.kind === 'tax') {
        const amount = tile.name === 'Earnings Tax' ? Math.round(p.cash * 0.1) : 75;
        engineState.players[engineState.current].cash -= amount;
        log.push({ id: nid(), text: `${p.name} paid a $${amount} tax` });
      }

      if (tile.kind === 'vacation') {
        log.push({ id: nid(), text: `${p.name} will spend a turn while on vacation` });
      }

      // advanceTurn(engineState);

      const updatedPlayers = s.players.map((pl, i) => ({
        ...pl,
        cash: engineState.players[i].cash,
        pos: engineState.players[i].pos,
      }));

      const pendingBuy = !s.owned[newPos] && isBuyable(tile) ? newPos : null;

      return {
        ...s,
        players: updatedPlayers,
        log,
        rolling: false,
        lastMover: moverIndex,
        current: engineState.current,
        pendingBuy,
      };
    }
    case 'BUY': {
      if (s.pendingBuy == null) return s;

      const tileId = s.pendingBuy;
      const tile = TILES[tileId];

      const engineState: GameState = {
        players: s.players.map(pl => ({ name: pl.name, cash: pl.cash, pos: pl.pos, out: !!pl.isOut })),
        current: s.lastMover,
        owners: {},
      };
      for (const pos in s.owned) {
        const ownerId = s.owned[pos];
        const idx = s.players.findIndex(pl => pl.id === ownerId);
        if (idx !== -1) {
          engineState.owners[pos] = idx;
        }
      }

      const events = buyTile(engineState, tileId);
      const buyEvent = events.find(e => e.type === 'buy');

      if (!buyEvent) {
        const errorEvent = events.find(e => e.type === 'error');
        const msg = errorEvent ? errorEvent.message : `${s.players[s.lastMover].name} can't afford ${tile.name}`;
        // Map engine error message back to expected format if necessary, though TDD tests expect exact matches.
        // TDD test asserts: `${buyer.name} can't afford ${tile.name}`
        const buyer = s.players[s.lastMover];
        const logMsg = errorEvent?.message.includes("cannot afford") ? `${buyer.name} can't afford ${tile.name}` : msg;
        return {
          ...s,
          pendingBuy: null,
          log: [...s.log, { id: nid(), text: logMsg, muted: true }],
        };
      }

      const updatedPlayers = s.players.map((pl, i) => ({
        ...pl,
        cash: engineState.players[i].cash,
      }));

      return {
        ...s,
        players: updatedPlayers,
        owned: { ...s.owned, [tileId]: s.players[s.lastMover].id },
        pendingBuy: null,
        log: [...s.log, { id: nid(), text: `${s.players[s.lastMover].name} bought ${tile.name}` }],
      };
    }
    case 'SKIP_BUY':
      return { ...s, pendingBuy: null };
    case 'BANKRUPT_ME': {
      const meIndex = s.players.findIndex((p) => p.isYou);
      if (meIndex === -1) return s;

      const engineState: GameState = {
        players: s.players.map(pl => ({ name: pl.name, cash: pl.cash, pos: pl.pos, out: !!pl.isOut })),
        current: s.current,
        owners: {},
      };

      engineState.players[meIndex].cash = -1; // Force bankruptcy for the engine logic
      const events = eliminateIfBankrupt(engineState, meIndex);

      return {
        ...s,
        players: s.players.map((pl, i) =>
          i === meIndex ? { ...pl, isOut: engineState.players[i].out, cash: 0 } : pl,
        ),
        log: [...s.log, { id: nid(), text: 'aaa went bankrupt and left the game', muted: true }],
      };
    }
    case 'SEND_CHAT': {
      const me = s.players.find((p) => p.isYou);
      return {
        ...s,
        chat: [...s.chat, { id: nid(), from: 'aaa', color: me ? me.color : '#e5484d', text: a.text }],
      };
    }
    case 'SELECT':
      return { ...s, selected: a.id };
    case 'CREATE_TRADE': {
      const n = s.trades.length + 1;
      return {
        ...s,
        trades: [...s.trades, { id: nid(), text: a.text || `Trade offer #${n} — awaiting another player` }],
      };
    }
    case 'CANCEL_TRADE':
      return { ...s, trades: s.trades.filter((t) => t.id !== a.id) };
    case 'DISMISS_TRADE_HINT':
      return { ...s, tradeHint: false };
    case 'SET_APPEARANCE':
      return { ...s, appearance: a.color };
    case 'SET_MAX_PLAYERS':
      return { ...s, maxPlayers: a.n };
    case 'SET_STARTING_CASH':
      return { ...s, startingCash: a.n };
    case 'TOGGLE_RULE':
      return { ...s, rules: { ...s.rules, [a.key]: !s.rules[a.key] } };
    case 'SET_TAB':
      return { ...s, mobileTab: a.tab };
    case 'TICK_TURN':
      return { ...s, turn: tickTurn(s.turn) };
    case 'END_TURN': {
      const engineState: GameState = {
        players: s.players.map(pl => ({ name: pl.name, cash: pl.cash, pos: pl.pos, out: !!pl.isOut })),
        current: s.current,
        owners: {},
      };
      for (const pos in s.owned) {
        const ownerId = s.owned[pos];
        const idx = s.players.findIndex(pl => pl.id === ownerId);
        if (idx !== -1) {
          engineState.owners[pos] = idx;
        }
      }
      advanceTurn(engineState);
      return { ...s, current: engineState.current, turn: createTurn(), pendingBuy: null };
    }
    default:
      return s;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
