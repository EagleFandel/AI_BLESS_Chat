# AI_BLESS Chat

Apple Watch and mobile optimized AI tutor chat app, built with Next.js 14 + TypeScript + SQLite.  
面向 Apple Watch 与手机双场景的 AI 学习助手，支持高考问答、翻译、作文、公式讲解。

## Highlights | 亮点

- API compatible refactor with modular backend architecture.
- Cyber-neon dark UI redesign with message grouping and quick prompts.
- Local SQLite persistence with idempotent schema migration.
- Markdown + LaTeX rendering for assistant answers.
- Vitest + Testing Library tests and GitHub Actions CI.

## Tech Stack | 技术栈

- Next.js 14
- TypeScript
- better-sqlite3
- React Markdown + remark-math + rehype-katex
- Vitest + React Testing Library

## Project Structure | 目录结构

```text
app/
  api/
    chat/route.ts
    messages/route.ts
  components/chat/
lib/
  ai/
  config/
  db/
  services/
  types/
```

## Quick Start | 快速开始

1. Install dependencies | 安装依赖

```bash
npm install
```

2. Create env file | 创建环境变量文件

```bash
cp .env.example .env.local
```

3. Fill in your real `API_KEY` locally (never commit it).  
在本地填写真实 `API_KEY`（禁止提交到仓库）。

4. Start development server | 启动开发环境

```bash
npm run dev
```

Visit | 访问: http://localhost:3000

## Environment Variables | 环境变量

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `API_KEY` | Yes | - | Upstream AI API token |
| `API_URL` | No | `https://cloud.infini-ai.com/maas/v1/chat/completions` | Upstream chat completion endpoint |
| `AI_MODEL` | No | `deepseek-v3.2` | Upstream model name |
| `CHAT_DB_PATH` | No | `data/chat.db` | SQLite database path |

## Scripts

- `npm run dev`: run local dev server
- `npm run lint`: run lint checks
- `npm run test`: run tests in watch mode
- `npm run test:ci`: run tests once with coverage
- `npm run build`: production build
- `npm run start`: start production server

## Deployment | 部署

- See `DEPLOY.md` for Coolify and Docker deployment steps.
- Use `.env` / platform secret manager to configure keys.
- Configure persistent storage for `data/` to keep chat history.

## Security Notice | 安全说明

- Never commit real secrets (`API_KEY`, tokens, credentials).
- If any key was exposed in git history, rotate it immediately at the provider side.
- Keep `.env.example` as placeholder values only.

## Release Notes Template | 发布说明结构

For each release, include:

1. Highlights / 亮点
2. Refactor Scope / 重构范围
3. Compatibility / 兼容性
4. OSS & Security / 开源与安全
5. Upgrade Notes / 升级说明
6. Verification / 验证结果

## Contributing | 贡献

Issues and pull requests are welcome.  
欢迎提交 Issue 与 PR。

## License

MIT. See `LICENSE`.
