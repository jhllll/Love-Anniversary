# 哄老婆开心 - 技术设计文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | love-app |
| 文档类型 | 技术设计文档（TDD） |
| 版本号 | v1.0.0 |
| 创建日期 | 2026-07-31 |
| 技术栈 | Vue 3 + Vite + Vue Router 4 |

---

## 1. 架构概览

### 1.1 整体架构

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│              <div id="app">                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│                   App.vue                    │
│         <router-view> + <Transition>        │
└──────┬───────────────────────┬──────────────┘
       │                       │
┌──────▼──────┐        ┌──────▼──────┐
│  Home.vue   │        │ Quotes.vue  │
│  (首页 /)    │◄──────►│ (/quotes)   │
│             │ 路由跳转 │             │
└──────┬──────┘        └──────┬──────┘
       │                      │
       │ 依赖                  │ 依赖
       ▼                      ▼
┌──────────────┐     ┌──────────────┐
│  组件层       │     │  组件层       │
│ HeartParticles│     │ HeartParticles│
│ Countdown... │     │ QuoteCard    │
│ ProgressRing │     └──────────────┘
│ AnnivSetter  │
└──────┬───────┘
       │
┌──────▼───────┐
│  composables │
│ useAnniv..   │
│ useQuotes    │
└──────┬───────┘
       │
┌──────▼───────┐
│  localStorage│
└──────────────┘
```

### 1.2 分层设计

| 层级 | 目录 | 职责 | 依赖方向 |
|------|------|------|----------|
| 视图层 | `src/views/` | 页面布局、组合组件 | → 组件层 + composables |
| 组件层 | `src/components/` | UI 组件，接收 props，emit 事件 | → 无（纯展示/交互） |
| 逻辑层 | `src/composables/` | 业务逻辑、数据计算、存储读写 | → localStorage + data |
| 数据层 | `src/data/` | 静态数据（情话库） | → 无 |
| 样式层 | `src/styles/` | CSS 变量、全局样式 | → 无 |
| 路由层 | `src/router/` | Hash 路由配置 | → views |

---

## 2. 路由设计

### 2.1 路由表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `views/Home.vue` | 纪念日倒计时首页 |
| `/quotes` | `views/Quotes.vue` | 每日情话页 |

### 2.2 路由配置

```js
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/quotes', component: Quotes }
]

const router = createRouter({
  history: createWebHashHistory(),  // Hash 模式，兼容 GitHub Pages
  routes
})
```

**选用 Hash 模式的原因**：GitHub Pages 不支持 SPA 的 history fallback，Hash 模式下 URL 中的 `#` 之后的部分不会发送到服务器，刷新不会 404。

### 2.3 页面过渡

```vue
<!-- App.vue -->
<router-view v-slot="{ Component }">
  <Transition name="page" mode="out-in">
    <component :is="Component" />
  </Transition>
</router-view>
```

- 进入动画：`opacity 0→1` + `translateX(30px→0)` / 0.35s ease-out
- 离开动画：`opacity 1→0` + `translateX(0→-30px)` / 0.25s ease-in

---

## 3. 组件设计

### 3.1 组件树

```
App.vue
├── Home.vue
│   ├── HeartParticles.vue (背景装饰)
│   ├── CountdownDisplay.vue (天数 + 时长)
│   ├── ProgressRing.vue (进度环)
│   └── AnniversarySetter.vue (设置弹窗，条件渲染)
│
└── Quotes.vue
    ├── HeartParticles.vue (背景装饰)
    └── QuoteCard.vue (情话卡片，可复用)
```

### 3.2 组件详细设计

#### HeartParticles.vue

| 项目 | 说明 |
|------|------|
| 职责 | 全屏爱心飘落粒子背景（纯装饰） |
| Props | 无 |
| Events | 无 |
| 状态 | 内部 `computed` 生成 15 个粒子的随机样式（位置、速度、大小、透明度） |
| 动画 | CSS `@keyframes fall`，8-20s 线性无限循环，从顶部飘到底部 |
| 注意 | `position: fixed; pointer-events: none; aria-hidden="true"` |

#### CountdownDisplay.vue

| 项目 | 说明 |
|------|------|
| 职责 | 展示"在一起天数"大数字 + "X年X个月X天"恋爱时长 |
| Props | `days: Number` — 总天数<br>`duration: { years, months, days }` — 恋爱时长 |
| Events | 无 |
| 动画 | 数字滚动效果：`requestAnimationFrame` + ease-out cubic，1.2 秒 |
| 关键实现 | `watch` 监听 props 变化触发动画，用 `displayDays` / `displayDuration` 做中间状态 |

#### ProgressRing.vue

| 项目 | 说明 |
|------|------|
| 职责 | SVG 环形进度条，展示距离下一个纪念日的进度 |
| Props | `progress: Number` — 百分比 0-100<br>`days: Number` — 距离天数 |
| Events | 无 |
| SVG 结构 | 背景圆环（白色半透明） + 前景圆环（粉红渐变 + glow 滤镜）<br>`stroke-dasharray` / `stroke-dashoffset` 控制进度<br>`transform: rotate(-90deg)` 从顶部开始 |
| 圆心文字 | 绝对定位覆盖，显示"距离纪念日 X 天" |

#### AnniversarySetter.vue

| 项目 | 说明 |
|------|------|
| 职责 | 纪念日设置/修改弹窗 |
| Props | `visible: Boolean` — 是否显示<br>`currentDate: String` — 当前纪念日（修改时预填） |
| Events | `confirm(date)` — 确认设置<br>`close` — 关闭弹窗 |
| 交互 | 点击遮罩关闭、确认按钮提交、未选日期时按钮 disabled |
| 日期限制 | `max` 属性限定为当天 |
| 动画 | `<Transition name="modal">` 包裹，scale + opacity 过渡 |

#### QuoteCard.vue

| 项目 | 说明 |
|------|------|
| 职责 | 展示一句情话 + 收藏按钮 |
| Props | `text: String` — 情话内容<br>`favorited: Boolean` — 是否已收藏 |
| Events | `toggle-favorite` — 切换收藏状态 |
| 动效 | 进入时 `fadeInUp`，收藏时心形 `heartbeat` 动画 |
| 装饰 | 大号引号字符 `"` 在顶部作为装饰 |

---

## 4. 逻辑层设计

### 4.1 useAnniversary()

**文件**: `src/composables/useAnniversary.js`

**API 返回**:

| 成员 | 类型 | 说明 |
|------|------|------|
| `anniversary` | `Ref<string>` | 纪念日日期（ISO 格式） |
| `setAnniversary(date)` | `Function` | 设置纪念日并写入 localStorage |
| `hasAnniversary()` | `Function` | 是否已设置纪念日 |
| `daysTogether` | `ComputedRef<number>` | 在一起总天数 |
| `durationText` | `ComputedRef<{years,months,days}>` | 恋爱时长 |
| `nextAnniversary` | `ComputedRef<Date\|null>` | 下一个纪念日 Date 对象 |
| `daysUntilNext` | `ComputedRef<number>` | 距离下一个纪念日的天数 |
| `progress` | `ComputedRef<number>` | 进度百分比 0-100 |
| `nextAnniversaryLabel` | `ComputedRef<string>` | 纪念日文案标签 |

**计算逻辑（伪代码）**：

```
daysTogether:
  floor((today - anniversary) / 86400000)

durationText:
  years  = today.year  - start.year
  months = today.month - start.month
  days   = today.day   - start.day
  if days < 0: months--, days += prevMonth.days
  if months < 0: years--, months += 12

nextAnniversary:
  next = Date(today.year, start.month, start.day)
  if next <= today: next.setFullYear(today.year + 1)
  return next

daysUntilNext:
  ceil((nextAnniversary - today) / 86400000)

progress:
  total   = 本次周年日 - 上次周年日
  elapsed = today - 上次周年日
  round(elapsed / total * 100)
```

### 4.2 useQuotes()

**文件**: `src/composables/useQuotes.js`

**API 返回**:

| 成员 | 类型 | 说明 |
|------|------|------|
| `todayIndex` | `ComputedRef<number>` | 当日情话索引（哈希算法） |
| `todayQuote` | `ComputedRef<string>` | 今日推荐情话文本 |
| `getRandomQuote()` | `Function` | 获取随机情话（不重复当前） |
| `isFavorited(idx)` | `Function` | 判断索引是否已收藏 |
| `toggleFavorite(idx)` | `Function` | 切换收藏状态 |
| `favorites` | `Ref<number[]>` | 收藏索引数组 |
| `favoriteQuotes` | `ComputedRef<{index,text}[]>` | 收藏情话列表 |
| `totalQuotes` | `number` | 情话总数（30） |

**日哈希算法**：

```js
function hashDay(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i)
    hash |= 0  // 转为 32 位整数
  }
  return Math.abs(hash)
}
// 使用: hashDay("2026-7-31") % 30 → 今日情话索引
```

---

## 5. 样式体系

### 5.1 CSS 变量

```css
:root {
  --pink-light:  #fbc2eb;   /* 浅粉 */
  --pink:        #ff9a9e;   /* 主粉 */
  --pink-deep:   #e8728a;   /* 深粉（按钮渐变） */
  --peach:       #fad0c4;   /* 蜜桃色（背景渐变） */
  --white:       #ffffff;
  --white-80:    rgba(255,255,255,0.8);   /* 毛玻璃卡片背景 */
  --white-60:    rgba(255,255,255,0.6);
  --white-30:    rgba(255,255,255,0.3);   /* 毛玻璃边框 */
  --text:        #4a3040;   /* 主文字 */
  --text-light:  #7a6070;   /* 辅助文字 */
  --radius:      20px;      /* 统一圆角 */
  --shadow:      0 8px 32px rgba(255,154,158,0.2);
}
```

### 5.2 全局样式层

| 选择器 | 作用 |
|--------|------|
| `body` | 粉色渐变背景、系统字体、禁止横向滚动 |
| `#app` | max-width 414px 居中、溢出隐藏 |
| `.glass-card` | 毛玻璃卡片：半透明白底 + `backdrop-filter: blur(20px)` + 阴影 |
| `.btn` | 粉色渐变按钮：50px 圆角、点击缩放、发光阴影 |
| `.btn--secondary` | 次要按钮：白色半透明底 |
| `.number-font` | 等宽数字字体 |
| `.page-enter-from/to` | Vue Router 过渡动画类名 |

### 5.3 组件样式隔离

所有组件使用 `<style scoped>`，确保样式互不污染。

---

## 6. 数据流

### 6.1 纪念日数据流

```
localStorage("love-app-anniversary")
       │
       ▼
useAnniversary().anniversary (ref)
       │
       ├──► daysTogether (computed) ──► CountdownDisplay (:days)
       ├──► durationText (computed) ──► CountdownDisplay (:duration)
       ├──► daysUntilNext (computed) ──► ProgressRing (:days)
       ├──► progress (computed) ──► ProgressRing (:progress)
       └──► nextAnniversaryLabel (computed) ──► Home 模板直接渲染
```

### 6.2 情话数据流

```
src/data/quotes.js (30 条静态数据)
       │
       ▼
useQuotes()
       ├──► todayQuote (computed) ──► QuoteCard (:text)
       ├──► getRandomQuote() ──► QuoteCard (:text)
       └──► favorites (ref) ◄──► localStorage("love-app-favorites")
                │
                └──► favoriteQuotes (computed) ──► Quotes 收藏列表
```

### 6.3 组件通信

| 父 → 子 | 方式 |
|---------|------|
| Home → CountdownDisplay | Props (`:days`, `:duration`) |
| Home → ProgressRing | Props (`:progress`, `:days`) |
| Home → AnniversarySetter | Props (`:visible`, `:current-date`) |
| Quotes → QuoteCard | Props (`:text`, `:favorited`) |

| 子 → 父 | 方式 |
|---------|------|
| AnniversarySetter → Home | `@confirm`, `@close` |
| QuoteCard → Quotes | `@toggle-favorite` |

---

## 7. 构建与部署

### 7.1 Vite 配置

```js
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  base: './',              // 相对路径，GitHub Pages 必须
  server: {
    host: '0.0.0.0',      // 允许局域网访问（手机测试）
    port: 5173
  }
})
```

### 7.2 构建产物

| 文件 | 大小 | gzip |
|------|------|------|
| `dist/index.html` | 0.72 KB | 0.47 KB |
| `dist/assets/index-*.css` | 8.81 KB | 2.48 KB |
| `dist/assets/index-*.js` | 108.63 KB | 43.19 KB |
| **合计** | **~118 KB** | **~46 KB** |

### 7.3 GitHub Pages 部署

```
1. 创建 GitHub 仓库
2. npm run build
3. 推送 dist/ 到 gh-pages 分支
4. Settings → Pages → Source: gh-pages, / (root)
5. 获得 URL: https://<username>.github.io/<repo>/
```

---

## 8. 文件清单

| 文件 | 行数 | 说明 |
|------|------|------|
| `index.html` | ~17 | 入口 HTML，含 viewport 和微信适配 meta |
| `package.json` | ~20 | 依赖声明（vue, vue-router, vite, @vitejs/plugin-vue） |
| `vite.config.js` | ~12 | Vite 构建配置 |
| `src/main.js` | ~6 | Vue 应用入口 |
| `src/App.vue` | ~11 | 根组件，路由出口 + 过渡动画 |
| `src/router/index.js` | ~15 | Hash 路由配置 |
| `src/styles/global.css` | ~100 | 全局样式 + CSS 变量 + 毛玻璃 + 按钮 |
| `src/data/quotes.js` | ~33 | 30 条中文情话 |
| `src/composables/useAnniversary.js` | ~103 | 纪念日所有计算逻辑 |
| `src/composables/useQuotes.js` | ~81 | 情话选取 + 收藏管理 |
| `src/components/HeartParticles.vue` | ~60 | 爱心飘落粒子 |
| `src/components/CountdownDisplay.vue` | ~110 | 天数展示 + 数字动画 |
| `src/components/ProgressRing.vue` | ~95 | SVG 进度环 |
| `src/components/AnniversarySetter.vue` | ~110 | 纪念日设置弹窗 |
| `src/components/QuoteCard.vue` | ~85 | 情话卡片 |
| `src/views/Home.vue` | ~155 | 首页，组装所有组件 |
| `src/views/Quotes.vue` | ~140 | 情话页，每日情话 + 收藏 |

**总计：17 个源文件，约 1000+ 行代码。**

---

## 9. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-07-31 | 初始版本，完整技术设计 | - |
