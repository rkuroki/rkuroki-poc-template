# Initialize Database Access

**Objective:** Set up the initial SQLite database connection and the schema for the User entity.

**Steps:**
1. Create `db/index.ts` to export a database instance using `better-sqlite3`.
2. Write the required SQL schema to create the `users` table with the fields:
   - `id` (TEXT PRIMARY KEY) - UUID
   - `username` (TEXT UNIQUE NOT NULL)
   - `pwd` (TEXT NOT NULL) - Encrypted
   - `name` (TEXT) - Optional
3. Configure `journal_mode = WAL` and `foreign_keys = ON` if appropriate.
