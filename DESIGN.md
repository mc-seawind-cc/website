# 海風 SeaWind 網站設計指南

> 建立日期：2026.04.12  
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
| 合作夥伴 | `合作夥伴.html` | 合作社群列表 |
| 風景照 | `風景照.html` | 無限滾動照片牆 |
| 更多… | `管理規則.html`, `玩家須知.html`, `服務條款.html`, `隱私權政策.html` 等 | 社群須知類 |
| 指南 | `guide/*.html` | 40+ 篇遊戲指南 |
| 文化藝廊 | `lore/*.html` | 建築故事 |

### 共用資源

| 檔案 | 說明 |
|------|------|
| `style.css` (~97KB) | 全站共用樣式，深色/淺色雙主題 |
| `main.js` | 共用邏輯：主題切換、手機導航、滾動動畫、公告欄、輪播、Lightbox 等 |
| `utils.js` | Discord Markdown → HTML 轉換器、日期格式化 |
| `tips.js` | 首頁提示輪播文字（~100 條）|
| `music-player.css` | 音樂播放器樣式（播放器 JS `music-player.js` 未在倉儲中找到）|
| `announcements_v2.json` | 公告資料（501 則）|
| `photos.json` / `photos/` | 風景照資料與本地圖片 |
| `assets/` | 圖片、圖標、音效、Lore 圖片 |

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

1. **`music-player.js` 缺失**
   - `main.js` 中用 `document.createElement('script')` 動態載入 `music-player.js`
   - 此檔案不在倉儲中，導致音樂播放器完全無法運作
   - **影響**：Console 會出現 404 錯誤，音樂播放器功能失效

2. **`會員.html` 結構問題**
   - `<div class="member-table-wrap fade-in">` 缺少閉合 `</div>`
   - `</div>` 數量不足，表格區域後面直接跳到 `</div></div>` 然後是 footer
   - **影響**：可能導致 footer 樣式錯亂

### 🟡 中等

3. **公告內容錯字**
   - 公告 #0127：「投影倒網站上」應為「投影到網站上」
   - 公告日期格式混用：ROC（114.04.23）與 ISO（2026-04-11）並存（此為 v1/v2 資料格式差異，非 bug）

4. **首頁明信片依賴巴哈姆特外部圖床**
   - `truth.bahamut.com.tw` 的圖片無法預載（DNS prefetch 已設，但 fetchpriority 未加）
   - 若巴哈圖床改版或失效，明信片區塊會變空
   - 目前 5 張都是硬編碼 URL

5. **部署計數 API 無認證且可能觸發 rate limit**
   - `main.js` 中呼叫 `api.github.com/repos/.../deployments`
   - 未認證的 GitHub API 每小時 60 次限制
   - 若網站流量稍高，計數會顯示 `—`

6. **Lightbox 事件監聽器累積問題**
   - `initPhotoGallery()` 中每次開啟 lightbox 時都 cloneNode + 重新綁定事件
   - `initGeneralLightbox()` 和 `initPostcardLightbox()` 都跑在同一頁面
   - 雖然有判斷避免重複，但邏輯層級複雜，容易出錯

### 🟢 輕微

7. **Nav 「關於」下拉選單的雙重功能**
   - 點擊「關於」文字會跳轉到 `文化藝廊.html`
   - 同時也是下拉 toggle（手機版 preventDefault）
   - 桌面版 hover 打開，但若快速移動滑鼠可能意外點擊跳轉

8. **`<html lang="zh-Hant">` 正確，但 URL 包含中文**
   - `首頁.html`, `公告.html` 等中文檔名
   - GitHub Pages 支援，但某些舊瀏覽器或爬蟲可能編碼出錯
   - SEO 影響不大，但 index.html 的 JS redirect 不如 meta refresh 友善

9. **`index.html` 的 JS redirect**
   - `<meta rel="canonical" href="...首頁.html">` 是對的
   - 但 `<noscript>` fallback 只有文字連結，沒有 `meta http-equiv="refresh"`
   - 若 JS 被禁用，使用者需要手動點擊

10. **404 遊戲手機版適配**
    - 4×4 翻牌遊戲在 375px 寬的手機上，每格約 80px，偏小
    - 打海怪 3×3 在小螢幕上 OK

---

## 優化建議

### 🚀 效能

1. **`style.css` 過大（~97KB）**
   - 所有頁面共用一個大 CSS 檔案
   - 建議：拆分為 base.css（共用）+ 各頁面獨立的 page-*.css
   - 或至少用 `@media` 把 print 樣式分離

2. **圖片最佳化**
   - 首頁已用 `preload` + `fetchpriority="high"` 預載 hero 圖 ✅
   - 建議：首頁公告欄中如果有圖片，應加 `loading="lazy"`
   - 建議：feature card 圖標（PNG）可考慮改用 SVG inline（減少 HTTP 請求）

3. **字體載入**
   - 已用 `preconnect` ✅
   - 但每個 HTML 都重複載入 Google Fonts CSS，可考慮用 `<link rel="preload">` 預載字體檔
   - `Noto Serif TC` 只用在 hero title 和 404 title，可考慮用 `font-display: swap` + `unicode-range` 縮減

4. **JavaScript**
   - `main.js` 是單一檔案，所有邏輯都在裡面
   - 建議：把 Lightbox、公告欄、輪播等拆成獨立模組
   - `defer` 只用在 `tips.js`，其他兩個 `<script>` 都是同步載入阻塞渲染

### 📱 響應式

5. **Nav 捲動問題**
   - 手機版導航展開時，如果項目多（目前約 8 個 + 下拉），螢幕小的裝置可能需要捲動
   - 建議：手機版導航加 `max-height: 100vh; overflow-y: auto`

6. **表格響應式**
   - `會員.html` 的比較表在窄螢幕用 `overflow-x: auto` 是好的
   - 但表格內容文字在 320px 寬時可能會被截斷

### ♿ 無障礙

7. **下拉選單缺少 ARIA 屬性**
   - `.nav-dropdown-toggle` 缺少 `aria-expanded`、`aria-haspopup`
   - 手機版下拉展開時，沒有 `aria-expanded` 狀態切換
   - 鍵盤導航（Tab）無法操作下拉選單

8. **Lightbox 焦點管理**
   - 開啟 lightbox 後，焦點沒有被 trap 在 lightbox 內
   - 關閉後焦點沒有回到觸發元素
   - 建議：加 `role="dialog"` + `aria-modal="true"` + 焦點 trap

9. **公告欄摺疊**
   - `.bulletin-toggle` 有 `aria-expanded` ✅
   - 但公告展開/收合的動畫（max-height: 0/3000px）對螢幕閱讀器不友善
   - 建議：展開時把隱藏內容從 accessibility tree 移除（`hidden` 屬性）

### 🎨 設計一致性

10. **404 頁面樣式獨立**
    - `404.html` 完全不載入 `style.css`，所有樣式都是 inline
    - 品牌色值和設計 token 與主站不同（例如 `rgba(87,138,255,0.18)` vs `--sky`）
    - 建議：至少引入 CSS 變數，或把 404 的樣式模組化

11. **各子頁面都有各自的 `<style>` block**
    - `公告.html` 有 ~250 行 inline CSS
    - `合作夥伴.html` 有 ~100 行 inline CSS
    - 建議：共用樣式移到 `style.css`，頁面特定樣式可保留 inline 或分檔案

### 🔒 安全性

12. **GitHub Token 已暴露**
    - 在對話中提供了 Personal Access Token
    - **強烈建議**：立即到 GitHub Settings → Developer settings → Personal access tokens 刪除此 token

### 🔧 開發體驗

13. **版本控制（cache busting）**
    - 使用 `?v=260412g` 手動版本號
    - 建議：改用 Git commit hash（GitHub Actions 可自動注入）

14. **無自動化部署流程**
    - 目前是手動 push 到 main 分支 → GitHub Pages 自動部署
    - 建議：加 GitHub Actions 做圖片最佳化、CSS 壓縮、HTML 驗證

---

## 修改紀錄

| 日期 | 修改內容 | 負責 |
|------|----------|------|
| 2026.04.12 | 建立 DESIGN.md，完成首次網站全面健診 | AI 助手 |
| 2026.04.12 | 首頁公告欄 redesign、打字機優化、海風社區新增、修復會員.html bug | AI 助手 |
| 2026.04.12 | 重新設計合作夥伴頁面：分類標籤、2 欄卡片 grid、品牌色裝飾、CTA 雙按鈕 | AI 助手 |

---

_本文件作為海風網站的交接與設計基準，所有重大修改都應記錄在此。_
