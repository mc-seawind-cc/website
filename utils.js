/* ═══════════════════════════════════════════
   海風 SeaWind — Shared Utilities
   ═══════════════════════════════════════════ */

/**
 * Discord Markdown → HTML 轉換器
 * 支援：blockquote、圖片、連結、粗體、斜體、刪除線、底線、劇透、
 *        行內程式碼、標題、小字、有序/無序列表、嵌套列表
 */
function md2html(text) {
  if (!text) return '';
  let html = text;

  // Block quote（整行 > 開頭）
  html = html.replace(/^(>+)\s*(.*)$/gm, (match, arrows, content) => {
    return content.trim() ? `<blockquote class="ann-quote" data-depth="${arrows.length}">${content}</blockquote>` : '';
  });

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" class="ann-img">');
  // Links — clean up Discord channel links
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/discord\.com\/channels\/\d+\/\d+\/(\d+))\)/g, (m, text, url, msgId) => {
    return `<a href="${url}" target="_blank" rel="noopener">${text || '查看 #' + msgId.slice(-4)}</a>`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Underline (Discord __text__)
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  // Spoiler (Discord ||text||)
  html = html.replace(/\|\|(.+?)\|\|/g, '<span class="ann-spoiler" onclick="this.classList.toggle(\'revealed\')" title="點擊顯示">$1</span>');
  // Inline code
  html = html.replace(/``\s*(.+?)\s*``/g, '<code>$1</code>');
  html = html.replace(/`([^`]+)`/g, (m, code) => '<code>' + code.trim() + '</code>');
  // Headings
  html = html.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');
  // Small text (Discord -# text)
  html = html.replace(/^-#\s+(.+)$/gm, '<small class="ann-small">$1</small>');

  // 分段落處理
  const blocks = html.split(/\n\n+/);
  let result = [];
  blocks.forEach(block => {
    const lines = block.split('\n');
    let parts = [], inList = false, listType = '';
    lines.forEach(line => {
      const t = line.trim();
      if (t.startsWith('<blockquote')) {
        if (inList) { parts.push('</' + listType + '>'); inList = false; }
        parts.push(t);
      }
      else if (/^\s{2,}[•\-\*]\s/.test(t)) {
        if (!inList) { parts.push('<ul>'); inList = true; listType = 'ul'; }
        parts.push('<li class="ann-sub-item">' + t.replace(/^\s*[•\-\*]\s+/, '') + '</li>');
      }
      else if (/^[•\-\*]\s/.test(t)) {
        if (!inList || listType !== 'ul') {
          if (inList) parts.push('</' + listType + '>');
          parts.push('<ul>'); inList = true; listType = 'ul';
        }
        parts.push('<li>' + t.replace(/^[•\-\*]\s+/, '') + '</li>');
      }
      else if (/^\d+\.\s/.test(t)) {
        if (!inList || listType !== 'ol') {
          if (inList) parts.push('</' + listType + '>');
          parts.push('<ol>'); inList = true; listType = 'ol';
        }
        parts.push('<li>' + t.replace(/^\d+\.\s+/, '') + '</li>');
      }
      else if (t.startsWith('<h') || t.startsWith('<small')) {
        if (inList) { parts.push('</' + listType + '>'); inList = false; }
        parts.push(t);
      }
      else if (t) {
        if (inList) { parts.push('</' + listType + '>'); inList = false; }
        parts.push(t);
      }
    });
    if (inList) parts.push('</' + listType + '>');
    if (parts.length) result.push('<p>' + parts.join('<br>') + '</p>');
  });
  return result.join('');
}

/**
 * 公告標籤圖示對應
 */
const ANN_TAGS = {
  '公告': '📢',
  '更新': '🔧',
  '維護': '🛠',
  '活動': '🎉'
};

function getTagIcon(tag) {
  return ANN_TAGS[tag] || '📝';
}

/**
 * 格式化日期
 * ROC "114.01.21" → "2025.01.21"
 * "未知" → 從 timestamp 推算
 */
function formatDate(dateStr, timestamp) {
  if (timestamp) {
    const d = new Date(timestamp);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }
  if (dateStr && dateStr !== '未知') {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parseInt(parts[0]) + 1911}.${parts[1]}.${parts[2]}`;
    }
  }
  return '—';
}

/**
 * 清理 Discord 長連結為友善顯示文字
 */
function cleanDiscordLinks(text) {
  if (!text) return '';
  // 將 bare Discord channel links 轉為友善文字
  return text.replace(
    /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/g,
    (m, guild, channel, msg) => `<a href="${m}" target="_blank" rel="noopener" class="ann-discord-link">查看討論串 →</a>`
  );
}
