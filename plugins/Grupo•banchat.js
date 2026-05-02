let handler = async (m) => {

global.db.data.chats[m.chat].isBanned = true
conn.reply(m.chat, `🚩 *تم حظر هذه المجموعة بنجاح*`, m, rcanal)

}
handler.help = ['banchat']
handler.tags = ['grupo']
handler.command = ['banchat', 'وقف', 'حظر_الكروب']

handler.botAdmin = true
handler.admin = true 
handler.group = true

export default handler