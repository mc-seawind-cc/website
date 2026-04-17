// ═══ 打怪物 ═══
// sprites: assets/mobs/*.png（16×16 像素圖，來源: mcwiki CC BY-NC-SA 3.0）

const MOB_SMASHER = (() => {
  'use strict';

  const SPRITE_PATH = 'assets/mobs/';
  const SPRITE_SHEET = 'assets/mob-spritesheet.png';
  const SPRITES = {"allay":[0,0],"armadillo":[16,0],"axolotl":[32,0],"bad-omen":[48,0],"bat":[64,0],"bee":[80,0],"blaze":[96,0],"breeze":[112,0],"camel-husk":[128,0],"camel":[144,0],"cat":[160,0],"cave-spider":[176,0],"chicken":[192,0],"cod":[0,16],"copper-golem":[16,16],"cow":[32,16],"creaking":[48,16],"creeper":[64,16],"diamond-spear":[80,16],"dolphin":[96,16],"donkey":[112,16],"elder-guardian":[128,16],"end-crystal":[144,16],"ender-dragon":[160,16],"enderman":[176,16],"endermite":[192,16],"evoker":[0,32],"fox":[16,32],"frog":[32,32],"ghast":[48,32],"ghastling":[64,32],"goat":[80,32],"golden-axe":[96,32],"guardian":[112,32],"happy-ghast":[128,32],"hoglin":[144,32],"horse":[160,32],"husk":[176,32],"iron-golem":[192,32],"iron-sword":[0,48],"johnny":[16,48],"mace":[32,48],"magma-cube":[48,48],"mooshroom":[64,48],"nautilus":[80,48],"ocelot":[96,48],"ominous-bottle":[112,48],"panda":[128,48],"parched":[144,48],"parrot":[160,48],"phantom":[176,48],"pig":[192,48],"piglin-brute":[0,64],"polar-bear":[16,64],"pufferfish":[32,64],"pumpkin-snow-golem":[48,64],"rabbit":[64,64],"ravager":[80,64],"salmon":[96,64],"sheep":[112,64],"shulker":[128,64],"silverfish":[144,64],"skeleton-horse":[160,64],"skeleton":[176,64],"slime":[192,64],"sniffer":[0,80],"spider":[16,80],"squid":[32,80],"stray":[48,80],"strider":[64,80],"tadpole":[80,80],"tnt":[96,80],"totem":[112,80],"trader-llama":[128,80],"tropical-fish":[144,80],"turtle":[160,80],"vex":[176,80],"villager":[192,80],"wandering-trader":[0,96],"warden":[16,96],"white-sheep":[32,96],"witch":[48,96],"wither-skeleton":[64,96],"wither":[80,96],"wolf":[96,96],"zoglin":[112,96],"zombie-horse":[128,96],"zombie-nautilus":[144,96],"zombie-villager":[160,96],"zombie":[176,96],"zombified-piglin":[192,96]};

  // Sprite element helper — uses sprite sheet for fast loading
  function spr(name, cls, alt) {
    const pos = SPRITES[name];
    if (pos) {
      return `<div class="ms-ss ${cls||''}" style="background-position:-${pos[0]}px -${pos[1]}px" role="img" aria-label="${alt||name}"></div>`;
    }
    // Fallback to individual file
    return `<img src="${SPRITE_PATH}${name}.png" alt="${alt||name}" class="${cls||''}" loading="lazy">`;
  }

  // ═══ Mob Definitions ═══
  const HOSTILE = [
    { id: 'zombie',              name: '殭屍',           pts: 1, timeBonus: 1, weight: 12 },
    { id: 'creeper',             name: '苦力怕',         pts: 1, timeBonus: 1, weight: 12 },
    { id: 'skeleton',            name: '骷髏',           pts: 1, timeBonus: 1, weight: 10 },
    { id: 'slime',               name: '史萊姆',         pts: 1, timeBonus: 1, weight: 8 },
    { id: 'witch',               name: '女巫',           pts: 2, timeBonus: 1, weight: 6 },
    { id: 'spider',              name: '蜘蛛',           pts: 1, timeBonus: 1, weight: 10 },
    { id: 'cave-spider',         name: '洞穴蜘蛛',       pts: 1, timeBonus: 1, weight: 7 },
    { id: 'blaze',               name: '烈焰使者',       pts: 2, timeBonus: 1, weight: 5 },
    { id: 'breeze',              name: '旋風使者',       pts: 2, timeBonus: 1, weight: 5 },
    { id: 'ghast',               name: '地獄幽靈',       pts: 2, timeBonus: 2, weight: 4 },
    { id: 'phantom',             name: '夜魅',           pts: 2, timeBonus: 1, weight: 6 },
    { id: 'evoker',              name: '喚魔者',         pts: 3, timeBonus: 2, weight: 3, special: 'totem' },
    { id: 'enderman',            name: '終界使者',       pts: 2, timeBonus: 1, weight: 5 },
    { id: 'shulker',             name: '界伏蚌',         pts: 2, timeBonus: 1, weight: 4 },
    { id: 'silverfish',          name: '蠹魚',           pts: 1, timeBonus: 1, weight: 7 },
    { id: 'endermite',           name: '終界蟎',         pts: 1, timeBonus: 1, weight: 6 },
    { id: 'magma-cube',          name: '岩漿立方怪',     pts: 1, timeBonus: 1, weight: 7 },
    { id: 'husk',                name: '屍殼',           pts: 1, timeBonus: 1, weight: 8 },
    { id: 'parched',             name: '枯骸',           pts: 2, timeBonus: 1, weight: 4 },
    { id: 'warden',              name: '伏守者',         pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'piglin-brute',        name: '豬布林蠻兵',     pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'ravager',             name: '劫毀獸',         pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'wither',              name: '凋零怪',         pts: 5, timeBonus: 3, weight: 2, hp: 2, stayMs: 2500 },
    { id: 'elder-guardian',      name: '遠古深海守衛',   pts: 5, timeBonus: 3, weight: 1, hp: 2, stayMs: 3000, special: 'elder' },
    { id: 'guardian',            name: '深海守衛',       pts: 2, timeBonus: 1, weight: 0 },
    // === 新增怪物 ===
    { id: 'zombified-piglin',    name: '殭屍化豬布林',   pts: 1, timeBonus: 1, weight: 7 },
    { id: 'zombie-villager',     name: '殭屍村民',       pts: 1, timeBonus: 1, weight: 6 },
    { id: 'hoglin',              name: '豬布獸',         pts: 2, timeBonus: 1, weight: 5 },
    { id: 'zoglin',              name: '豬屍獸',         pts: 2, timeBonus: 1, weight: 4 },
    { id: 'wither-skeleton',     name: '凋零骷髏',       pts: 2, timeBonus: 1, weight: 5 },
    { id: 'johnny',              name: '衛道士',         pts: 3, timeBonus: 2, weight: 3, special: 'ominous', dropChance: 0.4 },
    { id: 'vex',                 name: '惱鬼',           pts: 2, timeBonus: 1, weight: 5 },
    { id: 'stray',               name: '流髑',           pts: 1, timeBonus: 1, weight: 6 },
    { id: 'creaking',            name: '嘎枝',           pts: 4, timeBonus: 2, weight: 3, hp: 2, stayMs: 2200 },
    { id: 'ender-dragon',        name: '終界龍',         pts: 10, timeBonus: 5, weight: 1, hp: 5, stayMs: 4000 },
    { id: 'evoker-copy',         name: '掠奪者',         pts: 3, timeBonus: 2, weight: 3, sprite: 'evoker' },
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
    // === 新增友善 ===
    { id: 'donkey',           name: '驢子' },
    { id: 'cow',              name: '牛' },
    { id: 'white-sheep',      name: '綿羊(白)' },
    { id: 'skeleton-horse',   name: '骷髏馬' },
    { id: 'camel-husk',       name: '駱駝屍殼' },
    { id: 'ghastling',        name: '小幽靈' },
    { id: 'zombie-horse',     name: '殭屍馬' },
    { id: 'pumpkin-snow-golem', name: '雪人' },  // 友好
  ];

  const NEUTRAL = [
    { id: 'nautilus',          name: '鸚鵡螺' },
    { id: 'zombie-nautilus',   name: '殭屍鸚鵡螺' },
    { id: 'bee',               name: '蜜蜂' },
    { id: 'iron-golem',        name: '鐵魔像', hp: 2, stayMs: 2200 },
    { id: 'panda',             name: '貓熊' },
    { id: 'polar-bear',        name: '北極熊' },
    { id: 'trader-llama',      name: '商駝' },
    { id: 'wolf',              name: '狼' },
    { id: 'pufferfish',        name: '河豚' },
    { id: 'ocelot',            name: '山貓' },
  ];

  const SPECIAL = [
    { id: 'tnt',          name: 'TNT',         lethal: true },
    { id: 'end-crystal',  name: '終界水晶',    lethal: true },
  ];

  // ═══ Raid Wave Definitions ═══
  const RAID_STAY = 3200; // 突襲生物停留時間（5×5 格子大，需要更長時間）
  const RAID_VILLAGER = { id: 'villager', name: '村民', pts: 0, timeBonus: 0, sprite: 'villager', stayMs: 2800, isVillager: true };
  const RAID_WAVES = [
    // wave 1: 4 掠奪者
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
    ],
    // wave 2: 3 掠奪者 + 1 劫毀獸
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
    ],
    // wave 3: 3 掠奪者 + 1 衛道士 + 3 女巫
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'witch', name: '女巫', pts: 2, timeBonus: 1, stayMs: RAID_STAY },
      { id: 'witch', name: '女巫', pts: 2, timeBonus: 1, stayMs: RAID_STAY },
      { id: 'witch', name: '女巫', pts: 2, timeBonus: 1, stayMs: RAID_STAY },
    ],
    // wave 4: 4 掠奪者 + 1 劫毀獸 + 1 喚魔者
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
      { id: 'evoker', name: '喚魔者', pts: 3, timeBonus: 2, special: 'totem', stayMs: RAID_STAY },
    ],
    // wave 5: 4 掠奪者 + 4 衛道士 + 1 喚魔者
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'evoker', name: '喚魔者', pts: 3, timeBonus: 2, special: 'totem', stayMs: RAID_STAY },
    ],
    // wave 6: 4 掠奪者 + 2 衛道士 + 2 劫毀獸 + 1 女巫 + 2 喚魔者
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
      { id: 'witch', name: '女巫', pts: 2, timeBonus: 1, stayMs: RAID_STAY },
      { id: 'evoker', name: '喚魔者', pts: 3, timeBonus: 2, special: 'totem', stayMs: RAID_STAY },
      { id: 'evoker', name: '喚魔者', pts: 3, timeBonus: 2, special: 'totem', stayMs: RAID_STAY },
    ],
    // wave 7: 2 掠奪者 + 5 衛道士 + 2 劫毀獸 + 1 女巫
    [
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'evoker-copy', name: '掠奪者', pts: 3, timeBonus: 2, sprite: 'evoker', stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'johnny', name: '衛道士', pts: 3, timeBonus: 2, stayMs: RAID_STAY },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
      { id: 'ravager', name: '劫毀獸', pts: 5, timeBonus: 3, hp: 2, stayMs: 3000 },
      { id: 'witch', name: '女巫', pts: 2, timeBonus: 1, stayMs: RAID_STAY },
    ],
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
  let raidAudio = null;

  function initState() {
    return {
      score: 0,
      timeLeft: 30,
      hasTotem: false,
      totemCount: 0,
      hasOminousBottle: false,
      ominousBottleCount: 0,
      hasBadOmen: false,
      bestScore: parseInt(localStorage.getItem('sw-mobsmasher-best') || '0'),
      holes: null, // initialized after grid size
      gridSize: 9, // 9 or 25
      alive: true,
      spawnInterval: null,
      timerInterval: null,
      difficultyInterval: null,
      spawnSpeed: 1200,
      mobsSmashed: 0,
      friendliesHit: 0,
      // Raid state
      raidActive: false,
      raidWave: 0,
      raidTotalWaves: 0,
      raidQueue: [],
      raidSpawnTimer: null,
      raidMobsKilled: 0,
      raidVillagersHit: 0,
      raidMobsMissed: 0,
      timerWasPaused: false,
    };
  }

  // ═══ Render ═══
  function render(container) {
    state = initState();
    state.holes = Array(state.gridSize).fill(null);

    let html = `
      <div class="overlay-header">
        <span class="overlay-title">${spr('iron-sword','ms-weapon-icon','劍')} 打怪物</span>
        <button class="overlay-close" onclick="MOB_SMASHER.close()">✕</button>
      </div>
      <div class="ms-hud">
        <div class="ms-hud-left">
          <span class="ms-score">${spr('mace','ms-weapon-icon','鎚')} <span id="msScore">0</span></span>
          ${state.bestScore > 0 ? `<span class="ms-best">最高 ${state.bestScore}</span>` : ''}
        </div>
        <div class="ms-hud-center">
          <div class="ms-totem" id="msTotem" style="display:none" title="不死圖騰（抵擋致命傷害）">${spr('totem','ms-item-sprite','不死圖騰')}${spr('totem','ms-item-sprite ms-totem-2','不死圖騰')}</div>
          <div class="ms-ominous" id="msOminous" style="display:none" title="點擊使用不祥之瓶（獲得不祥之兆）">${spr('ominous-bottle','ms-item-sprite','不祥之瓶')}${spr('ominous-bottle','ms-item-sprite ms-ominous-2','不祥之瓶')}</div>
          <div class="ms-bad-omen" id="msBadOmen" style="display:none" title="不祥之兆（突襲準備中）">${spr('bad-omen','ms-item-sprite','不祥之兆')}</div>
        </div>
        <div class="ms-hud-right">
          <span class="ms-timer" id="msTimer">30</span>秒
        </div>
      </div>
      <!-- Raid Bar -->
      <div class="ms-raid-bar" id="msRaidBar" style="display:none">
        <div class="ms-raid-bar-text" id="msRaidBarText">突襲</div>
        <div class="ms-raid-bar-progress" id="msRaidBarProgress"><div class="ms-raid-bar-fill" id="msRaidBarFill"></div></div>
      </div>
      <div class="ms-grid ms-grid-3" id="msGrid">`;

    for (let i = 0; i < 9; i++) {
      html += `<div class="ms-hole" data-hole="${i}" id="msHole${i}" onclick="MOB_SMASHER.hit(${i})">
        <div class="ms-hole-inner"></div>
      </div>`;
    }

    html += `</div>
      <div class="ms-info" id="msInfo">準備好了嗎？點擊開始！</div>
      <div class="ms-legend">
        <span class="ms-legend-item">${spr('zombie','ms-legend-sprite','敵對')}敵對 +分+秒</span>
        <span class="ms-legend-item">${spr('pig','ms-legend-sprite','友好')}友好 -分-秒</span>
        <span class="ms-legend-item">${spr('wolf','ms-legend-sprite','中立')}中立 -分</span>
        <span class="ms-legend-item">${spr('end-crystal','ms-legend-sprite','爆炸')}爆炸!</span>
      </div>
      <div class="ms-source">圖源：<a href="https://minecraft.wiki" target="_blank" rel="noopener">mcwiki</a></div>
    `;

    container.innerHTML = html;

    // Bind ominous bottle click
    const ominousEl = document.getElementById('msOminous');
    if (ominousEl) {
      ominousEl.addEventListener('click', (e) => {
        e.stopPropagation();
        useOminousBottle();
      });
    }

    container.querySelector('.ms-grid').addEventListener('click', startGame, { once: true });
  }

  function startGame() {
    if (state.timerInterval) return;
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

    state.difficultyInterval = setInterval(() => {
      if (state.spawnSpeed > 500) {
        state.spawnSpeed -= 50;
        clearInterval(state.spawnInterval);
        state.spawnInterval = setInterval(spawnMob, state.spawnSpeed);
      }
    }, 5000);
  }

  // ═══ Grid Management ═══
  function expandGrid() {
    if (state.gridSize === 25) return;
    state.gridSize = 25;
    // Clear old holes
    for (let i = 0; i < 9; i++) {
      if (state.holes[i]) {
        clearTimeout(state.holes[i].timeoutId);
        state.holes[i] = null;
      }
    }
    state.holes = Array(25).fill(null);

    const grid = document.getElementById('msGrid');
    if (!grid) return;
    grid.classList.remove('ms-grid-3');
    grid.classList.add('ms-grid-5');
    let html = '';
    for (let i = 0; i < 25; i++) {
      html += `<div class="ms-hole" data-hole="${i}" id="msHole${i}" onclick="MOB_SMASHER.hit(${i})">
        <div class="ms-hole-inner"></div>
      </div>`;
    }
    grid.innerHTML = html;
  }

  function shrinkGrid() {
    if (state.gridSize === 9) return;
    // Clear raid holes
    for (let i = 0; i < 25; i++) {
      if (state.holes[i]) {
        clearTimeout(state.holes[i].timeoutId);
        state.holes[i] = null;
      }
    }
    state.gridSize = 9;
    state.holes = Array(9).fill(null);

    const grid = document.getElementById('msGrid');
    if (!grid) return;
    grid.classList.remove('ms-grid-5');
    grid.classList.add('ms-grid-3');
    let html = '';
    for (let i = 0; i < 9; i++) {
      html += `<div class="ms-hole" data-hole="${i}" id="msHole${i}" onclick="MOB_SMASHER.hit(${i})">
        <div class="ms-hole-inner"></div>
      </div>`;
    }
    grid.innerHTML = html;
  }

  // ═══ Spawn ═══
  function spawnMob() {
    if (!state.alive || state.raidActive) return;

    const empty = [];
    for (let i = 0; i < state.gridSize; i++) {
      if (!state.holes[i]) empty.push(i);
    }
    if (empty.length === 0) return;

    const idx = empty[Math.floor(Math.random() * empty.length)];

    let mob, category;

    const specialChance = Math.min(0.05 + state.score * 0.002, 0.15);
    if (Math.random() < specialChance) {
      mob = SPECIAL[Math.floor(Math.random() * SPECIAL.length)];
      category = 'special';
    } else {
      const roll = Math.random();
      if (roll < 0.65) {
        mob = weightedPick(HOSTILE.filter(m => m.weight > 0));
        category = 'hostile';
      } else if (roll < 0.90) {
        mob = PASSIVE[Math.floor(Math.random() * PASSIVE.length)];
        category = 'passive';
        // Check: villager + bad omen = RAID!
        if (mob.id === 'villager' && state.hasBadOmen) {
          startRaid();
          return;
        }
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

    const spriteFile = mob.sprite || mob.id;
    const el = document.createElement('div');
    el.className = `ms-mob ms-${category}`;
    el.innerHTML = `
      ${spr(spriteFile, 'ms-sprite', mob.name)}
      ${maxHp > 1 ? `<div class="ms-hp-bar"><div class="ms-hp-fill" style="width:100%"></div></div>` : ''}
      <span class="ms-mob-name">${mob.name}</span>
    `;

    hole.querySelector('.ms-hole-inner').appendChild(el);
    hole.classList.add('active', `ms-hole-${category}`);

    state.holes[idx] = { mob, category, hp: maxHp, maxHp, el, timeoutId: null };

    state.holes[idx].timeoutId = setTimeout(() => {
      // In raid: missing a mob = penalty
      if (state.raidActive) {
        if (mob.isVillager) {
          // Villager escaping = no penalty, villager survived
        } else {
          state.score = Math.max(0, state.score - 1);
          state.timeLeft = Math.max(0, state.timeLeft - 1);
          state.raidMobsMissed++;
          showFloatingText(el, '-1', '#ff8282');
          updateHUD();
        }
        checkRaidWaveComplete();
      }
      removeMob(idx);
    }, stayDuration);
  }

  // ═══ Hit ═══
  function hit(idx) {
    const holeData = state.holes[idx];
    if (!holeData || !state.alive) return;

    const { mob, category, el } = holeData;

    el.classList.add('ms-hit');
    setTimeout(() => el.classList.remove('ms-hit'), 200);

    if (category === 'hostile') {
      // Villager in raid: hitting = penalty!
      if (mob.isVillager) {
        state.score = Math.max(0, state.score - 2);
        state.timeLeft = Math.max(0, state.timeLeft - 3);
        state.raidVillagersHit++;
        showFloatingText(el, '-2', '#ff8282');
        showFloatingText(el, '-3s', '#ff8282', 20);
        showInfo('不要打村民！', '#ff8282');
        removeMob(idx);
        updateHUD();
        if (state.raidActive) checkRaidWaveComplete();
        if (state.timeLeft <= 0 && state.alive) {
          if (state.hasTotem) { useTotem(); state.timeLeft = 5; }
          else endGame();
        }
        return;
      }

      holeData.hp--;
      if (holeData.hp > 0) {
        const fill = el.querySelector('.ms-hp-fill');
        if (fill) fill.style.width = (holeData.hp / holeData.maxHp * 100) + '%';
        el.classList.add('ms-damage');
        setTimeout(() => el.classList.remove('ms-damage'), 300);
        return;
      }

      state.score += mob.pts;
      state.timeLeft += mob.timeBonus;
      state.mobsSmashed++;
      if (state.raidActive) state.raidMobsKilled++;

      if (mob.special === 'totem') {
        if (state.totemCount < 2) {
          state.totemCount++;
          state.hasTotem = true;
          showInfo(`獲得不死圖騰！（${state.totemCount}/2）`, '#a8e6cf');
          updateTotem();
        }
      }
      if (mob.special === 'ominous') {
        const dropChance = mob.dropChance || 1;
        if (Math.random() < dropChance && state.ominousBottleCount < 2) {
          state.ominousBottleCount++;
          state.hasOminousBottle = true;
          showInfo(`衛道士掉落了不祥之瓶！點擊使用 🧪`, '#ab72f9');
          updateOminous();
        }
      }
      if (mob.special === 'elder') {
        spawnGuardians(idx);
      }

      showFloatingText(el, `+${mob.pts}`, '#a8e6cf');
      showFloatingText(el, `+${mob.timeBonus}s`, '#58c2b0', 20);
      removeMob(idx);

      if (state.raidActive) {
        checkRaidWaveComplete();
      }

    } else if (category === 'passive') {
      state.score = Math.max(0, state.score - 2);
      state.timeLeft = Math.max(0, state.timeLeft - 3);
      state.friendliesHit++;
      showFloatingText(el, '-2', '#ff8282');
      showFloatingText(el, '-3s', '#ff8282', 20);
      showInfo(`不要打${mob.name}！`, '#ff8282');
      removeMob(idx);

    } else if (category === 'neutral') {
      holeData.hp--;
      if (holeData.hp > 0) {
        const fill = el.querySelector('.ms-hp-fill');
        if (fill) fill.style.width = (holeData.hp / holeData.maxHp * 100) + '%';
        el.classList.add('ms-damage');
        setTimeout(() => el.classList.remove('ms-damage'), 300);
        return;
      }
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

    if (state.timeLeft <= 0 && state.alive) {
      if (state.hasTotem) {
        useTotem();
        state.timeLeft = 5;
      } else {
        endGame();
      }
    }
  }

  // ═══ Ominous Bottle ═══
  function useOminousBottle() {
    if (!state.hasOminousBottle || state.hasBadOmen) return;
    state.ominousBottleCount--;
    if (state.ominousBottleCount <= 0) {
      state.ominousBottleCount = 0;
      state.hasOminousBottle = false;
    }
    state.hasBadOmen = true;
    updateOminous();
    updateBadOmen();
    showInfo('獲得不祥之兆！下一個村民將觸發突襲 ⚔️', '#ab72f9');
  }

  function updateOminous() {
    const el = document.getElementById('msOminous');
    if (el) {
      el.style.display = state.ominousBottleCount > 0 && !state.hasBadOmen ? '' : 'none';
      const children = el.querySelectorAll('.ms-item-sprite');
      if (children[1]) children[1].style.display = state.ominousBottleCount >= 2 ? '' : 'none';
    }
  }

  function updateBadOmen() {
    const el = document.getElementById('msBadOmen');
    if (el) el.style.display = state.hasBadOmen ? '' : 'none';
    // Hide bottle when bad omen is active
    updateOminous();
  }

  // ═══ Raid System ═══
  function startRaid() {
    state.hasBadOmen = false;
    state.raidActive = true;
    state.raidMobsKilled = 0;
    state.raidVillagersHit = 0;
    state.raidMobsMissed = 0;
    updateBadOmen();

    // Pause the countdown timer during raid
    clearInterval(state.timerInterval);
    state.timerInterval = null;

    // Random 3-7 waves
    state.raidTotalWaves = 3 + Math.floor(Math.random() * 5);
    state.raidWave = 0;

    // Expand grid to 5x5
    expandGrid();

    // Show raid bar
    const raidBar = document.getElementById('msRaidBar');
    if (raidBar) raidBar.style.display = '';

    showInfo('⚔️ 突襲開始！計時器暫停', '#ff8282');

    // Start first wave after horn
    playRaidHorn(() => nextRaidWave());
  }

  function playRaidHorn(callback) {
    try {
      if (!raidAudio) {
        raidAudio = new Audio(SPRITE_PATH + 'raid-horn.ogg');
        raidAudio.volume = 0.6;
      }
      raidAudio.currentTime = 0;
      raidAudio.play().catch(() => {});
      let called = false;
      const once = () => { if (!called && callback) { called = true; callback(); } };
      raidAudio.onended = once;
      // Fallback if audio fails
      setTimeout(once, 1500);
    } catch(e) {
      if (callback) callback();
    }
  }

  function nextRaidWave() {
    if (!state.raidActive || !state.alive) return;

    state.raidWave++;
    if (state.raidWave > state.raidTotalWaves) {
      endRaid(true);
      return;
    }

    // Update raid bar
    const barText = document.getElementById('msRaidBarText');
    const barFill = document.getElementById('msRaidBarFill');
    if (barText) barText.textContent = `突襲 — 第 ${state.raidWave}/${state.raidTotalWaves} 波`;
    if (barFill) barFill.style.width = ((state.raidWave - 1) / state.raidTotalWaves * 100) + '%';

    showInfo(`⚔️ 第 ${state.raidWave} 波突襲！`, '#ff8282');

    // Pick wave definition (cycle through 1-7)
    const waveIdx = (state.raidWave - 1) % RAID_WAVES.length;
    const waveMobs = [...RAID_WAVES[waveIdx]]; // copy

    // Add villagers to the wave (2-4 per wave, increases with wave number)
    const villagerCount = 2 + Math.floor(Math.random() * 3);
    for (let v = 0; v < villagerCount; v++) {
      waveMobs.push({ ...RAID_VILLAGER });
    }

    // Shuffle into empty holes
    state.raidQueue = [];
    const empty = [];
    for (let i = 0; i < 25; i++) {
      if (!state.holes[i]) empty.push(i);
    }

    // Spawn mobs staggered
    waveMobs.forEach((mob, i) => {
      if (empty.length === 0) return;
      const randIdx = Math.floor(Math.random() * empty.length);
      const holeIdx = empty.splice(randIdx, 1)[0];
      state.raidQueue.push({ holeIdx, mob, spawned: false });

      setTimeout(() => {
        if (!state.raidActive || !state.alive) return;
        showMob(holeIdx, mob, 'hostile');
        const q = state.raidQueue.find(q => q.holeIdx === holeIdx);
        if (q) q.spawned = true;
      }, i * 200 + Math.random() * 300);
    });
  }

  function checkRaidWaveComplete() {
    if (!state.raidActive) return;

    // Check if all mobs in current wave are gone
    const allGone = state.raidQueue.every(q => !state.holes[q.holeIdx]);
    if (allGone && state.raidQueue.length > 0) {
      state.raidQueue = [];

      if (state.raidWave >= state.raidTotalWaves) {
        endRaid(true);
      } else {
        // Next wave after horn
        playRaidHorn(() => nextRaidWave());
      }
    }
  }

  function endRaid(success) {
    state.raidActive = false;

    // Clear remaining raid mobs
    for (let i = 0; i < 25; i++) {
      if (state.holes[i]) removeMob(i);
    }

    // Update raid bar
    const raidBar = document.getElementById('msRaidBar');
    const barFill = document.getElementById('msRaidBarFill');
    const barText = document.getElementById('msRaidBarText');
    if (barFill) barFill.style.width = '100%';

    const bonus = success ? 10 : 0;
    if (success) {
      state.score += bonus;
      state.timeLeft += bonus;
    }

    // Show settlement screen
    const grid = document.getElementById('msGrid');
    if (grid) {
      const totalWaves = state.raidWave;
      grid.innerHTML = `
        <div class="ms-result ms-raid-result">
          <div class="ms-result-icon" style="font-size:2rem">${success ? '🎉' : '💀'}</div>
          <div class="ms-result-score" style="color:${success ? '#a8e6cf' : '#ff8282'}">${success ? '突襲勝利！' : '突襲結束'}</div>
          <div class="ms-raid-stats">
            <div class="ms-raid-stat">
              <span class="ms-raid-stat-num">${totalWaves}</span>
              <span class="ms-raid-stat-label">波數</span>
            </div>
            <div class="ms-raid-stat">
              <span class="ms-raid-stat-num" style="color:#a8e6cf">${state.raidMobsKilled}</span>
              <span class="ms-raid-stat-label">擊殺</span>
            </div>
            <div class="ms-raid-stat">
              <span class="ms-raid-stat-num" style="color:#ff8282">${state.raidVillagersHit}</span>
              <span class="ms-raid-stat-label">誤傷村民</span>
            </div>
            <div class="ms-raid-stat">
              <span class="ms-raid-stat-num" style="color:#ffaa32">${state.raidMobsMissed}</span>
              <span class="ms-raid-stat-label">漏網之魚</span>
            </div>
          </div>
          ${success ? `<div class="ms-result-detail" style="color:#a8e6cf">+${bonus}分 +${bonus}秒 獎勵</div>` : ''}
          <div class="ms-result-detail">目前分數：${state.score}　剩餘時間：${state.timeLeft}秒</div>
          <button class="btn btn-main" onclick="MOB_SMASHER.resumeAfterRaid()">▶ 繼續遊戲</button>
        </div>`;
    }

    updateHUD();
  }

  function resumeAfterRaid() {
    // Shrink grid back
    shrinkGrid();

    // Hide raid bar
    const raidBar = document.getElementById('msRaidBar');
    if (raidBar) raidBar.style.display = 'none';

    // Resume countdown timer
    if (!state.timerInterval && state.alive && state.timeLeft > 0) {
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
    }

    // Show info and respawn normal mobs
    showInfo('回到一般模式，繼續打怪！', '#a8e6cf');

    // Clear grid and let spawnMob handle it
    const grid = document.getElementById('msGrid');
    if (grid) {
      let html = '';
      for (let i = 0; i < 9; i++) {
        html += `<div class="ms-hole" data-hole="${i}" id="msHole${i}" onclick="MOB_SMASHER.hit(${i})">
          <div class="ms-hole-inner"></div>
        </div>`;
      }
      grid.innerHTML = html;
    }
  }

  // ═══ Helpers ═══
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
    const cols = state.gridSize === 25 ? 5 : 3;
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const adj = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < cols && c >= 0 && c < cols) adj.push(r * cols + c);
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
    state.totemCount--;
    if (state.totemCount <= 0) {
      state.totemCount = 0;
      state.hasTotem = false;
    }
    updateTotem();
  }

  function updateTotem() {
    const el = document.getElementById('msTotem');
    if (el) {
      el.style.display = state.totemCount > 0 ? '' : 'none';
      // Update second icon visibility
      const children = el.querySelectorAll('.ms-item-sprite');
      if (children[1]) children[1].style.display = state.totemCount >= 2 ? '' : 'none';
    }
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
    if (state.raidSpawnTimer) clearTimeout(state.raidSpawnTimer);

    for (let i = 0; i < state.gridSize; i++) removeMob(i);

    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      localStorage.setItem('sw-mobsmasher-best', state.score.toString());
    }

    const label = state.score >= 50 ? '苦力怕剋星！'
                : state.score >= 30 ? '出色的獵人！'
                : state.score >= 15 ? '還不錯！'
                : '再試一次！';

    const grid = document.getElementById('msGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="ms-result">
          <div class="ms-result-icon">${spr('iron-sword','ms-result-sword','劍')}</div>
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
      render(document.getElementById('overlayBox'));
    }
  }

  function cleanup() {
    if (state) {
      clearInterval(state.spawnInterval);
      clearInterval(state.timerInterval);
      clearInterval(state.difficultyInterval);
      if (state.raidSpawnTimer) clearTimeout(state.raidSpawnTimer);
      for (let i = 0; i < state.gridSize; i++) {
        if (state.holes[i]) clearTimeout(state.holes[i].timeoutId);
      }
    }
    state = null;
    if (raidAudio) { raidAudio.pause(); raidAudio = null; }
  }

  return { open, close, restart, hit, resumeAfterRaid };
})();
