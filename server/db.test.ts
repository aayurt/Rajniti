/**
 * Tests for the server-side game-session store (server/db.ts).
 *
 * Server-only code: runs in the Vitest node environment and must never be
 * imported by the client bundle in src/.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { deleteGame, listGames, loadGame, openDb, saveGame } from './db';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The concrete db handle exposes close() (node:sqlite DatabaseSync).
type Db = ReturnType<typeof openDb>;

let dbs: Db[] = [];

function memDb(): Db {
  const db = openDb(':memory:');
  dbs.push(db);
  return db;
}

afterEach(() => {
  for (const db of dbs) {
    (db as unknown as { close?: () => void }).close?.();
  }
  dbs = [];
  vi.useRealTimers();
});

describe('openDb', () => {
  it('opens an in-memory database usable for game storage', () => {
    const db = memDb();
    expect(db).toBeDefined();
    // Round-trip smoke test: save + load works on a fresh handle.
    saveGame(db, { id: 'g1', name: 'First', state: { turn: 1 } });
    expect(loadGame(db, 'g1')).toEqual({ turn: 1 });
  });
});

describe('saveGame / loadGame', () => {
  it('saves and loads a game state round-trip', () => {
    const db = memDb();
    const state = { turn: 3, players: [{ name: 'A', pos: 5 }] };
    saveGame(db, { id: 'game-1', name: 'Friday night', state });
    expect(loadGame(db, 'game-1')).toEqual(state);
  });

  it('returns null when the game id does not exist', () => {
    const db = memDb();
    expect(loadGame(db, 'missing')).toBeNull();
  });

  it('upserts: saving the same id twice updates name/state without duplicating rows', () => {
    const db = memDb();
    saveGame(db, { id: 'g1', name: 'Old', state: { turn: 1 } });
    saveGame(db, { id: 'g1', name: 'New', state: { turn: 2 } });
    expect(loadGame(db, 'g1')).toEqual({ turn: 2 });
    expect(listGames(db)).toHaveLength(1);
    expect(listGames(db)[0]).toMatchObject({ id: 'g1', name: 'New' });
  });

  it('bumps updatedAt on update while keeping createdAt stable', async () => {
    const db = memDb();
    saveGame(db, { id: 'g1', name: 'G', state: { turn: 1 } });
    const before = listGames(db)[0].updatedAt;
    await sleep(10);
    saveGame(db, { id: 'g1', name: 'G', state: { turn: 2 } });
    const after = listGames(db)[0].updatedAt;
    expect(after).toBeGreaterThan(before);
  });

  it('surfaces a clear error (not silent null) when stateJson is corrupt', () => {
    const db = memDb();
    saveGame(db, { id: 'g1', name: 'G', state: { turn: 1 } });
    (
      db as unknown as { exec: (sql: string) => void }
    ).exec(`UPDATE games SET stateJson = 'not-json{{{' WHERE id = 'g1'`);
    expect(() => loadGame(db, 'g1')).toThrow(/g1/);
  });
});

describe('listGames', () => {
  it('returns newest-first summaries without the state blob', async () => {
    const db = memDb();
    saveGame(db, { id: 'old', name: 'Old game', state: { turn: 1 } });
    await sleep(10);
    saveGame(db, { id: 'new', name: 'New game', state: { turn: 9 } });
    const games = listGames(db);
    expect(games.map((g) => g.id)).toEqual(['new', 'old']);
    for (const g of games) {
      expect(Object.keys(g).sort()).toEqual(['id', 'name', 'updatedAt']);
      expect(g).not.toHaveProperty('state');
      expect(g).not.toHaveProperty('stateJson');
      expect(typeof g.updatedAt).toBe('number');
    }
  });

  it('returns an empty array when no games are stored', () => {
    expect(listGames(memDb())).toEqual([]);
  });
});

describe('deleteGame', () => {
  it('removes an existing game and returns true', () => {
    const db = memDb();
    saveGame(db, { id: 'g1', name: 'G', state: { turn: 1 } });
    expect(deleteGame(db, 'g1')).toBe(true);
    expect(loadGame(db, 'g1')).toBeNull();
    expect(listGames(db)).toEqual([]);
  });

  it('is a no-op returning false for a missing id', () => {
    expect(deleteGame(memDb(), 'nope')).toBe(false);
  });
});
