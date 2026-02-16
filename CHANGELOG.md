# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-15

### Added
- Added modular backend architecture under `lib/` for config, AI provider, DB connection, migrations, and repositories.
- Added Vitest + Testing Library test suite and CI workflow (`.github/workflows/ci.yml`).
- Added standard OSS files: `LICENSE` (MIT), `.env.example`, and this `CHANGELOG.md`.
- Added quick prompt one-click templates and grouped message timeline UI for Apple Watch + mobile.

### Changed
- Refactored `app/api/chat/route.ts` and `app/api/messages/route.ts` into thin controllers with validation and structured error handling.
- Migrated DB access to repository pattern with idempotent migrations and indexed `timestamp`.
- Rebuilt frontend layout and visual system into componentized architecture with cyber-neon dark theme.
- Upgraded project metadata in `package.json` (license/repository/homepage/bugs/keywords/engines/scripts).
- Updated README and deployment docs to bilingual format (Chinese/English).

### Security
- Removed all plaintext API key examples from docs/scripts and replaced with placeholders.
- Added explicit guidance to rotate compromised keys immediately and never commit secrets.

### Compatibility
- Kept API contract compatible:
  - `POST /api/chat` still accepts `{ message }` and returns `{ content }` or `{ error }`.
  - `GET /api/messages` still returns message list.
  - `POST /api/messages` still accepts `{ messages }` and returns `{ success: true }`.

### Notes
- Includes previous local commit `e102107` (`fix: remove duplicate minHeight`) in this release line.
