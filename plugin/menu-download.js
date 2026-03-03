'use strict';
/**
 * Plugins-CJS/menu-download.js — Sub-menu Download
 */

const DL_COMMANDS = [
  { cmd: 'ytmp4',      desc: 'Download YouTube video (MP4)'       },
  { cmd: 'play',       desc: 'Download YouTube audio (MP3)'       },
  { cmd: 'tiktok',     desc: 'Download video TikTok'              },
  { cmd: 'instagram',  desc: 'Download foto/video Instagram'      },
  { cmd: 'facebook',   desc: 'Download video Facebook'            },
  { cmd: 'twitter',    desc: 'Download video Twitter/X'           },
  { cmd: 'aio',        desc: 'Download dari sosmed manapun (AIO)' },
  { cmd: 'spotify',    desc: 'Download lagu Spotify'              },
  { cmd: 'pinterest',  desc: 'Download foto Pinterest'            },
];

const handler = async (m, ctx) => {
  const { prefix = '.', sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  📥 *MENU DOWNLOAD*\n`;
  text += `┃  ${DL_COMMANDS.length} Command\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of DL_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  text += `\n💡 Contoh: *${prefix}ytmp4 https://youtu.be/xxx | 720*`;

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '📥 Download Menu',
              body: `${DL_COMMANDS.length} command tersedia`,
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
handler.tags    = ['download'];
handler.help    = [];

module.exports = handler;
