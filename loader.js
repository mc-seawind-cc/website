/**
 * 海風載入動畫 v2 — 多場景故事式
 * - 無季節：品牌故事（logo → slogan）
 * - 有季節：季節主題（logo → 季節 → slogan）
 * - 點擊/按鍵跳過
 * - sessionStorage 控制頻率
 */
;(function () {
  'use strict';

  /* ══ 工具函式 ══ */
  function shouldShowLoader() {
    try {
      return !sessionStorage.getItem('loaderShown');
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

    // 回訪跳過
    if (!shouldShowLoader()) {
      loader.remove();
      return;
    }

    // DOM 元素
    const scene1 = loader.querySelector('.loader-scene-1');
    const scene2 = loader.querySelector('.loader-scene-2');
    const scene3 = loader.querySelector('.loader-scene-3');
    const particlesEl = loader.querySelector('.loader-particles');

    // 隱藏季節區塊，顯示品牌文字
    const sloganEl = loader.querySelector('.loader-slogan');
    const subEl = loader.querySelector('.loader-sub');
    const seasonWrap = loader.querySelector('.loader-season');
    if (sloganEl) sloganEl.style.display = '';
    if (subEl) subEl.style.display = '';
    if (seasonWrap) seasonWrap.style.display = 'none';
    if (scene3) scene3.style.display = 'none';

    // 生成粒子（手機減量）
    const isMobile = window.innerWidth <= 768;
    if (particlesEl) spawnParticles(particlesEl, ['rgba(157,175,255,0.3)', 'rgba(168,230,207,0.2)'], isMobile ? 4 : 8);

    // 場景時間軸
    const scenes = [scene1, scene2];
    const durations = [1600, 1600];
    const transitionMs = 400;

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

    // 跳過
    function skip() {
      if (skipped) return;
      skipped = true;
      timers.forEach(clearTimeout);
      finishLoader(loader);
    }

    document.addEventListener('click', skip, { once: true });
    document.addEventListener('keydown', skip, { once: true });
    document.addEventListener('touchstart', skip, { once: true, passive: true });

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
