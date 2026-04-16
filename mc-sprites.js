// ═══ MC Sprite 工具 ═══
// 將 emoji 替換為 Minecraft 風格 sprite 圖片
// 沒有對應 sprite 的 emoji 會保留原始顯示

const MC_SPRITES = (() => {
  'use strict';
  const P = 'assets/mobs/';

  // emoji → sprite 路徑對照表
  const MAP = {
    // ═══ 魚類 / 海洋生物 ═══
    '🐟': P + 'cod.png',
    '🐠': P + 'tropical-fish.png',
    '🐡': P + 'pufferfish.png',
    '🦐': P + 'tadpole.png',        // 蝦 → 蝌蚪（最接近）
    '🐙': P + 'squid.png',
    '🦑': P + 'squid.png',           // 用 squid 代替
    '🐬': P + 'dolphin.png',
    '🐳': P + 'dolphin.png',         // 鯨 → 海豚
    '🐋': P + 'dolphin.png',
    '🦭': P + 'turtle.png',          // 海豹 → 海龜
    '🐚': P + 'nautilus.png',
    '🐢': P + 'turtle.png',
    '🦀': P + 'armadillo.png',       // 螃蟹 → 犰狳（最接近的節肢動物）
    '🦞': P + 'armadillo.png',

    // ═══ 怪物（射擊場 hostile）═══
    '💀': P + 'skeleton.png',
    '🧟': P + 'zombie.png',
    '🕷️': P + 'spider.png',
    '👻': P + 'phantom.png',         // 鬼魂 → 幻翼
    '🐉': P + 'enderman.png',        // 龍 → 終界使者
    '💎': P + 'diamond-spear.png',   // 鑽石 → 鑽石矛
    '💣': P + 'tnt.png',

    // ═══ 動物（射擊場 friendly）═══
    '🐔': P + 'chicken.png',
    '🐷': P + 'pig.png',
    '🐄': P + 'cow.png',
    '🐱': P + 'cat.png',
    '🐑': P + 'sheep.png',

    // ═══ 合成 / 武器 ═══
    '⚔️': P + 'iron-sword.png',
    '🏹': P + 'diamond-spear.png',   // 弓 → 矛（最接近）
    '🔨': P + 'mace.png',
    '🪵': P + 'iron-sword.png',      // 木 → 劍（placeholder）
    '🪨': P + 'iron-sword.png',      // 石 → 劍
    '🔥': P + 'blaze.png',           // 火 → 烈焰使者
    '📦': P + 'allay.png',           // 箱子 → 悅靈

    // ═══ 交易 ═══
    '🏆': P + 'totem.png',           // 獎盃 → 不死圖騰
    '🐴': P + 'horse.png',
    '🔮': P + 'end-crystal.png',     // 珍珠 → 終界水晶
    '🍎': P + 'golden-axe.png',      // 蘋果 → 金斧

    // ═══ 附魔 / 其他 ═══
    '🧪': P + 'breeze.png',          // 藥水 → 微風
    '🧭': P + 'compass.png',         // 指南針（如果有的話）
  };

  /**
   * 取得 sprite HTML，無對應 sprite 則返回原始 emoji
   * @param {string} emoji - 原始 emoji
   * @param {string} [alt] - alt 文字（預設用 emoji）
   * @param {number} [size] - 圖片尺寸 px（預設 32）
   * @returns {string} HTML string
   */
  function img(emoji, alt, size) {
    size = size || 32;
    alt = alt || emoji;
    const src = MAP[emoji];
    if (src) {
      return '<img src="' + src + '" alt="' + alt + '" class="mc-sprite" width="' + size + '" height="' + size + '" loading="lazy">';
    }
    return emoji;
  }

  /**
   * 檢查某 emoji 是否有對應 sprite
   */
  function has(emoji) {
    return !!MAP[emoji];
  }

  return { img, has, MAP };
})();
