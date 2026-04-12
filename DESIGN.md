# 海風網站設計理念

> 最後更新：2026.04.12

---

## 核心風格

- **深色為主、淺色為輔**：Minecraft 伺服器網站適合深色沉浸感，淺色模式同步設計但不妥協深色體驗
- **海洋/風/自然意象**：配色圍繞 sky（藍）、foam（綠）、sand（暖色）展開
- **不要可愛、不要花俏**：目標是乾淨、有質感、專業感，不是遊戲官網那種塞滿特效的風格
- **中文優先**：所有文案使用繁體中文，台灣當地用語

## 首頁動畫設計

### 打字機效果
- 副標題「在風與海之間，有一個可以長久生存的地方」用打字機逐字顯示
- 「在風與海之間，」打完後停頓 1.2 秒，游標呼吸閃爍
- 然後繼續打出「有一個可以長久生存的地方」
- 停頓製造「正在思考」的感覺，比匀速打字更有生命力
- 打字速度 80ms/字，標點符號後多停一下

### 首頁動畫時間軸
- 0.1s：「海」字浮現
- 0.25s：「風」字浮現
- 0.6s：打字機開始
- 1.8s：按鈕淡入
- 2.2s~2.6s：資訊卡片錯開入場
- 2.8s：提示輪播顯示
- 3.2s：向下探索箭頭
- 原則：動畫有層次、不搶主視覺、手機端加速

### 減少動效
- `prefers-reduced-motion` 時所有動畫關閉，直接顯示完整內容

## 公告系統

### 資料來源
- Discord 頻道匯出 JSON（更新/公告/活動三個頻道）
- Python 腳本解析 → `announcements_v2.json`
- 圖片從 Discord CDN 下載並轉換為本地 WebP

### 設計原則
- **編號優先**：公告編號是最重要的識別，用藍色標籤醒目顯示在左側
- **民國年**：日期統一用民國紀年（如 115.04.12）
- **不加裝飾性表情符號**：UI 保持乾淨，不靠 emoji 增加「活潑感」
- **分頁載入**：每頁 30 則，不一次塞進 500 個 DOM
- **月份分組**：按月分隔，方便快速定位
- **內部引用自動轉連結**：「更新#0258」自動轉為可點擊跳轉

### 內部連結機制
- `[更新#0258](discord-url)` 和純文字 `更新#0258` 都會自動轉為內部連結
- 點擊後自動展開目標卡片、捲動定位、藍色高亮 2 秒
- 如果目標在未載入的分頁，自動切換「全部」篩選

## 全站共用原則

### 字體
- 主要：Noto Sans TC（Google Fonts）
- 等寬：JetBrains Mono / SF Mono / Cascadia Code
- `display=swap` 避免 FOIT

### 配色變數
- 深色：`--deep` `--ocean` `--drift` `--mist` `--fog` `--cloud`
- 主色：`--sky`（藍）`--foam`（綠）`--sand`（暖）
- 淺色模式用 `[data-theme="light"]` 覆蓋

### 動畫
- 全站統一 `--ease: cubic-bezier(0.4,0,0.2,1)` 和 `--duration: 0.3s`
- 滾動揭示動畫只觸發一次，不反覆隱藏
- 卡片 hover 有微動畫但不誇張

### 響應式
- 斷點：768px（手機）、1024px（平板）、1400px（大螢幕）
- 手機端觸控目標最小 44px
- `hover: none` 裝置移除 hover 效果改用 active

### 效能
- 圖片使用 WebP 格式
- `loading="lazy"` 非首屏圖片
- CSS `content-visibility: auto` 大區塊
- `prefers-reduced-motion` 尊重使用者偏好
- 字體 `font-display: swap`

## 部署流程

1. 本地修改 → `git add` → `git commit` → `git push origin main`
2. GitHub Pages 自動部署
3. 快取破壞：CSS/JS 用 `?v=YYMMDDx` 版本號
4. 部署後在 `https://github.com/mc-seawind-cc/website/deployments` 確認

## 注意事項

- 導覽列在每個 HTML 頁面都是硬編碼，改 nav 需同步所有頁面
- `announcements.json`（舊版）仍保留作為 fallback，首頁自動偵測 v2
- `_import/` 目錄包含匯出腳本和原始 Discord 資料，已加入 .gitignore
- 圖片使用本地 WebP，來源是 Discord CDN，定期需要重新同步

---

## 交接指南：給下一位設計師/維護者

### 你會需要知道的

這是一個 **純靜態網站**，沒有框架、沒有後端、沒有建置工具。所有頁面都是獨立的 HTML 檔案，共用同一組 CSS 和 JS。部署在 GitHub Pages，push 到 main 分支就會自動上線。

### 專案結構

```
網站根目錄/
├── 首頁.html              # 首頁（index.html 會跳轉到這裡）
├── index.html             # 純跳轉頁，有 noindex
├── 公告.html              # 公告系統（v2，獨立 JS 邏輯）
├── 海風指南.html           # 指南入口（guide/ 下有 42 個子頁）
├── 文化藝廊.html           # Lore 入口（lore/ 下有 7 篇文章）
├── 風景照.html             # 照片牆
├── 404.html               # 404 頁面（有小遊戲）
├── *.html                 # 其他約 20 個獨立頁面
│
├── style.css              # 全站共用樣式（~120KB，包含深淺色）
├── main.js                # 全站共用腳本（打字機、公告欄、輪播等）
├── utils.js               # 工具函式（md2html 轉換器、日期格式化）
├── tips.js                # 首頁提示輪播資料
├── music-player.js/css    # 音樂播放器（YouTube 嵌入）
│
├── announcements_v2.json  # 公告資料（501 則，v2 格式）
├── announcements.json     # 舊版公告資料（保留作 fallback）
├── photos.json            # 風景照 URL 列表
├── penalties.json         # 違規處分資料
│
├── assets/
│   ├── img/               # 圖示、logo、hero 圖片
│   ├── announcements/     # 公告圖片（WebP，161 張）
│   ├── lore/              # 文化藝廊圖片（WebP）
│   ├── photos_new/        # 風景照（本地備份）
│   ├── sounds/            # 打字機音效（tick1~3.mp3）
│   └── migrated/          # 舊版遷移資料
│
├── guide/                 # 42 個指南頁（領地、經濟、任務等）
├── lore/                  # 7 篇文化藝廊文章
├── photos/                # 舊版照片（JPG，29 張）
├── template/nav.html      # 導覽列模板（參考用，實際是硬編碼）
├── sync-nav.sh            # 導覽列同步腳本
├── CNAME                  # GitHub Pages 自訂域名
├── robots.txt / sitemap.xml
├── DESIGN.md              # 本檔案
└── _import/               # （gitignore）公告匯出腳本和原始資料
```

### 常見任務

#### 改導覽列
導覽列在每個 HTML 檔案裡都是**硬編碼的重複內容**（約 30 行 `<nav>`）。改一個頁面的 nav 不會同步到其他頁面。

目前所有頁面的 nav 結構一致。如果你要改 nav：
1. 改一個檔案的 `<nav>` 區塊
2. 用編輯器的「搜尋全部取代」或寫個簡單的 sed 腳本同步到所有 `.html`
3. 或者執行 `bash sync-nav.sh`（如果腳本還適用的話）

**長期建議**：考慮引入靜態網站產生器（如 11ty、Hugo），把 nav 抽成 partial。

#### 更新公告
1. 從 Discord 匯出頻道 JSON（頻道 → 右鍵 → 匯出聊天紀錄）
2. 把 JSON 放進 `_import/` 目錄
3. 執行 `python3 _import/parse_announcements.py` 重新解析
4. 執行 `python3 _import/download_images.py` 下載新圖片
5. 提交 `announcements_v2.json` 和 `assets/announcements/`

公告頁面的 JS 會自動讀取 `announcements_v2.json`，不用改前端。

#### 新增頁面
1. 複製任何一個現有 HTML 頁面作為模板
2. 改 `<title>`、`<meta description>`、OG tags
3. 內容放在 `<div class="content-section">` 裡
4. 更新 `sitemap.xml` 加入新頁面
5. 如果需要在導覽列出現，同步改所有頁面的 `<nav>`

#### 改配色
所有顏色都定義在 `style.css` 最開頭的 `:root` CSS 變數：
```css
--sky: #9dafff;      /* 主藍 */
--foam: #a8e6cf;     /* 主綠 */
--sand: #deac80;     /* 暖色 */
--deep: #0d1117;     /* 背景深色 */
--ocean: #161b22;    /* 卡片背景 */
...
```
淺色模式在 `[data-theme="light"]` 裡覆蓋這些變數。改配色只需要動這兩個區塊。

#### 改首頁動畫
打字機邏輯在 `main.js` 的 `initTypewriter()` 函式。動畫 CSS 在 `style.css` 最後面的「打字機增強 + 首頁動畫 v2」區塊。

#### 部署
```bash
git add -A
git commit -m "描述改了什麼"
git push origin main
# GitHub Pages 會自動部署，通常 1~2 分鐘生效
```
快取破壞：改 CSS/JS 的 `?v=` 版本號（如 `style.css?v=260413a`）。

### 容易踩的坑

1. **CSS 全在一行**（120KB 單行）：格式化工具跑一下會比較好讀，但部署前記得壓回去或確認 GitHub Pages 的傳輸大小
2. **導覽列不同步**：最常見的 bug 來源，改 nav 要確認所有頁面
3. **中文檔名**：`首頁.html`、`公告.html` 等用中文命名，在某些環境（Windows cmd、舊版 git）可能出問題
4. **`index.html` 不是首頁**：真正的首頁是 `首頁.html`，`index.html` 只做 JS 跳轉
5. **照片輪播用外部 CDN**：首頁明信片圖片來自巴哈姆特 CDN，失效的話要改成本地
6. **音樂播放器用 YouTube**：播放清單 ID 在 `music-player.js` 裡，影片被下架會靜默失敗
7. **公告圖片是 Discord CDN**：定期要把新圖片下載轉 WebP，否則 CDN 連結會過期
8. **GitHub API 未認證**：部署計數器用 GitHub API，未認證每小時 60 次限制

### 技術債務（有空可以改）

- [ ] 導覽列改用靜態網站產生器或 JS 動態載入
- [ ] CSS 拆分成多檔案（base / components / pages）
- [ ] 照片從 JPG 轉 WebP（目前 photos/ 還是 JPG）
- [ ] 首頁明信片圖片搬回本地（目前用巴哈姆特 CDN）
- [ ] 部署計數器改用靜態值或 build script
- [ ] 加入 CI/CD 自動化（公告匯出、圖片轉換、CSS 壓縮）
- [ ] `style.css` 加入 source map 或拆檔方便除錯

### 聯絡窗口

- Discord 社群：https://discord.gg/HdS2HrJEH7
- 服務信箱：service@seawind.cc
- GitHub 倉庫：https://github.com/mc-seawind-cc/website
