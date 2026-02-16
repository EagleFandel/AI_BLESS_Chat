# v0.2.0 Release Notes

Release date: 2026-02-15

## Highlights | 亮点

- Full architecture refactor across API, DB, and UI while keeping external API contracts compatible.
- New cyber-neon dark visual design optimized for Apple Watch and mobile portrait.
- Added quick prompt one-click workflow and grouped timeline messages.

## Refactor Scope | 重构范围

- API:
  - `app/api/chat/route.ts` and `app/api/messages/route.ts` converted to thin controllers.
  - Shared business logic moved into `lib/services`, `lib/ai`, `lib/config`, and `lib/db`.
- DB:
  - Added idempotent migrations and timestamp index.
  - Added repository with transaction-based batch writes.
- Frontend:
  - Replaced monolithic page with componentized chat shell architecture.
  - Removed heavy inline styles, introduced structured theme variables.

## Compatibility | 兼容性

- Preserved API contracts:
  - `POST /api/chat` accepts `{ message }`, returns `{ content }` or `{ error }`.
  - `GET /api/messages` returns message list.
  - `POST /api/messages` accepts `{ messages }`, returns `{ success: true }`.
- Existing SQLite data can be used directly with zero manual migration.

## OSS & Security | 开源与安全

- Added `LICENSE` (MIT), `.env.example`, and `CHANGELOG.md`.
- Removed plaintext key examples from docs and scripts.
- Added clear policy: never commit secrets, rotate any leaked key immediately.

## Upgrade Notes | 升级说明

- New optional env vars:
  - `API_URL` (default: Infini endpoint)
  - `AI_MODEL` (default: `deepseek-v3.2`)
  - `CHAT_DB_PATH` (default: `data/chat.db`)
- Required env var remains `API_KEY`.

## Verification | 验证

- Local gates:
  - `npm run lint`
  - `npm run test:ci`
  - `npm run build`
- API smoke checks:
  - `GET /api/messages` 200
  - `POST /api/messages` writes and reads records
  - `POST /api/chat` works with `API_KEY` and returns standard error when missing
