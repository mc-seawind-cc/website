#!/bin/bash
# 海風網站 — 指南側邊欄同步腳本
# 用法: bash sync-guide-sidebar.sh
# 功能: 同步所有 guide/*.html 的側邊欄為最新分類

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

SIDEBAR_CONTENT='      <!-- 側邊導覽 -->
      <aside class="guide-sidebar">
        <div class="guide-sidebar-inner">
          <div class="guide-sidebar-title">📖 海風指南</div>
          <nav class="guide-sidebar-nav">

            <div class="guide-sb-group">
              <a href="入門.html" class="guide-sb-link guide-sb-root">🚀 新手指引</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">💰 經濟與交易</span>
              <a href="經濟.html" class="guide-sb-link">經濟系統</a>
              <a href="線上商店.html" class="guide-sb-link">線上商城</a>
              <a href="雜貨商店.html" class="guide-sb-link">雜貨店</a>
              <a href="箱子商店.html" class="guide-sb-link">箱子商店</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">🛡️ 領地與保護</span>
              <a href="領地.html" class="guide-sb-link">領地系統</a>
              <a href="日誌.html" class="guide-sb-link">互動記錄</a>
              <a href="地圖標記.html" class="guide-sb-link">地圖署名</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">🚀 傳送系統</span>
              <a href="私人傳送.html" class="guide-sb-link">個人傳送點</a>
              <a href="公共傳送.html" class="guide-sb-link">公開傳送點</a>
              <a href="電梯.html" class="guide-sb-link">電梯</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">🎒 背包與倉庫</span>
              <a href="倉庫.html" class="guide-sb-link">倉庫系統</a>
              <a href="展示櫃.html" class="guide-sb-link">玻璃展示櫃</a>
              <a href="盔甲架.html" class="guide-sb-link">盔甲座編輯器</a>
              <a href="會員界伏盒.html" class="guide-sb-link">快捷界伏盒</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">📋 任務與成長</span>
              <a href="任務.html" class="guide-sb-link">任務系統</a>
              <a href="簽到.html" class="guide-sb-link">簽到系統</a>
              <a href="稱號.html" class="guide-sb-link">稱號系統</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">💬 社群互動</span>
              <a href="信箱.html" class="guide-sb-link">蜂聊郵政</a>
              <a href="旁觀.html" class="guide-sb-link">靈魂出竅</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">🏛️ 大廳區域</span>
              <a href="大廳區域.html" class="guide-sb-link">大廳簡介</a>
              <a href="大廳建築工坊.html" class="guide-sb-link">建材小舖</a>
              <a href="大廳雪球場.html" class="guide-sb-link">雪隱匠作</a>
              <a href="大廳茶館.html" class="guide-sb-link">風語茶屋</a>
              <a href="大廳銀行.html" class="guide-sb-link">銀行</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">⚙️ 遊戲機制</span>
              <a href="遊戲機制.html" class="guide-sb-link">機制總覽</a>
              <a href="連鎖挖礦.html" class="guide-sb-link">連鎖挖掘</a>
              <a href="機制礦物.html" class="guide-sb-link">礦物代換</a>
              <a href="機制再生.html" class="guide-sb-link">資源再生</a>
              <a href="合成.html" class="guide-sb-link">特殊合成</a>
              <a href="機制混凝土.html" class="guide-sb-link">混凝土固化鍋</a>
              <a href="機制書架.html" class="guide-sb-link">真實書櫃</a>
              <a href="機制蜂巢.html" class="guide-sb-link">蜂窩檢視</a>
              <a href="機制門.html" class="guide-sb-link">敲門與雙開</a>
              <a href="機制開箱.html" class="guide-sb-link">穿牌開箱</a>
              <a href="機制地震.html" class="guide-sb-link">地震預警</a>
              <a href="快速動作.html" class="guide-sb-link">更多動作</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">⚙️ 伺服器設定</span>
              <a href="選單.html" class="guide-sb-link">伺服器選單</a>
              <a href="綁定.html" class="guide-sb-link">綁定帳號</a>
              <a href="地圖.html" class="guide-sb-link">線上地圖</a>
            </div>

            <div class="guide-sb-group">
              <span class="guide-sb-heading">⭐ 會員專屬</span>
              <a href="會員隱藏裝備.html" class="guide-sb-link">隱藏裝備</a>
            </div>

          </nav>
        </div>
      </aside>'

COUNT=0

find "$SCRIPT_DIR/guide" -name "*.html" | while read -r FILE; do
  perl -0777 -i -pe "s|<!-- 側邊導覽 -->.*?</aside>|$SIDEBAR_CONTENT|gs" "$FILE"
  COUNT=$((COUNT + 1))
  echo "✅ 已更新: $(basename "$FILE")"
done

echo ""
echo "🎉 指南側邊欄同步完成！"
