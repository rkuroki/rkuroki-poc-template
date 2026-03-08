# Plan: Login and Home Pages

## Goal Description
Implement the initial `/` (Login/Registration) page and the `/home` dashboard.

- **Login Page (`/`)**: A single form where the username is a mobile phone number (labeled "Celular"). It enforces a specific input mask (`+55 11 9 8888 7777`) and an initial value of `+55 11`. The submitted username must be exactly 14 characters without spaces (e.g., `+5511988887777`), otherwise it shows an error.
  - *Auto-Registration*: When proceeding, if it is the user's very first access (username not found in the database), the system will automatically create the user in the `users` table with the default password `123456`.
- **Home Page (`/home`)**:
  - **Admin User**: If the logged-in user is `admin`, display a dashboard with navigation links to manage (CRUD) all system entities: `User`, `PageUrl`, and `Note`.
  - **Standard User**: If the user is not `admin`, display a simple interface with an input field and an "Adicionar" button to add a new `Note`, followed by a table listing the user's existing notes.

## Proposed Changes

### 1. Login Page and Authentication
#### [NEW/MODIFY] `app/page.tsx`
- Build the UI form containing the "Celular" input and "Senha" input.
- Implement the client-side mask and validation logic for exactly 14 characters (`^\+55\d{11}$`).
- Create an API route or Server Action for authentication logic that checks if the user exists, and if not, calls `createUser` from `db/user.model.ts` with the password `123456`.

### 2. Home Page (Conditional Rendering)
#### [NEW] `app/home/page.tsx`
- Fetch the current session (or auth state) to determine if the user is `admin` or a regular user.
- Render the `AdminDashboard` component or `UserDashboard` component conditionally.

### 3. Admin CRUDs
#### [NEW] `app/home/users/page.tsx`
#### [NEW] `app/home/pageurls/page.tsx`
#### [NEW] `app/home/notes/page.tsx`
- Create basic CRUD interfaces for the `admin` to manage entities. (These can be expanded upon in subsequent tasks).

### 4. User Dashboard
#### [NEW] `components/UserDashboard.tsx`
- Implement a form to add a note (Server Action to `createNote`).
- Fetch and display a table of the user's notes using `getNotesByUserId`.

## Verification Plan
### Manual Verification
1. Access `/` and verify the input mask works and rejects invalid mobile formats.
2. Enter a new valid mobile number, submit, and verify that the user is created in the DB with the password `123456`, and is redirected to `/home`.
3. Log in as `admin`, verify that the screen displays CRUD links, and accessing them works.
4. Log in as a standard mobile user, add a note, and verify it appears in the table correctly.
