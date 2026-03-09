import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';


const DB_DIR = path.join(process.cwd(), '.data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_PATH = path.join(DB_DIR, 'app.db');

declare global {
  var _sqliteDb: DatabaseType | undefined;
}

const db = global._sqliteDb || new Database(DB_PATH);

if (process.env.NODE_ENV !== 'production' && !global._sqliteDb) {
  global._sqliteDb = db;
}

import { migrate, runSeeds } from './migrate';

// PRAGMAS
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Automatically apply migrations and seed data on establishment
migrate(db);
runSeeds(db);

export default db;
