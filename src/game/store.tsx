import { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { TILES, isBuyable } from '../data/tiles';

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
  | { type: 'SET_TAB'; tab: MobileTab };

let uid = 1;
const nid = () => uid++;

const BASE_PLAYERS: Player[] = [
  { id: 'p1', name: 'Tan Drama', color: '#f5c518', cash: 1500, pos: 0 },
  { id: 'me', name: 'aaa', color: '#e5484d', cash: 1500, pos: 0, isYou: true, isOwner: true },
  { id: 'p3', name: 'Novel Kitchen', color: '#2dd4bf', cash: 1500, pos: 0 },
  { id: 'p4', name: 'Primary Slide', color: '#ec4899', cash: 1500, pos: 0 },
];

const initialState: State = {
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

function reducer(s: State, a: Action): State {
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
      };
    }
    case 'BACK_TO_LOBBY':
      return { ...s, screen: 'lobby' };
    case 'ROLL':
      if (s.rolling) return s;
      return { ...s, rolling: true, dice: [a.d1, a.d2], pendingBuy: null };
    case 'LANDED': {
      const mover = s.current;
      const p = s.players[mover];
      const steps = s.dice[0] + s.dice[1];
      const passedStart = p.pos + steps >= 40;
      const pos = (p.pos + steps) % 40;
      const tile = TILES[pos];
      const players = s.players.map((pl, i) =>
        i === mover ? { ...pl, pos, cash: pl.cash + (passedStart ? 200 : 0) } : pl,
      );
      const log: LogEntry[] = [
        ...s.log,
        { id: nid(), text: `${p.name} rolled ${s.dice[0]}+${s.dice[1]} → ${tile.name}` },
      ];
      if (passedStart) log.push({ id: nid(), text: `${p.name} passed START +$200`, muted: true });
      // rent
      const ownerId = s.owned[pos];
      let cashFix = players;
      if (ownerId && ownerId !== p.id && tile.price) {
        const rent = Math.max(10, Math.round(tile.price * 0.2));
        const owner = players.find((pl) => pl.id === ownerId);
        cashFix = players.map((pl) => {
          if (pl.id === p.id) return { ...pl, cash: pl.cash - rent };
          if (pl.id === ownerId) return { ...pl, cash: pl.cash + rent };
          return pl;
        });
        log.push({
          id: nid(),
          text: `${p.name} paid $${rent} rent to ${owner ? owner.name : 'owner'} (${tile.name})`,
        });
      }
      const pendingBuy = !s.owned[pos] && isBuyable(tile) ? pos : null;
      return {
        ...s,
        players: cashFix,
        log,
        rolling: false,
        lastMover: mover,
        current: nextAlive(s.players, mover),
        pendingBuy,
      };
    }
    case 'BUY': {
      if (s.pendingBuy == null) return s;
      const tile = TILES[s.pendingBuy];
      const buyer = s.players[s.lastMover];
      if (!tile.price || buyer.cash < tile.price) {
        return {
          ...s,
          pendingBuy: null,
          log: [...s.log, { id: nid(), text: `${buyer.name} can't afford ${tile.name}`, muted: true }],
        };
      }
      return {
        ...s,
        players: s.players.map((pl, i) =>
          i === s.lastMover ? { ...pl, cash: pl.cash - (tile.price as number) } : pl,
        ),
        owned: { ...s.owned, [tile.id]: buyer.id },
        pendingBuy: null,
        log: [...s.log, { id: nid(), text: `${buyer.name} bought ${tile.name} for $${tile.price}` }],
      };
    }
    case 'SKIP_BUY':
      return { ...s, pendingBuy: null };
    case 'BANKRUPT_ME': {
      return {
        ...s,
        players: s.players.map((pl) =>
          pl.isYou ? { ...pl, isOut: true, cash: 0 } : pl,
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
