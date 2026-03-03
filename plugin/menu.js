'use strict';
/**
 * Plugins-CJS/menu.js — Main Menu Router (V3)
 * - .menu -> tampil menu utama
 * - .menu <kategori> -> delegate ke submenu
 * - .tools / .download / .search / .game / .group -> juga bisa (direct)
 * - owner submenu: .menu owner (biar gak bentrok sama command "owner" di switch)
 */

const path = require('path');
const { name, version } = require('../package.json');
const { runtime } = require('../System/message');

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

const CATEGORIES = [
  { emoji: '👥', label: 'Group',    key: 'group',    directCmd: 'group',    ownerOnly: false },
  { emoji: '🎮', label: 'Game',     key: 'game',     directCmd: 'game',     ownerOnly: false },
  { emoji: '🛠️', label: 'Tools',    key: 'tools',    directCmd: 'tools',    ownerOnly: false },
  { emoji: '📥', label: 'Download', key: 'download', directCmd: 'download', ownerOnly: false },
  { emoji: '🔎', label: 'Search',   key: 'search',   directCmd: 'search',   ownerOnly: false },
  { emoji: '👑', label: 'Owner',    key: 'owner',    directCmd: null,       ownerOnly: true  }, // via .menu owner
];

const _subCache = new Map();
function loadSub(pluginName) {
  if (_subCache.has(pluginName)) return _subCache.get(pluginName);
  try {
    const mod = require(path.join(__dirname, `${pluginName}.js`));
    _subCache.set(pluginName, mod);
    return mod;
  } catch (e) {
    console.error(`[MenuV3] gagal load "${pluginName}":`, e.message);
    return null;
  }
}

function formatDevLine() {
  const dev = global.developer || {};
  const parts = [];
  if (dev.name) parts.push(`Dev: ${dev.name}`);
  if (dev.contact) parts.push(`WA: ${dev.contact}`);
  if (dev.github) parts.push(`GitHub: ${dev.github}`);
  return parts.length ? parts.join(' • ') : null;
}

function buildMainMenu({ isOwn, prefix, uptime, pushname, senderJid }) {
  const botName = name || 'XYZO Asisten';
  const botVer  = version || '1.0.0';

  const devLine = formatDevLine();
  const visibleCats = CATEGORIES.filter(c => !c.ownerOnly || isOwn);

  let text =
`Halo @${senderJid.split('@')[0]} 👋
Aku *${botName}*, asisten WhatsApp yang siap bantu kamu 24/7.
Kamu bisa akses fitur lewat kategori di bawah ini — tinggal ketik perintahnya.

${devLine ? `_${devLine}_\n` : ''}` +
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *${botName}*
┃ ⚡ v${botVer}
┃ ⏱️ ${uptime}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📚 *Menu Utama:*\n`;

  for (const cat of visibleCats) {
    if (cat.key === 'owner') {
      text += `• ${cat.emoji} *${prefix}menu owner*\n`;
    } else {
      text += `• ${cat.emoji} *${prefix}${cat.directCmd}*\n`;
    }
  }

  text += `\n🧭 *Tips:*\n`;
  text += `• Ketik *${prefix}menu* untuk lihat menu ini lagi\n`;
  text += `• Kamu juga bisa pakai gaya lama: *${prefix}menu tools* / *${prefix}menu game*`;

  return text;
}

const handler = async (m, ctx) => {
  const {
    sock, conn, bot,
    args = [],
    prefix = '.',
    isOwn = false,
    reply,
    text = '',
    pushname = ''
  } = ctx;

  const wa = sock || conn || bot;
  const uptime = runtime(process.uptime());

  // fallback args (biar .menu tools dari list response aman)
  const raw = (text || '').trim();
  const fallbackSub = raw.split(/\s+/)[1] || '';
  const subKey = (args[0] || fallbackSub || '').toLowerCase().trim();

  // ── .menu <kategori> → delegate ─────────────────────────
  if (subKey) {
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
        allowed.map(k => `• ${prefix}menu ${k}`).join('\n')
      );
    }

    const subPlugin = loadSub(pluginName);
    if (!subPlugin || typeof subPlugin !== 'function') {
      return reply(`⚠️ Sub-menu *${subKey}* belum tersedia.`);
    }

    try {
      return await subPlugin(m, ctx);
    } catch (err) {
      console.error(`[MenuV3] error di "${pluginName}":`, err);
      return reply(`❌ Error membuka menu *${subKey}*.`);
    }
  }

  // ── .menu → tampil menu utama ───────────────────────────
  const menuText = buildMainMenu({
    isOwn,
    prefix,
    uptime,
    pushname,
    senderJid: m.sender
  });

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

handler.command = ['menu', 'help'];
handler.tags = ['main'];
handler.help = ['menu', 'menu <kategori>'];

module.exports = handler;
