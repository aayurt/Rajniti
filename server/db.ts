/**
 * Server-side game-session store backed by Node's built-in `node:sqlite`.
 *
 * SERVER ONLY — never import this module (or `node:sqlite`) from the client
 * bundle in `src/`.
 */
import { DatabaseSync } from 'node:sqlite';

export type GameDb = DatabaseSync;

export interface SaveGameInput {
  id: string;
  name: string;
  /** JSON-serializable game state. */
  state: unknown;
}

export interface GameSummary {
  id: string;
  name: string;
  updatedAt: number;
}

export function openDb(path: string): GameDb {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      stateJson TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);
  return db;
}

export function saveGame(db: GameDb, game: SaveGameInput): void {
  const now = Date.now();
  const stateJson = JSON.stringify(game.state);
  db.prepare(
    `
    INSERT INTO games (id, name, stateJson, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      stateJson = excluded.stateJson,
      updatedAt = excluded.updatedAt
    `,
  ).run(game.id, game.name, stateJson, now, now);
}

export function loadGame(db: GameDb, id: string): unknown {
  const row = db
    .prepare('SELECT stateJson FROM games WHERE id = ?')
    .get(id) as { stateJson: string } | undefined;
  if (row === undefined) return null;
  try {
    return JSON.parse(row.stateJson);
  } catch {
    throw new Error(
      `Stored state for game "${id}" is corrupt: stateJson is not valid JSON`,
    );
  }
}

export function listGames(db: GameDb): GameSummary[] {
  const rows = db
    .prepare(
      'SELECT id, name, updatedAt FROM games ORDER BY updatedAt DESC, rowid DESC',
    )
    .all() as unknown as GameSummary[];
  return rows.map(({ id, name, updatedAt }) => ({ id, name, updatedAt }));
}

export function deleteGame(db: GameDb, id: string): boolean {
  const result = db.prepare('DELETE FROM games WHERE id = ?').run(id);
  return Number(result.changes) > 0;
}
