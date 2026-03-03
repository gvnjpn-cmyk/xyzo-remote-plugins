'use strict';
/**
 * Plugins-CJS/menu.js — Main Menu Router (V3)
 *
 * Support:
 *  .menu / .help                → menu utama
 *  .menu <kategori>             → submenu
 *  .tools / .download / .search → langsung submenu (tanpa .menu-tools)
 *
 * Catatan:
 * - Submenu di-handle oleh file helper: menu-tools.js, menu-download.js, dst.
 * - Greeting pakai mention (tag), bukan nomor doang.
 * - Text-only, tanpa sticker.
 */

const path = require('path');
const { name, version } = require('../package.json');
const { runtime } = require('../System/message');

// keyword → file submenu (tanpa ".js")
const SUB_MAP = {
  owner:    'menu-owner',
  own:      'menu-owner',
  group:    'menu-group',
  grup:     'menu-group',
  game:     'menu-game',
  games:    'menu-game',
  tools:    'menu-tools',
  tool:     'menu-tools',
  download: 'menu-download',
  dl:       'menu-download',
  search:   'menu-search',
  cari:     'menu-search',
};

// menu utama tampilkan kategori ini
const CATEGORIES = [
  { emoji: '👑', label: 'Owner',    key: 'owner',    ownerOnly: true  },
  { emoji: '👥', label: 'Group',    key: 'group',    ownerOnly: false },
  { emoji: '🎮', label: 'Game',     key: 'game',     ownerOnly: false },
  { emoji: '🧰', label: 'Tools',    key: 'tools',    ownerOnly: false },
  { emoji: '📥', label: 'Download', key: 'download', ownerOnly: false },
  { emoji: '🔎', label: 'Search',   key: 'search',   ownerOnly: false },
];

// cache require submenu
const _subCache = new Map();
function loadSub(pluginName) {
  if (_subCache.has(pluginName)) return _subCache.get(pluginName);
  try {
    const mod = require(path.join(__dirname, `${pluginName}.js`));
    _subCache.set(pluginName, mod);
    return mod;
  } catch (e) {
    console.error(`[MenuRouter] Gagal load "${pluginName}":`, e.message);
    return null;
  }
}

function devLine() {
  const dev = global.developer || {};
  const n = dev.name ? `👨‍💻 Dev: ${dev.name}` : null;
  const g = dev.github ? `🌐 ${dev.github}` : null;
  const c = dev.contact ? `📱 ${dev.contact}` : null;
  return [n, g, c].filter(Boolean).join('\n');
}

function buildMainMenu({ isOwn, prefix, uptime }) {
  const visibleCats = CATEGORIES.filter(c => !c.ownerOnly || isOwn);

  const header =
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *${name || 'XYZO Asisten'}*
┃ ⚡ v${version || '1.0.0'}
┃ 🕒 ${uptime}
╰━━━━━━━━━━━━━━━━━━━━╯`;

  const dev = devLine();
  const devBlock = dev ? `\n${dev}\n` : '';

  let list = '📚 *Menu Utama*\n';
  for (const cat of visibleCats) {
    // direct command: .tools, .download, dll
    list += `• ${cat.emoji} *${prefix}${cat.key}*\n`;
  }

  const tips =
`\n💡 *Cara pakai:*
• Ketik *${prefix}tools* untuk lihat Tools
• Ketik *${prefix}menu* untuk daftar lengkap
• Ketik *${prefix}menu <kategori>* juga bisa

📌 Contoh: *${prefix}tools* / *${prefix}menu tools*`;

  return `${header}${devBlock}\n${list}${tips}`.trim();
}

function pickSubKey(ctx) {
  // kalau user ngetik ".tools" → command = "tools"
  const invoked = (ctx.command || '').toLowerCase().trim();
  const rawText = (ctx.text || '').trim();
  const args0 = (ctx.args && ctx.args[0]) ? String(ctx.args[0]).toLowerCase().trim() : '';

  // invoked selain menu/help → anggap langsung kategori
  if (invoked && invoked !== 'menu' && invoked !== 'help') return invoked;

  // mode ".menu tools"
  if (args0) return args0;

  // fallback parsing kalau args kosong
  const fallback = rawText.split(/\s+/)[1] || '';
  return (fallback || '').toLowerCase().trim();
}

async function runSubmenu(m, ctx, subKey) {
  const { reply, isOwn, prefix } = ctx;

  // protect owner menu
  if ((subKey === 'owner' || subKey === 'own') && !isOwn) {
    return reply('🔒 Kategori ini hanya untuk *owner bot*.');
  }

  const pluginName = SUB_MAP[subKey];
  if (!pluginName) {
    const allowed = Object.keys(SUB_MAP)
      .filter((k, i, arr) => arr.indexOf(k) === i)
      .filter(k => {
        const cat = CATEGORIES.find(c => c.key === k);
        return !cat?.ownerOnly || isOwn;
      });

    return reply(
      `❓ Kategori *"${subKey}"* tidak ditemukan.\n\n` +
      `Coba salah satu:\n` +
      allowed.map(k => `• ${prefix}${k}`).join('\n')
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

// ─── Main plugin handler ─────────────────────────────────────────────────────
const handler = async (m, ctx) => {
  const {
    sock, conn, bot,
    prefix = '.',
    isOwn = false,
    reply,
  } = ctx;

  const wa = sock || conn || bot;
  const uptime = runtime(process.uptime());

  const subKey = pickSubKey(ctx);
  if (subKey) return runSubmenu(m, ctx, subKey);

  // main menu
  const menuText =
`Halo @${(m.sender || '').split('@')[0]} 👋

Aku *${name || 'XYZO Asisten'}* — bot WhatsApp yang siap bantu:
• Kelola group
• Tools & utilitas
• Download & pencarian
• Mini games
• Dan fitur owner

` + buildMainMenu({ isOwn, prefix, uptime });

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

  return wa.sendMessage(
    m.key.remoteJid,
    { text: menuText, mentions: [m.sender], contextInfo },
    { quoted: m }
  );
};

// penting: menu router nangkep juga direct command
handler.command = [
  'menu', 'help',
  'owner', 'own',
  'group', 'grup',
  'game', 'games',
  'tools', 'tool',
  'download', 'dl',
  'search', 'cari'
];

handler.tags = ['main'];
handler.help = ['menu', 'tools', 'download', 'search', 'game', 'group', 'owner'];

module.exports = handler;
