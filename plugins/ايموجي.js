import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let timeout = 60000;
let poin = 1000;

if (!global.games) {
    global.games = {};
}

// ⭐⭐⭐ الأسئلة مدمجة مباشرة في الكود ⭐⭐⭐
const emojiQuestions = [
    {
        "question": "👊🏻👨🏻‍🦲🦸🏻‍♂️",
        "response": "سايتما"
    },
    {
        "question": "🍎✍🏻📓",
        "response": "لايت"
    },
    {
        "question": "🫎🧑🏻‍⚕️❄️",
        "response": "تشوبر"
    },
    {
        "question": "🔥👱🏻‍♂️❄️",
        "response": "تودوروكي"
    },
    {
        "question": "🧑‍🍳🦵🏻🚬",
        "response": "سانجي"
    },
    // ... (بقية الأسئلة)


        "question": "👊🏻👨🏻‍🦲🦸🏻‍♂️",
        "response": "سايتما"
    },
    {
        "question": "🍎✍🏻📓",
        "response": "لايت"
    },
    {
        "question": "🫎🧑🏻‍⚕️❄️",
        "response": "تشوبر"
    },
    {
        "question": "🔥👱🏻‍♂️❄️",
        "response": "تودوروكي"
    },
    {
        "question": "🧑‍🍳🦵🏻🚬",
        "response": "سانجي"
    },
    {
        "question": "🐗⚔️👦🏻",
        "response": "اينوسكي"
    },
    {
        "question": "💀🎸👑",
        "response": "بروك"
    },
    {
        "question": "🔥🧑🏻‍🚒🚒",
        "response": "شينزا"
    },
    {
        "question": "💇🏻‍♀️🌸🙍🏻‍♀️",
        "response": "ساكورا"
    },
    {
        "question": "👨🏻‍🦰🏜️🏺",
        "response": "غارا"
    },
    {
        "question": "🦊🍜🍥",
        "response": "ناروتو"
    },
    {
        "question": "🍀📖👿",
        "response": "استا"
    },
    {
        "question": "☀️🗡️😮‍💨",
        "response": "يوريتشي"
    },
    {
        "question": "🐍😛🔬",
        "response": "اوروتشيماو"
    },
    {
        "question": "⚫⚪☁️",
        "response": "زيتسو"
    },
    {
        "question": "🤡🃏👦🏻",
        "response": "هيسوكا"
    },
    {
        "question": "🧑🏻🔙🧑",
        "response": "تاكيميتشي"
    },
    {
        "question": "👒🍖🏴‍☠",
        "response": "لوفي"
    },
    {
        "question": "🥪👦🏻👊🏻",
        "response": "ماش"
    },
    {
        "question": "🧛🏻‍♂️☀️👿",
        "response": "موزان"
    },
    {
        "question": "⛓️👀🧑",
        "response": "كورابيكا"
    },
    {
        "question": "🏴‍☠️⚓︎🤥",
        "response": "يوسوب"
    },
    {
        "question": "⚔️🌊🧑🏻",
        "response": "غيو"
    },
    {
        "question": "⚔️🔥🧑",
        "response": "رينغوكو"
    },
    {
        "question": "⚔️💨🧑🏻",
        "response": "سانيمي"
    },
    {
        "question": "⚔️🧑🏻☁️",
        "response": "توكيتو"
    },
    {
        "question": "⚔️👩🏻🦋",
        "response": "شينوبو"
    },
    {
        "question": "⚔️👩🏻🩷",
        "response": "ميتسوري"
    },
    {
        "question": "🧑🏻🪨⚔️",
        "response": "جيومي"
    },
    {
        "question": "⚔️🧑🏻🎇🎆",
        "response": "تينغن"
    },
    {
        "question": "🧑🎩🔥",
        "response": "سابو"
    },
    {
        "question": "🐜👑💪🏻",
        "response": "ميريوم"
    },
    {
        "question": "😈🏺",
        "response": "جيوكو"
    },
    {
        "question": "🎭👩🏻👁️",
        "response": "الوكا"
    },
    {
        "question": "😈🎻👩🏻",
        "response": "ناكيمي"
    },
    {
        "question": "😎🥶❄️👁️",
        "response": "غوجو"
    },
    {
        "question": "😊👩🏻💰",
        "response": "نامي"
    },
    {
        "question": "💰☠️👑🏴‍☠️",
        "response": "روجر"
    },
    {
        "question": "👦🏻🛹⚡",
        "response": "كيلوا"
    },
    {
        "question": "🌙🦑🧑🏻‍🏫",
        "response": "كورو"
    },
    {
        "question": "🐸🍻🔞",
        "response": "جيرايا"
    },
    {
        "question": "🎤🦑⚔️",
        "response": "كيلر بي"
    },
    {
        "question": "🕵🏻‍♂️💊🛹",
        "response": "كونان"
    },
    {
        "question": "👁️🗨️👦🏻🔴",
        "response": "ساسكي"
    },
    {
        "question": "👨🏻‍🦳⚔️👁️",
        "response": "مادارا"
    },
    {
        "question": "🎭👨🏻🦊",
        "response": "ايتاتشي"
    },
    {
        "question": "👨🏻‍🦲👁️⚫",
        "response": "كاكاشي"
    },
    {
        "question": "👩🏻💜👁️",
        "response": "هيناتا"
    },
    {
        "question": "👦🏻🔵🍃",
        "response": "غون"
    },
    {
        "question": "👨🏻💥🧨",
        "response": "باكوغو"
    },
    {
        "question": "👦🏻🟢💪🏻",
        "response": "ميدوريا"
    },
    {
        "question": "👨🏻⚡🔵",
        "response": "كيلوا"
    },
    {
        "question": "👨🏻🎩🎲",
        "response": "هيسوكا"
    },
    {
        "question": "👦🏻🧡👊🏻",
        "response": "ايتشيغو"
    },
    {
        "question": "👨🏻👒⚔️",
        "response": "زورو"
    },
    {
        "question": "👨🏻🍖👑",
        "response": "لوفي"
    },
    {
        "question": "👨🏻‍🍳🚬🦵🏻",
        "response": "سانجي"
    },
    {
        "question": "👩🏻🍊🧭",
        "response": "نامي"
    },
    {
        "question": "💀🎸🎶",
        "response": "بروك"
    },
    {
        "question": "👩🏻🌹📚",
        "response": "روبن"
    },
    {
        "question": "🤖🔩💪🏻",
        "response": "فرانكي"
    },
    {
        "question": "🦌👨🏻‍⚕️❄️",
        "response": "تشوبر"
    },
    {
        "question": "👑🐉🔥",
        "response": "اكاينو"
    },
    {
        "question": "👩🏻🐍🔪",
        "response": "بوا هانكوك"
    },
    {
        "question": "👨🏻⚓️👑",
        "response": "وايت بيرد"
    },
    {
        "question": "👨🏻🌪️👁️",
        "response": "دراغون"
    },
    {
        "question": "👦🏻🔴👊🏻",
        "response": "ناروتو"
    },
    {
        "question": "👨🏻🔵❄️",
        "response": "هاكو"
    },
    {
        "question": "👩🏻🌸💊",
        "response": "تسونادي"
    },
    {
        "question": "👨🏻🟡⚡",
        "response": "ميناتو"
    },
    {
        "question": "👩🏻🔴💃",
        "response": "ميراي"
    },
    {
        "question": "👨🏻🟣🌙",
        "response": "ايتاتشي"
    },
    {
        "question": "👦🏻🟢🐉",
        "response": "غوكو"
    },
    {
        "question": "👨🏻🔵👑",
        "response": "فيجيتا"
    },
    {
        "question": "👨🏻🟡🍚",
        "response": "غوهان"
    },
    {
        "question": "👨🏻🟣💀",
        "response": "بيكولو"
    },
    {
        "question": "👩🏻🔵👽",
        "response": "بولما"
    },
    {
        "question": "👨🏻🟠🐱",
        "response": "كيرو"
    },
    {
        "question": "👦🏻⚫👁️",
        "response": "ساسكي"
    },
    {
        "question": "👩🏻🟡💫",
        "response": "هيناتا"
    },
    {
        "question": "👨🏻🟢🍃",
        "response": "ياماتو"
    },
    {
        "question": "👩🏻🔴🎭",
        "response": "كونان"
    },
    {
        "question": "👨🏻🟣🗡️",
        "response": "اينوسكي"
    },
    {
        "question": "👩🏻🟢🐍",
        "response": "ميتسوري"
    },
    {
        "question": "👨🏻🔵💧",
        "response": "غيو"
    },
    {
        "question": "👩🏻🟣🦋",
        "response": "شينوبو"
    },
    {
        "question": "👨🏻🟡🔥",
        "response": "رينغوكو"
    },
    {
        "question": "👩🏻🟠💨",
        "response": "سانيمي"
    },
    {
        "question": "👨🏻⚪☁️",
        "response": "توكيتو"
    },
    {
        "question": "👨🏻🟤🪨",
        "response": "جيومي"
    },
    {
        "question": "👨🏻🎇🎆",
        "response": "تينغن"
    },
    {
        "question": "👩🏻👁️🎭",
        "response": "الوكا"
    },
    {
        "question": "👨🏻🥶❄️",
        "response": "غوجو"
    },
    {
        "question": "👩🏻💰🧭",
        "response": "نامي"
    },
    {
        "question": "👑💀🏴‍☠️",
        "response": "روجر"
    },
    {
        "question": "👨🏻🛹⚡",
        "response": "كيلوا"
    },
    {
        "question": "👨🏻‍🏫🦑🌙",
        "response": "كورو"
    },
    {
        "question": "👨🏻🍻🐸",
        "response": "جيرايا"
    },
    {
        "question": "👨🏻🎤🦑",
        "response": "كيلر بي"
    },
    {
        "question": "👦🏻💊🕵️",
        "response": "كونان"
    },
    {
        "question": "👨🏻👊🏻🦲",
        "response": "سايتما"
    },
    {
        "question": "👦🏻📓🍎",
        "response": "لايت"
    },
    {
        "question": "👨🏻❄️🫎",
        "response": "تشوبر"
    },
    {
        "question": "👱🏻‍♂️❄️🔥",
        "response": "تودوروكي"
    }
];

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        // التحقق إذا كانت اللعبة نشطة
        if (global.games.emoji && global.games.emoji[chatId]) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⚠️ *يوجد سؤال نشط هنا!*`, m);
            return;
        }

        // اختيار سؤال عشوائي
        let json = emojiQuestions[Math.floor(Math.random() * emojiQuestions.length)];

        let caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* تخمين الإيموجي
🎭 *الإيموجيات:* ${json.question}

⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *المطلوب:* ما اسم الشخصية؟

🍁 *الشعار:* فك الشفرة
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

        // حفظ حالة اللعبة
        global.games.emoji = global.games.emoji || {};
        global.games.emoji[chatId] = {
            answer: json.response.toLowerCase(),
            correctAnswer: json.response,
            emojis: json.question,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.games.emoji && global.games.emoji[chatId]) {
                    await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n🎭 *الإيموجيات:* ${json.question}\n✅ *الإجابة:* ${json.response}`, m);
                    delete global.games.emoji[chatId];
                }
            }, timeout),
            attempts: 0,
            hintsGiven: []
        };

    } catch (error) {
        console.error('❌ خطأ في لعبة ايموجي:', error);
        await conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text) return false;
        
        const chatId = m.chat;
        const userId = m.sender;
        const game = global.games.emoji ? global.games.emoji[chatId] : null;
        
        if (!game) return false;

        let userAnswer = m.text.toLowerCase().trim();

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            try { await m.react('🚪'); } catch (e) {}
            
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n🎭 *الإيموجيات:* ${game.emojis}\n✅ *الإجابة:* ${game.correctAnswer}`, m);
            delete global.games.emoji[chatId];
            return true;
        }

        // التحقق من الإجابة الصحيحة
        if (userAnswer === game.answer) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            try { await m.react('✅'); } catch (e) {}
            
            let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n🎭 *الإيموجيات:* ${game.emojis}\n✅ *الإجابة:* ${game.correctAnswer}\n💰 *الجائزة:* ${poin} نقطة\n⏱️ *الوقت:* ${timeTaken} ثانية`;
            
            await conn.reply(m.chat, winText, m);
            delete global.games.emoji[chatId];
            return true;
        }

        // إجابة خاطئة
        game.attempts++;
        
        let hintMessage = `❌ *إجابة خاطئة!*\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts >= 2 && !game.hintsGiven.includes('firstLetter')) {
            const firstLetter = game.correctAnswer.charAt(0);
            extraHint = `\n💡 *الحرف الأول:* ${firstLetter}`;
            game.hintsGiven.push('firstLetter');
        } else if (game.attempts >= 4 && !game.hintsGiven.includes('length')) {
            const length = game.correctAnswer.length;
            extraHint = `\n💡 *عدد الأحرف:* ${length}`;
            game.hintsGiven.push('length');
        }

        try { await m.react('❌'); } catch (e) {}

        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n${hintMessage}${extraHint}\n🎭 *الإيموجيات:* ${game.emojis}\n📊 *المحاولة:* ${game.attempts}`, m);

        return true;

    } catch (error) {
        console.error('❌ خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['ايموجي']
handler.tags = ['game']
handler.command = /^(ايموجي|emoji)$/i
handler.group = true

export default handler;{
