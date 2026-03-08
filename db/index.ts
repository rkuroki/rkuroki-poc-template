import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

// PRAGMAS
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    pwd TEXT NOT NULL,
    name TEXT
  );
`);

// Seeding function (synchronous - executed on startup)
function initDb() {
  const insertUser = db.prepare('INSERT INTO users (id, username, pwd, name) VALUES (?, ?, ?, ?)');
  const getUserByUsername = db.prepare('SELECT id FROM users WHERE username = ?');

  // Seed admin user for all environments
  try {
    if (!getUserByUsername.get('admin')) {
      const hashed = bcrypt.hashSync('admin123', 10);
      insertUser.run(crypto.randomUUID(), 'admin', hashed, 'System Administrator');
      console.log('✅ Seeded initial "admin" user');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }

  // Seed dev user if in development
  try {
    if (process.env.NODE_ENV === 'development') {
      const devUsername = '+5511911112222';
      if (!getUserByUsername.get(devUsername)) {
        const hashed = bcrypt.hashSync('123456', 10);
        insertUser.run(crypto.randomUUID(), devUsername, hashed, 'Dev User');
        console.log(`✅ Seeded development user "${devUsername}"`);
      }
    }
  } catch (error) {
    console.error('Failed to seed dev user:', error);
  }
}

// Initialize on first import
initDb();

export default db;
