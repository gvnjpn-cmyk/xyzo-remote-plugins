'use strict';
/**
 * Plugins-CJS/menu-owner.js — Sub-menu Owner
 * Dipanggil oleh menu.js saat user ketik: .menu owner
 */

// ─── Daftar command owner (update manual sesuai isi XYZO.js) ─────────────────
const OWNER_COMMANDS = [
  { cmd: 'setting',       desc: 'Panel pengaturan bot'           },
  { cmd: 'setmode',       desc: 'Ubah mode public/self'          },
  { cmd: 'setwelcome',    desc: 'Aktifkan/nonaktifkan welcome'   },
  { cmd: 'setgoodbye',    desc: 'Aktifkan/nonaktifkan goodbye'   },
  { cmd: 'setautoread',   desc: 'Aktifkan/nonaktifkan auto read' },
  { cmd: 'setthumbnail',  desc: 'Ganti thumbnail menu'           },
  { cmd: 'setppbot',      desc: 'Ganti foto profil bot'          },
  { cmd: 'delppbot',      desc: 'Hapus foto profil bot'          },
  { cmd: 'addowner',      desc: 'Tambah owner bot'               },
  { cmd: 'delowner',      desc: 'Hapus owner bot'                },
  { cmd: 'listowner',     desc: 'Lihat daftar owner'             },
  { cmd: 'autoread',      desc: 'Toggle auto-read pesan'         },
  { cmd: 'self',          desc: 'Mode self (hanya owner)'        },
  { cmd: 'public',        desc: 'Mode public (semua user)'       },
  { cmd: 'addcase',       desc: 'Tambah case dinamis'            },
  { cmd: 'delcase',       desc: 'Hapus case dinamis'             },
  { cmd: 'listcase',      desc: 'Lihat semua case'               },
  { cmd: 'getcase',       desc: 'Lihat isi case tertentu'        },
  { cmd: 'setmafiaimg',   desc: 'Set gambar fase mafia'          },
  { cmd: 'resetmafiaimg', desc: 'Reset gambar mafia ke default'  },
];

const handler = async (m, ctx) => {
  const { prefix = '.', reply, sock, conn, bot } = ctx;
  const wa = sock || conn || bot;

  let text = `╭━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `┃  👑 *MENU OWNER*\n`;
  text += `┃  ${OWNER_COMMANDS.length} Command\n`;
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
