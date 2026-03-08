# Verification

**Objective:** Validate that the schema and model functions operate predictably.

**Steps:**
1. Create a temporary script (e.g., `db/verify-entities.ts`).
2. Insert a dummy `PageUrl` and retrieve it.
3. Retrieve the `admin` user from the database.
4. Insert a `Note` using the `admin`'s `id` for the `userId`.
5. Retrieve notes for the `admin` user to ensure the foreign key relationship and ordering work.
6. Verify via console logs.
