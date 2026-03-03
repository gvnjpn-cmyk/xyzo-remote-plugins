// =============================================
//   XYZO Asisten - Game Hub Plugin
//   Saat ini: Game Mafia
// =============================================
'use strict';

const engine = require('../Games/engine');
const { handleMafia, handleMafiaDM } = require('../Games/mafia');

const handler = async (m, { sock, conn, isOwner }) => {
    const bot = sock || conn;
    const cmd      = m.command?.toLowerCase();
    const args     = m.text ? m.text.trim().split(/ +/) : [];
    const groupJid = m.isGroup ? m.chat : null;
    const send     = (text) => bot.sendMessage(m.chat, { text }, { quoted: m });

    // ── DM Night Actions (kill / save / check) ────────────────────────────────
    if (!m.isGroup && ['kill', 'save', 'check'].includes(cmd)) {
        return handleMafiaDM(bot, m, cmd, args);
    }

    // ── Game Menu ─────────────────────────────────────────────────────────────
    if (cmd === 'gamemenu' || cmd === 'listgame') {
        const active = engine.get(groupJid);
        return send(
`🎮 *GAME MENU - XYZO Asisten*
══════════════════════════════

${active
    ? `⚡ Game aktif: *${active.type.toUpperCase()}* (${active.state})\n`
    : '✅ Tidak ada game aktif\n'}
🎭 *MAFIA*
• *.mafia create* — Buat room
• *.mafia join* — Bergabung
• *.mafia start* — Mulai game
• *.mafia vote @nama* — Vote saat siang
• *.mafia status* — Lihat status
• *.mafia end* — Hentikan game

Min. *4 pemain*
Role: Mafia🔪 Dokter🩺 Mata-mata👁️ Warga👤

══════════════════════════════
*.stopgame* — Stop paksa (owner only)`
        );
    }

    // ── Mafia ─────────────────────────────────────────────────────────────────
    if (cmd === 'mafia') {
        if (!m.isGroup) return send('❌ Hanya bisa di grup!');
        m.isOwner = isOwner;
        return handleMafia(bot, m, args, groupJid);
    }

    // ── Stop paksa ────────────────────────────────────────────────────────────
    if (cmd === 'stopgame' || cmd === 'endgame') {
        if (!isOwner) return send('❌ Hanya owner yang bisa stop paksa!');
        if (!groupJid) return send('❌ Hanya bisa di grup!');
        if (!engine.get(groupJid)) return send('✅ Tidak ada game yang berjalan.');
        engine.destroy(groupJid);
        return send('🛑 Game dihentikan paksa oleh owner!');
    }
};

handler.command = ['gamemenu', 'listgame', 'mafia', 'kill', 'save', 'check', 'stopgame', 'endgame'];
handler.tags    = ['game'];
handler.help    = ['gamemenu', 'mafia'];

module.exports = handler;
