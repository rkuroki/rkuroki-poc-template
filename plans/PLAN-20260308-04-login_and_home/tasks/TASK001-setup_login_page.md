# Setup Login UI and Auto-Registration

**Objective:** Build the root `/` route displaying the authentication form.

**Steps:**
1. Update/Create `app/page.tsx`.
2. Implement a client-side form using React state (or generic FormData) with two inputs: "Celular" and "Senha".
3. Apply a visual mask (`+55 11 9 8888 7777`) to "Celular".
4. Set the initial text value to `+55 11 `.
5. On form submit (or Server Action), sanitize the string (remove spaces).
6. Validate the sanitized string is exactly 14 characters (starting with `+55`). Trigger a UI error if it fails.
7. Implement Server Action logic: Look up the user by `getUserByUsername`. If the user does not exist, use `createUser` to seamlessly register them using the generic password `123456`. Wait till authentication logic integrates a session cookie to securely redirect them to `/home`.
