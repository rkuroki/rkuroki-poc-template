# TASK001: Fix Middleware Strict Constraints

1. **Rate Limiting Adjustments:**
   - In `middleware.ts`, checking `process.env.NODE_ENV !== 'development'` or drastically increasing the `limits` integer for dev to avoid blocking Hot Module Replacement requests.
2. **Session Protection Realignment:**
   - Update the current `if (request.nextUrl.pathname.startsWith('/dashboard'))` condition to effectively guard the actual new route: `/home`.
   - Update the cookie hook to evaluate `request.cookies.get('session')` (instead of the legacy `'session_id'`).
   - Redirect unauthenticated users correctly back to `/` instead of the legacy `/login`.
