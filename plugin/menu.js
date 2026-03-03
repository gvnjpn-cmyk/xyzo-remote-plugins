'use strict'

const fs = require('fs')
const path = require('path')
const { name, version } = require('../package.json')
const { runtime } = require('../System/message')

// ─── Developer ───────────────────────────────
const DEV_NAME = global.developer?.name || 'Unknown Developer'

// ─── Plugin Count (Dynamic) ──────────────────
function countPlugins() {
  const dir = path.join(__dirname)
  return fs.readdirSync(dir).filter(f => f.endsWith('.js')).length
}

// ─── Submenu Mapping ─────────────────────────
const SUB_MAP = {
  owner: 'menu-owner',
  group: 'menu-group',
  game: 'menu-game',
  tools: 'menu-tools',
  download: 'menu-download',
  search: 'menu-search'
}

const CATEGORIES = [
  { emoji: '👑', key: 'owner', ownerOnly: true },
  { emoji: '👥', key: 'group' },
  { emoji: '🎮', key: 'game' },
  { emoji: '🛠️', key: 'tools' },
  { emoji: '📥', key: 'download' },
  { emoji: '🔎', key: 'search' }
]

// ─── Cache Loader ────────────────────────────
const _cache = new Map()

function loadSub(pluginName) {
  if (_cache.has(pluginName)) return _cache.get(pluginName)
  try {
    const mod = require(path.join(__dirname, `${pluginName}.js`))
    _cache.set(pluginName, mod)
    return mod
  } catch {
    return null
  }
}

// ─── Main Handler ────────────────────────────
const handler = async (m, ctx) => {
  const {
    sock,
    args = [],
    prefix = '.',
    isOwn = false,
    reply,
    text = ''
  } = ctx

  const input = (args[0] || '').toLowerCase()
  const raw = text.replace(prefix, '').toLowerCase()

  // Direct command
  if (SUB_MAP[raw]) {
    const sub = loadSub(SUB_MAP[raw])
    if (sub) return sub(m, ctx)
  }

  // menu <kategori>
  if (input && SUB_MAP[input]) {
    if (input === 'owner' && !isOwn)
      return reply('🔒 Menu khusus owner.')
    const sub = loadSub(SUB_MAP[input])
    if (sub) return sub(m, ctx)
  }

  // Main menu
  const user = m.sender.split('@')[0]
  const uptime = runtime(process.uptime())
  const totalPlugins = countPlugins()

  const visible = CATEGORIES.filter(c => !c.ownerOnly || isOwn)

  let txt =
`╭━━━〔 ${name} 〕━━━⬣
┃ Version   : v${version}
┃ Runtime   : ${uptime}
┃ Plugins   : ${totalPlugins}
╰━━━━━━━━━━━━━━━━⬣

Halo @${user} 👋

Bot ini dirancang dengan sistem modular agar fleksibel, ringan, dan mudah dikembangkan.

📂 *Menu Tersedia*
`

  for (const cat of visible) {
    txt += `\n${cat.emoji}  ${prefix}${cat.key}`
  }

  txt += `

━━━━━━━━━━━━━━━━━━
📌 Gunakan:
• ${prefix}menu <kategori>
• Atau langsung: ${prefix}tools

👨‍💻 Developer : ${DEV_NAME}
`

  const contextInfo = global.thumbnail
    ? {
        externalAdReply: {
          title: `${name} v${version}`,
          body: `Developed by ${DEV_NAME}`,
          thumbnailUrl: global.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    : {}

  await sock.sendMessage(
    m.chat,
    {
      text: txt,
      mentions: [m.sender],
      contextInfo
    },
    { quoted: m }
  )
}

handler.command = ['menu', 'help', ...Object.keys(SUB_MAP)]
handler.tags = ['main']
handler.help = ['menu']

module.exports = handler
