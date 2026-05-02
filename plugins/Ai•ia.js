import fetch from 'node-fetch';
import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({organization: global.openai_org_id, apiKey: global.openai_key});
const openaiii = new OpenAIApi(configuration);

const handler = async (m, {conn, text, usedPrefix, command}) => {
    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    
    if (!text) throw `🧠 *أمر الذكاء الاصطناعي*\n\n❖ *الاستخدام:*\nاكتب سؤالك أو طلبك لاستخدام الذكاء الاصطناعي\n\n❖ *أمثلة على الأسئلة والأوامر:*\n▸ ${usedPrefix + command} ما هي أفضل 10 أفلام أكشن؟\n▸ ${usedPrefix + command} اكتب كود جافاسكريبت لعبة بطاقات\n▸ ${usedPrefix + command} اشرح لي نظرية النسبية\n▸ ${usedPrefix + command} كيف أتعلم البرمجة؟`

    if (command == 'ia' || command == 'chatgpt' || command == 'ai') {
        try {     
            await conn.sendPresenceUpdate('composing', m.chat)

            async function luminsesi(q, username, logic) {
                try {
                    const response = await axios.post("https://luminai.my.id", {
                        content: q,
                        user: username,
                        prompt: logic,
                        webSearchMode: true // true = نتيجة مع روابط
                    });
                    return response.data.result;
                } catch (error) {
                    console.error('خطأ في الحصول على الإجابة:', error);
                }
            }

            let query = m.text;
            let username = `${m.pushName}`;

            let syms1 = `أنت بوت واتساب تم إنشاؤه بواسطة Alba070503، أنت ShizukaBot-MD 🍁`;  

            let result = await luminsesi(query, username, syms1);
            await m.reply(result)
            
        } catch {
            try {
                let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/gptweb?text=${text}`) 
                let res = await gpt.json()
                await m.reply(res.gpt)
                
            } catch {
                await m.reply('❌ *عذراً*\n\nلم أتمكن من الاتصال بخدمة الذكاء الاصطناعي حالياً\nيرجى المحاولة مرة أخرى لاحقاً')
            }
        }
    }

    if (command == 'openai' || command == 'ia2' || command == 'chatgpt2') {
        conn.sendPresenceUpdate('composing', m.chat);
        
        try {
            let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/gptweb?text=${text}`) 
            let res = await gpt.json()
            await m.reply(res.gpt)
            
        } catch (error) {
            await m.reply('❌ *خطأ في الاتصال*\n\nخدمة OpenAI غير متاحة حالياً\nجرب استخدام الأمر `.ia` بدلاً من ذلك')
        }
    }
}

handler.command = /^(openai|chatgpt|ia|ai|بوت|chatgpt2|ia2)$/i;
handler.help = [
    'ai <سؤال>',
    'chatgpt <سؤال>', 
    'ia <سؤال>',
    'openai <سؤال>'
]
handler.tags = ['ai', 'ذكاء']
handler.group = true

export default handler;