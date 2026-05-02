import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  // رسالة الاستخدام الصحيح
  if (!text) 
    return conn.sendMessage(m.chat, { text: `🍟 *الرجاء إدخال اسم المانغا*\n\nمثال: ${usedPrefix + command} black clover` }, { quoted: m })

  let res = await fetch('https://api.jikan.moe/v4/manga?q=' + encodeURIComponent(text))
  // رسالة خطأ في الاتصال بالـ API
  if (!res.ok) 
    return conn.sendMessage(m.chat, { text: `🚩 *حدث خطأ أثناء الاتصال*` }, { quoted: m })

  let json = await res.json()
  // رسالة خطأ عند عدم العثور على المانغا
  if (!json.data || !json.data[0]) 
    return conn.sendMessage(m.chat, { text: `🚩 *لم يتم العثور على معلومات عن:* ${text}` }, { quoted: m })

  let manga = json.data[0]
  let author = manga.authors?.[0]?.name || 'غير معروف' // تعريب 'Desconocido'

  let animeInfo = `
🍟 العنوان: ${manga.title_japanese || manga.title}
🚩 الفصول: ${manga.chapters || 'غير متاح'} // تعريب 'N/A'
💫 النوع: ${manga.type || 'غير متاح'} // تعريب 'N/A'
🗂 الحالة: ${manga.status || 'غير متاح'} // تعريب 'N/A'
🗃 المجلدات: ${manga.volumes || 'غير متاح'} // تعريب 'N/A'
🌟 المفضلة: ${manga.favorites || 'غير متاح'} // تعريب 'N/A'
🧮 التقييم: ${manga.score || 'غير متاح'} // تعريب 'N/A'
👥 الأعضاء: ${manga.members || 'غير متاح'} // تعريب 'N/A'
🔗 الرابط: ${manga.url || 'غير متاح'} // تعريب 'N/A'
👨‍🔬 المؤلف: ${author}
📝 الخلفية: ${manga.background || 'غير متاح'} // تعريب 'N/A'
💬 الملخص: ${manga.synopsis || 'غير متاح'} // تعريب 'N/A'
  `.trim()

  await conn.sendMessage(m.chat, {
    image: { url: manga.images?.jpg?.image_url || manga.images?.jpg?.large_image_url },
    caption: '🚩 *معلومات المانغا* 🚩\n\n' + animeInfo // تعريب العنوان
  }, { quoted: m })
}

handler.help = ['infomanga']
handler.tags = ['anime']
handler.command = ['infomanga', 'manga', 'مانغا', 'معلومات_مانغا'] // إضافة أوامر عربية
handler.register = true
export default handler