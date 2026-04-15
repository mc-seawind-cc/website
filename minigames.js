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
    const fn = { memory, gomoku, react, nummem, snake, simon, blockcrush, shooting }[type];
    if (fn) fn(box);
  }

  return {
    memory, gomoku, react, nummem, snake, simon, blockcrush, shooting,
    showResult, close,
    // Aliases for internal use
    _flipCard: (c) => window._flipCard?.(c),
    _reactClick: () => window._reactClick?.(),
    _gomokuClick: (r, c) => window._gomokuClick?.(r, c),
    _numStart: () => window._numStart?.(),
    _snakeDir: (dx, dy) => window._snakeDir?.(dx, dy),
    _simonHit: (id) => window._simonHit?.(id),
    _bcClick: (r, c) => window._bcClick?.(r, c),
    _retry,
  };
})();
