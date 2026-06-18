# Changelog

All notable changes to SalesForge are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Contacts, Quotas, Commissions, Territories, Calls, Documents, Contracts, Tickets, Surveys, Campaigns, Knowledge Base, Health Scores, AI Insights pages
- New backend controllers: contact, territory, quota, commission, call, document, contract, survey, ticket, campaign, kb, health-score, ai-scoring, search
- Full-text search service across leads, deals, orgs, users, activities
- AI lead scoring with explainable factors
- In-memory LRU cache middleware
- Job queue with retry policy
- Metrics, access log, request ID, response time middleware
- PWA manifest and service worker
- GitHub Actions CI for backend, frontend, and full stack
- Dockerfiles and docker-compose for local production stack
- Vite manual chunks for vendor splits
- Document upload with multipart support
- Product, Quote, Playbook, Win/Loss controllers with templates

### Changed
- `User` model now has a `customFields` JSON column for per-user flexible data (quotas, commissions)
- Sidebar reorganized into Search/Automation/Developer/Account groups

### Fixed
- Tickets now use `Activity.kind=TASK` with `metadata.isTicket` flag (schema-compatible)
- Knowledge Base uses `Playbook.category=kb` to avoid new schema
- Commission, Quota, Territory, Contact controllers use correct field names

## [0.1.0] - Initial release

### Added
- Initial B2B SaaS scaffold with auth, leads, deals, orgs, activities
- UptoSkills UI/UX branding (teal #00b5ad, "Lead intelligence suite")
- Demo account: `demo@salesforge.com` / `Demo1234!`
- Admin account: `realvetran@gmail.com` / `Demo1234!`
