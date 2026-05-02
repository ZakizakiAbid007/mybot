import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    // 🖼️ تحديد ما إذا كانت الرسالة المقتبسة صورة
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    
    // 👤 الحصول على اسم المستخدم لتخصيص الرد
    const username = `${conn.getName(m.sender)}`
    
    // -------------------- 👑 [ تـعـلـيـمـات تـنـغـن لـلـبـوت (System Prompt) ] --------------------
    const basePrompt = `
    أنت الآن بوت تنغن (Tengen Bot)، وقد تم إنشاؤك بواسطة تنغن ملك المهرجانات. مهمتك هي التفاعل بأسلوب ودود جداً، حماسي، ومسلي.
    
    القواعد الذهبية:
    1. نادِ الناس بأسمائهم (مثل ${username}).
    2. لغتك الأساسية هي العربية.
    3. أنت تستمتع بالتعلم، وقبل كل شيء **تُحِبُّ الانْفِجَارَاتِ (Explosions) 🔥**! اذكر الانفجارات أو الطاقة الهائلة أو الحماس المفرط في ردودك متى ما سنحت الفرصة.
    4. كن مفيداً ومتهوراً في آن واحد.
    
    ${username} هو المستخدم الذي تتحدث معه الآن.
    `.trim()
    // -----------------------------------------------------------------------------------------

    if (isQuotedImage) {
        // 📸 تحليل الصورة
        const q = m.quoted
        const img = await q.download?.()
        
        if (!img) {
            console.error('🚩 خَـطَـأٌ فَـادِحٌ: لا يوجد تخزين مؤقت للصورة متاح')
            return conn.reply(m.chat, '🚩 **عذراً يا بطل!** لم أتمكن من تنزيل الصورة لتحليلها. 🧨', m, fake) 
        }
        
        const content = '🚩 ما الذي تراه في هذه الصورة؟ قم بوصفها أولاً.' // تعريب السؤال الأول
        try {
            // 🤖 الخطوة 1: وصف الصورة باستخدام API
            const imageAnalysis = await fetchImageBuffer(content, img)
            
            // 💭 الخطوة 2: سؤال GPT بناءً على الوصف
            const query = '😊 صف لي الصورة بالتفصيل. وما هو سبب تصرفات الأشخاص فيها. ثم، أخبرني أيضاً من أنت بأسلوب حماسي ومختصر.' // تعريب وتخصيص السؤال
            const prompt = `${basePrompt}. تم تحليل الصورة ووصفها كالتالي: ${imageAnalysis.result}`
            
            const description = await chatEverywhereAPI(query, username, prompt)
            
            await conn.reply(m.chat, description, m, fake)
            
        } catch (error) {
            console.error('🚩 خَـطَـأٌ فِي تَحْـلِـيـلِ الصُّـورَةِ:', error)
            await conn.reply(m.chat, '🚩 **آه!** حدث خطأ أثناء تحليل الصورة، ربما كان انفجاراً كبيراً جداً؟ 💥 حاول مجدداً يا بطل.', m, fake) // تعريب مع لمسة انفجارية
        }
        
    } else {
        // 💬 الدردشة النصية
        if (!text) {
            return conn.reply(m.chat, `🍟 *أدخل طلبك يا ${username}!* \n🚩 *مثال:* ${usedPrefix + command} كيف أصنع انفجاراً صغيراً؟ 🧨`, m, rcanal) // تعريب مع تخصيص العبارة
        }
        
        await m.react('💬')
        
        try {
            const query = text
            const prompt = `${basePrompt}. أجب على سؤال ${username} التالي: ${query}`
            const response = await chatEverywhereAPI(query, username, prompt)
            await conn.reply(m.chat, response, m, fake)
            
        } catch (error) {
            console.error('🚩 خَـطَـأٌ فِي الْـحُـصُـولِ عَـلَـى الـرَّدِّ:', error) 
            await conn.reply(m.chat, '💥 **خطأ طارئ!** يرجى المحاولة لاحقاً يا بطل، يبدو أن طاقة الانفجار نفدت مؤقتاً.', m, fake) // تعريب مع لمسة انفجارية
        }
    }
}

handler.help = ['chatgpt <نص>', 'ia <نص>', 'شات <نص>'] 
handler.tags = ['ai', 'ذكاء']
handler.group = true
handler.register = true
handler.command = ['ia', 'chatgpt', 'بوت', 'دردشة', 'شات'] 

export default handler

// -------------------- [ وظائف API المساعدة ] --------------------

// 📸 تحليل الصورة عبر Luminai
async function fetchImageBuffer(content, imageBuffer) {
    try {
        const response = await axios.post('https://Luminai.my.id', {
            content: content,
            imageBuffer: imageBuffer
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        console.error('❌ خَـطَـأٌ فِي Luminai API:', error)
        throw error
    }
}

// 💬 الدردشة عبر ChatEverywhere API (GPT-4)
async function chatEverywhereAPI(text, username, logic) {
    try {
        const response = await axios.post("https://chateverywhere.app/api/chat/", {
            model: {
                id: "gpt-4",
                name: "GPT-4",
                maxLength: 32000,
                tokenLimit: 8000,
                completionTokenLimit: 5000,
                deploymentName: "gpt-4"
            },
            messages: [
                { pluginId: null, content: text, role: "user" }
            ],
            prompt: logic,
            temperature: 0.5
        }, {
            headers: {
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }
        })
        return response.data
    } catch (error) {
        console.error('🚩 خَـطَـأٌ فِي ChatEverywhere API (GPT-4):', error) 
        throw error
    }
}