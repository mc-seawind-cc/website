# DESIGN.md — 海風 SeaWind 網站設計指南

> 最後更新：2026-04-13（由海風網站助手全面審查更新）
> 維護者：海風網站助手 / 團隊交接用

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| 網址 | https://www.seawind.cc |
| GitHub | https://github.com/mc-seawind-cc/website |
| 部署 | GitHub Pages（推送到 main 自動部署） |
| 架構 | 純靜態 HTML + CSS + JS（無建置工具） |
| 語言 | 繁體中文（台灣用語） |
| 主題 | Minecraft 養老建築生存伺服器官方網站 |
| 資產大小 | assets/ 目錄約 125MB（主要為圖片） |

---

## 二、網站架構

### 主要頁面（23 個 HTML）
- `首頁.html` — 主入口（`index.html` 自動跳轉）
- `公告.html` — 公告系統（含篩選、搜尋、分頁、月份導航）
- `會員.html` — 會員方案
- `合作夥伴.html` — 合作夥伴列表
- `違規處分.html` — 違規記錄
- `風景照.html` — 照片牆（678 張，無限捲動載入）
- `海風團隊.html` — 團隊介紹
- `歷史館.html` — 伺服器歷史時間線
- `海風指南.html` — 遊戲指南入口
- `文化藝廊.html` — 建築故事藝廊

### 社群須知（導航下拉）
- `玩家須知.html` / `支持須知.html` / `管理規則.html`
- `公務人員須知.html` / `特殊裝備規範.html`
- `服務條款.html` / `隱私權政策.html`

### 關於（導航下拉）
- `文化藝廊.html` / `風景照.html` / `歷史館.html`
- `海風社區.html` / `海風團隊.html`

### 資料中心（導航下拉）
- `合作夥伴.html` / `違規處分.html`

### 海風指南（guide/ 目錄，40+ 頁）
入門、領地、經濟、任務、合成、地圖、傳送、會員功能等

### 文化藝廊（lore/ 目錄）
索西斯墓、邊境之村、瑟爾納大橋、禁忌天使、翠籙幽光書庭、格拉文特、布雷特蘭等

### 特殊頁面
- `404.html` — 海洋環保主題 404 頁面（日/夜循環、海上垃圾淨灘小遊戲、翻牌配對、點擊測速）
- `partner-mcu.html` — MCU 合作夥伴專頁

---

## 三、技術細節

### 檔案結構
```
├── 首頁.html          主頁面（23 個 HTML）
├── style.css           主樣式（~138KB，所有頁面共用）
├── music-player.css    音樂播放器樣式
├── main.js             核心邏輯（導航、動畫、公告、輪播、Lightbox）
├── utils.js            Discord Markdown → HTML 轉換器
├── tips.js             提示文字資料（80+ 條）
├── music-player.js     音樂播放器
├── announcements_v2.json  公告資料（502 則）
├── announcements.json     舊版公告（fallback）
├── photos.json            照片路徑清單（678 張）
├── penalties.json         違規處分資料
├── 特殊裝備規範.txt       備用文字版
└── assets/
    ├── img/            圖片（logo、hero、guide、icons）
    ├── lore/           文化藝廊圖片（7 張 .webp）
    ├── migrated/       從 Discord 遷移的風景照（78 張）
    ├── photos_new/     新風景照
    ├── sounds/         音效（打字機 tick1-3.mp3）
    └── announcements/  公告圖片
```

### CSS 架構
- `style.css`（~138KB）— 全站共用樣式，含深色/亮色主題、動畫、所有頁面元件
- `music-player.css` — 音樂播放器樣式（獨立檔案）

### JavaScript 架構
- `main.js` — 核心邏輯：
  - 主題切換、行動版導航、捲動進度條
  - IntersectionObserver 滾動動畫
  - Hero 打字機效果、伺服器狀態查詢
  - 公告欄渲染（支援 v1/v2 格式）
  - 照片輪播 + Lightbox（含觸控滑動）
  - 風聲環境音效（Web Audio API）
  - 音樂播放器動態載入
  - 部署次數查詢（GitHub API）
- `utils.js` — Discord Markdown 轉 HTML（支援 blockquote、嵌套列表、劇透等）
- `tips.js` — 提示輪播資料
- `music-player.js` — YouTube 音樂播放器

### JSON 資料
| 檔案 | 用途 | 格式 |
|------|------|------|
| `announcements_v2.json` | 公告資料（502 則） | `{ announcements: [{ tag, id, isoDate, title, content, images, localImages, ... }] }` |
| `announcements.json` | 舊版公告（v1 fallback） | `{ announcements: [{ date, timestamp, title, content, ... }] }` |
| `photos.json` | 風景照路徑 | `{ photos: ["assets/migrated/xxx.webp", ...] }`（678 張） |
| `penalties.json` | 違規處分 | 違規記錄資料 |

### 版本控制
- CSS/JS 使用 query string 快取破壞：`?v=260412k`
- 版本格式：`YYMMDD` + 字母序號
- 每次修改 CSS/JS 時需更新所有引用該檔案的 HTML 中的版本號

### 外部依賴
- Google Fonts（Noto Sans TC）
- GitHub Pages 自動部署
- Discord API（公告同步）
- mcsrvstat.us API（伺服器狀態查詢）
- bahamut.com.tw CDN（明信片圖片）

---

## 四、設計系統

### 色彩（CSS 變數）

#### 深色主題（預設，data-theme="dark"）
```css
--deep: #0d1117;      /* 主背景 */
--ocean: #161b22;     /* 卡片背景 */
--drift: #1c2333;     /* 次要背景 */
--mist: #21283b;      /* 邊框 */
--fog: #8b949e;       /* 次要文字 */
--cloud: #c9d1d9;     /* 主要文字 */
--white: #e6edf3;     /* 亮文字/標題 */
```

#### 亮色主題（data-theme="light"）
```css
--deep: #f0f2f5;
--ocean: #ffffff;
--drift: #e8ecf1;
--mist: #dde1e8;
--fog: #4a5260;
--cloud: #1f2328;
--white: #0d1117;
```

#### 強調色（主題不變）
```css
--sky: #9dafff;       /* 主色（藍紫） — 連結、按鈕、焦點 */
--foam: #a8e6cf;      /* 輔色（綠） — 成功、亮點 */
--sand: #deac80;      /* 暖色 — 標籤 accent */
--shell: #ffebcd;
--ocean-blue: #578aff;
--lavender: #ab72f9;
--teal: #58c2b0;
--blush: #e0b5d4;
--ice: #85b1e0;
--rose: #ffb6c1;
```

### 字體
- 主要：`'Noto Sans TC', 'Inter', system-ui, sans-serif`
- 裝飾：`'Noto Serif TC'`（404 頁面標題）
- 等寬：`'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace`

### 間距系統
```css
--space-xs: 0.25rem (4px)
--space-sm: 0.5rem  (8px)
--space-md: 1rem    (16px)
--space-lg: 1.5rem  (24px)
--space-xl: 2.5rem  (40px)
--space-2xl: 4rem   (64px)
```

### 圓角
```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
```

### 動畫系統
- 滾動觸發：`.reveal-up`, `.slide-up`, `.zoom-in`, `.slide-left`, `.fade-in`
- 使用 IntersectionObserver，threshold: 0.05，觸發後添加 `.visible` class 且不再移除
- 安全機制：3 秒後自動顯示所有隱藏元素（防止動畫失敗導致內容隱藏）
- Hero 打字機：兩段式打字 + 中間停頓 + 開場「...」動畫
- 提示輪播：4 秒切換，淡出/淡入效果

### 元件系統
| 元件 | 用途 |
|------|------|
| `.nav` | 固定頂部導航欄（含模糊背景） |
| `.hero` | 首頁主視覺區（含粒子、打字機） |
| `.btn` / `.btn-primary` / `.btn-outline` | 通用按鈕 |
| `.feature-card` | 特色卡片（6 種 accent 色） |
| `.bulletin-item` | 公告項目（可展開） |
| `.light` / `.lightbox-*` | 圖片燈箱 |
| `.postcard-item` | 明信片項目 |
| `.carousel-slide` | 照片輪播 |
| `.footer` | 頁尾 |
| `.scroll-progress` | 頂部捲動進度條 |
| `.back-to-top` | 回到頂部按鈕 |

---

## 五、已知問題與待修復

### 🔴 Bug（需要修復）

1. **`index.html` 的重導向重複** — 同時使用 `<meta http-equiv="refresh">` 和 `location.replace()`，meta refresh 在 JS 執行前就會跳轉，浪費一次載入。建議移除 `<meta http-equiv="refresh">`，只保留 JS 的 `location.replace()` + `<noscript>` 內的連結。

2. **GitHub API 部署次數查詢未認證** — 首頁底部的「總計修改 X 次」使用未認證的 GitHub API（`/repos/mc-seawind-cc/website/commits?per_page=1`），匿名請求每小時限制 60 次，容易觸發 429。建議改用預設值或手動維護。

3. **Lightbox 鍵盤焦點陷阱可能卡住** — 首頁的通用 Lightbox（`initGeneralLightbox`）使用了 focus trap，但僅在 lightbox 打開時有效。如果按 Tab 跳出 lightbox，可能導致焦點管理混亂。公告頁有獨立的 `.lb-*` class Lightbox，代碼重複。

4. **行動版導航下拉選單過長** — 在 768px 以下，導航展開後有 10+ 個連結和 3 個下拉子選單，需多次捲動才能看到全部。建議行動版簡化為主要項目 + 「更多」摺疊。

5. **CSS `--card-accent` 在亮色主題下未調整** — `.feature-card` 使用 `--card-accent` 變數設置左邊框顏色，但亮色主題下沒有覆蓋，部分顏色（如 `--sand`、`--shell`）在亮色背景上對比度不足。

### 🟡 優化建議（建議改進）

1. **CSS 檔案過大（138KB）** — 所有頁面共用一個 CSS 檔案，包含每個頁面的專用樣式。考量：
   - 可按頁面拆分為 `base.css` + 頁面專用 CSS
   - 或使用 CSS `@import` 按需載入
   - 當前的作法雖然是單一請求（好處），但用戶下載了大量不需要的 CSS

2. **首頁 Hero 圖片使用 PNG 而非 WebP** — `assets/img/homeHero.png` 是封面圖，使用 PNG 是為了確保無損畫質（截圖/建築細節）。已同時存在 `.webp` 版本但未使用。**設計決策：保留 PNG 以維持封面圖畫質**，WebP 作為備用。
   ```html
   <link rel="preload" as="image" href="assets/img/homeHero.webp" fetchpriority="high" type="image/webp">
   ```

3. **風聲自動播放** — 首頁的環境音效（白噪音）會在首次互動後自動播放，部分用戶可能覺得突兀。建議：
   - 預設關閉，按鈕顯示為非啟用狀態
   - 或在播放前顯示小型提示「開啟環境音效？」

4. **字體載入策略** — 使用了 `<link rel="preconnect">` 但沒有 `font-display: swap`（Google Fonts 預設為 `swap`，所以實際上沒問題，但應確認）。

5. **公告頁有獨立的 Lightbox 實作** — 公告頁使用 `.lb-close` / `.lb-prev` / `.lb-next` class，首頁使用 `.lightbox-close` / `.lightbox-prev` / `.lightbox-next`，兩套 Lightbox 代碼功能重複。建議統一。

6. **`announcements.json`（舊版）可考慮移除** — 首頁公告欄有 v2 fallback 機制，但如果 v2 格式已是標準，舊版 fallback 可移除以減少混淆。

7. **照片頁面缺少篩選/搜尋** — 678 張照片只有無限捲動，沒有分類、搜尋或標籤篩選，用戶很難找到特定照片。

8. **CSS 缺少主題切換過渡** — 切換深色/亮色主題時，沒有 `transition` 動畫，切換感受較生硬。建議添加：
   ```css
   body { transition: background-color 0.3s, color 0.3s; }
   ```

9. **無 sitemap.xml 和 robots.txt** — 已有 JSON-LD 結構化資料，但缺少 sitemap.xml 和 robots.txt，影響搜尋引擎爬取效率。

10. **DNS prefetch 可能不完整** — 首頁有 `dns-prefetch` for Discord CDN、bahamut、mcsrvstat.us，但缺少對 Google Fonts 的（雖已有 preconnect）。

### 🟢 良好實踐（已做得很好）

- ✅ **SEO 優秀**：完整的 meta tags、Open Graph、Twitter Card、JSON-LD 結構化資料、canonical URL
- ✅ **無障礙到位**：skip link、aria-label、aria-expanded、aria-modal、focus-visible、role 屬性
- ✅ **深色/亮色主題**：系統偏好偵測 + localStorage 持久化
- ✅ **響應式設計**：mobile-first，適配 375px ~ 1920px+
- ✅ **捲動進度條**：頂部漸變進度指示
- ✅ **Lightbox 完善**：鍵盤導航（← → Esc）、觸控滑動、焦點管理、計數器
- ✅ **公告系統強大**：502 則公告，標籤篩選、搜尋、分頁、月份導航、內部引用跳轉
- ✅ **Discord Markdown 完整轉換**：支援 blockquote、嵌套列表、劇透、頻道引用、提及
- ✅ **伺服器狀態即時查詢**：mcsrvstat.us API，顯示在線人數
- ✅ **404 頁面有創意**：月夜海景動畫 + 8 個小遊戲（釣魚、翻牌、打星星、打海怪、點擊測速、顏色測驗、反應測速、猜數字）
- ✅ **環境音效**：Web Audio API 白噪音，可切換
- ✅ **安全機制**：3 秒後自動顯示動畫元素、IntersectionObserver 一次性觸發
- ✅ **觸控友善**：Lightbox 支援滑動切換、輪播支援觸控滑動
- ✅ **效能意識**：圖片 lazy loading、DNS prefetch、preconnect、fetchpriority

---

## 六、修改與維護指南

### 新增頁面時
1. 複製現有頁面的 `<head>` 和 `<nav>` 區塊（確保一致）
2. 加入 `<footer>` 和 `.page-revise` 區塊
3. 如果需要特殊樣式，在 `<style>` 內添加（不要改 `style.css`，除非是全站共用的）
4. 如果新增 CSS 到 `style.css`，需更新所有 HTML 的 `?v=版本號`

### 更新版本號時
版本格式：`YYMMDD` + 字母序號（如 `260412k`）
需同步更新：
- `style.css` 的引用（所有 HTML 的 `<link>`）
- `main.js` 的引用（所有 HTML 的 `<script>`）
- `DESIGN.md` 的最後更新日期

### 修改公告資料時
- 編輯 `announcements_v2.json`
- 格式：`{ tag, id, isoDate, timestamp, title, content, images, localImages, reactions, ... }`
- `isoDate` 格式：`YYYY-MM-DD`
- `content` 支援 Discord Markdown 語法

### 公告格式說明（Discord 原始格式 → JSON 對照）

Discord 頻道公告的原始格式：

```
## :wind_charge: 「 斷線重啟 」

-# @維護通知 / 115.04.13 / #0130

- 將於晚上 7:00 分重啟伺服器。
- 進一步優化地圖系統。
```

拆解：

| 區塊 | Discord 原文 | JSON 對應欄位 | 說明 |
|------|-------------|--------------|------|
| 標題行 | `「 斷線重啟 」` | `title` | 「」內的文字為公告標題 |
| 元資料行 | `-# @維護通知 / 115.04.13 / #0130` | `tag`, `isoDate`, `id` | 格式：`@類別 / 日期 / #編號` |
| 內文 | `- 將於晚上...` | `content` | 支援 Discord Markdown（列表、引用、粗體等） |

**欄位對應規則：**

- `tag`：`@` 後面的文字，如 `@維護通知` → `"公告"`、`@更新通知` → `"更新"`、`@活動通知` → `"活動"`
- `isoDate`：民國日期轉西元，如 `115.04.13` → `"2026-04-13"`（民國年 + 1911）
- `date`：保留原始民國日期，如 `"115.04.13"`
- `id`：`#` 後的編號，如 `#0130` → `"#0130"`
- `title`：`「」`內的文字
- `content`：元資料行之後的所有文字
- `images` / `localImages`：公告附圖（如有）
- `pinned`：是否為釘選公告（布林值）

**標籤對應表：**
| Discord 標籤 | JSON tag | 頁面顯示顏色 |
|-------------|----------|------------|
| @公告通知 / @維護通知 | `公告` | 藍色 `#578aff` |
| @更新通知 | `更新` | 綠色 `#64dcb4` |
| @活動通知 | `活動` | 橘色 `#ffaa32` |

### 修改提示文字時
- 編輯 `tips.js`，每行一條字串
- 不需要版本號更新（tips.js 沒有 query string）

### 部署
- 推送到 `main` 分支即自動部署到 GitHub Pages
- 可在 https://github.com/mc-seawind-cc/website/deployments 查看部署狀態

---

## 七、修改記錄

| 日期 | 修改內容 | 修改者 |
|------|---------|--------|
| 2026-04-13 | 建立 DESIGN.md，完成網站全面審查 | 海風網站助手 |
| 2026-04-13 | 全面更新 DESIGN.md：補充架構細節、Bug 清單、優化建議、維護指南 | 海風網站助手 |
| 2026-04-13 | 新增公告 #0130「斷線重啟」、DESIGN.md 新增公告格式說明 | 海風網站助手 |
| 2026-04-13 | 「特殊裝備規範」全面更名為「特殊道具規範」（檔案+所有導航引用） | 海風網站助手 |
| 2026-04-13 | 風景照副標題改為「收錄至 115.04.11，共收錄 678 張」 | 海風網站助手 |
| 2026-04-13 | 404 頁面重新設計：海洋環保主題（日/夜循環、海上垃圾淨灘） | 海風網站助手 |
| 2026-04-13 | 首頁 Hero 資訊卡片改為 1/3 佈局 + 半透明樣式 | 海風網站助手 |
| 2026-04-13 | 全站主題切換加入 0.4s 過渡動畫 | 海風網站助手 |
| 2026-04-13 | 歷史館全面重構：卡片式 → 垂直時間線設計（博物館風格） | 海風網站助手 |

---

## 八、備註

- GitHub Pages 部署，無後端伺服器，所有資料為靜態 JSON
- 公告資料來自 Discord 頻道自動同步（需外部腳本維護）
- 風景照由玩家在 Discord 投稿，自動匯入到 `assets/migrated/` 和 `assets/photos_new/`
- 網站版本號格式：`YYMMDD` + 字母序號（如 `260412k`）
- 404 頁面的小遊戲為純前端 JS，不需後端
- 音樂播放器使用 YouTube iframe API
