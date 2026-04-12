# DESIGN.md — 海風 SeaWind 網站設計指南

> 最後更新：2026.04.12  
> 網站：https://www.seawind.cc  
> 倉庫：https://github.com/mc-seawind-cc/website  
> 架構：GitHub Pages 靜態網站（純 HTML/CSS/JS，無框架）

---

## 一、網站架構總覽

### 頁面結構
```
首頁.html          ← 主入口（index.html 會自動跳轉）
├── 公告.html
├── 海風指南.html    （內含 guide/ 子目錄 40+ 頁）
├── 文化藝廊.html    （內含 lore/ 子目錄 7 頁）
├── 風景照.html
├── 歷史館.html
├── 海風團隊.html
├── 海風社區.html
├── 會員.html
├── 相關連結.html
├── 合作夥伴.html
├── 玩家須知.html / 支持須知.html / 管理規則.html / 公務人員須知.html
├── 特殊裝備規範.html / 服務條款.html / 隱私權政策.html
├── 違規處分.html
├── partner-mcu.html
├── 404.html（自製動態 404 頁面）
└── 贊助.html（重定向頁）
```

### 技術堆疊
- **無框架**：純 HTML + CSS + Vanilla JS
- **字體**：Google Fonts（Noto Sans TC / Noto Serif TC）
- **外部 API**：
  - `api.mcsrvstat.us` — 伺服器狀態查詢
  - `api.github.com` — 部署次數統計
  - `truth.bahamut.com.tw` — 景觀明信片圖片來源
- **音效**：Web Audio API（雨聲白噪音）+ MP3 tick 音效
- **主題**：深色 / 淺色雙模式，記憶於 localStorage

### 共用資源
| 檔案 | 用途 |
|------|------|
| `style.css` | 全站共用樣式（1037 行，minified）|
| `music-player.css` | 音樂播放器樣式 |
| `main.js` | 全站共用邏輯（導覽、動畫、公告、輪播等）|
| `utils.js` | Discord Markdown → HTML 轉換器 |
| `tips.js` | 首頁提示輪播文字（80+ 條）|
| `announcements_v2.json` | 公告資料（v2 格式）|
| `announcements.json` | 公告資料（v1 格式，備用）|
| `photos.json` | 風景照路徑列表 |
| `penalties.json` | 違規處分資料 |

---

## 二、設計風格指南

### 色彩系統
```css
/* 主色調 — 海洋 / 天空 / 沙灘 */
--sky: #9dafff;         /* 主要藍，用於強調、連結、按鈕 */
--foam: #a8e6cf;        /* 泡沫綠，用於成功狀態、次要強調 */
--sand: #deac80;        /* 沙色，用於溫暖標籤 */
--ocean-blue: #578aff;  /* 深藍，主要按鈕 */

/* 深色模式背景 */
--deep: #0d1117;        /* 最深背景 */
--ocean: #161b22;       /* 卡片背景 */
--drift: #1c2333;       /* 次要背景 */
--mist: #21283b;        /* 邊框、分隔線 */

/* 文字 */
--white: #e6edf3;       /* 主要文字（深色模式）*/
--cloud: #c9d1d9;       /* 次要文字 */
--fog: #8b949e;         /* 說明文字、弱化文字 */
```

### 字體
- **正文**：`'Noto Sans TC', system-ui, sans-serif`
- **標題**：`'Noto Serif TC', serif`（Hero 大標題用）
- **程式碼**：`'JetBrains Mono', 'Fira Code', monospace`

### 間距系統
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2.5rem;    /* 40px */
--space-2xl: 4rem;     /* 64px */
```

### 圓角
```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
```

### 動畫
- 過渡曲線：`cubic-bezier(0.4, 0, 0.2, 1)`（`--ease`）
- 過渡時間：`0.3s`（`--duration`）
- 滾動觸發動畫：Intersection Observer（`.reveal-up`, `.slide-up`, `.zoom-in` 等）
- 減少動效：尊重 `prefers-reduced-motion: reduce`

---

## 三、已知問題 & 待修復

### 🔴 Bug
1. **CSS 語法錯誤**（line 1037 附近）：
   ```css
   @media (prefers-reduced-motion: reduce) {
     .community-body,
   }
   ```
   → `.community-body,` 後面缺少規則，應移除或補充

2. **CSS 重複定義**：
   - `.back-to-top` 的 `bottom` 值在不同位置定義了兩次（`1.5rem` 和 `80px`），後者會覆蓋前者
   - `.feature-card::before` 定義了兩次

3. **路徑偵測不完整**（`main.js` 的 `SW_BASE`）：
   ```javascript
   if (path.includes('/guide/') || path.includes('/lore/')) return '../';
   ```
   → 如果未來新增子目錄（如 `community/`），需要同步更新

### 🟡 潛在問題
4. **GitHub API 未認證限制**：`deployCount` 使用未認證的 GitHub API，每小時 60 次限制。網站流量大時可能查不到

5. **外部圖片依賴**：首頁「海風景觀明信片」使用 `truth.bahamut.com.tw` 的圖片
   - 如果巴哈圖床失效或被封鎖，圖片會無法顯示
   - 建議：下載圖片後存到自己的 `assets/` 目錄

6. **音效檔案可能不存在**：`main.js` 嘗試載入 `assets/sounds/tick1-3.mp3`，但如果檔案不存在，console 會報錯但不影響功能

7. **guide-menu.png 沒有 WebP 版本**：其他截圖都有 `.webp` 版本，但 `guide-menu.png` 沒有

---

## 四、優化建議

### 效能優化
| 項目 | 現狀 | 建議 |
|------|------|------|
| CSS 大小 | 1037 行 minified（~84KB）| 考慮拆分為 base + pages，首頁只載入需要的 |
| 圖片格式 | 部分 PNG 無 WebP | 為 `guide-menu.png`、`logo.png` 等補上 WebP |
| 外部圖片 | 巴哈圖床 5 張 | 遷移到自己的 CDN/倉庫 |
| JS 延遲載入 | ✅ 已用 `requestIdleCallback` | 良好 |
| 預連線 | ✅ 已用 `dns-prefetch` | 良好 |
| 圖片懶載 | ✅ 已用 `loading="lazy"` | 良好 |

### SEO 優化
| 項目 | 現狀 | 建議 |
|------|------|------|
| 結構化資料 | ✅ 首頁有 JSON-LD | 其他頁面也可加 |
| meta description | 首頁有，其他頁待確認 | 每頁都應有獨立的 description |
| sitemap.xml | ❌ 缺少 | 建議自動生成 |
| robots.txt | ❌ 缺少 | 建議新增，引導爬蟲 |
| canonical URL | index.html 有 | 確認所有頁面都有 |
| 圖片 alt | 大部分有 | 部分明信片 alt 較籠統（都叫「海風景觀明信片」）|

### 無障礙（Accessibility）
| 項目 | 現狀 | 建議 |
|------|------|------|
| Skip link | ✅ 有「跳到主要內容」| ✅ 良好 |
| aria-label | ✅ 導覽、Lightbox 有 | ✅ 良好 |
| 鍵盤導覽 | ✅ Lightbox 支援 Tab 陷阱 | ✅ 良好 |
| 對比度 | 淺色模式部分文字偏淡 | 檢查 `--fog` 在淺色模式的對比度 |
| focus-visible | ✅ 有 | ✅ 良好 |

### 行動體驗
| 項目 | 現狀 | 建議 |
|------|------|------|
| 響應式 | ✅ 有完整斷點（1024/768/480）| ✅ 良好 |
| 觸控目標 | 部分按鈕偏小 | 導覽按鈕已有 `min-width: 44px` |
| 觸控滑動 | ✅ Lightbox 支援 | ✅ 良好 |
| 漢堡選單 | ✅ 有 | ✅ 良好 |

---

## 五、維護須知

### 如何新增公告
1. 編輯 `announcements_v2.json`
2. 格式：
```json
{
  "announcements": [
    {
      "id": "2026-001",
      "isoDate": "2026-04-12",
      "tag": "更新",
      "title": "公告標題",
      "content": "支援 **Markdown** 語法"
    }
  ]
}
```
3. tag 可選值：`公告`、`更新`、`維護`、`活動`
4. `pinned: true` 可置頂

### 如何新增風景照
1. 圖片放入 `photos/` 目錄
2. 更新 `photos.json`
3. 支援 `.jpg`, `.png`, `.webp`, `.mp4`, `.webm`

### 如何新增海風指南頁面
1. 在 `guide/` 目錄建立 HTML 檔案
2. 模板結構參考 `guide/入門.html`
3. 需要加入 `海風指南.html` 的目錄（guide-toc）

### 部署流程
1. 推送到 `main` 分支
2. GitHub Pages 自動部署
3. 在 https://github.com/mc-seawind-cc/website/deployments 查看狀態

### CSS 版本控制
- 修改 CSS 後更新快取破壞參數：`style.css?v=YYMMDDx`（如 `v=260412h`）
- `main.js` 也使用相同機制

---

## 六、特色功能

### 首頁動畫系統
- **Hero 區**：逐字浮現標題 + 打字機副標題 + 錯開入場動畫
- **粒子效果**：深色模式為上升粒子，淺色模式為雨滴
- **雨聲環境音**：Web Audio API 白噪音 + 低通濾波器，可開關
- **滾動進度條**：頁面頂部彩虹漸變進度指示

### 公告系統
- 支援 Discord Markdown 語法（`utils.js` 中的 `md2html()`）
- v2 格式使用 ISO 日期，更易維護
- 標籤分類（公告/更新/維護/活動）+ 置頂功能

### 圖片燈箱
- 全站通用（首頁輪播、風景照、文化藝廊等）
- 支援：鍵盤導覽（← → Esc）、觸控滑動、Tab 陷阱
- 計數器顯示當前位置

### 音樂播放器
- 固定在右下角
- hover 展開控制面板
- 支援音量調節

---

## 七、未來規劃 & 待辦

- [ ] 修復 CSS 語法錯誤（line 1037 的 `@media (prefers-reduced-motion: reduce)`）
- [ ] 修復 `.back-to-top` 重複定義
- [ ] 修復 `.feature-card::before` 重複定義
- [ ] 為缺失的圖片補上 WebP 版本
- [ ] 遷移巴哈外部圖片到本地
- [ ] 生成 sitemap.xml
- [ ] 新增 robots.txt
- [ ] 各頁面補充 meta description
- [ ] 部分圖片 alt 文字更具體化
- [ ] 淺色模式對比度檢查 & 修正
- [ ] 考慮 CSS 拆分以優化載入速度
- [ ] GitHub API rate limit 應對方案

---

## 八、交接注意事項

1. **所有設計決策記錄在此文件**，修改前請先閱讀
2. **CSS 是全站共用的**，修改時請確認不影響其他頁面
3. **JS 也是全站共用的**，新增頁面特定功能請用條件判斷（如 `isHome`）
4. **JSON 資料檔案**是公告和照片的資料來源，格式要嚴格遵守
5. **GitHub Pages 部署有延遲**，push 後約 1-3 分鐘才會生效
6. **中文檔名**在 Git 和 URL 中可能出現編碼問題，注意測試
