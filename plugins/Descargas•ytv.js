import Scraper from "@SumiFX/Scraper"

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // إضافة القناة في كل الردود
    const myChannel = "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V";
    const channelText = `\n\n📢 *قناتنا:* ${myChannel}`;

    if (!args[0]) return m.reply(`🍭 أدخل رابط فيديو اليوتيوب مع الأمر.${channelText}\n\n\`مثال:\`\n` + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`)
    if (!args[0].match(/youtu/gi)) return conn.reply(m.chat, `تحقق من أن الرابط من اليوتيوب.${channelText}`, m)

    let user = global.db.data.users[m.sender]
    try {
        let { title, size, quality, thumbnail, dl_url } = await Scraper.ytmp4(args[0])
        if (size.includes('GB') || size.replace(' MB', '') > 1000) { 
            return await m.reply(`الملف يزن أكثر من 1000 ميجابايت، تم إلغاء التحميل.${channelText}`)
        }
        
        let txt = `╭─⬣「 *تحميل يوتيوب* 」⬣\n`
            txt += `│  ≡◦ *🍭 العنوان ∙* ${title}\n`
            txt += `│  ≡◦ *🪴 الجودة ∙* ${quality}\n`
            txt += `│  ≡◦ *⚖ الحجم ∙* ${size}\n`
            txt += `╰─⬣`
            txt += channelText
        
        await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m)
        await conn.sendFile(m.chat, dl_url, title + '.mp4', `*🍭 العنوان ∙* ${title}\n*🪴 الجودة ∙* ${quality}${channelText}`, m, false, { asDocument: user.useDocument })
    } catch {
        m.reply(`❌ حدث خطأ في تحميل الفيديو.${channelText}`)
    }
}

handler.help = ['ytmp4 <رابط يوتيوب>']
handler.tags = ['downloads']
handler.command = ['ytmp4', 'yt', 'ytv', 'يوتيوب', 'فيديويوتيوب']
handler.register = true 
//handler.limit = 1
export default handler