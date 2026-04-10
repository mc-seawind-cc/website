/* ═══════════════════════════════════════════
   海風 Seabreeze — Main Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
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

  // --- Mobile Nav Toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // --- Dropdown Toggle (mobile) ---
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        btn.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  // --- Scroll Fade-In ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- Nav Scroll Shadow ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Floating Particles ---
  createParticles();
  createHeroParticles();

  // --- Active Nav Link ---
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Hero Typewriter (slower, staged) ---
  initTypewriter();

  // --- Real Server Status ---
  fetchServerStatus();

  // --- Bulletin Board ---
  initBulletinBoard();

  // --- Rotating Tips ---
  initTips();

  // --- Hero Scroll Down ---
  const scrollBtn = document.querySelector('.hero-scroll');
  if (scrollBtn) {
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.addEventListener('click', () => {
      const target = document.getElementById('about') || document.querySelector('.content-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Photo Gallery ---
  initPhotoGallery();

  // --- Postcard Lightbox ---
  initPostcardLightbox();

  // --- General Lightbox (lore pages etc.) ---
  initGeneralLightbox();
});

function createParticles() {
  const container = document.querySelector('.bg-atmosphere');
  if (!container) return;
  const count = Math.min(20, Math.floor(window.innerWidth / 80));
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
  const count = 50;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    const size = 2 + Math.random() * 4;
    p.style.width = p.style.height = size + 'px';
    p.style.opacity = 0.3 + Math.random() * 0.5;
    container.appendChild(p);
  }
}

// --- Hero Typewriter (staged with thinking dots) ---
function initTypewriter() {
  const el = document.getElementById('heroSubtitle');
  if (!el) return;

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  const thinkingDots = document.createElement('span');
  thinkingDots.className = 'thinking-dots';
  el.insertBefore(thinkingDots, cursor);

  const mainText = document.createTextNode('');
  el.insertBefore(mainText, thinkingDots);

  const speed = 120;
  const dotSpeed = 300;

  // Phase 1: show thinking "..."
  let dots = '';
  function addDot() {
    if (dots.length < 3) {
      dots += '...'[dots.length];
      thinkingDots.textContent = dots;
      setTimeout(addDot, dotSpeed);
    } else {
      // Phase 2: type "在風與海之間，" with dots still showing
      setTimeout(() => typeMain('在風與海之間，', 0, () => {
        // Phase 3: pause, then dots disappear, type rest
        setTimeout(() => {
          thinkingDots.textContent = '';
          typeMain('有一個可以長久生存的地方', 0, () => {
            // Phase 4: done — cursor keeps blinking
          });
        }, 800);
      }), 600);
    }
  }

  function typeMain(text, idx, cb) {
    if (idx < text.length) {
      mainText.textContent += text[idx];
      setTimeout(() => typeMain(text, idx + 1, cb), speed);
    } else {
      cb();
    }
  }

  setTimeout(addDot, 600);
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
  fetch('https://api.mcsrvstat.us/3/seawind.cc')
    .then(res => res.json())
    .then(data => {
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
    .catch(() => { statusEl.textContent = '查詢失敗'; statusEl.className = 'info-value'; });
}

// --- Bulletin Board ---
function initBulletinBoard() {
  const board = document.getElementById('bulletinBoard');
  if (!board) return;
  fetch('announcements.json')
    .then(r => r.json())
    .then(data => {
      const MAX_SHOW = 100;

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
      // header row
      let html = '<div class="bulletin-header"><span>主旨</span><span>類型</span><span></span></div>';
      // Pinned items first (always visible)
      pinned.forEach((item, i) => {
        html += `
          <div class="bulletin-item pinned" data-index="${i}">
            <button class="bulletin-toggle" onclick="this.parentElement.classList.toggle('open')">
              <span class="b-title">📌 ${item.title}</span>
              <span class="b-tag tag-${item.tag}">${item.tag}</span>
              <span class="b-arrow">▾</span>
            </button>
            <div class="bulletin-body" style="text-align:center;">
              <div class="b-content">${md2html(item.content)}</div>
            </div>
          </div>`;
      });
      // Regular items (limited)
      regular.slice(0, MAX_SHOW).forEach((item, i) => {
        html += `
          <div class="bulletin-item" data-index="${i}">
            <button class="bulletin-toggle" onclick="this.parentElement.classList.toggle('open')">
              <span class="b-title">${item.title}</span>
              <span class="b-tag tag-${item.tag}">${item.tag}</span>
              <span class="b-arrow">▾</span>
            </button>
            <div class="bulletin-body">
              <div class="b-date">📅 ${item.date} · ${item.id}</div>
              <div class="b-content">${md2html(item.content)}</div>
            </div>
          </div>`;
      });
      if (regular.length > MAX_SHOW) {
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

  grid.addEventListener('click', e => {
    const img = e.target.closest('.postcard-item img');
    if (img) {
      const imgs = getImages();
      const vi = imgs.indexOf(img);
      show(vi >= 0 ? vi : 0);
      lightbox.classList.add('open');
    }
  });
}

// --- General Lightbox (for lore pages etc.) ---
function initGeneralLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  // Only run on pages that don't have photoGrid (lore pages)
  if (document.getElementById('photoGrid')) return;

  const lightboxImg = document.getElementById('lightboxImg');
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
  const VISIBLE = 3;
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
      photos = data.photos.slice(0, 20); // max 20 for carousel
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
