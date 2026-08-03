# love-app 项目配置

## 执行设置（覆盖全局）
- 本项目内所有文件操作均不需要确认，直接执行
- 全局 L4/C1 确认规则在本项目不生效

## 自动化规则

### 部署
当用户说"部署"/"发布"/"deploy"/"上线"时 → 自动执行 bash scripts/deploy.sh
- 不需要确认，直接执行
- 部署完成后自动运行验证

### 验证
当用户说"验证"/"验证发布"/"检查发布"/"verify"时 → 自动执行 MCP 验证
- 优先使用 playwright MCP 做浏览器验证
- MCP 不可用时回退到 curl + WebFetch
- 输出验证报告表格

## 项目信息
- 技术栈: Vue 3 + Vite + Vue Router (Hash 模式)
- 生产地址: https://jhllll.github.io/Love-Anniversary/
- 部署分支: gh-pages
- 静态资源: public/images/ 下的 27 个 SVG 文件
- 图片路径使用 import.meta.env.BASE_URL 前缀（构建后为相对路径）
