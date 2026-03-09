# Create Migration Engine

**Objective:** Extract the existing schema creation logic into a scalable, file-based migration system.

**Steps:**
1. Setup standard directory `db/migrations`.
2. Extract the current raw SQL `CREATE TABLE IF NOT EXISTS` schemas from `db/index.ts` and place them definitively inside `db/migrations/0001_initial_schema.sql`.
3. Create `db/migrate.ts`.
4. Implement logic establishing the internal `_migrations` tracker table.
5. Implement logic utilizing Node's `fs` to read `.sql` files consecutively, evaluating against the `_migrations` registry, and cleanly executing `db.transaction(() => db.exec(file))(db)` on un-applied scripts cleanly.
6. Refactor `db/index.ts` to explicitly invoke the `migrate()` operation sequentially before bootstrapping the `initDb()` data-seeding method.
7. Extract the seeds to .sql files inside `db/seeds` directory.