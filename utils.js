/* ═══════════════════════════════════════════
   海風 SeaWind — Shared Utilities
   ═══════════════════════════════════════════ */

/**
 * Discord Markdown → HTML 轉換器
 * 支援：blockquote（合併連續引用行）、嵌套列表、圖片、連結、
 *        粗體、斜體、刪除線、底線、劇透、行內程式碼、標題、小字、
 *        Discord 頻道引用、提及、自動連結 bare URL
 */

// ── 內聯格式處理（不含 blockquote）──
function _inlineMd(text) {
  let s = text;
  // 清理轉義符號
  s = s.replace(/\\:/g, ':');
  s = s.replace(/\\\//g, '/');
  // Discord <id:guide> 類引用 → 標籤
  s = s.replace(/<id:([^>]+)>/g, '<span class="ann-id-ref">$1</span>');
  // Discord 角括號連結 <https://...> → 正常連結
  s = s.replace(/<((?:https?:\/\/)[^>]+)>/g, '$1');
  // Links with parentheses — Discord channel links first
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/discord\.com\/channels\/\d+\/\d+\/(\d+))\)/g, (m, t, url) => {
    return `<a href="${url}" target="_blank" rel="noopener">${t || '查看討論串'}</a>`;
  });
  // Angle-bracket links: [text](<url>)
  s = s.replace(/\[([^\]]+)\]\(<((?:https?:\/\/)[^>]+)>\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Normal links
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Auto-link bare URLs (skip if already inside an <a> tag or href attribute)
  s = s.replace(/(https?:\/\/[^\s<>"')]+)(?![^<]*<\/a>)(?![^<]*>)/g, (match) => {
    // Don't replace if preceded by href=
    if (/(?:href=)["']?$/.test(s.substring(0, s.indexOf(match)))) return match;
    return '<a href="' + match + '" target="_blank" rel="noopener">' + match + '</a>';
  });
  // Images
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" class="ann-img">');
  // Bold
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  // Strikethrough
  s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Underline (Discord __text__)
  s = s.replace(/__(.+?)__/g, '<u>$1</u>');
  // Spoiler (Discord ||text||)
  s = s.replace(/\|\|(.+?)\|\|/g, '<span class="ann-spoiler" onclick="this.classList.toggle(\'revealed\')" title="點擊顯示">$1</span>');
  // Inline code (double backtick first, then single)
  s = s.replace(/``\s*(.+?)\s*``/g, '<code>$1</code>');
  s = s.replace(/`([^`]+)`/g, (m, code) => '<code>' + code.trim() + '</code>');
  // Discord channel references #▏頻道名．x▕
  s = s.replace(/#([▏▎▍▌▋▊]?)([^\s#▏▎▍▌▋▊▊]+[．・.][^\s]*)(▕)?/g,
    '<span class="ann-ch-ref">#$1$2$3</span>');
  // Discord @mentions
  s = s.replace(/@([\w\u4e00-\u9fff.]+)/g, '<span class="ann-mention">@$1</span>');
  return s;
}

// ── 將列表項目轉為 HTML（遞迴處理嵌套）──
function _parseListLines(lines, startIdx) {
  let html = '';
  let i = startIdx;
  let listType = null; // 'ul' or 'ol'
  let listOpened = false;

  function closeList() {
    if (listOpened && listType) {
      html += '</' + listType + '>';
      listOpened = false;
      listType = null;
    }
  }

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    const indent = raw.length - raw.trimStart().length;

    // Blank line → end of list block
    if (!t) { closeList(); i++; break; }

    // Sub-list item (indented 2+ spaces)
    if (indent >= 2 && (/^[•\-\*]\s/.test(t) || /^\d+\.\s/.test(t) || /^\*\s/.test(t))) {
      // Sub-items get .ann-sub-item class
      const isSubUL = /^[•\-\*]\s/.test(t) || /^\*\s/.test(t);
      const content = t.replace(/^[•\-\*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (!listOpened) {
        listType = isSubUL ? 'ul' : 'ol';
        html += '<' + listType + '>';
        listOpened = true;
      }
      html += '<li class="ann-sub-item">' + _inlineMd(content) + '</li>';
      i++;
      continue;
    }

    // Top-level unordered
    if (/^[•\-\*]\s/.test(t)) {
      if (listOpened && listType !== 'ul') closeList();
      if (!listOpened) { html += '<ul>'; listOpened = true; listType = 'ul'; }
      html += '<li>' + _inlineMd(t.replace(/^[•\-\*]\s+/, '')) + '</li>';
      i++;
      continue;
    }

    // Top-level ordered
    if (/^\d+\.\s/.test(t)) {
      if (listOpened && listType !== 'ol') closeList();
      if (!listOpened) { html += '<ol>'; listOpened = true; listType = 'ol'; }
      html += '<li>' + _inlineMd(t.replace(/^\d+\.\s+/, '')) + '</li>';
      i++;
      continue;
    }

    // Not a list item → close and break
    closeList();
    break;
  }
  closeList();
  return { html, nextIdx: i };
}

// ── 將連續 blockquote 內容轉為一個 <blockquote> ──
function _parseBlockquoteLines(lines, startIdx) {
  const bqLines = [];
  let i = startIdx;
  let depth = 1;

  while (i < lines.length) {
    const m = lines[i].match(/^(>+)\s*(.*)$/);
    if (!m) break;
    depth = m[1].length;
    // Strip leading > and one space, keep internal content
    const content = m[2];
    if (content.trim()) {
      bqLines.push(content);
    } else {
      bqLines.push(''); // blank line inside blockquote
    }
    i++;
  }

  // Process the blockquote content: parse lists inside
  let inner = '';
  let j = 0;
  while (j < bqLines.length) {
    const line = bqLines[j];
    const t = line.trim();

    if (!t) { j++; continue; }

    // Headings inside blockquote
    if (/^###\s/.test(t)) { inner += '<h4>' + _inlineMd(t.replace(/^###\s+/, '')) + '</h4>'; j++; continue; }
    if (/^##\s/.test(t)) { inner += '<h3>' + _inlineMd(t.replace(/^##\s+/, '')) + '</h3>'; j++; continue; }
    if (/^#\s/.test(t)) { inner += '<h2>' + _inlineMd(t.replace(/^#\s+/, '')) + '</h2>'; j++; continue; }
    if (/^-#\s/.test(t)) { inner += '<small class="ann-small">' + _inlineMd(t.replace(/^-#\s+/, '')) + '</small>'; j++; continue; }

    // List items
    if (/^[•\-\*]\s/.test(t) || /^\d+\.\s/.test(t) || /^\*\s/.test(t)) {
      const listResult = _parseListLines(bqLines.map(l => l), j);
      inner += listResult.html;
      j = listResult.nextIdx;
      continue;
    }

    // Plain text
    inner += '<p>' + _inlineMd(t) + '</p>';
    j++;
  }

  return {
    html: '<blockquote class="ann-quote" data-depth="' + depth + '">' + inner + '</blockquote>',
    nextIdx: i
  };
}

// ── 主轉換函式 ──
function md2html(text) {
  if (!text) return '';
  let html = text;

  // Headings (before block processing)
  html = html.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^-#\s+(.+)$/gm, '<small class="ann-small">$1</small>');

  // Split by blank lines into blocks
  const blocks = html.split(/\n\n+/);
  let result = [];

  blocks.forEach(block => {
    const lines = block.split('\n');

    // Check if block starts with blockquote
    if (/^>/.test(lines[0].trim())) {
      const bq = _parseBlockquoteLines(lines, 0);
      result.push(bq.html);
      return;
    }

    // Check if block starts with heading
    if (/^<[hH]/.test(lines[0].trim()) || /^<small/.test(lines[0].trim())) {
      let parts = [];
      let listLines = [];
      lines.forEach(line => {
        const t = line.trim();
        if (/^<[hH]/.test(t) || /^<small/.test(t)) {
          if (listLines.length) {
            const lr = _parseListLines(listLines, 0);
            if (lr.html) parts.push(lr.html);
            listLines = [];
          }
          parts.push(t);
        } else if (t) {
          listLines.push(line);
        }
      });
      if (listLines.length) {
        const lr = _parseListLines(listLines, 0);
        if (lr.html) parts.push(lr.html);
      }
      result.push(parts.join(''));
      return;
    }

    // Check if block is a list
    const firstNonEmpty = lines.find(l => l.trim());
    if (firstNonEmpty && (/^[•\-\*]\s/.test(firstNonEmpty.trim()) || /^\d+\.\s/.test(firstNonEmpty.trim()) || /^\*\s/.test(firstNonEmpty.trim()))) {
      const lr = _parseListLines(lines, 0);
      if (lr.html) result.push(lr.html);
      // Any remaining lines after list
      if (lr.nextIdx < lines.length) {
        const remaining = lines.slice(lr.nextIdx).filter(l => l.trim());
        if (remaining.length) {
          result.push('<p>' + remaining.map(l => _inlineMd(l.trim())).join('<br>') + '</p>');
        }
      }
      return;
    }

    // Plain text block
    const textLines = lines.filter(l => l.trim());
    if (textLines.length) {
      result.push('<p>' + textLines.map(l => _inlineMd(l.trim())).join('<br>') + '</p>');
    }
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
