'use strict';
/**
 * Plugins-CJS/menu-game.js — Sub-menu Game
 */

const GAME_COMMANDS = [
  { cmd: 'gamemenu',  desc: 'Lihat semua game tersedia'                  },
  { cmd: 'mafia',     desc: 'Main game Mafia (min. 4 pemain di grup)'    },
  { cmd: 'mafia create', desc: 'Buat room Mafia baru'                   },
  { cmd: 'mafia join',   desc: 'Bergabung ke room Mafia'                },
  { cmd: 'mafia start',  desc: 'Mulai game Mafia'                       },
  { cmd: 'mafia vote',   desc: 'Vote siang hari: .mafia vote @nama'     },
  { cmd: 'mafia status', desc: 'Lihat status game saat ini'             },
  { cmd: 'mafia end',    desc: 'Hentikan game Mafia'                    },
  { cmd: 'stopgame',  desc: 'Stop paksa game (owner only)'              },
];

const handler = async (m, ctx) => {
  const { prefix = '.', sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  🎮 *MENU GAME*\n`;
  text += `┃  Game: Mafia\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of GAME_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  text += `\n_⚠️ Game hanya bisa dimainkan di dalam grup._`;

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '🎮 Game Menu',
              body: 'Mafia • min. 4 pemain',
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
handler.tags    = ['game'];
handler.help    = [];

module.exports = handler;
