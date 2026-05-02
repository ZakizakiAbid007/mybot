import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {

let text1 = `🎯 طَلَبَهُ:\n🤖 البوت:\n⚡ صَانِعُهُ:`
let text2 = `✧ ${nombre}\n✧ ${global.botname}\n✧ ${global.dev}`
let stiker = false

try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''

if (/webp|image|video/g.test(mime)) {
if (/video/g.test(mime)) if ((q.msg || q).seconds > 8) return m.reply(`⏳ *الفيديو لا يمكن أن يزيد عن 8 ثوانٍ!*`)

let img = await q.download?.()

if (!img) return conn.reply(m.chat, 
`❌ *فشل في التحويل*\n\n` +
`📌 *الطريقة الصحيحة:*\n` +
`1. أرسل صورة/فيديو/gif\n` +
`2. قم بالرد عليها بالأمر: *${usedPrefix + command}*`,
m
)

let out
try {
stiker = await sticker(img, false, text1, text2)
} catch (e) {
console.error(e)
} finally {
if (!stiker) {
if (/webp/g.test(mime)) out = await webp2png(img)
else if (/image/g.test(mime)) out = await uploadImage(img)
else if (/video/g.test(mime)) out = await uploadFile(img)
if (typeof out !== 'string') out = await uploadImage(img)
stiker = await sticker(false, out, text1, text2)
}}
} else if (args[0]) {
if (isUrl(args[0])) stiker = await sticker(false, args[0], text1, text2)
else return m.reply(`❌ *الرابط غير صحيح*`)
}
} catch (e) {
console.error(e)
if (!stiker) stiker = e
} finally {
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { 
contextInfo: { 
'forwardingScore': 200, 
'isForwarded': false, 
externalAdReply: { 
showAdAttribution: false, 
title: `${global.botname}`,
body: `🎨 ملصق بواسطة • ${global.botname}`,
mediaType: 2, 
sourceUrl: redes, 
thumbnail: icons
}
}
}, { quoted: m })

else return conn.reply(m.chat, 
`❌ *فشل في إنشاء الملصق*\n\n` +
`📌 *جرب هذه الطرق:*\n` +
`• أرسل صورة ورد عليها بالأمر\n` +
`• أرسل فيديو قصير (8 ثواني)\n` +
`• أرسل رابط صورة مباشر\n` +
`• تأكد أن الملف غير تالف`,
m
)
}}

// ✅ التعريب: الأوامر والمساعدة
handler.help = ['ملصق <صورة>', 'ستيكر <رابط>', 'sticker <img>']
handler.tags = ['sticker', 'ملصق', 'لمصق']
handler.command = ['ملصق', 'ستيكر', 's', 'sticker', 'لمصق']

export default handler

const isUrl = (text) => {
return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))}