# Security Policy

## Reporting a vulnerability

Email security@uptoskills.com (or open a private issue). We will acknowledge within 48 hours.

## Authentication

- JWT with HS256, 7-day expiry, refresh on activity
- Bcrypt password hashing (cost factor 12)
- 2FA TOTP support per user
- Account lockout after 5 failed logins
- Sessions tracked in DB, revocable from `/settings/sessions`

## Data protection

- All tenant data is scoped by `orgId` in the `tenant` middleware
- Row-level isolation is enforced in every controller
- Soft delete is used for users and leads (no hard delete on user records)
- GDPR endpoints: `/api/gdpr/export`, `/api/gdpr/delete`

## Reporting

- Audit log captures every privileged action (`/api/audit`)
- Activity log captures user actions (`/api/activities`)

## Secrets

- Never commit `.env` files — use `.env.example` as template
- Rotate `JWT_SECRET` quarterly
- Use environment variables for all third-party API keys

## Disclaimer

This repository is a demo/scaffold. Before production deployment:
- Rotate all secrets
- Enable rate limiting (`createRateLimiter` is in `middleware/rateLimit.js`)
- Configure CORS allowlist
- Set up database backups
- Enable HTTPS at the load balancer
