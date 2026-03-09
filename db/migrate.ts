import fs from 'fs';
import path from 'path';
import { Database } from 'better-sqlite3';

export function migrate(db: Database) {
  console.log('🔄 Running migrations...');
  
  // Ensure the migrations table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  const getApplied = db.prepare('SELECT name FROM _migrations WHERE name = ?');
  const recordMigration = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

  for (const file of files) {
    const applied = getApplied.get(file);
    if (!applied) {
      console.log(`Applying migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      const applyTransaction = db.transaction(() => {
        db.exec(sql);
        recordMigration.run(file);
      });

      try {
        applyTransaction();
        console.log(`✅ Migration ${file} applied successfully.`);
      } catch (error) {
        console.error(`❌ Error applying migration ${file}:`, error);
        throw error;
      }
    }
  }
}

export function runSeeds(db: Database) {
  const seedsDir = path.join(process.cwd(), 'db', 'seeds');
  if (!fs.existsSync(seedsDir)) return;

  const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();

  // For seeds, we can use a very similar tracking table or just execute them and ignore unique constraint errors.
  // To keep seeds idempotent, we just run their sql. The SQL seed should use INSERT OR IGNORE.
  for (const file of files) {
    if (file.includes('dev') && process.env.NODE_ENV !== 'development') {
      console.log(`Skipping development seed: ${file}`);
      continue;
    }
    console.log(`Applying seed: ${file}`);
    const filePath = path.join(seedsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    try {
      db.exec(sql);
      console.log(`✅ Seed ${file} applied successfully.`);
    } catch (e) {
      console.error(`❌ Error applying seed ${file}:`, e);
    }
  }
}
