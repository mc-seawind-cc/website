# 海風 SeaWind 網站設計指南

> 建立日期：2026.04.12  
> 最後更新：2026.04.12  
> 網站：https://www.seawind.cc  
> 倉儲：https://github.com/mc-seawind-cc/website  
> 部署方式：GitHub Pages（靜態託管）

---

## 目錄

1. [整體架構](#整體架構)
2. [設計系統](#設計系統)
3. [已知問題與 Bug](#已知問題與-bug)
4. [優化建議](#優化建議)
5. [修改紀錄](#修改紀錄)

---

## 整體架構

### 頁面一覽

| 頁面 | 檔案 | 類型 |
|------|------|------|
| 首頁 | `首頁.html` | 主頁，含公告欄、特色、文化藝廊精選、風景照輪播 |
| 首頁跳轉 | `index.html` → `首頁.html` | JS redirect（GitHub Pages 無法做伺服器端 301）|
| 404 | `404.html` | 自訂 404，含 8 個小遊戲（海風特色亮點！）|
| 公告 | `公告.html` | 公告列表，支援篩選、搜尋、月份導航 |
| 會員 | `會員.html` | 會員方案比較表 |
| 海風團隊 | `海風團隊.html` | 5 部門、人員介紹（Crafatar 頭像）|
| 合作夥伴 | `合作夥伴.html` | 合作社群列表（含 Discord 伺服器頭像）|
| 風景照 | `風景照.html` | 無限滾動照片牆 |
| 違規處分 | `違規處分.html` | 違規紀錄與處分表 |
| 更多… | `管理規則.html`, `玩家須知.html`, `服務條款.html`, `隱私權政策.html` 等 | 社群須知類 |
| 指南 | `guide/*.html` | 40+ 篇遊戲指南 |
| 文化藝廊 | `lore/*.html` | 建築故事 |
| 合作專頁 | `partner-mcu.html` | MCU 合作夥伴專頁 |

### 共用資源

| 檔案 | 大小 | 說明 |
|------|------|------|
| `style.css` | ~124KB | 全站共用樣式，深色/淺色雙主題 |
| `main.js` | ~36KB | 共用邏輯：主題切換、手機導航、滾動動畫、公告欄、輪播、Lightbox 等 |
| `utils.js` | ~12KB | Discord Markdown → HTML 轉換器、日期格式化 |
| `tips.js` | ~8KB | 首頁提示輪播文字（~100 條）|
| `music-player.css` | ~4KB | 音樂播放器樣式 |
| `music-player.js` | ~24KB | 音樂播放器邏輯 |
| `announcements_v2.json` | ~330KB | 公告資料（501 則，v2 格式）|
| `photos.json` | ~36KB | 風景照資料（URL 列表）|
| `photos/` | — | 風景照本地圖片 |
| `assets/` | — | 圖片、圖標、音效、Lore 圖片 |

### 技術棧

- **純靜態 HTML/CSS/JS**，無框架、無打包工具
- 中文字體：Google Fonts（Noto Sans TC + Noto Serif TC）
- 圖片：WebP 優先，PNG 備用
- 外部 API：
  - `api.mcsrvstat.us` — 伺服器狀態查詢
  - `crafatar.com` — Minecraft 皮膚頭像
  - `truth.bahamut.com.tw` — 巴哈姆特外部圖床（首頁明信片）
  - `api.github.com` — 部署次數計數

---

## 設計系統

### 配色（CSS 自訂屬性）

```css
/* 深色主題（預設）*/
--bg:        #0d1117;   /* 主背景 */
--ocean:     #161b22;   /* 卡片背景 */
--cloud:     #e6edf3;   /* 主文字 */
--fog:       #8b949e;   /* 次要文字 */
--sky:       #9dafff;   /* 主色（品牌藍）*/
--foam:      #a8e6cf;   /* 強調綠 */
--sand:      #deac80;   /* 暖色 */
--blush:     #e0b5d4;   /* 粉 */
--lavender:  #ab72f9;   /* 紫 */
--teal:      #58c2b0;   /* 青 */
--mist:      rgba(255,255,255,0.06);  /* 邊框 */
```

### 字體

- **主文字**：`Noto Sans TC`, 400/500/700/800
- **標題裝飾**：`Noto Serif TC`, 700

### 動畫

- 滾動進場：`.fade-in`, `.slide-up`, `.zoom-in`, `.slide-left`, `.reveal-up`
- IntersectionObserver 驅動，觸發後加 `.visible`
- 3 秒安全閘：防止動畫未觸發時元素永久隱藏

---

## 已知問題與 Bug

### 🔴 嚴重

1. **Cache Busting 版本號不一致**
   - `首頁.html`：`main.js?v=260412b`（舊版）
   - `公告.html`：`main.js?v=260412b`（舊版）
   - `合作夥伴.html`：`main.js?v=260412b`、`style.css?v=260413a`
   - `違規處分.html`：`main.js?v=260412b`
   - `海風指南.html`：`main.js?v=260412c`、`style.css?v=260412c`
   - 多數其他頁面：`main.js?v=260412g`、`style.css?v=260412g`
   - **影響**：使用者從不同頁面導覽時，可能載入舊版 JS/CSS，導致功能異常或樣式不一致
   - **修復**：統一所有頁面的版本號（建議改用 Git commit hash 自動化）

2. **`index.html` noscript 缺少 meta refresh**
   - `<noscript>` 區塊只有純文字連結，無自動跳轉
   - 若 JS 被禁用（爬蟲、嚴格安全環境），使用者看到一個空白頁面需要手動點擊
   - **修復**：加入 `<meta http-equiv="refresh" content="0;url=首頁.html">`

### 🟡 中等

3. **首頁明信片依賴巴哈姆特外部圖床**
   - `truth.bahamut.com.tw` 的圖片硬編碼在 HTML 中
   - 巴哈若改版、限速或失效，明信片區塊會變空
   - 目前 5 張都是固定 URL，無本地備援
   - **建議**：定期下載備份到本地 `assets/`，或設置 fallback 佔位圖

4. **GitHub 部署計數 API 未認證**
   - `api.github.com/repos/.../deployments` 未帶 token
   - 未認證每小時 60 次限制（共用 IP 更低）
   - 流量稍高時計數會顯示 `—`
   - **建議**：移除此功能（非必要），或改用 commit 數計算

5. **公告錯字**
   - 公告 #0127：「投影**倒**網站上」→ 應為「投影**到**網站上」

6. **雨聲自動播放的瀏覽器相容性**
   - 雖然有 first-interaction pattern，但 `setTimeout(startRain, 500)` 在某些瀏覽器仍可能失敗
   - 且無音量漸入的錯誤處理
   - **建議**：確保 try/catch 完整覆蓋

### 🟢 輕微

7. **Nav 「關於」下拉選單的雙重功能**
   - 點擊「關於」文字會跳轉到 `文化藝廊.html`
   - 同時也是下拉 toggle（手機版 preventDefault）
   - 桌面版 hover 打開，但若快速移動滑鼠可能意外點擊跳轉

8. **Lightbox 事件監聽器累積**
   - `initPhotoGallery()` 中每次開啟 lightbox 都 cloneNode + 重新綁定事件
   - 多次開啟後會產生較多的 DOM 操作
   - 雖然功能正常，但非最佳實踐

9. **404 頁面樣式完全獨立**
   - 不載入 `style.css`，所有樣式都是 inline
   - 品牌色值與主站略有差異
   - **建議**：至少引入 CSS 變數檔案保持一致性

10. **各子頁面 inline CSS 眾多**
    - `公告.html` 有 ~250 行 inline CSS
    - `合作夥伴.html` 有 ~100 行 inline CSS
    - 違規處分等頁面也有各自的 `<style>` block
    - **建議**：共用樣式逐步合併到 `style.css`

---

## 優化建議

### 🚀 效能

1. **`style.css` 過大（~124KB）**
   - 所有頁面共用一個大 CSS 檔案
   - 建議：拆分為 base.css（共用）+ 各頁面獨立的 page-*.css
   - 或用 build tool 做 tree-shaking / purgeCSS

2. **圖片最佳化**
   - 首頁已用 `preload` + `fetchpriority="high"` 預載 hero 圖 ✅
   - 建議：明信片圖片加 `fetchpriority="low"`
   - feature card 圖標（PNG）可改用 SVG inline（減少 HTTP 請求）

3. **字體載入**
   - 已用 `preconnect` ✅
   - 建議：用 `<link rel="preload">` 預載字體檔
   - `Noto Serif TC` 只用在 hero title 和少量標題，可考慮 `unicode-range` 縮減

4. **JavaScript**
   - `main.js` 是單一 36KB 檔案
   - 建議：非首頁功能（公告篩選、指南側欄等）用 dynamic import
   - `defer` 只用在 `tips.js`，`utils.js` 和 `main.js` 同步載入阻塞渲染

### 📱 響應式

5. **手機版導航捲動**
   - 目前項目多（8 個 + 3 個下拉），小螢幕可能溢出
   - 建議：手機版導航加 `max-height: 100vh; overflow-y: auto`

6. **404 小遊戲手機適配**
   - 4×4 翻牌遊戲在 375px 每格約 80px，偏小但可操作
   - 打海怪 3×3 OK

### ♿ 無障礙

7. **下拉選單缺少 ARIA 屬性**
   - `.nav-dropdown-toggle` 缺少 `aria-expanded`、`aria-haspopup`
   - 鍵盤導航（Tab）無法操作下拉選單
   - **建議**：加入完整 ARIA 狀態管理

8. **Lightbox 焦點管理**
   - 開啟後焦點沒有 trap 在 lightbox 內
   - 關閉後焦點沒有回到觸發元素
   - **建議**：加 `role="dialog"` + `aria-modal="true"` + 焦點 trap

9. **公告欄摺疊的 accessibility**
   - `.bulletin-toggle` 有 `aria-expanded` ✅
   - 但展開/收合用 `max-height: 0/3000px` 對螢幕閱讀器不友善
   - **建議**：用 `hidden` 屬性控制而非純 CSS

### 🎨 設計一致性

10. **版本號自動化**
    - 目前用手動 `?v=260412g`，容易遺漏導致不同頁面版本不一致
    - **建議**：用 GitHub Actions 自動在部署時替換版本號（用 commit hash）

11. **404 頁面品牌一致性**
    - 完全獨立的 inline 樣式，與主站設計 token 不同
    - **建議**：引入共用 CSS 變數

### 🔧 開發體驗

12. **無自動化部署流程**
    - 目前手動 push → GitHub Pages 自動部署
    - **建議**：加 GitHub Actions 做：
      - 圖片最佳化（WebP 轉換）
      - 版本號自動注入
      - HTML/CSS 驗證
      - 快取清除

13. **建議的 sync-nav.sh 自動化**
    - `sync-nav.sh` 存在但應在 CI 中執行
    - 確保所有頁面的 nav 結構一致

---

## 修改紀錄

| 日期 | 修改內容 | 負責 |
|------|----------|------|
| 2026.04.12 | 建立 DESIGN.md，完成首次網站全面健診 | AI 助手 |
| 2026.04.12 | 首頁公告欄 redesign、打字機優化、海風社區新增、修復會員.html bug | AI 助手 |
| 2026.04.12 | 重新設計合作夥伴頁面：分類標籤、2 欄卡片 grid、品牌色裝飾、CTA 雙按鈕 | AI 助手 |
| 2026.04.12 | 重新設計違規處分頁面 | AI 助手 |
| 2026.04.12 | 修復公告欄與風景照載入問題 | AI 助手 |
| 2026.04.12 | 更新 DESIGN.md：補充完整健診報告，修正 music-player.js 狀態（實際存在），新增 cache busting 問題等 | AI 助手 (v2) |

---

_本文件作為海風網站的交接與設計基準，所有重大修改都應記錄在此。_
