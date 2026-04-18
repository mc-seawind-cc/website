# 海風 SeaWind 網站設計文件

> 最後更新：2026.04.18
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
22. Keyframe Animations
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

## 7. 頁尾修改次數

頁尾的 `deployCount` 透過 GitHub API 自動取得 commit 數量，由 `main.js` 中的函式處理。**不需要手動修改。**

頁尾格式：
```html
<p class="page-revise">網站最後修改日期 YYYY.MM.DD / 總計修改 <span id="deployCount">—</span> 次</p>
```

`網站最後修改日期` 需要手動更新為當次修改日期。

---

## 8. 已知問題與待辦

### 已修復 ✅
- [x] `music-player.css` 建立完整樣式（深色/淺色模式 + 響應式）— 2026.04.18
- [x] 全站頁尾日期統一更新至 2026.04.18 — 2026.04.18

### 高優先
- [ ] 首頁 Hero 連線版本文字 `1.21.6 ~ 26.x` 需確認是否最新
- [ ] 伺服器資訊區塊遊戲版本 `1.21.11(群騎紛爭)` 需確認是否最新

### 中優先
- [ ] CSS 有大量 `[data-theme="light"]` 重複選擇器可清理優化
- [ ] 公告資料可考慮 inline 到 HTML（減少 API 請求）
- [ ] 無障礙：Lightbox 缺少 `aria-live`、圖片 `alt` 可更描述性
- [ ] 多個頁面導航欄不一致（部分頁面缺少新連結）
- [ ] `贊助.html` 導航欄 HTML 結構錯誤（多餘 `</a>` + 缺少結尾 `</li>`）

### 低優先
- [ ] 404.html 體積偏大（可將動畫 CSS/JS 外部化）
- [ ] 圖片全面檢查 WebP fallback
- [ ] SEO：各子頁面 meta description 檢查

---

## 9. 修改記錄

| 日期 | 修改者 | 修改內容 |
|---|---|---|
| 2026.04.18 | 海風網站助手 | 建立 DESIGN.md，整理網站架構與設計規範 |
| 2026.04.18 | 海風網站助手 | 建立 `music-player.css` 完整樣式（深色/淺色/響應式），修復空樣式表問題 |
| 2026.04.18 | 海風網站助手 | 全站 20 個頁面頁尾日期統一更新至 2026.04.18 |
| 2026.04.18 | 海風網站助手 | 合作夥伴頁新增「洛羽民宿」Discord 社群卡片 |

---

## 10. 注意事項

1. **每次修改都要更新此文件的修改記錄**（第 9 節）
2. **CSS 結構不可破壞**：dark 樣式在前，light 覆蓋在該區段末尾
3. **Cache busting**：修改 CSS/JS 後更新 HTML 中的 `?v=日期碼`
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，每次需向使用者索取新 token**
6. **頁尾修改次數 deployCount 自動取得，不用手動改；但日期需要手動更新**
7. **Git 操作**：每次修改後 `git add -A && git commit -m "描述" && git push origin main`
