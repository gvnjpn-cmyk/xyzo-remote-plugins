'use strict';
/**
 * Plugins-CJS/menu.js — Main Menu Router
 *
 * Pattern: function plugin + .command array (kompatibel handler.js)
 *
 * Cara kerja:
 *   .menu            → tampilkan daftar kategori
 *   .menu owner      → delegate ke menu-owner.js
 *   .menu tools      → delegate ke menu-tools.js
 *   .menu <kategori> → delegate ke plugin yg sesuai SUB_MAP
 */

const path = require('path');
const { name, version } = require('../package.json');
const { runtime } = require('../System/message');

// ─── SUB_MAP ─────────────────────────────────────────────────────────────────
// Tambah kategori baru CUKUP di sini — tanpa sentuh XYZO.js
// key: keyword yg user ketik | value: nama file di Plugins-CJS/
const SUB_MAP = {
  owner:    'menu-owner',
  own:      'menu-owner',    // alias
  group:    'menu-group',
  grup:     'menu-group',    // alias Indonesia
  game:     'menu-game',
  games:    'menu-game',     // alias
  tools:    'menu-tools',
  tool:     'menu-tools',    // alias
  download: 'menu-download',
  dl:       'menu-download', // alias
  search:   'menu-search',
  cari:     'menu-search',   // alias Indonesia
};

// ─── Daftar kategori untuk tampilan utama ─────────────────────────────────────
const CATEGORIES = [
  { emoji: '👑', label: 'Owner',    key: 'owner',    ownerOnly: true  },
  { emoji: '👥', label: 'Group',    key: 'group',    ownerOnly: false },
  { emoji: '🎮', label: 'Game',     key: 'game',     ownerOnly: false },
  { emoji: '🔧', label: 'Tools',    key: 'tools',    ownerOnly: false },
  { emoji: '📥', label: 'Download', key: 'download', ownerOnly: false },
  { emoji: '🔍', label: 'Search',   key: 'search',   ownerOnly: false },
];

// ─── Plugin cache — cegah require() berulang ─────────────────────────────────
const _subCache = new Map();

function loadSub(pluginName) {
  if (_subCache.has(pluginName)) return _subCache.get(pluginName);
  try {
    const mod = require(path.join(__dirname, `${pluginName}.js`));
    _subCache.set(pluginName, mod);
    return mod;
  } catch (e) {
    console.error(`[MenuRouter] Gagal load sub-plugin "${pluginName}":`, e.message);
    return null;
  }
}

// ─── Builder: tampilan menu utama ─────────────────────────────────────────────
function buildMainMenu(isOwner, prefix, uptime) {
  const visibleCats = CATEGORIES.filter(c => !c.ownerOnly || isOwner);
  const pad = '  ';

  let text =
`╭━━━━━━━━━━━━━━━━━━━╮
┃  🤖 *${name || 'XYZO Asisten'}*
┃  ⚡ v${version || '1.0.0'}
┃  🕒 ${uptime}
╰━━━━━━━━━━━━━━━━━━━╯

📋 *Kategori Menu:*\n`;

  for (const cat of visibleCats) {
    text += `${pad}${cat.emoji} *${prefix}menu ${cat.key}*\n`;
  }

  text += `\n💡 Ketik *${prefix}menu <kategori>* untuk detail\n`;
  text += `📌 Contoh: *${prefix}menu tools*`;

  return text;
}

// ─── Main plugin handler ───────────────────────────────────────────────────────
const handler = async (m, ctx) => {
  const {
    sock, conn, bot,
    args     = [],
    prefix   = '.',
    isOwn    = false,
    isGroup  = false,
    reply,
    text     = ''
  } = ctx;

  const wa = sock || conn || bot;
  const uptime = runtime(process.uptime());

  // 🔥 Fallback parsing biar kebal args kosong
  const raw = (text || '').trim();
  const fallback = raw.split(/\s+/)[1] || '';
  const subKey = (args[0] || fallback || '').toLowerCase().trim();

  // ── KASUS 1: .menu <kategori> ───────────────────────────
  if (subKey) {

    if ((subKey === 'owner' || subKey === 'own') && !isOwn) {
      return reply(`🔒 Kategori ini hanya untuk *owner bot*.`);
    }

    const pluginName = SUB_MAP[subKey];

    if (!pluginName) {
      const keys = Object.keys(SUB_MAP)
        .filter((k, i, arr) => arr.indexOf(k) === i)
        .filter(k => {
          const cat = CATEGORIES.find(c => c.key === k);
          return !cat?.ownerOnly || isOwn;
        });

      return reply(
        `❓ Kategori *"${subKey}"* tidak ditemukan.\n\n` +
        keys.map(k => `• ${prefix}menu ${k}`).join('\n')
      );
    }

    const subPlugin = loadSub(pluginName);

    if (!subPlugin || typeof subPlugin !== 'function') {
      return reply(`⚠️ Sub-menu *${subKey}* belum tersedia.`);
    }

    try {
      return await subPlugin(m, ctx);
    } catch (err) {
      console.error(`[MenuRouter] Error di "${pluginName}":`, err);
      return reply(`❌ Error membuka menu *${subKey}*.`);
    }
  }

  // ── KASUS 2: .menu tanpa argumen ─────────────────────────

  const userNum = (m.sender || '').split('@')[0];

  const menuText =
`Halo @${userNum} 👋

` + buildMainMenu(isOwn, prefix, uptime);

  const contextInfo = global.thumbnail
    ? {
        externalAdReply: {
          title: name || 'XYZO Asisten',
          body: `v${version || '1.0.0'} • ${uptime}`,
          thumbnailUrl: global.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    : {};

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text: menuText,
      mentions: [m.sender],
      contextInfo
    },
    { quoted: m }
  );
};
  
// ─── Plugin metadata (wajib untuk handler.js) ─────────────────────────────────
handler.command = ['menu', 'help'];
handler.tags    = ['main'];
handler.help    = ['menu'];

module.exports = handler;
