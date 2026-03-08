# Plan: PageUrl and Note Entities

## Goal Description
Create two new entities in the application: `PageUrl` and `Note`.

- **PageUrl**: A public entity that maps URLs to paths. Only the "admin" user is permitted to manage these records through a backoffice interface.
  - Fields: `id` (UUID, Primary Key), `url` (String), `path` (String).
- **Note**: An entity representing a note created by a user, supporting ordering.
  - Fields: `id` (UUID, Primary Key), `note` (String), `order` (Integer), `userId` (UUID, Foreign Key to `users.id`).

## Proposed Changes

### Database Setup
#### [MODIFY] `db/index.ts`
- Add SQL statements to `CREATE TABLE IF NOT EXISTS page_urls` with `id`, `url`, and `path`.
- Add SQL statements to `CREATE TABLE IF NOT EXISTS notes` with `id`, `note`, `order`, and `userId`.
- Ensure the `userId` in `notes` has a Foreign Key constraint referencing `users(id)`.

### Data Access Layer
#### [NEW] `db/pageurl.model.ts`
- Implement Zod schemas for validation (`PageUrlSchema`, `PageUrlInsertPayloadSchema`).
- Create basic CRUD operations:
  - `getPageUrls()`
  - `getPageUrlById(id: string)`
  - `createPageUrl(payload: PageUrlInsertPayload)`
  - `updatePageUrl(id: string, payload: Partial<PageUrlInsertPayload>)`
  - `deletePageUrl(id: string)`

#### [NEW] `db/note.model.ts`
- Implement Zod schemas for validation (`NoteSchema`, `NoteInsertPayloadSchema`).
- Create basic CRUD operations:
  - `getNotesByUserId(userId: string)` (ordered by `order`)
  - `getNoteById(id: string)`
  - `createNote(userId: string, payload: NoteInsertPayload)`
  - `updateNote(id: string, payload: Partial<NoteInsertPayload>)`
  - `deleteNote(id: string)`

## Verification Plan
### Automated Tests
- Not currently applicable for this database layer update without UI.

### Manual Verification
- Create a test script (`db/verify-entities.ts`) to:
  - Create a test PageUrl.
  - Create a test Note belonging to the seeded `admin` user.
  - Query and print both to ensure insertions and foreign key constraints work as expected.
