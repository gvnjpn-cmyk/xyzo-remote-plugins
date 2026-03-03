'use strict';

const mafiaGame = require('../Games/mafia');

const handler = async (m, ctx) => {
  return mafiaGame(m, ctx);
};

handler.command = ['mafia', 'mf', 'mfa'];
handler.tags = ['game'];
handler.help = ['mafia'];

module.exports = handler;