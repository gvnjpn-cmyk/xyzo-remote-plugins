'use strict';
/**
 * Plugins-CJS/menu-search.js — Sub-menu Search
 */

const SEARCH_COMMANDS = [
  { cmd: 'ytsearch',  desc: 'Cari video YouTube'               },
  { cmd: 'yts',       desc: 'Alias ytseach'                    },
];

const handler = async (m, ctx) => {
  const { prefix = '.', sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  🔍 *MENU SEARCH*\n`;
  text += `┃  ${SEARCH_COMMANDS.length} Command\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of SEARCH_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  text += `\n💡 Contoh: *${prefix}ytsearch Alan Walker*`;

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '🔍 Search Menu',
              body: `${SEARCH_COMMANDS.length} command tersedia`,
              thumbnailUrl: global.thumbnail,
              mediaType: 1,
              renderLargerThumbnail: false,
            }
          }
        : {}
    },
    { quoted: m }
  );
};

handler.command = [];
handler.tags    = ['search'];
handler.help    = [];

module.exports = handler;
