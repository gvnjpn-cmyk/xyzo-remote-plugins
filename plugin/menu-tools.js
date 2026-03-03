'use strict';
/**
 * Plugins-CJS/menu-tools.js — Sub-menu Tools
 */

const TOOLS_COMMANDS = [
  { cmd: 'tourl',      desc: 'Upload media ke URL (catbox/telegraph)'    },
  { cmd: 'hd',         desc: 'Enhance kualitas foto'                     },
  { cmd: 'esm2cjs',    desc: 'Convert kode ESM → CommonJS'               },
  { cmd: 'cjs2esm',    desc: 'Convert kode CJS → ESM'                    },
  { cmd: 'case2plugin',desc: 'Convert switch-case → plugin handler'      },
  { cmd: 'ping',       desc: 'Cek kecepatan & uptime bot'                },
  { cmd: 'runtime',    desc: 'Lihat uptime bot'                          },
  { cmd: 'totalfitur', desc: 'Hitung total fitur bot'                    },
];

const handler = async (m, ctx) => {
  const { prefix = '.', sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  🔧 *MENU TOOLS*\n`;
  text += `┃  ${TOOLS_COMMANDS.length} Command\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of TOOLS_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '🔧 Tools Menu',
              body: `${TOOLS_COMMANDS.length} command tersedia`,
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
handler.tags    = ['tools'];
handler.help    = [];

module.exports = handler;
