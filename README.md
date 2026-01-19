# Apple Watch AI Chat

适配 Apple Watch 的 Web AI 学习助手（396 x 484）

## 功能特点

- 🎯 高考题目解答（完整答案 + 详细解析）
- 🌐 中英文翻译
- 📝 作文范文
- 📐 数学/物理/化学公式讲解
- 📱 Apple Watch 屏幕适配
- 🌙 暗黑主题 + 极简设计
- 💾 本地数据库存储（SQLite）
- 🔄 多设备数据同步
- ✨ Markdown + LaTeX 公式渲染

## 技术栈

- Next.js 14
- TypeScript
- Better-SQLite3
- React Markdown
- KaTeX (LaTeX 渲染)

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

访问 http://localhost:3000

## 构建

```bash
npm run build
npm start
```

## 部署到 Coolify

### 快速开始

1. **推送代码到 Git 仓库**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main
```

2. **在 Coolify 中配置**
   - 创建新应用 → 选择你的 Git 仓库
   - **Build Pack:** Dockerfile
   - **Port:** 3000
   - **环境变量:**
     ```
     API_KEY=sk-isf454xt7lpe6h7o
     API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions
     ```
   - **持久化存储（重要）:**
     - Source: `/app/data`
     - Destination: `/data`

3. **点击 Deploy**

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

---

## 数据库

应用使用 SQLite 本地数据库，数据存储在 `data/chat.db`

确保 `data` 目录有写入权限：
```bash
mkdir -p data
chmod 755 data
```

## 屏幕适配

- 宽度：396px
- 高度：484px
- 极简设计，减少 padding
- 暗黑主题

## API 配置

使用 DeepSeek V3.2 模型，通过 Infini AI 接口调用。

API Key 已配置在 `.env.local` 文件中。
