const { updatePlugin, updateAll } = require("../Library/updater")

const handler = async (m, ctx) => {
  const { args, reply, isOwn } = ctx

  if (!isOwn) return reply("🔒 Owner only.")

  if (!args[0]) {
    return reply("Contoh:\n.update all\n.update menu.js")
  }

  if (args[0] === "all") {
    reply("🔄 Updating semua plugin...")
    const res = await updateAll()
    return reply(res.message)
  }

  const fileName = args[0]

  if (!fileName.endsWith(".js")) {
    return reply("Gunakan nama file lengkap. Contoh: menu.js")
  }

  reply(`🔄 Updating ${fileName}...`)
  const res = await updatePlugin(fileName)

  reply(res.message)
}

handler.command = ["update"]
handler.owner = true

module.exports = handler