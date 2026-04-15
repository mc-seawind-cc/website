# 海風網站 AI 交接指南

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
- 公告格式轉換規則
- 完整修改記錄

## 第二步：了解基本資訊
- 網站：www.seawind.cc（GitHub Pages 靜態託管）
- 倉庫：https://github.com/mc-seawind-cc/website
- 技術：純 HTML + CSS + Vanilla JS（無框架）
- 主題：深色模式（預設）+ 淺色模式，CSS 變數切換
- 字體：Noto Sans TC（Google Fonts）

## 第三步：確認關鍵檔案
- `首頁.html` — 主頁面
- `style.css` — 唯一樣式表（約 2600 行，分 23 區段）
- `main.js` — 主互動邏輯
- `404.html` — 錯誤頁面（含海洋動畫、淨灘遊戲、MCTI 測驗、11 款小遊戲）
- `DESIGN.md` — 設計文件（你的重要參考）
- `template/nav.html` — 導航模板
- `announcements.json` — 公告資料（505 則）

## 重要規則
1. **每次修改都要更新 DESIGN.md 的修改記錄**
2. **CSS 結構：每個區段 dark 樣式在前，[data-theme="light"] 覆蓋在該區段末尾**
3. **Cache busting：修改 CSS/JS 後更新 HTML 中的 ?v=日期碼**
4. **不要刪除非你建立的檔案**
5. **GitHub token 使用後會被撤銷，請向使用者索取新 token**
6. **頁尾的修改次數 deployCount 透過 GitHub API 自動取得，不用手動改**

## 當前待辦（來自 DESIGN.md）
- 圖片優化：首頁 Hero 已改用 WebP ✅
- CSS 有大量 [data-theme="light"] 重複選擇器可清理
- 公告資料可考慮 inline 到 HTML（減少 API 請求）
- 404.html 體積偏大（可將動畫 CSS/JS 外部化）
- 無障礙：Lightbox 缺少 aria-live、圖片 alt 可更描述性
```

---

## 進階：如果你想讓 AI 直接能修改倉庫

在上面的提示詞後面加上：

```
## Git 操作
倉庫已經 clone 到 /root/.openclaw/workspace/seawind-cc
GitHub token: [在此貼上你的 token]
設定方式：
cd /root/.openclaw/workspace/seawind-cc
git remote set-url origin https://[TOKEN]@github.com/mc-seawind-cc/website.git

每次修改後：
git add -A && git commit -m "描述" && git push origin main
```
