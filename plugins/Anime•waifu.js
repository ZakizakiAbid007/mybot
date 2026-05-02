import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
try {
await m.react('⏳')
conn.reply(m.chat, '🎌 جاري البحث عن الويفو الخاصة بك...', m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, thumbnail: icons,
sourceUrl: channel }}})
let res = await fetch('https://api.waifu.pics/sfw/waifu')
if (!res.ok) return conn.reply(m.chat, '❌ فشل في جلب الصورة', m)
let json = await res.json()
if (!json.url) return conn.reply(m.chat, '❌ لم أتمكن من العثور على صورة', m)
await conn.sendFile(m.chat, json.url, 'waifu.jpg', 
`🌸 *ويفو عشوائية* 🌸\n\n` +
`✨ تم العثور على ويفو جميلة لك!\n` +
`🎌 استمتع بالصورة العشوائية`, m)
await m.react('✅')
} catch {
await m.react('❌')
conn.reply(m.chat, '❌ حدث خطأ أثناء البحث عن الويفو', m)
}}
handler.help = ['waifu', 'ويفو', 'انميبنت']
handler.tags = ['anime', 'أنمي']
handler.command = ['waifu', 'ويفو', 'انميبنت']
handler.register = true 
export default handler