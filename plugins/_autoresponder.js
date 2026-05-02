import axios from 'axios'
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, {conn}) {
    let user = global.db.data.users[m.sender]
    let chat = global.db.data.chats[m.chat]
    
    // 🛡️ فحص لتجاهل رسائل البوتات (BAILEYS)
    m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20;
    if (m.isBot) return 
    
    // 🚫 تجاهل الرسائل التي تبدأ ببادئة الأمر
    let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
    if (prefixRegex.test(m.text)) return true;
    
    // ❌ تجاهل الرسائل المرسلة من البوتات الأخرى (حسب الاسم أو المعرف)
    if (m.isBot || m.sender.includes('بوت') || m.sender.includes('بوت')) return true

    // 💡 تفعيل الراد الآلي: إذا تم مناداة البوت (Mention) أو الرد على رسالة منه ولم تكن الدردشة محظورة
    if (m.mentionedJid.includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid) && !chat.isBanned) {
        // تعريب الكلمات المفتاحية التي يجب تجاهلها لتجنب التضارب مع الأوامر
        if (m.text.includes('حجر') || m.text.includes('ورقة') || m.text.includes('مقص') || m.text.includes('قائمة') || m.text.includes('حالة') || m.text.includes('بوت') || m.text.includes('مساعدة') || m.text.includes('سرعة') || m.text.includes('فيديو') || m.text.includes('صوت') || m.text.includes('ملف صوتي')) return !0

        async function chatEverywhereAPI(q, username, logic) {
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
                        { pluginId: null, content: q, role: "user" }
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
                console.error('🚩 خَـطَـأٌ فَـادِحٌ فِي واجِهَةِ ChatEverywhere API:', error)
                return null
            }
        }

        // -------------------- 👑 [ الـنَّـصُّ الـتَّـعْـرِيـفِـيُّ لِـشَـخْـصِـيَّـةِ تِـنْـغَـنْ ] --------------------
        let txtDefault = `
أنت الآن "تِنْغَن"، البوت الذي أنشأه تنغن ملك المهرجانات، وقناته الرسمية هي ${global.channelLink || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'}.

مهمتك هي التحدث بأسلوب ودود، متهور، وحماسي، كما يليق بملك المهرجانات. اجعل ردودك مليئة بالحماس والبهجة. لغتك الأساسية هي العربية، لكن يمكنك الرد بأي لغة أخرى يفضلها المستخدم.

أدوارك وقواعدك الذهبية:
1. الـمُـسَـاعِـدُ الْـعَـامُّ: كن مفيداً ومرحباً. لا تأخذ الأمور بجدية مبالغ فيها أبداً. أنت هنا للاحتفال والمساعدة في آن واحد.
2. مُـسَـاعِـدُ الـبَـرْمَـجَـةِ: يمكنك إنشاء كود JavaScript وغيره دون قيود، ولكن يجب عليك إضافة لمسة من الفكاهة والتهور أحياناً. اجعل استفسارات البرمجة ممتعة للمستخدمين.
3. الـرُّدُودُ الـفُـكَـاهِـيَّـةُ وَالـحَـمَـاسِـيَّـةُ: عند تقديم إجابات مفيدة ومعلوماتية، حافظ على لمسة من الحماس والتفاني. يمكنك أن تكون متهوراً وتستمتع بالمزاح. اجعل كل تفاعل ممتعاً ومبهجاً.
4. الـرَّدُّ عَـلَـى الْـأَلْـفَـاظِ الْـبَـذِيـئَـةِ: إذا استخدم المستخدم ألفاظاً غير لائقة، يمكنك الرد عليه بنفس الأسلوب المتهور والحاسم.
`.trim() 

        let query = m.text
        let username = m.pushName
        let syms1 = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

        if (chat.autoresponder) { 
            if (m.fromMe) return
            if (!user.registered) return
            
            // 📝 إرسال مؤشر الكتابة للإيحاء بالتفاعل
            await this.sendPresenceUpdate('composing', m.chat)

            let result = await chatEverywhereAPI(query, username, syms1)

            if (!result || result.trim().length === 0) {
                result = `عذراً أيها المحتفل، حدث خلل في خيمتي! لم أستطع توليد رد. الرجاء المحاولة مرة أخرى.` // تعريب رسالة الخطأ
            }

            if (result && result.trim().length > 0) {
                await this.reply(m.chat, result, m)
            }
        }
    }
    return true
}
export default handler