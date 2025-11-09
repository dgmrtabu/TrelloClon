import path from 'node:path';
import fs from 'node:fs/promises';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

import { env } from '../config/env';

sqlite3.verbose();

export type DbConnection = Database<sqlite3.Database, sqlite3.Statement>;

let dbPromise: Promise<DbConnection> | null = null;

const resolveDatabaseFile = async (): Promise<string> => {
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  return path.join(dataDir, `${env.nodeEnv}-trello.db`);
};

export const getDb = async (): Promise<DbConnection> => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const filename = await resolveDatabaseFile();
      const db = await open({ filename, driver: sqlite3.Database });
      await db.exec('PRAGMA foreign_keys = ON;');
      await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('pending','in_progress','completed')),
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
      return db;
    })();
  }

  return dbPromise;
};
