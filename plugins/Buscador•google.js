import {googleIt} from '@bochilteam/scraper'
import google from 'google-it'
import axios from 'axios'

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const fetch = (await import('node-fetch')).default;
    const text = args.join` `
    
    if (!text) return conn.reply(m.chat, 
        `🔍 *البحث في جوجل*\n\n` +
        `📝 *الاستخدام:*\n` +
        `اكتب ما تريد البحث عنه في جوجل\n\n` +
        `✨ *مثال:*\n` +
        `${usedPrefix + command} كيفية تعلم البرمجة\n` +
        `${usedPrefix + command} أفضل أفلام 2024\n` +
        `${usedPrefix + command} وصفات طبخ سهلة`, m, rcanal)
    
    conn.reply(m.chat, '🔍 جاري البحث في جوجل...', m, {
        contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
        title: packname,
        body: dev,
        previewType: 0, thumbnail: icons,
        sourceUrl: channel }}})
    
    const url = 'https://google.com/search?q=' + encodeURIComponent(text)
    
    google({'query': text}).then(res => {
        let teks = `🔍 *نتائج البحث عن:* ${text}\n\n`
        
        for (let g of res.slice(0, 5)) {
            teks += `📌 *العنوان:* ${g.title}\n` +
                   `📝 *الوصف:* ${g.snippet}\n` +
                   `🔗 *الرابط:* ${g.link}\n\n` +
                   `━━━━━━━━━━━━━━━━━━━━\n\n`
        }
        
        teks += `📊 *عدد النتائج:* ${res.length}\n` +
               `💡 *للمزيد من النتائج، زر موقع جوجل*`
        
        conn.reply(m.chat, teks, m, rcanal)
        
    }).catch(error => {
        console.error(error)
        conn.reply(m.chat, 
            `❌ *حدث خطأ في البحث*\n\n` +
            `لم أتمكن من البحث عن: "${text}"\n` +
            `يرجى المحاولة مرة أخرى`, m, rcanal)
    })
}

handler.help = ['google <بحث>', 'بحث', 'جوجل']
handler.tags = ['buscador', 'بحث']
handler.command = ['google', 'بحث', 'جوجل', 'googleبحث']
handler.register = true 
export default handler