# Implement Data Access Models

**Objective:** Abstract queries out into simple entity functions.

**Steps:**
1. Create a specific model file `db/user.model.ts`.
2. Implement validation types utilizing `zod`.
3. Provide synchronous/prepared functions:
   - `getUserByUsername(username: string)`
   - `getUserById(id: string)`
   - `createUser(user)`
   - `updateUserPassword(id: string, newEncryptedPwd: string)`
