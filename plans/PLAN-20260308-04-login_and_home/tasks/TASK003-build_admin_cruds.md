# Build Admin CRUDs

**Objective:** Provide basic management functionality for the Admin account over existing entities.

**Steps:**
1. Create page components reflecting CRUD operations for Admin:
   - `app/home/users/page.tsx`
   - `app/home/pageurls/page.tsx`
   - `app/home/notes/page.tsx`
2. Validate within these pages (or in a Layout middleware) that the interacting user holds the `admin` username.
3. Construct primitive interactive tables to List, Create, Update, and Delete rows utilizing the respective data models already defined (`db/user.model.ts`, `db/pageurl.model.ts`, `db/note.model.ts`).
