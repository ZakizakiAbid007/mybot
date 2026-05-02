import fs from 'fs';
const timeout = 60000;
const poin = 10000;

const handler = async (m, {conn, usedPrefix}) => {
    // 1. تهيئة اللعبة في الذاكرة المؤقتة (Cache)
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    const id = m.chat;

    // التحقق مما إذا كانت هناك لعبة قيد التشغيل بالفعل
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'هناك بالفعل لغز لم تتم الإجابة عليه في هذه الدردشة.', conn.tekateki[id][0]);
        throw false;
    }
    
    // 2. تحميل الألغاز واختيار لغز عشوائي
    // يجب التأكد من وجود ملف acertijo.json في المسار ./src/game/
    const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
    const json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    // 3. إعداد التلميح (إخفاء الحروف)
    const _clue = json.response;
    // يتم استبدال كل حرف أبجدي بـ (_) لإظهار طول الكلمة كدليل
    const clue = _clue.replace(/[A-Za-z]/g, '_'); 
    
    // 4. بناء الرسالة النهائية
    const caption = `
ⷮ🚩 *لـعـبـة الألـغـاز*
✨️ *اللغز:* ${json.question}

💡 *تلميح:* ${clue}
⏱️ *الـوقـت:* ${(timeout / 1000).toFixed(2)} ثانية
🎁 *الـجـائـزة:* *+${poin}* عملة 🪙`.trim();
    
    // 5. حفظ اللغز في الذاكرة وبدء المؤقت
    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m), 
        json,
        poin,
        // وظيفة المؤقت (Timeout Function)
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `🚩 انتهى الوقت!\n*الإجابة هي:* ${json.response}`, conn.tekateki[id][0]);
            }
            delete conn.tekateki[id];
        }, timeout)
    ];
};

handler.help = ['لغز'];
handler.tags = ['ألعاب'];
handler.command = ['لغز', 'acertijo', 'احجية', 'adivinanza', 'tekateki'];

export default handler;

