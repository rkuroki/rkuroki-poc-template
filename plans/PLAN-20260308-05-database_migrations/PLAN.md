# Plan: Database Migrations Engine

## Goal Description
The current implementation of `db/index.ts` uses repeated `CREATE TABLE IF NOT EXISTS` commands natively embedded in the initiation sequence. This is sufficient for initial table creation but lacks the ability to execute sequential schema mutations (like adding new columns natively alongside existing production data), indexing, or running structural/transactional data migration scripts down the line.

We will create a lightweight migration mechanism built over `better-sqlite3`. It will:
1. Maintain a `migrations` table tracing which files have already executed successfully.
2. Read sequential `.sql` migration files out of a dedicated `/db/migrations/` directory on application startup.
3. Apply any un-applied structural statements inside a secure transaction.

## Proposed Changes

### Database Migration System
#### [NEW] `db/migrations/0001_initial_schema.sql`
- Extract the current `CREATE TABLE IF NOT EXISTS` commands for `users`, `page_urls`, and `notes` out of `db/index.ts` and consolidate them into this initial script.

#### [NEW] `db/migrate.ts`
- Create a synchronous helper function that:
  - Connects to the SQLite instance.
  - Ensures the native tracking table exists (`CREATE TABLE IF NOT EXISTS _migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).
  - Uses `fs.readdirSync` to read all `.sql` files within `/db/migrations/` ordered alphabetically.
  - Queries `_migrations` for existing names.
  - Executes any missing SQL files via `db.exec(fileContent)` wrapped safely in a `db.transaction()` block.
  - Logs successful executions to console.

#### [MODIFY] `db/index.ts`
- Remove all the hardcoded `CREATE TABLE` and raw DB schemas.
- Import `db/migrate.ts` and execute the migration function immediately after the SQLite DB connection is established but before the data seeding function (`initDb`) executes.

## Verification Plan
### Automated Tests
- Create a mock test suite (or execute manually) adding `0002_test.sql` to verify transactions apply specifically unran scripts.

### Manual Verification
- Remove `.data/app.db` locally.
- Boot the generic sequence `npm run dev`.
- Ensure it securely spins up all tables (`0001_initial_schema.sql`).
- Restart the server seamlessly verifying that it registers `0001_initial_schema.sql` as already applied and safely ignores it.
