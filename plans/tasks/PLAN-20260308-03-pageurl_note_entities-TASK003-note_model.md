# Create Note Model

**Objective:** Implement data access operations for the `Note` entity.

**Steps:**
1. Create `db/note.model.ts`.
2. Define TypeScript types and Zod schemas for `Note`.
3. Implement `getNotesByUserId(userId: string)`, ensuring results are ordered by the `order` column.
4. Implement `getNoteById(id: string)`.
5. Implement `createNote(userId: string, payload)`.
6. Implement `updateNote` (to update text or order).
7. Implement `deleteNote()`.
