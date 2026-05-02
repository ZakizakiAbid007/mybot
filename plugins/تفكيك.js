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
const tekateki = [
    {
        "question": "ناروتو",
        "response": "ن ا ر و ت و"
    },
    {
        "question": "ساسكي",
        "response": "س ا س ك ي"
    },
    {
           "question": "ناروتو",
        "response": "ن ا ر و ت و"
    },
    {
        "question": "ساسكي",
        "response": "س ا س ك ي"
    },
    {
        "question": "لوفي",
        "response": "ل و ف ي"
    },
    {
        "question": "زورو",
        "response": "ز و ر و"
    },
    {
        "question": "سانجي",
        "response": "س ا ن ج ي"
    },
    {
        "question": "غوكو",
        "response": "غ و ك و"
    },
    {
        "question": "فيجيتا",
        "response": "ف ي ج ي ت ا"
    },
    {
        "question": "ايرين",
        "response": "ا ي ر ي ن"
    },
    {
        "question": "ليفاي",
        "response": "ل ي ف ا ي"
    },
    {
        "question": "ميكاسا",
        "response": "م ي ك ا س ا"
    },
    {
        "question": "ايتاتشي",
        "response": "ا ي ت ا ت ش ي"
    },
    {
        "question": "مادارا",
        "response": "م ا د ا ر ا"
    },
    {
        "question": "كاكاشي",
        "response": "ك ا ك ا ش ي"
    },
    {
        "question": "هيناتا",
        "response": "ه ي ن ا ت ا"
    },
    {
        "question": "ساكرا",
        "response": "س ا ك ر ا"
    },
    {
        "question": "غارا",
        "response": "غ ا ر ا"
    },
    {
        "question": "أيس",
        "response": "ا ي س"
    },
    {
        "question": "كيلوا",
        "response": "ك ي ل و ا"
    },
    {
        "question": "غون",
        "response": "غ و ن"
    },
    {
        "question": "هيسوكا",
        "response": "ه ي س و ك ا"
    },
    {
        "question": "يوسوكي",
        "response": "ي و س و ك ي"
    },
    {
        "question": "كانيكي",
        "response": "ك ا ن ي ك ي"
    },
    {
        "question": "توكا",
        "response": "ت و ك ا"
    },
    {
        "question": "اينوي",
        "response": "ا ي ن و ي"
    },
    {
        "question": "ايتشيغو",
        "response": "ا ي ت ش ي غ و"
    },
    {
        "question": "اوراهارا",
        "response": "ا و ر ا ه ا ر ا"
    },
    {
        "question": "رينجي",
        "response": "ر ي ن ج ي"
    },
    {
        "question": "بيوكويا",
        "response": "ب ي و ك و ي ا"
    },
    {
        "question": "سيتاما",
        "response": "س ي ت ا م ا"
    },
    {
        "question": "جيناي",
        "response": "ج ي ن ا ي"
    },
    {
        "question": "تانجيرو",
        "response": "ت ا ن ج ي ر و"
    },
    {
        "question": "نيزوكو",
        "response": "ن ي ز و ك و"
    },
    {
        "question": "زينتسو",
        "response": "ز ي ن ت س و"
    },
    {
        "question": "اينوسوكي",
        "response": "ا ي ن و س و ك ي"
    },
    {
        "question": "كاما",
        "response": "ك ا م ا"
    },
    {
        "question": "ايزين",
        "response": "ا ي ز ي ن"
    },
    {
        "question": "ميدوريا",
        "response": "م ي د و ر ي ا"
    },
    {
        "question": "باكوغو",
        "response": "ب ا ك و غ و"
    },
    {
        "question": "تودوروكي",
        "response": "ت و د و ر و ك ي"
    },
    {
        "question": "اوراراكا",
        "response": "ا و ر ا ر ا ك ا"
    },
    {
        "question": "لوفت",
        "response": "ل و ف ت"
    },
    {
        "question": "سابو",
        "response": "س ا ب و"
    },
    {
        "question": "ايس",
        "response": "ا ي س"
    },
    {
        "question": "كوبي",
        "response": "ك و ب ي"
    },
    {
        "question": "شانكس",
        "response": "ش ا ن ك س"
    },
    {
        "question": "بوروتو",
        "response": "ب و ر و ت و"
    },
    {
        "question": "سارادا",
        "response": "س ا ر ا د ا"
    },
    {
        "question": "ميتسكي",
        "response": "م ي ت س ك ي"
    },
    {
        "question": "اواي",
        "response": "ا و ا ي"
    },
    {
        "question": "يوتا",
        "response": "ي و ت ا"
    },
    {
        "question": "ريوك",
        "response": "ر ي و ك"
    },
    {
        "question": "ميسا",
        "response": "م ي س ا"
    },
    {
        "question": "لايت",
        "response": "ل ا ي ت"
    },
    {
        "question": "ل",
        "response": "ل"
    },
    {
        "question": "نير",
        "response": "ن ي ر"
    },
    {
        "question": "زين",
        "response": "ز ي ن"
    },
    {
        "question": "غراي",
        "response": "غ ر ا ي"
    },
    {
        "question": "لوسي",
        "response": "ل و س ي"
    },
    {
        "question": "ناتسو",
        "response": "ن ا ت س و"
    },
    {
        "question": "ايرزا",
        "response": "ا ي ر ز ا"
    },
    {
        "question": "ويندي",
        "response": "و ي ن د ي"
    },
    {
        "question": "جيل",
        "response": "ج ي ل"
    },
    {
        "question": "ليفي",
        "response": "ل ي ف ي"
    },
    {
        "question": "ارمين",
        "response": "ا ر م ي ن"
    },
    {
        "question": "هانجي",
        "response": "ه ا ن ج ي"
    },
    {
        "question": "انمي",
        "response": "ا ن م ي"
    },
    {
        "question": "يوري",
        "response": "ي و ر ي"
    },
    {
        "question": "فيكتور",
        "response": "ف ي ك ت و ر"
    },
    {
        "question": "يوريو",
        "response": "ي و ر ي و"
    },
    {
        "question": "اش",
        "response": "ا ش"
    },
    {
        "question": "ايين",
        "response": "ا ي ي ن"
    },
    {
        "question": "كانادي",
        "response": "ك ا ن ا د ي"
    },
    {
        "question": "تسوكاسا",
        "response": "ت س و ك ا س ا"
    },
    {
        "question": "ناوفي",
        "response": "ن ا و ف ي"
    },
    {
        "question": "زيرو",
        "response": "ز ي ر و"
    },
    {
        "question": "سينا",
        "response": "س ي ن ا"
    },
    {
        "question": "يوكي",
        "response": "ي و ك ي"
    },
    {
        "question": "كورو",
        "response": "ك و ر و"
    },
    {
        "question": "شوتا",
        "response": "ش و ت ا"
    },
    {
        "question": "رين",
        "response": "ر ي ن"
    },
    {
        "question": "ماكوتو",
        "response": "م ا ك و ت و"
    },
    {
        "question": "هاروكا",
        "response": "ه ا ر و ك ا"
    },
    {
        "question": "ناغيسا",
        "response": "ن ا غ ي س ا"
    },
    {
        "question": "هومورا",
        "response": "ه و م و ر ا"
    },
    {
        "question": "مادوكا",
        "response": "م ا د و ك ا"
    },
    {
        "question": "سايا",
        "response": "س ا ي ا"
    },
    {
        "question": "ميراي",
        "response": "م ي ر ا ي"
    },
    {
        "question": "كاغومي",
        "response": "ك ا غ و م ي"
    },
    {
        "question": "اينوري",
        "response": "ا ي ن و ر ي"
    },
    {
        "question": "يوكينو",
        "response": "ي و ك ي ن و"
    },
    {
        "question": "توكيساكي",
        "response": "ت و ك ي س ا ك ي"
    },
    {
        "question": "كوريمي",
        "response": "ك و ر ي م ي"
    },
    {
        "question": "شيدو",
        "response": "ش ي د و"
    },
    {
        "question": "تومو",
        "response": "ت و م و"
    },
    {
        "question": "كوتومي",
        "response": "ك و ت و م ي"
    },
    {
        "question": "ريوكو",
        "response": "ر ي و ك و"
    },
    {
        "question": "ايانو",
        "response": "ا ي ا ن و"
    },
    {
        "question": "يوكيتر",
        "response": "ي و ك ي ت ر"
    },
    {
        "question": "ميزوكي",
        "response": "م ي ز و ك ي"
    },
    {
        "question": "شينجي",
        "response": "ش ي ن ج ي"
    },
    {
        "question": "اسوكا",
        "response": "ا س و ك ا"
    },
    {
        "question": "راي",
        "response": "ر ا ي"
    },
    {
        "question": "ميساتو",
        "response": "م ي س ا ت و"
    },
    {
        "question": "كاورو",
        "response": "ك ا و ر و"
    },
    {
        "question": "كيرا",
        "response": "ك ي ر ا"
    },
    {
        "question": "تنغن",
        "response": "ت ن غ ن"
    }
];

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        // التحقق إذا كانت اللعبة نشطة
        if (global.games.tafkeek && global.games.tafkeek[chatId]) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⚠️ *يوجد سؤال نشط هنا!*`, m);
            return;
        }

        // اختيار سؤال عشوائي
        let json = tekateki[Math.floor(Math.random() * tekateki.length)];

        let caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* تفكيك الأسماء
🎌 *الشخصية:* ${json.question}

⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *المطلوب:* اكتب الاسم بشكل مفكك (حرف حرف)

🍁 *الشعار:* رتب الحروف
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

        // حفظ حالة اللعبة
        global.games.tafkeek = global.games.tafkeek || {};
        global.games.tafkeek[chatId] = {
            answer: json.response.toLowerCase(),
            correctAnswer: json.response,
            character: json.question,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.games.tafkeek && global.games.tafkeek[chatId]) {
                    await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n🎌 *الشخصية:* ${json.question}\n✅ *الإجابة:* ${json.response}`, m);
                    delete global.games.tafkeek[chatId];
                }
            }, timeout),
            attempts: 0,
            hintsGiven: []
        };

    } catch (error) {
        console.error('❌ خطأ في لعبة تفكيك:', error);
        await conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text) return false;
        
        const chatId = m.chat;
        const userId = m.sender;
        const game = global.games.tafkeek ? global.games.tafkeek[chatId] : null;
        
        if (!game) return false;

        let userAnswer = m.text.toLowerCase().trim();

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            try { await m.react('🚪'); } catch (e) {}
            
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n🎌 *الشخصية:* ${game.character}\n✅ *الإجابة:* ${game.correctAnswer}`, m);
            delete global.games.tafkeek[chatId];
            return true;
        }

        // التحقق من الإجابة الصحيحة
        if (userAnswer === game.answer) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            try { await m.react('✅'); } catch (e) {}
            
            let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n🎌 *الشخصية:* ${game.character}\n✅ *الإجابة:* ${game.correctAnswer}\n💰 *الجائزة:* ${poin} نقطة\n⏱️ *الوقت:* ${timeTaken} ثانية`;
            
            await conn.reply(m.chat, winText, m);
            delete global.games.tafkeek[chatId];
            return true;
        }

        // إجابة خاطئة
        game.attempts++;
        
        let hintMessage = `❌ *إجابة خاطئة!*\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts >= 2 && !game.hintsGiven.includes('firstLetter')) {
            const firstLetter = game.correctAnswer.split(' ')[0];
            extraHint = `\n💡 *الحرف الأول:* ${firstLetter}`;
            game.hintsGiven.push('firstLetter');
        } else if (game.attempts >= 4 && !game.hintsGiven.includes('length')) {
            const length = game.correctAnswer.split(' ').length;
            extraHint = `\n💡 *عدد الأحرف:* ${length}`;
            game.hintsGiven.push('length');
        }

        try { await m.react('❌'); } catch (e) {}

        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n${hintMessage}${extraHint}\n🎌 *الشخصية:* ${game.character}\n📊 *المحاولة:* ${game.attempts}`, m);

        return true;

    } catch (error) {
        console.error('❌ خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['تفكيك']
handler.tags = ['game']
handler.command = /^(تفكيك|tafkeek)$/i
handler.group = true

export default handler;
     