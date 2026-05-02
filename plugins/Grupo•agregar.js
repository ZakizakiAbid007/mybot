var handler = async (m, { conn, args, text, usedPrefix, command }) => {

let who 
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
else who = m.chat
let name = await conn.getName(m.sender)        
let user = global.db.data.users[who]
let nom = conn.getName(m.sender)
if (!global.db.data.settings[conn.user.jid].restrict) return conn.reply(m.chat, `🚩 *هذا الأمر معطل من قبل المطور*`, m, rcanal) 
if (!text) return await m.reply(`🍟 أدخل رقم الشخص الذي تريد إضافته إلى هذه المجموعة.\n\n🚩 مثال:\n*${usedPrefix + command}* 66666666666`)
if (text.includes('+')) return await m.reply(`🍟 أدخل الرقم بدون *(+)*`)
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

await conn.reply(text+'@s.whatsapp.net', `*🍟 مرحباً! أنا يوتسوبا ناكانو، شخص ما دعاك إلى مجموعته.*\n\n*الرابط*\n${link}`, m, {mentions: [m.sender]})
await m.reply(`🍟 *جاري إرسال الدعوة إلى الخاص لـ ${nom}*\n\n*📅 ${fecha}*\n⏰ *${tiempo}*`) 

}
handler.help = ['add']
handler.tags = ['grupo']
handler.command = ['add', 'agregar', 'añadir', 'اضف', 'أضف', 'ضيف']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler