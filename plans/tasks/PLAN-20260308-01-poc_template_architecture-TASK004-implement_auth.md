# Implement Authentication & Security

**Objective:** Implement minimalist security and a frictionless phone/password authentication flow.

**Steps:**
1. Construct the login UI via shadcn/ui that handles Mobile Phone Number and Password entry.
2. Implement backend login logic (hashing passwords with bcrypt/Argon2 algorithm before DB insertion and executing verification functions).
3. Setup robust session management assigning secure, `HTTP-only` cookies securely across state.
4. Ensure standard input validation boundaries (e.g. Zod schemas parsing API payloads).
5. Build a lightweight Next.js middleware enforcing basic rate-limiting for the login route and configure required HTTP Security Headers in `next.config.ts`.
