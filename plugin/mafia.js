'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  const { sock } = ctx;

  // 🔥 Fallback parsing biar kebal args kosong
  const text = m.text || m.message?.conversation || '';
  const parts = text.trim().split(/\s+/);
  const args = parts.slice(1);

  return mafiaGame.handleMafia(
    sock,
    m,
    args,
    m.key.remoteJid
  );
};

handler.command = ['mafia', 'mfa', 'werewolf', 'ww'];
handler.tags = ['game'];
handler.help = ['mafia'];

module.exports = handler;
