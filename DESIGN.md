# DESIGN.md — 海風 SeaWind 網站設計指南

> 最後更新：2026-04-13
> 維護者：海風網站助手

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| 網址 | https://www.seawind.cc |
| GitHub | https://github.com/mc-seawind-cc/website |
| 架構 | 純靜態 HTML + CSS + JS（GitHub Pages） |
| 語言 | 繁體中文（台灣） |
| 主題 | Minecraft 養老建築生存伺服器官方網站 |

---

## 二、網站架構

### 主要頁面
- `首頁.html` — 主入口（index.html 自動跳轉）
- `公告.html` — 公告系統（含篩選、搜尋、分頁）
- `會員.html` — 會員方案
- `合作夥伴.html` — 合作夥伴列表
- `違規處分.html` — 違規記錄
- `風景照.html` — 照片牆
- `海風團隊.html` — 團隊介紹
- `歷史館.html` — 伺服器歷史

### 社群須知（導航下拉）
- `玩家須知.html`
- `支持須知.html`
- `管理規則.html`
- `公務人員須知.html`
- `特殊裝備規範.html`
- `服務條款.html`
- `隱私權政策.html`

### 關於（導航下拉）
- `文化藝廊.html`
- `風景照.html`
- `歷史館.html`
- `海風社區.html`
- `海風團隊.html`

### 資料中心（導航下拉）
- `合作夥伴.html`
- `違規處分.html`

### 海風指南
- `guide/` 目錄下有 40+ 個子頁面（入門、領地、經濟、任務等）

### 文化藝廊
- `lore/` 目錄下有故事建築頁面（索西斯墓、邊境之村等）

### 其他
- `404.html` — 精美的 404 頁面（含小遊戲）
- `template/nav.html` — 導航模板

---

## 三、技術細節

### 檔案結構
```
assets/
├── img/          — 圖片（logo、hero、guide、icons）
├── lore/         — 文化藝廊圖片
├── photos_new/   — 風景照
├── sounds/       — 音效（打字機 tick）
├── announcements/ — 公告圖片
└── migrated/     — 從 Discord 遷移的圖片

guide/            — 海風指南子頁（40+ 頁）
lore/             — 文化藝廊故事頁
photos/           — 風景照（JPG）
```

### CSS 架構
- `style.css`（~138KB）— 主樣式，所有頁面共用
- `music-player.css` — 音樂播放器樣式

### JavaScript 架構
- `main.js` — 核心邏輯（導航、動畫、公告、輪播、Lightbox）
- `utils.js` — Discord Markdown 轉 HTML 工具
- `tips.js` — 提示文字資料（80+ 條）
- `music-player.js` — 音樂播放器

### JSON 資料
- `announcements_v2.json` — 公告資料（501 則）
- `announcements.json` — 舊版公告格式（備用）
- `photos.json` — 照片路徑清單
- `penalties.json` — 違規處分資料

### 版本控制
- CSS/JS 使用 query string 快取破壞：`?v=260412k`
- 版本格式：`YYMMDD` + 字母序號

---

## 四、設計系統

### 色彩（CSS 變數）

#### 深色主題（預設）
```css
--deep: #0d1117;      /* 背景 */
--ocean: #161b22;     /* 卡片背景 */
--drift: #1c2333;     /* 次要背景 */
--mist: #21283b;      /* 邊框 */
--fog: #8b949e;       /* 次要文字 */
--cloud: #c9d1d9;     /* 主要文字 */
--white: #e6edf3;     /* 亮文字 */
--sky: #9dafff;       /* 主色（藍紫） */
--foam: #a8e6cf;      /* 輔色（綠） */
--sand: #deac80;      /* 暖色 */
```

#### 亮色主題
```css
--deep: #f0f2f5;
--ocean: #ffffff;
--fog: #4a5260;
--cloud: #1f2328;
--white: #0d1117;
```

### 字體
- 主要：`'Noto Sans TC', 'Inter', system-ui, sans-serif`
- 裝飾：`'Noto Serif TC'`（404 頁面標題）

### 間距系統
```css
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2.5rem
--space-2xl: 4rem
```

### 圓角
```css
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
--radius-xl: 24px
```

### 動畫
- 滾動觸發：`.reveal-up`, `.slide-up`, `.zoom-in`, `.slide-left`, `.fade-in`
- IntersectionObserver 驅動，觸發後添加 `.visible` class
- 安全機制：3 秒後自動顯示所有隱藏元素

---

## 五、已知問題與待修復

### 🔴 Bug
1. **公告頁 v2 Lightbox 未接上首頁的 Lightbox** — 公告頁自己定義了 `.lightbox` 結構和 `.lb-*` class，與首頁使用的 `.lightbox-close` / `.lightbox-prev` 等 class 不同，功能上各自獨立沒問題，但代碼重複。

### 🟡 優化建議
1. **CSS 檔案過大（138KB）** — 考慮按頁面拆分或使用 CSS-in-JS 方案
2. **首頁 `index.html` 的跳轉** — 同時使用 `<meta http-equiv="refresh">` 和 `location.replace()`，可移除 meta refresh 只保留 JS
3. **圖片優化** — 部分圖片未使用 WebP fallback，hero 圖同時載入了 PNG 和 preload
4. **音樂播放器** — `music-player.js` 不在 HTML 中直接引用，由 `main.js` 動態注入

### 🟢 良好實踐
- ✅ 完善的 SEO（meta tags、JSON-LD、canonical）
- ✅ 無障礙支援（skip link、aria-label、focus-visible）
- ✅ 深色/亮色主題切換
- ✅ 響應式設計（mobile-first）
- ✅ 滾動進度條
- ✅ 圖片 Lightbox（支援鍵盤、觸控滑動）
- ✅ 公告系統（篩選、搜尋、分頁、月份導航）
- ✅ Discord Markdown 完整轉換
- ✅ 伺服器狀態即時查詢
- ✅ 404 頁面含 8 個小遊戲
- ✅ 風聲環境音效（Web Audio API）

---

## 六、修改記錄

| 日期 | 修改內容 | 修改者 |
|------|---------|--------|
| 2026-04-13 | 建立 DESIGN.md，完成網站全面審查 | 海風網站助手 |

---

## 七、備註

- GitHub Pages 部署，無後端伺服器
- 所有公告資料來自 Discord 頻道自動同步
- 照片由玩家在 Discord 投稿
- 網站版本號格式：`YYMMDD` + 字母序號（如 `260412k`）
