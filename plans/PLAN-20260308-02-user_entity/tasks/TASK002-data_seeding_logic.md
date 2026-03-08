# Implement Data Seeding Logic

**Objective:** Ensure required users are created natively on initialization.

**Steps:**
1. Inside `db/index.ts`, create an initialization script/function.
2. Ensure `bcryptjs` dependency is installed to hash passwords securely.
3. Automatically seed an "admin" user (`admin123`) if they do not exist, universally for all environments.
4. Automatically seed a generic environment-specific user (`+5511911112222` / `123456`) if the existing system runs under the `development` environment.
5. Invoke the database initialization securely during the Next.js server start cycle.
