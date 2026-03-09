# TASK004: Lightweight Frontend Telemetry

As part of the robustness and error boundary implementation, we must securely collect the exact errors a user experiences on the client-side without relying on heavy external SaaS dependencies.

1. **Database Migration Pipeline (`db/migrations/0002_add_telemetry_table.sql`):**
   - Create a new migration file hooking into our new execution runner.
   - Establish a simple `client_errors` logging table containing: `id`, `message`, `stack_trace`, `url`, `user_agent`, and `created_at`.
   
2. **Server Action Logging (`app/actions/telemetry.ts`):**
   - Implement `logClientError(payload: ErrorPayload)` directly consuming `db/index.ts`.
   - Prevent spam/abuse by checking constraints.

3. **Hook into React Boundaries:**
   - Execute the server action silently from inside `app/error.tsx` and `app/global-error.tsx` whenever their native `useEffect(() => { ... }, [error])` components catch a crash.
