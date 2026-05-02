import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

// التحقق من المدخلات: يجب إما الاقتباس أو إدخال نص
if (!m.quoted && !text) return conn.reply(m.chat, `🚩 الرجاء إدخال نص أو اقتباس رسالة`, m, rcanal)

try { 
// 1. محاولة التنفيذ بالطريقة المتقدمة (إعادة بناء الرسالة)
let users = participants.map(u => conn.decodeJid(u.id))
let q = m.quoted ? m.quoted : m || m.text || m.sender
let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender

// إعادة بناء الرسالة مع وسم الجميع
let msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c }}, { quoted: null, userJid: conn.user.id }), text || q.text, conn.user.jid, { mentions: users })
await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

} catch {  

// 2. آلية الفشل الاحتياطي (تنفيذ طريقة الإخفاء التقليدية)

let users = participants.map(u => conn.decodeJid(u.id))
let quoted = m.quoted ? m.quoted : m
let mime = (quoted.msg || quoted).mimetype || ''
let isMedia = /image|video|sticker|audio/.test(mime)
let more = String.fromCharCode(8206)
let masss = more.repeat(850) // أحرف Unicode لإخفاء النص
let htextos = `${text ? text : "*مرحباً!!*"}` // النص المخصص (أو الافتراضي)

// الوسم إذا كان المحتوى صورة
if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos, mentions: users }, { quoted: null })
// الوسم إذا كان المحتوى فيديو
} else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: null })
// الوسم إذا كان المحتوى صوت
} else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: null })
// الوسم إذا كان المحتوى ملصق
} else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, {sticker: mediax, mentions: users}, { quoted: null })
// وسم النص مع تقنية الإخفاء
} else {
await conn.relayMessage(m.chat, {extendedTextMessage:{text: `${masss}\n${htextos}\n`, ...{ contextInfo: { mentionedJid: users, externalAdReply: { thumbnail: icons, sourceUrl: redes }}}}}, {})
}}

}

// إعدادات المعالج
handler.help = ['وسم_مخفي'] // ترجمة المساعدة
handler.tags = ['مجموعة'] // ترجمة الوسم
handler.command = ['مخفي', 'إشعار', 'وسم'] // ترجمة الأوامر

handler.group = true // يعمل في المجموعات فقط
handler.admin = true // يتطلب أن يكون مرسل الأمر مشرفًا
handler.register = true // يتطلب التسجيل

export default handler