# Plan: User Entity and Data Seeding

## Goal Description
Create the first application entity: `User`, and set up the foundation for SQLite database access using `better-sqlite3`. The `User` entity requires an `id` (UUID), `username` (unique string), `pwd` (encrypted string), and an optional `name`.

The database initialization must ensure:
1. The `users` table is created if it does not exist.
2. The initial `admin` user (with password `admin123`) is seeded if missing, in **all** environments (so that the password can later be changed in a production setting).
3. A `seed` development user (`+5511911112222` with password `123456`) is seeded if missing, but **only** when running in the development environment.

## Proposed Changes

### Database Setup and Seeding
#### [NEW] `db/index.ts`
- Create and export a singleton connection to the SQLite database using `better-sqlite3`.
- Set beneficial SQLite PRAGMAs (e.g., `journal_mode = WAL`, `foreign_keys = ON`).
- Create an `initDb` function that is called at server startup to:
  - Create the `users` table (using `CREATE TABLE IF NOT EXISTS`).
  - Hash passwords using `bcryptjs` and insert the `admin` user if no user with that username exists.
  - Check the `NODE_ENV` and, if it is `'development'`, hash and insert the seed user `+5511911112222`.

### Data Access Layer
#### [NEW] `db/user.model.ts`
- Implement basic data access operations, utilizing `zod` for any necessary runtime payload validation before inserting:
  - `getUserById(id: string)`
  - `getUserByUsername(username: string)`
  - `createUser(user: UserInsertPayload)`
  - `updateUserPassword(id: string, newEncryptedPwd: string)`

## Verification Plan
### Automated Tests
- Playwright tests to ensure the application starts without crashing and that database setup occurs correctly on first boot.

### Manual Verification
- Start `npm run dev` and ensure the `initDb()` script executes without errors.
- Connect to the newly created `.sqlite` file using a SQLite viewer or REPL.
- Verify that both the `admin` user and the `+5511911112222` seed user are present and that their `pwd` fields have been properly hashed with bcrypt.
