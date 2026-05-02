// File: ترتيب.js (لعبة ترتيب الحروف - تنغن بوت)

import fs from 'fs';

let timeout = 60000; // 60 ثانية
let poin = 500;    // الجائزة بالنقاط (EXP)

let handler = async (m, { conn, usedPrefix }) => {
    // نستخدم tekateki لتخزين حالة اللعبة (تجنباً للتعارض)
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;

    // 1. التحقق من وجود لعبة نشطة
    if (id in conn.tekateki) {
        conn.reply(m.chat, '*❌ هناك لعبة ترتيب نشطة بالفعل!\n💡 للإجابة أو للخروج، أرسل *استسلم*.', conn.tekateki[id][0]);
        throw false;
    }

    // 2. قراءة الأسئلة (يجب التأكد من وجود ملف miku3.json)
    let tekateki;
    try {
        tekateki = JSON.parse(fs.readFileSync('./src/game/miku3.json'));
    } catch (e) {
        console.error(e);
        // 💥 الالتزام الصارم: إيموجي رياكت فقط! 💥
        await conn.sendMessage(m.chat, { react: { text: '💥', key: m.key } });
        conn.reply(m.chat, '⚠️ تعذر العثور على ملف الأسئلة miku3.json أو حدث خطأ في القراءة.', m);
        throw false;
    }

    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    // 3. صياغة السؤال
    // json.question هنا هو الكلمة المخربطة (المطلوب ترتيبها)
    let caption = `
╭━━〔 🔄 *رتـب الـحـروف* 🧩 〕━━⬣
┃
*❓ الـكـلـمـة المـبـعـثـرة:*
┃ ‣ *${json.question.toUpperCase()}*
┃
*⏰ الـوقـت:* ${(timeout / 1000).toFixed(0)} ثانية
*💰 الـجـائـزة:* ${poin} نقطة (EXP)
┃
╰━━━━━━━━━━━━━━━━━━━━━━⬣

📢 *ملاحظة:* أرسل الإجابة الصحيحة مباشرة.
    `.trim();

    // 4. إرسال السؤال وحفظ بيانات اللعبة
    let msg = await conn.reply(m.chat, caption, m);
    conn.tekateki[id] = [
        msg, // الرسالة لحذفها أو الرد عليها
        json, 
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `❮ ⌛┇ *انتهى الوقت* ┇⌛❯\n\n✅ *الإجابة الصحيحة كانت:* *${json.response}*\n\n💡 اكتب *.ترتيب* للعب مرة أخرى.`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout),
        [] // 4: wrongGuesses (لإضافة قائمة الإجابات الخاطئة)
    ];
};

// ----------------------------------------------------
// 🧠 منطق معالجة الإجابات (Handler.before)
// ----------------------------------------------------
handler.before = async (m, { conn }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat;

    if (!(id in conn.tekateki)) return;
    
    const gameData = conn.tekateki[id];
    const json = gameData[1];
    const poin = gameData[2];
    const timeoutFn = gameData[3];
    const wrongGuesses = gameData[4];

    const userAnswer = m.text.toLowerCase().trim();
    const correctAnswer = json.response.toLowerCase().trim();

    // 1. معالجة أمر الاستسلام
    if (userAnswer === 'استسلم' || userAnswer === 'استسلام') {
        clearTimeout(timeoutFn);
        conn.reply(m.chat, `━𑇍⸢🍁⸥𑇍━ *استسلمت!* ━𑇍⸢🍁⸥𑇍━\n\n🎯 الإجابة الصحيحة كانت: *${json.response.toUpperCase()}*\n\n💡 اكتب *.ترتيب* للعب مجدداً.`, m);
        delete conn.tekateki[id];
        return true;
    }

    // 2. منع تكرار الإجابات الخاطئة (يتم قبل مقارنة الإجابة لضمان التبسيط)
    if (wrongGuesses.includes(userAnswer)) {
        // إذا كرر المستخدم الإجابة الخاطئة، لا نرسل رياكت
        return false;
    }

    // 3. مقارنة الإجابة
    if (userAnswer === correctAnswer) {
        // ✅ إجابة صحيحة
        clearTimeout(timeoutFn);
        
        let user = global.db.data.users[m.sender];
        
        // تحديث النقاط
        if (user) user.exp = (user.exp || 0) + poin;

        conn.reply(m.chat, `
🎉 *إجابة صحيحة! يا بطل* 🎉

*✅ الكلمة الصحيحة:* *${json.response}*
*💰 ربحت:* *+${poin}* نقطة (EXP)
*💵 رصيدك:* *${(user.exp || 0).toLocaleString('ar-EG')}* EXP
        
🎮 اكتب *.ترتيب* للعب مرة أخرى.
        `.trim(), m);

        delete conn.tekateki[id];
        return true;
    } else {
        // ❌ إجابة خاطئة
        
        // تسجيل الإجابة الخاطئة لتجنب التكرار في المستقبل
        wrongGuesses.push(userAnswer);
        
        // إرسال رد فعل بالإيموجي فقط
        try {
            await conn.sendMessage(m.chat, {
                react: {
                    text: '❌',
                    key: m.key
                }
            });
        } catch (e) {
            console.error('فشل في إرسال رد الفعل ❌:', e);
        }
    }
    return false;
};

handler.help = ['ترتيب']
handler.tags = ['ألعاب']
handler.command = ['ترتيب']

export default handler;