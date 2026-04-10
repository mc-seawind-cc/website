/* ═══════════════════════════════════════════
   海風 Seabreeze — Main Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('seabreeze-theme') || 'dark';
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
      const items = data.announcements;
      // header row
      let html = '<div class="bulletin-header"><span>主旨</span><span>類型</span><span></span></div>';
      items.forEach((item, i) => {
        html += `
          <div class="bulletin-item" data-index="${i}">
            <button class="bulletin-toggle" onclick="this.parentElement.classList.toggle('open')">
              <span class="b-title">${item.title}</span>
              <span class="b-tag tag-${item.tag}">${item.tag}</span>
              <span class="b-arrow">▾</span>
            </button>
            <div class="bulletin-body">
              <div class="b-date">📅 ${item.date} · ${item.id}</div>
              <div class="b-content">${item.content}</div>
            </div>
          </div>`;
      });
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

// --- Photo Gallery (fixed path resolution) ---
function initPhotoGallery() {
  const container = document.getElementById('photoGrid');
  if (!container) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  const BATCH_SIZE = 12;

  fetch('photos.json')
    .then(r => {
      if (!r.ok) throw new Error(`photos.json 載入失敗 (${r.status})`);
      return r.json();
    })
    .then(data => {
      if (!data || !data.photos || !data.photos.length) {
        container.innerHTML = '<div class="photo-placeholder">暫無照片</div>';
        return;
      }
      container.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'photo-grid';
      container.appendChild(grid);

      let loaded = 0;

      function loadBatch() {
        const end = Math.min(loaded + BATCH_SIZE, data.photos.length);
        for (let i = loaded; i < end; i++) {
          const img = document.createElement('img');
          img.src = data.photos[i];
          img.className = 'photo-item';
          img.alt = `海風風景照 ${i + 1}`;
          img.loading = 'lazy';
          img.onerror = function() { this.style.display = 'none'; };
          grid.appendChild(img);
        }
        loaded = end;

        // 還有更多照片時，顯示載入感應器
        if (loaded < data.photos.length) {
          updateSentinel();
        } else if (sentinel) {
          sentinel.remove();
          sentinel = null;
        }

        // 更新計數
        if (counterEl) {
          counterEl.textContent = `${loaded} / ${data.photos.length}`;
        }
      }

      // 計數器
      const counterEl = document.createElement('div');
      counterEl.className = 'photo-counter';
      counterEl.textContent = `0 / ${data.photos.length}`;
      container.appendChild(counterEl);

      // 無限滾動感應器
      var sentinel = null;
      function updateSentinel() {
        if (sentinel) sentinel.remove();
        sentinel = document.createElement('div');
        sentinel.className = 'photo-sentinel';
        sentinel.innerHTML = '<div class="photo-loading">載入中⋯</div>';
        container.appendChild(sentinel);

        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            setTimeout(loadBatch, 300);
          }
        }, { rootMargin: '200px' });
        observer.observe(sentinel);
      }

      // 載入第一批
      loadBatch();
      setupLightbox();
    })
    .catch(err => {
      console.error('照片廊載入錯誤:', err);
      container.innerHTML = '<div class="photo-placeholder">照片載入失敗，請稍後再試</div>';
    });

  function setupLightbox() {
    if (!lightbox) return;

    function getVisible() {
      return Array.from(container.querySelectorAll('.photo-item')).filter(
        img => img.style.display !== 'none' && img.naturalWidth > 0
      );
    }

    let idx = 0;

    function show(i) {
      const visible = getVisible();
      if (!visible.length) return;
      if (i < 0) i = visible.length - 1;
      if (i >= visible.length) i = 0;
      idx = i;
      lightboxImg.src = visible[idx].src;
      if (lightboxCounter) lightboxCounter.textContent = `${idx + 1} / ${visible.length}`;
    }

    container.addEventListener('click', e => {
      if (e.target.classList.contains('photo-item')) {
        const visible = getVisible();
        const vi = visible.indexOf(e.target);
        show(vi >= 0 ? vi : 0);
        lightbox.classList.add('open');
      }
    });

    lightboxClose?.addEventListener('click', () => lightbox.classList.remove('open'));
    lightboxPrev?.addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
    lightboxNext?.addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
}
