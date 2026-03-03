'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`🎮 *GAME MENU*
━━━━━━━━━━━━━━━━━━
• *${prefix}tebakgambar*
• *${prefix}tebakkata*
• *${prefix}caklontong*

📌 Contoh: *${prefix}tebakgambar*`;

  return reply(text);
};
