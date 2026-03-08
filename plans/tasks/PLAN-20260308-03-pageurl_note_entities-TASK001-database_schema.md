# Database Schema Definitions

**Objective:** Create the tables for `PageUrl` and `Note` entities in the SQLite database.

**Steps:**
1. Open `db/index.ts`.
2. Update the initialization script to include a `CREATE TABLE IF NOT EXISTS page_urls` statement.
   - `id` TEXT PRIMARY KEY (UUID)
   - `url` TEXT NOT NULL
   - `path` TEXT NOT NULL
3. Update the initialization script to include a `CREATE TABLE IF NOT EXISTS notes` statement.
   - `id` TEXT PRIMARY KEY (UUID)
   - `note` TEXT NOT NULL
   - `order` INTEGER NOT NULL DEFAULT 0
   - `userId` TEXT NOT NULL (Foreign Key referencing `users(id)`)
4. Ensure `PRAGMA foreign_keys = ON;` is still active to enforce the relationship.
