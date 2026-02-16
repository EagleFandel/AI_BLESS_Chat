# Deployment Guide (Coolify + Docker)

> This document uses placeholder secrets only.  
> 本文仅使用占位符示例，禁止提交真实密钥。

## 1) Deploy via Git repository (Recommended)

### Step 1: Push source code

```bash
git add .
git commit -m "release: prepare deployment"
git push origin main
```

### Step 2: Create Coolify application

- Resource Type: `Application`
- Build Pack: `Dockerfile`
- Port: `3000`

### Step 3: Set environment variables

```env
API_KEY=your_real_api_key
API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions
AI_MODEL=deepseek-v3.2
CHAT_DB_PATH=data/chat.db
NODE_ENV=production
```

### Step 4: Configure persistent storage

Create a storage/volume mapping in Coolify:

- Source path: `/app/data`
- Destination path: `/data` (or your preferred host path)
- Type: volume

### Step 5: Deploy

Click **Deploy** in Coolify.

---

## 2) Deploy with Docker Compose

### docker-compose.yml

`docker-compose.yml` already maps environment variables and `./data:/app/data`.

### Run

```bash
docker compose up -d --build
```

---

## 3) Verify deployment

After deployment, verify:

- Chat page loads on assigned domain/IP.
- `GET /api/messages` returns `200`.
- Sending a message stores and reads back records from SQLite.
- `data/chat.db` persists after container restart.

---

## 4) Troubleshooting

### Check logs

```bash
docker logs <container-id>
```

### Check environment variables

```bash
docker exec <container-id> env | grep -E "API_|CHAT_DB_PATH|AI_MODEL"
```

### Check file permissions

```bash
ls -la data/
```

---

## 5) Security checklist

- Do not hard-code secrets in source code or docs.
- Store production keys in Coolify secret variables.
- Rotate keys immediately if leaked in chat/docs/git history.
- Restrict repository write access and protect default branch.

---

## 6) References

- Coolify docs: https://coolify.io/docs
- Next.js deployment docs: https://nextjs.org/docs/deployment
