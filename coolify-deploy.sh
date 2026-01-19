#!/bin/bash

echo "🚀 准备部署到 Coolify..."

# 检查是否已初始化 git
if [ ! -d .git ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit for Coolify deployment"
fi

echo ""
echo "✅ 部署准备完成！"
echo ""
echo "📋 下一步操作："
echo ""
echo "1️⃣  推送代码到 Git 仓库："
echo "   git remote add origin <你的仓库地址>"
echo "   git push -u origin main"
echo ""
echo "2️⃣  在 Coolify 中创建新应用："
echo "   - 类型: Application"
echo "   - 构建方式: Dockerfile"
echo "   - 端口: 3000"
echo ""
echo "3️⃣  添加环境变量："
echo "   API_KEY=sk-isf454xt7lpe6h7o"
echo "   API_URL=https://cloud.infini-ai.com/maas/v1/chat/completions"
echo ""
echo "4️⃣  配置持久化存储（重要！）："
echo "   Source: /app/data"
echo "   Destination: /data"
echo ""
echo "5️⃣  点击 Deploy 按钮"
echo ""
echo "📖 详细说明请查看 DEPLOY.md 文件"
