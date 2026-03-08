# Architecture Plan: rkuroki-poc-template

## 1. Objective
Design a boilerplate project called **rkuroki-poc-template** intended to quickly create small experimental web applications used to validate product ideas. The primary goals are simplicity, minimal infrastructure, fast development, good UX, and low operational overhead. It rigorously avoids over-engineering and complex architectural patterns.

## 2. Core Technology Stack
The stack focuses on a modern, unified JavaScript/TypeScript ecosystem to build a single deployable service:
- **Framework:** Next.js (Fullstack) leveraging React Server Components.
- **UI & Styling:** TailwindCSS + shadcn/ui.
- **Database:** SQLite (stored as a local file).
- **Mobile Experience:** PWA (Progressive Web App) support.
- **Testing:** Playwright for E2E testing.
- **Runtime:** Node.js.
- **Deployment:** Docker (Single Container) behind an Nginx reverse proxy.

## 3. Architecture Overview
The application follows a pragmatic monolith architecture:
- **Single Deployable Unit:** It runs as one solitary web application exposing an HTTP server on **port 3000** and is routed to via **Nginx on port 80**.
- **Unified Frontend and Backend:** Next.js serves both the views and the backend logic in one package context, avoiding the overhead of splitting them into separate deployables.
  - **React Server Components (RSC):** Utilized to fetch data directly from the SQLite database on the server, eliminating the need for complex REST or GraphQL API layers.
  - **Server Actions:** Handle form submissions and state mutations without requiring dedicated API routes.
  - **API Routes:** Reserved only for external integrations or webhook handling.
- **Database Persistence:** The database is an SQLite file that lives on the host system and is mapped into the application. This ensures data persistence without requiring a standalone database service.

## 4. Mobile Experience (PWA)
The boilerplate treats mobile usage as a first-class priority, mimicking a native mobile application environment:
- **PWA Configuration:** Includes a fully configured `manifest.json` and essential meta tags to make the web application natively installable on mobile device home screens.
- **Service Worker:** Implements a baseline caching strategy for offline support and rapid loading of static assets.
- **Mobile-Friendly UI:** The UI is seamlessly responsive. By leveraging Tailwind UI patterns, it provides an app-like feel (e.g., touch-friendly tap targets, safe area padding, and smooth transitions).

## 5. UI Strategy
To ensure rapid iteration and visually excellent interfaces:
- **TailwindCSS:** Provides utility-first styling for fast layout construction without requiring context-switching out of component files.
- **shadcn/ui:** Offers accessible, pre-built, and highly customizable UI components (buttons, dialogs, form inputs) integrated directly into the project dependencies, preventing bloated node_modules.
- **Access Control Views:**
  - **Public Pages:** Marketing pages, landing pages, and authentication views remain completely accessible from the internet.
  - **Authenticated Pages:** Protected dashboard and app logic constrained behind active session validation.

## 6. Authentication Approach
Authentication prioritizes frictionless entry suitable for POC validation:
- **Method:** Login via **mobile phone number** and a **simple password**.
- **Session Management:** Standard secure HTTP-only cookies establishing secure server-side sessions.
- **Simplicity Focus:** Zero reliance on multi-step OAuth providers, heavy identity management services (like AWS Cognito or Auth0), or social logins, keeping operational overhead strictly at zero.

## 7. Security Practices
Basic, highly pragmatic protections tailored for rapid experimentation:
- **Password Hashing:** Passwords are cryptographically hashed using standard algorithms (e.g., bcrypt or Argon2) before persistence in SQLite.
- **HTTP Security Headers:** Implemented via standard Next.js configuration (`next.config.mjs`), including Content-Security-Policy and X-Frame-Options.
- **CSRF & XSS Protection:** Inherently mitigated by React's DOM rendering behavior and Next.js Server Actions verification mechanisms.
- **Input Validation:** Employing schema validators (like Zod) across Server Actions and API forms to ensure data integrity and prevent SQL injection.
- **Rate Limiting:** A lightweight rate-limiting mechanism to safeguard authentication routes from simplistic brute-force attempts. 
- *Note: Avoids heavy Web Application Firewalls (WAF) or complex security frameworks to keep the template POC-friendly.*

## 8. Testing Strategy
A lightweight testing suite preventing test-induced fragility:
- **Primary Focus (E2E):** **Playwright** serves as the backbone of the testing stack, evaluating critical user journeys exactly as they behave in production (e.g., data persistence, login flows, content creation).
- **Unit Tests:** Strictly reserved for testing central business rules and core domain logic functions. Exhaustive test pyramids and component snapshot tests are deliberately avoided.

## 9. Project Simplicity Requirements
The project mandates clear bounds on architectural complexity:
- **Prohibited Patterns:** Microservices, decoupled backends, message brokers, elaborate dependency injection frameworks, and over-abstracted repository layers.
- **Vertical Tooling:** Encourages keeping code, styles, and data logic tightly collocated inside the app router.
- **AI-Assistance Ready:** By adhering to clean, unfragmented codebase structures and limiting dependencies, the repository provides concise and straightforward context, massively boosting the utility of AI-assisted coding tools.

## 10. Project Directory Structure
A specific folder schema tailored for next-generation planning and app layout:

```text
/
├── app/                    # Next.js App Router (Pages, Layouts, APIs)
├── components/             # Reusable UI elements (shadcn/ui)
├── lib/                    # Utilities, schemas, domain functions
├── db/                     # SQLite setup, schemas, and migration scripts
├── public/                 # Static assets, PWA manifest, service worker
├── e2e/                    # Playwright tests
├── /plans                  # AI Planning Documentation System
│   ├── /plans              # Active implementation plans
│   ├── /tasks              # Task descriptions belonging to active plans
│   └── /purge              # Old plans (ignored by AI context tools)
├── Dockerfile              # Container spec
├── next.config.ts          # Next framework config
├── package.json
└── tailwind.config.ts
```

**Planning Documentation Conventions:**
- **Plans:** `PLAN-YYYYMMDD-XX-description.md`
  - *Example:* `PLAN-20260308-01-create_entity_product.md`
- **Tasks:** `PLAN-YYYYMMDD-XX-description-TASK001-task-name.md`
  - *Example:* `PLAN-20260308-01-create_entity_product-TASK001-create_persistence.md`

## 11. Docker and Deployment
Deployment is streamlined specifically for single-instance, minimal-resource environments (like a simple VPC or VPS):
- **Dockerization:** A standard multi-stage `Dockerfile` translates the Next.js application into an optimized Node.js-based production container.
- **Container Execution:** Deployed exclusively as one Docker container instance.
- **Database Persistence:** A directory is volume-mounted from the host machine into the container running Next.js. This guarantees the SQLite file securely persists across deployments or restarts.
- **Nginx Reverse Proxy:** Nginx interfaces with external traffic on port 80/443 (handling SSL generation alongside tools like Certbot), proxying requests flawlessly to the Next.js Docker container running on expected port 3000.

## 12. Alternatives Discussion
While Next.js efficiently executes the single-container monolithic goal, alternative technologies offer distinct tradeoffs:
- **SvelteKit:**
  - *Pros:* Generates highly performant applications lacking virtual DOM overhead. Tiny client-side bundle size. Extremely streamlined and understandable state paradigms.
  - *Cons:* The styling/component ecosystem is smaller. Pre-built standard libraries (like the original React shadcn/ui) depend on unofficial community ports.
- **Remix:**
  - *Pros:* Phenomenal data mutation paradigms using raw web APIs (Actions and Loaders) which formed the inspiration for modern RSC standard features. Outstanding error mapping rules.
  - *Cons:* Requires shifting away from conventional component-based localized data fetching towards rigid route-based loaders, introducing a slight learning curve.
- **Express + React SSR:**
  - *Pros:* Infinite customization for the backend routing architecture. Completely unopinionated.
  - *Cons:* Immense operational overhead. Requires manual synchronization of Webpack/Vite build pipelines to handle hydration and SSR effectively—undermining the core objective of rapid boilerplate creation.
