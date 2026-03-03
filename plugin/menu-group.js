'use strict';
/**
 * Plugins-CJS/menu-group.js — Sub-menu Group
 */

const GROUP_COMMANDS = [
  { cmd: 'promote',   desc: 'Jadikan member sebagai admin'       },
  { cmd: 'demote',    desc: 'Copot admin jadi member biasa'      },
  { cmd: 'kick',      desc: 'Keluarkan member dari grup'         },
  { cmd: 'tagall',    desc: 'Tag semua member grup'              },
  { cmd: 'hidetag',   desc: 'Tag semua tanpa terlihat (hide)'    },
  { cmd: 'linkgc',    desc: 'Tampilkan link undangan grup'       },
  { cmd: 'resetlinkgc', desc: 'Reset link undangan grup'         },
  { cmd: 'open',      desc: 'Buka grup (semua bisa kirim pesan)' },
  { cmd: 'close',     desc: 'Tutup grup (hanya admin)'           },
  { cmd: 'welcome',   desc: 'Toggle pesan selamat datang'        },
  { cmd: 'goodbye',   desc: 'Toggle pesan perpisahan'            },
];

const handler = async (m, ctx) => {
  const { prefix = '.', sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  👥 *MENU GROUP*\n`;
  text += `┃  ${GROUP_COMMANDS.length} Command\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of GROUP_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  text += `\n_⚠️ Sebagian command memerlukan bot sebagai admin._`;

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '👥 Group Menu',
              body: `${GROUP_COMMANDS.length} command tersedia`,
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
handler.tags    = ['group'];
handler.help    = [];

module.exports = handler;
