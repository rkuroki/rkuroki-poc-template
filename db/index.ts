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

  CREATE TABLE IF NOT EXISTS page_urls (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    path TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    note TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seeding function (synchronous - executed on startup)
function initDb() {
  const insertUser = db.prepare('INSERT INTO users (id, username, pwd, name) VALUES (?, ?, ?, ?)');
  const getUserByUsername = db.prepare('SELECT id FROM users WHERE username = ?');
  const insertNote = db.prepare('INSERT INTO notes (id, note, "order", userId) VALUES (?, ?, ?, ?)');
  const insertPageUrl = db.prepare('INSERT INTO page_urls (id, url, path) VALUES (?, ?, ?)');
  const getNoteCount = db.prepare('SELECT count(*) as count FROM notes WHERE userId = ?');
  const getPageUrlCount = db.prepare('SELECT count(*) as count FROM page_urls');

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

  // Seed Notes
  try {
    const adminUser = getUserByUsername.get('admin') as { id: string } | undefined;
    if (adminUser) {
      const noteCount = (getNoteCount.get(adminUser.id) as { count: number }).count;
      if (noteCount === 0) {
        for (let i = 1; i <= 5; i++) {
          insertNote.run(crypto.randomUUID(), `Sample Note ${i}`, i, adminUser.id);
        }
        console.log('✅ Seeded 5 initial notes for "admin"');
      }
    }
  } catch (error) {
    console.error('Failed to seed initial notes:', error);
  }

  // Seed PageUrl
  try {
    const pageUrlCount = (getPageUrlCount.get() as { count: number }).count;
    if (pageUrlCount === 0) {
      insertPageUrl.run(crypto.randomUUID(), 'https://github.com', '/github');
      console.log('✅ Seeded 1 initial PageUrl');
    }
  } catch (error) {
    console.error('Failed to seed initial PageUrl:', error);
  }
}

// Initialize on first import
initDb();

export default db;
