'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  const { sock, isGroup, isOwner, text } = ctx;

  const body = text || '';
  const parts = body.trim().split(/\s+/);
  const args = parts.slice(1);

  m.isGroup = isGroup;
  m.isOwner = isOwner;
  m.pushName = ctx.pushName;

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
