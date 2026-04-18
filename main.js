/* ═══════════════════════════════════════════
   海風 Seabreeze — Main Scripts
   ═══════════════════════════════════════════ */

// 自動偵測子目錄深度，產生正確的 base path
const SW_BASE = (() => {
  const path = location.pathname;
  if (path.includes('/guide/') || path.includes('/lore/')) return '../';
  return '';
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Critical: Theme Toggle (first paint) ---
  const themeBtn = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('seabreeze-theme') || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);
  // Update theme-color meta for mobile browser chrome
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const updateThemeColor = (theme) => {
    if (themeColorMeta) themeColorMeta.content = theme === 'dark' ? '#0d1117' : '#f6f8fa';
  };
  updateThemeColor(savedTheme);
  const moonSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const sunSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  if (themeBtn) {
    themeBtn.innerHTML = savedTheme === 'dark' ? moonSVG : sunSVG;
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('seabreeze-theme', next);
      themeBtn.innerHTML = next === 'dark' ? moonSVG : sunSVG;
      updateThemeColor(next);
    });
  }

  // --- Critical: Mobile Nav Toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // --- Critical: Dropdown Toggle (mobile) ---
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = btn.closest('.nav-dropdown');
        const isOpen = dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      }
    });
  });

  // --- Critical: Scroll Reveal (只觸發一次，不反覆隱藏) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.fade-in, .slide-up, .zoom-in, .slide-left, .slide-right, .reveal-up').forEach(el => revealObserver.observe(el));



  // Safety: reveal all remaining hidden elements after 3s
  setTimeout(() => {
    document.querySelectorAll('.fade-in:not(.visible), .slide-up:not(.visible), .zoom-in:not(.visible), .slide-left:not(.visible), .slide-right:not(.visible), .reveal-up:not(.visible)').forEach(el => el.classList.add('visible'));

  }, 3000);

  // --- Critical: Nav Scroll Shadow + Scroll Progress ---
  const nav = document.querySelector('.nav');
  const scrollProgress = document.getElementById('scrollProgress');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
      if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
      }
    }, { passive: true });
  }

  // --- Deferred: Non-critical features ---
  const deferredInit = () => {
    // Load music player immediately
    const musicJs = document.createElement('script');
    musicJs.src = SW_BASE + 'music-player.js';
    document.body.appendChild(musicJs);

    createParticles();
    createHeroParticles();

    // Active Nav Link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    // Hero click-to-reveal
    initHeroReveal();
    initBulletinBoard();
    initScrollTypewriters();

    // Hero Scroll Down
    const scrollBtn = document.querySelector('.hero-scroll');
    if (scrollBtn) {
      scrollBtn.style.cursor = 'pointer';
      scrollBtn.addEventListener('click', () => {
        const target = document.getElementById('about') || document.querySelector('.content-section');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }

    initBackToTop();

    // Mobile Nav: close on outside click
    document.addEventListener('click', (e) => {
      const navEl = document.querySelector('.nav');
      if (links && links.classList.contains('open') && !navEl.contains(e.target)) {
        links.classList.remove('open');
        toggle.classList.remove('active');
      }
    });

    initPhotoGallery();
    initPostcardLightbox();
    initGeneralLightbox();
    initGuideSidebar();
    initScrollRestore();
  };

  // Standalone rain toggle button (only on 首頁, left of music player)
  const isHome = location.pathname.endsWith('首頁.html') || location.pathname.endsWith('/') || location.pathname === '';
  if (isHome) {
    const rainBtn = document.createElement('button');
    rainBtn.id = 'rainToggle';
    rainBtn.className = 'rain-toggle active';
    rainBtn.title = '風聲';
    rainBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>';
    document.body.appendChild(rainBtn);
    rainBtn.addEventListener('click', () => {
      if (!window._rainGain || !window._rainCtx) return;
      if (window._rainOn) {
        window._rainGain.gain.linearRampToValueAtTime(0, window._rainCtx.currentTime + 1);
        window._rainOn = false;
        rainBtn.classList.remove('active');
      } else {
        window._rainGain.gain.linearRampToValueAtTime(0.15, window._rainCtx.currentTime + 1);
        window._rainOn = true;
        rainBtn.classList.add('active');
      }
    });
  }

  // Use requestIdleCallback if available, otherwise setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(deferredInit, { timeout: 2000 });
  } else {
    setTimeout(deferredInit, 100);
  }
});

// --- Scroll-triggered Typewriter for .typewriter elements ---
function initScrollTypewriters() {
  const els = document.querySelectorAll('.typewriter[data-text]');
  if (!els.length) return;

  // MC-style tick sound (reuse from hero typewriter if available)
  const tickSounds = ['assets/sounds/tick1.mp3', 'assets/sounds/tick2.mp3', 'assets/sounds/tick3.mp3'];
  const tickAudio = tickSounds.map(src => {
    const a = new Audio(src);
    a.volume = 0.5;
    a.preload = 'auto';
    return a;
  });
  let tickIdx = 0;
  function playTick() {
    try {
      const a = tickAudio[tickIdx % tickAudio.length];
      a.currentTime = 0;
      a.play().catch(() => {});
      tickIdx++;
    } catch(e) {}
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.typed) return;
        el.dataset.typed = '1';
        const text = el.dataset.text;
        el.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'tw-cursor';
        cursor.textContent = '_';
        el.appendChild(cursor);

        let i = 0;
        function type() {
          if (i < text.length) {
            el.insertBefore(document.createTextNode(text[i]), cursor);
            playTick();
            i++;
            setTimeout(type, 100 + Math.random() * 60);
          } else {
            // Fade out cursor after done
            setTimeout(() => {
              cursor.style.opacity = '0';
              cursor.style.transition = 'opacity 0.5s';
            }, 1500);
          }
        }
        setTimeout(type, 300);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

// --- Hero Auto-Reveal (直接顯示，無需點擊) ---
function initHeroReveal() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  // 直接展開，保留動畫效果
  heroContent.classList.remove('hero-collapsed');

  // 啟動打字機效果、伺服器狀態和提示
  setTimeout(() => initTypewriter(), 200);
  fetchServerStatus();
  initTips();
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到頂部');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Scroll Position Restore (sessionStorage) ---
function initScrollRestore() {
  const pageKey = 'sw-scroll-' + location.pathname.split('/').pop();
  // Restore scroll position on load
  try {
    const saved = sessionStorage.getItem(pageKey);
    if (saved) {
      const y = parseInt(saved, 10);
      if (y > 100) { // Only restore if scrolled down meaningfully
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
    }
  } catch(e) {}

  // Save scroll position on scroll (debounced)
  let saveTimer = null;
  window.addEventListener('scroll', () => {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      try {
        if (window.scrollY > 100) {
          sessionStorage.setItem(pageKey, window.scrollY);
        } else {
          sessionStorage.removeItem(pageKey);
        }
      } catch(e) {}
    }, 300);
  }, { passive: true });
}

function createParticles() {
  const container = document.querySelector('.bg-atmosphere');
  if (!container) return;
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 8 : Math.min(20, Math.floor(window.innerWidth / 80));
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = (1 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;
    const colors = ['var(--sky)', 'var(--foam)', 'var(--shell)'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}

function createHeroParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 40 : 100;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'snowflake';
    p.style.left = Math.random() * 100 + '%';
    const size = 2 + Math.random() * 5;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = (3 + Math.random() * 5) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.opacity = 0.3 + Math.random() * 0.5;
    container.appendChild(p);
  }

  // Rain ambient sound (Web Audio API)
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();

    // Expose for rain toggle
    window._rainCtx = audioCtx;
    window._rainGain = gain;
    window._rainOn = true;

    // Auto-start rain on first user interaction (browser autoplay policy)
    const startRain = () => {
      audioCtx.resume();
      gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 2);
    };
    document.addEventListener('click', startRain, { once: true });
    document.addEventListener('keydown', startRain, { once: true });
    document.addEventListener('touchstart', startRain, { once: true });
    // Also try starting after short delay
    setTimeout(startRain, 500);
  } catch(e) {}
}

// --- Hero Typewriter (staged with thinking dots) ---
function initTypewriter() {
  const el = document.getElementById('heroSubtitle');
  if (!el) return;
  if (el.dataset.typed) return;
  el.dataset.typed = '1';

  // MC-style tick sound
  const tickSounds = ['assets/sounds/tick1.mp3', 'assets/sounds/tick2.mp3', 'assets/sounds/tick3.mp3'];
  const tickAudio = tickSounds.map(src => {
    const a = new Audio(src);
    a.volume = 0.8;
    a.preload = 'auto';
    return a;
  });
  let tickIdx = 0;
  function playTick() {
    try {
      const a = tickAudio[tickIdx % tickAudio.length];
      a.currentTime = 0;
      a.play().catch(() => {});
      tickIdx++;
    } catch(e) {}
  }

  el.textContent = '';

  // Loading dots
  const dotsSpan = document.createElement('span');
  dotsSpan.className = 'loading-dots';
  dotsSpan.textContent = '...';
  el.appendChild(dotsSpan);

  // Cursor (hidden during dots)
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '_';
  cursor.style.opacity = '0';
  el.appendChild(cursor);

  // Part 1 text node
  const part1Text = document.createTextNode('');
  el.insertBefore(part1Text, cursor);

  // Part 2 text node
  const part2Span = document.createElement('span');
  part2Span.className = 'typewriter-part2';
  el.insertBefore(part2Span, cursor);
  const part2Text = document.createTextNode('');
  part2Span.appendChild(part2Text);

  const PART1 = '在風與海之間，';
  const PART2 = '有一個可以長久生存的地方';
  const SPEED = 120;
  const PAUSE_MS = 1200;
  const DOTS_MS = 1200; // 「...」顯示時間

  function typeChars(textNode, text, idx, cb) {
    if (idx < text.length) {
      textNode.textContent += text[idx];
      playTick();
      const delay = SPEED + Math.random() * 30;
      const extra = (text[idx] === '，' || text[idx] === '。' || text[idx] === '、') ? 120 : 0;
      setTimeout(() => typeChars(textNode, text, idx + 1, cb), delay + extra);
    } else {
      cb();
    }
  }

  // 1. 先顯示「...」
  // 2. 淡出 dots，顯示游標
  // 3. 開始打字
  setTimeout(() => {
    dotsSpan.style.opacity = '0';
    dotsSpan.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      dotsSpan.remove();
      cursor.style.opacity = '';
      typeChars(part1Text, PART1, 0, () => {
        cursor.classList.add('cursor-pause');
        setTimeout(() => {
          cursor.classList.remove('cursor-pause');
          typeChars(part2Text, PART2, 0, () => {
            setTimeout(() => {
              cursor.style.opacity = '0';
              cursor.style.transition = 'opacity 0.8s';
            }, 2000);
          });
        }, PAUSE_MS);
      });
    }, 400);
  }, DOTS_MS);
}

// --- Copy Server IP ---
function copyServerIP() {
  const ip = 'seawind.cc';
  const showHint = () => {
    const hint = document.getElementById('copyHint');
    if (hint) { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 1500); }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ip).then(showHint).catch(() => fallbackCopy(ip, showHint));
  } else {
    fallbackCopy(ip, showHint);
  }
}
function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  cb();
}

// --- Real Server Status ---
function fetchServerStatus() {
  const statusEl = document.getElementById('serverStatus');
  if (!statusEl) return;
  statusEl.classList.add('status-loading');
  fetch('https://api.mcsrvstat.us/3/seawind.cc')
    .then(res => res.json())
    .then(data => {
      statusEl.classList.remove('status-loading');
      // Update hero status
      if (data.online) {
        const players = data.players ? data.players.online : 0;
        const max = data.players ? data.players.max : 0;
        statusEl.textContent = `${players} / ${max} 在線`;
        statusEl.className = 'info-value status-online';
      } else {
        statusEl.textContent = '維護中';
        statusEl.className = 'info-value status-offline';
      }
      // Update footer status
      const footerStatusDot = document.getElementById('footerStatusDot');
      const footerStatus = document.getElementById('footerStatus');
      if (data.online) {
        const players = data.players ? data.players.online : 0;
        const max = data.players ? data.players.max : 0;
        if (footerStatus) footerStatus.textContent = `${players}/${max} 在線`;
        if (footerStatusDot) { footerStatusDot.className = 'status-dot online'; }
      } else {
        if (footerStatus) footerStatus.textContent = '維護中';
        if (footerStatusDot) { footerStatusDot.className = 'status-dot offline'; }
      }
    })
    .catch(() => {
      statusEl.classList.remove('status-loading');
      statusEl.textContent = '暫時無法查詢';
      statusEl.className = 'info-value';
      statusEl.style.cursor = 'pointer';
      statusEl.title = '點擊重新查詢';
      statusEl.addEventListener('click', () => {
        statusEl.textContent = '查詢中...';
        statusEl.className = 'info-value status-loading';
        statusEl.style.cursor = '';
        fetchServerStatus();
      }, { once: true });
      const footerStatusDot = document.getElementById('footerStatusDot');
      const footerStatus = document.getElementById('footerStatus');
      if (footerStatus) footerStatus.textContent = '暫時無法查詢';
      if (footerStatusDot) { footerStatusDot.className = 'status-dot'; }
    });
}

// --- Bulletin Board (首頁公告欄) ---
function initBulletinBoard() {
  const board = document.getElementById('bulletinBoard');
  if (!board) return;

  // 優先使用 inline 資料（首頁預載前 12 則，減少首次載入延遲）
  const inlineEl = document.getElementById('inlineAnnouncements');
  if (inlineEl) {
    try {
      const data = JSON.parse(inlineEl.textContent);
      renderBulletin(board, data.announcements);
      return;
    } catch(e) { /* fallback to fetch */ }
  }

  fetch(SW_BASE + 'announcements.json')
    .then(r => { if (!r.ok) throw new Error('load fail'); return r.json(); })
    .then(data => { renderBulletin(board, data.announcements); })
    .catch(() => {
      board.innerHTML = `<p style="text-align:center;color:var(--fog);padding:20px;">公告載入失敗<button onclick="initBulletinBoard()" style="display:block;margin:12px auto 0;padding:6px 16px;background:rgba(157,175,255,0.15);border:1px solid rgba(157,175,255,0.3);border-radius:100px;color:var(--sky);font-family:inherit;font-size:0.82rem;cursor:pointer;">重新載入</button></p>`;
    });
}

function renderBulletin(board, items) {
  const VISIBLE = 7;
  const MAX = 12;
  const showItems = items.slice(0, MAX);
  const tagColors = { '公告': '#578aff', '更新': '#64dcb4', '維護': '#ff8282', '活動': '#ffaa32' };

  let html = '';

  // 標題列
  html += `<div class="bulletin-header">
    <div class="bh-left">
      <h3 class="bh-title">最新公告</h3>
      <span class="bh-count">${items.length} 則</span>
    </div>
    <a href="公告.html" class="bh-all">查看全部 →</a>
  </div>`;

  // 下拉式公告列表（合併時不顯示內文預覽，只顯示日期、標題、標籤）
  html += '<div class="bulletin-list">';

  showItems.forEach((item, idx) => {
    const tag = item.tag || '更新';
    const date = formatDateV2(item.isoDate);
    const color = tagColors[tag] || '#578aff';
    const isHidden = idx >= VISIBLE;

    // 內容（Markdown → HTML）
    const contentHtml = md2html(item.content);

    // 圖片
    const imgs = (item.localImages && item.localImages.length) ? item.localImages : (item.images || []);
    let imagesHtml = '';
    if (imgs.length) {
      imagesHtml = '<div class="b-images">' +
        imgs.slice(0, 4).map(s => `<img src="${s}" alt="" class="b-img" loading="lazy" onerror="this.style.display='none'">`).join('') +
        '</div>';
    }

    // Discord 連結
    let discordHtml = '';
    if (item.discordId) {
      discordHtml = `<a href="https://discord.com/channels/1090959090878140447/1090959091750559816/${item.discordId}" target="_blank" rel="noopener" class="b-discord-link">在 Discord 查看 →</a>`;
    }

    // NEW 徽章：最近 3 則公告（且非置頂）
    const isNew = idx < 3 && !item.pinned;

    html += `<div class="bulletin-item${isHidden ? ' bulletin-hidden' : ''}${item.pinned ? ' pinned' : ''}" style="--tag-color:${color}" data-tag="${tag}">
      <button class="bulletin-toggle" aria-expanded="false">
        <span class="b-dot" style="background:${color}"></span>
        <span class="b-date">${date}</span>
        <span class="b-title">${item.title}</span>
        <span class="b-right">
          ${isNew ? '<span class="b-new">NEW</span>' : ''}
          ${item.pinned ? '<span class="b-pin">📌</span>' : ''}
          <span class="b-tag" style="background:${color}15;color:${color}">${tag}</span>
          <span class="b-arrow">▾</span>
        </span>
      </button>
      <div class="bulletin-body">
        <div class="b-content">
          ${item.id ? `<div class="b-meta"><span class="b-meta-id">${item.id}</span><span class="b-meta-time">${date}</span></div>` : ''}
          <div class="b-text">${contentHtml}</div>
          ${imagesHtml}
          ${discordHtml}
        </div>
      </div>
    </div>`;
  });

  html += '</div>';

  // 展開提示
  if (showItems.length > VISIBLE) {
    html += `<div class="bulletin-more" id="bulletinMore">
      <button class="btn btn-outline btn-sm" id="bulletinMoreBtn">顯示更多（${showItems.length - VISIBLE} 則）</button>
    </div>`;
  }

  board.innerHTML = html;

  // 點擊展開/收合
  board.querySelectorAll('.bulletin-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.bulletin-item');
      const isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  // 顯示更多按鈕
  const moreBtn = document.getElementById('bulletinMoreBtn');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      board.querySelectorAll('.bulletin-hidden').forEach(el => el.classList.remove('bulletin-hidden'));
      const moreEl = document.getElementById('bulletinMore');
      if (moreEl) moreEl.style.display = 'none';
    });
  }
}

function formatDateV2(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${y}.${m}.${d}`;
}

// --- Rotating Tips ---
function initTips() {
  const tips = (typeof TIPS !== 'undefined') ? TIPS : [];
  const tipsEl = document.getElementById('tipsText');
  if (!tipsEl) return;
  let idx = 0;
  function showTip() {
    tipsEl.classList.remove('tip-visible');
    setTimeout(() => {
      tipsEl.textContent = tips[idx];
      tipsEl.classList.add('tip-visible');
      idx = (idx + 1) % tips.length;
    }, 400);
  }
  showTip();
  setInterval(showTip, 4000);
}

// --- Postcard Lightbox ---
function initPostcardLightbox() {
  const grid = document.getElementById('postcardGrid');
  if (!grid) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  if (!lightbox) return;

  function getImages() {
    return Array.from(grid.querySelectorAll('.postcard-item img'));
  }

  let idx = 0;

  let lastFocusTarget = null;

  function show(i) {
    const imgs = getImages();
    if (!imgs.length) return;
    if (i < 0) i = imgs.length - 1;
    if (i >= imgs.length) i = 0;
    idx = i;
    lightboxImg.src = imgs[idx].src;
    if (lightboxCounter) lightboxCounter.textContent = `${idx + 1} / ${imgs.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    if (lastFocusTarget) lastFocusTarget.focus();
  }

  grid.addEventListener('click', e => {
    const img = e.target.closest('.postcard-item img');
    if (img) {
      lastFocusTarget = img;
      const imgs = getImages();
      const vi = imgs.indexOf(img);
      show(vi >= 0 ? vi : 0);
      lightbox.classList.add('open');
      if (lightboxClose) lightboxClose.focus();
    }
  });

  // Navigation buttons
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => show(idx - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => show(idx + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { show(idx - 1); return; }
    if (e.key === 'ArrowRight') { show(idx + 1); return; }
    // Focus trap: keep Tab within lightbox controls
    if (e.key === 'Tab') {
      const focusable = lightbox.querySelectorAll('button');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - e.changedTouches[0].screenY);
    // 只有水平滑動距離大於垂直才觸發切換
    if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        show(idx + 1); // 向左滑 = 下一張
      } else {
        show(idx - 1); // 向右滑 = 上一張
      }
    }
  }, { passive: true });
}

// --- General Lightbox (for lore pages etc.) ---
function initGeneralLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  // Only run on pages that DON'T have their own photo gallery script
  if (document.getElementById('photoCarousel') || document.getElementById('allPhotosGrid')) return;

  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  function closeLightbox() {
    lightbox.classList.remove('open');
    if (lastFocusTarget) lastFocusTarget.focus();
  }

  // Image lightbox for lore/article pages
  let galleryImages = [];
  let gIdx = 0;
  let lastFocusTarget = null;

  function collectImages() {
    galleryImages = Array.from(document.querySelectorAll('.article-cover, .lore-card-img, .guide-img-wrap img'));
  }

  function showGalleryLightbox(i) {
    collectImages();
    if (!galleryImages.length) return;
    if (i < 0) i = galleryImages.length - 1;
    if (i >= galleryImages.length) i = 0;
    gIdx = i;
    const img = galleryImages[gIdx];
    const lbImg = document.getElementById('lightboxImg');
    const lbCounter = document.getElementById('lightboxCounter');
    if (img.loading === 'lazy') img.loading = 'eager';
    if (lbImg) lbImg.src = img.src;
    if (lbCounter) lbCounter.textContent = `${gIdx + 1} / ${galleryImages.length}`;
    lightbox.classList.add('open');
    if (lightboxClose) lightboxClose.focus();
  }

  // Attach click handlers to all clickable images
  function bindImageClicks() {
    document.querySelectorAll('.article-cover[style*="cursor"], .lore-card-img').forEach((img, i) => {
      if (img.dataset.lbBound) return;
      img.dataset.lbBound = '1';
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lastFocusTarget = img;
        collectImages();
        const idx = galleryImages.indexOf(img);
        showGalleryLightbox(idx >= 0 ? idx : 0);
      });
    });
  }

  bindImageClicks();
  // Re-bind after scroll reveals
  setTimeout(bindImageClicks, 1000);

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showGalleryLightbox(gIdx - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showGalleryLightbox(gIdx + 1));

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { showGalleryLightbox(gIdx - 1); return; }
    if (e.key === 'ArrowRight') { showGalleryLightbox(gIdx + 1); return; }
    if (e.key === 'Tab') {
      const focusable = lightbox.querySelectorAll('button');
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Touch swipe
  let tsx = 0;
  lightbox.addEventListener('touchstart', (e) => { tsx = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = tsx - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showGalleryLightbox(gIdx + 1);
      else showGalleryLightbox(gIdx - 1);
    }
  }, { passive: true });
}

// --- Photo Carousel (auto-rotating) ---
function initPhotoGallery() {
  const container = document.getElementById('photoCarousel');
  if (!container) return;

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;
  const VISIBLE = window.innerWidth >= 1400 ? 5 : window.innerWidth >= 900 ? 3 : 1;
  const INTERVAL = 4000;
  let photos = [];
  let current = 0;
  let timer = null;

  fetch(SW_BASE + 'photos.json')
    .then(r => {
      if (!r.ok) throw new Error('photos.json 載入失敗');
      return r.json();
    })
    .then(data => {
      if (!data || !data.photos || !data.photos.length) {
        container.innerHTML = '<div class="photo-placeholder">暫無照片</div>';
        return;
      }
      // Shuffle all photos
      photos = [...data.photos].sort(() => Math.random() - 0.5);
      buildCarousel();
    })
    .catch(err => {
      console.error('照片輪播載入錯誤:', err);
      container.innerHTML = '<div class="photo-placeholder">照片載入失敗</div>';
    });

  function buildCarousel() {
    track.innerHTML = '';
    photos.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(src);
      let media;
      if (isVideo) {
        media = document.createElement('video');
        media.src = src;
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.autoplay = true;
        media.preload = 'none';
        media.addEventListener('mouseenter', () => media.play().catch(()=>{}));
        media.addEventListener('mouseleave', () => media.pause());
      } else {
        media = document.createElement('img');
        media.src = src;
        media.alt = `海風風景照 ${i + 1}`;
        media.loading = 'lazy';
      }
      media.style.cursor = 'zoom-in';
      media.onerror = function() { this.parentElement.style.display = 'none'; };
      media.addEventListener('click', () => showCarouselLightbox(i));
      slide.appendChild(media);
      track.appendChild(slide);
    });

    // Set slide widths dynamically
    track.querySelectorAll('.carousel-slide').forEach(s => {
      s.style.flex = `0 0 ${100 / VISIBLE}%`;
    });

    // dots
    const totalPages = Math.ceil(photos.length / VISIBLE);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    // 觸控滑動支援
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });

    goTo(0);
    startTimer();

    container.addEventListener('mouseenter', () => stopTimer());
    container.addEventListener('mouseleave', () => startTimer());
  }

  // Carousel Lightbox
  function showCarouselLightbox(idx) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    const lbCounter = document.getElementById('lightboxCounter');
    if (!lb || !lbImg) return;

    let ci = idx;
    function show(i) {
      if (i < 0) i = photos.length - 1;
      if (i >= photos.length) i = 0;
      ci = i;
      lbImg.src = photos[ci];
      if (lbCounter) lbCounter.textContent = `${ci + 1} / ${photos.length}`;
    }
    function close() { lb.classList.remove('open'); }
    show(ci);
    lb.classList.add('open');
    stopTimer();

    // Remove old listeners by cloning
    const newClose = lbClose.cloneNode(true);
    lbClose.parentNode.replaceChild(newClose, lbClose);
    newClose.addEventListener('click', close);

    const newPrev = lbPrev.cloneNode(true);
    lbPrev.parentNode.replaceChild(newPrev, lbPrev);
    newPrev.addEventListener('click', () => show(ci - 1));

    const newNext = lbNext.cloneNode(true);
    lbNext.parentNode.replaceChild(newNext, lbNext);
    newNext.addEventListener('click', () => show(ci + 1));

    const clickClose = (e) => { if (e.target === lb) { close(); lb.removeEventListener('click', clickClose); } };
    lb.addEventListener('click', clickClose);

    const keyHandler = (e) => {
      if (!lb.classList.contains('open')) { document.removeEventListener('keydown', keyHandler); return; }
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', keyHandler); }
      if (e.key === 'ArrowLeft') show(ci - 1);
      if (e.key === 'ArrowRight') show(ci + 1);
    };
    document.addEventListener('keydown', keyHandler);

    // Touch swipe in lightbox
    let tsx = 0;
    lb.addEventListener('touchstart', (e) => { tsx = e.changedTouches[0].screenX; }, { passive: true, once: false });
    const touchEnd = (e) => {
      const d = tsx - e.changedTouches[0].screenX;
      if (Math.abs(d) > 50) { if (d > 0) show(ci + 1); else show(ci - 1); }
    };
    lb.addEventListener('touchend', touchEnd, { passive: true });

    lb.addEventListener('transitionend', () => {
      if (!lb.classList.contains('open')) startTimer();
    }, { once: true });
  }

  function goTo(page) {
    const totalPages = Math.ceil(photos.length / VISIBLE);
    if (page < 0) page = totalPages - 1;
    if (page >= totalPages) page = 0;
    current = page;

    const slideWidth = 100 / VISIBLE;
    const offset = -current * VISIBLE * slideWidth;
    track.style.transform = `translateX(${offset}%)`;

    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }
}

// --- Guide Sidebar Active State ---
function initGuideSidebar() {
  const sidebar = document.querySelector('.guide-sidebar-nav');
  if (!sidebar) return;

  const links = sidebar.querySelectorAll('.guide-sb-link');
  const groups = [];

  links.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(id);
    if (target) groups.push({ link, target });
  });

  if (!groups.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = groups.find(g => g.target === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  groups.forEach(g => observer.observe(g.target));
}

// --- Photo Page (風景照.html 全部照片頁面) ---
function initPhotoPage() {
  const container = document.getElementById('allPhotosGrid');
  if (!container) return;

  const BATCH_SIZE = 24;
  let allPhotos = [];
  let loaded = 0;

  const floatCounter = document.createElement('div');
  floatCounter.className = 'photo-float-counter';
  floatCounter.innerHTML = '<span class="pfc-text">📸 載入中...</span>';
  document.body.appendChild(floatCounter);

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let currentIdx = 0;

  function getVisible() {
    return Array.from(container.querySelectorAll('.photo-item')).filter(
      img => img.style.display !== 'none'
    );
  }

  function showLightbox(i) {
    if (!lightbox || !lightboxImg) return;
    const visible = getVisible();
    if (!visible.length) return;
    if (i < 0) i = visible.length - 1;
    if (i >= visible.length) i = 0;
    currentIdx = i;
    const target = visible[currentIdx];
    if (target.loading === 'lazy' && !target.naturalWidth) target.loading = 'eager';
    lightboxImg.src = target.src;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIdx + 1} / ${visible.length}`;
    lightbox.classList.add('open');
  }

  container.addEventListener('click', e => {
    const item = e.target.closest('.photo-item');
    if (item) {
      const visible = getVisible();
      const vi = visible.indexOf(item);
      showLightbox(vi >= 0 ? vi : 0);
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showLightbox(currentIdx - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); showLightbox(currentIdx + 1); });
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') showLightbox(currentIdx - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIdx + 1);
  });

  // Touch swipe
  if (lightbox) {
    let tsx = 0;
    lightbox.addEventListener('touchstart', e => { tsx = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const diff = tsx - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? showLightbox(currentIdx + 1) : showLightbox(currentIdx - 1); }
    }, { passive: true });
  }

  fetch(SW_BASE + 'photos.json')
    .then(r => { if (!r.ok) throw new Error('載入失敗'); return r.json(); })
    .then(data => {
      allPhotos = data.photos || [];
      if (!allPhotos.length) {
        container.innerHTML = '<div class="photo-placeholder">暫無照片</div>';
        if (floatCounter) floatCounter.remove();
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'photo-grid';
      container.appendChild(grid);

      const counter = document.createElement('div');
      counter.className = 'photo-counter';
      container.appendChild(counter);

      var sentinel = null;

      function loadBatch() {
        const end = Math.min(loaded + BATCH_SIZE, allPhotos.length);
        for (let i = loaded; i < end; i++) {
          const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(allPhotos[i]);
          if (isVideo) {
            const vid = document.createElement('video');
            vid.src = allPhotos[i];
            vid.className = 'photo-item';
            vid.alt = `海風風景照 ${i + 1}`;
            vid.muted = true; vid.loop = true; vid.playsInline = true; vid.preload = 'metadata';
            vid.onmouseenter = function() { this.play(); };
            vid.onmouseleave = function() { this.pause(); this.currentTime = 0; };
            vid.onerror = function() { this.style.display = 'none'; };
            grid.appendChild(vid);
          } else {
            const img = document.createElement('img');
            img.src = allPhotos[i];
            img.className = 'photo-item';
            img.alt = `海風風景照 ${i + 1}`;
            img.loading = 'lazy';
            img.onerror = function() { this.style.display = 'none'; };
            grid.appendChild(img);
          }
        }
        loaded = end;
        counter.textContent = `${loaded} / ${allPhotos.length}`;
        floatCounter.querySelector('.pfc-text').textContent = `📸 ${loaded} / ${allPhotos.length}`;

        if (loaded < allPhotos.length) {
          setupSentinel();
        } else if (sentinel) {
          sentinel.remove();
        }
      }

      function setupSentinel() {
        if (sentinel) sentinel.remove();
        sentinel = document.createElement('div');
        sentinel.className = 'photo-sentinel';
        sentinel.innerHTML = '<div class="photo-loading">載入中⋯</div>';
        container.appendChild(sentinel);
        const obs = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) { obs.disconnect(); setTimeout(loadBatch, 200); }
        }, { rootMargin: '300px' });
        obs.observe(sentinel);
      }

      loadBatch();
    })
    .catch(() => {
      container.innerHTML = '<div class="photo-placeholder">照片載入失敗，請稍後再試</div>';
      if (floatCounter) floatCounter.remove();
    });
}

// --- Photo Page: 獨立初始化，不依賴 deferredInit ---
document.addEventListener('DOMContentLoaded', () => { initPhotoPage(); });

// --- Deployment Count (使用 GitHub commits API，未認證時友善降級 + localStorage 快取) ---
(function() {
  const el = document.getElementById('deployCount');
  if (!el) return;

  const CACHE_KEY = 'sw-deploy-count';
  const CACHE_TTL = 60 * 60 * 1000; // 1 小時

  // 先從快取讀取
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && (Date.now() - cached.t < CACHE_TTL)) {
      el.textContent = cached.v;
      return;
    }
  } catch(e) {}

  // 快取過期或不存在，打 API
  fetch('https://api.github.com/repos/mc-seawind-cc/website/commits?per_page=1')
    .then(r => {
      if (!r.ok) { el.textContent = '—'; return; }
      const link = r.headers.get('Link') || '';
      const match = link.match(/page=(\d+)>; rel="last"/);
      const val = match ? match[1] : '—';
      el.textContent = val;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ v: val, t: Date.now() })); } catch(e) {}
    })
    .catch(() => { el.textContent = '—'; });
})();
