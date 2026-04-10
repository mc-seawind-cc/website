/* ═══════════════════════════════════════════
   海風 Seabreeze — Main Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Critical: Theme Toggle (first paint) ---
  const themeBtn = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem('seabreeze-theme') || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);
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
        btn.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  // --- Critical: Scroll Reveal ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
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
    musicJs.src = 'music-player.js';
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
  };

  // Standalone rain toggle button (only on 首頁, left of music player)
  const isHome = location.pathname.endsWith('首頁.html') || location.pathname.endsWith('/') || location.pathname === '';
  if (isHome) {
    const rainBtn = document.createElement('button');
    rainBtn.id = 'rainToggle';
    rainBtn.className = 'rain-toggle active';
    rainBtn.title = '雨聲';
    rainBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>';
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
            setTimeout(type, 60 + Math.random() * 40);
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

// --- Hero Click-to-Reveal ---
function initHeroReveal() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  let revealed = false;

  function revealHero() {
    if (revealed) return;
    revealed = true;
    heroContent.classList.remove('hero-collapsed');

    // Start typewriter, server status, and tips after reveal
    setTimeout(() => initTypewriter(), 200);
    fetchServerStatus();
    initTips();
  }

  // Click, scroll, or keyboard to reveal
  function bindReveal(handler) {
    handler.addEventListener('click', revealHero);
  }

  heroContent.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .info-card-copy')) return;
    revealHero();
  });

  // Scroll = reveal
  window.addEventListener('scroll', () => revealHero(), { passive: true });

  // Prompt click
  const prompt = document.getElementById('heroPrompt');
  if (prompt) {
    prompt.addEventListener('click', (e) => {
      e.stopPropagation();
      revealHero();
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        revealHero();
      }
    }
  });

  // Auto-reveal after 0.3s if user hasn't interacted
  setTimeout(() => revealHero(), 300);
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
  const count = isMobile ? 30 : 80;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (0.4 + Math.random() * 0.6) + 's';
    p.style.animationDelay = (Math.random() * 3) + 's';
    const h = 20 + Math.random() * 20;
    p.style.height = h + 'px';
    p.style.width = '2px';
    p.style.opacity = 0.4 + Math.random() * 0.5;
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
  // Prevent double-init
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

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.textContent = '_';
  el.appendChild(cursor);

  const mainText = document.createTextNode('');
  el.insertBefore(mainText, cursor);

  const speed = 100;

  function typeMain(text, idx, cb) {
    if (idx < text.length) {
      mainText.textContent += text[idx];
      playTick();
      setTimeout(() => typeMain(text, idx + 1, cb), speed + Math.random() * 40);
    } else {
      cb();
    }
  }

  // Start typing after a short pause
  setTimeout(() => {
    typeMain('在風與海之間，有一個可以長久生存的地方', 0, () => {
      // Done — cursor keeps blinking
    });
  }, 400);
}

// --- Copy Server IP ---
function copyServerIP() {
  const ip = 'seawind.cc';
  navigator.clipboard.writeText(ip).then(() => {
    const hint = document.getElementById('copyHint');
    if (hint) { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 1500); }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = ip; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const hint = document.getElementById('copyHint');
    if (hint) { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 1500); }
  });
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
      if (data.online) {
        const players = data.players ? data.players.online : 0;
        const max = data.players ? data.players.max : 0;
        statusEl.textContent = `${players} / ${max} 在線`;
        statusEl.className = 'info-value status-online';
      } else {
        statusEl.textContent = '維護中';
        statusEl.className = 'info-value status-offline';
      }
    })
    .catch(() => {
      statusEl.classList.remove('status-loading');
      statusEl.textContent = '查詢失敗';
      statusEl.className = 'info-value';
    });
}

// --- Bulletin Board ---
function initBulletinBoard() {
  const board = document.getElementById('bulletinBoard');
  if (!board) return;
  fetch('announcements.json')
    .then(r => r.json())
    .then(data => {
      const MAX_TOTAL = 100;

      // Markdown to HTML converter
      function md2html(text) {
        if (!text) return '';
        let html = text;
        // Images: ![alt](url)
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" style="max-width:100%;border-radius:8px;margin:8px 0;">');
        // Links: [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Inline code
        html = html.replace(/`(.+?)`/g, '<code style="background:rgba(157,175,255,0.1);padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>');
        // Lines
        const lines = html.split('\n');
        let result = [];
        let inList = false;
        lines.forEach(line => {
          const trimmed = line.trim();
          // Bullet points: • - *
          if (/^[\s]*[•\-\*]\s/.test(trimmed)) {
            if (!inList) { result.push('<ul style="padding-left:1.2em;margin:4px 0;">'); inList = true; }
            result.push('<li>' + trimmed.replace(/^[\s]*[•\-\*]\s+/, '') + '</li>');
          } else if (trimmed === '') {
            if (inList) { result.push('</ul>'); inList = false; }
            result.push('<br>');
          } else {
            if (inList) { result.push('</ul>'); inList = false; }
            result.push(trimmed);
          }
        });
        if (inList) result.push('</ul>');
        return result.join('\n');
      }

      const items = data.announcements;
      // Separate pinned and regular
      const pinned = items.filter(i => i.pinned);
      const regular = items.filter(i => !i.pinned);
      const maxRegular = Math.max(0, MAX_TOTAL - pinned.length);
      // header row
      let html = '<div class="bulletin-header"><span>主旨</span><span>類型</span><span>編號</span><span>日期</span><span></span></div>';
      // Pinned items first (always visible)
      pinned.forEach((item, i) => {
        html += `
          <div class="bulletin-item pinned open" data-index="${i}">
            <button class="bulletin-toggle" onclick="const wasOpen=this.parentElement.classList.contains('open');this.closest('.bulletin-board').querySelectorAll('.bulletin-item.open').forEach(e=>e.classList.remove('open'));if(!wasOpen)this.parentElement.classList.add('open')">
              <span class="b-title">📌 ${item.title}</span>
              <span class="b-tag tag-${item.tag}">${item.tag}</span>
              <span class="b-id">${item.id}</span>
              <span class="b-date-col">${item.date}</span>
              <span class="b-arrow">▾</span>
            </button>
            <div class="bulletin-body" style="text-align:center;">
              <div class="b-content">${md2html(item.content)}</div>
            </div>
          </div>`;
      });
      // Regular items (limited)
      regular.slice(0, maxRegular).forEach((item, i) => {
        html += `
          <div class="bulletin-item" data-index="${i}">
            <button class="bulletin-toggle" onclick="const wasOpen=this.parentElement.classList.contains('open');this.closest('.bulletin-board').querySelectorAll('.bulletin-item.open').forEach(e=>e.classList.remove('open'));if(!wasOpen)this.parentElement.classList.add('open')">
              <span class="b-title">${item.title}</span>
              <span class="b-tag tag-${item.tag}">${item.tag}</span>
              <span class="b-id">${item.id}</span>
              <span class="b-date-col">${item.date}</span>
              <span class="b-arrow">▾</span>
            </button>
            <div class="bulletin-body">
              <div class="b-date">📅 ${item.date} · ${item.id}</div>
              <div class="b-content">${md2html(item.content)}</div>
            </div>
          </div>`;
      });
      if (regular.length > maxRegular) {
        html += `<div class="bulletin-more"><a href="公告.html" class="btn btn-outline">查看全部公告 (${items.length} 則) →</a></div>`;
      }
      board.innerHTML = html;
    })
    .catch(() => { board.innerHTML = '<p style="text-align:center;color:var(--fog);padding:20px;">公告載入失敗</p>'; });
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
  }

  grid.addEventListener('click', e => {
    const img = e.target.closest('.postcard-item img');
    if (img) {
      const imgs = getImages();
      const vi = imgs.indexOf(img);
      show(vi >= 0 ? vi : 0);
      lightbox.classList.add('open');
    }
  });

  // Navigation buttons
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => show(idx - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => show(idx + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// --- General Lightbox (for lore pages etc.) ---
function initGeneralLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  // Only run on pages that don't have photoGrid (lore pages)
  if (document.getElementById('photoGrid')) return;

  const lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
  });
}

// --- Photo Carousel (auto-rotating) ---
function initPhotoGallery() {
  const container = document.getElementById('photoCarousel');
  if (!container) return;

  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const VISIBLE = window.innerWidth >= 1400 ? 5 : window.innerWidth >= 900 ? 3 : 1;
  const INTERVAL = 4000;
  let photos = [];
  let current = 0;
  let timer = null;

  fetch('photos.json')
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
      const img = document.createElement('img');
      img.src = src;
      img.alt = `海風風景照 ${i + 1}`;
      img.loading = 'lazy';
      img.onerror = function() { this.parentElement.style.display = 'none'; };
      slide.appendChild(img);
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

    goTo(0);
    startTimer();

    container.addEventListener('mouseenter', () => stopTimer());
    container.addEventListener('mouseleave', () => startTimer());
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
