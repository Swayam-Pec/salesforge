# Contributing to SalesForge

Thanks for your interest in SalesForge! This is an internal/private B2B SaaS platform; contributions are reviewed by the core team.

## Workflow

1. Fork or branch off `main`.
2. Make small, focused commits with conventional prefixes: `feat:`, `fix:`, `perf:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`.
3. Add a clear subject line (50 chars) and descriptive body when needed.
4. Open a pull request against `main`.
5. CI must be green (backend + frontend workflows).

## Backend

- Stack: Node 20, Express 5, Prisma 6, PostgreSQL 16
- Code style: 2-space indent, single quotes, no semicolons, prefer async/await
- New routes go in `backend/routes/`, logic in `backend/controllers/`, middleware in `backend/middleware/`
- Never add new Prisma models for features that can use `customFields` JSON
- All controllers must use `asyncHandler` and `response.success` helpers
- All tenant-scoped routes must use `protect` + `tenantScope` middleware

## Frontend

- Stack: React 19, Vite 7, TailwindCSS 4, Lucide icons, Recharts
- Pages live in `frontend/src/pages/Dashboard/`
- Use UptoHooks (`UptoPage`, `UptoHero`, `UptoCard`, `UptoButton`, `UptoInput`, etc.) — do not invent new layout primitives
- API calls go through `frontend/src/services/index.js` — never use raw `axios` in pages
- Brand: teal `#00b5ad`, accent orange `#e76937`, "UptoSkills" sidebar, "Lead intelligence suite" tagline

## Schema migrations

- Always run `npx prisma migrate dev --name <name>` from `backend/`
- Commit the generated SQL file in `prisma/migrations/`
- Never edit a committed migration; create a new one instead
