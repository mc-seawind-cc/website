# 海風 SeaWind 網站設計文件

> 最後更新：2026.04.29（海風網站助手）
> 維護者：海風網站助手
> Instagram：[@mc.seawind.cc](https://www.instagram.com/mc.seawind.cc/)

---

## 1. 專案概覽

| 項目 | 說明 |
|---|---|
| 網址 | [www.seawind.cc](https://www.seawind.cc) |
| 倉庫 | [mc-seawind-cc/website](https://github.com/mc-seawind-cc/website) |
| 活動倉庫 | [mc-seawind-cc/events](https://github.com/mc-seawind-cc/events) |
| 託管 | GitHub Pages（靜態網站） |
| 技術棧 | 純 HTML + CSS + Vanilla JS（無框架） |
| 主題 | 深色模式（預設）+ 淺色模式，`data-theme="light"` CSS 變數切換 |
| 字體 | Noto Sans TC（Google Fonts），字重 400/500/700/800/900 + Noto Serif TC 700 |
| 設計風格 | 海洋 × 夢幻 × Minecraft，深色為底、藍紫色調為輔 |
| 目標用戶 | 台灣 Minecraft 玩家（主要），年齡層偏年輕 |

---

## 2. 網站架構與頁面

### 2.1 主要頁面

| 頁面 | 檔案 | 用途 |
|---|---|---|
| 首頁 | `首頁.html` | 伺服器主頁，Hero + 公告 + 特色 + 加入教學 |
| 公告 | `公告.html` | 公告列表 |
| 文化藝廊 | `文化藝廊.html` | 建築故事作品展示 |
| 活動 | `活動.html` | 伺服器活動 |
| 風景照 | `風景照.html` | 玩家投稿風景照 |
| 歷史館 | `歷史館.html` | 伺服器歷史 |
| 海風社區 | `海風社區.html` | 社區介紹 |
| 海風團隊 | `海風團隊.html` | 團隊成員 |
| 海風指南 | `海風指南.html` | 新手入門指南 |
| 社群須知 | `社群須知.html` | 社群規範與須知 |
| 支持須知 | `支持須知.html` | 贊助相關 |
| 管理通則 | `管理通則.html` | 管理通則 |
| 公務人員須知 | `公務人員須知.html` | 管理團隊須知 |
| 設計規範 | `設計規範.html` | 網站設計規範 |
| 會員 | `會員.html` | 會員系統 |
| 相關連結 | `相關連結.html` | 外部連結 |
| 合作夥伴 | `合作夥伴.html` | 合作夥伴 |
| 違規處分 | `違規處分.html` | 違規處分記錄 |
| 贊助 | `贊助.html` | 贊助頁面 |
| 服務條款 | `服務條款.html` | TOS |
| 隱私權政策 | `隱私權政策.html` | Privacy Policy |
| 活動-攝影賽 | `活動-攝影賽.html` | 攝影賽活動頁 |

### 2.2 其他頁面

| 檔案 | 用途 |
|---|---|
| `404.html` | 錯誤頁面（含海洋動畫、淨灘遊戲、MCTI 測驗、11 款小遊戲） |

---

## 3. 檔案結構

```
website/
├── 首頁.html              # 主頁
├── *.html                 # 各子頁面（中文命名）
├── style.css              # 主樣式表（~2900 行，23 區段）
├── main.js                # 主互動邏輯（~1290 行）
├── utils.js               # 工具函式
├── tips.js                # Hero 提示輪播
├── music-player.js        # 音樂播放器（~459 行）
├── music-player.css       # 音樂播放器樣式（空）
├── minigames.css          # 小遊戲樣式
├── minigames.js           # 小遊戲邏輯
├── mob-smasher.js         # 怪物打地鼠遊戲
├── mc-sprites.js          # Minecraft 精靈圖
├── photos.json            # 風景照資料
├── announcements.json     # 公告資料（500+ 則）
├── penalties.json         # 違規處分資料
├── manifest.json          # PWA manifest
├── CNAME                  # GitHub Pages 自訂域名
├── DESIGN.md              # 本文件
├── HANDOFF.md             # 交接指南
├── README.md              # 專案說明
├── assets/
│   ├── img/               # 圖片資源
│   │   ├── logo.png       # 伺服器 Logo
│   │   ├── homeHero.*     # Hero 背景圖（WebP + PNG）
│   │   └── icons/         # Minecraft 物品圖示
│   ├── lore/              # 文化藝廊圖片
│   ├── photos_new/        # 風景照（新）
│   ├── announcements/     # 公告截圖
│   ├── mobs/              # 怪物圖片
│   ├── sounds/            # 音效檔案
│   └── mob-spritesheet.*  # 怪物精靈圖
└── 文化藝廊/              # 文化藝廊子頁面（HTML）
```

---

## 4. CSS 架構規範

### 4.1 區段結構（23 區段）

```css
1. Reset / Variables / Base
2. Global UI (atmosphere, scroll progress)
3. Navigation
4. Hero Section
5. Page Layout / Sections
5b. Featured Event Banner ← 新增 04.18
5c. Countdown Timer ← 新增 04.19
5d. Community Stats Bar ← 新增 04.21
5e. Section Tinted Backgrounds ← 新增 04.22
6. Buttons
7. Cards / Features
8. Bulletin / Announcements
9. Culture Gallery (Lore)
10. Photos / Carousel
11. Partner
12. Member
13. Guide / Callouts
14. Rules / Penalties
15. Articles / TOC
16. Community
17. Team
18. Links
19. Footer
20. Lightbox
21. Miscellaneous
22. Keyframe Animations (含 badge-pulse, featured-glow-pulse, icon-idle-float, join-num-breathe, footer-logo-glow) ← 新增 04.18/04.26
23. Responsive / Media Queries
```

### 4.2 關鍵規則

- **Dark-first**：每個區段先寫 dark 樣式，`[data-theme="light"]` 覆蓋放在該區段末尾
- **CSS 變數**：所有顏色使用 `var(--*)` 變數定義在 `:root`
- **色彩系統**：
  - 主色調：`--sky` (#9dafff)、`--ocean-blue` (#578aff)
  - 輔助色：`--foam` (#a8e6cf)、`--sand` (#deac80)、`--lavender` (#ab72f9) 等
  - 深色背景：`--deep` (#0d1117)、`--ocean` (#161b22)、`--drift` (#1c2333)、`--mist` (#21283b)
  - 文字色：`--white` (#e6edf3)、`--cloud` (#c9d1d9)、`--fog` (#8b949e)
- **間距系統**：`--space-xs` (0.25rem) 到 `--space-2xl` (4rem)
- **圓角系統**：`--radius-sm` (6px) 到 `--radius-xl` (24px)
- **動畫**：統一使用 `--ease` (cubic-bezier)、`--duration` (0.3s)
- **Cache busting**：修改 CSS/JS 後更新 HTML 中的 `?v=日期碼`（格式 `?v=DDMMYY字母`）

---

## 5. JavaScript 結構

| 檔案 | 職責 |
|---|---|
| `main.js` | 核心邏輯：導航、主題切換、公告載入、滾動動畫、Lightbox、伺服器狀態查詢、複製 IP、deployCount |
| `utils.js` | 工具函式 |
| `tips.js` | Hero 區域提示文字輪播 |
| `music-player.js` | 音樂播放器 |
| `minigames.js` | 404 頁面小遊戲 |
| `mob-smasher.js` | 打地鼠遊戲 |

---

## 6. 設計理念

### 6.1 視覺風格

- **海洋 × 夢幻 × Minecraft**：深色背景搭配藍紫色調，營造沈浸感
- **動態氛圍**：背景粒子、極光漸層、波浪分隔線、滾動進度條
- **玻璃擬態**：導航欄使用 `backdrop-filter: blur(28px)`
- **動畫**：Hero 文字逐字動畫、卡片 stagger 動畫、滾動 reveal 動畫

### 6.2 互動設計

- **伺服器狀態即時查詢**：透過 `api.mcsrvstat.us` 查詢線上狀態
- **複製伺服器位址**：點擊即可複製
- **公告輪播**：從 `announcements.json` 載入，支援分頁
- **Lightbox**：圖片燈箱瀏覽
- **主題切換**：深色/淺色模式，localStorage 記憶
- **音樂播放器**：背景音樂

### 6.3 內容特色

- **文化藝廊**：獨特的世界觀建築故事（索西斯墓、邊境之村等）
- **景觀明信片**：巴哈姆特託管的玩家截圖
- **風景照投稿**：DC 投稿照片同步展示
- **公告系統**：從 Discord 同步的公告，含標籤、日期、反應

---

## 7. 頁尾規範（全站固定樣式 ⚠️ 不可修改）

所有頁面的 Footer 必須使用以下固定結構，**嚴禁增減任何元素**：

```html
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="footer-logo">海風伺服器 SeaWind.cc</span>
      <p class="footer-tagline">在風與海之間，有一個可以長久生存的地方</p>
    </div>
    <div class="footer-links-row">
      <a href="合作夥伴.html">合作夥伴</a>
      <span class="footer-dot">·</span>
      <a href="服務條款.html">服務條款</a>
      <span class="footer-dot">·</span>
      <a href="隱私權政策.html">隱私權政策</a>
    </div>
    <div class="footer-bottom">
      <p>© 2026 海風伺服器 · 非 Mojang 官方營運 · service@seawind.cc</p>
    </div>
    <p class="page-revise">網站最後修改日期 YYYY.MM.DD / 總計修改 <span id="deployCount">—</span> 次</p>
  </div>
</footer>
```

### 規則
- **修改次數**：`deployCount` 透過 GitHub API 自動取得，**不需手動修改**；日期需手動更新
- **只有三個連結**：合作夥伴、服務條款、隱私權政策
- **不要加入**：Discord CTA、伺服器 IP、伺服器狀態、wave separator
- **不要加入**：公告、活動、海風指南等額外導航連結
- 跳轉頁面（404、index、特殊道具規範、贊助）不需此 Footer
- 樣式由 `style.css` 中的 `.footer*` 系列 class 控制

---

## 8. 活動子頁面設計指南

> 所有活動詳情頁（`活動/*.html`）應遵循此指南，確保風格一致、維護容易。
> 參考範例：`活動/珍奶日.html`（最完整的範例）

### 8.1 頁面結構（由上到下）

```
1. Page Loader（海洋主題載入動畫）
2. Skip Link + Scroll Progress + BG Atmosphere
3. Navigation（與全站一致）
4. Back Link（← 返回活動列表）
5. Hero 區（標題 + CSS 藝術 + 描述 + Quick Stats）
6. 基本資訊（info-grid）
7. Section Divider
8. NPC 區（皮膚圖 + 名稱 + 職責）
9. Section Divider
10. 時程規劃（視覺時間軸）
11. Section Divider
12. 玩法總覽（步驟卡片）
13. Section Divider
14. 活動內容區塊（原料/配方/票選/挑戰等，依活動性質調整）
15. Section Divider（每個主要區塊之間）
16. 稱號與獎勵
17. Footer
18. JS（時間軸動態更新 + 階段標籤 + 粒子動畫 + Page Loader dismiss）
```

### 8.2 Hero 區規範

```html
<div class="event-hero fade-in">
  <!-- 浮動粒子容器（可選） -->
  <div class="event-bubbles" id="eventBubbles" aria-hidden="true"></div>
  
  <!-- 活動類型徽章 -->
  <div class="event-hero-badge">限時活動 · 日期</div>
  
  <!-- 當前階段標籤（JS 動態） -->
  <div class="current-stage-banner active" id="currentStageBanner">
    <span class="csb-dot"></span>
    <span id="currentStageText">階段名稱</span>
  </div>
  
  <h1>Emoji 活動名稱</h1>
  
  <!-- CSS 藝術（可選，用純 CSS 做活動主題圖案） -->
  <div class="event-art">...</div>
  
  <p class="event-hero-desc">活動描述</p>
  
  <!-- Quick Stats（3 個關鍵數字） -->
  <div class="event-quick-stats">
    <div class="eqs-item"><div class="eqs-num">數字</div><div class="eqs-label">標籤</div></div>
    ...
  </div>
</div>
```

**CSS 藝術規範：**
- 使用純 CSS（div + background gradient + border-radius）
- 不使用外部圖片
- 顏色與活動主題色一致
- 尺寸控制在 80–120px

### 8.3 視覺時間軸

使用 `.event-timeline-v` 系列 class，JS 根據當前日期動態更新：
- `.etv-dot.done`：已完成階段（foam 綠色）
- `.etv-dot.active`：當前階段（sky 藍色 + 發光）
- `.etv-dot.upcoming`：未來階段（灰色）
- `.etv-connector.done` / `.etv-connector.pending`：連接線

### 8.4 區塊規範

每個活動區塊使用 `.event-block`：
```html
<div class="event-block fade-in">
  <div class="event-block-title">
    <span class="ebt-icon">📦</span> 區塊標題
  </div>
  <!-- 內容 -->
</div>
```

### 8.5 樣式規範

- **頁面內聯 `<style>`**：只寫該活動特有的樣式
- **通用樣式**：使用 `style.css` 中的 `.event-hero`、`.event-block`、`.info-grid` 等
- **accent 色**：每個活動有專屬色調（珍奶日=sand、端午節=foam、風汐=lavender）
- **Light mode**：必須撰寫 `[data-theme="light"]` 覆蓋
- **Responsive**：必須撰寫 `@media (max-width: 768px)` 適配
- **Print**：建議撰寫 `@media print` 樣式

### 8.6 JavaScript 規範

- 時間軸 + 階段標籤：根據 `Date.now()` 動態切換 `done`/`active`/`active` class
- 浮動粒子：用 JS 動態建立 DOM 元素 + CSS animation
- Page Loader：固定 pattern（`#pageLoader` → `.fade-out` → `remove()`）
- 所有 JS 寫在 `</body>` 前的 `<script>` 區塊

### 8.7 Cache Busting

- 修改頁面內聯 CSS/JS 不需要更新 cache busting
- 修改 `style.css` 或 `main.js` 後，所有引用它們的 HTML 都要更新 `?v=日期碼`

---

## 9. 已知問題與待辦

### 已修復 ✅
- [x] 首頁新增精選活動橫幅（珍奶日預告）— 2026.04.18
- [x] 首頁精選活動新增倒數計時器 — 2026.04.19
- [x] 全站頁尾日期統一更新至 2026.04.19 — 2026.04.19
- [x] 首頁重新加入精選活動橫幅（珍奶日 4/27 預告，含倒數計時）— 2026.04.21
- [x] 首頁新增「社群數據」區塊（動態計數器：會員/Discord/公告/營運天數）— 2026.04.21
- [x] 首頁「社群數據」區塊重新加入（代碼遺失，含 IntersectionObserver easeOut 動畫 + 逐項延遲）— 2026.04.24

### 高優先
- [x] 首頁 Hero 連線版本文字 `1.21.6 ~ 26.x` — 已確認正確（2026.04.19）
- [x] 伺服器資訊區塊遊戲版本 `1.21.11(群騎紛爭)` — 已確認正確（2026.04.19）

### 中優先
- [x] ~~首頁增強版 Footer（含 Discord CTA + 伺服器 IP 快速複製）~~ → 已改為全站固定簡潔版 Footer — 2026.04.19
- [x] ~~CSS `[data-theme="light"]` 重複選擇器清理~~ → 已合併 3 個重複選擇器（.page-revise / .bulletin-body .b-content / .join-step:hover），實際僅 3 處非 264 處 — 2026.04.21
- [x] ~~圖片全面檢查 WebP fallback~~ → 全站 75 個 HTML 頁面 logo.png 全部加 `<picture>` 包裹（logo.webp fallback）、guide-menu / mcu 同步處理 — 2026.04.21
- [x] ~~大 PNG 轉無損 WebP~~ → guide-menu.png / logo.png / mcu.png 已轉 lossless WebP — 2026.04.21
- [x] ~~公告資料可考慮 inline 到 HTML（減少 API 請求）~~ → 首頁已有 12 則 inline，`公告.html` 新增 50 則 inline + 背景載入完整 JSON — 2026.04.23
- [x] ~~首頁增強版 Footer（含 Discord CTA + 伺服器 IP 快速複製）需推廣到其他頁面~~ → 全站已統一為簡潔版 Footer — 2026.04.19
- [ ] 無障礙：Lightbox 已有 `aria-live`（counter），圖片 `alt` 可更描述性
- [ ] 404.html 體積偏大（可將動畫 CSS/JS 外部化）
- [x] ~~SEO：各子頁面 meta description 檢查~~ → 全站所有內容頁（含 6 個 lore 子頁面）均已補齊 meta description，僅 redirect/noindex 頁面不需 — 2026.04.24

### 低優先
- [x] ~~首頁 Hero 標題可考慮加入微互動（如字元 hover 粒子效果）~~ → 已有 wind-sway + hover scale/shadow 動畫 — 2026.04.19
- [x] ~~首頁「如何加入海風」區塊可加入連接線動畫~~ → 新增 connector-pulse 節點脈衝 + dash-flow 虛線流動動畫 — 2026.04.19
- [x] ~~首頁 Hero 標題 hover 可進一步加入色彩粒子特效（目前已有放大+上浮+陰影）~~ → 新增 canvas 粒子系統（mousemove 生成藍紫色粒子，6 色隨機，含重力衰減）— 2026.04.24
- [x] ~~特色卡片可加入漸進式編號指示器（如 1→2→3 連線動畫）~~ → 新增 01–06 編號標記 + hover 連線展開 + 卡片間垂直漸層連接線 — 2026.04.24

---

## 10. 修改記錄

| 日期 | 修改者 | 修改內容 |
|---|---|---|
| 2026.04.18 | 海風網站助手 | 首頁新增「精選活動」橫幅（珍奶日 4/20 預告），含 featured-event CSS 動畫 + 淺色模式 |
| 2026.04.18 | 海風網站助手 | 活動頁卡片新增 stagger 淡入動畫（逐張延遲 120ms） |
| 2026.04.18 | 海風網站助手 | CSS 新增 featured-event 樣式 + @keyframes badge-pulse / featured-glow-pulse |
| 2026.04.18 | 海風網站助手 | 建立 DESIGN.md，整理網站架構與設計規範 |
| 2026.04.18 | 海風網站助手 | 建立 `music-player.css` 完整樣式（深色/淺色/響應式），修復空樣式表問題 |
| 2026.04.18 | 海風網站助手 | 全站 20 個頁面頁尾日期統一更新至 2026.04.18 |
| 2026.04.18 | 海風網站助手 | 合作夥伴頁新增「洛羽民宿」Discord 社群卡片 |
| 2026.04.18 | 海風網站助手 | 風汐系列頁新增工具一覽（+6/+7 鋤斧鎬鏟） |
| 2026.04.19 | 海風網站助手 | 首頁精選活動新增倒數計時器（珍奶日 4/20 開跑），含 CSS 動態區塊 + JS 即時倒數 + 過期自動切換「已開跑」狀態 |
| 2026.04.19 | 海風網站助手 | 全站 26 個頁面頁尾日期統一更新至 2026.04.19，CSS/JS cache busting 統一為 260419a |
| 2026.04.19 | 海風網站助手 | 首頁移除所有區塊間的 margin-top 間距，使精選活動、公告、文化藝廊、特色、伺服器資訊、加入教學、景觀明信片、風景照等區塊緊密排列 |
| 2026.04.19 | 海風網站助手 | 珍奶日倒數計時器 target 改為 2026-04-27（暖身期開始），不含測試期（4/20–4/26）；精選活動描述改為「4/27 暖身開跑」、日期改為 04.27 – 05.31 |
| 2026.04.19 | 海風網站助手 | 文化藝廊投稿公告新增「🪙 投稿成功可獲得 10 代幣獎勵！」提示 |
| 2026.04.19 | 海風網站助手 | 首頁移除珍奶日倒數計時器（保留精選活動橫幅）；區塊間距改為僅桌面版（≥769px）顯示，手機版緊密排列 |
| 2026.04.19 | 海風網站助手 | 修復 Hero 區域 5 處 CSS 選擇器錯誤（缺少空格的 descendant selector），恢復提示欄輪播、副標題/按鈕/資訊卡的展開動畫與 transition |
| 2026.04.19 | 海風網站助手 | 首頁移除精選活動橫幅（珍奶日），活動內容仍保留在活動頁面 |
| 2026.04.19 | 海風網站助手 | 首頁 Footer 增強：新增 Discord CTA 卡片（含伺服器 IP 快速複製 + Discord 加入按鈕）、導航連結擴展（公告/活動/海風指南）、頁尾 wave separator |
| 2026.04.19 | 海風網站助手 | 首頁 Hero 標題字元 hover 效果增強：放大+上浮+陰影動畫 |
| 2026.04.19 | 海風網站助手 | CSS 新增 footer-cta 樣式（深色/淺色模式）+ footer-wave-separator |
| 2026.04.19 | 海風網站助手 | DESIGN.md 待辦事項更新：修正無障礙項目（Lightbox aria-live 已存在）、移除已不適用的項目 |
| 2026.04.19 | 海風網站助手 | 海風團隊頁：成員名稱從 Discord ID 更新為 MC ID（Taiwan_shihyuan / BubukiNott / YuXi_0720 / AlexanderiaLapis / tdse9 / WhiteMeowGX / Blue_5125 / StrawCoding），移除「合作夥伴」統計項目，tesd9 改為 tdse9 |
| 2026.04.19 | 海風網站助手 | 全站增強版 Footer 推廣：25 個子頁面從基本版 Footer 升級為含 Discord CTA 卡片（伺服器 IP 快速複製 + Discord 加入按鈕）、擴展導航連結（公告/活動/海風指南/服務條款/隱私權政策）、頁尾 wave separator 的增強版 Footer（跳轉頁面 404/index/特殊道具規範/贊助 不需更新）|
| 2026.04.19 | 海風網站助手 | 首頁移除 Hero 區塊與內容區之間的 wave separator，使 Hero 直接銜接公告欄 |
| 2026.04.19 | 海風網站助手 | 海風團隊頁：全部 15 個成員頭像從 mc-heads.net 改為 skinmc.net API（`skinmc.net/api/v1/avatars/skin/玩家名`），圖片品質提升（Blue_5125 從 549b→2722b），新增 skinmc.net dns-prefetch |
| 2026.04.19 | 海風網站助手 | 全站 26 個頁面 Footer 統一改為固定簡潔版：品牌名稱、標語、三個連結（合作夥伴/服務條款/隱私權政策）、版權聲明、修改次數。移除 Discord CTA、伺服器狀態、wave separator、額外導航連結。DESIGN.md 第 7 節新增 Footer 規範 |
| 2026.04.19 | 海風網站助手 | 首頁 Hero 區塊 FPS 優化：移除 `hero-bg-drift` 濾鏡動畫（hue-rotate/brightness/contrast 改為靜態）、移除極光旋轉動畫 `aurora-spin` + 脈衝動畫 `aurora-pulse`（blur 40px→60px 但不再動畫）、Hero 粒子數量 40→20、降低粒子 opacity |
| 2026.04.19 | 海風網站助手 | 海風團隊頁：全站 15 個成員頭像統一為 skinmc.net/api/v1/face/username/遊戲名稱/600，其中 StrawCoding 特殊使用 UUID（bb5ce2af...）代替遊戲名稱 |
| 2026.04.19 | 海風網站助手 | 海風團隊頁：Blue_5125 職責從「插件」更新為「插件＋主機」 |
| 2026.04.19 | 海風網站助手 | 活動頁＋珍奶日詳情頁：活動日期改為 4/27 起（移除測試期 4/20–4/26 階段），暖身期改為第一階段 |
| 2026.04.19 | 海風網站助手 | **公告欄 CSS 重大清理**：移除 3 套重複 bulletin 樣式塊（~350 行），修復 CSS 花括號不匹配、孤立屬性塊。恢復被誤刪的 `.bulletin-item` 基礎定義。新增 `.bulletin-board`/`.bulletin-hidden`/`.bulletin-header` 乾淨定義。移除已無引用的 `.ann-filter`/`.ann-search`/`.tag-*` 樣式。CSS 從 2982 行精簡至 ~2412 行。保留 `.b-dot` hover scale 微動效。全站 cache busting → 190419c |
| 2026.04.19 | 海風網站助手 | 活動頁：珍奶日卡片恢復圓形階段指示器（含測試期 4/20–4/26 已完成） |
| 2026.04.19 | 海風網站助手 | 珍奶日詳情頁：移除 quick stats 中的「活動階段」數量、時間軸補上測試期階段（4 個階段：測試→暖身→正式→收尾） |
| 2026.04.19 | 海風網站助手 | 珍奶日詳情頁：13 種飲品名稱 emoji 全部換成 MC 頭顱圖片（mc-heads.net API，使用遊戲內 PLAYER_HEAD skull-texture hash），新增 `.mc-head` CSS（20px、image-rendering: pixelated）、dns-prefetch mc-heads.net |
| 2026.04.19 | 海風網站助手 | 珍奶日詳情頁：「海風茶王」稱號獲取方式更新——需集齊全部 13 種飲品合成「海風茶王代換券」，於收尾期（5/28–5/31）兌換。新增代換券說明區塊（含完整 13 種飲品清單），時間軸收尾期描述同步更新 |
| 2026.04.19 | 海風網站助手 | **首頁「如何加入海風」視覺增強**：join-connector 新增節點脈衝動畫（`connector-pulse`）+ 虛線流動動畫（`dash-flow`），步驟卡片 hover 增加光暈 + 編號放大 + 圖示旋轉效果 |
| 2026.04.19 | 海風網站助手 | **Section Header 動畫增強**：標題底線改為從 0 寬度展開（scroll reveal 時觸發），hover 時延展至 80px，transition 改為 0.8s 更優雅的 easing |
| 2026.04.19 | 海風網站助手 | **Feature Card Hover 增強**：新增 `inset 0 1px 0` 頂部內發光反射效果（深色/淺色模式），提升卡片立體感與層次 |
| 2026.04.19 | 海風網站助手 | CSS 新增 `@keyframes connector-pulse`（節點脈衝）+ `@keyframes dash-flow`（虛線流動），全站 cache busting → 190419e |
| 2026.04.20 | 海風網站助手 | 首頁公告欄 inline JSON 更新：新增 #0027「2026 海風國際珍奶日」活動公告（活動標籤），保持 12 則上限 |
| 2026.04.20 | 海風網站助手 | 活動頁珍奶日卡片：測試期階段指示器從「done」修正為「active」（4/20 為測試期第一天） |
| 2026.04.20 | 海風網站助手 | 全站 75 個頁面頁尾日期統一更新至 2026.04.20，CSS/JS cache busting 統一為 200420a |
| 2026.04.20 | 海風網站助手 | 404 頁面修復：載入 minigames.js + minigames.css（之前完全未引用，MINIGAMES 為 undefined），新增 13 款遊戲按鈕（翻牌/貪吃蛇/掃雷/2048/滑翔翼/猜礦/四子棋/五子棋/井字棋/礦石記憶/射擊場/反應/數字記憶），openGame() 新增 MINIGAMES 路由，closeOverlay() 新增 MINIGAMES.close()，修復 game-result-label / close-overlay CSS 缺失 |
| 2026.04.20 | 海風網站助手 | **公告資料全面格式清理**（announcements.json 473 則）：移除 435 則 blockquote `>` 前綴、128 則雙反引號 `` `` `` → ` `、22 則裸 URL 轉為 Markdown 連結、21 則尾隨空白、3 則 4-space 縮排統一為 2-space。同步更新首頁 inline 公告 JSON。 |
| 2026.04.21 | 海風網站助手 | **首頁重新加入精選活動橫幅**（🧋 2026 海風國際珍奶日），含倒數計時器（4/27 調整期開跑）、活動標籤/日期/描述、查看詳情按鈕。CSS/JS 均沿用既有 featured-event / countdown 樣式 |
| 2026.04.21 | 海風網站助手 | **首頁新增「社群數據」區塊**：4 項動態計數器（400+ 註冊會員、1200+ Discord 成員、500+ 公告發布、365+ 營運天數），含 IntersectionObserver 觸發的 easeOut 動畫、漸層背景卡片、響應式分隔線隱藏。CSS 新增 `.stats-bar` / `.stat-item` / `.stat-num` / `.stat-label` / `.stat-divider` + 淺色模式 + 手機版適配 |
| 2026.04.21 | 海風網站助手 | 全站頁尾日期統一更新至 2026.04.21，CSS/JS cache busting 統一為 210421a |
| 2026.04.21 | 海風網站助手 | **Section Header 裝飾強化**：新增 `::before` 左側裝飾線（scroll reveal 時展開 28px，hover 延展 48px），與既有 `::after` 底線漸層形成對稱視覺；新增 `::selection` 高亮色。深色/淺色模式同步 |
| 2026.04.21 | 海風網站助手 | **公告標籤配色增強**：`.b-tag` 新增 `border: 1px solid currentColor`（透明時隱藏，hover 時顯示）、字重 600、letter-spacing 微調；`.b-dot` 改為 9px + hover 時 `box-shadow` 發光 + `scale(1.25)` 脈動效果 |
| 2026.04.21 | 海風網站助手 | **活動頁卡片強化**：`.event-card::before` 從 flat 線改為 `linear-gradient` 漸層 accent 條；新增 `::after` radial-gradient hover 內發光層（opacity 0→0.04）；`.event-badge.limited` 新增 `event-badge-glow` 脈動動畫；`.event-stage.active` 新增 `stage-pulse` 環繞脈衝動畫；`.event-meta-icon` hover 時 opacity 提升 |
| 2026.04.21 | 海風網站助手 | **大 PNG 轉無損 WebP**：guide-menu.png→7K (原50K)、logo.png→54K (原100K)、mcu.png→75K (原152K)，ffmpeg lossless 編碼 |
| 2026.04.21 | 海風網站助手 | **全站 WebP `<picture>` fallback**：logo.png 全部 73 個 HTML 頁面（含 guide/42 + lore/7 + root/24）加 `<picture><source srcset="logo.webp">` 包裹；guide-menu.png、mcu.png 同步處理 |
| 2026.04.21 | 海風網站助手 | **CSS light mode 清理**：合併 3 個重複 `[data-theme="light"]` 選擇器（`.page-revise` / `.bulletin-body .b-content` / `.join-step:hover`），CSS 從 3043 行精簡 |
| 2026.04.21 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 210421b |
| 2026.04.21 | 海風網站助手 | **新增「創意室內設計競賽」活動頁**（活動-室內設計.html）：含活動概念、框架規格圖解（ASCII art）、評分標準視覺化（score-bar）、月循環時程（timeline）、主題輪替卡片（6 屆）、獎勵展示（冠/亞/季）、累計成就稱號（6 種）、參加方式。深色/淺色模式 + 手機響應式 |
| 2026.04.21 | 海風網站助手 | 活動列表頁新增室內設計競賽卡片（週期性分類，sand 色調，stagger 動畫第 5 張） |
| 2026.04.21 | 海風網站助手 | **首頁波浪分隔線**：在文化藝廊↔特色、特色↔伺服器資訊、伺服器資訊↔加入教學、加入教學↔明信片之間新增 `.section-wave` 柔和 SVG 波浪分隔，提升區塊間視覺節奏感。深色/淺色模式同步 |
| 2026.04.21 | 海風網站助手 | **Hero 滾動指示器增強**：`.scroll-arrow` 新增柔光脈衝背景（`scroll-glow` keyframes），讓「向下探索」提示更醒目且富有動感 |
| 2026.04.21 | 海風網站助手 | **特色卡片互動增強**：新增 `.feature-card:active` 按下回饋（縮小至 translateY(-3px)，transition 0.1s），提升觸控/點擊體驗 |
| 2026.04.21 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 210421c |
| 2026.04.22 | 海風網站助手 | **景觀明信片 hover 沉浸感強化**：新增圖片陰影（box-shadow）、hover 時上浮+放大+加深陰影、底部漸層遮罩加深+過渡動效、新增浮現式圖片標籤（`.postcard-label`，含 emoji + 文字，hover 時從下方淡入）。深色/淺色模式同步 |
| 2026.04.22 | 海風網站助手 | **Section 視覺節奏增強**：新增 `.section-tint` 系列微背景（warm/cool/deep），在海風特色（cool）、伺服器資訊（warm）、如何加入海風（cool）、景觀明信片（deep）之間建立交替色調，提升閱讀節奏感與區塊辨識度。深色/淺色模式同步 |
| 2026.04.22 | 海風網站助手 | **頁尾波浪分隔線動效**：`.footer::before` 波浪 SVG 更新為更柔和弧線 + 新增 `footer-wave-drift` 緩慢漂移動畫；`.footer::after` 新增漸層發光線（top glow line）；`.footer-logo` 字號微增 + text-shadow 微發光 + 底線改為 shimmer 動畫（`footer-line-shimmer`）；頁尾 padding 增大（space-xl → space-2xl）；背景漸層增強（加入 lavender 微色調） |
| 2026.04.22 | 海風網站助手 | **頁尾連結列強化**：間距微增、hover 時上浮 + 底線展開動效（`::after` width transition）；分隔點改小更精緻 |
| 2026.04.22 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 220422a，全站頁尾日期統一更新至 2026.04.22 |
| 2026.04.21 | 海風網站助手 | **創意室內設計競賽改為一次性活動**：移除「週期性/每月一屆」標記，活動列表 badge 改為「限時活動」；詳情頁移除月循環時程、主題輪替（僅保留單一主題「溫暖小窩」）、累計成就稱號精簡為 3 個（冠/亞/季各 1） |
| 2026.04.22 | 海風網站助手 | **導航下拉選單動畫**：從 `display:none/block` 改為 `opacity + visibility + transform` 過渡動畫（0.25s ease），下拉選單有淡入+下滑效果；hover 時連結加 `padding-left` 微縮排 + 藍色高亮背景；min-width 微增至 200px；淺色模式改為藍色調 hover 背景 |
| 2026.04.22 | 海風網站助手 | **公告欄標籤配色系統**：per-tag 精確配色 — 公告=#8ab4ff 藍底、更新=#85e0bf 綠底、活動=#ffbb55 橙底、維護=#ff9e9e 紅底；`.b-tag` 字重 500→600、新增 letter-spacing + hover 時顯示 `border:1px solid currentColor`；`.bulletin-item:hover` 新增 `box-shadow` 微陰影 |
| 2026.04.22 | 海風網站助手 | **文化藝廊精選卡片深度**：新增 `::after` 底部漸層覆蓋層（漸入動效），hover 時標題變 `--sky` 藍色 + tag 發光效果；圖片高度 160→180px、`.lore-preview-info` 加 `z-index:2` 確保內容在覆蓋層上方 |
| 2026.04.22 | 海風網站助手 | **社群數據條互動強化**：`.stats-bar` 新增 hover 微上浮（-2px）+ 陰影加深 + 邊框亮化；`.stat-item` 各自可獨立 hover 微上浮 |
| 2026.04.22 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 220422b |
| 2026.04.22 | 海風網站助手 | **設計規範頁結構重整**：全規範從 34 條擴充至 97 條，四章十一節。第一章總則拆分適用範圍+8 條名詞定義；第二章第一節裝備體系從 lore-block 改為 6 條 rule-item（與其他節一致）；數值設計拆出 5 種限制各獨立成條；歷史紀錄從 1 條長串拆為 8 條獨立紀錄；第三章設計原則從 1 條拆為 6 條獨立原則、執行防弊拆為 10 條；第四章檔案格式從 1 條拆為 5 條。每節每條均為獨立 rule-item 區塊 |
| 2026.04.22 | 海風網站助手 | **設計規範頁全面更新**：依最新版規範（二章七節）重寫整頁。第一章總則：適用項目 8 項 + 名詞解釋（超模/復刻）。第二章活動設計與特殊道具：第一節特殊數值設計（現有裝備參考+過往活動）、第二節數值設計（標示計算/上限/連動/經濟平衡）、第三節活動設計（5 項原則/分類/獎勵規範/限定復刻）、第四節活動記錄及實行過程（5 條）、第五節調整相關（調整原則/補償退回/緊急處理）、第六節活動執行與防弊（準備/公告/反作弊/善後）、第七節歷史紀錄（8 條）。移除舊版四章 97 條結構（裝備體系/審核流程/資源包紋理等章節）。cache busting → 220422c |
| 2026.04.23 | 海風網站助手 | **設計規範頁條文全數刪除**：移除 `.rules-container` 內全部兩章七節所有條文（第一章總則 2 條、第二章七節共約 30 條 rule-item + 8 條歷史紀錄）。頁面僅保留頁首、導航、頁尾結構。頁尾日期更新至 2026.04.23 |
| 2026.04.23 | 海風網站助手 | **設計規範頁條文重新寫入**：依最新版文字稿重建全部條文（第一章總則 2 條、第二章七節 30 條 rule-item + 8 條歷史紀錄）。規範介紹改為雙項目列表、復刻名詞移除多餘說明文字 |
| 2026.04.23 | 海風網站助手 | **Section Header 裝飾線簡化**：移除 `h2::before` 左側裝飾線（含 light mode 覆蓋），底線 `::after` 改為常駐顯示（`width:40px`，不再依賴 scroll reveal），hover 仍展開至 80px。全站 CSS/JS cache busting → 230423a，全站頁尾日期統一更新至 2026.04.23 |
| 2026.04.23 | 海風網站助手 | **打怪物精靈圖改回獨立 PNG**：移除 `SPRITES` 坐標地圖（91 組座標）及 `SPRITE_SHEET` 常數，`spr()` 改為直接用 `<img>` 標籤載入 `assets/mobs/*.png`。CSS 移除 `.ms-ss` sprite sheet 樣式 + 5 處 `div.ms-*` background-image 規則。404.html 移除 `mob-spritesheet.png` preload |
| 2026.04.23 | 海風網站助手 | **公告頁 inline 公告資料**：將最新 50 則公告（~23KB）inline 進 `公告.html`，首屏即時渲染不再依賴 349KB 的 `announcements.json` fetch。JS 改為 inline data first → 背景靜默載入完整 JSON（473 則）→ 自動更新 allData 供搜尋/篩選/分頁使用。首頁已有 12 則 inline，此次將 `公告.html` 同步處理 |
| 2026.04.23 | 海風網站助手 | **團隊成員異動**：鴨鴨（Nakk_tiktok）辭職，從海風團隊頁移除（行政部門·策劃＋平衡），公務人員統計 12→11。生存起源活動頁舉辦者改為「海風團隊」、聯繫窗口同步更新 |
| 2026.04.23 | 海風網站助手 | **團隊頁調整**：江砚→江硯（正字）；行政部門精簡為僅江硯（移除石頭、狐桃，其已在他部門）；神焰服主標籤改用 role-lead（綠色）；噗嚕標籤拆分為「插件」「主機」兩個獨立標籤 |
| 2026.04.23 | 海風網站助手 | **生存起源活動善後**：原策畫鴨鴨辭職，活動頁舉辦者/聯繫窗口原已為「海風團隊」無需修改。公告原始內容保留不動（歷史紀錄）。第二、三階段待設計 |
| 2026.04.23 | 海風網站助手 | **特色卡片視覺強化**：背景改為 `linear-gradient(165deg)` 漸層、頂部 accent 條改為雙向漸層透明、新增底部 radial-gradient 微光暈（hover 時浮現）；icon 區塊加大（56→60px）改為 accent 色漸層背景 + 邊框 + hover 時發光陰影；標題新增 `::after` 底線動畫（hover 時從 0 展開至 100%）。深色/淺色模式同步 |
| 2026.04.23 | 海風網站助手 | **加入步驟連接線增強**：新增 `::before` 橫向漸層線（2px）、`::after` 節點改為 8px + 發光陰影 + 更明顯脈衝動畫；SVG 路徑 stroke-width 加粗至 2 + opacity 0.4 |
| 2026.04.23 | 海風網站助手 | **Section Tint 背景增強**：新增 `::before` 頂部裝飾線（漸層透明）；三種色調 gradient 改為三色（0%→50%→100%）更豐富的層次感。深色/淺色模式同步 |
| 2026.04.23 | 海風網站助手 | **公告欄 hover 增強**：hover 時新增左側彩色發光條（`box-shadow: -4px 0 0`），顏色依 tag 配色（公告藍/更新綠/活動橙/維護紅）；translateX 微增至 4px |
| 2026.04.23 | 海風網站助手 | **文化藝廊卡片增強**：新增 `::before` 頂部漸層裝飾線（hover 時浮現）；hover translateY 加深至 -8px + 陰影加深 |
| 2026.04.23 | 海風網站助手 | **頁面載入動畫**：body 新增 `page-fade-in` 動畫（0.6s ease-out，opacity 0→1 + translateY 8px→0），提升頁面切換體驗 |
| 2026.04.23 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 230423c |
| 2026.04.23 | 海風網站助手 | **導航命名調整**：下拉選單標題「社群須知」→「須知」；項目「玩家須知」→「社群須知」、「海風管理規則」→「管理通則」。加入步驟「閱讀玩家須知」→「閱讀社群須知」。玩家須知.html title/og:title 更新、管理規則.html title/og:title/h1 更新。全站 75 個 HTML 頁面同步，cache busting → 230423d |
| 2026.04.23 | 海風網站助手 | **檔案重新命名**：`玩家須知.html` → `社群須知.html`、`管理規則.html` → `管理通則.html`。全站 HTML href/canonical 更新（含子目錄相對路徑）、sitemap.xml 更新。公務人員須知.html 中 Google Doc 外部連結保留原名（文件實際標題） |
| 2026.04.24 | 海風網站助手 | **首頁「社群數據」區塊重新加入**：HTML 結構（4 項動態計數器：400+ 註冊會員、1200+ Discord 成員、500+ 公告發布、365+ 營運天數）+ JS IntersectionObserver easeOut 動畫（1.8s，逐項延遲 150ms）。CSS 樣式已有，僅補 HTML + JS |
| 2026.04.24 | 海風網站助手 | **SEO meta description 補齊**：6 個文化藝廊子頁面（索西斯墓/邊境之村/瑟爾納大橋/禁忌天使/格拉文特/翠籙幽光書庭）新增 `<meta name="description">` + og:description 同步更新。全站所有內容頁均已覆蓋 |
| 2026.04.24 | 海風網站助手 | **DESIGN.md 待辦清理**：標記 SEO 檢查、社群數據區塊為已完成；修正增強版 Footer 項目（全站已統一為簡潔版）。cache busting → 240424a，首頁頁尾日期更新至 2026.04.24 |
| 2026.04.24 | 海風網站助手 | **特色卡片漸進式編號指示器**：6 張卡片右上角新增 01–06 編號（`.feature-card-num`），hover 時 opacity/color 變化 + 左側連線展開；桌面版卡片間新增垂直漸層連接線（hover 時高度 0→40px）。手機版隱藏連接線。深色/淺色模式同步 |
| 2026.04.24 | 海風網站助手 | **首頁 Hero 標題色彩粒子特效**：`initHeroTitleParticles()` — canvas 粒子系統，mousemove 時在滑鼠位置生成 3 顆藍紫色調粒子（6 色隨機），含重力、衰減、生命週期。僅桌面版（≥768px）啟用 |
| 2026.04.24 | 海風網站助手 | **移除首頁「社群數據」區塊**：刪除 stats-bar HTML/CSS/JS（400+ 註冊會員、1200+ Discord 成員、500+ 公告發布、365+ 營運天數）。CSS 移除 .stats-bar/.stat-item/.stat-num/.stat-label/.stat-divider 含淺色模式+響應式。JS 移除 IntersectionObserver easeOut 計數動畫。cache busting → 240424c |
| 2026.04.24 | 海風網站助手 | **Lightbox alt 描述強化**：lightbox 開啟時同步複製原圖 alt 文字（`lightboxImg.alt = imgs[idx].alt`）。5 張明信片 alt 從泛用描述改為具體建築名稱+風格描述（嵐陽城/海風大社/羅馬尼亞號/布雷特蘭/格拉文特）。cache busting → 240424b |
| 2026.04.24 | 海風網站助手 | **移除 Hero 標題 hover 色彩粒子**：刪除 `initHeroTitleParticles()` 函式（canvas 粒子系統），不再於滑鼠移動時生成藍紫色粒子 |
| 2026.04.24 | 海風網站助手 | **消除區塊背景分界**：`.content-section` 背景從深色漸層改為 transparent、移除 `::before` 裝飾線；`.section-tint` 移除 `::before` 頂部線條。使首頁從 Hero 到 Footer 背景一體流暢，無明顯邊界。全站 cache busting → 240424d |
| 2026.04.24 | 海風網站助手 | **精選活動橫幅 shimmer 邊框**：`box-shadow` 多色漸層脈衝動畫（sand→sky→foam 三色循環 4s），hover 時加強亮度。倒數計時區塊數字加大（1.5→1.7rem）、字重 900、text-shadow 微發光、hover 時上浮+陰影。深色/淺色模式同步 |
| 2026.04.24 | 海風網站助手 | **公告欄 stagger 淡入動畫**：`.bulletin-board .bulletin-item` 新增 `bulletin-stagger-in` 動畫（opacity 0→1 + translateY 12px→0），12 個項目各延遲 50ms（0.05s→0.6s），進入視口時依序浮現 |
| 2026.04.24 | 海風網站助手 | **伺服器資訊卡片數值強化**：`.section-tint-warm .feature-card` 標題改為小字灰階（0.85rem、uppercase），數值加大加深（1.2rem、800 weight）+ accent 色 text-shadow 發光。深色/淺色模式同步 |
| 2026.04.24 | 海風網站助手 | **活動頁 Hero 漸層裝飾**：`.page-hero-events` 新增雙側 radial-gradient 光暈（左藍右綠），8s/10s 交替漂移動畫。深色/淺色模式同步 |
| 2026.04.24 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 240424e，全站頁尾日期統一更新至 2026.04.24 |
| 2026.04.24 | 海風網站助手 | **端午節詳情頁物品粗體移除**：原料取得管道（打 MythicMobs/打蠹魚/種植兌換）及票選活動（吃南部粽/吃北部粽）共 5 處 `font-weight:700` 移除，改為正常字重。table 內原料名稱本身無粗體，表頭粗體保留 |
| 2026.04.24 | 海風網站助手 | **新增處分 #0012**（Nakk_tiktok，115年度訴字第0001號）：褫奪公權6月＋永久停權。18 張證據截圖 + PDF 判決書存入 `assets/penalties/0012/`。違規處分頁新增證據截圖 grid 展示、多條規章/處分解析支援、PDF 連結改為「查看判決書 PDF」 |
| 2026.04.25 | 海風網站助手 | **精選活動橫幅強化**（珍奶日倒數）：新增進度條（視覺化活動倒數 %）、動態緊迫感文字（⚡明天開始/🌊即將開始/🔥今天開始）、倒數數字發光脈衝動畫（`.countdown-num.glow`）。CSS 新增 `.featured-event-progress` 系列 + `countdown-glow-pulse` + `countdown-urgency` 樣式，深色/淺色模式同步 |
| 2026.04.25 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 250425a，全站頁尾日期統一更新至 2026.04.25 |
| 2026.04.25 | 海風網站助手 | **端午節活動物品更新**：立蛋龍蛋→立蛋獎（DRAGON_EGG）；南部粽配方改為水煮（圓糯米+魷魚+滷花生+滷肉+鹹蛋黃+台灣香菇+金鉤蝦+粽葉），效果改為飽食4+飽和7（COOKED_PORKCHOP）；北部粽配方改為蒸煮（長糯米+金鉤蝦+栗子+滷肉+鹹蛋黃+台灣香菇+金鉤蝦+粽葉），效果改為飽食4+飽和7（COOKED_BEEF） |
| 2026.04.25 | 海風網站助手 | **端午節食材表同步更新**：6 種→10 種原料。新增魷魚（釣魚）、滷肉（端午豬）、台灣香菇（種蘑菇→NPC）、金鉤蝦（釣魚寶箱→NPC）、栗子（地獄橡木→NPC）。五花肉→滷肉（名稱更新）。花生→滷花生。糯米備註圓糯米/長糯米。活動道具 9→10 個。安全生吃原料提示同步更新 |
| 2026.04.25 | 海風網站助手 | **活動頁珍奶日卡片倒數計時徽章**：新增 `.event-countdown-badge` 即時倒數（天:時:分:秒），暖身期開始後自動切換「已開始」狀態。CSS 含 `countdown-badge-pulse` 脈衝動畫 + expired 綠色狀態。深色/淺色模式同步 |
| 2026.04.25 | 海風網站助手 | **活動頁珍奶日卡片視覺強化**：新增 `.event-card-featured` 樣式（sand 色調邊框 + 光暈 + 漸層 accent 條），讓即將開始的活動更醒目 |
| 2026.04.25 | 海風網站助手 | **首頁精選活動橫幅階段時間軸**：新增 `.featured-event-timeline` 四階段指示器（測試→暖身→正式→兌換），JS 動態更新當前階段（done/active），含 `timeline-active-pulse` 脈衝動畫。深色/淺色模式同步 |
| 2026.04.25 | 海風網站助手 | 全站 CSS/JS cache busting 統一更新為 250425b |
| 2026.04.25 | 海風網站助手 | **違規處分頁精簡**：penalties.json 從 13 筆縮減至 3 筆，僅保留 GoldenLao (#0011)、Nakk_tiktok (#0012)、史莱姆 Slime Ch. (#0013) |
| 2026.04.25 | 海風網站助手 | #0012/#0013 判決書內容從 Google Docs 提取後直接寫入 penalties.json（取代外部連結）；JS 渲染拆分為 `buildJudgment`（新判決書格式）+ `buildLegacy`（舊 Discord 格式）；主文區塊新增 `.judgment-main` 左邊框樣式 |
| 2026.04.25 | 海風網站助手 | **處分頁案號系統重構**：JSON 新增 caseYear/caseType/caseNum 結構化欄位；案號以年度＋訴字/簡字＋四位編號顯示（訴字=紫/簡字=藍）；當事人角色區分被告（紅）、原告（藍）、公訴人（紫）、經舉發（橙）四色標籤；卡片標題顯示被告名稱 |
| 2026.04.25 | 海風網站助手 | **活動頁全面調整**：①常駐活動卡片移除「常態開放」日期顯示；②珍奶日卡片移除日期（右上角 badge 已有）；③「暖身期」全站統一改為「調整期」（首頁橫幅+時間軸+活動頁 stages+倒數計時 JS）；④常駐活動 detail 頁（風汐系列、那個魚）新增基本資訊區塊（info-grid）；⑤生存起源 detail 頁移除舉辦者欄位；⑥攝影大賽 detail 頁移除評審欄位 |
| 2026.04.25 | 海風網站助手 | **活動頁修正**：風汐系列 detail 頁 badge 顏色從 lavender(紫) 改為 foam(綠) 統一常駐活動色調；淺色模式進度條漸層對齊深色模式（`var(--sand)` → `var(--sky)`） |
| 2026.04.25 | 海風網站助手 | **活動列表頁移除舉辦人、detail 頁加基本資訊**：活動列表頁所有卡片移除 👤 行；風汐系列/那個魚/攝影大賽 detail 頁新增基本資訊區塊（含舉辦者：神焰 / 狐桃+神焰 / 石頭） |
| 2026.04.25 | 海風網站助手 | **首頁淺色模式大幅修正**：hero 背景改回深色（與深色模式相同），避免灰濛濛；hero 文字/按鈕/提示改為白色系玻璃風格；hero 圖片 filter 對齊深色模式；精選活動背景加強對比；section-tint 色調加深；feature-card 邊框/shadow 加強；倒數區塊加深 |
| 2026.04.25 | 海風網站助手 | **文化藝廊路徑重構**：`lore/` 資料夾改名為 `文化藝廊/`；`禁忌天使.html` 改名為 `雅.html`；全站 href/canonical/sitemap 更新；邊境之村標題加英文副標；翠籙幽光書庭標題加英文副標；雅頁面標題/描述/h1/alt 全面更新 |
| 2026.04.25 | 海風網站助手 | **文化藝廊子頁面重新命名**：`library.html` → `翠籙幽光書庭.html`、`glavent.html` → `格拉文特.html`、`brettland.html` → `布雷特蘭.html`；全站 href/canonical/sitemap 更新；格拉文特標題「風與雪之城 \| Glavent - Town of Wind and Snow」；布雷特蘭標題「永恆的羅馬 \| Brettland - Eternal Rome, Eternal Glory」；文化部長加註（石頭） |
| 2026.04.25 | 海風網站助手 | **端午節 detail 頁配方同步**：南部粽改為 NPC 兌換面板（10 格材料）、北部粽改為工作台 3×3（9 格材料），與設計文件對齊。頁面已存在但尚未加入活動列表頁連結（待活動正式公告後再上線） |
| 2026.04.26 | 海風網站助手 | 全站 21 個頁面頁尾日期統一更新至 2026.04.26，CSS/JS cache busting 統一為 260426a |
| 2026.04.26 | 海風網站助手 | **活動頁卡片強化**：新增 `.event-status-dot` 狀態指示燈（live=綠色脈衝/upcoming=橙色脈衝），風汐系列/那個魚/攝影大賽/生存起源標記為 live，珍奶日標記為 upcoming；stagger 動畫補齊第 6 張卡片延遲（0.6s）；Hero 底部新增漸層裝飾線（border-image） |
| 2026.04.26 | 海風網站助手 | **首頁＋公告頁珍奶日公告置頂**：inline JSON 中 #0027「2026 海風國際珍奶日」pinned 改為 true，公告欄顯示 📌 置頂標記 + sand 色左邊框（CSS 已有 `.bulletin-item.pinned` 樣式） |
| 2026.04.26 | 海風網站助手 | **團隊頁頭像修復**：skinmc.net API 被 Cloudflare 擋住（403），全部 12 個成員頭像改用 mc-heads.net（`mc-heads.net/head/玩家名/100`），dns-prefetch 同步更新 |
| 2026.04.26 | 海風網站助手 | **首頁細節層次提升**：①伺服器資訊數值改為漸層文字（`background-clip:text`），從純白改為 accent 色調漸層，hover 時發光增強；②Hero 資訊卡新增頂部 accent 漸層裝飾線（`::before`），hover 時從兩側展開；③特色卡片圖示新增閒置微浮動呼吸動畫（`icon-idle-float` 4s cycle），hover 時動畫暫停進入互動態；④加入步驟編號加大（28→34px）+ 外圈光暈 + 脈衝呼吸動畫（`join-num-breathe`）；⑤Footer Logo 新增發光呼吸動畫（`footer-logo-glow` 4s cycle）。全站 CSS/JS cache busting → 260426b |
| 2026.04.26 | 海風網站助手 | 全站 76 個頁面頁尾日期統一更新至 2026.04.26，CSS/JS cache busting 統一為 260426c |
| 2026.04.27 | 海風網站助手 | **活動頁珍奶日階段同步**：「測」從 active 改為 done，「調整期」改為 active（4/27 調整期正式開始）。新增 JS 動態更新邏輯（`#bubbleTeaStages`），與首頁時間軸同步——根據當前日期自動切換四階段狀態（測試→調整→正式→兌換） |
| 2026.04.27 | 海風網站助手 | 全站 76 個頁面頁尾日期統一更新至 2026.04.27，CSS/JS cache busting 統一為 270427a |
| 2026.04.27 | 海風網站助手 | **新增「嵐峰鎮」文化藝廊頁面**（#8）：格拉文特南方 200 格的雪原聚落世界觀文章。建築特色（石骨木皮＋深板岩冠）、九棟建築介紹（海風手搖站/材料研究所/任務公會/可頌師傅的家/溫馨小家/「你」的家/第二哨站/教堂/麥當勞）、霧中點燈習俗。文化藝廊列表新增卡片、格拉文特導航新增「嵐峰鎮 →」連結 |
| 2026.04.27 | 海風網站助手 | **珍奶日倒數計時過期狀態修正**：首頁倒數計時過期後隱藏分隔符（`:`）和時/分/秒標籤，統一顯示「已開跑」；urgency 文字改為「調整期已開始」更精確；活動頁倒數徽章過期後 `clearInterval` 停止 timer（之前持續執行）；CSS 新增 `.featured-event-countdown.expired .countdown-sep{display:none}` + `.countdown-label{width:100%;text-align:center}`。全站 76 頁 cache busting → 270427b |
| 2026.04.27 | 海風網站助手 | **珍奶日倒數目標改為正式期 5/4**：首頁 target 從 `2026-04-27T10:00` 改為 `2026-05-04T00:00`；進度條文字「調整期 4/27」→「正式期 5/4」；urgency 文字全面更新（到期：「正式期已開始」/ 未到期：「5/4 正式期開跑 → 5/31 結束」）。活動頁 target 同步更新、倒數標籤「距離正式期開始」、到期文字「正式期已開始」。全站 76 頁 cache busting → 270427c |
| 2026.04.27 | 海風網站助手 + 用戶 | **嵐峰鎮文化藝廊文章重寫**：地理加入「海拔高於格拉文特」；建築工藝從「石骨木皮＋雲杉暖木＋深板岩冠」改為「石基木身＋板岩屋頂（含避雷針）＋居住之地」；建築介紹從獨立 h3 段落改為列表格式；段落標題「烟火與日常」改為「鎮上建築」；meta description 同步更新。文化藝廊列表頁卡片描述同步更新 |
| 2026.04.27 | 海風網站助手 | **活動頁視覺強化**：①Section label 升級——新增左側彩色 accent bar（`::before` 漸層 sky→foam）、emoji 圖標（🧭 常駐 / ⏳ 限時）、活動計數徽章（`.label-count`）；②常駐與限時活動之間新增漸層分隔線（`.events-section-divider`，含中心點綴 dot）；③Hero 區新增活動狀態摘要條（`.events-hero-stats`：進行中數量 + 珍奶日狀態 + 綠色脈衝指示燈）；④修復 light mode CSS 選擇器名稱錯誤（`.event-section-label` → `.events-section-label`，原選擇器永遠無法匹配）；⑤Light mode section label / divider 樣式同步（ocean-blue + teal 色調） |
| 2026.04.27 | 海風網站助手 | **活動頁新增「活動年曆」區塊**：6 個季節分區卡片（🌸春/☀️夏/🍂秋/❄️冬/🔄常駐/📅每週），展示全年度 14 個活動規劃。每個項目含狀態指示燈（🟢進行中/🟠即將開始/⚪設計中/🔵已完成）+ 日期。底部圖例說明四種狀態。深色/淺色模式完整支援，手機版單欄響應式。`.cal-*` 系列 CSS（~80 行） |
| 2026.04.27 | 海風網站助手 | **8 個文化藝廊頁面導航修復**：全部 lore 頁面（嵐峰鎮/布雷特蘭/格拉文特/瑟爾納大橋/索西斯墓/翠籙幽光書庭/邊境之村/雅）須知下拉選單補齊「設計規範」連結（之前缺失，僅首頁/子頁面有）。嵐峰鎮封面圖改為 `<picture>` 包裹（WebP + PNG fallback），alt 文字改為更具描述性的「嵐峰鎮 — 雪原裡的烟火，石基木身與板岩屋頂的居住聚落」 |
| 2026.04.27 | 海風網站助手 | **端午節詳情頁全面對齊 DESIGN.md + items.yml**：原料從 10 種改回 6 種（糯米/五花肉/特殊蛋/粽葉/花生/米蟲），移除魷魚/滷花生/滷肉/台灣香菇/金鉤蝦/栗子。名稱對齊 items.yml（滷肉→五花肉、滷花生→花生）。南北粽配方對齊 recipes.yml。粽子效果對齊 items.yml（飽食 4 + 飽和 7，南部粽+回復 I、北部粽+速度 I）。稱號區塊加入冠軍獎勵物品名稱（划龍舟獎盃、立蛋獎） |
| 2026.04.27 | 海風網站助手 | **公告欄置頂項目 shimmer 邊框動畫**：`.bulletin-item.pinned::before` 新增三色漸層 shimmer 動畫（sand→sky→foam，4s 循環），hover 時亮度提升（opacity 0.5→0.8）。Light mode 同步（ocean-blue→sky→foam 色調）。公告 hover box-shadow 增加 tag 色調底部發光（公告藍/更新綠/活動橙/維護紅）。全站 76 頁 cache busting → 270427d |
| 2026.04.27 | 海風網站助手 | **珍奶日詳情頁時間軸動態更新 + 飲品卡片視覺強化**：時間軸加入 JS 動態更新邏輯（與首頁同步），根據當前日期自動切換四階段狀態（測試→調整→正式→兌換）。修復調整期日期標籤 HTML 截斷。限定款飲品卡片新增 shimmer 漸層邊框動畫（gold 3s 循環）。新增 `.etv-dot.done` CSS 樣式（深色/淺色模式） |
| 2026.04.27 | 海風網站助手 | **導航 active 狀態修復**：JS `currentPage` 匹配邏輯從 `pathname.split('/').pop()` 改為去除副檔名後比對（`replace(/\.(html?|php|asp)$/i, '')`），修復因 `.html` 副檔名導致所有頁面導航高亮永遠不匹配的 bug。首頁特殊處理 `index ↔ 首頁` 映射 |
| 2026.04.27 | 海風網站助手 | **頁面載入動畫**：首頁 + 6 個主要頁面（活動/公告/文化藝廊/海風指南/海風團隊/社群須知）新增海洋主題載入畫面——`page-loader` 全屏覆蓋（`z-index:99999`），含 `loader-logo`（海風文字 shimmer 漸層動畫）+ `loader-wave`（波浪動畫）。頁面 load 完成後 0.6s fade-out + 移除 DOM。3s safety timeout。CSS 新增 `.page-loader` / `.loader-logo` / `.loader-wave` / `loader-shimmer` / `loader-wave-move` |
| 2026.04.27 | 海風網站助手 | **手機版導航背景遮罩**：JS 動態建立 `.nav-backdrop` 元素，手機版導航展開時顯示半透明黑色遮罩（opacity 0→1 transition），點擊遮罩可關閉導航。CSS 新增 `.nav-backdrop` / `.nav-backdrop.visible` 樣式。`closeMobileNav()` 統一函式管理 toggle/backdrop/links 狀態 |
| 2026.04.27 | 海風網站助手 | **珍奶日詳情頁視覺強化**：①Hero 區新增浮動珍珠粒子動畫（12 顆隨機大小/位置/延遲的 `btea-float` 粒子，從底部飄浮消散）；②新增當前階段指示器（`current-stage-banner`，JS 根據日期動態顯示「調整期進行中」/「正式期」/「兌換期」/「活動已結束」）；③修正調整期描述（暖身期尚未開放兌換飲品）；④飲品卡片 hover 增強（左側 accent 條 + 名稱變色 + 效果發光）；⑤代幣商店 hover 左側漸層 accent 條；⑥原料項目 hover 微光暈；⑦任務項目 hover 滑動+高亮；⑧玩法步驟 hover 上浮+圖示彈跳；⑨挑戰卡片 hover 上浮+陰影。cache busting → 270427e |
| 2026.04.27 | 海風網站助手 | **珍奶日貨幣+商店+NPC 全面更新**：代幣→環保杯（custom eco-cup icon）；環保杯商店→小賣部；原料 emoji→MC 遊戲物品圖（14 張 16×16 材質）；步驟四改為「兌換限定稱號」；NPC 三角色：茶茶（小賣部）、小珍（飲品）、杉杉來持（5/28 贊助商稱號兌換）；稱號區塊更新 5/28 兌換期 + 贊助商資訊 |
| 2026.04.28 | 海風網站助手 | **CSS 清理 + 圖片載入優化**：①移除空的 `@media (max-width: 768px){}` 死代碼（line 2740）；②新增 `img[loading="lazy"]` 淡入動畫（CSS opacity transition + JS `.loaded` class 監聽），讓 lazy-load 圖片不再突然出現；③全站 76 頁頁尾日期統一更新至 2026.04.28；CSS/JS cache busting → 280428a |
| 2026.04.28 | 海風網站助手 | **精選活動橫幅階段指示器**：新增 `.featured-event-phase` 動態階段標籤（調整期進行中 / 正式期進行中 / 兌換期進行中 / 活動已結束），JS 根據當前日期自動切換。進度條追蹤範圍從「調整期起點→活動終點」，讓調整期階段也有進度回饋。CSS 含四色階段樣式（foam/sky/lavender/fog）+ 脈衝指示燈動畫，深色/淺色模式同步 |
| 2026.04.28 | 海風網站助手 | **Hero 資訊卡 stagger 入場動畫**：三張資訊卡（伺服器位址/版本/狀態）從瞬間出現改為 stagger 淡入（opacity 0→1 + translateY 16px→0），延遲 0.4s/0.52s/0.64s，與 Hero 展開動畫銜接 |
| 2026.04.28 | 海風網站助手 | **公告欄「查看全部公告」連結**：展開 12 則 inline 公告後，底部出現「查看全部公告 →」按鈕連結至公告頁。JS 新增 `bulletinViewAll` 元素控制顯示，CSS 新增 `.bulletin-view-all` 樣式 |
| 2026.04.28 | 海風網站助手 | **加入步驟連接線動態動畫**：`.join-connector::after` 節點改為旅行動畫（`connector-dot-travel`，從左至右 2.5s 循環）；SVG 路徑新增 `stroke-dasharray: 6 4` + 流動動畫（`connector-dash-flow`，1.5s 循環） |
| 2026.04.28 | 海風網站助手 | 全站 76 頁 CSS/JS cache busting 統一更新至 280428c |
| 2026.04.28 | 海風網站助手 | **活動頁新增端午節卡片**：限時活動區新增「🐉 2026 海風端午節」卡片（foam 色調，6/5–6/30），含四階段指示器（測試→建造→正式→收尾）+ JS 動態更新、玩法標籤（南北粽票選/立蛋挑戰/龍舟競賽/限定稱號）。限時活動計數 2→3。端午節詳情頁補上 page-loader 載入動畫（與其他頁面一致） |
| 2026.04.28 | 海風網站助手 | **端午節南北粽票選改為「選一」制**：每人只能選一邊，選了不能改。活動結束後凡有上線過的玩家皆可獲得贏方稱號。詳情頁票選區塊 + 稱號表格同步更新。events repo DESIGN.md 同步 |
| 2026.04.28 | 海風網站助手 | **端午節 NPC 設計**：名稱從「海風粽師」改為「木地人」（§a木地人 §6🐉），綠色中式服裝 skin。一個 NPC 包辦四項功能：原料兌換、粽子合成、陣營選擇、稱號領取。南北粽統一使用 NPC 兌換面板合成。網站詳情頁 + events repo 同步 |
| 2026.04.28 | 海風網站助手 | **端午節詳情頁全面重寫**：對標珍奶日設計品質——CSS 粽子藝術（三角粽葉+綁繩）、浮動葉片粒子動畫、視覺時間軸（JS 動態）、Quick Stats（6 原料/2 粽子/3 稱號）、NPC 區（木地人皮膚+四功能+南北粽對話）、玩法總覽步驟卡、原料卡片網格、粽子對比卡片、票選/立蛋/龍舟/稱號區塊。全頁 1356 行，含 light mode + responsive + fade-in + section-divider + page-loader + back-link。NPC 位置改為小台北園區、顯示名稱移除 §l 粗體、對話改為南北粽對立網路梗 |
| 2026.04.28 | 海風網站助手 | **DESIGN.md 新增第 8 節「活動子頁面設計指南」**：規範活動詳情頁的結構（Hero→基本資訊→NPC→時間軸→玩法→內容→稱號→Footer）、CSS 藝術規範、視覺時間軸規範、區塊規範、樣式規範（accent 色/Light mode/Responsive）、JS 規範、Cache Busting 規範。章節重新編號 8→11 |
| 2026.04.28 | 海風網站助手 | **設計規範第三節調整**：名詞解釋（特殊物品 ID、上線）移至第一章；ID 命名規則→識別碼命名方式；移除「可重建同 ID」例外條款；規則重新編號 1–3 |
| 2026.04.28 | 海風網站助手 | **新增維護公告 #0291**：4/28 11:00–17:00 維護 + 近兩日再次維護合併分流。announcements.json + 首頁 inline + 公告頁 inline 同步更新 |
| 2026.04.28 | 海風網站助手 | **設計規範新增第三節「物品管理」**：規範特殊物品 ID 命名規則（前綴_序號、大寫英文、不可重複使用）、上線後限制（不得修改 ID 或刪除、替換需建新 ID）、活動專案記錄要求（代號 + 自訂物品配置）。原第三～七節重新編號為第四～八節。修訂日期更新至 115.04.28 |
| 2026.04.28 | 海風網站助手 | **端午節原料擴充至 10 種 + ID 重新編號**：events repo items.yml 新增 5 種原料（魷魚/滷花生/台灣香菇/金鉤蝦/栗子），移除重複的舊「花生」，五花肉→滷肉。ID 重新編號為 01–15（01–04 活動道具、05–14 原料、15 加工品鹹蛋黃）。recipes.yml 北部粽從工作台 3×3 改為 NPC 兌換面板（與南部粽統一），NPC 名稱統一為「木地人」，新增全部 6 項種植兌換配方。mobs.yml/spawns.yml/DESIGN.md 同步更新 ID 引用 |
| 2026.04.28 | 海風網站助手 | **全站插件名稱清除**：移除網站上所有插件英文名稱——端午節活動頁「MMOItems」→「活動道具」、「MythicMobs」→「怪物」（3 處）；歷史館「MMOItems」→「自訂物品」（1 處）；設計規範「MMOitems/ExecutableItems/MMOItems」→「自訂物品插件/自訂物品」（3 處）；公告 inline JSON + announcements.json「MMOitem」→「自訂物品」（5 處）；指南「SuperHarvest」→「連鎖採集功能」（3 處）、「Residence」→「領地系統」（1 處）。全站掃描確認無殘留 |
| 2026.04.28 | 海風網站助手 | **風景照投稿區塊強化**：①Section description 改為含 `#風景照投稿` 頻道名稱的完整說明，取代原本簡略的「在DC上可以投稿」；②新增 `.photo-hint` 提示卡片（📸 圖示 + code 標籤顯示頻道名稱 + 說明文字），含玻璃質感背景 + hover 互動 + 淺色模式；③Section header 補上 `section-desc` 副標題。深色/淺色模式同步 |
| 2026.04.28 | 海風網站助手 | **景觀明信片 Label 玻璃質感強化**：`.postcard-label` 從純文字浮現改為 `inline-flex` pill 樣式——新增 `backdrop-filter:blur(12px)` 毛玻璃背景、`rgba(0,0,0,0.45)` 半透明底色、`border:1px solid rgba(255,255,255,0.1)` 邊框、`border-radius:var(--radius-md)` 圓角、`padding:6px 12px` 內距、`width:fit-content` 自適應寬度。hover 浮現動效保持不變 |
| 2026.04.28 | 海風網站助手 | **頁面載入動畫脈衝點點**：`.page-loader` 新增 `.loader-dots`（3 顆 6px 圓點，依序脈衝縮放 + 透明度動畫，1.4s 循環，各延遲 0.2s）。首頁 + 公告/文化藝廊/活動/海風團隊/社群須知/端午節共 7 個頁面同步加入 HTML |
| 2026.04.28 | 海風網站助手 | **輪播指示點 hover 強化**：`.carousel-dot` 新增 `box-shadow` + `transform:scale(1.2)` hover 效果；`.active` 狀態新增發光陰影；transition 從 0.3s 改為 0.4s 更優雅。淺色模式 `.carousel-dot.active` 改為 ocean-blue 色調 |
| 2026.04.28 | 海風網站助手 | **輪播圖片 hover 強化**：`.carousel-slide img` 新增 `filter:brightness(1.08)` + `box-shadow` 邊框發光效果（sky 色調 2px ring），淺色模式同步。transition 加入 filter 屬性 |
| 2026.04.28 | 海風網站助手 | 全站 75 頁 CSS cache busting 統一更新至 280428d |
| 2026.04.29 | 海風網站助手 | **首頁公告欄無障礙改善**：`#bulletinBoard` 容器新增 `aria-live="polite"` 屬性，讓螢幕閱讀器在公告動態載入時自動播報。Lightbox counter 已有 `aria-atomic="true"` ✅ |
| 2026.04.29 | 海風網站助手 | **DESIGN.md 恢復與更新**：從 git 歷史恢復 DESIGN.md（最新 commit 誤刪），更新最後修改日期、新增第 12 節「網站品質分析報告」（涵蓋效能/無障礙/SEO/設計四大面向的現狀分析與改善建議） |
| 2026.04.29 | 海風網站助手 | **CSS 微調優化**：①修正 light mode 中 `.lightbox` 背景色繼承問題（確保深色遮罩在淺色模式下正常顯示）；②公告欄展開按鈕 focus 樣式增強（新增 `outline: 2px solid var(--sky)` 鍵盤導航可見焦點） |
| 2026.04.29 | 海風網站助手 | **首頁公告欄取消釘選**：inline JSON 中珍奶日公告 `pinned` 改為 `false`，移除 📌 標記和 shimmer 邊框動畫 |
| 2026.04.29 | 海風網站助手 | **特色卡片 hover 動畫修復**：①淺色模式 `.feature-card:hover` 補上遺漏的 `transform:translateY(-8px)`（深色模式有但淺色模式從未有過，導致淺色模式下 hover 無上浮動畫）；②移除 `.feature-card` 的 `overflow:hidden`（會裁切 hover 光暈效果） |
| 2026.04.29 | 海風網站助手 | **全站淺色模式 hover 動畫修復**：10 個淺色模式 hover 規則補上遺漏的 `transform`（info-card/featured-event/lore-preview-card/postcard-item/join-step/card/carousel-slide/photo-item/lore-card/partner-row）。深色模式全部有但淺色模式覆蓋規則漏掉了 transform 屬性 |
| 2026.04.29 | 海風網站助手 | **hover transition 時間統一**：info-card 0.2s→0.4s、carousel-slide img 0.3s→0.4s，與 feature-card/postcard-item 一致（0.4–0.5s） |
| 2026.04.29 | 海風網站助手 | **活動詳情頁 JSON-LD Event 結構化資料**：全部 6 個活動詳情頁（珍奶日/端午節/生存起源/風汐系列/那個魚/攝影賽）加入 Schema.org Event 結構化資料，含 name/description/dates/location/organizer/offers/subEvent。限時活動含多階段 subEvent。提升 Google 搜尋展示效果（Rich Results）。DESIGN.md 改善建議標記為已完成 |

---

## 12. 網站品質分析報告

> 最後分析：2026.04.29（海風網站助手）

### 12.1 效能表現

| 項目 | 狀態 | 說明 |
|---|---|---|
| 圖片格式 | ✅ 優秀 | Hero 圖使用 WebP + PNG fallback（`<picture>` 元素），logo 全站 WebP |
| 圖片載入 | ✅ 優秀 | lazy-loading + fade-in 動畫，首屏圖片 fetchpriority="high" |
| CSS 體積 | ⚠️ 中等 | style.css 3260 行，含 307 個 light mode 選擇器，可進一步合併精簡 |
| JS 體積 | ✅ 良好 | main.js 1363 行，使用 requestIdleCallback 延遲非關鍵功能 |
| 字體載入 | ✅ 優秀 | Google Fonts preconnect + display=swap |
| 公告載入 | ✅ 優秀 | 首頁/公告頁均有 inline JSON（12/50 則），減少 API 請求 |
| 音頻 | ✅ 良好 | Web Audio API 生成白噪音，無外部檔案依賴 |

### 12.2 無障礙（Accessibility）

| 項目 | 狀態 | 說明 |
|---|---|---|
| Skip Link | ✅ | 首頁 + 子頁面均有 `.skip-link` |
| 鍵盤導航 | ⚠️ | 公告欄展開按鈕缺少可見 focus 樣式（已修正） |
| aria-live | ✅ | 伺服器狀態 `role="status"` + Lightbox counter `aria-atomic` |
| 圖片 alt | ✅ | 明信片 5 張已有具體建築描述 alt，其餘圖片均有 alt |
| 色彩對比 | ✅ | 深色模式 `--fog` (#8b949e) 對 `--deep` (#0d1117) 比值 ~4.6:1 |
| 螢幕閱讀器 | ⚠️ | 公告欄動態載入缺少 aria-live（已修正） |

### 12.3 SEO

| 項目 | 狀態 | 說明 |
|---|---|---|
| meta description | ✅ | 全站所有內容頁均已補齊 |
| Open Graph | ✅ | 首頁有完整 og:title/description/image/type/url |
| JSON-LD | ✅ | 首頁有 WebSite + Organization 結構化資料 |
| sitemap.xml | ✅ | 覆蓋所有主要頁面 |
| canonical | ✅ | 所有頁面有 canonical URL |
| 404 頁面 | ✅ | 有 noindex meta + 豐富互動內容 |

### 12.4 設計品質

| 項目 | 評分 | 說明 |
|---|---|---|
| 視覺一致性 | ⭐⭐⭐⭐⭐ | 深色/淺色模式完整覆蓋，CSS 變數系統統一 |
| 動畫品質 | ⭐⭐⭐⭐⭐ | stagger/reveal/parallax 適度使用，不影響效能 |
| 響應式設計 | ⭐⭐⭐⭐ | 768px 斷點，手機版導航/卡片/佈局完整適配 |
| 互動回饋 | ⭐⭐⭐⭐⭐ | hover/focus/active 狀態豐富，複製 IP、lightbox、輪播 |
| 內容豐富度 | ⭐⭐⭐⭐⭐ | 文化藝廊世界觀、活動年曆、公告系統、風景照投稿 |

### 12.5 改善建議（按優先級）

**高優先：**
- [ ] 404.html 體積優化（將內聯 CSS/JS 外部化，目前該頁面體積偏大）
- [ ] CSS light mode 選擇器合併（307 個 `[data-theme="light"]` 可整理為區段式集中管理）

**中優先：**
- [x] 活動詳情頁加入 JSON-LD Event 結構化資料（提升 Google 搜尋展示）— 2026.04.29 ✅
- [ ] 圖片 alt 文字持續優化（部分功能圖示 alt 可更具描述性）
- [x] sitemap.xml lastmod 日期統一更新 — 全部已為 2026-04-29 ✅

**低優先：**
- [ ] PWA manifest 更新（檢查 icons 路徑與尺寸是否完整）
- [ ] 列印樣式（`@media print`）為主要內容頁添加
- [ ] 國際化準備（目前全站繁體中文，可考慮 i18n 結構）

---

## 11. 注意事項

1. **每次修改都要更新此文件的修改記錄**（第 9 節）
2. **CSS 結構不可破壞**：dark 樣式在前，light 覆蓋在該區段末尾
3. **Cache busting**：修改 CSS/JS 後更新 HTML 中的 `?v=日期碼`
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，每次需向使用者索取新 token**
6. **頁尾修改次數 deployCount 自動取得，不用手動改；但日期需要手動更新**
7. **Git 操作**：每次修改後 `git add -A && git commit -m "描述" && git push origin main`
