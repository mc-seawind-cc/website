# 海風 SeaWind 網站設計文件

> 最後更新：2026.04.22
> 維護者：海風網站助手

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
| 玩家須知 | `玩家須知.html` | 玩家規則與須知 |
| 支持須知 | `支持須知.html` | 贊助相關 |
| 管理規則 | `管理規則.html` | 管理規範 |
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
└── lore/                  # 文化藝廊子頁面（HTML）
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
22. Keyframe Animations (含 badge-pulse, featured-glow-pulse) ← 新增 04.18
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

## 8. 已知問題與待辦

### 已修復 ✅
- [x] 首頁新增精選活動橫幅（珍奶日預告）— 2026.04.18
- [x] 首頁精選活動新增倒數計時器 — 2026.04.19
- [x] 全站頁尾日期統一更新至 2026.04.19 — 2026.04.19
- [x] 首頁重新加入精選活動橫幅（珍奶日 4/27 預告，含倒數計時）— 2026.04.21
- [x] 首頁新增「社群數據」區塊（動態計數器：會員/Discord/公告/營運天數）— 2026.04.21

### 高優先
- [x] 首頁 Hero 連線版本文字 `1.21.6 ~ 26.x` — 已確認正確（2026.04.19）
- [x] 伺服器資訊區塊遊戲版本 `1.21.11(群騎紛爭)` — 已確認正確（2026.04.19）

### 中優先
- [x] ~~首頁增強版 Footer（含 Discord CTA + 伺服器 IP 快速複製）~~ → 已改為全站固定簡潔版 Footer — 2026.04.19
- [x] ~~CSS `[data-theme="light"]` 重複選擇器清理~~ → 已合併 3 個重複選擇器（.page-revise / .bulletin-body .b-content / .join-step:hover），實際僅 3 處非 264 處 — 2026.04.21
- [x] ~~圖片全面檢查 WebP fallback~~ → 全站 75 個 HTML 頁面 logo.png 全部加 `<picture>` 包裹（logo.webp fallback）、guide-menu / mcu 同步處理 — 2026.04.21
- [x] ~~大 PNG 轉無損 WebP~~ → guide-menu.png / logo.png / mcu.png 已轉 lossless WebP — 2026.04.21
- [ ] 公告資料可考慮 inline 到 HTML（減少 API 請求）
- [ ] 首頁增強版 Footer（含 Discord CTA + 伺服器 IP 快速複製）需推廣到其他頁面
- [ ] 無障礙：Lightbox 已有 `aria-live`（counter），圖片 `alt` 可更描述性
- [ ] 404.html 體積偏大（可將動畫 CSS/JS 外部化）
- [ ] SEO：各子頁面 meta description 檢查

### 低優先
- [x] ~~首頁 Hero 標題可考慮加入微互動（如字元 hover 粒子效果）~~ → 已有 wind-sway + hover scale/shadow 動畫 — 2026.04.19
- [x] ~~首頁「如何加入海風」區塊可加入連接線動畫~~ → 新增 connector-pulse 節點脈衝 + dash-flow 虛線流動動畫 — 2026.04.19
- [ ] 首頁 Hero 標題 hover 可進一步加入色彩粒子特效（目前已有放大+上浮+陰影）
- [ ] 特色卡片可加入漸進式編號指示器（如 1→2→3 連線動畫）

---

## 9. 修改記錄

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

---

## 10. 注意事項

1. **每次修改都要更新此文件的修改記錄**（第 9 節）
2. **CSS 結構不可破壞**：dark 樣式在前，light 覆蓋在該區段末尾
3. **Cache busting**：修改 CSS/JS 後更新 HTML 中的 `?v=日期碼`
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，每次需向使用者索取新 token**
6. **頁尾修改次數 deployCount 自動取得，不用手動改；但日期需要手動更新**
7. **Git 操作**：每次修改後 `git add -A && git commit -m "描述" && git push origin main`
