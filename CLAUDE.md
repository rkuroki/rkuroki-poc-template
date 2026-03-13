# CLAUDE.md — AI Assistant Guide for rKuroki POC Template

## Project Overview

**rKuroki POC Template** is a production-ready boilerplate for rapidly validating proof-of-concept ideas, particularly for Brazilian-market applications. It provides:

- Phone-number-based authentication (Brazilian +55 format, auto-registration on first login)
- Role-based admin/user dashboards
- Generic reusable CRUD components
- SQLite database with migrations and seed system
- PWA (Progressive Web App) support with service worker
- Client error telemetry
- Docker deployment with Nginx

**Stack**: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · SQLite (better-sqlite3) · Zod · Playwright (E2E)

---

## Essential Commands

```bash
npm run dev        # Start development server on port 3000
npm run build      # Build for production
npm start          # Run production build
npm run lint       # Run ESLint
npx playwright test  # Run E2E tests (auto-starts dev server)
docker-compose up  # Run full stack with Nginx on port 80
```

> **Important**: Stop `npm run dev` after completing tasks. Do not leave the dev server running.

---

## Repository Structure

```
/
├── app/                        # Next.js App Router
│   ├── actions/                # Server actions (auth, CRUD)
│   ├── home/                   # Protected routes (session required)
│   │   ├── feature-flags/      # Admin: feature flag management
│   │   ├── notes/              # Admin: global notes management
│   │   ├── pageurls/           # Admin: page URL management
│   │   ├── users/              # Admin: user management
│   │   └── page.tsx            # Dashboard (admin vs user view)
│   ├── mgmt/                   # Admin-only login page (username+password)
│   ├── layout.tsx              # Root layout + PWA registration
│   ├── page.tsx                # Public login/registration (phone-based)
│   ├── error.tsx               # Global error boundary with telemetry
│   └── globals.css             # Tailwind + CSS custom properties
├── components/
│   ├── crud/                   # Generic reusable CRUD UI
│   │   ├── CrudLayout.tsx      # Container: form + table
│   │   ├── CrudForm.tsx        # Generic create/edit form
│   │   └── CrudTable.tsx       # Table with edit/delete actions
│   ├── AdminDashboard.tsx
│   ├── UserDashboard.tsx
│   ├── SubmitButton.tsx        # Loading-state-aware submit button
│   └── PwaRegister.tsx         # Service worker registration
├── db/
│   ├── index.ts                # SQLite connection + init
│   ├── migrate.ts              # Migration runner + seeder
│   ├── *.model.ts              # Entity CRUD operations (user, note, pageurl, featureFlag)
│   ├── migrations/             # SQL migration files (numbered, append-only)
│   └── seeds/                  # SQL seed files (admin + dev data)
├── lib/
│   ├── session.ts              # Cookie-based session management
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── e2e/                        # Playwright E2E tests
├── public/                     # Static assets, PWA manifest, service worker
├── middleware.ts               # Rate limiting, auth guard, security headers
├── next.config.ts
├── playwright.config.ts
├── docker-compose.yml
├── Dockerfile
└── nginx.conf
```

---

## Architecture & Patterns

### Authentication

Two separate authentication flows exist:

| Route | Flow | Who |
|-------|------|-----|
| `/` | Phone number → auto-register on first visit, password on subsequent | Regular users |
| `/mgmt` | Username + password, no auto-registration | Admin only |

Session is stored as an httpOnly cookie (1-week expiry, secure in production). The session contains `userId` and `username`.

**Admin detection**: A user is admin if their `username === "admin"`.

### Route Protection

`middleware.ts` guards `/home/*` routes — unauthenticated requests redirect to `/`. It also applies:
- In-memory rate limiting (100 req/min prod, 1000 req/min dev)
- Security headers (X-Frame-Options, X-Content-Type-Options, HSTS)

### Server Actions Pattern

All data mutations go through Next.js Server Actions in `app/actions/`. Pattern:

```typescript
'use server'

export async function upsertEntityAction(prevState: unknown, formData: FormData) {
  // 1. Parse & validate with Zod
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  // 2. Auth check if needed
  const session = await getSession()
  if (!session) return { error: 'Não autorizado' }

  // 3. Call model function
  upsertEntity(parsed.data)

  // 4. Revalidate cache
  revalidatePath('/home/entity')
  return { success: true }
}
```

Forms use the `useActionState` hook with a `SubmitButton` component for loading state.

### CRUD Component System

Three composable components in `components/crud/` enable quick CRUD pages:

- **`CrudLayout`**: Wraps a form and a table, handles `editingId` state
- **`CrudForm`**: Renders labeled inputs from a field config array, handles create/edit modes
- **`CrudTable`**: Renders rows with Edit/Delete buttons

To add a new entity admin page:
1. Create model in `db/<entity>.model.ts`
2. Create server actions in `app/actions/<entity>.ts`
3. Add route `app/home/<entity>/page.tsx` using `CrudLayout`
4. Add nav link to `AdminDashboard.tsx`

### Database Layer

SQLite via `better-sqlite3` (synchronous API — no `await` needed).

- **Connection**: `db/index.ts` exports a singleton `db` instance; migrations run on startup
- **Migrations**: Numbered SQL files in `db/migrations/` — applied once, tracked in `_migrations` table. **Never edit existing migration files; always add new ones.**
- **Seeds**: `db/seeds/` — `001_admin_seed.sql` always runs; `002_dev_seed.sql` only in non-production

**Model convention** (`db/<entity>.model.ts`):

```typescript
export function getEntities(): Entity[] { ... }
export function upsertEntity(data: EntityInput): void { ... }
export function deleteEntity(id: string): void { ... }
```

### Styling

- **Tailwind CSS 4** via PostCSS — use utility classes directly
- CSS custom properties defined in `app/globals.css` for theme colors (light + dark)
- `cn()` helper from `lib/utils.ts` for conditional class merging:
  ```typescript
  import { cn } from '@/lib/utils'
  className={cn('base-class', condition && 'conditional-class')}
  ```

---

## Key Conventions

### Naming

| Item | Convention | Example |
|------|-----------|---------|
| Server actions | camelCase, verb-first | `loginOrRegisterAction`, `upsertUserAction` |
| Model files | `<entity>.model.ts` | `user.model.ts` |
| DB columns | snake_case | `user_id`, `created_at` |
| Components | PascalCase | `CrudLayout.tsx` |
| Routes | lowercase-hyphen | `/feature-flags` |
| Path alias | `@/*` = project root | `import { cn } from '@/lib/utils'` |

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- Zod schemas for all external input validation (forms, API boundaries)
- `'use server'` / `'use client'` directives are mandatory at file top when needed
- Avoid `any` — type everything properly

### Localization

All UI-facing text is in **Brazilian Portuguese**. Maintain this when adding features.

- Error messages: e.g., `"Usuário não encontrado"`, `"Não autorizado"`
- Labels and buttons: e.g., `"Entrar"`, `"Salvar"`, `"Cancelar"`

### Phone Numbers

Brazilian phone format is enforced: `+55 11 9XXXX XXXX` (13 digits after `+`). The login form auto-formats input. Validation: total length 13 digits (excluding `+`).

---

## Database Schema

```sql
users        (id TEXT PK, username TEXT UNIQUE, pwd TEXT, name TEXT)
notes        (id TEXT PK, note TEXT, order INTEGER, userId TEXT FK→users)
page_urls    (id TEXT PK, url TEXT, path TEXT)
feature_flags (id INTEGER PK AUTO, name TEXT UNIQUE, value TEXT, created_at DATETIME)
client_errors (id INTEGER PK AUTO, error_message TEXT, stack_trace TEXT,
               pathname TEXT, user_agent TEXT, created_at DATETIME)
_migrations  (filename TEXT PK)  -- internal, do not modify
```

**Default credentials** (from seeds):
- Admin: `username=admin`, password set by seed
- Dev user: `username=+5511911112222`, with sample notes

---

## Testing

**E2E (Playwright)** — tests in `e2e/`:
- Configured for Mobile Chrome (Pixel 5) and Desktop Chrome
- Auto-starts dev server if not already running
- Run: `npx playwright test`
- Config: `playwright.config.ts`

There are currently minimal tests (`e2e/home.spec.ts` covers the login page). Expand E2E coverage when adding significant new flows.

---

## Deployment

### Docker

```bash
docker-compose up   # Next.js (port 3000 internal) + Nginx (port 80 external)
```

- Multi-stage Dockerfile (deps → build → minimal Alpine runner)
- Runs as non-root `nextjs:nodejs` user
- SQLite data persisted via Docker volume at `/.data/`

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NODE_ENV` | Environment | `development` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` in Docker |

No `.env` file is required for the base template — SQLite is embedded.

---

## Files to Ignore

- `TODO.md` — personal user tracking, not relevant to the codebase
- `.data/` — generated SQLite database files, not committed

---

## Adding New Features

### New Entity (Full CRUD)

1. **Migration**: Add `db/migrations/000N_add_<entity>.sql`
2. **Model**: Create `db/<entity>.model.ts` with get/upsert/delete functions
3. **Actions**: Create `app/actions/<entity>.ts` with server actions
4. **Page**: Add `app/home/<entity>/page.tsx` using `CrudLayout`
5. **Nav**: Add link in `components/AdminDashboard.tsx`

### New Feature Flag

Insert into `feature_flags` table or manage via `/home/feature-flags` admin panel. Read flag value in server code via the `featureFlag.model.ts` functions.

### New Migration

Create a new numbered file: `db/migrations/000N_description.sql`. It will be automatically applied on next startup. **Never modify existing migration files.**
