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

  // ═══════════════════════════════════════
  //  4. 村民交易 (Villager Trading)
  // ═══════════════════════════════════════
  function trading(overlayBox) {
    const ITEMS = [
      { name: '鑽石劍', emoji: '💎', rarity: 5, value: 24 },
      { name: '附魔金蘋果', emoji: '🍎', rarity: 5, value: 20 },
      { name: '終界珍珠', emoji: '🔮', rarity: 4, value: 16 },
      { name: '地圖', emoji: '🗺️', rarity: 3, value: 12 },
      { name: '鞍', emoji: '🐴', rarity: 4, value: 14 },
      { name: '不死圖騰', emoji: '🏆', rarity: 5, value: 22 },
      { name: '三叉戟', emoji: '🔱', rarity: 4, value: 18 },
      { name: '鞘翅', emoji: '🪶', rarity: 5, value: 26 },
      { name: '唱片 13', emoji: '💿', rarity: 3, value: 10 },
      { name: '望遠鏡', emoji: '🔭', rarity: 2, value: 8 },
      { name: '指南針', emoji: '🧭', rarity: 2, value: 6 },
      { name: '鐵錠×4', emoji: '🪨', rarity: 1, value: 4 },
      { name: '麵包×3', emoji: '🍞', rarity: 1, value: 2 },
      { name: '皮革', emoji: '🟫', rarity: 1, value: 3 },
      { name: '書', emoji: '📖', rarity: 2, value: 5 },
    ];

    const VILLAGERS = [
      { name: '老村民', emoji: '👴', mood: '脾氣不好，不太想賣', markup: 1.6 },
      { name: '胖村民', emoji: '🧑‍🍳', mood: '今天心情不錯！', markup: 1.1 },
      { name: '精明商人', emoji: '🤑', mood: '嘿嘿，你撿不到便宜', markup: 1.8 },
      { name: '懶散村民', emoji: '😴', mood: '隨便啦，差不多就好', markup: 1.0 },
      { name: '小氣村民', emoji: '😤', mood: '這可是好東西！', markup: 1.5 },
      { name: '友善村民', emoji: '😊', mood: '來看看有沒有喜歡的', markup: 1.2 },
    ];

    let budget = 32, score = 0, round = 0, maxRounds = 5;
    let bought = [];

    function pickDeal() {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const villager = VILLAGERS[Math.floor(Math.random() * VILLAGERS.length)];
      const askPrice = Math.ceil(item.value * villager.markup);
      const fairPrice = item.value;
      const stealPrice = Math.max(1, Math.ceil(item.value * 0.6));
      return { item, villager, askPrice, fairPrice, stealPrice };
    }

    function render() {
      if (budget <= 0 || round >= maxRounds) { endGame(); return; }
      const deal = pickDeal();
      round++;

      let html = `<div class="overlay-header"><span class="overlay-title">🤝 村民交易</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>`;
      html += `<div class="game-hud"><span>🤝 第 ${round}/${maxRounds} 輪</span><span>💰 翡翠 <span class="game-hud-val" id="tradeBudget">${budget}</span></span><span>💎 <span class="game-hud-val" id="tradeScore">${score}</span></span></div>`;
      html += `<div class="trade-scene">`;
      html += `<div class="trade-villager"><span class="trade-villager-emoji">${deal.villager.emoji}</span><span class="trade-villager-name">${deal.villager.name}</span><span class="trade-villager-mood">${deal.villager.mood}</span></div>`;
      html += `<div class="trade-item"><span class="trade-item-emoji">${deal.item.emoji}</span><span class="trade-item-name">${deal.item.name}</span></div>`;
      html += `<div class="trade-ask">喊價：<span class="trade-ask-price">${deal.askPrice} 💎</span></div>`;
      html += `<div class="trade-actions">`;

      // Player can offer different prices
      const options = [
        { label: `出 ${deal.askPrice} 💎（接受）`, val: deal.askPrice, type: 'accept' },
        { label: `殺價 ${deal.fairPrice} 💎`, val: deal.fairPrice, type: 'haggle' },
        { label: `硬拗 ${deal.stealPrice} 💎`, val: deal.stealPrice, type: 'steal' },
        { label: '跳過', val: 0, type: 'skip' },
      ];

      options.forEach(opt => {
        const disabled = opt.val > budget ? ' disabled' : '';
        html += `<button class="trade-btn${opt.type === 'accept' ? ' trade-accept' : opt.type === 'steal' ? ' trade-steal' : ''}" data-val="${opt.val}" data-type="${opt.type}"${disabled}>${opt.label}</button>`;
      });

      html += `</div>`;
      html += `<div class="trade-msg" id="tradeMsg"></div>`;
      html += `</div>`;

      if (bought.length) {
        html += `<div class="fish-history">`;
        bought.forEach(b => { html += `<span class="fish-caught" title="${b.name}">${b.emoji}</span>`; });
        html += `</div>`;
      }

      overlayBox.innerHTML = html;

      overlayBox.querySelectorAll('.trade-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.dataset.val);
          const type = btn.dataset.type;
          overlayBox.querySelectorAll('.trade-btn').forEach(b => b.disabled = true);

          if (type === 'skip') {
            showMsg('跳過了...', '#8b949e');
          } else if (type === 'accept') {
            budget -= val;
            score += deal.item.value;
            bought.push(deal.item);
            showMsg(`成交！花 ${val} 💎 買到 ${deal.item.emoji} ${deal.item.name}`, '#a8e6cf');
          } else if (type === 'haggle') {
            // 60% chance to accept haggle
            if (Math.random() < 0.6) {
              budget -= val;
              score += deal.item.value;
              bought.push(deal.item);
              showMsg(`村民接受了！${val} 💎 成交！`, '#a8e6cf');
            } else {
              showMsg('村民搖頭拒絕了你的殺價...', '#ffaa32');
            }
          } else if (type === 'steal') {
            // 25% chance to accept steal
            if (Math.random() < 0.25) {
              budget -= val;
              score += deal.item.value;
              bought.push(deal.item);
              showMsg(`居然答應了？！${val} 💎 就買到！`, '#ab72f9');
            } else {
              showMsg('村民生氣地轉身走了！😤', '#ff8282');
            }
          }

          updateBudget();
          setTimeout(render, 1300);
        });
      });
    }

    function updateBudget() {
      const el = document.getElementById('tradeBudget');
      if (el) el.textContent = budget;
      const scoreEl = document.getElementById('tradeScore');
      if (scoreEl) scoreEl.textContent = score;
    }

    function showMsg(text, color) {
      const el = document.getElementById('tradeMsg');
      if (el) { el.textContent = text; el.style.color = color; }
    }

    function endGame() {
      const label = score >= 60 ? '商業大亨！💰' : score >= 35 ? '精明買家' : score >= 15 ? '普通交易' : '被坑了不少...';
      overlayBox.innerHTML = `
        <div class="overlay-header"><span class="overlay-title">🤝 村民交易</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>
        <div class="game-result">
          <div class="game-result-emoji">🤝</div>
          <div class="game-result-val">${score} 分</div>
          <div class="game-result-text">買了 ${bought.length} 件 · 剩餘 ${budget} 💎</div>
          <div class="game-result-label">${label}</div>
          <div class="game-result-btns"><button class="btn btn-main" onclick="GAMES_404.trading(document.getElementById('overlayBox'))">🔄 再來</button><button class="btn btn-sub" onclick="closeOverlay()">關閉</button></div>
        </div>`;
    }

    budget = 32; score = 0; round = 0; bought = [];
    render();
  }


  // ═══════════════════════════════════════
  //  5. 唱片收集 (Record Collector — Rhythm)
  // ═══════════════════════════════════════
  function records(overlayBox) {
    const LANES = 4;
    const LANE_LABELS = ['💎', '🎵', '🎶', '📀'];
    const GAME_SEC = 30;
    const BPM = 120;
    const BEAT_MS = 60000 / BPM;
    const NOTE_SPEED = 3; // px per frame

    let canvas, ctx, score = 0, combo = 0, maxCombo = 0, misses = 0;
    let notes = [], particles = [];
    let gameOver = false, startTime = 0, animId = null;
    let hitLineY, canvasH = 320, canvasW = 240;
    let spawnTimer = null;

    function init() {
      let html = `<div class="overlay-header"><span class="overlay-title">💿 唱片收集</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>`;
      html += `<div class="game-hud"><span>⏱ <span class="game-hud-val" id="recTime">${GAME_SEC}</span>秒</span><span>🔥 <span class="game-hud-val" id="recCombo">0</span></span><span>💎 <span class="game-hud-val" id="recScore">0</span></span></div>`;
      html += `<div class="rec-wrap"><canvas id="recCanvas" width="${canvasW}" height="${canvasH}"></canvas></div>`;
      html += `<div class="rec-keys">`;
      for (let i = 0; i < LANES; i++) {
        html += `<button class="rec-key" data-lane="${i}" id="recKey${i}">${LANE_LABELS[i]}</button>`;
      }
      html += `</div>`;
      html += `<div class="rec-hint">在音符到達底線時按下對應按鈕！D F J K 也可</div>`;
      overlayBox.innerHTML = html;

      canvas = document.getElementById('recCanvas');
      ctx = canvas.getContext('2d');
      hitLineY = canvasH - 50;

      // Bind key buttons
      overlayBox.querySelectorAll('.rec-key').forEach(btn => {
        btn.addEventListener('click', () => hitLane(parseInt(btn.dataset.lane)));
      });

      // Keyboard controls
      const keyMap = { 'KeyD': 0, 'KeyF': 1, 'KeyJ': 2, 'KeyK': 3 };
      const keyHandler = (e) => {
        if (gameOver) { document.removeEventListener('keydown', keyHandler); return; }
        if (keyMap[e.code] !== undefined) { e.preventDefault(); hitLane(keyMap[e.code]); }
      };
      document.addEventListener('keydown', keyHandler);

      startTime = Date.now();
      gameOver = false;

      // Spawn notes rhythmically
      function scheduleNote() {
        if (gameOver) return;
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= GAME_SEC) { endGame(); return; }

        const lane = Math.floor(Math.random() * LANES);
        notes.push({ lane, y: -20, hit: false, missed: false });

        // Sometimes spawn double
        if (Math.random() < 0.2 && elapsed > 5) {
          let lane2 = (lane + 1 + Math.floor(Math.random() * (LANES - 1))) % LANES;
          notes.push({ lane: lane2, y: -20, hit: false, missed: false });
        }

        // Speed up over time
        const speed = Math.max(0.4, BEAT_MS - elapsed * 8);
        spawnTimer = setTimeout(scheduleNote, speed);
      }

      scheduleNote();
      loop();
    }

    function loop() {
      if (gameOver) { cancelAnimationFrame(animId); return; }
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    function update() {
      const elapsed = (Date.now() - startTime) / 1000;
      const timeLeft = Math.max(0, GAME_SEC - elapsed);
      const timeEl = document.getElementById('recTime');
      if (timeEl) timeEl.textContent = Math.ceil(timeLeft);
      if (timeLeft <= 0) { endGame(); return; }

      // Move notes
      const speed = NOTE_SPEED + elapsed * 0.03;
      notes.forEach(n => {
        if (!n.hit) n.y += speed;
        // Missed
        if (!n.hit && !n.missed && n.y > hitLineY + 30) {
          n.missed = true;
          misses++;
          combo = 0;
          updateHUD();
        }
      });

      // Cleanup
      notes = notes.filter(n => n.y < canvasH + 20 && (!n.hit || n.hitAnim > 0));
      notes.forEach(n => { if (n.hit) n.hitAnim--; });

      // Particles
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; p.vy += 0.1; });
      particles = particles.filter(p => p.life > 0);
    }

    function hitLane(lane) {
      // Flash the key
      const keyEl = document.getElementById(`recKey${lane}`);
      if (keyEl) { keyEl.classList.add('rec-key-hit'); setTimeout(() => keyEl.classList.remove('rec-key-hit'), 150); }

      // Find closest unhit note in this lane near hit line
      let closest = null, closestDist = Infinity;
      notes.forEach(n => {
        if (n.lane === lane && !n.hit && !n.missed) {
          const dist = Math.abs(n.y - hitLineY);
          if (dist < closestDist) { closestDist = dist; closest = n; }
        }
      });

      if (closest && closestDist < 40) {
        closest.hit = true;
        closest.hitAnim = 10;
        combo++;
        maxCombo = Math.max(maxCombo, combo);

        let pts = 1;
        if (closestDist < 10) pts = 3; // Perfect
        else if (closestDist < 20) pts = 2; // Great
        score += pts + Math.floor(combo / 5);

        // Particles
        const laneX = getLaneX(lane);
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: laneX, y: hitLineY,
            vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4 - 1,
            life: 15, color: pts === 3 ? '#a8e6cf' : pts === 2 ? '#9dafff' : '#deac80'
          });
        }
        updateHUD();
      }
    }

    function getLaneX(lane) {
      const laneW = canvasW / LANES;
      return lane * laneW + laneW / 2;
    }

    function updateHUD() {
      const scoreEl = document.getElementById('recScore');
      const comboEl = document.getElementById('recCombo');
      if (scoreEl) scoreEl.textContent = score;
      if (comboEl) {
        comboEl.textContent = combo;
        comboEl.style.color = combo >= 10 ? '#ab72f9' : combo >= 5 ? '#a8e6cf' : '';
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Background
      ctx.fillStyle = '#0a0e1c';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Lane dividers
      const laneW = canvasW / LANES;
      ctx.strokeStyle = 'rgba(157,175,255,0.06)';
      ctx.lineWidth = 1;
      for (let i = 1; i < LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneW, 0);
        ctx.lineTo(i * laneW, canvasH);
        ctx.stroke();
      }

      // Hit line
      ctx.strokeStyle = 'rgba(157,175,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, hitLineY);
      ctx.lineTo(canvasW, hitLineY);
      ctx.stroke();

      // Hit zone glow
      ctx.fillStyle = 'rgba(157,175,255,0.03)';
      ctx.fillRect(0, hitLineY - 20, canvasW, 40);

      // Lane labels at bottom
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < LANES; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillText(LANE_LABELS[i], getLaneX(i), canvasH - 12);
      }

      // Notes
      notes.forEach(n => {
        const x = getLaneX(n.lane);
        if (n.hit) {
          ctx.globalAlpha = n.hitAnim / 10;
          ctx.font = '20px serif';
          ctx.fillText('✨', x, n.y);
          ctx.globalAlpha = 1;
        } else if (n.missed) {
          ctx.globalAlpha = 0.3;
          ctx.font = '18px serif';
          ctx.fillText('💿', x, n.y);
          ctx.globalAlpha = 1;
        } else {
          // Note glow
          const dist = Math.abs(n.y - hitLineY);
          if (dist < 30) {
            ctx.fillStyle = 'rgba(168,230,207,0.1)';
            ctx.beginPath();
            ctx.arc(x, n.y, 16, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.font = '20px serif';
          ctx.fillText('💿', x, n.y);
        }
      });

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life / 15;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function endGame() {
      gameOver = true;
      clearTimeout(spawnTimer);
      cancelAnimationFrame(animId);
      const label = score >= 80 ? '音樂大師！🎵' : score >= 50 ? '節奏高手' : score >= 25 ? '普通玩家' : '再多練練！';
      overlayBox.innerHTML = `
        <div class="overlay-header"><span class="overlay-title">💿 唱片收集</span><button class="overlay-close" onclick="closeOverlay()">✕</button></div>
        <div class="game-result">
          <div class="game-result-emoji">💿</div>
          <div class="game-result-val">${score} 分</div>
          <div class="game-result-text">最高連續 ${maxCombo} · 失誤 ${misses} 次</div>
          <div class="game-result-label">${label}</div>
          <div class="game-result-btns"><button class="btn btn-main" onclick="GAMES_404.records(document.getElementById('overlayBox'))">🔄 再來</button><button class="btn btn-sub" onclick="closeOverlay()">關閉</button></div>
        </div>`;
    }

    score = 0; combo = 0; maxCombo = 0; misses = 0; notes = []; particles = [];
    init();
  }

  return { crafting, fishing, enchanting, trading, records };
})();
