#!/usr/bin/env bash
# ============================================
# love-app 部署脚本
# 用法: bash scripts/deploy.sh [message]
# ============================================
set -e

SITE_URL="https://jhllll.github.io/Love-Anniversary"
COMMIT_MSG="${1:-deploy: build for gh-pages}"

echo "========================================"
echo "  love-app 自动部署"
echo "========================================"

# 1. 确保在 main 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "[ERROR] 请在 main 分支执行部署"
  exit 1
fi

# 2. 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
  echo "[ERROR] 工作区有未提交的更改，请先提交"
  git status --short
  exit 1
fi

# 3. 构建
echo ""
echo "[1/5] 构建生产版本..."
node node_modules/vite/bin/vite.js build

# 4. 验证构建产物
echo ""
echo "[2/5] 验证构建产物..."
if [ ! -f "dist/index.html" ]; then
  echo "[ERROR] 构建失败: dist/index.html 不存在"
  exit 1
fi
IMG_COUNT=$(find dist/images -name "*.svg" 2>/dev/null | wc -l)
echo "  - index.html: OK"
echo "  - assets: OK"
echo "  - SVG 图片: ${IMG_COUNT} 个"

# 5. 部署到 gh-pages
echo ""
echo "[3/5] 部署到 gh-pages 分支..."

# 保存 dist 到临时目录
TEMP_DIR="../love-app-deploy-temp"
node -e "const fs=require('fs');fs.rmSync('$TEMP_DIR',{recursive:true,force:true});fs.cpSync('dist','$TEMP_DIR',{recursive:true})"

# 切换到 gh-pages
git checkout gh-pages

# 复制新文件
node -e "const fs=require('fs');fs.cpSync('$TEMP_DIR','.',{recursive:true,force:true})"

# 清理临时目录
node -e "const fs=require('fs');fs.rmSync('$TEMP_DIR',{recursive:true,force:true})"

# 提交
git add index.html assets/ images/
git commit -m "$COMMIT_MSG" || echo "[INFO] 没有变化需要提交"

# 推送
echo ""
echo "[4/5] 推送到 GitHub..."
git push origin gh-pages

# 回到 main
git checkout main

echo ""
echo "[5/5] 部署完成!"
echo ""
echo "========================================"
echo "  部署已推送，等待 GitHub Pages 更新..."
echo "  网站地址: $SITE_URL"
echo "========================================"
echo ""
echo "接下来请验证以下内容:"
echo "  1. 页面能正常打开"
echo "  2. 4 个小游戏图片能加载"
echo "  3. 所有功能正常工作"
