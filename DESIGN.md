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
