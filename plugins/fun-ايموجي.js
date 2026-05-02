// File: لعبة-ميكو.js
import fs from 'fs';

let timeout = 60000; // وقت الإجابة
let poin = 500;    // نقاط الجائزة

// ملاحظة: تم افتراض أن ملف miku4.json يحتوي على أسئلة الألغاز
const tekateki = JSON.parse(fs.readFileSync('./src/game/miku4.json', 'utf-8'));

const handler = async (m, { conn, usedPrefix }) => {
    
    // نستخدم conn.tekateki للحفاظ على توافق الكود الأصلي
    conn.tekateki = conn.tekateki ? conn.tekateki : {};
    let id = m.chat;
    
    // 1. التحقق من وجود لعبة نشطة
    if (id in conn.tekateki) {
        // استخدام صيغة بوتك وتصحيح اسم البوت
        conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tekateki[id][0]);
        throw false;
    }
    
    // 2. اختيار لغز عشوائي
    let json = tekateki[Math.floor(Math.random() * tekateki.length)];
    let _clue = json.response;

    // 3. بناء التلميح (لتقليل ظهور الكلمة الكاملة)
    let hintText;
    if (_clue.length > 3) {
        hintText = ` (${_clue.length} حروف. تبدأ بـ ${_clue[0]})`;
    } else {
         hintText = ` (${_clue.length} حروف)`;
    }

    // 4. بناء رسالة اللغز بصيغة بوت تنغن
    let caption = `
ⷮ *لعبة ايموجي 🧩*

${json.question}


💡 *تلميح:* ${hintText}


❐↞┇الـوقـت⏳↞ ${(timeout / 1000).toFixed(2)} ثانية┇

❐↞┇الـجـائـزة💵↞ ${poin} نقطة┇


*『تـنـغـن﹝👑﹞بـوت』*
`.trim();
    
    // 5. إرسال اللغز وحفظ بيانات اللعبة
    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) await conn.reply(m.chat, `❮ ⌛┇انتهي الوقت┇⌛❯\n ❐↞┇الاجـابـة الصحيحة✅↞ *${json.response}*┇`, conn.tekateki[id][0]);
            delete conn.tekateki[id];
        }, timeout)
    ];
};

// 6. إعدادات الدالة
handler.help = ['ايموجي']; // يمكنك تسميته 'ميكو' إذا كان هذا هو الأمر الأصلي
handler.tags = ['ايموجي'];
handler.command = ['ايموجي']; 

export default handler;