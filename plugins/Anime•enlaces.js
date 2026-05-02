var handler = async m => {
conn.reply(m.chat, ` 
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃          🎌 *روابط الأنمي* 🎌         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎬 https://kusonime.com
┃ 🎬 https://huntersekaisub.blogspot.com
┃ 🎬 https://riie.jp
┃ 🎬 https://m.meownime.ai
┃ 🎬 https://meownime.ltd
┃ 🎬 https://nimegami.id
┃ 🎬 https://animekompi.cam
┃ 🎬 https://nontonanimeid.top
┃ 🎬 https://kazefuri.vip
┃ 🎬 https://pendekarsubs.us
┃ 🎬 https://myanimelist.net
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📚 *مصادر متنوعة للأنمي:*
• مواقع لمشاهدة الأنمي
• مواقع للتحميل
• مجتمع الأنمي
• قوائم وتقييمات
• ترجمات عربية

🎯 *للمساعدة:* @kira_tengen
`, m, rcanal)
}

handler.help = ['animelink', 'روابط-أنمي', 'أنمي']
handler.tags = ['anime', 'أنمي']
handler.command = ['animelink', 'روابطأنمي', 'موقع أنمي', 'مواقعأنمي', 'رابط انمي']

handler.cookies = 1
handler.register = true

export default handler