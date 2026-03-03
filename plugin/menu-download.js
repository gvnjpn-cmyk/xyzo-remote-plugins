'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`📥 *DOWNLOAD MENU*
━━━━━━━━━━━━━━━━━━
• *${prefix}ytmp3 <url>*
• *${prefix}ytmp4 <url>*
• *${prefix}tiktok <url>*
• *${prefix}ig <url>*

📌 Contoh: *${prefix}ytmp3 https://youtu.be/...*`;

  return reply(text);
};
