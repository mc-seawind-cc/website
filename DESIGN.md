# 🌊 海風網站設計文件 DESIGN.md

> 建立：2026-04-14 | by 海風網站助手
> 網站：https://www.seawind.cc
> 倉庫：https://github.com/mc-seawind-cc/website

---

## 📋 目錄

1. [網站架構總覽](#網站架構總覽)
2. [檔案結構](#檔案結構)
3. [已發現的問題與 Bug](#已發現的問題與-bug)
4. [效能優化建議](#效能優化建議)
5. [用戶體驗改善方案](#用戶體驗改善方案)
6. [設計風格指南](#設計風格指南)
7. [技術備註](#技術備註)
8. [修改記錄](#修改記錄)

---

## 🏗️ 網站架構總覽

**類型**：純靜態網站（GitHub Pages 託管）
**域名**：www.seawind.cc（透過 CNAME 指向）
**用途**：Minecraft 伺服器「海風 SeaWind」官方網站
**技術棧**：
- 純 HTML + CSS + Vanilla JS（無框架）
- Google Fonts（Noto Sans TC / Noto Serif TC）
- Web Audio API（環境音效）
- Intersection Observer（滾動動畫）
- GitHub Pages 部署

**主題系統**：
- 深色模式（預設）+ 淺色模式
- 透過 `data-theme="light"` CSS 變數切換
- localStorage 持久化使用者偏好
- 自動偵測系統偏好 `prefers-color-scheme`

---

## 📁 檔案結構

### HTML 頁面（共 25 個）
| 頁面 | 路徑 | 大小 | 用途 |
|------|------|------|------|
| 首頁 | `首頁.html` | 17KB | 主頁面，公告/特色/藝廊/明信片/風景照 |
| index | `index.html` | ~1KB | 重導向頁 → 首頁.html |
| 公告 | `公告.html` | 35KB | 全部公告列表（最大頁面） |
| 海風指南 | `海風指南.html` | 33KB | 遊戲教學（第二大頁面） |
| 404 | `404.html` | 27KB | 錯誤頁面（含精美海洋動畫場景） |
| 其餘 20 頁 | 各 `.html` | 7~20KB | 規則/團隊/會員/連結/合作夥伴等 |

### CSS 檔案（兩套系統並存 ⚠️）
- **`style.css`**（2611 行）— 所有頁面引用的主樣式表，**包含了所有模組化 CSS 的內容**
- **`css/` 目錄**（18 個模組檔案）— 好像是拆分出來的，但**目前沒有頁面引用這些檔案**
  - `base.css`（314 行）— 基礎樣式，實際上是 style.css 的開頭部分
  - `misc.css`（891 行）— 最大的模組
  - `bulletin.css`（661 行）— 公告欄樣式
  - `animations.css`（120 行）— 動畫定義
  - 其餘：nav, hero, footer, cards, lightbox, responsive 等

### JavaScript 檔案
- **`main.js`**（1194 行）— 主腳本，包含所有互動邏輯
- **`utils.js`**（293 行）— Discord Markdown → HTML 轉換器
- **`tips.js`**（131 行）— 首頁提示輪播資料
- **`music-player.js`** — 動態載入（由 main.js 創建 `<script>` 元素）

### 資料檔案
- `announcements.json` / `announcements_v2.json` — 公告資料
- `photos.json` — 風景照 URL 清單
- `penalties.json` — 違規處分資料
- `sitemap.xml` — SEO 站點地圖

### 靜態資源
- `assets/img/` — 圖片（logo, icons, 指南截圖）
- `assets/lore/` — 文化藝廊建築截圖
- `assets/sounds/` — 音效檔案
- `assets/announcements/` — 公告圖片
- `assets/photos_new/` — 新版風景照
- `assets/migrated/` — 遷移資料

---

## 🐛 已發現的問題與 Bug

### 🔴 嚴重

1. **CSS 系統混亂：兩套檔案重複**
   - `style.css` 包含了 `css/` 目錄下所有模組的內容
   - 所有頁面只引用 `style.css`，`css/` 目錄完全沒用到
   - 需要決定：保持 style.css 單一檔案，或拆分為模組化引用
   - **建議**：目前單一 style.css 對 GitHub Pages 是合理的（減少 HTTP 請求），但需要清理 `css/` 目錄或將其轉為 source of truth

2. **sitemap.xml 錯誤連結**
   - 存在 `特殊裝備規範.html`，但實際檔案為 `特殊道具規範.html`
   - 會導致爬蟲抓取 404 頁面

### 🟡 中度

3. **index.html 使用 `<meta http-equiv="refresh">` 做跳轉**
   - 同時使用了 `meta refresh` + `location.replace()` JavaScript 跳轉
   - `meta refresh` 對 SEO 不友善（搜尋引擎可能索引跳轉頁而非目標頁）
   - **建議**：改為直接將 `首頁.html` 的內容放到 `index.html`，或確保 GitHub Pages 設定正確的預設頁面

4. **外網圖片依賴**
   - 明信片區域使用 `truth.bahamut.com.tw` 外部圖片
   - 如果巴哈姆特圖床失效或被限速，會影響載入
   - 已有 `onerror` fallback 處理，但應考慮本地備份

5. **音樂播放器缺少預載**
   - `music-player.css` 在 head 中載入，但 `music-player.js` 透過動態 `<script>` 建立
   - 可能導致 FOUC（Flash of Unstyled Content）

6. **Lightbox 事件監聽器重複綁定**
   - `initPhotoGallery` 中每次開啟 lightbox 都 cloneNode 來避免重複
   - 這是可行的 workaround，但較不優雅；考慮用事件委派模式

### 🟢 輕微

7. **CSS 選擇器錯誤**
   - `css/base.css` 中有一行：`.guide-sb-group [data-theme="light"] .guide-sb-group [data-theme="light"] ...` — 嵌套選擇器明顯有誤
   - 在 `style.css` 中也有相同問題

8. **頁尾版本資訊硬編碼**
   - `網站最後修改日期 2026.04.14d` 是硬編碼在 HTML 中
   - deployCount 透過 GitHub API 取得 commit 數量（未認證時可能受限）

9. **404.html 體積過大**（27KB）
   - 含完整的海洋場景動畫（日出日落/夜晚/暴風雨 cycle）
   - 雖然精美，但作為錯誤頁面載入時間偏長
   - 建議將動畫 CSS/JS 外部化，利用快取

10. **`music-player.js` 不存在於倉庫根目錄**
    - main.js 動態載入 `SW_BASE + 'music-player.js'`
    - 該檔案可能在部署後才存在，或路徑問題

---

## ⚡ 效能優化建議

### 圖片優化
- [ ] 首頁 Hero 圖片（`homeHero.png`）已有 `.webp` 版本，但 HTML 只 preload PNG
  - 建議：使用 `<picture>` 元素做格式降級
- [ ] 風景照 carousel 一次載入所有照片 URL，但實際圖片 lazy loading
- [ ] icons 目錄中部分為 PNG，考慮轉為 WebP 或 SVG（更小、可縮放）

### 載入策略
- [x] 已做好：`preload` hero 圖片、`dns-prefetch` 外部域名、`defer` 腳本
- [x] 已做好：`IntersectionObserver` 做滾動觸發動畫
- [x] 已做好：照片頁無限捲動分批載入
- [ ] 建議：首頁公告欄資料可考慮 inline 到 HTML 中（減少一次 API 請求）
- [ ] 建議：使用 `content-visibility: auto` 對長頁面做渲染優化

### CSS 優化
- [ ] `style.css`（2611 行）中有大量 `[data-theme="light"]` 選擇器重複
- [ ] 考慮將深色/淺色主題分為兩個檔案，根據主題動態載入
- [ ] CSS 動畫使用 `will-change` 和 `transform`（已有部分），但 `contain: strict` 可能過度限制

### JavaScript 優化
- [ ] `main.js` 已做好 code splitting（deferredInit）
- [ ] 建議：`md2html()` 函式在 `utils.js` 中，所有頁面都載入但只有公告頁用到
  - 考慮將公告相關邏輯延遲載入

---

## 🎨 用戶體驗改善方案

### 導航體驗
1. **麵包屑導航** — 在子頁面（如 lore、guide）加入麵包屑，讓使用者知道位置
2. **搜尋功能** — 公告頁已有篩選，但全站搜尋可考慮使用簡單的 JSON 索引 + 客戶端搜尋
3. **導航高亮** — 已實作，但 dropdown 中的 active 狀態可更明確

### 首頁改善
4. **即時玩家數** — 已有，但可加入歷史趨勢小圖表（使用 canvas 繪製）
5. **快速加入按鈕** — 考慮加入「一鍵複製 IP 並開啟 Minecraft」的 deep link（`minecraft://`）
6. **社群動態** — 考慮嵌入 Discord widget 或最新訊息摘要

### 內容呈現
7. **閱讀進度** — 長文頁面（指南/規則）可加入閱讀進度指示
8. **返回上次位置** — 長頁面記住捲動位置（使用 sessionStorage）
9. **列印友善樣式** — 規則/條款頁面應有 `@media print` 樣式

### 無障礙
10. **已有**：skip link、aria-label、aria-expanded、role 屬性
11. **可改善**：
    - Lightbox 缺少 `aria-live` 區域來宣告圖片切換
    - 鍵盤導航在某些 dropdown 可能不完整
    - 圖片缺少有意義的 alt 文字（部分只有「海風風景照 N」）

### 行動裝置
12. **已有完善響應式設計**，但可考慮：
    - 觸控目標最小 44px（部分按鈕偏小）
    - PWA 支援（service worker + manifest）讓網站可安裝為 App

---

## 🎨 設計風格指南

### 色彩系統
```
深色主題（預設）：
  --deep:     #0d1117    （主背景）
  --ocean:    #161b22    （次背景）
  --drift:    #1c2333    （卡片背景）
  --mist:     #21283b    （邊框）
  --fog:      #8b949e    （次要文字）
  --cloud:    #c9d1d9    （主要文字）
  --white:    #e6edf3    （強調文字）

主題色：
  --sky:      #9dafff    （主色 — 淡藍）
  --foam:     #a8e6cf    （輔助 — 薄荷綠）
  --sand:     #deac80    （暖色 — 沙色）
  --ocean-blue: #578aff  （連結色）

強調色：
  --teal:     #58c2b0
  --lavender: #ab72f9
  --rose:     #ffb6c1
  --ice:      #85b1e0
  --blush:    #e0b5d4
```

### 字體
- 主要：`'Noto Sans TC'`（思源黑體繁體）
- Display：同上（未使用 Serif 作為 display font）
- 字重：400（正文）、500（導航）、700（標題）、800-900（大標題）
- 行高：1.7（正文）

### 間距系統
```
--space-xs:  0.25rem (4px)
--space-sm:  0.5rem  (8px)
--space-md:  1rem    (16px)
--space-lg:  1.5rem  (24px)
--space-xl:  2.5rem  (40px)
--space-2xl: 4rem    (64px)
```

### 圓角
```
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
```

### 動畫
- 預設 easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- 預設時長: `0.3s`
- 滾動觸發動畫：`fade-in`、`slide-up`、`zoom-in`、`slide-left`、`reveal-up`
- 所有動畫只觸發一次（`IntersectionObserver` + `unobserve`）
- 安全機制：3 秒後自動 reveal 所有隱藏元素

### 首頁 Hero 區域定義

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─ 標題區 ──────────────────────────────┐  │
│  │  海風                                │  │
│  └──────────────────────────────────────┘  │
│  ┌─ 副標題區 ───────────────────────────┐  │
│  │  在風與海之間，有一個可以長久生存的... │  │
│  └──────────────────────────────────────┘  │
│  ┌─ 互動區 ─────────────────────────────┐  │
│  │  [開始冒險]  [加入社群]              │  │
│  └──────────────────────────────────────┘  │
│  ┌─ 資訊狀態區 ─────────────────────────┐  │
│  │  位址     │  版本      │  狀態      │  │
│  │ seawind.cc│ 1.21~26.x  │  x/xx 在線 │  │
│  └──────────────────────────────────────┘  │
│  ┌─ 提示區 ─────────────────────────────┐  │
│  │  # 提示輪播文字...                    │  │
│  └──────────────────────────────────────┘  │
│                                             │
│            ↓ 向下探索 ↓                     │
└─────────────────────────────────────────────┘
```

**動畫規則**：
- 標題區：獨立動畫（char-rise 逐字浮現）
- 副標題區：打字機效果（延遲 0.1s 開始）
- **互動區 + 資訊狀態區 + 提示區**：同步觸發（延遲 0.3s），僅首次載入觸發，切換主題不重複
- 向下探索：延遲 0.6s

### 元件風格
- **卡片**：半透明背景 + 微妙邊框 + hover 浮起效果
- **按鈕**：漸變主色按鈕 + 描邊 outline 按鈕兩種
- **導航**：毛玻璃效果（backdrop-filter）+ 滾動時加深陰影
- **標籤**：彩色小膠囊（公告=#578aff、更新=#64dcb4、維護=#ff8282、活動=#ffaa32）

---

## 🔧 技術備註

### 部署流程
- 推送到 `main` 分支 → GitHub Pages 自動部署
- Cache busting 使用日期標記（如 `?v=260414g`）
- `deployCount` 透過 GitHub API 取得

### 外部依賴
- Google Fonts（字體）
- `api.mcsrvstat.us`（伺服器狀態查詢）
- `truth.bahamut.com.tw`（明信片圖片）
- `cdn.discordapp.com`（DNS prefetch，目前未直接使用）

### 瀏覽器支援
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）
- 使用 `backdrop-filter`（部分舊瀏覽器不支援）
- 使用 `requestIdleCallback`（有 fallback）
- Web Audio API（環境音效）

### 已知限制
- GitHub Pages 不支援伺服器端 301 跳轉
- 中文檔名 URL（首頁.html）在某些環境可能有問題
- GitHub API 未認證有 rate limit（60 requests/hour）

---

## 📝 修改記錄

| 日期 | 修改者 | 修改內容 |
|------|--------|----------|
| 2026-04-14 | 海風網站助手 | 建立 DESIGN.md，完整審查網站結構與問題 |

---

_此文件為團隊交接、討論與維護指南。任何修改請同步更新此文件。_
