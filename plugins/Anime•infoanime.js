import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {

if (!text) return conn.reply(m.chat, 
`🎌 *البحث عن معلومات الأنمي*\n\n` +
`📝 *الاستخدام:*\n` +
`اكتب اسم الأنمي الذي تريد البحث عنه\n\n` +
`✨ *مثال:*\n` +
`${usedPrefix + command} ناروتو\n` +
`${usedPrefix + command} ون بيس\n` +
`${usedPrefix + command} هجوم العمالق`, m, rcanal)

let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
if (!res.ok) return conn.reply(m.chat, `❌ *حدث خطأ في البحث*\n\nلم أتمكن من العثور على معلومات عن هذا الأنمي`, m, rcanal)

let json = await res.json()
if (!json.data || json.data.length === 0) {
    return conn.reply(m.chat, `❌ *لم يتم العثور على نتائج*\n\nلا توجد معلومات عن: "${text}"`, m, rcanal)
}

let { chapters, title_japanese, url, type, score, members, background, status, volumes, synopsis, favorites } = json.data[0]
let author = json.data[0].authors[0]?.name || 'غير معروف'
let title_english = json.data[0].title_english || json.data[0].title

let animeingfo = 
`🎌 *معلومات الأنمي*\n\n` +
`📖 *العنوان:* ${title_english}\n` +
`🗾 *العنوان الياباني:* ${title_japanese || 'غير متوفر'}\n` +
`📚 *عدد الفصول:* ${chapters || 'غير محدد'}\n` +
`🎬 *النوع:* ${type || 'غير محدد'}\n` +
`📊 *الحالة:* ${status || 'غير معروفة'}\n` +
`📦 *عدد المجلدات:* ${volumes || 'غير محدد'}\n` +
`⭐ *التقييم:* ${score || 'غير متوفر'}\n` +
`❤️ *المفضلة:* ${favorites || 0}\n` +
`👥 *عدد الأعضاء:* ${members || 0}\n` +
`✍️ *المؤلف:* ${author}\n` +
`🔗 *الرابط:* ${url || 'غير متوفر'}\n\n` +
`📝 *الملخص:*\n${synopsis || 'لا يوجد ملخص متوفر'}`

conn.sendFile(m.chat, json.data[0].images.jpg.image_url, 'anime.jpg', animeingfo, m)

} 

handler.help = ['infoanime', 'معلومات-أنمي', 'بحث-أنمي'] 
handler.tags = ['anime', 'أنمي'] 
handler.command = ['infoanime', 'animeinfo', 'معلوماتأنمي', 'أنمي', 'بحثأنمي'] 

export default handler