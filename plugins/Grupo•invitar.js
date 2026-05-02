let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) return await m.reply(`🍟 أدخل الرقم الذي تريد إرسال دعوة المجموعة إليه\n\n🚩 مثال :\n*${usedPrefix + command}* 1234567890`)
if (text.includes('+')) return await m.reply('🚩 أدخل الرقم بدون *+*')
if (isNaN(text)) return await m.reply('🍟 أدخل الأرقام فقط مع رمز الدولة بدون مسافات')
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
await conn.reply(text+'@s.whatsapp.net', `🍟 *دعوة للمجموعة*\n\nقام مستخدم بدعوتك للانضمام إلى هذه المجموعة \n\n${link}`, m, {mentions: [m.sender]})
await m.reply(`🍟 تم إرسال رابط الدعوة إلى المستخدم.`) 

}
handler.help = ['invite *<numero>*']
handler.tags = ['grupo']
handler.command = ['invite', 'invitar', 'دعوة', 'ادعو'] 
handler.group = true
//handler.admin = true
handler.botAdmin = true

export default handler