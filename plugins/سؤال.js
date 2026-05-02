import fs from 'fs';
// نفترض أن هذا الملف موجود ويحتوي على kiraTengenConfig و addExpFromGame
import { kiraTengenConfig, addExpFromGame } from './theme.js'; 

const timeout = 60000;
const poin = 500;

// يجب أن يكون هذا الملف موجودًا في المسار ./src/game/acertijo2.json
const TEKA_TEKI_FILE = './src/game/acertijo2.json';

// ⭐⭐ الحل: توحيد وتجهيز التخزين العالمي قبل البدء ⭐⭐
if (!global.games) {
    global.games = {};
}
global.games.tekateki = global.games.tekateki || {}; 
// ⭐⭐⭐ نهاية التعديل للتهيئة ⭐⭐⭐


// معالج بدء اللعبة
const handler = async (m, {conn, usedPrefix}) => {
    const id = m.chat;

    // التحقق من وجود سؤال نشط (باستخدام التخزين الجديد)
    if (global.games.tekateki[id]) { 
        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⚠️ *يوجد سؤال نشط هنا!*`, global.games.tekateki[id][0]);
        throw false;
    }
    
    // جلب البيانات من الملف المحلي
    let tekateki;
    try {
        // التحقق من وجود الملف وتضمينه
        if (!fs.existsSync(TEKA_TEKI_FILE)) {
             await conn.reply(m.chat, '❌ عذراً، ملف الألغاز غير موجود', m);
             throw new Error('ملف الألغاز مفقود');
        }
        tekateki = JSON.parse(fs.readFileSync(TEKA_TEKI_FILE));
    } catch (e) {
        console.error("❌ فشل في قراءة ملف الألغاز:", e);
        await conn.reply(m.chat, '❌ عذراً، لم أتمكن من قراءة ملف الألغاز', m);
        throw e;
    }
    
    // التأكد من أن المصفوفة غير فارغة
    if (tekateki.length === 0) {
        await conn.reply(m.chat, '❌ عذراً، ملف الألغاز فارغ', m);
        throw 'ملف الألغاز فارغ';
    }

    const json = tekateki[Math.floor(Math.random() * tekateki.length)];
    
    // صياغة رسالة السؤال بتصميم مبسط
    const caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* الألغاز
💭 *السؤال:* ${json.question}
⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *للإجابة:* أرسل الإجابة مباشرة

🍁 *الشعار:* اختبر ذكاءك
`.trim();
    
    // إرسال السؤال وحفظ معرف الرسالة
    const sentMessage = await conn.reply(m.chat, caption, m);
    
    global.games.tekateki[id] = [
        sentMessage,
        json,
        poin,
        setTimeout(async () => {
            if (global.games.tekateki[id]) {
                await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n✅ *الإجابة:* ${json.response}`, global.games.tekateki[id][0]);
            }
            delete global.games.tekateki[id];
        }, timeout)
    ];
};

// معالج الإجابات
handler.before = async (m, {conn}) => {
    const id = m.chat;
    const userId = m.sender;
    
    if (!global.games.tekateki[id]) return false;

    if (!m.text || m.text.startsWith(m.prefix) || m.text.startsWith(conn.user.jid)) return false;

    const [message, game, rewardPoin, timeoutRef] = global.games.tekateki[id];
    
    const isQuoted = m.quoted && m.quoted.id === message.key.id;
    if (m.text.length > 50 && !isQuoted) return false;

    const userAnswer = m.text.toLowerCase().trim();
    const correctAnswer = game.response.toLowerCase().trim();

    // 1. معالجة الانسحاب
    if (userAnswer === 'انسحب') {
        clearTimeout(timeoutRef);
        try { await m.react('🚪'); } catch (e) { /* تجاهل */ }
        
        await m.reply(`*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n✅ *الإجابة الصحيحة:* ${game.response}`);
        delete global.games.tekateki[id];
        return true;
    }
    
    // 2. معالجة الإجابة الصحيحة
    if (userAnswer === correctAnswer) {
        clearTimeout(timeoutRef);

        try { await m.react('✅'); } catch (e) { /* تجاهل */ }

        const rewardResult = await addExpFromGame(userId, rewardPoin, 'لعبة الألغاز');
        
        let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n✅ *الإجابة:* ${game.response}\n💰 *الجائزة:* ${rewardPoin} نقطة`;

        if (rewardResult && rewardResult.success) {
            winText += `\n💎 *الرصيد الجديد:* ${rewardResult.newExp} نقطة`;
            if (rewardResult.level > 1) {
                winText += `\n⭐ *المستوى:* ${rewardResult.level}`;
            }
        }
        
        await m.reply(winText);
        delete global.games.tekateki[id];
        return true;
    } 
    
    // 3. معالجة الإجابة الخاطئة
    if (userAnswer.length > 0) {
        try { await m.react('❌'); } catch (e) { /* تجاهل */ }
        await m.reply(`*📜 تنغن كيرا 🍁*\n\n❌ *إجابة خاطئة!*\n💡 حاول مرة أخرى`);
        return true;
    }

    return true;
};

handler.help = ['سؤال']
handler.tags = ['game']
handler.command = /^(سؤال|acert|pregunta|adivinanza|tekateki)$/i
handler.group = true

export default handler;