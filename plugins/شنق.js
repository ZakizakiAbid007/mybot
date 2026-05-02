import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let timeout = 60000;
let poin = 500;

// ⭐⭐ توحيد التخزين وضمان الأمان ⭐⭐
if (!global.games) {
    global.games = {};
}
global.games.hangman = global.games.hangman || {}; 

// ⭐⭐⭐ كلمات اللعبة - شخصيات أنمي + الكلمات الأصلية ⭐⭐⭐
const hangmanWords = [
    // فواكه
    { word: "تفاح", hint: "🍎 فاكهة حمراء", missingLetter: "ح" },
    { word: "موز", hint: "🍌 فاكهة صفراء", missingLetter: "ز" },
    { word: "برتقال", hint: "🍊 فاكهة برتقالية", missingLetter: "ق" },
    { word: "فراولة", hint: "🍓 فاكهة حمراء", missingLetter: "و" },
    { word: "عنب", hint: "🍇 فاكهة عنقودية", missingLetter: "ن" },
    
    // خضروات
    { word: "جزر", hint: "🥕 خضار برتقالي", missingLetter: "ر" },
    { word: "طماطم", hint: "🍅 خضار أحمر", missingLetter: "ا" },
    { word: "خيار", hint: "🥒 خضار أخضر", missingLetter: "ي" },
    { word: "بصل", hint: "🧅 خضار له رائحة", missingLetter: "ص" },
    { word: "ثوم", hint: "🧄 خضار له رائحة قوية", missingLetter: "و" },
    
    // حيوانات
    { word: "اسد", hint: "🦁 ملك الغابة", missingLetter: "س" },
    { word: "نمر", hint: "🐯 حيوان مخطط", missingLetter: "م" },
    { word: "فيل", hint: "🐘 حيوان ضخم", missingLetter: "ي" },
    { word: "زرافة", hint: "🦒 أطول حيوان", missingLetter: "ف" },
    { word: "قرد", hint: "🐒 حيوان ذكي", missingLetter: "ر" },
    
    // طيور
    { word: "نسر", hint: "🦅 طائر جارح", missingLetter: "س" },
    { word: "ببغاء", hint: "🦜 طائر متكلم", missingLetter: "غ" },
    { word: "حمامة", hint: "🕊️ طائر السلام", missingLetter: "م" },
    { word: "عصفور", hint: "🐦 طائر صغير", missingLetter: "ف" },
    { word: "بط", hint: "🦆 طائر مائي", missingLetter: "ط" },
    
    // أدوات
    { word: "قلم", hint: "✏️ أداة للكتابة", missingLetter: "ل" },
    { word: "كتاب", hint: "📚 يحتوي على صفحات", missingLetter: "ت" },
    { word: "مقص", hint: "✂️ أداة للقص", missingLetter: "ص" },
    { word: "مسطرة", hint: "📏 أداة للقياس", missingLetter: "ط" },
    { word: "ممحاة", hint: "🧼 أداة للمسح", missingLetter: "ح" },
    
    // أثاث
    { word: "كرسي", hint: "🪑 للجلوس", missingLetter: "ر" },
    { word: "طاولة", hint: "🛋️ للأكل والعمل", missingLetter: "ا" },
    { word: "سرير", hint: "🛏️ للنوم", missingLetter: "ي" },
    { word: "خزانة", hint: "🚪 لحفظ الملابس", missingLetter: "ز" },
    { word: "مكتب", hint: "💼 للعمل", missingLetter: "ت" },
    
    // طبيعة
    { word: "شمس", hint: "☀️ تشرق في الصباح", missingLetter: "م" },
    { word: "قمر", hint: "🌙 يظهر في الليل", missingLetter: "م" },
    { word: "بحر", hint: "🌊 مياه مالحة", missingLetter: "ح" },
    { word: "نهر", hint: "🌊 مياه عذبة", missingLetter: "ه" },
    { word: "جبل", hint: "⛰️ مرتفع أرضي", missingLetter: "ب" },
    
    // ألوان
    { word: "احمر", hint: "🔴 لون الدم", missingLetter: "م" },
    { word: "ازرق", hint: "🔵 لون البحر", missingLetter: "ر" },
    { word: "اخضر", hint: "🟢 لون النبات", missingLetter: "ض" },
    { word: "اصفر", hint: "🟡 لون الشمس", missingLetter: "ف" },
    { word: "اسود", hint: "⚫ لون الليل", missingLetter: "و" },
    
    // مشروبات
    { word: "حليب", hint: "🥛 شراب أبيض", missingLetter: "ل" },
    { word: "عصير", hint: "🧃 شراب فواكه", missingLetter: "ص" },
    { word: "قهوة", hint: "☕ شراب منبه", missingLetter: "ه" },
    { word: "شاي", hint: "🍵 شراب ساخن", missingLetter: "ي" },
    { word: "ماء", hint: "💧 شراب الحياة", missingLetter: "ا" },
    
    // أطعمة
    { word: "عسل", hint: "🍯 يصنعه النحل", missingLetter: "س" },
    { word: "سكر", hint: "🍬 مادة حلوة", missingLetter: "ك" },
    { word: "ملح", hint: "🧂 يستخدم في الطعام", missingLetter: "ل" },
    { word: "رز", hint: "🍚 طعام أساسي", missingLetter: "ز" },
    { word: "خبز", hint: "🍞 طعام يومي", missingLetter: "ب" },

    // أنمي مشهور
    { word: "ناروتو", hint: "🍥 شينوبي يحلم بأن يكون الهوكاج", missingLetter: "ر" },
    { word: "لوفي", hint: "🏴‍☠️ قبطان قراصنة قبعة القش", missingLetter: "و" },
    { word: "غون", hint: "🎣 صياد يبحث عن والده", missingLetter: "ن" },
    { word: "إيرين", hint: "🐉 يمتلك قوة التنين", missingLetter: "ر" },
    { word: "ليفاي", hint: "🔧 أقرب جندي في فيلق الاستطلاع", missingLetter: "ف" },
    
    // شخصيات أنمي قوية
    { word: "ساتورو", hint: "🔵 أقرب ساحر في جوجوتسو", missingLetter: "ر" },
    { word: "تانيجيرو", hint: "🗡️ صائد شياطين يحمل أقراط هانافودو", missingLetter: "ج" },
    { word: "زينيتسو", hint: "⚡ صائد شياطين سريع الغضب", missingLetter: "ت" },
    { word: "اينوسوكي", hint: "🐗 صائد شياطين عدواني", missingLetter: "س" },
    { word: "كوجو", hint: "⏱️ يتحكم في الزمن", missingLetter: "ج" },
    
    // أنمي أكشن
    { word: "ايزوكو", hint: "💚 بطل يريد أن يكون مثل اول مايت", missingLetter: "ز" },
    { word: "كاتسوكي", hint: "🧨 بطل متفجر الشخصية", missingLetter: "ت" },
    { word: "اينري", hint: "🍎 فتاة تحمل تفاحة في فمها", missingLetter: "ن" },
    { word: "ميدوريا", hint: "🐰 بطل يرتد زي ارنب", missingLetter: "د" },
    { word: "تودوروكي", hint: "🔥❄️ يتحكم في النار والجليد", missingLetter: "د" },
    
    // أنمي دراما
    { word: "كوروكو", hint: "🏀 لاعب كرة سلة قصير يحلم بالتغلب على اخيه", missingLetter: "ر" },
    { word: "هيسوكا", hint: "🃏 ساحر قوي يحب الألعاب", missingLetter: "س" },
    { word: "كيلوا", hint: "⚡ قاتل محترف من عائلة زولديك", missingLetter: "ل" },
    { word: "نيومي", hint: "🎲 عبقري ألعاب من نو جيم نو لايف", missingLetter: "ي" },
    { word: "سورا", hint: "🎮 بطل ألعاب لا يهزم", missingLetter: "ر" },
    
    // أنمي مغامرات
    { word: "اش", hint: "🔬 مدرب بوكيمون يحلم بأن يكون سيد", missingLetter: "ش" },
    { word: "ميساكي", hint: "🎯 طالب موهوب في الفصل", missingLetter: "س" },
    { word: "ريتشارد", hint: "👑 أمير يحب الأحجار الكريمة", missingLetter: "ح" },
    { word: "يوه", hint: "🔮 وسيط روحي هادئ", missingLetter: "ه" },
    { word: "ميكا", hint: "🧛‍♂️ مصاص دماء مخلص", missingLetter: "ك" },
    
    // أنمي رياضة
    { word: "هيناتا", hint: "🏐 لاعب كرة طائرة قصير يريد الطيران", missingLetter: "ن" },
    { word: "كاجي", hint: "👑 ملك الملعب في كرة السلة", missingLetter: "ج" },
    { word: "ساورا", hint: "🎾 لاعبة تنس موهوبة", missingLetter: "ر" },
    { word: "ماكوتو", hint: "🏊 سباح هادئ الطباع", missingLetter: "ك" },
    { word: "هاروكا", hint: "🏊 سباح يحب الماء", missingLetter: "ر" },
    
    // أنمي خيال علمي
    { word: "لوتس", hint: "🤖 رائد فضاء في مهمة استكشاف", missingLetter: "ت" },
    { word: "كاني", hint: "👁️ يمتلك عين غود", missingLetter: "ن" },
    { word: "ريوك", hint: "📓 يمتلك دفتر الموت", missingLetter: "ي" },
    { word: "ميسا", hint: "🎤 مغنية تدعم كيرا", missingLetter: "س" },
    { word: "ال", hint: "🤖 روبوت في البحث عن الفهم الإنساني", missingLetter: "ل" },
    
    // أنمي كوميدي
    { word: "جيل", hint: "👻 صياد أشباح جبان", missingLetter: "ي" },
    { word: "سايكو", hint: "🍲 بطل يحارب بالطعام", missingLetter: "ي" },
    { word: "اوزوماكي", hint: "🍜 يحب الرامن ابن سيد الحارة", missingLetter: "ز" },
    { word: "كاغورا", hint: "☂️ فتاة من الفضاء تحمل مظلة", missingLetter: "غ" },
    { word: "شينب", hint: "👻 وسيلة روحي في مدرسة", missingLetter: "ن" },
    
    // أنمي تاريخي
    { word: "هيجيكاتا", hint: "🥬 نائب قائد فرقة الشينسينغومي", missingLetter: "ج" },
    { word: "غينتوكي", hint: "🚕 سائق دراجة نقل في فترة إيدو", missingLetter: "ت" },
    { word: "كينسي", hint: "🗡️ سيف ساموراي أسطوري", missingLetter: "س" },
    { word: "ياتو", hint: "👻 سيف به روح ولي", missingLetter: "ت" },
    { word: "يوكيمورا", hint: "⚔️ مقاتل من فترة سينغوكو", missingLetter: "م" }
];

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        if (global.games.hangman[chatId]) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n🚫 *اللعبة لم تنته بعد!* (${((Date.now() - global.games.hangman[chatId].startTime) / 1000).toFixed(0)} ثانية)\n💡 *الكلمة:* ${global.games.hangman[chatId].displayWord}`, m);
            return;
        }

        const randomWordData = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
        const { word, hint, missingLetter } = randomWordData;

        let displayWord = '';
        for (let i = 0; i < word.length; i++) {
            if (word[i] === missingLetter) {
                displayWord += '_ ';
            } else {
                displayWord += word[i] + ' ';
            }
        }
        displayWord = displayWord.trim();

        let caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* املأ الفراغ
💭 *تلميح:* ${hint}
🔤 *الكلمة:* ${displayWord}
⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *المطلوب:* الحرف الناقص فقط

🍁 *الشعار:* ابحث عن الحرف المفقود
`.trim();

        const sentMessage = await conn.reply(m.chat, caption, m);

        global.games.hangman[chatId] = {
            message: sentMessage,
            word: word,
            hint: hint,
            missingLetter: missingLetter.toLowerCase(),
            correctAnswer: missingLetter,
            displayWord: displayWord,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.games.hangman[chatId]) {
                    await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n🎯 *الكلمة:* ${word}\n✅ *الحرف الناقص:* 「 ${missingLetter} 」`, m);
                    delete global.games.hangman[chatId];
                }
            }, timeout),
            attempts: 0,
            maxAttempts: 5,
            hintsGiven: []
        };

        console.log(`🎮 بدأت لعبة املأ الفراغ في ${chatId} - الكلمة: ${word}`);

    } catch (error) {
        console.error('❌ خطأ في لعبة املأ الفراغ:', error);
        await conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text) return false;
        
        const chatId = m.chat;
        const userId = m.sender;
        const game = global.games.hangman[chatId];
        
        if (!game) return false;

        if (m.text.startsWith(m.prefix)) return false;
        
        let userAnswer = m.text.toLowerCase().trim();

        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            try { await m.react('🚪'); } catch (reactError) {}
            
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n🎯 *الكلمة:* ${game.word}\n✅ *الحرف الناقص:* 「 ${game.correctAnswer} 」\n📊 *المحاولات الخاطئة:* ${game.attempts}`, m);
            delete global.games.hangman[chatId];
            return true;
        }

        const isSingleArabicLetter = userAnswer.match(/^[أ-يء-ي]$/);

        if (!isSingleArabicLetter) {
            if (userAnswer.length > 10) return false;

            try { await m.react('❓'); } catch (reactError) {}

            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n❌ *أدخل حرفاً عربياً واحداً فقط*\n🔤 *الكلمة:* ${game.displayWord}\n📊 *المحاولات المتبقية:* ${game.maxAttempts - game.attempts}`, m);
            return true;
        }

        if (userAnswer === game.missingLetter) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            try { await m.react('✅'); } catch (reactError) {}
            
            let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n🎯 *الكلمة:* ${game.word}\n✅ *الحرف الناقص:* ${game.correctAnswer}\n💰 *الجائزة:* ${poin} نقطة\n⏱️ *الوقت:* ${timeTaken} ثانية\n📊 *المحاولات الخاطئة:* ${game.attempts}`;
            
            await conn.reply(m.chat, winText, m);
            delete global.games.hangman[chatId];
            return true;
        }

        game.attempts++;
        
        const attemptsLeft = game.maxAttempts - game.attempts;
        
        if (attemptsLeft <= 0) {
            clearTimeout(game.timeout);
            
            try { await m.react('💥'); } catch (reactError) {}
            
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n💥 *انتهت المحاولات!*\n❌ *إجابتك:* ${userAnswer}\n🎯 *الكلمة:* ${game.word}\n✅ *الحرف الناقص:* 「 ${game.correctAnswer} 」`, m);
            delete global.games.hangman[chatId];
            return true;
        }

        let hintMessage = `❌ *إجابة خاطئة!* (${userAnswer})\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts === 2 && !game.hintsGiven.includes('wordLength')) {
            const wordLength = game.word.length;
            extraHint = `\n💡 *عدد الأحرف:* ${wordLength}`;
            game.hintsGiven.push('wordLength');
        } else if (game.attempts === 4 && !game.hintsGiven.includes('position')) {
            const position = game.word.indexOf(game.missingLetter) + 1;
            extraHint = `\n💡 *موقع الحرف:* ${position}`;
            game.hintsGiven.push('position');
        }

        try {
            await m.react('❌');
        } catch (reactError) {}

        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n${hintMessage}${extraHint}\n🔤 *الكلمة:* ${game.displayWord}\n📊 *المحاولات المتبقية:* ${attemptsLeft}`, m);

        return true;

    } catch (error) {
        console.error('❌ خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['شنق']
handler.tags = ['game']
handler.command = /^(شنق|املا|hangman)$/i
handler.group = true

export default handler;