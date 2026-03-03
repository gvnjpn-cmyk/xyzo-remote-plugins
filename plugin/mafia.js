'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  const { sock, args, isGroup, isOwner, pushName } = ctx;

  // inject proper properties ke m
  m.isGroup = isGroup;
  m.isOwner = isOwner;
  m.pushName = pushName;

  return mafiaGame.handleMafia(
    sock,
    m,
    args || [],
    m.key.remoteJid
  );
};

handler.command = ['mafia', 'mfa', 'werewolf', 'ww'];
handler.tags = ['game'];
handler.help = ['mafia'];

module.exports = handler;
