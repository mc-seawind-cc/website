// ═══ 打怪物 ═══
// sprites: assets/mobs/*.png（16×16 像素圖，來源: mcwiki CC BY-NC-SA 3.0）

const MOB_SMASHER = (() => {
  'use strict';

  const SPRITE_PATH = 'assets/mobs/';

  // ═══ Mob Definitions ═══
  const HOSTILE = [
    { id: 'zombie',       name: '殭屍',       pts: 1, timeBonus: 1, weight: 12 },
    { id: 'creeper',      name: '苦力怕',     pts: 1, timeBonus: 1, weight: 12 },
    { id: 'skeleton',     name: '骷髏',       pts: 1, timeBonus: 1, weight: 10 },
    { id: 'slime',        name: '史萊姆',     pts: 1, timeBonus: 1, weight: 8 },
    { id: 'witch',        name: '女巫',       pts: 2, timeBonus: 1, weight: 6 },
    { id: 'spider',       name: '蜘蛛',       pts: 1, timeBonus: 1, weight: 10 },
    { id: 'cave-spider',  name: '洞穴蜘蛛',   pts: 1, timeBonus: 1, weight: 7 },
    { id: 'blaze',        name: '烈焰使者',   pts: 2, timeBonus: 1, weight: 5 },
    { id: 'breeze',       name: '旋風使者',   pts: 2, timeBonus: 1, weight: 5 },
    { id: 'ghast',        name: '地獄幽靈',   pts: 2, timeBonus: 2, weight: 4 },
    { id: 'phantom',      name: '夜魅',       pts: 2, timeBonus: 1, weight: 6 },
    { id: 'evoker',       name: '喚魔者',     pts: 3, timeBonus: 2, weight: 3, special: 'totem' },
    { id: 'enderman',     name: '終界使者',   pts: 2, timeBonus: 1, weight: 5 },
    { id: 'shulker',      name: '界伏蚌',     pts: 2, timeBonus: 1, weight: 4 },
    { id: 'silverfish',   name: '蠹魚',       pts: 1, timeBonus: 1, weight: 7 },
    { id: 'endermite',    name: '終界蟎',     pts: 1, timeBonus: 1, weight: 6 },
    { id: 'magma-cube',   name: '岩漿立方怪', pts: 1, timeBonus: 1, weight: 7 },
    { id: 'husk',         name: '屍殼',       pts: 1, timeBonus: 1, weight: 8 },
    { id: 'parched',      name: '枯骸',       pts: 2, timeBonus: 1, weight: 4 },
    { id: 'warden',       name: '伏守者',     pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'piglin-brute', name: '豬布林蠻兵', pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'ravager',      name: '劫毀獸',     pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'wither',       name: '凋零怪',     pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'elder-guardian', name: '遠古深海守衛', pts: 5, timeBonus: 3, weight: 1, hp: 2, stayMs: 3000, special: 'elder' },
    { id: 'guardian',     name: '深海守衛',   pts: 2, timeBonus: 1, weight: 0 }, // only spawns with elder
  ];

  const PASSIVE = [
    { id: 'allay',         name: '悅靈' },
    { id: 'armadillo',     name: '犰狳' },
    { id: 'bat',           name: '蝙蝠' },
    { id: 'camel',         name: '駱駝' },
    { id: 'chicken',       name: '雞' },
    { id: 'copper-golem',  name: '銅魔像' },
    { id: 'happy-ghast',   name: '快樂幽靈' },
    { id: 'horse',         name: '馬' },
    { id: 'parrot',        name: '鸚鵡' },
    { id: 'mooshroom',     name: '哞菇' },
    { id: 'pig',           name: '豬' },
    { id: 'rabbit',        name: '兔子' },
    { id: 'salmon',        name: '鮭魚' },
    { id: 'sheep',         name: '綿羊' },
    { id: 'strider',       name: '熾足獸' },
    { id: 'sniffer',       name: '嗅探獸' },
    { id: 'tropical-fish', name: '熱帶魚' },
    { id: 'squid',         name: '魷魚' },
    { id: 'villager',      name: '村民' },
    { id: 'tadpole',       name: '蝌蚪' },
    { id: 'turtle',        name: '海龜' },
    { id: 'cod',           name: '鱈魚' },
    { id: 'axolotl',       name: '六角恐龍' },
    { id: 'cat',           name: '貓' },
    { id: 'frog',          name: '青蛙' },
    { id: 'dolphin',       name: '海豚' },
    { id: 'fox',           name: '狐狸' },
    { id: 'goat',          name: '山羊' },
    { id: 'wandering-trader', name: '流浪商人' },
  ];

  const NEUTRAL = [
    { id: 'nautilus',          name: '鸚鵡螺' },
    { id: 'zombie-nautilus',   name: '殭屍鸚鵡螺' },
    { id: 'bee',               name: '蜜蜂' },
    { id: 'iron-golem',        name: '鐵魔像' },
    { id: 'panda',             name: '貓熊' },
    { id: 'polar-bear',        name: '北極熊' },
    { id: 'trader-llama',      name: '商駝' },
    { id: 'wolf',              name: '狼' },
    { id: 'pufferfish',        name: '河豚' },
  ];

  const SPECIAL = [
    { id: 'tnt',          name: 'TNT',         lethal: true },
    { id: 'end-crystal',  name: '終界水晶',    lethal: true },
  ];

  // ═══ Weighted Random ═══
  function weightedPick(arr) {
    const total = arr.reduce((s, m) => s + (m.weight || 1), 0);
    let r = Math.random() * total;
    for (const m of arr) {
      r -= (m.weight || 1);
      if (r <= 0) return m;
    }
    return arr[arr.length - 1];
  }

  // ═══ Game State ═══
  let state = null;

  function initState() {
    return {
      score: 0,
      timeLeft: 30,
      hasTotem: false,
      bestScore: parseInt(localStorage.getItem('sw-mobsmasher-best') || '0'),
      holes: Array(9).fill(null), // { mob, hp, maxHp, timeoutId, el }
      alive: true,
      spawnInterval: null,
      timerInterval: null,
      difficultyInterval: null,
      spawnSpeed: 1200,
      mobsSmashed: 0,
      friendliesHit: 0,
    };
  }

  // ═══ Render ═══
  function render(container) {
    state = initState();

    let html = `
      <div class="overlay-header">
        <span class="overlay-title"><img src="assets/mobs/iron-sword.png" alt="" style="width:16px;height:16px;vertical-align:middle;margin-right:4px"> 打怪物</span>
        <button class="overlay-close" onclick="MOB_SMASHER.close()">✕</button>
      </div>
      <div class="ms-hud">
        <div class="ms-hud-left">
          <span class="ms-score">💎 <span id="msScore">0</span></span>
          ${state.bestScore > 0 ? `<span class="ms-best">最高 ${state.bestScore}</span>` : ''}
        </div>
        <div class="ms-hud-center">
          <div class="ms-totem" id="msTotem" style="display:none" title="不死圖騰（抵擋一次致命傷害）"><img src="${SPRITE_PATH}totem.png" class="ms-item-sprite" alt="不死圖騰"></div>
        </div>
        <div class="ms-hud-right">
          <span class="ms-timer" id="msTimer">30</span>s
        </div>
      </div>
      <div class="ms-grid" id="msGrid">`;

    for (let i = 0; i < 9; i++) {
      html += `<div class="ms-hole" data-hole="${i}" id="msHole${i}" onclick="MOB_SMASHER.hit(${i})">
        <div class="ms-hole-inner"></div>
      </div>`;
    }

    html += `</div>
      <div class="ms-info" id="msInfo">準備好了嗎？點擊開始！</div>
      <div class="ms-legend">
        <span class="ms-legend-item"><img src="${SPRITE_PATH}zombie.png" class="ms-legend-sprite" alt="">敵對 +分+秒</span>
        <span class="ms-legend-item"><img src="${SPRITE_PATH}pig.png" class="ms-legend-sprite" alt="">友好 -分-秒</span>
        <span class="ms-legend-item"><img src="${SPRITE_PATH}wolf.png" class="ms-legend-sprite" alt="">中立 -分</span>
        <span class="ms-legend-item"><img src="${SPRITE_PATH}end-crystal.png" class="ms-legend-sprite" alt="">爆炸!</span>
      </div>
      <div class="ms-source">生物圖片來源：<a href="https://minecraft.wiki" target="_blank" rel="noopener">mcwiki</a>（CC BY-NC-SA 3.0）</div>
    `;

    container.innerHTML = html;
    container.querySelector('.ms-grid').addEventListener('click', startGame, { once: true });
  }

  function startGame() {
    if (state.timerInterval) return; // already started
    const info = document.getElementById('msInfo');
    if (info) info.textContent = '打敵對生物加分！不要打友好動物！';

    state.timerInterval = setInterval(() => {
      if (!state.alive) return;
      state.timeLeft--;
      updateHUD();
      if (state.timeLeft <= 0) {
        if (state.hasTotem) {
          useTotem();
          state.timeLeft = 5;
        } else {
          endGame();
        }
      }
    }, 1000);

    state.spawnInterval = setInterval(spawnMob, state.spawnSpeed);

    // Speed up difficulty
    state.difficultyInterval = setInterval(() => {
      if (state.spawnSpeed > 500) {
        state.spawnSpeed -= 50;
        clearInterval(state.spawnInterval);
        state.spawnInterval = setInterval(spawnMob, state.spawnSpeed);
      }
    }, 5000);
  }

  function spawnMob() {
    if (!state.alive) return;

    // Find empty holes
    const empty = [];
    for (let i = 0; i < 9; i++) {
      if (!state.holes[i]) empty.push(i);
    }
    if (empty.length === 0) return;

    // Pick random empty hole
    const idx = empty[Math.floor(Math.random() * empty.length)];

    // Decide what to spawn
    let mob, category;

    // TNT/Crystal chance increases with score
    const specialChance = Math.min(0.05 + state.score * 0.002, 0.15);
    if (Math.random() < specialChance) {
      mob = SPECIAL[Math.floor(Math.random() * SPECIAL.length)];
      category = 'special';
    } else {
      // 65% hostile, 25% passive, 10% neutral
      const roll = Math.random();
      if (roll < 0.65) {
        mob = weightedPick(HOSTILE.filter(m => m.weight > 0));
        category = 'hostile';
      } else if (roll < 0.90) {
        mob = PASSIVE[Math.floor(Math.random() * PASSIVE.length)];
        category = 'passive';
      } else {
        mob = NEUTRAL[Math.floor(Math.random() * NEUTRAL.length)];
        category = 'neutral';
      }
    }

    showMob(idx, mob, category);
  }

  function showMob(idx, mob, category) {
    const hole = document.getElementById(`msHole${idx}`);
    if (!hole) return;

    const stayDuration = mob.stayMs || (800 + Math.random() * 600);
    const maxHp = mob.hp || 1;

    // Build mob element
    const el = document.createElement('div');
    el.className = `ms-mob ms-${category}`;
    el.innerHTML = `
      <img src="${SPRITE_PATH}${mob.id}.png" alt="${mob.name}" class="ms-sprite" loading="lazy">
      ${maxHp > 1 ? `<div class="ms-hp-bar"><div class="ms-hp-fill" style="width:100%"></div></div>` : ''}
      <span class="ms-mob-name">${mob.name}</span>
    `;

    // Fallback if sprite fails to load
    const img = el.querySelector('img');
    img.onerror = () => {
      el.querySelector('.ms-sprite').style.display = 'none';
      el.insertAdjacentHTML('afterbegin', `<span class="ms-name-fallback">${mob.name}</span>`);
    };

    hole.querySelector('.ms-hole-inner').appendChild(el);
    hole.classList.add('active', `ms-hole-${category}`);

    // Store state
    state.holes[idx] = { mob, category, hp: maxHp, maxHp, el, timeoutId: null };

    // Auto-disappear
    state.holes[idx].timeoutId = setTimeout(() => {
      removeMob(idx);
    }, stayDuration);
  }

  function hit(idx) {
    const holeData = state.holes[idx];
    if (!holeData || !state.alive) return;

    const { mob, category, el } = holeData;

    // Hit animation
    el.classList.add('ms-hit');
    setTimeout(() => el.classList.remove('ms-hit'), 200);

    if (category === 'hostile') {
      holeData.hp--;
      if (holeData.hp > 0) {
        // Boss: update HP bar
        const fill = el.querySelector('.ms-hp-fill');
        if (fill) fill.style.width = (holeData.hp / holeData.maxHp * 100) + '%';
        el.classList.add('ms-damage');
        setTimeout(() => el.classList.remove('ms-damage'), 300);
        return;
      }

      // Killed!
      state.score += mob.pts;
      state.timeLeft += mob.timeBonus;
      state.mobsSmashed++;

      // Special abilities
      if (mob.special === 'totem') {
        state.hasTotem = true;
        showInfo('獲得不死圖騰！', '#a8e6cf');
        updateTotem();
      }
      if (mob.special === 'elder') {
        // Spawn guardians in adjacent holes
        spawnGuardians(idx);
      }

      showFloatingText(el, `+${mob.pts}`, '#a8e6cf');
      showFloatingText(el, `+${mob.timeBonus}s`, '#58c2b0', 20);
      removeMob(idx);

    } else if (category === 'passive') {
      state.score = Math.max(0, state.score - 2);
      state.timeLeft = Math.max(0, state.timeLeft - 3);
      state.friendliesHit++;
      showFloatingText(el, '-2', '#ff8282');
      showFloatingText(el, '-3s', '#ff8282', 20);
      showInfo(`不要打${mob.name}！`, '#ff8282');
      removeMob(idx);

    } else if (category === 'neutral') {
      state.score = Math.max(0, state.score - 1);
      showFloatingText(el, '-1', '#ffaa32');
      showInfo(`${mob.name}是中立的！`, '#ffaa32');
      removeMob(idx);

    } else if (category === 'special') {
      if (state.hasTotem) {
        useTotem();
        showInfo('不死圖騰救了你一命！', '#ffaa32');
        showFloatingText(el, '🛡️', '#a8e6cf');
      } else {
        state.timeLeft = 0;
        showInfo(`${mob.name}爆炸了！`, '#ff8282');
        showFloatingText(el, '💥', '#ff8282');
        endGame();
      }
      removeMob(idx);
    }

    updateHUD();

    // Check time
    if (state.timeLeft <= 0 && state.alive) {
      if (state.hasTotem) {
        useTotem();
        state.timeLeft = 5;
      } else {
        endGame();
      }
    }
  }

  function spawnGuardians(elderIdx) {
    const GUARDIAN = { id: 'guardian', name: '深海守衛', pts: 2, timeBonus: 1 };
    const adjacent = getAdjacent(elderIdx);
    let spawned = 0;
    for (const adj of adjacent) {
      if (!state.holes[adj] && spawned < 4) {
        setTimeout(() => showMob(adj, GUARDIAN, 'hostile'), spawned * 150);
        spawned++;
      }
    }
  }

  function getAdjacent(idx) {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const adj = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < 3 && c >= 0 && c < 3) adj.push(r * 3 + c);
      }
    }
    return adj;
  }

  function removeMob(idx) {
    const holeData = state.holes[idx];
    if (!holeData) return;
    clearTimeout(holeData.timeoutId);
    const hole = document.getElementById(`msHole${idx}`);
    if (hole) {
      hole.classList.remove('active', 'ms-hole-hostile', 'ms-hole-passive', 'ms-hole-neutral', 'ms-hole-special');
      hole.querySelector('.ms-hole-inner').innerHTML = '';
    }
    state.holes[idx] = null;
  }

  function useTotem() {
    state.hasTotem = false;
    updateTotem();
  }

  function updateTotem() {
    const el = document.getElementById('msTotem');
    if (el) el.style.display = state.hasTotem ? '' : 'none';
  }

  function updateHUD() {
    const scoreEl = document.getElementById('msScore');
    const timerEl = document.getElementById('msTimer');
    if (scoreEl) scoreEl.textContent = state.score;
    if (timerEl) {
      timerEl.textContent = state.timeLeft;
      timerEl.style.color = state.timeLeft <= 5 ? '#ff8282' : state.timeLeft <= 10 ? '#ffaa32' : '';
    }
  }

  function showFloatingText(anchor, text, color, offsetY = 0) {
    const ft = document.createElement('div');
    ft.className = 'ms-float-text';
    ft.textContent = text;
    ft.style.color = color;
    ft.style.top = offsetY + 'px';
    anchor.appendChild(ft);
    setTimeout(() => ft.remove(), 800);
  }

  function showInfo(text, color) {
    const info = document.getElementById('msInfo');
    if (info) {
      info.textContent = text;
      info.style.color = color;
      setTimeout(() => { info.style.color = ''; }, 1500);
    }
  }

  function endGame() {
    state.alive = false;
    clearInterval(state.spawnInterval);
    clearInterval(state.timerInterval);
    clearInterval(state.difficultyInterval);

    // Clear all mobs
    for (let i = 0; i < 9; i++) removeMob(i);

    // Save best
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      localStorage.setItem('sw-mobsmasher-best', state.score.toString());
    }

    // Show result
    const label = state.score >= 50 ? '苦力怕剋星！'
                : state.score >= 30 ? '出色的獵人！'
                : state.score >= 15 ? '還不錯！'
                : '再試一次！';

    const grid = document.getElementById('msGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="ms-result">
          <div class="ms-result-icon"><img src="assets/mobs/iron-sword.png" class="ms-result-sword" alt="劍"></div>
          <div class="ms-result-score">${state.score} 分</div>
          <div class="ms-result-detail">
            消滅 ${state.mobsSmashed} 隻怪物 · 誤傷 ${state.friendliesHit} 隻動物
            ${state.score >= state.bestScore && state.score > 0 ? '<br>🎉 新紀錄！' : ''}
          </div>
          <div class="ms-result-label">${label}</div>
          <div class="ms-result-btns">
            <button class="btn btn-main" onclick="MOB_SMASHER.restart()">🔄 再玩一次</button>
            <button class="btn btn-sub" onclick="MOB_SMASHER.close()">關閉</button>
          </div>
        </div>`;
    }
  }

  // ═══ Public API ═══
  function open(overlayBox) {
    render(overlayBox);
  }

  function close() {
    cleanup();
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
    document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  }

  function restart() {
    cleanup();
    const grid = document.getElementById('msGrid');
    if (grid) {
      // Re-render inside existing overlay
      render(document.getElementById('overlayBox'));
    }
  }

  function cleanup() {
    if (state) {
      clearInterval(state.spawnInterval);
      clearInterval(state.timerInterval);
      clearInterval(state.difficultyInterval);
      for (let i = 0; i < 9; i++) {
        if (state.holes[i]) clearTimeout(state.holes[i].timeoutId);
      }
    }
    state = null;
  }

  return { open, close, restart, hit };
})();
