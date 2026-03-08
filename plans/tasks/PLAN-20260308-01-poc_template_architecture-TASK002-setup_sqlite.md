# Setup SQLite Database

**Objective:** Implement local SQLite persistence without external database services.

**Steps:**
1. Configure a directory mapped specifically for database persistence (e.g., `db/`).
2. Integrate a SQLite driver (like `better-sqlite3` or Prisma using SQLite provider) and set up the connection within Node.js.
3. Establish the initial database schema to support future authentication, specifically a `Users` table with phone number and password-hash properties.
4. Prepare basic database access utilities in the `lib/` directory.
