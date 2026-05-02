import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
    
    if (!text) { 
        return conn.reply(m.chat, 
        `🎯 *أمر Gemini الذكي*\n\n` +
        `💡 *الاستخدام:*\n` +
        `اكتب سؤالك بعد الأمر\n\n` +
        `📝 *مثال:*\n` +
        `${usedPrefix + command} ما هو الذكاء الاصطناعي؟\n\n` +
        `🧠 *المساعدة:* اكتب أي سؤال وسأجيبك عليه`, m)
    }
    
    try {
        await m.react('⏳')
        
        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`)
        var res = await apii.json()
        
        let responseText = res.result || '❌ لم أتمكن من الحصول على إجابة'
        
        // تنسيق الإجابة بشكل جميل
        let formattedResponse = 
        `🧠 *Gemini الذكي*\n\n` +
        `📝 *سؤالك:* ${text}\n\n` +
        `💬 *الإجابة:*\n${responseText}\n\n` +
        `✨ *تمت الإجابة بنجاح*`
        
        await conn.reply(m.chat, formattedResponse, m)
        await m.react('✅')
        
    } catch (error) {
        console.error(error)
        await m.react('❌')
        await conn.reply(m.chat, 
        `❌ *حدث خطأ*\n\n` +
        `لم أستطع الحصول على إجابة من Gemini\n` +
        `يرجى المحاولة مرة أخرى لاحقًا\n\n` +
        `📞 *الدعم:* @kira_tengen`, m)
    }
}

handler.command = ['gemini', 'جيمني', 'ذكي', 'ai']
handler.help = ['gemini <سؤال>']
handler.tags = ['ai', 'ذكاء']
handler.group = true

export default handler