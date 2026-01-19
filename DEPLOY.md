# Coolify 部署指南

## 方法一：使用 Git 仓库部署（推荐）

### 1. 准备 Git 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main
```

### 2. 在 Coolify 中创建服务

1. 登录 Coolify 控制台
2. 点击 **+ New Resource** → **Application**
3. 选择 **Public Repository** 或 **Private Repository**
4. 输入你的 Git 仓库地址

### 3. 配置构建设置

**Build Pack:** Dockerfile

**Port:** 3000

**Environment Variables（环境变量）:**
```
API_KEY=sk-isf454xt7lpe6h7o
API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions
NODE_ENV=production
```

### 4. 配置持久化存储

在 **Storages** 部分添加：
- **Source Path:** `/app/data`
- **Destination Path:** `/data` （或服务器上任意路径）
- **Type:** Volume

这样可以确保数据库文件持久化保存。

### 5. 部署

点击 **Deploy** 按钮，Coolify 会自动：
1. 拉取代码
2. 构建 Docker 镜像
3. 启动容器
4. 分配域名

---

## 方法二：使用 Docker Compose

### 1. 上传文件到服务器
```bash
scp -r . user@your-server:/path/to/app
```

### 2. 在服务器上创建 .env 文件
```bash
cd /path/to/app
cat > .env << EOF
API_KEY=sk-isf454xt7lpe6h7o
API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions
EOF
```

### 3. 创建数据目录
```bash
mkdir -p data
chmod 755 data
```

### 4. 启动服务
```bash
docker-compose up -d
```

---

## 方法三：直接在 Coolify 中配置

### 1. 创建 Application

选择 **Docker Compose** 类型

### 2. 粘贴 docker-compose.yml 内容

使用项目中的 `docker-compose.yml` 文件内容

### 3. 设置环境变量

在 Coolify 界面中添加：
- `API_KEY=sk-isf454xt7lpe6h7o`
- `API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions`

### 4. 部署

点击部署按钮

---

## 验证部署

部署成功后，访问分配的域名或 IP:3000

你应该看到：
- 暗黑主题的聊天界面
- 396 x 484 的屏幕尺寸
- 可以发送消息并获得 AI 回复
- 消息会保存在数据库中

---

## 故障排查

### 1. 检查日志
```bash
docker logs <container-id>
```

### 2. 检查数据库权限
```bash
ls -la data/
# 应该显示 nextjs 用户有写入权限
```

### 3. 检查环境变量
```bash
docker exec <container-id> env | grep API
```

### 4. 测试 API 连接
```bash
curl -X POST https://cloud.infini-ai.com/maas/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-isf454xt7lpe6h7o" \
  -d '{"model":"deepseek-v3.2","messages":[{"role":"user","content":"你好"}]}'
```

---

## 更新部署

### Git 方式
```bash
git add .
git commit -m "Update"
git push
```
Coolify 会自动检测并重新部署

### 手动方式
```bash
docker-compose down
docker-compose up -d --build
```

---

## 性能优化建议

1. **启用 Gzip 压缩**（Coolify 通常自动配置）
2. **配置 CDN**（如果需要）
3. **定期备份数据库**
   ```bash
   cp data/chat.db data/chat.db.backup
   ```

---

## 安全建议

1. ✅ API Key 已通过环境变量配置（不在代码中）
2. ✅ 使用 HTTPS（Coolify 自动配置 SSL）
3. ⚠️ 考虑添加访问密码保护（如需要）
4. ⚠️ 定期更新依赖包

---

## 监控

在 Coolify 中可以查看：
- CPU 使用率
- 内存使用率
- 网络流量
- 应用日志

---

需要帮助？检查：
- Coolify 文档: https://coolify.io/docs
- Next.js 部署文档: https://nextjs.org/docs/deployment
