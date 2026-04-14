# 📐 海風網站設計文件 DESIGN.md

> 最後更新：2026.04.14
> 維護者：海風網站助手 (AI)
> 版本：v1.1

---

## 一、網站概述

| 項目 | 內容 |
|------|------|
| 網址 | https://www.seawind.cc |
| 倉庫 | https://github.com/mc-seawind-cc/website |
| 架構 | 純靜態 HTML/CSS/JS，GitHub Pages 部署 |
| CNAME | www.seawind.cc |
| 字型 | Noto Sans TC (Google Fonts) |
| 主題 | 深色/淺色雙模式，支援系統偏好偵測 |

### 技術特色
- **JSON-LD 結構化資料**：WebSite + Organization schema
- **SEO 基礎**：canonical URL、OG tags、Twitter Card、meta description
- **無障礙 (a11y)**：skip link、aria-label、focus-visible 樣式、light-box focus trap
- **效能優化**：preload hero image、DNS prefetch、defer script、IntersectionObserver 動畫
- **深色主題為主**，`[data-theme="light"]` 覆寫變數切換

---

## 二、檔案結構

```
/
├── 首頁.html          # 主頁：Hero + 公告欄 + 特色 + 明信片 + 風景照輪播
├── 公告.html          # 雜誌式公告閱讀器（標籤篩選 + 搜尋 + 月份導航）
├── 風景照.html        # 全部照片瀑布流（無限捲動）
├── 海風團隊.html
├── 文化藝廊.html
├── 歷史館.html
├── 海風指南.html
├── 海風社區.html
├── 玩家須知.html
├── 支持須知.html
├── 管理規則.html
├── 公務人員須知.html
├── 服務條款.html
├── 隱私權政策.html
├── 會員.html
├── 相關連結.html
├── 合作夥伴.html
├── 違規處分.html
├── 贊助.html
├── 404.html
├── index.html         # 重導至首頁.html
├── style.css          # 主樣式（minified）
├── main.js            # 主腳本
├── utils.js           # Discord Markdown → HTML 轉換器
├── tips.js            # 提示輪播資料
├── music-player.js/css# 音樂播放器
├── CNAME              # GitHub Pages 自訂網域
│
├── announcements_v2.json  # 公告資料（v2 格式，523 則）
├── announcements.json     # 舊格式公告（備用）
├── announcements_all.json # 全部公告備份
├── photos.json            # 風景照路徑（550+ 張）
├── penalties.json         # 違規處分資料
│
├── lore/              # 文化藝廊故事頁面
│   ├── 索西斯墓.html
│   ├── 邊境之村.html
│   ├── 瑟爾納大橋.html
│   ├── 禁忌天使.html
│   └── ...
├── guide/             # 海風指南子頁（40+ 頁）
│   ├── 入門.html
│   ├── 領地.html
│   ├── 經濟.html
│   └── ...
├── assets/
│   ├── img/           # 圖示、Logo、Hero 圖
│   ├── lore/          # 藝廊圖片 (webp)
│   ├── announcements/ # 公告圖片 (webp)
│   ├── migrated/      # 舊版風景照
│   ├── photos_new/    # 新版風景照
│   └── sounds/        # 打字機音效
└── photos/            # 首頁用縮圖（28 張）
```

---

## 三、公告系統

### 資料來源
公告資料來自 Discord 頻道，透過自動化腳本服務抓取並產出 JSON：

| 頻道 | ID | 類型 | 備註 |
|------|-----|------|------|
| 公告／維護 | 1270267062308175922 | 公告 + 維護 | 新維護編號與公告共用且獨立 |
| 活動 | 1270267176812806255 | 活動 | 編號獨立 |
| 更新 | 1270267126011396152 | 更新 | 編號獨立 |
| 舊維護 | 1330216386613743730 | 維護 | 編號獨立且不再更新 |

### JSON 格式 (v2)
```json
{
  "version": 2,
  "generatedAt": "ISO timestamp",
  "count": 523,
  "announcements": [
    {
      "tag": "公告|更新|維護|活動",
      "id": "#0130",
      "date": "115.04.13",        // ROC 日期
      "isoDate": "2026-04-13",    // ISO 日期
      "timestamp": "...",
      "title": "標題",
      "content": "Markdown 格式內文",
      "images": [],               // Discord CDN 圖片
      "localImages": [],          // 本地 webp 圖片
      "reactions": [],            // Discord 表情反應
      "reactionCount": 0,
      "discordId": "1493195770881376318",
      "pinned": false,
      "author": "作者",
      "index": 0                  // 序號
    }
  ]
}
```

### 格式注意事項
- **舊版格式**：使用引用文字 `>` 包裹列表，數字編號式
  ```
  > 1. 第一點。
  > 2. 第二點。
  ```
- **新版格式**：直接使用列表 `-`，不使用引用 `>`，縮排與換行更乾淨
  ```
  - 第一點。
  - 第二點。
  ```
- 內文轉換由 `utils.js` 的 `md2html()` 函式處理
- Discord 頻道引用 `#▏頻道名．x▕` 和 `<id:guide>` 會自動轉換

### 首頁公告欄
- 預設顯示 7 則，捲動後最多顯示 12 則
- 第一則為精選卡片（含圖片）
- 其餘為緊湊行列表

---

## 四、已知問題與修復記錄

### ✅ 已修復
| 日期 | 問題 | 說明 |
|------|------|------|
| 2026.04.14 | CSS 語法錯誤 | `.nav` 的 `-webkit-backdrop-filter` 後缺少分號，導致 `border-bottom` 解析失敗 |
| 2026.04.14 | CSS 語法錯誤 | `.hero-badge` 的 `blur(4px)` 後為句點而非分號，破壞後續選擇器 |
| 2026.04.14 | Lore 頁面圖片路徑錯誤 | 所有 7 個 lore/*.html 的 nav logo 圖片路徑 `assets/img/logo.png` 缺少 `../` 前綴，應為 `../assets/img/logo.png`，導致 logo 圖片無法顯示 |
| 2026.04.14 | 舊維護公告未同步 | Discord 舊維護頻道 (1330216386613743730) 共 20 筆公告未匯入網站，已補齊至 announcements_v2.json（#0005 ~ #0022） |
| 2026.04.14 | 舊維護公告格式統一 | 舊維護頻道公告使用 `>` 引用格式，已轉換為新版 `-` 列表格式以保持一致性 |

### ⚠️ 注意事項
1. **deployCount 依賴 GitHub API**：使用未認證 API 呼叫獲取 commit 數量，每小時 60 次限制。若超過限制顯示 "—" 屬正常現象。
2. **巴哈姆特圖片**：首頁明信片使用巴哈 CDN (`truth.bahamut.com.tw`)，若該站異常會顯示 fallback 樣式。
3. **伺服器狀態 API**：使用 `api.mcsrvstat.us` 查詢，可能有快取延遲。
4. **音樂播放器**：需使用者互動才能啟動音訊（瀏覽器自動播放政策）。

---

## 五、設計風格指南

### 色彩系統 (CSS Variables)
```css
--sky: #9dafff;        /* 主色：天空藍 */
--sand: #deac80;       /* 沙灘金 */
--foam: #a8e6cf;       /* 泡沫綠 */
--ocean-blue: #578aff; /* 海洋藍 */
--deep: #0d1117;       /* 深色背景 */
--ocean: #161b22;      /* 卡片背景 */
--drift: #1c2333;      /* 次要背景 */
--cloud: #c9d1d9;      /* 主要文字 */
--white: #e6edf3;      /* 標題文字 */
```

### 公告標籤色彩
```css
公告: #578aff (藍)
更新: #64dcb4 (綠)
維護: #ff8282 (紅)
活動: #ffaa32 (橙)
```

### 動畫
- 滾動觸發：IntersectionObserver，threshold 0.05
- 動畫類別：`.fade-in` `.slide-up` `.zoom-in` `.slide-left` `.reveal-up`
- 安全兜底：3 秒後自動 visible 所有元素
- 過渡：`--ease: cubic-bezier(0.4, 0, 0.2, 1)`，`--duration: 0.3s`

### 元件命名慣例
- 公告系統：`ann-*` 前綴
- 風景照：`photo-*` 前綴
- 導航列：`nav-*` 前綴
- Hero 區域：`hero-*` 前綴
- Lightbox：`lightbox-*` 前綴
- 文化藝廊：`lore-*` 前綴

---

## 六、頁尾修改次數

各頁面底部皆有 `page-revise` 區塊，格式：
```html
<p class="page-revise">網站最後修改日期 YYYY.MM.DD / 總計修改 <span id="deployCount">—</span> 次</p>
```

- **修改日期**：每次修改時手動更新
- **修改次數**：透過 GitHub API 自動計算（commits 數量）

---

## 七、Discord 整合

### Bot Token 用途
- 抓取風景照投稿頻道的照片
- 同步公告頻道內容至 JSON
- Token 須妥善保管，使用完畢後銷毀

### 風景照同步
照片來源：Discord 頻道 1270268915271860356
- 照片下載後轉存為 webp 格式至 `assets/photos_new/`
- 更新 `photos.json` 加入新路徑
- 首頁輪播與風景照頁面自動讀取

---

## 八、部署流程

1. 修改檔案 → git commit → git push to `main`
2. GitHub Pages 自動部署至 `www.seawind.cc`
3. 在 https://github.com/mc-seawind-cc/website/deployments 查看部署狀態
4. DNS 快取可能需等待數分鐘生效

### Git 設定
- 使用者：AI 助手
- Commit 訊息格式：簡述修改內容 + 修改次數校正（如需）

---

## 九、已知問題與注意事項

### CSS 注意事項
1. **重複宣告**：`style.css` 中有多處 `-webkit-backdrop-filter: blur()` 重複 2-4 次，雖不影響功能但增加檔案大小
2. **`[data-theme="light"]` 覆寫區塊龐大**：淺色主題覆寫約佔 CSS 總量的 40%，後續若新增深色元件需同步補上淺色覆寫
3. **`color-mix()` 瀏覽器支援**：部分動畫使用 `color-mix(in srgb, ...)`，Safari < 16.2 不支援，有 graceful degradation

### 效能觀察
1. **首頁載入**：Hero 圖片使用 `fetchpriority="high"` 正確，但 `homeHero.png` 未同時提供 webp 版本（已有 webp 但未使用）
2. **照片無限捲動**：使用 IntersectionObserver 做 lazy loading，實作正確
3. **公告 JSON 大小**：523 則公告的 JSON 約 200KB+，考慮是否需要分頁或增量載入
4. **font-display**：Google Fonts 使用 `display=swap`，正確

### 404 頁面
- 目前 404.html 僅有基本結構，無導航列或返回首頁按鈕，建議補上完整 nav 和友善提示

### 音樂播放器
- `music-player.js/css` 為獨立模組，不影響主要功能
- 需使用者互動才能啟動（瀏覽器自動播放政策限制）

---

## 十、待辦與建議

### 優先（影響使用者體驗）
- [x] ~~修復 lore 頁面 logo 圖片路徑~~ (2026.04.14 已修復)
- [x] ~~補齊舊維護頻道公告~~ (2026.04.14 已完成)
- [ ] 為 404.html 添加完整導航列和友善的錯誤提示
- [ ] 首頁 Hero 圖片提供 webp 版本（已有 `homeHero.webp` 但 HTML 仍引用 png）

### 中優先（優化與維護）
- [ ] 清理 CSS 中重複的 `-webkit-backdrop-filter` 宣告
- [ ] 評估公告 JSON 是否需要分頁載入（目前一次載入全部 523 則）
- [ ] 檢查所有 guide/ 頁面的圖片 alt 文字是否完整
- [ ] 確認所有 `og:image` meta 標籤使用完整 URL（目前部分為相對路徑）

### 低優先（長期改善）
- [ ] 評估是否需要 Service Worker 實現離線支援
- [ ] 評估 index.html 重導至首頁.html 的效能（meta refresh vs JS redirect vs server-side redirect）
- [ ] 確認贊助.html 頁面是否需要公開
- [ ] 考慮 CSS 變數抽出至獨立檔案方便主題管理

---

## 十一、Discord 整合補充

### 公告頻道格式差異
**舊版格式**（舊維護頻道，已停用）：
```
> 1. 基岩版連線版本。
> 2. 更新[礦物代換](連結)。
> - 優化和修復錯誤。
```

**新版格式**（現行公告／維護、更新頻道）：
```
- 基岩版連接埠修改為`` 51496 ``。
- 更新[海風官方網站](https://www.seawind.cc/)。
```
- 新版不使用引用文字 `>` 包裹
- 注意縮排與換行格式避免輸入錯誤
- 連結使用標準 Markdown `[文字](URL)` 格式

### 同步檢查清單
同步公告時，需確認以下頻道是否有遺漏：
1. **公告／維護** (1270267062308175922) — 最新 #0130
2. **活動** (1270267176812806255) — 最新 #0026
3. **更新** (1270267126011396152) — 最新 #0289
4. **舊維護** (1330216386613743730) — 最新 #0022（已停用，不再更新）
