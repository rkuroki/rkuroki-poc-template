# PLAN-20260308-06: Robustness, Stability and Cleanup

The project has achieved strict database structural implementations, but running a native production `npm run build` process surfaced architectural instability causing both UI crashes and Next.js compiler errors.

## The Issues
1. **Middleware Compilation Errors**: Next.js dropped the native `request.ip` interface. This generates a hard `Type Error`, failing the production build.
2. **False-Positive API Rate Limiting**: The `middleware.ts` uses a rudimentary in-memory map enforcing `10 requests/min`. Next.js development Hot-Reloads instantly burn through this limit natively, causing blocking transparently to the user.
3. **No Error Boundaries**: The Next.js `/app` router defaults to hard crashes (as seen before with Hydration and 500 bugs) when a component errors out because it inherently lacks `error.tsx` boundaries intercepting the error natively into the UI.
4. **No Frontend Error Telemetry**: When a client-side exception is caught, there is currently no way to persist or analyze it server-side.
5. **Dead Legacy Modules**: There are lingering implementations (like `lib/db.ts`) connected to older architectures.

## Proposed Resolution

### TASK001: Re-architect the Network Middleware
- Remove the rudimentary mapped Rate Limiter preventing hot-reloads dynamically.
- Rewrite the active route guard inside `middleware.ts` validating explicitly via `request.cookies.get('session')`.
- Redirect explicitly to `/` on failure instead of the legacy `/login`.

### TASK002: Inject Robust Error Boundaries & Telemetry
- Implement an `app/error.tsx` rendering a clean 'Application Crash' fallback button to explicitly recover client states gracefully.
- Implement an `app/global-error.tsx` wrapping the `<body>` ensuring total coverage dynamically over root layout hydration.
- Automatically capture frontend error objects in these boundary files.

### TASK003: Implement Lightweight Telemetry Service
- Create a lightweight Server Action or API endpoint (`app/actions/telemetry.ts`) that accepts a JSON stack trace and error message from the browser.
- Write the captured frontend payload to a simple `client_errors` table mapped inside our SQLite schema or append it to a daily local `.log` file, ensuring zero external vendor integrations (like Sentry) are needed.

### TASK004: Purge and Validate the Workspace
- Erase the obsolete `lib/db.ts` references cleanly.
- Verify `better-sqlite3` isn't leaking connections under load asynchronously.
- Explicitly run a sequential `npm run lint` && `npm run build` validating absolute stability.
