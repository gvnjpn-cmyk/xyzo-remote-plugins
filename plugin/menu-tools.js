'use strict';

const handler = async (m, ctx) => {
  const { reply, prefix='.', pushname='' } = ctx;

  const dev = global.developer || {};
  const devLine = dev?.name ? `Dev: ${dev.name}` : null;

  const text =
`🛠️ *TOOLS MENU*
${devLine ? `_${devLine}_\n` : ''}

Pilih tools yang kamu mau:

• *${prefix}toimg*
• *${prefix}tomp3*
• *${prefix}tourl*
• *${prefix}sticker*
• *${prefix}qr*
• *${prefix}shortlink*

💡 Kamu bisa ketik salah satu command di atas langsung.`;

  return reply(text);
};

handler.command = ['tools', 'tool']; // ✅ jadi .tools
handler.tags = ['main'];
handler.help = ['tools'];

module.exports = handler;
