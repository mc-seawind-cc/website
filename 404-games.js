// ═══════════════════════════════════════════
//  404 小遊戲 — 合成謎題 / 釣魚比賽 / 礦車跑酷 / 附魔猜猜
// ═══════════════════════════════════════════

const GAMES_404 = (() => {
  'use strict';

  // ═══════════════════════════════════════
  //  1. 合成謎題 (Crafting Puzzle)
  // ═══════════════════════════════════════
  function crafting(overlayBox) {
    const RECIPES = [
      { name: '工作台', emoji: '🪵', grid: ['🪵','🪵',null,'🪵','🪵',null,null,null,null], tip: '四塊木板' },
      { name: '木棍', emoji: '🪵', grid: [null,'🪵',null,null,'🪵',null,null,null,null], tip: '兩塊木板上下' },
      { name: '熔爐', emoji: '🔥', grid: ['🪨','🪨','🪨','🪨',null,'🪨','🪨','🪨','🪨'], tip: '八塊圓石' },
      { name: '箱子', emoji: '📦', grid: ['🪵','🪵','🪵','🪵',null,'🪵','🪵','🪵','🪵'], tip: '八塊木板' },
      { name: '鐵劍', emoji: '⚔️', grid: [null,'🪨',null,null,'🪨',null,null,'🪵',null], tip: '兩鐵一木' },
      { name: '鑽石劍', emoji: '💎', grid: [null,'💎',null,null,'💎',null,null,'🪵',null], tip: '兩鑽一木' },
      { name: '弓', emoji: '🏹', grid: ['🪵','🪵',null,'🪵',null,'🧵',null,'🪵',null], tip: '三木三線' },
      { name: '門', emoji: '🚪', grid: ['🪵','🪵',null,'🪵','🪵',null,'🪵','🪵',null], tip: '六塊木板左側' },
      { name: '梯子', emoji: '🪜', grid: ['🪵',null,'🪵','🪵','🪵','🪵','🪵',null,'🪵'], tip: '七根木棍' },
      { name: '床', emoji: '🛏️', grid: [null,null,null,'🧶','🧶','🧶','🪵','🪵','🪵'], tip: '三羊毛三木板' },
    ];
    const ITEMS = ['🪵','🪨','💎','🪵','🧵','🧶'];

    let score = 0, round = 0, maxRounds = 5, timer = 30, timerInterval = null;
    let playerGrid = Array(9).fill(null);
    let currentRecipe = null;
    let usedRecipes = [];

    function pickRecipe() {
      const available = RECIPES.filter((_, i) => !usedRecipes.includes(i));
      if (!available.length) { usedRecipes = []; return pickRecipe(); }
      const idx = RECIPES.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedRecipes.push(idx);
      return RECIPES[idx];
    }

    function render() {
      currentRecipe = pickRecipe();
      playerGrid = Array(9).fill(null);
      round++;

      let html = `<div class="overlay-header"><span class="overlay-title">🔨 合成謎題</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>`;
      html += `<div class="game-hud"><span>🔨 第 ${round}/${maxRounds} 題</span><span>⏱ <span class="game-hud-val" id="craftTimer">${timer}</span>秒</span><span>💎 <span class="game-hud-val" id="craftScore">${score}</span></span></div>`;
      html += `<div class="craft-target"><span class="craft-target-label">合成目標</span><span class="craft-target-emoji">${currentRecipe.emoji}</span><span class="craft-target-name">${currentRecipe.name}</span><span class="craft-target-tip">${currentRecipe.tip}</span></div>`;

      // Reference grid (empty 3x3)
      html += `<div class="craft-ref-label">配方參考</div>`;
      html += `<div class="craft-grid craft-ref-grid">`;
      for (let i = 0; i < 9; i++) {
        html += `<div class="craft-cell craft-ref-cell">${currentRecipe.grid[i] || ''}</div>`;
      }
      html += `</div>`;

      // Player grid
      html += `<div class="craft-grid" id="craftGrid">`;
      for (let i = 0; i < 9; i++) {
        html += `<div class="craft-cell${playerGrid[i] ? ' craft-filled' : ''}" data-slot="${i}" id="craftSlot${i}">${playerGrid[i] || ''}</div>`;
      }
      html += `</div>`;

      // Item tray
      html += `<div class="craft-tray">`;
      ITEMS.forEach((item, idx) => {
        html += `<button class="craft-item" data-item="${item}" id="craftItem${idx}">${item}</button>`;
      });
      html += `<button class="craft-item craft-clear" id="craftClear" title="清空">🗑️</button>`;
      html += `</div>`;
      html += `<div class="craft-hint">點材料 → 點格子放置，拼出配方！</div>`;

      overlayBox.innerHTML = html;

      // Bind events
      let selectedItem = null;
      overlayBox.querySelectorAll('.craft-item').forEach(btn => {
        if (btn.id === 'craftClear') {
          btn.addEventListener('click', () => {
            playerGrid = Array(9).fill(null);
            overlayBox.querySelectorAll('[data-slot]').forEach(s => { s.textContent = ''; s.classList.remove('craft-filled'); });
            selectedItem = null;
            overlayBox.querySelectorAll('.craft-item').forEach(b => b.classList.remove('craft-selected'));
          });
          return;
        }
        btn.addEventListener('click', () => {
          selectedItem = btn.dataset.item;
          overlayBox.querySelectorAll('.craft-item').forEach(b => b.classList.remove('craft-selected'));
          btn.classList.add('craft-selected');
        });
      });

      overlayBox.querySelectorAll('[data-slot]').forEach(slot => {
        slot.addEventListener('click', () => {
          const idx = parseInt(slot.dataset.slot);
          if (selectedItem) {
            playerGrid[idx] = selectedItem;
            slot.textContent = selectedItem;
            slot.classList.add('craft-filled');
            checkAnswer();
          }
        });
      });

      // Timer
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timer--;
        const el = document.getElementById('craftTimer');
        if (el) el.textContent = timer;
        if (timer <= 0) { clearInterval(timerInterval); nextRound(false); }
      }, 1000);
    }

    function checkAnswer() {
      const correct = currentRecipe.grid.every((v, i) => (v === null && playerGrid[i] === null) || v === playerGrid[i]);
      if (correct) {
        clearInterval(timerInterval);
        score += 10;
        nextRound(true);
      }
    }

    function nextRound(success) {
      if (round >= maxRounds) {
        endGame();
        return;
      }
      timer = Math.max(20, 30 - round * 2);
      render();
    }

    function endGame() {
      clearInterval(timerInterval);
      const label = score >= 40 ? '合成大師！🏗️' : score >= 25 ? '熟練工匠！' : score >= 10 ? '學徒一個！' : '再練練吧！';
      overlayBox.innerHTML = `
        <div class="overlay-header"><span class="overlay-title">🔨 合成謎題</span><button class="close-overlay" onclick="closeOverlay()">✕</button></div>
        <div class="game-result">
          <div class="game-result-emoji">🔨</div>
          <div class="game-result-val">${score} 分</div>
          <div class="game-result-text">完成 ${round} 題</div>
          <div class="game-result-label">${label}</div>
          <div class="game-result-btns"><button class="btn btn-main" onclick="GAMES_404.crafting(document.getElementById('overlayBox'))">🔄 再來</button><button class="btn btn-sub" onclick="closeOverlay()">關閉</button></div>
        </div>`;
    }

    score = 0; round = 0; timer = 30; usedRecipes = [];
    render();
  }


  // ═══════════════════════════════════════
  //  2. 釣魚比賽 (Fishing Game)
  // ═══════════════════════════════════════
  function fishing(overlayBox) {
    const CATCHES = [
      { emoji: '🐟', name: '鱈魚', pts: 1, weight: 30, rarity: '普通' },
      { emoji: '🐠', name: '熱帶魚', pts: 2, weight: 20, rarity: '普通' },
      { emoji: '🐡', name: '河豚', pts: 3, weight: 12, rarity: '稀有' },
      { emoji: '🦐', name: '蝦', pts: 2, weight: 15, rarity: '普通' },
      { emoji: '🐙', name: '章魚', pts: 5, weight: 5, rarity: '稀有' },
      { emoji: '🐬', name: '海豚', pts: 8, weight: 3, rarity: '傳說' },
      { emoji: '👢', name: '靴子', pts: 0, weight: 10, rarity: '垃圾' },
      { emoji: '🧭', name: '指南針', pts: 1, weight: 8, rarity: '垃圾' },
      { emoji: '🪝', name: '釣鉤', pts: 4, weight: 6, rarity: '稀有' },
      { emoji: '🐚', name: '鸚鵡螺殼', pts: 6, weight: 4, rarity: '傳說' },
      { emoji: '🏺', name: '寶藏瓶', pts: 10, weight: 2, rarity: '傳說' },
    ];
    const TOTAL = CATCHES.reduce((s, c) => s + c.weight, 0);

    let score = 0, catches = 0, maxCatches = 8;
    let state = 'ready'; // ready, casting, waiting, biting, caught, missed
    let biteTimer = null, biteWindow = null;
    let catchHistory = [];

    function pickCatch() {
      let r = Math.random() * TOTAL;
      for (const c of CATCHES) { r -= c.weight; if (r <= 0) return c; }
      return CATCHES[0];
    }

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🎣 釣魚比賽</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>`;
      html += `<div class="game-hud"><span>🎣 第 ${catches + 1}/${maxCatches} 竿</span><span>💎 <span class="game-hud-val" id="fishScore">${score}</span></span></div>`;
      html += `<div class="fish-scene" id="fishScene">`;
      html += `<div class="fish-water"></div>`;
      html += `<div class="fish-bobber" id="fishBobber">🪝</div>`;
      html += `<div class="fish-msg" id="fishMsg">點擊拋竿！</div>`;
      html += `</div>`;

      if (catchHistory.length) {
        html += `<div class="fish-history">`;
        catchHistory.forEach(c => {
          html += `<span class="fish-caught" title="${c.name} (${c.rarity})">${c.emoji}</span>`;
        });
        html += `</div>`;
      }

      overlayBox.innerHTML = html;

      const scene = document.getElementById('fishScene');
      scene.addEventListener('click', handleClick);
    }

    function handleClick() {
      if (state === 'ready' || state === 'caught' || state === 'missed') {
        castLine();
      } else if (state === 'biting') {
        reelIn();
      } else if (state === 'casting' || state === 'waiting') {
        // Too early!
        clearTimeout(biteTimer);
        clearTimeout(biteWindow);
        state = 'missed';
        showMsg('提竿太快了！等浮標動...', '#ff8282');
        setTimeout(() => { if (catches < maxCatches) render(); else endGame(); }, 1200);
      }
    }

    function castLine() {
      state = 'casting';
      const bobber = document.getElementById('fishBobber');
      const msg = document.getElementById('fishMsg');
      if (bobber) { bobber.className = 'fish-bobber fish-casting'; bobber.textContent = '🪝'; }
      if (msg) { msg.textContent = '拋竿中...'; msg.style.color = ''; }

      setTimeout(() => {
        state = 'waiting';
        if (bobber) bobber.className = 'fish-bobber fish-floating';
        if (msg) msg.textContent = '等待魚兒上鉤...';

        const waitTime = 1500 + Math.random() * 3500;
        biteTimer = setTimeout(() => {
          state = 'biting';
          if (bobber) bobber.className = 'fish-bobber fish-biting';
          if (msg) { msg.textContent = '快按！魚上鉤了！'; msg.style.color = '#a8e6cf'; }

          const windowMs = 800 + Math.random() * 400;
          biteWindow = setTimeout(() => {
            if (state === 'biting') {
              state = 'missed';
              if (msg) { msg.textContent = '魚跑了...'; msg.style.color = '#ff8282'; }
              if (bobber) bobber.className = 'fish-bobber';
              setTimeout(() => { if (catches < maxCatches) render(); else endGame(); }, 1000);
            }
          }, windowMs);
        }, waitTime);
      }, 600);
    }

    function reelIn() {
      clearTimeout(biteWindow);
      state = 'caught';
      const fish = pickCatch();
      score += fish.pts;
      catches++;
      catchHistory.push(fish);

      const bobber = document.getElementById('fishBobber');
      const msg = document.getElementById('fishMsg');
      if (bobber) { bobber.className = 'fish-bobber fish-reel'; bobber.textContent = fish.emoji; }
      if (msg) {
        const color = fish.pts >= 5 ? '#ab72f9' : fish.pts >= 2 ? '#a8e6cf' : fish.pts === 0 ? '#ff8282' : '#9dafff';
        msg.textContent = `${fish.emoji} ${fish.name}！${fish.pts > 0 ? '+' + fish.pts + '分' : '垃圾...'}`;
        msg.style.color = color;
      }

      const scoreEl = document.getElementById('fishScore');
      if (scoreEl) scoreEl.textContent = score;

      if (catches >= maxCatches) {
        setTimeout(endGame, 1500);
      } else {
        setTimeout(render, 1500);
      }
    }

    function showMsg(text, color) {
      const msg = document.getElementById('fishMsg');
      if (msg) { msg.textContent = text; msg.style.color = color; }
    }

    function endGame() {
      clearTimeout(biteTimer);
      clearTimeout(biteWindow);
      const label = score >= 40 ? '釣魚大師！🐟' : score >= 25 ? '釣魚高手！' : score >= 10 ? '還不錯！' : '多練釣技！';
      const bestCatch = catchHistory.reduce((best, c) => c.pts > best.pts ? c : best, { pts: 0, emoji: '❓', name: '無' });
      overlayBox.innerHTML = `
        <div class="overlay-header"><span class="overlay-title">🎣 釣魚比賽</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>
        <div class="game-result">
          <div class="game-result-emoji">🎣</div>
          <div class="game-result-val">${score} 分</div>
          <div class="game-result-text">釣了 ${catches} 竿 · 最佳：${bestCatch.emoji} ${bestCatch.name}（+${bestCatch.pts}）</div>
          <div class="game-result-label">${label}</div>
          <div class="game-result-btns"><button class="btn btn-main" onclick="GAMES_404.fishing(document.getElementById('overlayBox'))">🔄 再來</button><button class="btn btn-sub" onclick="closeOverlay()">關閉</button></div>
        </div>`;
    }

    score = 0; catches = 0; state = 'ready'; catchHistory = [];
    render();
  }


  // ═══════════════════════════════════════
  //  3. 附魔猜猜 (Enchantment Guess)
  // ═══════════════════════════════════════
  function enchanting(overlayBox) {
    const ENCHANTS = [
      { name: '效率', alt: ['保護', '鋒利', '時運'], desc: '加快挖掘速度' },
      { name: '時運', alt: ['搶劫', '經驗修補', '效率'], desc: '增加方塊掉落物' },
      { name: '經驗修補', alt: ['消失詛咒', '綁定詛咒', '耐久'], desc: '用經驗值修復裝備' },
      { name: '鋒利', alt: ['亡靈殺手', '節肢殺手', '擊退'], desc: '增加近戰傷害' },
      { name: '保護', alt: ['火焰保護', '爆炸保護', '彈射物保護'], desc: '減少多種傷害' },
      { name: '無限', alt: '火矢|多重射擊|穿透'.split('|'), desc: '弓箭不消耗' },
      { name: '搶劫', alt: ['擊退', '火焰附加', '鋒利'], desc: '增加生物掉落物' },
      { name: '水下呼吸', alt: ['深海之癒', '水下速掘', '靈魂疾速'], desc: '延長水下呼吸時間' },
      { name: '消失詛咒', alt: ['綁定詛咒', '經驗修補', '耐久'], desc: '死亡時物品消失' },
      { name: '擊退', alt: ['火焰附加', '搶劫', '鋒利'], desc: '擊退敵人更遠' },
      { name: '耐久', alt: ['經驗修補', '時運', '效率'], desc: '減少耐久消耗' },
      { name: '亡靈殺手', alt: ['節肢殺手', '鋒利', '擊退'], desc: '對不死生物增傷' },
      { name: '火焰附加', alt: ['擊退', '搶劫', '鋒利'], desc: '點燃目標' },
      { name: '深海之癒', alt: ['水下呼吸', '靈魂疾速', '冰霜行者'], desc: '在水下發光且更快' },
      { name: '忠誠', alt: ['穿刺', '激流', '引雷'], desc: '三叉戟自動飛回' },
      { name: '引雷', alt: ['忠誠', '穿刺', '激流'], desc: '雨天召喚閃電' },
      { name: '橫掃之刃', alt: ['鋒利', '擊退', '火焰附加'], desc: '增加橫掃傷害' },
      { name: '多重射擊', alt: ['快速裝填', '穿透', '無限'], desc: '一次射出三支箭' },
      { name: '快速裝填', alt: ['多重射擊', '穿透', '無限'], desc: '減少弩裝填時間' },
      { name: '冰霜行者', alt: ['深海之癒', '靈魂疾速', '消失詛咒'], desc: '在水上行走結冰' },
    ];

    let score = 0, round = 0, maxRounds = 8, streak = 0, bestStreak = 0;
    let usedEnchants = [];

    function pickEnchant() {
      const available = ENCHANTS.filter((_, i) => !usedEnchants.includes(i));
      if (!available.length) { usedEnchants = []; return pickEnchant(); }
      const idx = ENCHANTS.indexOf(available[Math.floor(Math.random() * available.length)]);
      usedEnchants.push(idx);
      return ENCHANTS[idx];
    }

    function garbleName(name) {
      // Generate Minecraft-style garbled enchantment text
      const garbleChars = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛇᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
      const len = name.length;
      let result = '';
      for (let i = 0; i < len * 2 + 3; i++) {
        result += garbleChars[Math.floor(Math.random() * garbleChars.length)];
      }
      return result;
    }

    function render() {
      const enchant = pickEnchant();
      round++;

      // Build options (correct + 3 alts, shuffled)
      const options = [enchant.name, ...enchant.alt].sort(() => Math.random() - 0.5);

      let html = `<div class="overlay-header"><span class="overlay-title">✨ 附魔猜猜</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>`;
      html += `<div class="game-hud"><span>✨ 第 ${round}/${maxRounds} 題</span><span>🔥 連續 ${streak}</span><span>💎 <span class="game-hud-val" id="enchScore">${score}</span></span></div>`;
      html += `<div class="ench-table">`;
      html += `<div class="ench-garble">${garbleName(enchant.name)}</div>`;
      html += `<div class="ench-hint">${enchant.desc}</div>`;
      html += `<div class="ench-options">`;
      options.forEach((opt, i) => {
        html += `<button class="ench-opt" data-correct="${opt === enchant.name}" id="enchOpt${i}">${opt}</button>`;
      });
      html += `</div>`;
      html += `<div class="ench-msg" id="enchMsg"></div>`;
      html += `</div>`;

      overlayBox.innerHTML = html;

      // Bind click
      overlayBox.querySelectorAll('.ench-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const correct = btn.dataset.correct === 'true';
          overlayBox.querySelectorAll('.ench-opt').forEach(b => {
            b.disabled = true;
            if (b.dataset.correct === 'true') b.classList.add('ench-correct');
          });
          if (correct) {
            btn.classList.add('ench-correct');
            streak++;
            bestStreak = Math.max(bestStreak, streak);
            const bonus = streak >= 3 ? 3 : streak >= 2 ? 2 : 1;
            score += bonus;
            document.getElementById('enchMsg').textContent = `✅ 正確！${streak >= 3 ? '連續加成！' : ''} +${bonus}`;
            document.getElementById('enchMsg').style.color = '#a8e6cf';
          } else {
            btn.classList.add('ench-wrong');
            streak = 0;
            document.getElementById('enchMsg').textContent = `❌ 答錯了！是「${enchant.name}」`;
            document.getElementById('enchMsg').style.color = '#ff8282';
          }
          document.getElementById('enchScore').textContent = score;

          setTimeout(() => {
            if (round >= maxRounds) endGame();
            else render();
          }, 1500);
        });
      });
    }

    function endGame() {
      const label = score >= 15 ? '附魔大師！✨' : score >= 10 ? '資深附魔師' : score >= 5 ? '魔法學徒' : '多喝點經驗水！';
      overlayBox.innerHTML = `
        <div class="overlay-header"><span class="overlay-title">✨ 附魔猜猜</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>
        <div class="game-result">
          <div class="game-result-emoji">✨</div>
          <div class="game-result-val">${score} 分</div>
          <div class="game-result-text">最高連續答對 ${bestStreak} 題</div>
          <div class="game-result-label">${label}</div>
          <div class="game-result-btns"><button class="btn btn-main" onclick="GAMES_404.enchanting(document.getElementById('overlayBox'))">🔄 再來</button><button class="btn btn-sub" onclick="closeOverlay()">關閉</button></div>
        </div>`;
    }

    score = 0; round = 0; streak = 0; bestStreak = 0; usedEnchants = [];
    render();
  }

  return { crafting, fishing, enchanting };
})();
