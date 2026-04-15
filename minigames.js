// ═══ 404 頁面小遊戲合集 ═══
// 獨立模組，修復所有已知 bug + 全面重設計

const MINIGAMES = (() => {
  'use strict';

  let gameTimer = null;
  let cleanupFns = [];

  function clearTimers() {
    clearInterval(gameTimer);
    cleanupFns.forEach(fn => fn());
    cleanupFns = [];
  }

  // ═══════════════════════════════════════════
  // 🃏 記憶翻牌 (Memory Match) — 修復 + 重設計
  // ═══════════════════════════════════════════
  function memory(overlayBox) {
    clearTimers();
    const EMOJIS = ['🐟','🐠','🐡','🦈','🐙','🦑','🦐','🐬','🐳','🐋','🦭','🐚','🐢','🦀','🦞','🪸'];
    // 隨機選 8 種（修復: 不再固定取前 8 個）
    const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5);
    const pairs = shuffled.slice(0, 8);
    const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);

    let html = `<div class="overlay-header"><span class="overlay-title">🃏 記憶翻牌</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-hud"><span>🎯 配對: <span class="game-hud-val" id="memPairs">0</span>/8</span><span>⏱ <span class="game-hud-val" id="memTime">60</span>s</span><span>🔄 翻牌: <span class="game-hud-val" id="memFlips">0</span></span></div>`;
    html += '<div class="mem-grid" id="memGrid">';
    cards.forEach((emoji, i) => html += `<div class="mem-card" data-emoji="${emoji}" data-idx="${i}" onclick="MINIGAMES._flipCard(this)"><div class="back">?</div><div class="front">${emoji}</div></div>`);
    html += '</div>';
    overlayBox.innerHTML = html;

    let flipped = [], matched = 0, locked = false, timeLeft = 60, flips = 0, running = false;

    window._flipCard = (card) => {
      if (!running) { running = true; startTimer(); }
      if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      flipped.push(card);
      flips++;
      const flipsEl = document.getElementById('memFlips');
      if (flipsEl) flipsEl.textContent = flips;

      if (flipped.length === 2) {
        locked = true;
        const [a, b] = flipped;
        if (a.dataset.emoji === b.dataset.emoji) {
          a.classList.add('matched');
          b.classList.add('matched');
          matched++;
          const pairsEl = document.getElementById('memPairs');
          if (pairsEl) pairsEl.textContent = matched;
          flipped = [];
          locked = false;
          if (matched === 8) {
            clearInterval(gameTimer);
            const bonus = Math.max(0, timeLeft);
            MINIGAMES.showResult('🧠', `完成！`, `${flips} 次翻牌 · +${bonus} 秒獎勵`, 'memory');
          }
        } else {
          setTimeout(() => {
            a.classList.remove('flipped');
            b.classList.remove('flipped');
            flipped = [];
            locked = false;
          }, 600);
        }
      }
    };

    function startTimer() {
      gameTimer = setInterval(() => {
        timeLeft--;
        const el = document.getElementById('memTime');
        if (el) {
          el.textContent = timeLeft;
          if (timeLeft <= 10) el.style.color = '#ff8282';
        }
        if (timeLeft <= 0) {
          clearInterval(gameTimer);
          MINIGAMES.showResult('🃏', '時間到！', `${matched}/8 配對 · ${flips} 次翻牌`, 'memory');
        }
      }, 1000);
      cleanupFns.push(() => clearInterval(gameTimer));
    }
  }

  // ═══════════════════════════════════════════
  // ⏱️ 反應測試 (Reaction Time) — 修復
  // ═══════════════════════════════════════════
  function react(overlayBox) {
    clearTimers();
    let html = `<div class="overlay-header"><span class="overlay-title">⏱️ 反應測試</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += '<div class="react-zone wait" id="reactZone" onclick="MINIGAMES._reactClick()"><div class="react-text" id="reactText">點擊開始</div></div>';
    html += '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.2);margin-top:8px">越快越好！平均反應速度約 250ms</div>';
    overlayBox.innerHTML = html;

    let phase = 'idle', startTime = 0, results = [], pendingTimeout = null;

    window._reactClick = () => {
      const zone = document.getElementById('reactZone');
      const text = document.getElementById('reactText');
      if (!zone || !text) return;

      if (phase === 'idle') {
        phase = 'waiting';
        zone.className = 'react-zone wait';
        text.textContent = '等待綠色...';
        const delay = 1500 + Math.random() * 3000;
        pendingTimeout = setTimeout(() => {
          if (phase !== 'waiting') return;
          phase = 'go';
          zone.className = 'react-zone go';
          text.textContent = '點！';
          startTime = Date.now();
        }, delay);
        cleanupFns.push(() => clearTimeout(pendingTimeout));
      } else if (phase === 'waiting') {
        clearTimeout(pendingTimeout);
        phase = 'idle';
        zone.className = 'react-zone result';
        text.innerHTML = '<span style="color:#ff8282">太早了！</span><br><small style="color:rgba(255,255,255,0.3)">點擊重試</small>';
      } else if (phase === 'go') {
        const ms = Date.now() - startTime;
        results.push(ms);
        const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
        const best = Math.min(...results);
        phase = 'result';
        zone.className = 'react-zone result';
        const grade = ms < 180 ? '🏆 超人反應' : ms < 220 ? '⚡ 非常快' : ms < 280 ? '💨 不錯' : ms < 350 ? '👍 普通' : '🐢 再練練';
        text.innerHTML = `<div class="react-ms">${ms}ms</div><div style="font-size:0.78rem;margin-top:4px;color:rgba(255,255,255,0.5)">${grade}</div><div style="font-size:0.68rem;color:rgba(255,255,255,0.25);margin-top:6px">平均 ${avg}ms · 最快 ${best}ms · 第${results.length}次</div><div style="font-size:0.65rem;color:rgba(255,255,255,0.15);margin-top:8px">點擊繼續</div>`;
      } else if (phase === 'result') {
        phase = 'idle';
        react(overlayBox);
      }
    };
  }

  // ═══════════════════════════════════════════
  // ⚫⚪ 五子棋 (Gomoku) — 替代井字棋
  // ═══════════════════════════════════════════
  function gomoku(overlayBox) {
    clearTimers();
    const SIZE = 9;
    let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    let over = false, playerTurn = true;

    let html = `<div class="overlay-header"><span class="overlay-title">⚫ 五子棋</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="gomoku-grid" id="gomokuGrid">`;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        html += `<div class="gomoku-cell" data-r="${r}" data-c="${c}" onclick="MINIGAMES._gomokuClick(${r},${c})"></div>`;
      }
    }
    html += `</div><div class="gomoku-status" id="gomokuStatus">你的回合（⚫ 黑子）</div><button class="gomoku-reset" onclick="MINIGAMES.gomoku(document.getElementById('overlayBox'))">🔄 重新開始</button>`;
    overlayBox.innerHTML = html;

    const DIRS = [[0,1],[1,0],[1,1],[1,-1]];

    function checkWin(r, c, p) {
      for (const [dr, dc] of DIRS) {
        let count = 1;
        for (let d = -1; d <= 1; d += 2) {
          let nr = r + dr * d, nc = c + dc * d;
          while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === p) {
            count++;
            nr += dr * d;
            nc += dc * d;
          }
        }
        if (count >= 5) return true;
      }
      return false;
    }

    function boardFull() {
      return board.every(row => row.every(cell => cell !== null));
    }

    function aiMove() {
      if (over) return;
      // Simple AI: find best scoring position
      let bestScore = -1, bestMoves = [];

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] !== null) continue;
          let score = scorePosition(r, c);
          if (score > bestScore) {
            bestScore = score;
            bestMoves = [{ r, c }];
          } else if (score === bestScore) {
            bestMoves.push({ r, c });
          }
        }
      }

      if (bestMoves.length === 0) return;
      const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      board[move.r][move.c] = 'o';

      const cells = document.querySelectorAll('.gomoku-cell');
      const idx = move.r * SIZE + move.c;
      cells[idx].textContent = '○';
      cells[idx].classList.add('o');

      if (checkWin(move.r, move.c, 'o')) {
        over = true;
        document.getElementById('gomokuStatus').textContent = '電腦贏了！🤖';
        return;
      }
      if (boardFull()) {
        over = true;
        document.getElementById('gomokuStatus').textContent = '🤝 平手！';
        return;
      }
      playerTurn = true;
      document.getElementById('gomokuStatus').textContent = '你的回合（⚫ 黑子）';
    }

    function scorePosition(r, c) {
      let score = 0;
      // Check what placing 'o' or 'x' here would yield
      for (const [dr, dc] of DIRS) {
        // Offensive: count o's in line
        let oCount = 1, oOpen = 0;
        for (let d = -1; d <= 1; d += 2) {
          let nr = r + dr * d, nc = c + dc * d;
          while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === 'o') {
            oCount++;
            nr += dr * d;
            nc += dc * d;
          }
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === null) oOpen++;
        }
        // Defensive: count x's in line
        let xCount = 1, xOpen = 0;
        for (let d = -1; d <= 1; d += 2) {
          let nr = r + dr * d, nc = c + dc * d;
          while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === 'x') {
            xCount++;
            nr += dr * d;
            nc += dc * d;
          }
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === null) xOpen++;
        }

        // Scoring
        const oScore = oOpen > 0 ? Math.pow(10, oCount) : 0;
        const xScore = xOpen > 0 ? Math.pow(10, xCount) * 0.9 : 0;
        score += oScore + xScore;
      }
      // Prefer center
      score += (SIZE - Math.abs(r - 4) - Math.abs(c - 4)) * 0.5;
      return score;
    }

    window._gomokuClick = (r, c) => {
      if (board[r][c] || over || !playerTurn) return;
      board[r][c] = 'x';
      const cells = document.querySelectorAll('.gomoku-cell');
      const idx = r * SIZE + c;
      cells[idx].textContent = '●';
      cells[idx].classList.add('x');

      if (checkWin(r, c, 'x')) {
        over = true;
        document.getElementById('gomokuStatus').textContent = '🎉 你贏了！';
        return;
      }
      if (boardFull()) {
        over = true;
        document.getElementById('gomokuStatus').textContent = '🤝 平手！';
        return;
      }
      playerTurn = false;
      document.getElementById('gomokuStatus').textContent = '電腦思考中...';
      setTimeout(aiMove, 300 + Math.random() * 300);
    };
  }

  // ═══════════════════════════════════════════
  // 🔢 數字記憶 (Number Memory) — 修復
  // ═══════════════════════════════════════════
  function nummem(overlayBox) {
    clearTimers();
    let level = 1;

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🔢 數字記憶</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="num-mem">
        <div class="num-label" id="numPhase">記住這串數字</div>
        <div class="num-display" id="numDisp"></div>
        <input class="num-input" id="numInput" style="display:none" placeholder="輸入數字..." maxlength="20" autocomplete="off" inputmode="numeric">
        <button class="btn btn-main" id="numBtn" onclick="MINIGAMES._numStart()">開始第 ${level} 關</button>
        <div class="num-level">當前關卡: ${level} · ${level} 位數</div>
      </div>`;
      overlayBox.innerHTML = html;
    }
    render();

    window._numStart = () => {
      let sequence = '';
      for (let i = 0; i < level; i++) sequence += Math.floor(Math.random() * 10);

      const disp = document.getElementById('numDisp');
      const input = document.getElementById('numInput');
      const btn = document.getElementById('numBtn');
      const phase = document.getElementById('numPhase');

      disp.textContent = sequence;
      disp.style.color = '#9dafff';
      phase.textContent = '記住這串數字';
      input.style.display = 'none';
      btn.style.display = 'none';

      const showTime = 1000 + level * 600;
      const hideTimeout = setTimeout(() => {
        disp.textContent = '· '.repeat(level).trim();
        disp.style.color = 'rgba(157,175,255,0.15)';
        phase.textContent = '輸入你看到的數字';
        input.style.display = '';
        input.value = '';
        input.focus();
        btn.textContent = '確認';
        btn.style.display = '';
        btn.onclick = () => check(sequence);
      }, showTime);
      cleanupFns.push(() => clearTimeout(hideTimeout));

      function check(answer) {
        if (input.value === answer) {
          level++;
          disp.textContent = '✅';
          disp.style.color = '#a8e6cf';
          phase.textContent = '正確！';
          input.style.display = 'none';
          btn.textContent = `第 ${level} 關 →`;
          btn.onclick = () => render() || window._numStart();
          // Auto re-render
          setTimeout(() => { render(); window._numStart(); }, 800);
        } else {
          disp.textContent = `❌ 答案: ${answer}`;
          disp.style.color = '#ff8282';
          phase.textContent = `闖到第 ${level} 關`;
          input.style.display = 'none';
          btn.textContent = '重新開始';
          btn.onclick = () => { level = 1; render(); };
        }
      }
    };
  }

  // ═══════════════════════════════════════════
  // 🐍 貪吃蛇 (Snake) — 修復 + 重設計
  // ═══════════════════════════════════════════
  function snake(overlayBox) {
    clearTimers();
    const CELL = 16, COLS = 18, ROWS = 14;
    const W = COLS * CELL, H = ROWS * CELL;

    let html = `<div class="overlay-header"><span class="overlay-title">🐍 貪吃蛇</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-hud"><span>🍎 <span class="game-hud-val" id="snakeScore">0</span></span><span>最高: <span class="game-hud-val" id="snakeBest">${parseInt(localStorage.getItem('sw-snake-best') || '0')}</span></span></div>`;
    html += `<div class="snake-wrap"><canvas class="snake-canvas" id="snakeCanvas" width="${W}" height="${H}"></canvas>`;
    html += `<div class="snake-controls"><div class="snake-ctrl-row"><button class="snake-ctrl" onclick="MINIGAMES._snakeDir(0,-1)">▲</button></div><div class="snake-ctrl-row"><button class="snake-ctrl" onclick="MINIGAMES._snakeDir(-1,0)">◀</button><button class="snake-ctrl" onclick="MINIGAMES._snakeDir(0,1)">▼</button><button class="snake-ctrl" onclick="MINIGAMES._snakeDir(1,0)">▶</button></div></div>`;
    html += '<div style="font-size:0.68rem;color:rgba(255,255,255,0.25);margin-top:6px">鍵盤方向鍵 / WASD 或 點擊按鈕</div></div>';
    overlayBox.innerHTML = html;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    let snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
    let dir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 };
    let food = spawnFood();
    let score = 0, best = parseInt(localStorage.getItem('sw-snake-best') || '0'), alive = true;

    function spawnFood() {
      let f, attempts = 0;
      do {
        f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        attempts++;
      } while (snake.some(s => s.x === f.x && s.y === f.y) && attempts < 100);
      return f;
    }

    function draw() {
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, W, H);
      // Grid
      ctx.fillStyle = 'rgba(157,175,255,0.03)';
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
        if ((x + y) % 2 === 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
      // Food
      ctx.font = (CELL - 2) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍎', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2 + 1);
      // Snake
      snake.forEach((s, i) => {
        const alpha = i === 0 ? 1 : Math.max(0.2, 0.7 - (i / snake.length) * 0.5);
        ctx.fillStyle = i === 0 ? '#5eead4' : `rgba(94,234,212,${alpha})`;
        // 修復: 用 fillRect 替代 roundRect（兼容性）
        const r = 3, x = s.x * CELL + 1, y = s.y * CELL + 1, w = CELL - 2, h = CELL - 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
      });
    }

    function tick() {
      if (!alive) return;
      dir = { ...nextDir };
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { die(); return; }
      if (snake.some(s => s.x === head.x && s.y === head.y)) { die(); return; }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snakeScore').textContent = score;
        food = spawnFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function die() {
      alive = false;
      clearInterval(gameTimer);
      if (score > best) { best = score; localStorage.setItem('sw-snake-best', best.toString()); }
      ctx.fillStyle = 'rgba(255,80,80,0.15)';
      ctx.fillRect(0, 0, W, H);
      MINIGAMES.showResult('🐍', score + ' 分', score > 0 && score >= best ? '🎉 新紀錄！' : `最高 ${best} 分`, 'snake');
    }

    window._snakeDir = (dx, dy) => {
      if (dx === -dir.x && dy === -dir.y) return;
      nextDir = { x: dx, y: dy };
    };

    // 修復: 正確清理 keydown 監聽器
    function keyHandler(e) {
      if (!alive || !document.getElementById('overlay')?.classList.contains('active')) {
        document.removeEventListener('keydown', keyHandler);
        return;
      }
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
      if (map[e.key]) { e.preventDefault(); window._snakeDir(...map[e.key]); }
    }
    document.addEventListener('keydown', keyHandler);
    cleanupFns.push(() => document.removeEventListener('keydown', keyHandler));

    draw();
    gameTimer = setInterval(tick, 120);
    cleanupFns.push(() => clearInterval(gameTimer));
  }

  // ═══════════════════════════════════════════
  // 🔴🟢🔵🟡 礦石記憶 (Ore Memory — Simon Says)
  // ═══════════════════════════════════════════
  function simon(overlayBox) {
    clearTimers();
    const ORES = [
      { id: 'redstone', color: '#ff4444', glow: 'rgba(255,68,68,0.4)', name: '紅石', emoji: '🔴' },
      { id: 'emerald', color: '#44dd88', glow: 'rgba(68,221,136,0.4)', name: '綠寶石', emoji: '🟢' },
      { id: 'lapis', color: '#4488ff', glow: 'rgba(68,136,255,0.4)', name: '青金石', emoji: '🔵' },
      { id: 'gold', color: '#ffcc00', glow: 'rgba(255,204,0,0.4)', name: '金礦', emoji: '🟡' },
    ];

    let sequence = [], playerIdx = 0, level = 0, playing = false, inputLocked = true;

    let html = `<div class="overlay-header"><span class="overlay-title">💎 礦石記憶</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-hud"><span>關卡: <span class="game-hud-val" id="simonLevel">0</span></span><span>最高: <span class="game-hud-val" id="simonBest">${parseInt(localStorage.getItem('sw-simon-best') || '0')}</span></span></div>`;
    html += '<div class="simon-grid">';
    ORES.forEach(o => {
      html += `<div class="simon-pad" id="simon-${o.id}" onclick="MINIGAMES._simonHit('${o.id}')" style="--pad-color:${o.color};--pad-glow:${o.glow}"><span class="simon-emoji">${o.emoji}</span><span class="simon-name">${o.name}</span></div>`;
    });
    html += '</div>';
    html += `<div class="simon-status" id="simonStatus">點擊開始</div>`;
    overlayBox.innerHTML = html;

    window._simonHit = (id) => {
      if (inputLocked) {
        if (!playing) { playing = true; nextRound(); }
        return;
      }
      flash(id, 200);
      if (id === sequence[playerIdx]) {
        playerIdx++;
        if (playerIdx >= sequence.length) {
          inputLocked = true;
          document.getElementById('simonStatus').textContent = '✅ 正確！';
          setTimeout(nextRound, 800);
        }
      } else {
        inputLocked = true;
        const best = Math.max(level - 1, parseInt(localStorage.getItem('sw-simon-best') || '0'));
        localStorage.setItem('sw-simon-best', best.toString());
        document.getElementById('simonStatus').textContent = `❌ 錯誤！闖到第 ${level} 關`;
        // Flash all red
        ORES.forEach(o => flash(o.id, 500));
        setTimeout(() => MINIGAMES.showResult('💎', `${level - 1} 關`, `最高 ${best} 關`, 'simon'), 1000);
      }
    };

    function nextRound() {
      level++;
      playerIdx = 0;
      document.getElementById('simonLevel').textContent = level;
      document.getElementById('simonStatus').textContent = '記住順序...';
      sequence.push(ORES[Math.floor(Math.random() * 4)].id);
      playSequence();
    }

    function playSequence() {
      inputLocked = true;
      let i = 0;
      const iv = setInterval(() => {
        if (i > 0) unflash(sequence[i - 1]);
        if (i >= sequence.length) {
          clearInterval(iv);
          unflash(sequence[i - 1]);
          inputLocked = false;
          document.getElementById('simonStatus').textContent = '你的回合！';
          return;
        }
        flash(sequence[i], 400);
        i++;
      }, 600);
      cleanupFns.push(() => clearInterval(iv));
    }

    function flash(id, duration) {
      const el = document.getElementById('simon-' + id);
      if (el) el.classList.add('active');
      if (duration) setTimeout(() => unflash(id), duration);
    }
    function unflash(id) {
      const el = document.getElementById('simon-' + id);
      if (el) el.classList.remove('active');
    }
  }

  // ═══════════════════════════════════════════
  // 🧱 方塊消除 (Block Crush — Match 4×4)
  // ═══════════════════════════════════════════
  function blockcrush(overlayBox) {
    clearTimers();
    const BLOCKS = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧'];
    const SIZE = 4;
    let grid = [], score = 0, timeLeft = 60, selected = null, moves = 0;

    function initGrid() {
      grid = [];
      for (let r = 0; r < SIZE; r++) {
        grid[r] = [];
        for (let c = 0; c < SIZE; c++) {
          grid[r][c] = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
        }
      }
      // Ensure no initial matches
      while (findMatches().length > 0) {
        for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
          if (findMatches().some(m => m.r === r && m.c === c)) {
            grid[r][c] = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
          }
        }
      }
    }

    function findMatches() {
      const matches = [];
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
        // Horizontal
        if (c <= SIZE - 3 && grid[r][c] && grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
          matches.push({ r, c }, { r, c: c + 1 }, { r, c: c + 2 });
        }
        // Vertical
        if (r <= SIZE - 3 && grid[r][c] && grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
          matches.push({ r, c }, { r: r + 1, c }, { r: r + 2, c });
        }
      }
      // Deduplicate
      return matches.filter((m, i, arr) => arr.findIndex(x => x.r === m.r && x.c === m.c) === i);
    }

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🧱 方塊消除</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>⭐ <span class="game-hud-val" id="bcScore">${score}</span></span><span>⏱ <span class="game-hud-val" id="bcTime">${timeLeft}</span>s</span><span>🔄 <span class="game-hud-val">${moves}</span></span></div>`;
      html += '<div class="bc-grid" id="bcGrid">';
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const b = grid[r][c] || '';
          const sel = selected && selected.r === r && selected.c === c ? ' selected' : '';
          html += `<div class="bc-cell${sel}" data-r="${r}" data-c="${c}" onclick="MINIGAMES._bcClick(${r},${c})">${b}</div>`;
        }
      }
      html += '</div>';
      html += '<div class="bc-hint" id="bcHint">交換相鄰方塊，連成 3 個相同消除</div>';
      overlayBox.innerHTML = html;
    }

    window._bcClick = (r, c) => {
      if (!grid[r][c]) return;
      if (!selected) {
        selected = { r, c };
        render();
      } else {
        const dr = Math.abs(selected.r - r), dc = Math.abs(selected.c - c);
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
          // Swap
          [grid[selected.r][selected.c], grid[r][c]] = [grid[r][c], grid[selected.r][selected.c]];
          moves++;
          const matches = findMatches();
          if (matches.length > 0) {
            score += matches.length * 10;
            matches.forEach(m => grid[m.r][m.c] = null);
            // Gravity
            for (let c2 = 0; c2 < SIZE; c2++) {
              let write = SIZE - 1;
              for (let r2 = SIZE - 1; r2 >= 0; r2--) {
                if (grid[r2][c2]) {
                  grid[write][c2] = grid[r2][c2];
                  if (write !== r2) grid[r2][c2] = null;
                  write--;
                }
              }
              for (let r2 = write; r2 >= 0; r2--) grid[r2][c2] = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
            }
            // Chain check
            while (findMatches().length > 0) {
              const chain = findMatches();
              score += chain.length * 15;
              chain.forEach(m => grid[m.r][m.c] = null);
              for (let c2 = 0; c2 < SIZE; c2++) {
                let write = SIZE - 1;
                for (let r2 = SIZE - 1; r2 >= 0; r2--) {
                  if (grid[r2][c2]) {
                    grid[write][c2] = grid[r2][c2];
                    if (write !== r2) grid[r2][c2] = null;
                    write--;
                  }
                }
                for (let r2 = write; r2 >= 0; r2--) grid[r2][c2] = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
              }
            }
          } else {
            // Swap back
            [grid[selected.r][selected.c], grid[r][c]] = [grid[r][c], grid[selected.r][selected.c]];
            moves--;
          }
          selected = null;
          render();
          const scoreEl = document.getElementById('bcScore');
          if (scoreEl) scoreEl.textContent = score;
        } else {
          selected = { r, c };
          render();
        }
      }
    };

    initGrid();
    render();

    gameTimer = setInterval(() => {
      timeLeft--;
      const el = document.getElementById('bcTime');
      if (el) {
        el.textContent = timeLeft;
        if (timeLeft <= 10) el.style.color = '#ff8282';
      }
      if (timeLeft <= 0) {
        clearInterval(gameTimer);
        MINIGAMES.showResult('🧱', score + ' 分', `${moves} 次交換`, 'blockcrush');
      }
    }, 1000);
    cleanupFns.push(() => clearInterval(gameTimer));
  }

  // ═══════════════════════════════════════════
  // 🎯 射擊場 (Shooting Gallery)
  // ═══════════════════════════════════════════
  function shooting(overlayBox) {
    clearTimers();
    const MOBS = [
      { emoji: '💀', pts: 10, speed: 3 },
      { emoji: '🧟', pts: 10, speed: 2.5 },
      { emoji: '🕷️', pts: 15, speed: 2 },
      { emoji: '👻', pts: 20, speed: 1.5 },
      { emoji: '🐉', pts: 30, speed: 1 },
      { emoji: '💎', pts: 50, speed: 0.8 },
    ];
    const FRIENDLY = [
      { emoji: '🐔', penalty: -20 },
      { emoji: '🐷', penalty: -15 },
      { emoji: '🐄', penalty: -15 },
      { emoji: '🐱', penalty: -25 },
      { emoji: '🐑', penalty: -15 },
    ];

    let score = 0, timeLeft = 20, shots = 0, hits = 0;

    let html = `<div class="overlay-header"><span class="overlay-title">🎯 射擊場</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-hud"><span>🎯 <span class="game-hud-val" id="shootScore">0</span></span><span>⏱ <span class="game-hud-val" id="shootTime">20</span>s</span><span>命中: <span class="game-hud-val" id="shootHits">0</span>/${shots}</span></div>`;
    html += '<div class="shoot-range" id="shootRange"></div>';
    html += '<div class="shoot-hint">打怪物加分！不要打動物！</div>';
    overlayBox.innerHTML = html;

    const range = document.getElementById('shootRange');

    function spawnTarget() {
      if (timeLeft <= 0) return;
      const isFriendly = Math.random() < 0.2;
      const pool = isFriendly ? FRIENDLY : MOBS;
      const target = pool[Math.floor(Math.random() * pool.length)];

      const el = document.createElement('div');
      el.className = `shoot-target ${isFriendly ? 'friendly' : 'hostile'}`;
      el.textContent = target.emoji;

      // Random position
      const top = 10 + Math.random() * 70;
      const leftToRight = Math.random() > 0.5;
      el.style.top = top + '%';

      if (leftToRight) {
        el.style.left = '-40px';
        el.style.animation = `shoot-fly-right ${target.speed || 2}s linear forwards`;
      } else {
        el.style.right = '-40px';
        el.style.animation = `shoot-fly-left ${target.speed || 2}s linear forwards`;
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        shots++;
        if (isFriendly) {
          score = Math.max(0, score + target.penalty);
          el.textContent = '💥';
          el.style.color = '#ff8282';
        } else {
          score += target.pts;
          hits++;
          el.textContent = '💥';
          el.style.color = '#a8e6cf';
        }
        updateHUD();
        el.style.pointerEvents = 'none';
        setTimeout(() => el.remove(), 300);
      });

      range.appendChild(el);
      setTimeout(() => el.remove(), (target.speed || 2) * 1000 + 100);
    }

    function updateHUD() {
      const sEl = document.getElementById('shootScore');
      const hEl = document.getElementById('shootHits');
      if (sEl) sEl.textContent = score;
      if (hEl) hEl.textContent = `${hits}/${shots}`;
    }

    const spawnIv = setInterval(spawnTarget, 600);
    cleanupFns.push(() => clearInterval(spawnIv));

    gameTimer = setInterval(() => {
      timeLeft--;
      const el = document.getElementById('shootTime');
      if (el) el.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(gameTimer);
        clearInterval(spawnIv);
        const pct = shots > 0 ? Math.round(hits / shots * 100) : 0;
        MINIGAMES.showResult('🎯', score + ' 分', `命中率 ${pct}% (${hits}/${shots})`, 'shooting');
      }
    }, 1000);
    cleanupFns.push(() => clearInterval(gameTimer));
  }

  // ═══════════════════════════════════════════
  // 💣 礦洞掃雷 (Minesweeper) — Minecraft 風格
  // ═══════════════════════════════════════════
  function minesweeper(overlayBox) {
    clearTimers();
    const ROWS = 9, COLS = 9, MINE_COUNT = 10;
    const ORE_ICONS = ['','🪨','💎','🔴','🟢','🔵','🟡','🟣','🟤'];
    const MINE_EMOJI = '💣';
    let grid = [], revealed = [], flagged = [], gameOver = false, won = false, firstClick = true, timeLeft = 0, flagsUsed = 0;

    function init() {
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
      flagged = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
      gameOver = false; won = false; firstClick = true; flagsUsed = 0; timeLeft = 0;
    }

    function placeMines(safeR, safeC) {
      let placed = 0;
      while (placed < MINE_COUNT) {
        const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
        if (grid[r][c] !== -1 && !(Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) {
          grid[r][c] = -1;
          placed++;
        }
      }
      // Calculate numbers
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (grid[r][c] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === -1) count++;
        }
        grid[r][c] = count;
      }
    }

    function floodReveal(r, c) {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || revealed[r][c] || flagged[r][c]) return;
      revealed[r][c] = true;
      if (grid[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) floodReveal(r + dr, c + dc);
      }
    }

    function checkWin() {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (grid[r][c] !== -1 && !revealed[r][c]) return false;
      }
      return true;
    }

    function render() {
      const flagsLeft = MINE_COUNT - flagsUsed;
      let html = `<div class="overlay-header"><span class="overlay-title">💣 礦洞掃雷</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>💣 <span class="game-hud-val" id="msFlags">${flagsLeft}</span></span><span>⏱ <span class="game-hud-val" id="msTime">${timeLeft}</span>s</span></div>`;
      html += '<div class="ms-grid" id="msGrid" oncontextmenu="event.preventDefault()">';
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const isRevealed = revealed[r][c];
        const isFlagged = flagged[r][c];
        let content = '', cls = 'ms-cell';
        if (gameOver && grid[r][c] === -1 && !isFlagged) {
          content = MINE_EMOJI;
          cls += ' ms-revealed ms-mine';
        } else if (isRevealed) {
          cls += ' ms-revealed';
          const val = grid[r][c];
          if (val === -1) { content = MINE_EMOJI; cls += ' ms-mine'; }
          else if (val > 0) { content = ORE_ICONS[val] || val; cls += ` ms-num ms-num-${val}`; }
        } else if (isFlagged) {
          content = '🚩';
          cls += ' ms-flagged';
        }
        html += `<div class="${cls}" data-r="${r}" data-c="${c}" onclick="MINIGAMES._msClick(${r},${c})" oncontextmenu="event.preventDefault();MINIGAMES._msRight(${r},${c})">${content}</div>`;
      }
      html += '</div>';
      html += `<div class="ms-hint">${gameOver ? (won ? '🎉 掃雷成功！安全通關！' : '💥 踩到礦了！') : '左鍵翻開 · 右鍵插旗 · 小心地雷'}</div>`;
      if (gameOver) html += `<div class="game-result-btns" style="margin-top:10px"><button class="btn btn-main" onclick="MINIGAMES.minesweeper(document.getElementById('overlayBox'))">🔄 再來一局</button></div>`;
      overlayBox.innerHTML = html;
    }

    window._msClick = (r, c) => {
      if (gameOver || flagged[r][c]) return;
      if (firstClick) {
        firstClick = false;
        placeMines(r, c);
        gameTimer = setInterval(() => { timeLeft++; const el = document.getElementById('msTime'); if (el) el.textContent = timeLeft; }, 1000);
        cleanupFns.push(() => clearInterval(gameTimer));
      }
      if (revealed[r][c]) return;
      if (grid[r][c] === -1) {
        // Hit mine
        gameOver = true;
        clearInterval(gameTimer);
        revealed[r][c] = true;
        render();
        return;
      }
      floodReveal(r, c);
      if (checkWin()) {
        gameOver = true; won = true;
        clearInterval(gameTimer);
      }
      render();
    };

    window._msRight = (r, c) => {
      if (gameOver || revealed[r][c]) return;
      if (flagged[r][c]) { flagged[r][c] = false; flagsUsed--; }
      else if (flagsUsed < MINE_COUNT) { flagged[r][c] = true; flagsUsed++; }
      render();
    };

    init();
    render();
  }

  // ═══════════════════════════════════════════
  // 🔢 2048 礦石版 (2048 Ore Merge)
  // ═══════════════════════════════════════════
  function merge2048(overlayBox) {
    clearTimers();
    const SIZE = 4;
    const TILES = {
      2: { emoji: '🪨', label: '石頭', color: 'rgba(140,130,120,0.3)' },
      4: { emoji: '🪨', label: '礫石', color: 'rgba(160,150,140,0.35)' },
      8: { emoji: '🟫', label: '煤炭', color: 'rgba(100,90,80,0.4)' },
      16: { emoji: '🟤', label: '鐵礦', color: 'rgba(180,160,140,0.4)' },
      32: { emoji: '🟡', label: '金礦', color: 'rgba(220,180,50,0.35)' },
      64: { emoji: '🔴', label: '紅石', color: 'rgba(220,60,60,0.35)' },
      128: { emoji: '💎', label: '鑽石', color: 'rgba(100,200,240,0.35)' },
      256: { emoji: '🟢', label: '綠寶石', color: 'rgba(80,220,130,0.35)' },
      512: { emoji: '🟣', label: '紫水晶', color: 'rgba(160,100,220,0.35)' },
      1024: { emoji: '🔷', label: '下界合金', color: 'rgba(200,140,80,0.4)' },
      2048: { emoji: '👑', label: '終界之星', color: 'rgba(220,200,80,0.4)' },
      4096: { emoji: '🌟', label: '超新星', color: 'rgba(255,220,100,0.45)' },
    };

    let grid, score, best;

    function init() {
      grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      score = 0;
      best = parseInt(localStorage.getItem('sw-2048-best') || '0');
      addRandom();
      addRandom();
    }

    function addRandom() {
      const empty = [];
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) empty.push({ r, c });
      if (empty.length === 0) return;
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function slide(row) {
      let arr = row.filter(v => v);
      const merged = [];
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          merged.push(i);
          arr.splice(i + 1, 1);
        }
      }
      while (arr.length < SIZE) arr.push(0);
      return arr;
    }

    function rotateCW(g) {
      const n = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) n[c][SIZE - 1 - r] = g[r][c];
      return n;
    }

    function moveLeft() {
      let moved = false;
      for (let r = 0; r < SIZE; r++) {
        const old = [...grid[r]];
        grid[r] = slide(grid[r]);
        if (grid[r].some((v, i) => v !== old[i])) moved = true;
      }
      return moved;
    }

    function move(dir) {
      // dir: 0=up, 1=right, 2=down, 3=left
      const rotations = [1, 2, 3, 0]; // rotate CW to bring dir to left
      for (let i = 0; i < rotations[dir]; i++) grid = rotateCW(grid);
      const moved = moveLeft();
      for (let i = 0; i < (4 - rotations[dir]) % 4; i++) grid = rotateCW(grid);
      if (moved) {
        addRandom();
        if (score > best) { best = score; localStorage.setItem('sw-2048-best', best.toString()); }
        render();
        if (isGameOver()) {
          MINIGAMES.showResult('🔢', score + ' 分', `最高 ${best} 分`, 'merge2048');
        }
      }
    }

    function isGameOver() {
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return false;
        if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
      }
      return true;
    }

    function getTile(val) {
      if (TILES[val]) return TILES[val];
      return { emoji: '⭐', label: val, color: 'rgba(255,220,100,0.5)' };
    }

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🔢 2048 礦石</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>⭐ <span class="game-hud-val" id="m2048Score">${score}</span></span><span>最高: <span class="game-hud-val">${best}</span></span></div>`;
      html += '<div class="m2048-grid" id="m2048Grid">';
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        const tile = val > 0 ? getTile(val) : null;
        const cls = val > 0 ? `m2048-cell m2048-val-${Math.min(val, 2048)}` : 'm2048-cell';
        const style = tile ? `background:${tile.color}` : '';
        html += `<div class="${cls}" style="${style}">${tile ? `<span class="m2048-emoji">${tile.emoji}</span><span class="m2048-num">${val >= 1000 ? (val/1000).toFixed(1)+'k' : val}</span>` : ''}</div>`;
      }
      html += '</div>';
      html += '<div class="m2048-controls">';
      html += '<div class="m2048-ctrl-row"><button class="m2048-ctrl" onclick="MINIGAMES._m2048(0)">▲</button></div>';
      html += '<div class="m2048-ctrl-row"><button class="m2048-ctrl" onclick="MINIGAMES._m2048(3)">◀</button><button class="m2048-ctrl" onclick="MINIGAMES._m2048(2)">▼</button><button class="m2048-ctrl" onclick="MINIGAMES._m2048(1)">▶</button></div>';
      html += '</div>';
      html += '<div class="m2048-hint">合併相同礦石，目標：終界之星 👑</div>';
      overlayBox.innerHTML = html;
    }

    window._m2048 = (dir) => move(dir);

    function keyHandler(e) {
      if (!document.getElementById('overlay')?.classList.contains('active')) {
        document.removeEventListener('keydown', keyHandler);
        return;
      }
      const map = { ArrowUp: 0, ArrowDown: 2, ArrowLeft: 3, ArrowRight: 1, w: 0, s: 2, a: 3, d: 1 };
      if (map[e.key] !== undefined) { e.preventDefault(); move(map[e.key]); }
    }
    document.addEventListener('keydown', keyHandler);
    cleanupFns.push(() => document.removeEventListener('keydown', keyHandler));

    init();
    render();
  }

  // ═══════════════════════════════════════════
  // ❌⭕ 井字棋 (Tic-Tac-Toe) — 快速對決
  // ═══════════════════════════════════════════
  function tictactoe(overlayBox) {
    clearTimers();
    let board = Array(9).fill(null);
    let over = false, wins = 0, losses = 0, draws = 0;
    const stored = JSON.parse(localStorage.getItem('sw-ttt-record') || '{}');
    wins = stored.w || 0; losses = stored.l || 0; draws = stored.d || 0;

    const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    function render(status) {
      let html = `<div class="overlay-header"><span class="overlay-title">❌ 井字棋</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>你 <span class="game-hud-val">${wins}</span></span><span>平 <span class="game-hud-val">${draws}</span></span><span>AI <span class="game-hud-val">${losses}</span></span></div>`;
      html += '<div class="ttt-grid" id="tttGrid">';
      for (let i = 0; i < 9; i++) {
        const val = board[i] || '';
        const cls = val === 'X' ? 'ttt-cell ttt-x' : val === 'O' ? 'ttt-cell ttt-o' : 'ttt-cell';
        html += `<div class="${cls}" onclick="MINIGAMES._tttClick(${i})">${val === 'X' ? '❌' : val === 'O' ? '⭕' : ''}</div>`;
      }
      html += '</div>';
      html += `<div class="ttt-status" id="tttStatus">${status}</div>`;
      html += `<div class="game-result-btns" style="margin-top:10px"><button class="btn btn-main" onclick="MINIGAMES.tictactoe(document.getElementById('overlayBox'))">🔄 新局</button></div>`;
      overlayBox.innerHTML = html;
    }

    function checkWin(b, p) { return LINES.some(line => line.every(i => b[i] === p)); }
    function boardFull(b) { return b.every(c => c !== null); }

    function aiMove() {
      // Minimax-lite: win > block > center > corner > edge
      // 1. Can AI win?
      for (let i = 0; i < 9; i++) {
        if (board[i] !== null) continue;
        board[i] = 'O';
        if (checkWin(board, 'O')) { board[i] = 'O'; return; }
        board[i] = null;
      }
      // 2. Block player
      for (let i = 0; i < 9; i++) {
        if (board[i] !== null) continue;
        board[i] = 'X';
        if (checkWin(board, 'X')) { board[i] = 'O'; return; }
        board[i] = null;
      }
      // 3. Center
      if (board[4] === null) { board[4] = 'O'; return; }
      // 4. Corners
      const corners = [0, 2, 6, 8].filter(i => board[i] === null);
      if (corners.length > 0) { board[corners[Math.floor(Math.random() * corners.length)]] = 'O'; return; }
      // 5. Edges
      const edges = [1, 3, 5, 7].filter(i => board[i] === null);
      if (edges.length > 0) { board[edges[Math.floor(Math.random() * edges.length)]] = 'O'; return; }
    }

    window._tttClick = (i) => {
      if (board[i] || over) return;
      board[i] = 'X';
      if (checkWin(board, 'X')) {
        over = true; wins++;
        localStorage.setItem('sw-ttt-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🎉 你贏了！');
        return;
      }
      if (boardFull(board)) {
        over = true; draws++;
        localStorage.setItem('sw-ttt-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤝 平手！');
        return;
      }
      aiMove();
      if (checkWin(board, 'O')) {
        over = true; losses++;
        localStorage.setItem('sw-ttt-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤖 電腦贏了！');
        return;
      }
      if (boardFull(board)) {
        over = true; draws++;
        localStorage.setItem('sw-ttt-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤝 平手！');
        return;
      }
      render('你的回合（❌）');
    };

    render('你的回合（❌）');
  }

  // ═══════════════════════════════════════════
  // 🪶 滑翔翼 (Flappy Elytra) — Minecraft 風格
  // ═══════════════════════════════════════════
  function flappy(overlayBox) {
    clearTimers();
    const W = 320, H = 420;
    const GRAVITY = 0.35, JUMP = -6, PIPE_W = 48, GAP = 130, PIPE_SPEED = 2.2, PIPE_INTERVAL = 1600;
    let birdY, birdVY, pipes, score, best, alive, started, lastPipe, animFrame;
    best = parseInt(localStorage.getItem('sw-flappy-best') || '0');

    let html = `<div class="overlay-header"><span class="overlay-title">🪶 滑翔翼</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-hud"><span>⭐ <span class="game-hud-val" id="flappyScore">0</span></span><span>最高: <span class="game-hud-val">${best}</span></span></div>`;
    html += `<div class="flappy-wrap"><canvas class="flappy-canvas" id="flappyCanvas" width="${W}" height="${H}"></canvas>`;
    html += `<div class="flappy-overlay" id="flappyOverlay">🪶 點擊開始</div></div>`;
    html += `<div class="flappy-hint">點擊 / 空白鍵拍翅，穿過縫隙</div>`;
    overlayBox.innerHTML = html;

    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    const overlayEl = document.getElementById('flappyOverlay');

    function init() {
      birdY = H * 0.4; birdVY = 0; pipes = []; score = 0; alive = true; started = false; lastPipe = 0;
      if (overlayEl) { overlayEl.style.display = 'flex'; overlayEl.textContent = '🪶 點擊開始'; }
    }

    function jump() {
      if (!alive) return;
      if (!started) {
        started = true;
        if (overlayEl) overlayEl.style.display = 'none';
        lastPipe = Date.now();
      }
      birdVY = JUMP;
    }

    function spawnPipe() {
      const minTop = 60, maxTop = H - GAP - 60;
      const topH = minTop + Math.random() * (maxTop - minTop);
      pipes.push({ x: W, topH, bottomY: topH + GAP, scored: false });
    }

    function draw() {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0c1f35');
      grad.addColorStop(0.6, '#1a4070');
      grad.addColorStop(1, '#0d2040');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Background clouds
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let i = 0; i < 4; i++) {
        const cx = ((Date.now() / (8000 + i * 2000)) * 40 + i * 90) % (W + 80) - 40;
        ctx.beginPath();
        ctx.ellipse(cx, 60 + i * 50, 40, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pipes (stone/ore style)
      pipes.forEach(p => {
        // Top pipe
        ctx.fillStyle = '#2a3040';
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillStyle = '#3a4256';
        ctx.fillRect(p.x + 2, 0, PIPE_W - 4, p.topH - 8);
        // Top lip
        ctx.fillStyle = '#4a5468';
        ctx.fillRect(p.x - 4, p.topH - 12, PIPE_W + 8, 12);
        // Ore accent on top pipe
        ctx.fillStyle = 'rgba(94,234,212,0.15)';
        ctx.fillRect(p.x + 8, p.topH - 40, PIPE_W - 16, 6);

        // Bottom pipe
        ctx.fillStyle = '#2a3040';
        ctx.fillRect(p.x, p.bottomY, PIPE_W, H - p.bottomY);
        ctx.fillStyle = '#3a4256';
        ctx.fillRect(p.x + 2, p.bottomY + 8, PIPE_W - 4, H - p.bottomY - 8);
        // Bottom lip
        ctx.fillStyle = '#4a5468';
        ctx.fillRect(p.x - 4, p.bottomY, PIPE_W + 8, 12);
        // Ore accent on bottom pipe
        ctx.fillStyle = 'rgba(157,175,255,0.15)';
        ctx.fillRect(p.x + 8, p.bottomY + 16, PIPE_W - 16, 6);
      });

      // Ground
      ctx.fillStyle = '#1a2535';
      ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = '#243040';
      ctx.fillRect(0, H - 20, W, 4);

      // Bird (Elytra + player)
      ctx.save();
      ctx.translate(60, birdY);
      const angle = Math.min(Math.max(birdVY * 4, -30), 60);
      ctx.rotate(angle * Math.PI / 180);

      // Elytra wings
      ctx.fillStyle = '#ab72f9';
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(-20, -10);
      ctx.lineTo(-18, 4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(-20, 10);
      ctx.lineTo(-18, -4);
      ctx.closePath();
      ctx.fill();

      // Player body
      ctx.fillStyle = '#85b1e0';
      ctx.fillRect(-8, -7, 16, 14);
      // Head
      ctx.fillStyle = '#f0ece4';
      ctx.fillRect(-5, -12, 10, 8);
      // Eyes
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-2, -10, 2, 3);
      ctx.fillRect(2, -10, 2, 3);

      ctx.restore();

      // Score display on canvas
      ctx.font = '700 36px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(score, W / 2, 50);
    }

    function tick() {
      if (!alive) return;
      if (!started) { draw(); animFrame = requestAnimationFrame(tick); return; }

      birdVY += GRAVITY;
      birdY += birdVY;

      // Spawn pipes
      if (Date.now() - lastPipe > PIPE_INTERVAL) {
        spawnPipe();
        lastPipe = Date.now();
      }

      // Move pipes
      pipes.forEach(p => p.x -= PIPE_SPEED);
      pipes = pipes.filter(p => p.x > -PIPE_W - 10);

      // Collision
      if (birdY < 0 || birdY > H - 20) { die(); return; }
      const bx = 60, br = 10;
      pipes.forEach(p => {
        if (bx + br > p.x && bx - br < p.x + PIPE_W) {
          if (birdY - br < p.topH || birdY + br > p.bottomY) { die(); return; }
        }
        if (!p.scored && p.x + PIPE_W < bx) {
          p.scored = true;
          score++;
          const el = document.getElementById('flappyScore');
          if (el) el.textContent = score;
        }
      });

      draw();
      animFrame = requestAnimationFrame(tick);
    }

    function die() {
      alive = false;
      cancelAnimationFrame(animFrame);
      if (score > best) { best = score; localStorage.setItem('sw-flappy-best', best.toString()); }
      // Flash
      ctx.fillStyle = 'rgba(255,80,80,0.2)';
      ctx.fillRect(0, 0, W, H);
      if (overlayEl) {
        overlayEl.style.display = 'flex';
        overlayEl.innerHTML = `💀 得分 ${score}<br><small style="font-size:0.7em;opacity:0.5">點擊重試</small>`;
      }
      // Allow restart on click
      canvas.onclick = () => { init(); canvas.onclick = handleInput; animFrame = requestAnimationFrame(tick); };
    }

    function handleInput(e) { e.preventDefault(); jump(); }

    canvas.addEventListener('click', handleInput);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });
    cleanupFns.push(() => { cancelAnimationFrame(animFrame); canvas.removeEventListener('click', handleInput); });

    function keyHandler(e) {
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); jump(); }
    }
    document.addEventListener('keydown', keyHandler);
    cleanupFns.push(() => document.removeEventListener('keydown', keyHandler));

    init();
    animFrame = requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════
  // 🔤 猜礦 (Word Guessing — 5-letter word)
  // ═══════════════════════════════════════════
  function wordle(overlayBox) {
    clearTimers();
    const WORDS = [
      'CRAFT','BUILD','STONE','BLOCK','CREEP','ENDER','DIAMO','NETHR','OCEAN','MINES',
      'SPAWN','CLOUD','TREES','RIVER','HORSE','SHEEP','PIGEL','BLAZE','GHAST','WITCH',
      'DROWN','VILGE','RAIDS','SMITH','FISHG','BREED','EXPLR','CAVES','LAVAF','SNOWL',
      'BAMBO','CACTU','CORAL','SPORE','AMETH','COPPE','DEEPS','LUSHL','AZRAL','WARPD',
    ];
    // Normalize to 5 letters
    const VALID = WORDS.map(w => w.substring(0, 5).toUpperCase()).filter(w => w.length === 5);
    const ANSWER = VALID[Math.floor(Math.random() * VALID.length)];
    const MAX_TRIES = 6;
    let guesses = [], current = '', gameOver = false, won = false;
    // Keyboard state
    let keyState = {}; // letter -> 'correct' | 'present' | 'absent'

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🔤 猜礦</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="wdl-board" id="wdlBoard">`;
      for (let r = 0; r < MAX_TRIES; r++) {
        html += '<div class="wdl-row">';
        const guess = guesses[r] || (r === guesses.length ? current : '');
        for (let c = 0; c < 5; c++) {
          const ch = guess[c] || '';
          let cls = 'wdl-cell';
          if (r < guesses.length) {
            // Evaluated row
            if (guesses[r][c] === ANSWER[c]) cls += ' wdl-correct';
            else if (ANSWER.includes(guesses[r][c])) cls += ' wdl-present';
            else cls += ' wdl-absent';
          } else if (ch) {
            cls += ' wdl-filled';
          }
          html += `<div class="${cls}">${ch}</div>`;
        }
        html += '</div>';
      }
      html += '</div>';

      // Status message
      if (gameOver) {
        html += `<div class="wdl-msg">${won ? `🎉 答對了！${guesses.length}/${MAX_TRIES}` : `❌ 答案是 ${ANSWER}`}</div>`;
        html += `<div class="game-result-btns" style="margin-top:10px"><button class="btn btn-main" onclick="MINIGAMES.wordle(document.getElementById('overlayBox'))">🔄 再來一局</button></div>`;
      } else {
        html += `<div class="wdl-msg">${guesses.length}/${MAX_TRIES} 次機會</div>`;
      }

      // Virtual keyboard
      const rows = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
      html += '<div class="wdl-kb">';
      rows.forEach(row => {
        html += '<div class="wdl-kb-row">';
        for (const ch of row) {
          const st = keyState[ch] || '';
          html += `<button class="wdl-key ${st ? 'wdl-key-' + st : ''}" onclick="MINIGAMES._wdlKey('${ch}')">${ch}</button>`;
        }
        html += '</div>';
      });
      html += '<div class="wdl-kb-row">';
      html += `<button class="wdl-key wdl-key-enter" onclick="MINIGAMES._wdlKey('ENTER')">送出</button>`;
      html += `<button class="wdl-key wdl-key-back" onclick="MINIGAMES._wdlKey('BACK')">⌫</button>`;
      html += '</div></div>';

      overlayBox.innerHTML = html;
    }

    function evaluate(guess) {
      const result = [];
      const ansArr = ANSWER.split('');
      const guessArr = guess.split('');
      // First pass: correct
      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === ansArr[i]) { result[i] = 'correct'; ansArr[i] = null; guessArr[i] = null; }
      }
      // Second pass: present
      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === null) continue;
        const idx = ansArr.indexOf(guessArr[i]);
        if (idx !== -1) { result[i] = 'present'; ansArr[idx] = null; }
        else { result[i] = 'absent'; }
      }
      return result;
    }

    function submitGuess() {
      if (current.length !== 5 || gameOver) return;
      const evalResult = evaluate(current);
      guesses.push(current);
      // Update keyboard state
      for (let i = 0; i < 5; i++) {
        const ch = current[i];
        const prev = keyState[ch];
        if (evalResult[i] === 'correct') keyState[ch] = 'correct';
        else if (evalResult[i] === 'present' && prev !== 'correct') keyState[ch] = 'present';
        else if (!prev) keyState[ch] = 'absent';
      }
      if (current === ANSWER) { won = true; gameOver = true; }
      else if (guesses.length >= MAX_TRIES) { gameOver = true; }
      current = '';
      render();
    }

    window._wdlKey = (key) => {
      if (gameOver) return;
      if (key === 'ENTER') { submitGuess(); return; }
      if (key === 'BACK') { current = current.slice(0, -1); render(); return; }
      if (current.length < 5 && /^[A-Z]$/.test(key)) { current += key; render(); }
    };

    function keyHandler(e) {
      if (!document.getElementById('overlay')?.classList.contains('active')) {
        document.removeEventListener('keydown', keyHandler);
        return;
      }
      if (e.key === 'Enter') { e.preventDefault(); submitGuess(); }
      else if (e.key === 'Backspace') { e.preventDefault(); current = current.slice(0, -1); render(); }
      else if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) { current += e.key.toUpperCase(); render(); }
    }
    document.addEventListener('keydown', keyHandler);
    cleanupFns.push(() => document.removeEventListener('keydown', keyHandler));

    render();
  }

  // ═══════════════════════════════════════════
  // 🍄 打苦力怕 (Whack-a-Creeper)
  // ═══════════════════════════════════════════
  function whack(overlayBox) {
    clearTimers();
    const GRID = 3, TIME = 20;
    let score = 0, timeLeft = TIME, activeHoles = [], combo = 0, misses = 0;
    const MOBS = [
      { emoji: '💚', pts: 10, name: '苦力怕' },
      { emoji: '💀', pts: 15, name: '骷髏' },
      { emoji: '🧟', pts: 10, name: '殭屍' },
      { emoji: '🕷️', pts: 15, name: '蜘蛛' },
      { emoji: '👻', pts: 25, name: '術士' },
    ];
    const FRIENDLY = { emoji: '🐱', penalty: 20, name: '貓咪' };

    function render() {
      let html = `<div class="overlay-header"><span class="overlay-title">🍄 打苦力怕</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>🎯 <span class="game-hud-val" id="whackScore">${score}</span></span><span>🔥 x<span class="game-hud-val" id="whackCombo">${combo}</span></span><span>⏱ <span class="game-hud-val" id="whackTime">${timeLeft}</span>s</span></div>`;
      html += '<div class="whack-grid" id="whackGrid">';
      for (let i = 0; i < GRID * GRID; i++) {
        const active = activeHoles.find(h => h.idx === i);
        const content = active ? active.mob.emoji : '';
        const cls = active ? (active.isFriendly ? 'whack-hole active friendly' : 'whack-hole active') : 'whack-hole';
        html += `<div class="${cls}" onclick="MINIGAMES._whackHit(${i})">${content}</div>`;
      }
      html += '</div>';
      html += `<div class="whack-hint">打怪物加分！不要打 🐱 貓咪！</div>`;
      overlayBox.innerHTML = html;
    }

    function spawn() {
      if (timeLeft <= 0) return;
      // Clear old
      activeHoles = activeHoles.filter(h => Date.now() - h.spawned < 1200);
      if (activeHoles.length >= 3) return;
      const available = [];
      for (let i = 0; i < GRID * GRID; i++) {
        if (!activeHoles.find(h => h.idx === i)) available.push(i);
      }
      if (available.length === 0) return;
      const idx = available[Math.floor(Math.random() * available.length)];
      const isFriendly = Math.random() < 0.15;
      const mob = isFriendly ? FRIENDLY : MOBS[Math.floor(Math.random() * MOBS.length)];
      activeHoles.push({ idx, mob, isFriendly, spawned: Date.now() });
      render();
      // Auto-disappear
      setTimeout(() => {
        activeHoles = activeHoles.filter(h => h.idx !== idx);
        render();
      }, 1000 + Math.random() * 500);
    }

    window._whackHit = (idx) => {
      const hole = activeHoles.find(h => h.idx === idx);
      if (!hole) { combo = 0; misses++; return; }
      activeHoles = activeHoles.filter(h => h.idx !== idx);
      if (hole.isFriendly) {
        score = Math.max(0, score - hole.mob.penalty);
        combo = 0;
      } else {
        combo++;
        const multiplier = Math.min(combo, 5);
        score += hole.mob.pts * multiplier;
      }
      render();
    };

    render();
    const spawnIv = setInterval(spawn, 700);
    cleanupFns.push(() => clearInterval(spawnIv));

    gameTimer = setInterval(() => {
      timeLeft--;
      const el = document.getElementById('whackTime');
      if (el) el.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(gameTimer);
        clearInterval(spawnIv);
        MINIGAMES.showResult('🍄', score + ' 分', `最高連擊 x${combo}`, 'whack');
      }
    }, 1000);
    cleanupFns.push(() => clearInterval(gameTimer));
  }

  // ═══════════════════════════════════════════
  // 🔴🟡 四子棋 (Connect Four vs AI)
  // ═══════════════════════════════════════════
  function connect4(overlayBox) {
    clearTimers();
    const ROWS = 6, COLS = 7;
    let board, over, playerTurn, wins, losses, draws;
    const stored = JSON.parse(localStorage.getItem('sw-c4-record') || '{}');
    wins = stored.w || 0; losses = stored.l || 0; draws = stored.d || 0;

    function init() {
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      over = false; playerTurn = true;
    }

    function render(status) {
      let html = `<div class="overlay-header"><span class="overlay-title">🔴 四子棋</span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
      html += `<div class="game-hud"><span>你 <span class="game-hud-val">${wins}</span></span><span>平 <span class="game-hud-val">${draws}</span></span><span>AI <span class="game-hud-val">${losses}</span></span></div>`;
      // Column buttons
      html += '<div class="c4-col-btns">';
      for (let c = 0; c < COLS; c++) html += `<button class="c4-col-btn" onclick="MINIGAMES._c4Drop(${c})" ${over || !playerTurn ? 'disabled' : ''}>▼</button>`;
      html += '</div>';
      html += '<div class="c4-grid">';
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const val = board[r][c];
        const cls = val === 1 ? 'c4-cell c4-red' : val === 2 ? 'c4-cell c4-yellow' : 'c4-cell';
        html += `<div class="${cls}" data-r="${r}" data-c="${c}" onclick="MINIGAMES._c4Drop(${c})"></div>`;
      }
      html += '</div>';
      html += `<div class="c4-status" id="c4Status">${status}</div>`;
      html += `<div class="game-result-btns" style="margin-top:10px"><button class="btn btn-main" onclick="MINIGAMES.connect4(document.getElementById('overlayBox'))">🔄 新局</button></div>`;
      overlayBox.innerHTML = html;
    }

    function dropPiece(col, player) {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) { board[r][col] = player; return r; }
      }
      return -1;
    }

    function checkWin(player) {
      // Horizontal
      for (let r = 0; r < ROWS; r++) for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true;
      }
      // Vertical
      for (let r = 0; r <= ROWS - 4; r++) for (let c = 0; c < COLS; c++) {
        if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true;
      }
      // Diagonal
      for (let r = 0; r <= ROWS - 4; r++) for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) return true;
      }
      for (let r = 3; r < ROWS; r++) for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) return true;
      }
      return false;
    }

    function boardFull() { return board[0].every(c => c !== 0); }

    function scoreLine(cells, player) {
      let count = 0, empty = 0;
      for (const c of cells) {
        if (c === player) count++;
        else if (c === 0) empty++;
        else return 0; // blocked by opponent
      }
      if (count === 4) return 100000;
      if (count === 3 && empty === 1) return 100;
      if (count === 2 && empty === 2) return 10;
      return count;
    }

    function evalBoard(player) {
      let score = 0;
      const opp = player === 1 ? 2 : 1;
      // Center column preference
      for (let r = 0; r < ROWS; r++) if (board[r][3] === player) score += 3;
      // All lines
      for (let r = 0; r < ROWS; r++) for (let c = 0; c <= COLS - 4; c++) {
        score += scoreLine([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], player);
        score -= scoreLine([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], opp) * 1.1;
      }
      for (let r = 0; r <= ROWS - 4; r++) for (let c = 0; c < COLS; c++) {
        score += scoreLine([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], player);
        score -= scoreLine([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], opp) * 1.1;
      }
      for (let r = 0; r <= ROWS - 4; r++) for (let c = 0; c <= COLS - 4; c++) {
        score += scoreLine([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], player);
        score -= scoreLine([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], opp) * 1.1;
      }
      for (let r = 3; r < ROWS; r++) for (let c = 0; c <= COLS - 4; c++) {
        score += scoreLine([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]], player);
        score -= scoreLine([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]], opp) * 1.1;
      }
      return score;
    }

    function aiMove() {
      if (over) return;
      let bestScore = -Infinity, bestCol = 3;
      // Try each column
      for (let c = 0; c < COLS; c++) {
        const r = dropPiece(c, 2);
        if (r === -1) { board[r]?.[c] && (board[r][c] = 0); continue; }
        if (checkWin(2)) { board[r][c] = 0; bestCol = c; break; }
        const s = evalBoard(2);
        board[r][c] = 0;
        if (s > bestScore) { bestScore = s; bestCol = c; }
      }
      // Try winning move first
      for (let c = 0; c < COLS; c++) {
        const r = dropPiece(c, 2);
        if (r === -1) continue;
        if (checkWin(2)) { board[r][c] = 0; bestCol = c; break; }
        board[r][c] = 0;
      }
      // Block player win
      for (let c = 0; c < COLS; c++) {
        const r = dropPiece(c, 1);
        if (r === -1) continue;
        if (checkWin(1)) { board[r][c] = 0; bestCol = c; break; }
        board[r][c] = 0;
      }
      dropPiece(bestCol, 2);
      if (checkWin(2)) {
        over = true; losses++;
        localStorage.setItem('sw-c4-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤖 AI 贏了！');
        return;
      }
      if (boardFull()) {
        over = true; draws++;
        localStorage.setItem('sw-c4-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤝 平手！');
        return;
      }
      playerTurn = true;
      render('你的回合（🔴）');
    }

    window._c4Drop = (col) => {
      if (over || !playerTurn || board[0][col] !== 0) return;
      dropPiece(col, 1);
      if (checkWin(1)) {
        over = true; wins++;
        localStorage.setItem('sw-c4-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🎉 你贏了！');
        return;
      }
      if (boardFull()) {
        over = true; draws++;
        localStorage.setItem('sw-c4-record', JSON.stringify({ w: wins, l: losses, d: draws }));
        render('🤝 平手！');
        return;
      }
      playerTurn = false;
      render('AI 思考中...');
      setTimeout(aiMove, 300);
    };

    init();
    render('你的回合（🔴）· 點擊欄位落子');
  }

  // ═══════════════════════════════════════════
  // 通用：顯示結果
  // ═══════════════════════════════════════════
  function showResult(emoji, val, text, gameType) {
    let html = `<div class="overlay-header"><span class="overlay-title"></span><button class="overlay-close" onclick="MINIGAMES.close()">✕</button></div>`;
    html += `<div class="game-result">
      <div class="game-result-emoji">${emoji}</div>
      <div class="game-result-val">${val}</div>
      <div class="game-result-text">${text}</div>
      <div class="game-result-btns">
        <button class="btn btn-main" onclick="MINIGAMES._retry('${gameType}')">🔄 再玩一次</button>
        <button class="btn btn-sub" onclick="MINIGAMES.close()">關閉</button>
      </div>
    </div>`;
    document.getElementById('overlayBox').innerHTML = html;
  }

  function close() {
    clearTimers();
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
    document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  }

  function _retry(type) {
    const box = document.getElementById('overlayBox');
    const fn = { memory, gomoku, react, nummem, snake, simon, blockcrush, shooting, minesweeper, merge2048, tictactoe, flappy, wordle, whack, connect4 }[type];
    if (fn) fn(box);
  }

  return {
    memory, gomoku, react, nummem, snake, simon, blockcrush, shooting, minesweeper, merge2048, tictactoe, flappy, wordle, whack, connect4,
    showResult, close,
    // Aliases for internal use
    _flipCard: (c) => window._flipCard?.(c),
    _reactClick: () => window._reactClick?.(),
    _gomokuClick: (r, c) => window._gomokuClick?.(r, c),
    _numStart: () => window._numStart?.(),
    _snakeDir: (dx, dy) => window._snakeDir?.(dx, dy),
    _simonHit: (id) => window._simonHit?.(id),
    _bcClick: (r, c) => window._bcClick?.(r, c),
    _msClick: (r, c) => window._msClick?.(r, c),
    _msRight: (r, c) => window._msRight?.(r, c),
    _m2048: (dir) => window._m2048?.(dir),
    _tttClick: (i) => window._tttClick?.(i),
    _wdlKey: (k) => window._wdlKey?.(k),
    _whackHit: (i) => window._whackHit?.(i),
    _c4Drop: (c) => window._c4Drop?.(c),
    _retry,
  };
})();
