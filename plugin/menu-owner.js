'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`👑 *OWNER MENU*
━━━━━━━━━━━━━━━━━━
• *${prefix}setmode public/self*
• *${prefix}setwelcome on/off*
• *${prefix}setgoodbye on/off*
• *${prefix}setautoread on/off*
• *${prefix}setthumbnail <url>*
• *${prefix}update all* / *${prefix}update <file.js>*

📌 Contoh: *${prefix}setmode self*`;

  return reply(text);
};  text += `┃  ${OWNER_COMMANDS.length} Command\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const { cmd, desc } of OWNER_COMMANDS) {
    text += `• *${prefix}${cmd}*\n  └ ${desc}\n`;
  }

  text += `\n_⚠️ Semua command di atas hanya untuk owner._`;

  await wa.sendMessage(
    m.key.remoteJid,
    {
      text,
      contextInfo: global.thumbnail
        ? {
            externalAdReply: {
              title: '👑 Owner Menu',
              body: `${OWNER_COMMANDS.length} command tersedia`,
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

handler.command = []; // tidak punya command sendiri, hanya dipanggil oleh menu.js
handler.tags    = ['owner'];
handler.help    = [];

module.exports = handler;
