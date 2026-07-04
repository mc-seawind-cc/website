/**
 * 海風載入動畫 v2 — 多場景故事式
 * - 無季節：品牌故事（logo → slogan）
 * - 有季節：季節主題（logo → 季節 → slogan）
 * - 點擊/按鍵跳過
 * - sessionStorage 控制頻率
 */
;(function () {
  'use strict';

  /* ══ 季節定義 ══ */
  const SEASONS = {
    '風緣季': {
      start: '2026-06-20',
      end: '2026-09-01',
      icon: '🍃',
      slogan: '在海風相遇，就是一種緣分',
      color: 'rgba(157,175,255,0.5)',
      particleColors: ['rgba(157,175,255,0.4)', 'rgba(171,114,249,0.3)', 'rgba(224,170,255,0.25)']
    }
    /* 未來季節在此新增：
    '星落季': {
      start: '2026-09-15',
      end: '2026-12-01',
      icon: '⭐',
      slogan: '星光沉入海底，照亮回家的路',
      color: 'rgba(255,215,0,0.4)',
      particleColors: ['rgba(255,215,0,0.4)', 'rgba(157,77,221,0.3)']
    }
    */
  };

  /* ══ 工具函式 ══ */
  function getActiveSeason() {
    const now = Date.now();
    for (const [name, s] of Object.entries(SEASONS)) {
      const start = new Date(s.start + 'T00:00:00+08:00').getTime();
      const end = new Date(s.end + 'T23:59:59+08:00').getTime();
      if (now >= start && now <= end) return { name, ...s };
    }
    return null;
  }

  function shouldShowLoader(season) {
    try {
      const key = 'loaderShown';
      const seasonKey = 'loaderSeason';
      const shown = sessionStorage.getItem(key);
      const prevSeason = sessionStorage.getItem(seasonKey);
      const currentSeason = season ? season.name : '__none__';

      // 季節切換時重置
      if (prevSeason !== currentSeason) {
        sessionStorage.setItem(key, '');
        sessionStorage.setItem(seasonKey, currentSeason);
        return true;
      }
      return !shown;
    } catch (e) {
      return true;
    }
  }

  function markLoaderShown() {
    try {
      sessionStorage.setItem('loaderShown', '1');
    } catch (e) { /* ignore */ }
  }

  /* ══ 主邏輯 ══ */
  function initLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    const season = getActiveSeason();

    // 回訪跳過
    if (!shouldShowLoader(season)) {
      loader.remove();
      return;
    }

    // DOM 元素
    const scene1 = loader.querySelector('.loader-scene-1');
    const scene2 = loader.querySelector('.loader-scene-2');
    const scene3 = loader.querySelector('.loader-scene-3');
    const sloganEl = loader.querySelector('.loader-slogan');
    const subEl = loader.querySelector('.loader-sub');
    const seasonWrap = loader.querySelector('.loader-season');
    const seasonIcon = loader.querySelector('.loader-season-icon');
    const seasonName = loader.querySelector('.loader-season-name');
    const seasonSlogan = loader.querySelector('.loader-season-slogan');
    const particlesEl = loader.querySelector('.loader-particles');

    // 有季節 → 設定季節內容
    if (season && seasonWrap) {
      if (sloganEl) sloganEl.style.display = 'none';
      if (subEl) subEl.style.display = 'none';
      seasonWrap.style.display = '';
      if (seasonIcon) seasonIcon.textContent = season.icon;
      if (seasonName) seasonName.textContent = season.name;
      if (seasonSlogan) seasonSlogan.textContent = season.slogan;

      // 季節光暈色
      const glow = loader.querySelector('.loader-glow');
      if (glow) glow.style.background = `radial-gradient(circle, ${season.color} 0%, transparent 65%)`;

      // 生成粒子
      if (particlesEl) spawnParticles(particlesEl, season.particleColors, 12);
    } else {
      // 無季節 → 隱藏場景3
      if (scene3) scene3.style.display = 'none';
      if (particlesEl) spawnParticles(particlesEl, ['rgba(157,175,255,0.3)', 'rgba(168,230,207,0.2)'], 8);
    }

    // 場景時間軸
    const scenes = season ? [scene1, scene2, scene3] : [scene1, scene2];
    const durations = season ? [2200, 2800, 2200] : [2800, 2800]; // 每場景停留 ms
    const transitionMs = 600;

    let currentScene = 0;
    let skipped = false;
    let timers = [];

    function showScene(index) {
      if (index >= scenes.length || skipped) {
        finishLoader(loader);
        return;
      }
      const scene = scenes[index];
      if (!scene || scene.style.display === 'none') {
        finishLoader(loader);
        return;
      }

      // 離開上一個
      if (index > 0 && scenes[index - 1]) {
        scenes[index - 1].classList.remove('active');
        scenes[index - 1].classList.add('leaving');
      }

      // 進入下一個
      scene.classList.add('entering');
      scene.addEventListener('animationend', function handler() {
        scene.removeEventListener('animationend', handler);
        scene.classList.remove('entering');
        scene.classList.add('active');
      });

      // 下一個場景排程
      const t = setTimeout(() => showScene(index + 1), durations[index] + transitionMs);
      timers.push(t);
    }

    // 跳過（已停用）
    function skip() { /* no-op */ }

    // 5 秒超時強制開始
    const startDelay = 400;
    const maxWait = 5000;
    let started = false;

    function start() {
      if (started) return;
      started = true;
      showScene(0);
    }

    // 等頁面 load 或超時
    if (document.readyState === 'complete') {
      setTimeout(start, startDelay);
    } else {
      window.addEventListener('load', () => setTimeout(start, startDelay));
      setTimeout(start, maxWait);
    }
  }

  function finishLoader(loader) {
    markLoaderShown();
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
      // 通知頁面：loader 完成
      document.body.classList.add('loader-done');
      document.dispatchEvent(new CustomEvent('loaderDone'));
    }, 600);
  }

  function spawnParticles(container, colors, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'loader-particle';
      const size = 2 + Math.random() * 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = Math.random() * 20 + '%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 6 + 's';
      container.appendChild(p);
    }
  }

  /* ══ 啟動 ══ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
