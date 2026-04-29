# 海風網站 AI 交接指南

> 最後更新：2026.04.29
> 複製下方提示詞，貼給新的 AI 助手作為開場訊息。

---

## 提示詞（複製這段）

```
你正在接手維護一個 Minecraft 伺服器官方網站，請先完成以下步驟：

## 第一步：讀取設計文件
用 read 工具讀取 `DESIGN.md`，這是網站的完整設計文件，包含：
- 網站架構與技術棧
- 所有檔案結構與用途
- 已知問題與待辦事項
- 設計風格指南（色彩、字體、間距、動畫）
- 活動子頁面設計指南（第 8 節）
- 頁尾規範（第 7 節，不可修改）
- 完整修改記錄（第 10 節）

## 第二步：了解基本資訊
- 網站：www.seawind.cc（GitHub Pages 靜態託管）
- 倉庫：https://github.com/mc-seawind-cc/website
- 活動倉庫：https://github.com/mc-seawind-cc/events
- 插件倉庫：https://github.com/mc-seawind-cc/plugins
- 技術：純 HTML + CSS + Vanilla JS（無框架）
- 主題：深色模式（預設）+ 淺色模式，data-theme="light" CSS 變數切換
- 字體：Noto Sans TC（Google Fonts），字重 400/500/700/800/900 + Noto Serif TC 700

## 第三步：確認關鍵檔案
- `首頁.html` — 主頁面
- `style.css` — 唯一樣式表（~3200 行，分 23 區段）
- `main.js` — 主互動邏輯
- `404.html` — 錯誤頁面（含海洋動畫、淨灘遊戲、11 款小遊戲）
- `DESIGN.md` — 設計文件（你的重要參考）
- `announcements.json` — 公告資料（500+ 則）

## 第四步：了解網站結構
```
website/
├── 首頁.html              # 主頁
├── *.html                 # 各子頁面（中文命名）
├── 海風指南/              # 指南子頁面（42 個，中文命名）
│   ├── 新手指引.html
│   ├── 領地系統.html
│   └── ...
├── 活動/                  # 活動詳情頁
│   ├── 珍奶日.html
│   ├── 端午節.html
│   └── ...
├── 文化藝廊/              # 文化藝廊子頁面（8 個）
├── style.css              # 主樣式表
├── main.js                # 主互動邏輯
├── utils.js / tips.js / music-player.js
├── assets/img/            # 圖片資源
└── DESIGN.md              # 設計文件
```

## 重要規則
1. **每次修改都要更新 DESIGN.md 的修改記錄（第 10 節）**
2. **CSS 結構：每個區段 dark 樣式在前，[data-theme="light"] 覆蓋在該區段末尾**
3. **Cache busting：修改 CSS/JS 後更新所有 HTML 中的 ?v=日期碼（格式 ?v=DDMMYY字母）**
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，請向使用者索取新 token**
6. **頁尾修改次數 deployCount 透過 GitHub API 自動取得，不用手動改；但日期需手動更新**
7. **頁尾結構不可修改（見 DESIGN.md 第 7 節）**
8. **插件英文名稱不能出現在網站上**（見 DESIGN.md 注意事項）

## 當前待辦（來自 DESIGN.md 第 9/12 節）
- [ ] 404.html 體積優化（將內聯 CSS/JS 外部化）
- [ ] CSS light mode 選擇器合併（307 個 [data-theme="light"] 可整理）
- [ ] 圖片 alt 文字持續優化
- [ ] PWA manifest 更新（檢查 icons 路徑與尺寸）
- [ ] 列印樣式（@media print）為主要內容頁添加
- [ ] 國際化準備（目前全站繁體中文）

## Git 操作
倉庫已經 clone 到 /root/.openclaw/workspace/seawind-website
GitHub token: [請向使用者索取]
設定方式：
cd /root/.openclaw/workspace/seawind-website
git remote set-url origin https://[TOKEN]@github.com/mc-seawind-cc/website.git

每次修改後：
git add -A && git commit -m "描述" && git push origin main
```

---

## ⚠️ 注意事項

1. **token 會過期**：每次對話開始時需要向使用者索取新的 GitHub token
2. **DESIGN.md 是最重要的文件**：所有設計決策、規範、修改記錄都在裡面
3. **不要動頁尾**：Footer 結構固定，只能更新日期
4. **插件名稱禁令**：MMOItems、MythicMobs、Residence 等英文名稱不能出現在網站上
5. **活動倉庫（events）是私有的**：包含插件配置檔，不公開
6. **deployCount 自動取得**：透過 GitHub API，不用手動改

---

## 📋 今日工作摘要（2026.04.29）

本次對話完成的修改：

1. **團隊頁頭像改 2D**：mc-heads.net /head/ → /face/（11 個）
2. **團隊頁 peng1234 暱稱**：改為「路人丙」
3. **特色卡片 icon hover 動畫重構**：分層平滑過渡，消除跳幀
4. **移除風景照投稿提示卡片**：刪除 photo-hint 區塊 + CSS
5. **修復 Lightbox 圖片上方裁切**：max-height 改 calc(90vh - 48px)
6. **新手指引大幅擴充**：新增連線資訊/出生點/必備指令/領地保護/經濟入門/FAQ
7. **指南路徑重構**：guide/ → 海風指南/，42 個檔案改名+全站連結更新
8. **掃描插件名稱殘留**：HTML 頁面零殘留，announcements.json 僅 #0079 有（不可見）

---

_此文件為交接指南，請在每次重大修改後更新「今日工作摘要」部分。_
