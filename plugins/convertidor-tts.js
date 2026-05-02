import gtts from 'node-gtts';
import {readFileSync, unlinkSync} from 'fs';
import {join} from 'path';

// تم إجبار اللغة على العربية فقط كما طلبت
const forcedLang = 'ar'; 

const handler = async (m, {conn, args, usedPrefix, command}) => {
    // الآن يتم اعتبار جميع المدخلات نصًا
    let text = args.join(' '); 
    if (!text && m.quoted?.text) text = m.quoted.text;

    if (!text) {
        // رسالة خطأ باللغة العربية
        throw `🎙️ *أَرْسِلْ نَصًّا لِأَتَكَلَّمَ بِهِ!* *مثال:* ${usedPrefix + command} تنغن ملك المهرجانات`;
    }

    let res;
    try {
        // استخدام اللغة العربية المجبرة
        res = await tts(text, forcedLang);
    } catch (e) {
        console.error(e);
        m.reply(`⚠️ *عذراً أيها الملك*، حدث خطأ في تحويل النص إلى كلام باللغة العربية. قد يكون النص طويلاً جداً أو يحتوي على رموز غير مدعومة.`);
        return;
    } finally {
        if (res) conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
    }
};

handler.help = ['قل <نص>'];
handler.tags = ['تحويل'];
handler.group = true;
handler.register = true
handler.command = ['قل']; // تم تغيير الأمر إلى 'قل' فقط

export default handler;

function tts(text, lang = 'ar') {
    console.log(lang, text);
    return new Promise((resolve, reject) => {
        try {
            const tts = gtts(lang);
            const filePath = join(global.__dirname(import.meta.url), '../tmp', (1 * new Date) + '.wav');
            tts.save(filePath, text, () => {
                resolve(readFileSync(filePath));
                unlinkSync(filePath);
            });
        } catch (e) {
            reject(e);
        }
    });
}