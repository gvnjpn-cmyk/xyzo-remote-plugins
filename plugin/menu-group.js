'use strict';

module.exports = async (m, ctx) => {
  const { prefix = '.', reply } = ctx;

  const text =
`👥 *GROUP MENU*
━━━━━━━━━━━━━━━━━━
• *${prefix}welcome on/off*
• *${prefix}goodbye on/off*
• *${prefix}linkgc*
• *${prefix}kick @tag*
• *${prefix}promote @tag*
• *${prefix}demote @tag*

📌 Contoh: *${prefix}kick @user*`;

  return reply(text);
};
