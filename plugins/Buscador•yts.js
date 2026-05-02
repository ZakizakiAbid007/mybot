import yts from 'yt-search'

var handler = async (m, { text, conn, args, command, usedPrefix }) => {

if (!text) return conn.reply(m.chat, 
`🎵 *البحث في يوتيوب*\n\n` +
`📝 *الاستخدام:*\n` +
`اكتب عنوان الفيديو الذي تريد البحث عنه\n\n` +
`✨ *أمثلة:*\n` +
`${usedPrefix + command} أغاني عربية\n` +
`${usedPrefix + command} دروس برمجة\n` +
`${usedPrefix + command} أفلام كرتون\n` +
`${usedPrefix + command} وصفات طبخ`, m, rcanal)

conn.reply(m.chat, '🔍 جاري البحث في يوتيوب...', m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, thumbnail: icons,
sourceUrl: channel }}})

try {
let results = await yts(text)
let tes = results.all

if (!tes || tes.length === 0) {
return conn.reply(m.chat, 
`❌ *لم يتم العثور على نتائج*\n\n` +
`لا توجد فيديوهات عن: "${text}"\n` +
`جرب استخدام كلمات بحث مختلفة`, m, rcanal)
}

let teks = results.all.map((v, index) => {
switch (v.type) {
case 'video': return `🎬 *الفيديو ${index + 1}:*\n` +
`📌 *العنوان:* ${v.title}\n` +
`🔗 *الرابط:* ${v.url}\n` +
`⏱️ *المدة:* ${v.timestamp || 'غير معروفة'}\n` +
`📅 *تاريخ النشر:* ${v.ago}\n` +
`👁️ *المشاهدات:* ${v.views}\n` +
`📊 *القناة:* ${v.author?.name || 'غير معروفة'}`
}}).filter(v => v).join('\n\n━━━━━━━━━━━━━━━━━━━━\n\n')

let firstResult = tes[0]
let resultInfo = 
`🎵 *نتائج البحث عن:* ${text}\n\n` +
`📊 *عدد النتائج:* ${tes.length}\n\n` +
`━━━━━━━━━━━━━━━━━━━━\n\n` +
teks +
`\n\n━━━━━━━━━━━━━━━━━━━━\n\n` +
`💡 *للمزيد من النتائج، زر موقع يوتيوب*`

conn.sendFile(m.chat, firstResult.thumbnail, 'youtube.jpg', resultInfo, m)

} catch (error) {
console.error(error)
conn.reply(m.chat, 
`❌ *حدث خطأ في البحث*\n\n` +
`لم أتمكن من البحث عن: "${text}"\n` +
`يرجى المحاولة مرة أخرى`, m, rcanal)
}}

handler.help = ['ytsearch', 'يوتيوب', 'بحث-يوتيوب']
handler.tags = ['buscador', 'بحث']
handler.command = ['playlist', 'ytbuscar', 'yts', 'ytsearch', 'يوتيوب', 'تيوب', 'شغل2']

handler.register = true
handler.estrellas = 1

export default handler