'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`🔎 *SEARCH MENU*
━━━━━━━━━━━━━━━━━━
• *${prefix}yts <query>* — cari YouTube
• *${prefix}google <query>* — cari Google (kalau ada)
• *${prefix}pinterest <query>* — cari gambar (kalau ada)

📌 Contoh: *${prefix}yts dj tiktok viral*`;

  return reply(text);
};              renderLargerThumbnail: false,
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
