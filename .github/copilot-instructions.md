# Copilot Instructions for dreamlogapp.com

## Project Overview

This is a Next.js AI-powered dream journal application. It uses a combination of AI, database persistence, authentication, and real-time streaming to provide an intelligent journaling experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Auth | NextAuth v5 (beta) with `AUTH_SECRET` |
| Database | PostgreSQL via Drizzle ORM |
| AI | Vercel AI SDK (`ai` package) via AI Gateway |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Linting | Biome 2 via ultracite preset |
| Package Manager | pnpm 9 |
| Testing | Playwright |
| Deployment | Vercel |
| Storage | Vercel Blob |
| Cache | Redis (Upstash) |

## Project Structure

```
app/
  (auth)/         # Authentication: login, register, NextAuth config
  (chat)/         # Main chat/journal UI
lib/
  ai/             # AI SDK helpers and prompts
  db/             # Drizzle schema, migrations, queries
  editor/         # ProseMirror editor utilities
components/       # Shared React components
hooks/            # Custom React hooks
tests/            # Playwright e2e tests
```

## Conventions

### Code Style
- Formatter: **spaces**, indent width **2** (configured in `biome.jsonc`)
- Linting and formatting via `pnpm lint` / `pnpm format` (uses `ultracite check` / `ultracite fix`)
- Biome assist is enabled for `useSortedInterfaceMembers` and `useSortedProperties` — keep TypeScript interfaces and CSS/object properties sorted
- No magic numbers, no nested ternaries (disabled in linter for this project)
- Import aliases: use `@/` for the project root

### Environment Variables
- Local development: use `.env.local` (never commit)
- Staging environment: use `.env.staging` (never commit)
- Production: configure via Vercel environment settings
- Required secrets: `AUTH_SECRET`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `REDIS_URL`, `AI_GATEWAY_API_KEY`
- `AUTH_SECRET`: generate with `openssl rand -base64 32` or https://generate-secret.vercel.app/32

### Authentication
- NextAuth v5 is configured in `app/(auth)/auth.ts`
- The `AUTH_SECRET` env var must be set; it is explicitly bound via `secret: process.env.AUTH_SECRET`
- Two credential providers: regular email/password and guest sessions
- Middleware protects routes via `app/(auth)/auth.config.ts`

### Database
- Drizzle ORM with PostgreSQL (`postgres` driver)
- Schema in `lib/db/schema.ts`, queries in `lib/db/queries.ts`
- Migrations: `pnpm db:generate` then `pnpm db:migrate`
- The build script (`pnpm build`) runs migrations automatically before `next build`

### AI Integration
- Uses Vercel AI SDK with AI Gateway
- On Vercel deployments, OIDC tokens are used automatically (no API key needed)
- For local/non-Vercel: set `AI_GATEWAY_API_KEY`

### Testing
- Playwright for end-to-end tests in `tests/`
- Run with: `pnpm test`
- Tests require `PLAYWRIGHT_TEST_BASE_URL` or set `PLAYWRIGHT=True`

## Onboarding Tasks

1. Copy `.env.example` to `.env.local` and fill in all required secrets
2. Install dependencies: `pnpm install`
3. Set up PostgreSQL and set `POSTGRES_URL` in `.env.local`
4. Run database migrations: `pnpm db:migrate`
5. Start dev server: `pnpm dev`
6. Lint code: `pnpm lint`
7. Format code: `pnpm format`

## Security Guidelines

- **Never commit** `.env.local`, `.env.staging`, or any file containing secrets
- `AUTH_SECRET` must use a cryptographically random value (≥32 bytes)
- All credentials in transit must use TLS (HTTPS)
- Passwords are hashed with bcrypt (`bcrypt-ts`) before storage
- Guest sessions are isolated and do not share data with regular users
- Database queries use parameterized statements via Drizzle ORM (no raw SQL interpolation)

## Common Commands

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Run migrations + Next.js build
pnpm lint         # Check code with Biome via ultracite
pnpm format       # Auto-fix with Biome via ultracite
pnpm db:generate  # Generate Drizzle migration files
pnpm db:migrate   # Apply pending migrations
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm test         # Run Playwright e2e tests
```
