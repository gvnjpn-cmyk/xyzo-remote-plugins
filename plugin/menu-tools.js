'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`🧰 *TOOLS MENU*
━━━━━━━━━━━━━━━━━━
Ketik command langsung ya (tanpa .menu):

• *${prefix}ping* — cek speed bot
• *${prefix}runtime* — uptime bot
• *${prefix}ttf* — total fitur
• *${prefix}update all* — update semua plugin (owner)

📌 Contoh: *${prefix}ping*`;

  return reply(text);
};
