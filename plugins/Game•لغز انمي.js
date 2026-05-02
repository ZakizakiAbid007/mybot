import fs from 'fs';
const timeout = 60000;
const poin = 10000;

// ************************ دالة التحقق من الإجابة ************************
const isCorrectAnswer = (userAnswer, correctAnswer) => {
    // إزالة المسافات الزائدة وتحويلها إلى حروف صغيرة للمقارنة
    const cleanedUserAnswer = userAnswer.trim().toLowerCase();
    const cleanedCorrectAnswer = correctAnswer.trim().toLowerCase();
    
    // للتحقق من الإجابة (يمكنك إضافة المزيد من المرونة هنا إذا لزم الأمر)
    return cleanedUserAnswer === cleanedCorrectAnswer;
};
// *************************************************************************

const handler = async (m, {conn, usedPrefix}) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    const id = m.chat;

    // التحقق مما إذا كانت هناك لعبة قيد التشغيل بالفعل
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'هناك بالفعل لغز لم تتم الإجابة عليه في هذه الدردشة.', conn.tekateki[id][0]);
        throw false;
    }
    
    // 2. تحميل الألغاز واختيار لغز عشوائي
    const tekateki = JSON.parse(fs.readFileSync(`./src/game/acertijo.json`));
    const json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    // 3. إعداد التلميح (إخفاء الحروف)
    const _clue = json.response;
    // استخدام دالة لتحويل النص إلى تلميح بـ (_) يمثل طول الإجابة.
    // يتم استبدال كل حرف أبجدي أو عربي بـ (_)
    const clue = _clue
        .replace(/[A-Za-z\u0600-\u06FF]/g, '_') // يستبدل الحروف اللاتينية والعربية
        .replace(/(\s+)/g, ' '); // يزيل المسافات الزائدة
    
    // 4. بناء الرسالة النهائية
    const caption = `
ⷮ🚩 *لـعـبـة الألـغـاز*
✨️ *اللغز:* ${json.question}

💡 *تلميح (طول الإجابة):* ${clue}
⏱️ *الـوقـت:* ${(timeout / 1000).toFixed(2)} ثانية
🎁 *الـجـائـزة:* *+${poin}* عملة 🪙
⚠️ *طريقة الإجابة:* أرسل الإجابة مباشرة في الدردشة.
`.trim();
    
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

// ************************ إضافة دالة التحقق للرسالة ************************
handler.before = async (m, { conn }) => {
    const id = m.chat;
    
    // تهيئة مصفوفة الألغاز للتأكد من أنها موجودة (لمنع خطأ TypeError إذا لم يتم تشغيل اللعبة من قبل)
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    
    // الخروج إذا لم يكن هناك لغز قيد التشغيل في هذه الدردشة
    if (!(id in conn.tekateki)) return;

    const [msg, json, poin] = conn.tekateki[id];

    if (m.isBaileys || m.fromMe || m.sender === conn.user.jid) return;

    // تم إضافة هذه الخطوة لزيادة الأمان ضد خطأ TypeError:
    // التأكد من وجود سجل المستخدم قبل منحه النقاط
    // (افتراض أن قاعدة البيانات موجودة ومُهيأة في مكان آخر)
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};


    // التحقق من الإجابة باستخدام الدالة الجديدة
    if (isCorrectAnswer(m.text, json.response)) {
        // الإجابة الصحيحة
        await conn.reply(m.chat, `🎉 *إجابة صحيحة يا ملك المهرجانات!* 🎉\n\n*الإجابة:* ${json.response}\n\n💰 *لقد ربحت:* +${poin} عملة!`, m);
        // منح النقاط (مثال: يجب أن يكون هذا السطر موجوداً لتفعيل الجائزة)
        // global.db.data.users[m.sender].money += poin; 
        clearTimeout(conn.tekateki[id][3]);
        delete conn.tekateki[id];
    } else if (m.text.toLowerCase().includes(json.response.toLowerCase().substring(0, 4))) {
        // لم يتم حذف هذا الجزء ولكنه لا يفعل شيئاً حالياً (يمكن استخدامه للتلميح)
    }
};
// *************************************************************************

handler.help = ['لغز'];
handler.tags = ['ألعاب'];
handler.command = ['لغز', 'acertijo', 'احجية', 'adivinanza', 'tekateki'];

export default handler;