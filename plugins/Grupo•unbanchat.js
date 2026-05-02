let handler = async (m, { conn }) => {
if (!(m.chat in global.db.data.chats)) return conn.reply(m.chat, '🍭 *هذه الدردشة غير مسجلة!*', m, fake)
let chat = global.db.data.chats[m.chat]
if (!chat.isBanned) return conn.reply(m.chat, '🍟 *يوتسوبا غير محظورة في هذه الدردشة!*', m, fake)
chat.isBanned = false
await conn.reply(m.chat, '🚩 *تم إلغاء حظر يوتسوبا في هذه الدردشة!*', m, fake)
}
handler.help = ['unbanchat'];
handler.tags = ['grupo'];
handler.command = ['unbanchat','desbanearchat','desbanchat', 'فك_حظر', 'الغاء_الحظر', 'رفع_الحظر']
handler.admin = true 
handler.botAdmin = true
handler.group = true

export default handler