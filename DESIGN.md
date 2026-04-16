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
| 404 | `404.html` | 68KB | 錯誤頁面（含海洋動畫、淨灘小遊戲、MCTI 性格測驗、18 款小遊戲） |
| 其餘 20 頁 | 各 `.html` | 7~20KB | 規則/團隊/會員/連結/合作夥伴等 |

### CSS 檔案
- **`style.css`**（~2760 行）— 唯一樣式表，已整理為 23 個區段，每區段 dark → light 順序排列
  - 區段：Reset/Variables → Global UI → Nav → Hero → Sections → Buttons → Cards → Bulletin → Lore → Photos → Partner → Member → Guide → Rules → Articles → Community → Team → Links → Footer → Lightbox → Misc → Animations → Responsive
  - 每個區段末尾集中該組件的 `[data-theme="light"]` 覆蓋
- ~~`css/` 目錄~~ — 已刪除（原本是未使用的重複副本）

### JavaScript 檔案
- **`main.js`**（1194 行）— 主腳本，包含所有互動邏輯
- **`utils.js`**（293 行）— Discord Markdown → HTML 轉換器
- **`tips.js`**（131 行）— 首頁提示輪播資料
- **`music-player.js`** — 動態載入（由 main.js 創建 `<script>` 元素）
- **`mob-smasher.js`**（~470 行）— 404 頁打怪物遊戲（53 種生物 sprite）
- **`minigames.js`**（~850 行）— 404 頁小遊戲合集（翻牌/反應/五子棋/記數/貪吃蛇/礦石記憶/方塊消除/射擊場）
- **`minigames.css`**（~170 行）— 小遊戲合集樣式

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
- `assets/mobs/` — 70 張 Minecraft 生物/物品 sprite（16×16px，圖源: mcwiki/遊戲資源檔，CC BY-NC-SA 3.0）

---

## 🐛 已發現的問題與 Bug

### ~~🔴 嚴重~~（已修復）

1. ~~**CSS 系統混亂：兩套檔案重複**~~ ✅ 2026-04-15 已修復
   - `css/` 目錄已刪除（20 個未使用檔案）
   - `style.css` 重新整理為 23 個區段，每區段末尾集中 light 主題覆蓋
   - 移除重複規則（如 html{scroll-behavior:smooth}）

2. ~~**sitemap.xml 錯誤連結**~~ ✅ 2026-04-15 已修復
   - 已無指向不存在檔案的連結
   - 新增遺漏的 partner-mcu.html

3. ~~**`特殊裝備規範.html` 死連結**~~ ✅ 2026-04-15 已修復
   - 7 個 lore 頁面 + template/nav.html 引用了不存在的 `特殊裝備規範.html`
   - 已從所有導航中移除此死連結
   - template/nav.html 已同步更新

### ~~🟡 中度~~（已修復）

4. ~~**index.html 雙重跳轉**~~ ✅ 2026-04-15 已修復
   - 移除多餘的 inline `<style>` 區塊
   - 保留 `meta refresh` + JS `location.replace()` 雙保險跳轉（GitHub Pages 無伺服器端 301）
   - 已有 `noindex` meta 避免搜尋引擎索引跳轉頁

5. ~~**CSS light 模式重複規則**~~ ✅ 2026-04-15 已修復
   - `.hero`、`.info-card`、`.info-label`、`.info-value` 在 light 模式各有 2-3 條衝突規則
   - 已移除被覆蓋的舊規則，保留最終生效版本

### 🟡 中度

6. **外網圖片依賴**
   - 明信片區域使用 `truth.bahamut.com.tw` 外部圖片
   - 如果巴哈姆特圖床失效或被限速，會影響載入
   - 已有 `onerror` fallback 處理，但應考慮本地備份

7. **音樂播放器缺少預載**
   - `music-player.css` 在 head 中載入，但 `music-player.js` 透過動態 `<script>` 建立
   - 可能導致 FOUC（Flash of Unstyled Content）

8. **Lightbox 事件監聽器重複綁定**
   - `initPhotoGallery` 中每次開啟 lightbox 都 cloneNode 來避免重複
   - 這是可行的 workaround，但較不優雅；考慮用事件委派模式

### 🟢 輕微

7. **CSS 選擇器錯誤**
   - ~~`css/base.css` 中有一行：`.guide-sb-group [data-theme="light"] .guide-sb-group [data-theme="light"] ...`~~ — 已不存在（`css/` 目錄已刪除）
   - `style.css` 中的相同問題也已不存在

8. **頁尾版本資訊硬編碼**
   - `網站最後修改日期` 是硬編碼在 HTML 中（全站 69 個頁面）
   - deployCount 透過 GitHub API 取得 commit 數量（未認證時可能受限，60 req/hour）

9. **404.html 體積過大**（27KB）
   - 含完整的海洋場景動畫（日出日落/夜晚/暴風雨 cycle）
   - 雖然精美，但作為錯誤頁面載入時間偏長
   - 建議將動畫 CSS/JS 外部化，利用快取

### ~~🟡 中度~~（已修復）

- ~~**打怪物 Grid 顯示為一行 9 個**~~ ✅ 2026-04-16 已修復
  - 原因：`minigames.css` 掃雷的 `.ms-grid { repeat(9) }` 覆蓋了 `mob-smasher.css` 打怪物的 `.ms-grid { repeat(3) }`
  - 修復：掃雷 CSS 類別從 `.ms-*` 改為 `.mw-*`（minesweeper prefix）
  - 同步更新 `minigames.js` 中掃雷 DOM 的 class 名稱

- ~~**首頁多餘 `</p>` 閉合標籤**~~ ✅ 2026-04-16 已修復
  - 第 315 行 `</p></p>` 修正為 `</p>`

### ✅ 新增功能（2026-04-16）

- **PWA 支援** — 新增 `manifest.json`，全站 22 個頁面加入 manifest + apple-touch-icon，網站可安裝為手機/桌面 App
- **動態 theme-color** — `meta[name="theme-color"]` 隨深色/淺色模式自動切換（dark: `#0d1117` / light: `#f6f8fa`），手機瀏覽器狀態列跟隨主題色
- **頁尾社群連結** — 首頁頁尾新增 Discord 社群按鈕 + 合作夥伴連結
- **SEO 強化** — 首頁 Open Graph 改用 Hero 大圖（1920×1080）、twitter:card 改為 summary_large_image、新增 og:locale / og:site_name / og:image:alt

---

## ⚡ 效能優化建議

### 圖片優化
- [x] 首頁 Hero 圖片改用 WebP（`image-set()` 自動降級 PNG），載入減少 ~90%（2MB → 217KB）
- [x] 照片頁背景圖改用 WebP（1.7MB → 101KB）
- [x] Guide 頁面已使用 `<picture>` 元素做 WebP 降級 ✅
- [ ] 風景照 carousel 一次載入所有照片 URL，但實際圖片 lazy loading
- [ ] icons 目錄中部分為 PNG，考慮轉為 WebP 或 SVG（更小、可縮放）

### 載入策略
- [x] 已做好：`preload` hero 圖片、`dns-prefetch` 外部域名、`defer` 腳本
- [x] 已做好：`IntersectionObserver` 做滾動觸發動畫
- [x] 已做好：照片頁無限捲動分批載入
- [ ] 建議：首頁公告欄資料可考慮 inline 到 HTML 中（減少一次 API 請求）
- [ ] 建議：使用 `content-visibility: auto` 對長頁面做渲染優化（已對 bulletin-board / photo-carousel / join-steps / feature-grid / guide-layout / footer 實作）

### CSS 優化
- [x] 清理 `.feature-grid` 重複宣告（4 個 → 1 個 + 2 個 modifier）
- [x] 清理 `.feature-card` 重複 `contain` 和 `::before` 宣告
- [ ] `style.css`（~2600 行）中有大量 `[data-theme="light"]` 選擇器重複
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
- **互動區 + 資訊狀態區 + 提示區 + 向下探索**：同步觸發（延遲 0.3s），僅首次載入觸發，切換主題不重複

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

## 📝 公告格式轉換與撰寫指南

### Discord 原始格式 → 網站公告轉換

Discord 上的公告長這樣：

```
## :diamond~1: 「 地圖系統改善 」

-# @更新通知 / 115.04.12 / #0289

- 新增地獄頂部圖層。
- 新增玩家方向標記。
- 進一步擴大了縮放等級。
- 改善地圖算繪。
- 改善縮放及移動操作。
```

轉換成 `announcements.json` 後變成：

```json
{
  "tag": "更新",
  "id": "#0289",
  "date": "115.04.12",
  "isoDate": "2026-04-12",
  "timestamp": "2026-04-12T15:18:00.000+08:00",
  "title": "地圖系統改善",
  "content": "- 新增地獄頂部圖層。\n- 新增玩家方向標記。\n- 進一步擴大了縮放等級。\n- 改善地圖算繪。\n- 改善縮放及移動操作。",
  "images": [],
  "localImages": [],
  "reactions": [],
  "reactionCount": 0,
  "discordId": "1492718735440613497",
  "pinned": false,
  "author": "",
  "index": 1
}
```

### 轉換規則

1. **標題**：從 `## :emoji: 「 標題 」` 擷取，去掉 emoji 和引號
2. **標籤（tag）**：從所屬 Discord 頻道決定（公告/維護/活動/更新）
3. **編號（id）**：從 `-# ... #0289` 擷取四位編碼，格式 `#0289`
4. **日期**：從 `-# ... / 115.04.12` 擷取民國年，轉存為 `isoDate`（西元 2026-04-12）和 `date`（民國 115.04.12）
5. **內文（content）**：移除標題行（`## ...`）和元資料行（`-# ...`），保留原始 Markdown 格式
6. **圖片（images / localImages）**：從 Discord 附件擷取，`images` 為原始 URL，`localImages` 為轉存 WebP 後的本地路徑
7. **Discord ID**：從匯出 JSON 的 `id` 欄位取得，用於連結回 Discord 原文

### 舊版 vs 新版格式差異

**舊版公告（引用格式）**：
```
〉 @公告通知

> 1. 基岩版連線版本。
> 2. 更新礦物代換。
> - 優化和修復錯誤。
> 3. 更新伺服器核心。
> 4. 會員專區新增裝備隱形功能。
-# 日期：113.08.08　｜　編號：公告0001
```
- 內文使用 `>` 引用符號包裹
- 編號格式為 `公告0001`（四位數字無井字號）
- 元資料使用 `日期：` 與 `編號：` 格式

**新版公告（列表格式）**：
```
## :Diamond: 「 基岩版更新 」

-# @更新通知 / 115.04.10 / #0288

- 基岩版連接埠修改為`` 51496 ``。
- 更新[海風官方網站](https://www.seawind.cc/)。
```
- 內文直接使用 `-` 列表格式，**不使用引用符號**
- 編號格式為 `#0288`（四位數字含井字號）
- 元資料使用斜線 `/` 分隔
- 縮排子項目使用兩個空格 + `-`

### 手動新增公告格式

若需手動在 `announcements.json` 中新增公告：

```json
{
  "tag": "公告",
  "id": "#0130",
  "date": "115.04.14",
  "isoDate": "2026-04-14",
  "timestamp": "2026-04-14T10:00:00.000+08:00",
  "title": "公告標題",
  "content": "- 第一項內容。\n- 第二項內容。",
  "images": [],
  "localImages": [],
  "reactions": [],
  "reactionCount": 0,
  "discordId": "",
  "pinned": false,
  "author": "管理員名稱",
  "index": 505
}
```

**注意事項**：
- `content` 中的換行使用 `\n`，不要用實際換行
- 列表項目以 `- ` 開頭（注意空格）
- 連結格式：`[文字](URL)`
- 行內程式碼使用反引號：`` `程式碼` ``
- `index` 為該則公告在陣列中的位置（從 0 開始）
- `isoDate` 格式為 `YYYY-MM-DD`（西元年）
- `date` 格式為 `民國年.MM.DD`
- **公告會自動按 `timestamp` 降序排列（最新在前）**

### 首頁公告欄 vs 公告頁面

| 功能 | 首頁公告欄 | 公告頁面 |
|------|-----------|---------|
| 顯示數量 | 預設 7 則，最多 12 則 | 全部，分頁載入 |
| 展開方式 | 點擊下拉展開/收合 | 全部直接展開 |
| 篩選 | 無 | 月份 + 類型 + 搜尋 |
| 日期格式 | `YYYY.MM.DD` | `民國年.MM.DD` |
| 預設範圍 | 最新 12 則 | 當月公告 |

---

## 📝 修改記錄

| 日期 | 修改者 | 修改內容 |
|------|--------|----------|
| 2026-04-14 | 海風網站助手 | 建立 DESIGN.md，完整審查網站結構與問題 |
| 2026-04-14 | 海風網站助手 | 全面更新公告資料（505 則），整合 Discord 四個頻道匯出 |
| 2026-04-14 | 海風網站助手 | 首頁公告欄改為下拉式（7 則預設/12 則上限），移除預覽文字 |
| 2026-04-14 | 海風網站助手 | 公告頁面加入民國年月份導航，預設顯示當月公告 |
| 2026-04-14 | 海風網站助手 | 公告類型排序改為：公告、維護、活動、更新，新增維護篩選 |
| 2026-04-14 | 海風網站助手 | DESIGN.md 新增公告格式轉換與撰寫指南 |
| 2026-04-15 | 海風網站助手 | 移除未使用的 css/ 目錄（20 個檔案），統一使用 style.css |
| 2026-04-15 | 海風網站助手 | 重新組織 style.css（23 區段 + light 主題覆蓋集中化） |
| 2026-04-15 | 海風網站助手 | 修復 sitemap.xml，新增遺漏的 partner-mcu.html |
| 2026-04-15 | 海風網站助手 | 🔴 修復 `特殊裝備規範.html` 死連結（7 個 lore 頁 + template/nav.html） |
| 2026-04-15 | 海風網站助手 | 清理 index.html，移除多餘 inline style |
| 2026-04-15 | 海風網站助手 | 修復 CSS light 模式重複/衝突規則（.hero, .info-card 等） |
| 2026-04-15 | 海風網站助手 | 同步 template/nav.html（加入 aria-expanded/aria-haspopup，修正順序） |
| 2026-04-15 | 海風網站助手 | Lightbox 加入 aria-live="polite" 改善無障礙 |
| 2026-04-15 | 海風網站助手 | 全站 69 個頁面修改日期更新為 2026.04.15 |
| 2026-04-15 | 海風網站助手 | deployCount 加入 localStorage 快取（1 小時 TTL） |
| 2026-04-15 | 海風網站助手 | 404 頁面新增 MCTI Minecraft 性格測驗（8 題 / 16 種人格） |
| 2026-04-15 | 海風網站助手 | 404 打怪物全面重製 — 53 種生物 sprite + 新遊戲機制 |
| 2026-04-15 | 海風網站助手 | 404 小遊戲全面重設計：修復 9 個 bug + 新增 3 款遊戲（礦石記憶/方塊消除/射擊場） |
| 2026-04-15 | 海風網站助手 | 🚀 圖片效能優化：首頁 Hero 圖改用 WebP（2MB→217KB，減少 90%）+ CSS image-set 自動降級 |
| 2026-04-15 | 海風網站助手 | 照片背景圖（photo-sub-bg）同步改用 WebP（1.7MB→101KB） |
| 2026-04-15 | 海風網站助手 | 清理 CSS 重複規則：移除 .feature-grid 和 .feature-card 的重複宣告 |
| 2026-04-15 | 海風網站助手 | 🔴 修復 404 頁面 showGameResult 重複定義（語法錯誤，所有按鈕失效） |
| 2026-04-15 | 海風網站助手 | 修復 404 .trash 無效 CSS（pointer-events:cursor → auto） |
| 2026-04-15 | 海風網站助手 | 🎮 淨灘遊戲全面重設計：30 秒挑戰 + 計分 + 連擊 + 海生物陷阱 + 星級結算 |
| 2026-04-15 | 海風網站助手 | 🎨 404 頁面手繪 SVG 船隻取代 emoji（漁船 + 破冰船，含動態煙霧） |
| 2026-04-15 | 海風網站助手 | 打怪物遊戲全面中文化 + 圖片化（去英文標題、木劍計分、sprite 圖例） |
| 2026-04-15 | 海風網站助手 | ⚔️ 打怪物新增 12 種生物 sprite：伏守者(2HP)、終界使者、洞穴蜘蛛、枯骸、界伏蚌、蠹魚、豬布林蠻兵(2HP)、岩漿立方怪、屍殼、終界蟎、山羊、流浪商人 |
| 2026-04-15 | 海風網站助手 | 打怪物武器圖標改為鎚子（Mace）取代木劍 |
| 2026-04-15 | 海風網站助手 | 🎮 移除點速小遊戲，井字棋改為五子棋（9×9 棋盤 + AI） |
| 2026-04-15 | 海風網站助手 | 記憶翻牌表情符號改為魚類主題排序 |
| 2026-04-15 | 海風網站助手 | 404 新增 3 款小遊戲：礦洞掃雷(Minesweeper)、2048 礦石版、井字棋(Tic-Tac-Toe)，總計 14 項互動 |
| 2026-04-15 | 海風網站助手 | 掃雷：9×9 機關/礦石圖標/右鍵插旗/flood fill 揭示；2048：Minecraft 礦石主題(石頭→終界之星)/鍵盤+觸控操控/連鎖合併；井字棋：AI 對手(win>block>center>corner)/戰績記錄 |
| 2026-04-16 | 海風網站助手 | 404 再新增 4 款小遊戲：滑翔翼(Flappy Elytra)、猜礦(Wordle)、打苦力怕(Whack-a-Creeper)、四子棋(Connect Four)，總計 18 項互動 |
| 2026-04-16 | 海風網站助手 | 🔴 修復打怪物 grid 顯示為一行 9 個的 bug（minigames.css 掃雷 .ms-grid 覆蓋 mob-smasher.css 打怪物 .ms-grid，改名為 .mw-*） |
| 2026-04-16 | 海風網站助手 | 修復首頁多餘 </p> 閉合標籤（第 315 行） |
| 2026-04-16 | 海風網站助手 | 🎮 404 小遊戲 emoji → MC sprite 圖片替換：新增 mc-sprites.js 共用 sprite 對照表（70+ 對應） |
| 2026-04-16 | 海風網站助手 | 記憶翻牌：16 個海洋生物 emoji → cod/salmon/tropical-fish/pufferfish/squid/dolphin/turtle/nautilus sprite |
| 2026-04-16 | 海風網站助手 | 射擊場：怪物 emoji → skeleton/zombie/spider/phantom/enderman sprite；動物 → chicken/pig/cow/cat/sheep |
| 2026-04-16 | 海風網站助手 | 釣魚比賽 / 合成謎題 / 交易：對應 emoji 全數改為 sprite 圖片顯示 |
| 2026-04-16 | 海風網站助手 | 404 海洋動畫魚群 + 淨灘遊戲海生物 + 遊戲欄 tab 圖示全部改用 MC sprite |
| 2026-04-16 | 海風網站助手 | 🎨 CSS 視覺優化：區塊標題加漸變底線動畫、卡片 hover 光暈效果、頁尾波浪分隔線 + 品牌漸變裝飾 |
| 2026-04-16 | 海風網站助手 | 效能：guide-layout 加 content-visibility:auto、移除 CSS 重複 .hero light 規則 |
| 2026-04-16 | 海風網站助手 | 全站 20 頁頁尾日期 → 2026.04.16、CSS/JS 快取統一 v=260416 |
| 2026-04-16 | 海風網站助手 | 📱 新增 PWA manifest.json，全站 22 頁加入 manifest + apple-touch-icon，可安裝為 App |
| 2026-04-16 | 海風網站助手 | 🎨 首頁頁尾新增 Discord 社群按鈕 + 合作夥伴連結 |
| 2026-04-16 | 海風網站助手 | 🔍 SEO 強化：首頁 OG 改用 Hero 大圖(1920×1080)、twitter:card→summary_large_image、新增 og:locale/site_name |
| 2026-04-16 | 海風網站助手 | 📱 theme-color meta 隨深色/淺色模式動態切換（dark:#0d1117 / light:#f6f8fa） |
| 2026-04-16 | 海風網站助手 | ⚡ 效能：feature-grid 加 content-visibility:auto |
| 2026-04-16 | 海風網站助手 | 🎨 區塊標題漸變底線加入 shimmer 動畫（4s 無限循環流動效果） |
| 2026-04-16 | 海風網站助手 | 🎨 特色卡片 hover 光暈強化：加入 card-accent 色彩混合發光（color-mix），light 模式同步優化 |
| 2026-04-16 | 海風網站助手 | 🎨 頁尾設計升級：品牌名漸變底線加 shimmer 動畫、連結 hover 增加下劃線動畫、間距加大、背景加入微妙漸變 |
| 2026-04-16 | 海風網站助手 | 🎨 文化藝廊精選卡片 hover 效果強化：overflow:hidden 防溢出、圖片縮放從 1.05→1.08、增加 contrast 濾鏡 |
| 2026-04-16 | 海風網站助手 | 🎨 Hero 與內容區之間新增裝飾性漸變分隔線（60% 寬度，sky→foam 漸變），替代原本 display:none 的 ::before |
| 2026-04-16 | 海風網站助手 | 🎨 全站自訂捲軸樣式：dark 模式 sky 色調（8px 寬、border-radius、hover 加深）、light 模式同步藍紫色調 |
| 2026-04-16 | 海風網站助手 | 🎨 全站文字選取顏色自訂：dark 模式 sky 半透明背景、light 模式藍紫色調 |
| 2026-04-16 | 海風網站助手 | 🐛 修復卡片 hover 溢出裁切：移除 scale(1.02) 改純 translateY(-6px)、移除 contain:layout、overflow:visible |
| 2026-04-16 | 海風網站助手 | 🐛 減弱卡片 hover 暈影：三層 box-shadow 降為兩層、light 模式同步、圖標 hover scale 1.15→1.1 |
| 2026-04-16 | 海風網站助手 | 全站 70 頁 CSS/JS 快取更新為 v=260416c |
| 2026-04-16 | 海風網站助手（新） | 🎨 首頁 Hero 新增動態光暈效果（hero-aurora）：conic-gradient 緩慢旋轉 + 底部 radial 漸變脈動，營造大氣氛圍 |
| 2026-04-16 | 海風網站助手（新） | 🎨 全站 20 頁頁尾升級：新增 Discord 社群連結（SVG 圖標）+ 伺服器元數據（地區/版本/狀態）+ 相關連結 |
| 2026-04-16 | 海風網站助手（新） | 🐛 首頁 main.js 修復：伺服器狀態同步更新頁尾 footerStatus 元素 |
| 2026-04-16 | 海風網站助手（新） | 🎨 CSS 新增 .footer-meta 元件樣式 + .hero-aurora 動畫（aurora-spin / aurora-pulse）+ 特色卡片 border-color hover 過渡 |
| 2026-04-16 | 海風網站助手（新） | 全站 21 頁 CSS/JS 快取更新為 v=260416d、頁尾日期同步 |
| 2026-04-16 | 海風網站助手（新） | 🐛 修復特色卡片 hover 四大問題：移除 scale(1.015) 改純 translateY(-6px) 防溢出裁切、加入 box-shadow 暈影（參考 lore-preview-card）、::after 光暈改 inset 不溢出、圖標 hover 加 rotate(8deg) 旋轉 |
| 2026-04-16 | 海風網站助手（新） | 全站 21 頁 CSS/JS 快取更新為 v=260416e |
| 2026-04-16 | 海風網站助手（新） | 📢 新增 3 則公告：#0131 斷線重啟(04.14)、#0130 斷線重啟(04.13)、#0289 地圖系統改善(04.12)，公告總計 470 則 |
| 2026-04-16 | 海風網站助手（新） | 🎨 全站頁尾重新設計：移除 Discord 社群按鈕、品牌區縮小（去掉標語）、連結改 nav 語義、元數據改緊湊單行（dot 分隔）、整體 padding/margin 縮小、字高壓低（line-height:1.4） |
| 2026-04-16 | 海風網站助手（新） | 全站 21 頁 CSS/JS 快取更新為 v=260416f |
| 2026-04-16 | 海風網站助手 | 🎨 首頁新增「如何加入海風」引導區塊：4 步驟流程（開啟遊戲→新增伺服器→閱讀須知→開始建造），含 MC 圖標、虛線連接器、複製 IP 提示 |
| 2026-04-16 | 海風網站助手 | 🎨 首頁新增「海風社群」數據統計區：累積玩家/公告數/營運天數/遊戲模式，IntersectionObserver 觸發計數動畫 |
| 2026-04-16 | 海風網站助手 | 🎨 首頁 Hero 與內容區新增波浪形 SVG 分隔線，深色/淺色模式同步 |
| 2026-04-16 | 海風網站助手 | 🎨 首頁頁尾全面升級：品牌標語回歸、3 欄網格導覽（導覽/社群/連結）、伺服器即時狀態指示燈、地區標記 |
| 2026-04-16 | 海風網站助手 | 🐛 頁尾伺服器狀態同步：main.js fetchServerStatus 同時更新 #footerStatus 元素 |
| 2026-04-16 | 海風網站助手 | 🎨 CSS 新增元件：.join-steps（如何加入流程）、.stats-bar（數據統計列）、.hero-wave-separator（波浪分隔線）、.footer-grid（頁尾網格）、.breadcrumb（麵包屑導航） |
| 2026-04-16 | 海風網站助手 | 🖨️ 新增 @media print 樣式：規則/條款頁面友善列印，隱藏導航/動畫/按鈕，黑白輸出 |
| 2026-04-16 | 海風網站助手 | 📱 響應式：新增 join-steps 垂直排列 + stats-bar 堆疊 + footer-grid 單欄 |
| 2026-04-16 | 海風網站助手 | 首頁 CSS/JS 快取更新為 v=260416g |
| 2026-04-16 | 海風網站助手 | 🎨 首頁「如何加入海風」icon 改用 MC Wiki 原始 block sprite（grass-block / crafter / iron-door / brick-block） |
| 2026-04-16 | 海風網站助手 | 💬 首頁「海風社群」下方新增 Cactus Comments 留言板（Matrix 協議、匿名留言、無需 GitHub 帳號），siteName: seawind-cc |
| 2026-04-16 | 海風網站助手 | 🎨 頁尾導覽全面升級：3 欄分類（關於海風 / 遊戲指南 / 連結），全站 68 頁同步更新（首頁 + 19 主頁 + 49 guide/lore） |
| 2026-04-16 | 海風網站助手 | 🎨 海風指南頁面新增 Wiki 風格側邊欄目錄（sticky TOC，含分類連結 + 文章總數，響應式折疊為標籤列） |
| 2026-04-16 | 海風網站助手 | ⚡ CSS 清理：移除 26 個重複的 [data-theme="light"] 規則（.particle/.nav-links/.hero-subtitle/.btn-* 等） |
| 2026-04-16 | 海風網站助手 | ⚡ 效能優化：comment-section / bulletin-board 加 content-visibility:auto |
| 2026-04-16 | 海風網站助手 | 全站 69 頁 CSS/JS 快取更新為 v=260416h、頁尾日期同步 |
| 2026-04-16 | 海風網站助手 | 🗑️ 移除 Cactus Comments 留言板（Cactus Bot 無回應，改用其他方案）：移除 CSS/JS CDN 引用、HTML 區塊、初始化腳本、.comment-section 樣式 |
| 2026-04-16 | 海風網站助手 | 🎨 首頁區塊重新排序：公告欄→文化藝廊精選→海風特色→伺服器資訊→如何加入海風→海風景觀明信片→風景照投稿→海風社群 |
| 2026-04-16 | 海風網站助手 | 📝 如何加入海風第 4 步文案修改（移除 Discord 邀請語） |
| 2026-04-16 | 海風網站助手 | 🗑️ 首頁移除「海風社群」數據統計區塊（HTML/CSS/JS/stats-bar/print/responsive 全部清除） |
| 2026-04-16 | 海風網站助手 | 🎨 全站 20 頁頁尾同步：統一 footerStatus、縮排、與首頁一致（贊助.html 新增頁尾） |
| 2026-04-16 | 海風網站助手 | 🎮 打怪物更新：新增 20 種生物 sprite + mob-smasher.js 定義。敵對：殭屍化豬布林/殭屍村民/豬布獸/豬屍獸/凋零骷髏/衛道士/惱鬼/流髑/雪人/嘎枝(2HP)/終界龍(5HP)/掠奪者。中立：殭屍化豬布林(中立)/山貓。友善：驢子/牛/綿羊(白)/骷髏馬/駱駝屍殼/小幽靈/殭屍馬 |
| 2026-04-16 | 海風網站助手 | 🗑️ 移除首頁「海風社群」計數動畫區塊（HTML/CSS/JS 全部清除） |
| 2026-04-16 | 海風網站助手 | 🎨 首頁區塊重新排序：公告→文化藝廊→特色→伺服器資訊→如何加入→明信片→風景照 |
| 2026-04-16 | 海風網站助手 | 🎨 如何加入海風第 4 步文案修改 + 卡片高度統一（align-items: stretch） |
| 2026-04-16 | 海風網站助手 | 🗑️ 移除 Cactus Comments 留言板功能（CSS/JS/HTML 全部清除） |
| 2026-04-16 | 海風網站助手 | 🗑️ 刪除風景照 1323629150736486430.webp（photos.json + 檔案） |
| 2026-04-16 | 海風網站助手 | ⚡ CSS 效能優化：bulletin-board / photo-carousel / join-steps 加 content-visibility:auto（減少首屏渲染開銷） |
| 2026-04-16 | 海風網站助手 | 🎨 區塊標題 shimmer 動畫恢復：section-line-shimmer keyframe 已存在但未掛載，現加回 .section-header h2::after（4s 無限循環） |
| 2026-04-16 | 海風網站助手 | 🖨️ 列印樣式大幅增強：公告內容展開、標籤黑白化、側邊欄隱藏、孤行/孤行控制、圖片縮放、更多隱藏元素 |
| 2026-04-16 | 海風網站助手 | 🎨 海風指南頁面重新設計：content-section 擴寬至 1300px（原 960px）、移除 guide-layout-wiki max-width 限制、卡片 minmax 200→240px、圖標 36→40px、搜尋欄加寬至 600px、新增 guide-index-page body class 做頁面級 CSS 覆蓋 |
| 2026-04-16 | 海風網站助手 | 🎮 打怪物修復：友人(中立)名稱移除多餘「中立」、掠奪者改用 evoker sprite、衛道士/掠奪者掉落不詳之瓶 |
| 2026-04-16 | 海風網站助手 | 🎮 打怪物大更新：不詳之瓶系統 + 突襲事件。不詳之瓶：打死衛道士/掠奪者掉落，HUD 顯示可點擊使用。不祥之兆：使用後獲得 Bad Omen 圖標。突襲事件：有不祥之兆時刷出村民觸發，格子擴大到 5×5，3-7 波 raid，每波開始前播放 raid horn 音效，突襲條顯示進度。突襲計分：miss -1分-1秒，hit +分+秒，勝利 +10分+10秒。雪人從敵對移至友善。新增 bad-omen.png / raid-horn.ogg sprite |

---

_此文件為團隊交接、討論與維護指南。任何修改請同步更新此文件。_
