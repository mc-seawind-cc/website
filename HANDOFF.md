# 海風網站 AI 交接指南

> 最後更新：2026.05.05
> 複製下方提示詞，貼給新的 AI 助手作為開場訊息。

---

## 提示詞（複製這段）

```
我正在製作網站 www.seawind.cc 且設計活動
網站專案 https://github.com/mc-seawind-cc/website/
活動專案 https://github.com/mc-seawind-cc/events/
插件專案 https://github.com/mc-seawind-cc/plugins
插件的東西或英文名稱不能出現在網站上

你現在是入行好幾十年超專業的網站設計師，而且你對伺服器滿腔熱血，我們也可以說是獨立遊戲製作團隊，小團隊有小團隊的精緻優良，你叫做「海風網站助手」，請你幫我一起修改網站內容，使其更完善兼設計感並且實用美觀
我創建了一個臨時token給你使用，本次使用完畢將會銷毀 [TOKEN]

請先詳細閱讀DESIGN.md文件 以理解網站設計理念或目前狀態
你之後的每次修改我將在 deployments 查看
有任何設計、資訊、注音事項都寫在DESIGN.md 以便交接、供團隊討論、維護或指南
頁尾的修改次數記得每次校正一下
```

---

## 關於海風團隊

- **團隊性質**：高中生組成的 Minecraft 伺服器團隊，非營利
- **團隊規模**：小團隊（12 人公務人員），非營利
- **核心成員**：神焰（服主）+ 白貓（WhiteMeowGX）
- **支援者**：Blue_5125 — 有自己的伺服器「蔚藍幻境」，提供海風主機和免費協助
- **目標**：做出有品質、有特色的伺服器，跟其他伺服器做出區別
- **精神**：類似獨立遊戲製作團隊——小但用心，每個細節都講究
- **網站風格**：海洋 × 夢幻 × Minecraft，深色為底、藍紫色調為輔

---

## AI 助手上手流程

### 第一步：讀取設計文件
用 read 工具讀取 `DESIGN.md`，這是網站的完整設計文件，包含：
- 網站架構與技術棧
- 所有檔案結構與用途
- 已知問題與待辦事項
- 設計風格指南（色彩、字體、間距、動畫）
- 活動子頁面設計指南（第 8 節）
- 頁尾規範（第 7 節，不可修改）
- 完整修改記錄（第 10 節）

### 第二步：了解基本資訊
- 網站：www.seawind.cc（GitHub Pages 靜態託管）
- 倉庫：https://github.com/mc-seawind-cc/website
- 活動倉庫：https://github.com/mc-seawind-cc/events
- 插件倉庫：https://github.com/mc-seawind-cc/plugins
- 技術：純 HTML + CSS + Vanilla JS（無框架）
- 主題：深色模式（預設）+ 淺色模式，data-theme="light" CSS 變數切換
- 字體：Noto Sans TC（Google Fonts），字重 400/500/700/800/900 + Noto Serif TC 700

### 第三步：確認關鍵檔案
```
website/
├── 首頁.html              # 主頁
├── *.html                 # 各子頁面（中文命名）
├── 海風指南/              # 指南子頁面（42 個，中文命名）
├── 活動/                  # 活動詳情頁（珍奶日/端午節/生存起源等）
├── 文化藝廊/              # 文化藝廊子頁面（8 個）
├── style.css              # 主樣式表（~3200 行，分 23 區段）
├── main.js                # 主互動邏輯
├── announcements.json     # 公告資料（500+ 則）
└── DESIGN.md              # 設計文件（最重要的參考）
```

---

## 重要規則

1. **每次修改都要更新 DESIGN.md 的修改記錄（第 10 節）**
2. **CSS 結構：每個區段 dark 樣式在前，[data-theme="light"] 覆蓋在該區段末尾**
3. **Cache busting：修改 CSS/JS 後更新所有 HTML 中的 ?v=日期碼（格式 ?v=DDMMYY字母）**
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，請向使用者索取新 token**
6. **頁尾修改次數 deployCount 透過 GitHub API 自動取得，不用手動改；但日期需手動更新**
7. **頁尾結構不可修改（見 DESIGN.md 第 7 節）**
8. **插件英文名稱不能出現在網站上**（MMOItems、MythicMobs、Residence 等）

---

## Git 操作

```
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
4. **插件名稱禁令**：網站上不能出現任何插件英文名稱
5. **活動倉庫（events）是私有的**：包含插件配置檔，不公開
6. **deployCount 自動取得**：透過 GitHub API，不用手動改
7. **首頁動畫已完成**：不需要再調整首頁的動畫效果
```

---

_此文件為交接指南，請在每次重大修改後更新。_
