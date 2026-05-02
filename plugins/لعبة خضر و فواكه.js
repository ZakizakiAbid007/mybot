import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let timeout = 60000;
let poin = 500;

if (!global.games) {
    global.games = {};
}

// ⭐⭐⭐ قائمة الخضار والفواكه ⭐⭐⭐
const fruitsVegGame = [
    // حرف الألف
    {"question": "ا", "response": "أناناس"},
    {"question": "ا", "response": "أفوكادو"},
    {"question": "ا", "response": "أسبارغوس"},
    {"question": "ا", "response": "أرضي شوكي"},

    // حرف الباء
    {"question": "ب", "response": "بطيخ"},
    {"question": "ب", "response": "برتقال"},
    {"question": "ب", "response": "بصل"},
    {"question": "ب", "response": "بازلاء"},
    {"question": "ب", "response": "بقدونس"},
    {"question": "ب", "response": "بامية"},
    {"question": "ب", "response": "بروكلي"},
    {"question": "ب", "response": "بطاطا"},
    {"question": "ب", "response": "باذنجان"},

    // حرف التاء
    {"question": "ت", "response": "تمر"},
    {"question": "ت", "response": "تفاح"},
    {"question": "ت", "response": "توت"},
    {"question": "ت", "response": "تين"},

    // حرف الثاء
    {"question": "ث", "response": "ثوم"},

    // حرف الجيم
    {"question": "ج", "response": "جزر"},
    {"question": "ج", "response": "جوز"},
    {"question": "ج", "response": "جريب فروت"},
    {"question": "ج", "response": "جرجير"},
    {"question": "ج", "response": "جوافة"},

    // حرف الحاء
    {"question": "ح", "response": "حمص"},

    // حرف الخاء
    {"question": "خ", "response": "خس"},
    {"question": "خ", "response": "خوخ"},
    {"question": "خ", "response": "خيار"},

    // حرف الدال
    {"question": "د", "response": "دراق"},
    {"question": "د", "response": "دخن"},

    // حرف الراء
    {"question": "ر", "response": "رمان"},
    {"question": "ر", "response": "ريحان"},
    {"question": "ر", "response": "رشاد"},

    // حرف الزاي
    {"question": "ز", "response": "زيتون"},
    {"question": "ز", "response": "زنجبيل"},
    {"question": "ز", "response": "زعتر"},

    // حرف السين
    {"question": "س", "response": "سفرجل"},
    {"question": "س", "response": "سبانخ"},
    {"question": "س", "response": "سمسم"},

    // حرف الشين
    {"question": "ش", "response": "شمندر"},
    {"question": "ش", "response": "شبت"},

    // حرف الصاد
    {"question": "ص", "response": "صبار"},
    {"question": "ص", "response": "صنوبر"},

    // حرف الطاء
    {"question": "ط", "response": "طماطم"},

    // حرف العين
    {"question": "ع", "response": "عنب"},
    {"question": "ع", "response": "عدس"},
    {"question": "ع", "response": "علندة"},

    // حرف الغين
    {"question": "غ", "response": "غوافة"},

    // حرف الفاء
    {"question": "ف", "response": "فلفل"},
    {"question": "ف", "response": "فراولة"},
    {"question": "ف", "response": "فجل"},
    {"question": "ف", "response": "فول"},
    {"question": "ف", "response": "فستق"},

    // حرف القاف
    {"question": "ق", "response": "قرع"},
    {"question": "ق", "response": "قلقاس"},
    {"question": "ق", "response": "قرنبيط"},

    // حرف الكاف
    {"question": "ك", "response": "كرز"},
    {"question": "ك", "response": "كمثرى"},
    {"question": "ك", "response": "كوسا"},
    {"question": "ك", "response": "كرفس"},
    {"question": "ك", "response": "كاجو"},
    {"question": "ك", "response": "كمون"},
    {"question": "ك", "response": "كركم"},

    // حرف اللام
    {"question": "ل", "response": "ليمون"},
    {"question": "ل", "response": "لوز"},
    {"question": "ل", "response": "لفت"},
    {"question": "ل", "response": "لوبيا"},

    // حرف الميم
    {"question": "م", "response": "موز"},
    {"question": "م", "response": "مانجو"},
    {"question": "م", "response": "ملوخية"},
    {"question": "م", "response": "مشمش"},

    // حرف النون
    {"question": "ن", "response": "نعناع"},
    {"question": "ن", "response": "نخيل"},
    {"question": "ن", "response": "نكتارين"},

    // حرف الهاء
    {"question": "ه", "response": "هليون"},

    // حرف الياء
    {"question": "ي", "response": "يقطين"}
];

// دالة لتطبيع النص للمقارنة
function normalizeArabic(text) {
    if (!text) return '';
    return text.trim()
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا') 
        .replace(/[\u0640-\u065F]/g, '')
        .replace(/ة/g, 'ه') 
        .replace(/\s/g, '_');
}

let handler = async (m, { conn, usedPrefix, text }) => {
    try {
        const chatId = m.chat;

        // التحقق إذا كانت اللعبة نشطة
        if (global.games.fruitsVeg && global.games.fruitsVeg[chatId]) {
            await conn.reply(m.chat, `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n⚠️ *يوجد جولة نشطة بالفعل!*\n🔤 *الحرف الحالي:* ${global.games.fruitsVeg[chatId].letter}`, m);
            return;
        }

        // اختيار حرف عشوائي
        const availableLetters = [...new Set(fruitsVegGame.map(item => item.question))];
        if (availableLetters.length === 0) {
            return conn.reply(m.chat, '*❌ لا توجد خضار أو فواكه في القائمة!*', m);
        }

        const selectedLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)].toUpperCase();

        // الحصول على الإجابات المحتملة لهذا الحرف
        const possibleAnswers = fruitsVegGame
            .filter(item => item.question === selectedLetter.toLowerCase())
            .map(item => item.response);

        if (possibleAnswers.length === 0) {
            return conn.reply(m.chat, `*❌ لا توجد خضار أو فواكه تبدأ بحرف (${selectedLetter})!*`, m);
        }

        let caption = `
*🍉🥕 لعبة الخضار والفواكه 🍉🥕*

🔤 *الحرف المطلوب:* ${selectedLetter}
🎯 *المطلوب:* اكتب اسم أي خضار أو فاكهة تبدأ بحرف **${selectedLetter}**

⏰ *الوقت:* ${(timeout / 1000)} ثانية
💰 *الجائزة:* ${poin} نقطة
🔄 *المحاولات:* 3 محاولات

🚪 *للانسحاب:* اكتب "انسحب"

*💡 اكتب الإجابة مباشرة في الشات...*
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

        // تحضير قائمة الإجابات المحتملة (مطبقة)
        const normalizedPossibleAnswers = possibleAnswers.map(ans => normalizeArabic(ans));

        // حفظ حالة اللعبة
        global.games.fruitsVeg = global.games.fruitsVeg || {};
        global.games.fruitsVeg[chatId] = {
            letter: selectedLetter,
            possibleAnswers: normalizedPossibleAnswers,
            allPossibleAnswers: possibleAnswers,
            startTime: Date.now(),
            attempts: 3,
            timeout: setTimeout(async () => {
                if (global.games.fruitsVeg && global.games.fruitsVeg[chatId]) {
                    await conn.reply(m.chat, 
                        `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n⏰ *انتهى الوقت!*\n🔤 *الحرف:* ${selectedLetter}\n✅ *الإجابات الصحيحة:* ${possibleAnswers.join(', ')}`, 
                        m
                    );
                    delete global.games.fruitsVeg[chatId];
                }
            }, timeout)
        };

    } catch (error) {
        console.error('❌ خطأ في لعبة الخضار والفواكه:', error);
        await conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text) return false;

        const chatId = m.chat;
        const game = global.games.fruitsVeg ? global.games.fruitsVeg[chatId] : null;

        if (!game) return false;

        let userAnswer = m.text.trim();

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);

            try { await m.react('🚪'); } catch (e) {}

            await conn.reply(m.chat, 
                `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n🚪 *تم الانسحاب!*\n🔤 *الحرف:* ${game.letter}\n✅ *الإجابات الصحيحة:* ${game.allPossibleAnswers.join(', ')}`, 
                m
            );
            delete global.games.fruitsVeg[chatId];
            return true;
        }

        // تطبيع إجابة المستخدم
        const normalizedUserAnswer = normalizeArabic(userAnswer);

        // التحقق من الحرف الأول
        const firstCharOfAnswer = normalizeArabic(userAnswer.charAt(0));
        const normalizedRequiredLetter = normalizeArabic(game.letter);

        if (firstCharOfAnswer !== normalizedRequiredLetter) {
            game.attempts--;

            if (game.attempts > 0) {
                await conn.reply(m.chat, 
                    `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n❌ *يجب أن تبدأ الإجابة بحرف (${game.letter})!*\n🔄 *المحاولات المتبقية:* ${game.attempts}`, 
                    m
                );
            } else {
                await conn.reply(m.chat, 
                    `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n💔 *انتهت محاولاتك!*\n🔤 *الحرف:* ${game.letter}\n✅ *الإجابات الصحيحة:* ${game.allPossibleAnswers.join(', ')}`, 
                    m
                );
                clearTimeout(game.timeout);
                delete global.games.fruitsVeg[chatId];
            }
            return true;
        }

        // التحقق من صحة الإجابة
        if (game.possibleAnswers.includes(normalizedUserAnswer)) {
            clearTimeout(game.timeout);

            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);

            try { await m.react('✅'); } catch (e) {}

            let winText = `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n✅ *الإجابة:* ${userAnswer}\n🔤 *الحرف:* ${game.letter}\n💰 *الجائزة:* ${poin} نقطة\n⏱️ *الوقت:* ${timeTaken} ثانية`;

            // منح الجائزة
            if (global.db && global.db.data && global.db.data.users) {
                global.db.data.users[m.sender].exp += poin;
            }

            await conn.reply(m.chat, winText, m);
            delete global.games.fruitsVeg[chatId];
            return true;
        }

        // إجابة خاطئة
        game.attempts--;

        if (game.attempts > 0) {
            await conn.reply(m.chat, 
                `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n❌ *إجابة خاطئة!*\n🔄 *المحاولات المتبقية:* ${game.attempts}\n💡 *جرب اسم آخر يبدأ بحرف ${game.letter}*`, 
                m
            );
        } else {
            await conn.reply(m.chat, 
                `*🍉🥕 لعبة الخضار والفواكه 🍉🥕*\n\n💔 *انتهت محاولاتك!*\n🔤 *الحرف:* ${game.letter}\n✅ *الإجابات الصحيحة:* ${game.allPossibleAnswers.join(', ')}`, 
                m
            );
            clearTimeout(game.timeout);
            delete global.games.fruitsVeg[chatId];
        }

        return true;

    } catch (error) {
        console.error('❌ خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['خضار']
handler.tags = ['game']
handler.command = /^(خضار|فواكه|حرف)$/i
handler.group = true

export default handler;