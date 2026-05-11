// 海風浮動工具列 — 音樂播放器 + 回到頂部（重新設計版）

const MUSIC_PLAYER = (() => {
  const PLAYLIST_ID = 'PLefKpFQ8Pvy5aCLAGHD8Zmzsdljos-t2l';
  const STATE_KEY = 'sw-music-state';

  // 完整曲庫（98 首）
  const FALLBACK = [
    { id: 'qq-RGFyaq0U', title: 'Minecraft', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: '05UM-i4PuOY', title: 'Key', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'Gpd85y_iTxY', title: 'Subwoofer Lullaby', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'oGxQNQtnr6Q', title: 'Living Mice', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'laZusNy8QiY', title: 'Haggstrom', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'nz8QEpaGoJg', title: 'Oxygène', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'DZ47H84Bc_Q', title: 'Mice on Venus', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: '4i0d6CPLSGo', title: 'Dry Hands', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'mukiMaOSLEs', title: 'Wet Hands', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'UhWjWdlnmEw', title: 'Clark', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'aBkTkxKDduc', title: 'Sweden', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'SznnVAnkv3c', title: 'Danny', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'lMRziQRmYLI', title: 'Beginning', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'sCvARLz0rjI', title: 'Door', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'e3QPUa5iSds', title: 'Death', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'wnHy42Zh14Y', title: 'Moog City', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: '_14Xf_j_C5o', title: 'Équinoxe', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: '_CSXzPaTgqo', title: 'Chris', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'm4EL70Vs1sE', title: 'Excuse', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'sMOcqXM_d8o', title: 'Dog', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'ONbX9QCL36k', title: 'Droopy likes Ricochet', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'JLAVnDI03To', title: 'Droopy likes your Face', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'YEwf5uuvdns', title: 'Thirteen', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: '9lX-hVpvN3E', title: 'Cat', artist: 'C418', album: 'Minecraft Volume Alpha' },
    { id: 'JQw8MEqhMRA', title: 'Blocks', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'cCibTj6drhM', title: 'Chirp', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'UqKcX87h3c0', title: 'Far', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'xmBfruermmo', title: 'Mall', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'TrYlTm06o-8', title: 'Mellohi', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '0E5l2GHBxB8', title: 'Stal', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'd6tV0cr9zYI', title: 'Strad', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'zqw8FylO_Y8', title: 'Ward', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'sBl9qcaQos4', title: 'Wait', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '0y53iF8BTSU', title: 'Ki', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'C8df2pbOX6g', title: 'Moog City 2', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '5ChvaSe6aK0', title: 'Mutation', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'j1Z_Ihkluek', title: 'Floating Trees', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '2vRBjHY7ReE', title: 'Beginning 2', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'wGQDJNksrAM', title: 'Dead Voxel', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'DwXtbA64lHE', title: 'Concrete Halls', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'tMjk9wgrPAc', title: 'Warmth', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '8VY2RUyY0t4', title: 'Ballad of the Cats', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '77Fv8gtZyuA', title: 'Blind Spots', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '8sglGXAfHLc', title: 'Biome Fest', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'ao8U6D_F3dE', title: 'Haunt Muskie', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'atgjKEgSqSU', title: 'Aria Math', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'Mj6jF7I2s10', title: 'Taswell', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'rbIGUF9QmXg', title: 'Dreiton', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'yuySSmW5cfo', title: 'Flake', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'FVNSvz-UyuA', title: 'Kyoto', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'eh4rVC1Mv0E', title: 'Eleven', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'tC_lJyeGxoA', title: 'Intro', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: '-6mBUPdTmeI', title: 'The End', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'xLfm2nnCOpc', title: 'Alpha', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'aLf9lfbI5Kg', title: '11', artist: 'C418', album: 'Minecraft Volume Beta' },
    { id: 'WmYTrtu-25A', title: 'Shuniji', artist: 'C418', album: 'Update Aquatic' },
    { id: 'f-y4SusrNeU', title: 'Axolotl', artist: 'C418', album: 'Update Aquatic' },
    { id: 'RxHgq2w-RsY', title: 'Dragon Fish', artist: 'C418', album: 'Update Aquatic' },
    { id: 'qHDuedbZYbc', title: 'Chrysopoeia', artist: 'C418', album: 'Nether Update' },
    { id: 'HcvKHX6kK6M', title: 'Rubedo', artist: 'C418', album: 'Nether Update' },
    { id: '32jUaAgflXc', title: 'So Below', artist: 'C418', album: 'Nether Update' },
    { id: 'BTthtlT80Rc', title: 'Pigstep', artist: 'Lena Raine', album: 'Nether Update' },
    { id: 'OuYA_siR8Hc', title: 'Stand Tall', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'hb5TsZcAiJQ', title: 'Left to Bloom', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'TzcwvQ0MDCo', title: 'Ancestry', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'uPM--9Gar60', title: 'Wending', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'y-f8pEX1Q1M', title: 'Infinite Amethyst', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'Y5KFnQYCdsk', title: 'One More Day', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'CG7bdkACNKM', title: 'Floating Dream', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'k79dMVVmvA8', title: 'Comforting Memories', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'VSuIdgr66ho', title: 'An Ordinary Day', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'kK81m-A3qpU', title: 'otherside', artist: 'Lena Raine', album: 'Caves & Cliffs' },
    { id: 'DoUW5ZkblTs', title: 'Firebugs', artist: 'Rush', album: 'Wild Update' },
    { id: 'FMJoOTOBcwE', title: 'Aerie', artist: 'Rush', album: 'Wild Update' },
    { id: 'daVhxk1Yx20', title: 'Labyrinthine', artist: 'Rush', album: 'Wild Update' },
    { id: 'mBRO4iNKSbg', title: 'Five', artist: 'Samuel Åberg', album: 'Trails & Tales' },
    { id: 'Uu3dshFseaU', title: 'Echo in the Wind', artist: 'Rush', album: 'Trails & Tales' },
    { id: 'ec9dLqGOcg0', title: 'A Familiar Room', artist: 'Aaron Cherof', album: 'Trails & Tales' },
    { id: 'TaXlw0OmSOg', title: 'Bromeliad', artist: 'Aaron Cherof', album: 'Trails & Tales' },
    { id: '_lxjp54MMBg', title: 'Crescent Dunes', artist: 'Aaron Cherof', album: 'Trails & Tales' },
    { id: 'x9QP2TWSY0s', title: 'Relic', artist: 'Kumi Tanioka', album: '1.21' },
    { id: 'SLS9tUa2GXI', title: 'Featherfall', artist: 'Amos Roddy', album: '1.21' },
    { id: 'CcAV71mXg_8', title: 'Watcher', artist: 'Amos Roddy', album: '1.21' },
    { id: 'ray1Svv6Sl8', title: 'Puzzlebox', artist: 'Amos Roddy', album: '1.21' },
    { id: 'Y9menjGA86s', title: 'komorebi', artist: 'Amos Roddy', album: '1.21.4' },
    { id: '8ravZ03m55A', title: 'pokopoko', artist: 'Kumi Tanioka', album: '1.21.4' },
    { id: 'Vaak5b8RRaY', title: 'yakusoku', artist: 'Amos Roddy', album: '1.21.4' },
    { id: '6B7PqW2NKeQ', title: 'Deeper', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'G49EncT1T14', title: 'Eld Unknown', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'TRY0tH78Tjk', title: 'Endless', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'Qtf8YFw8iZg', title: 'Creator', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'EZsjkfWQ2Vs', title: 'Creator (Music Box)', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'dEgjOyBwIaE', title: 'Precipice', artist: 'Amos Roddy', album: '1.21.6' },
    { id: 'URr3lmSj9g4', title: 'Lilypad', artist: 'Amos Roddy', album: '1.21.8' },
    { id: 'NPzukBv7w2w', title: 'Below and Above', artist: 'Amos Roddy', album: '1.21.8' },
    { id: '3vrNJ88Aiww', title: "O's Piano", artist: 'Amos Roddy', album: '1.21.8' },
    { id: 'bDIsDGxeg9c', title: 'Broken Clocks', artist: 'Amos Roddy', album: '1.21.8' },
    { id: 'wDaqicVmpqo', title: 'Fireflies', artist: 'Amos Roddy', album: '1.21.8' },
  ];

  const TRACK_MAP = {};
  FALLBACK.forEach(t => { TRACK_MAP[t.id] = t; });

  function formatTitle(track) {
    return track ? track.title : '';
  }

  function formatArtist(track) {
    return track ? track.artist + ' · ' + track.album : '';
  }

  function findTrack(videoId) {
    return TRACK_MAP[videoId] || null;
  }

  let player = null;
  let isPlaying = false;
  let playerReady = false;
  let titleTimer = null;
  let currentVideoId = '';
  let muted = true;
  let pinned = false;

  // ===== 狀態存取 =====
  function saveState() {
    if (!player || !playerReady) return;
    try {
      const time = player.getCurrentTime ? player.getCurrentTime() : 0;
      const data = player.getVideoData ? player.getVideoData() : {};
      const vid = data.video_id || currentVideoId || '';
      const track = findTrack(vid);
      localStorage.setItem(STATE_KEY, JSON.stringify({
        videoId: vid,
        displayTitle: track ? formatTitle(track) : (data.title || ''),
        artist: track ? formatArtist(track) : '',
        time: time,
        playing: isPlaying,
        muted: muted,
        volume: player.getVolume ? player.getVolume() : 15,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function loadState() {
    try {
      const s = localStorage.getItem(STATE_KEY);
      if (!s) return null;
      const state = JSON.parse(s);
      if (Date.now() - state.ts > 600000) return null;
      return state;
    } catch (e) { return null; }
  }

  // ===== UI 更新 =====
  function updateDisplay() {
    const titleEl = document.getElementById('ftTitle');
    const artistEl = document.getElementById('ftArtist');
    if (!titleEl || !player || !playerReady) return;
    try {
      const data = player.getVideoData();
      const vid = data.video_id || '';
      currentVideoId = vid;
      const track = findTrack(vid);
      titleEl.textContent = track ? formatTitle(track) : (data.title || '音樂');
      if (artistEl) artistEl.textContent = track ? formatArtist(track) : '';
    } catch (e) {}
  }

  function startTitlePolling() {
    if (titleTimer) clearInterval(titleTimer);
    titleTimer = setInterval(() => { if (isPlaying) updateDisplay(); }, 3000);
  }

  function updatePlayBtn(playing) {
    const icon = document.getElementById('ftPlayIcon');
    const btn = document.getElementById('ftMusicBtn');
    const panelIcon = document.getElementById('ftPanelIcon');
    if (icon) {
      icon.innerHTML = playing
        ? '<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>'
        : '<path d="M9 6.5v11l8.5-5.5z"/>';
    }
    if (btn) btn.classList.toggle('playing', playing);
    // 面板圖示統一音符
  }

  // ===== 建立 UI =====
  function createUI() {
    const toolbar = document.createElement('div');
    toolbar.id = 'floatToolbar';
    toolbar.innerHTML = `
      <div class="ft-music-wrap" id="ftMusicWrap">
        <button class="ft-btn ft-music" id="ftMusicBtn" aria-label="音樂播放器">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"/>
          </svg>
        </button>
        <div class="ft-panel-wrap">
          <div class="ft-panel" id="ftPanel">
            <div class="ft-panel-header">
              <div class="ft-panel-icon" id="ftPanelIcon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"/></svg>
              </div>
              <div class="ft-panel-info">
                <div class="ft-panel-title" id="ftTitle">音樂</div>
                <div class="ft-panel-artist" id="ftArtist"></div>
              </div>
            </div>
            <div class="ft-panel-controls">
              <button class="ft-panel-ctrl" id="ftPrev" title="上一首">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button class="ft-panel-ctrl ft-panel-play" id="ftPlay" title="播放／暫停">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" id="ftPlayIcon"><path d="M9 6.5v11l8.5-5.5z"/></svg>
              </button>
              <button class="ft-panel-ctrl" id="ftNext" title="下一首">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>
            <div class="ft-panel-vol">
              <span class="ft-vol-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.5v7a4.5 4.5 0 0 0 2.5-3.5zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z"/></svg>
              </span>
              <input type="range" id="ftVol" min="0" max="100" value="15" class="ft-vol-slider">
            </div>
            <div class="ft-panel-status">
              <span class="ft-panel-status-text" id="ftStatusText">就緒</span>
              <span class="ft-panel-pin-hint" id="ftPinHint">點擊按鈕固定面板</span>
            </div>
          </div>
        </div>
      </div>
      <button class="ft-btn ft-top" id="ftTopBtn" aria-label="回到頂部">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    `;
    document.body.appendChild(toolbar);

    // 隱藏的 YouTube 播放器
    const yt = document.createElement('div');
    yt.id = 'ytPlayer';
    yt.style.cssText = 'position:absolute;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(yt);

    // 靜音提示
    if (!localStorage.getItem('sw-music-unmuted')) {
      const hint = document.createElement('div');
      hint.className = 'ft-muted-hint';
      hint.textContent = '🎵 點右下角可以放音樂';
      hint.addEventListener('click', () => hint.remove());
      document.body.appendChild(hint);
    }
  }

  // ===== 事件綁定 =====
  function bindEvents() {
    const musicBtn = document.getElementById('ftMusicBtn');
    const musicWrap = document.getElementById('ftMusicWrap');
    const panel = document.getElementById('ftPanel');
    const topBtn = document.getElementById('ftTopBtn');
    const pinHint = document.getElementById('ftPinHint');

    // 音樂按鈕：點擊切換固定
    musicBtn.addEventListener('click', (e) => {
      pinned = !pinned;
      panel.classList.toggle('pinned', pinned);
      musicBtn.classList.toggle('pinned', pinned);
      if (pinHint) pinHint.textContent = pinned ? '再次點擊取消固定' : '點擊按鈕固定面板';
    });

    // hover 顯示面板（帶延遲防止閃爍）
    let hoverTimer = null;
    function showPanel() {
      clearTimeout(hoverTimer);
      panel.classList.add('hover');
    }
    function scheduleHide() {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!pinned) panel.classList.remove('hover');
      }, 200);
    }
    musicBtn.addEventListener('mouseenter', showPanel);
    musicBtn.addEventListener('mouseleave', scheduleHide);
    panel.addEventListener('mouseenter', showPanel);
    panel.addEventListener('mouseleave', scheduleHide);

    // 點擊面板內部不觸發關閉
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 播放控制
    document.getElementById('ftPlay').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
    document.getElementById('ftPrev').addEventListener('click', (e) => {
      e.stopPropagation();
      prevTrack();
    });
    document.getElementById('ftNext').addEventListener('click', (e) => {
      e.stopPropagation();
      nextTrack();
    });
    document.getElementById('ftVol').addEventListener('input', (e) => {
      if (player && playerReady) {
        player.setVolume(parseInt(e.target.value));
        if (muted && parseInt(e.target.value) > 0) {
          muted = false;
          player.unMute();
          localStorage.setItem('sw-music-unmuted', '1');
        }
      }
    });

    // 回到頂部
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 滾動顯示回到頂部
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          topBtn.classList.toggle('visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // 首次互動解除靜音
    if (localStorage.getItem('sw-music-unmuted')) {
      muted = false;
    }

    function unmuteOnInteract() {
      if (!muted || !player || !playerReady) return;
      muted = false;
      try {
        player.unMute();
        player.setVolume(15);
        document.getElementById('ftVol').value = 15;
      } catch (e) {}
      localStorage.setItem('sw-music-unmuted', '1');
      document.removeEventListener('click', unmuteOnInteract);
      document.removeEventListener('keydown', unmuteOnInteract);
      document.removeEventListener('touchstart', unmuteOnInteract);
      const hint = document.querySelector('.ft-muted-hint');
      if (hint) hint.remove();
    }

    if (!localStorage.getItem('sw-music-unmuted')) {
      document.addEventListener('click', unmuteOnInteract);
      document.addEventListener('keydown', unmuteOnInteract);
      document.addEventListener('touchstart', unmuteOnInteract);
    }

    window.addEventListener('beforeunload', saveState);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveState();
    });
  }

  // ===== 播放控制 =====
  function togglePlay() {
    if (!player || !playerReady) return;
    try {
      isPlaying ? player.pauseVideo() : player.playVideo();
    } catch (e) {}
  }

  function prevTrack() {
    if (!playerReady) return;
    try { player.loadVideoById(FALLBACK[Math.floor(Math.random() * FALLBACK.length)].id); } catch (e) {}
  }

  function nextTrack() {
    if (!playerReady) return;
    try { player.loadVideoById(FALLBACK[Math.floor(Math.random() * FALLBACK.length)].id); } catch (e) {}
  }

  // ===== YouTube 回呼 =====
  function onPlayerReady(event) {
    playerReady = true;
    const saved = loadState();

    if (!muted) {
      try { player.unMute(); } catch (e) {}
    }

    if (saved && saved.videoId) {
      player.setVolume(saved.volume || 15);
      document.getElementById('ftVol').value = saved.volume || 15;
      // 相容舊格式（displayTitle 可能包含 "藝人 — 曲名"）
      let displayTitle = saved.displayTitle || '';
      let displayArtist = saved.artist || '';
      if (displayTitle.includes(' — ') && !displayArtist) {
        const parts = displayTitle.split(' — ');
        displayArtist = parts[0];
        displayTitle = parts.slice(1).join(' — ');
      }
      document.getElementById('ftTitle').textContent = displayTitle || '音樂';
      document.getElementById('ftArtist').textContent = displayArtist;
      if (saved.muted === true) { muted = true; try { player.mute(); } catch (e) {} }
      else if (saved.muted === false) { muted = false; try { player.unMute(); } catch (e) {} }

      player.loadVideoById(saved.videoId);
      const shouldPlay = saved.playing;
      const resumeTime = saved.time || 0;
      setTimeout(() => {
        try {
          if (resumeTime > 0.5) player.seekTo(resumeTime, true);
          shouldPlay ? player.playVideo() : player.pauseVideo();
        } catch (e) {}
      }, 800);
      startTitlePolling();
      return;
    }

    // 無儲存狀態 → 隨機播放
    player.setVolume(15);
    document.getElementById('ftVol').value = 15;
    const randomTrack = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    document.getElementById('ftTitle').textContent = formatTitle(randomTrack);
    document.getElementById('ftArtist').textContent = formatArtist(randomTrack);
    try {
      player.loadVideoById(randomTrack.id);
      setTimeout(() => player.playVideo(), 600);
    } catch (e) {}
    startTitlePolling();
  }

  function onPlayerStateChange(event) {
    const statusEl = document.getElementById('ftStatusText');
    if (event.data === YT.PlayerState.ENDED) {
      const randomTrack = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
      try { player.loadVideoById(randomTrack.id); } catch (e) {}
    }
    if (event.data === YT.PlayerState.PLAYING) {
      isPlaying = true;
      updatePlayBtn(true);
      if (statusEl) statusEl.textContent = '播放中';
      setTimeout(updateDisplay, 300);
    }
    if (event.data === YT.PlayerState.PAUSED) {
      isPlaying = false;
      updatePlayBtn(false);
      if (statusEl) statusEl.textContent = '已暫停';
      saveState();
    }
    if (event.data === YT.PlayerState.BUFFERING) {
      if (statusEl) statusEl.textContent = '載入中…';
    }
  }

  // ===== 初始化 =====
  function init() {
    createUI();
    bindEvents();

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player('ytPlayer', {
        height: '1', width: '1',
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1 },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: () => setTimeout(() => { try { player.nextVideo(); } catch (e) {} }, 1000)
        }
      });
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { togglePlay, nextTrack, prevTrack };
})();
