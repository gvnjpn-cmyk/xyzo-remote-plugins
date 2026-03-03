'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  const { sock, args } = ctx;

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
