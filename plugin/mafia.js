'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  const { sock } = ctx;

  // fallback parsing
  const text = m.text || m.message?.conversation || '';
  const parts = text.trim().split(/\s+/);
  const args = parts.slice(1);

  const groupJid = m.key.remoteJid;

  return mafiaGame.handleMafia(
    sock,
    m,
    args,
    groupJid
  );
};

handler.command = ['mafia', 'mfa', 'werewolf', 'ww'];
handler.tags = ['game'];
handler.help = ['mafia'];

module.exports = handler;
