import fetch from 'node-fetch';

let timeout = 45000;
let poin = 600;

if (!global.writingGame) {
    global.writingGame = {};
}

// ⭐⭐⭐ كلمات للكتابة - شخصيات متنوعة من أنمي، أفلام، مسلسلات، ألعاب ⭐⭐⭐
const writingWords = [
    // شخصيات أنمي مشهورة
    {"question": "ناروتو", "response": "ناروتو"},
    {"question": "ساسكي", "response": "ساسكي"},
    {"question": "لوفي", "response": "لوفي"},
    {"question": "زورو", "response": "زورو"},
    {"question": "غوكو", "response": "غوكو"},
    {"question": "ليفاي", "response": "ليفاي"},
    {"question": "ايرين", "response": "ايرين"},
    {"question": "ميكاسا", "response": "ميكاسا"},
    {"question": "ايتاتشي", "response": "ايتاتشي"},
    {"question": "مادارا", "response": "مادارا"},
    {"question": "كيرا", "response": "كيرا"},
    {"question": "تنغن", "response": "تنغن"},
    {"question": "هيناتا", "response": "هيناتا"},
    {"question": "ساكورا", "response": "ساكورا"},
    {"question": "كاكاشي", "response": "كاكاشي"},
    {"question": "ايزين", "response": "ايزين"},
    {"question": "ايتشيغو", "response": "ايتشيغو"},
    {"question": "رينجي", "response": "رينجي"},
    {"question": "كانيكي", "response": "كانيكي"},
    {"question": "توكا", "response": "توكا"},
    
    // شخصيات أفلام عالمية
    {"question": "هاري بوتر", "response": "هاري بوتر"},
    {"question": "هيرميون", "response": "هيرميون"},
    {"question": "رون", "response": "رون"},
    {"question": "سيدريك", "response": "سيدريك"},
    {"question": "دراكو", "response": "دراكو"},
    {"question": "سنيب", "response": "سنيب"},
    {"question": "دumbledore", "response": "دumbledore"},
    {"question": "فولدمورت", "response": "فولدمورت"},
    
    // شخصيات مارفل
    {"question": "أيرون مان", "response": "أيرون مان"},
    {"question": "كابتن أمريكا", "response": "كابتن أمريكا"},
    {"question": "ثور", "response": "ثور"},
    {"question": "هولك", "response": "هولك"},
    {"question": "بلاك بانثر", "response": "بلاك بانثر"},
    {"question": "دكتور سترينج", "response": "دكتور سترينج"},
    {"question": "سبايدر مان", "response": "سبايدر مان"},
    {"question": "بلاك ويدو", "response": "بلاك ويدو"},
    {"question": "ثانوس", "response": "ثانوس"},
    {"question": "لوكي", "response": "لوكي"},
    
    // شخصيات دي سي
    {"question": "باتمان", "response": "باتمان"},
    {"question": "سوبرمان", "response": "سوبرمان"},
    {"question": "ووندر وومان", "response": "ووندر وومان"},
    {"question": "ذا فلاش", "response": "ذا فلاش"},
    {"question": "أكوا مان", "response": "أكوا مان"},
    {"question": "سايبورغ", "response": "سايبورغ"},
    {"question": "الجوكر", "response": "الجوكر"},
    {"question": "هارلي كوين", "response": "هارلي كوين"},
    
    // شخصيات ألعاب فيديو
    {"question": "ماريو", "response": "ماريو"},
    {"question": "لويجي", "response": "لويجي"},
    {"question": "بيكاتشو", "response": "بيكاتشو"},
    {"question": "سونيك", "response": "سونيك"},
    {"question": "لارا كروفت", "response": "لارا كروفت"},
    {"question": "كريتوس", "response": "كريتوس"},
    {"question": "ناثان دريك", "response": "ناثان دريك"},
    {"question": "ايزيو", "response": "ايزيو"},
    {"question": "جيرالت", "response": "جيرالت"},
    {"question": "cloud", "response": "cloud"},
    
    // شخصيات عربية
    {"question": "ناصف", "response": "ناصف"},
    {"question": "عدنان", "response": "عدنان"},
    {"question": "لينا", "response": "لينا"},
    {"question": "أسامة", "response": "أسامة"},
    {"question": "نور", "response": "نور"},
    {"question": "ياسمين", "response": "ياسمين"},
    {"question": "فارس", "response": "فارس"},
    {"question": "ليان", "response": "ليان"},
    {"question": "زياد", "response": "زياد"},
    {"question": "ريم", "response": "ريم"},
    
    // شخصيات تاريخية
    {"question": "صلاح الدين", "response": "صلاح الدين"},
    {"question": "نابليون", "response": "نابليون"},
    {"question": "الاسكندر", "response": "الاسكندر"},
    {"question": "كليوباترا", "response": "كليوباترا"},
    {"question": "هانيبال", "response": "هانيبال"},
    {"question": "يوليوس قيصر", "response": "يوليوس قيصر"},
    
    // شخصيات رياضية
    {"question": "ميسي", "response": "ميسي"},
    {"question": "رونالدو", "response": "رونالدو"},
    {"question": "محمد صلاح", "response": "محمد صلاح"},
    {"question": "نيمار", "response": "نيمار"},
    {"question": "mbappe", "response": "mbappe"},
    {"question": "زيدان", "response": "زيدان"},
    {"question": "رونالدينيو", "response": "رونالدينيو"},
    
    // شخصيات كرتون
    {"question": "ميكي ماوس", "response": "ميكي ماوس"},
    {"question": "بطوط", "response": "بطوط"},
    {"question": "توم", "response": "توم"},
    {"question": "جيري", "response": "جيري"},
    {"question": "سابق ولاحق", "response": "سابق ولاحق"},
    {"question": "barbie", "response": "barbie"},
    {"question": "ken", "response": "ken"},
    
    // شخصيات مسلسلات
    {"question": "والتر وايت", "response": "والتر وايت"},
    {"question": "جيسي", "response": "جيسي"},
    {"question": "ديكستر", "response": "ديكستر"},
    {"question": "شيرلوك", "response": "شيرلوك"},
    {"question": "جون سنو", "response": "جون سنو"},
    {"question": "دينريس", "response": "دينريس"},
    {"question": "tyrion", "response": "tyrion"},
    
    // شخصيات أنمي إضافية
    {"question": "اينوسوكي", "response": "اينوسوكي"},
    {"question": "تانجيرو", "response": "تانجيرو"},
    {"question": "نيزوكو", "response": "نيزوكو"},
    {"question": "زينتسو", "response": "زينتسو"},
    {"question": "كاما", "response": "كاما"},
    {"question": "ميدوريا", "response": "ميدوريا"},
    {"question": "باكوغو", "response": "باكوغو"},
    {"question": "تودوروكي", "response": "تودوروكي"},
    {"question": "اوراراكا", "response": "اوراراكا"},
    {"question": "سابو", "response": "سابو"},
    {"question": "شانكس", "response": "شانكس"},
    {"question": "بوروتو", "response": "بوروتو"},
    {"question": "سارادا", "response": "سارادا"},
    {"question": "ميتسكي", "response": "ميتسكي"},
    {"question": "غراي", "response": "غراي"},
    {"question": "لوسي", "response": "لوسي"},
    {"question": "ناتسو", "response": "ناتسو"},
    {"question": "ايرزا", "response": "ايرزا"},
    {"question": "ويندي", "response": "ويندي"},
    {"question": "ارمين", "response": "ارمين"},
    {"question": "هانجي", "response": "هانجي"},
    {"question": "يوري", "response": "يوري"},
    {"question": "فيكتور", "response": "فيكتور"},
    {"question": "يوريو", "response": "يوريو"},
    {"question": "كانادي", "response": "كانادي"},
    {"question": "تسوكاسا", "response": "تسوكاسا"},
    {"question": "زيرو", "response": "زيرو"},
    {"question": "يوكي", "response": "يوكي"},
    {"question": "كورو", "response": "كورو"},
    {"question": "شينجي", "response": "شينجي"},
    {"question": "اسوكا", "response": "اسوكا"},
    {"question": "راي", "response": "راي"},
    {"question": "ميساتو", "response": "ميساتو"},
    {"question": "كاورو", "response": "كاورو"}
];

// دالة إضافة النقاط للمستخدم
async function addUserPoints(userId, points) {
    try {
        const getUserData = require('../lib/userData/getUserData');
        const updateUserData = require('../lib/userData/updateUserData');
        
        const userData = getUserData(userId);
        userData.exp = (userData.exp || 0) + points;
        userData.gamesWon = (userData.gamesWon || 0) + 1;
        
        updateUserData(userId, userData);
        
        return {
            success: true,
            newExp: userData.exp,
            pointsAdded: points,
            level: Math.floor(userData.exp / 1000) + 1
        };
    } catch (error) {
        console.error('🍁 خطأ في إضافة النقاط:', error);
        return { success: false };
    }
}

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        if (global.writingGame && global.writingGame[chatId]) {
            await conn.reply(m.chat, `🍁 لا يزال هناك سؤال نشط!\n🍁 اكتب إجابتك الآن`, m);
            return;
        }

        // اختيار سؤال عشوائي
        let json = writingWords[Math.floor(Math.random() * writingWords.length)];

        let caption = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎯 لـعـبـة كـتـابـة ✍️
⏰ الـوقـت: ${(timeout / 1000)} ثانية  
💰 الـنـقـاط: ${poin} 

📝 الـكـلـمـة: ${json.question}

🍁 اكتب الكلمة كما هي

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

        // حفظ حالة اللعبة
        global.writingGame[chatId] = {
            answer: json.response.toLowerCase(),
            correctAnswer: json.response,
            question: json.question,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.writingGame && global.writingGame[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n📝 الإجابة: ${json.response}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.writingGame[chatId];
                }
            }, timeout),
            attempts: 0
        };

        console.log(`🍁 بدأت لعبة كتابة في ${chatId} - الكلمة: ${json.question}`);

    } catch (error) {
        console.error('🍁 خطأ في لعبة كتابة:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m) => {
    try {
        if (m.isBaileys || !m.text || !global.writingGame) return;
        
        const chatId = m.chat;
        const userId = m.sender;
        
        let userAnswer = m.text.toLowerCase().trim();
        
        const game = global.writingGame[chatId];
        if (!game) return false;

        game.attempts++;

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            await conn.reply(m.chat, 
                `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🚪 تـم الـإنـسـحـاب!\n📝 الإجابة: ${game.correctAnswer}\n📊 المحاولات: ${game.attempts}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                m
            );
            delete global.writingGame[chatId];
            return true;
        }

        // التحقق من الإجابة الصحيحة
        if (userAnswer === game.answer.toLowerCase()) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            // إضافة النقاط للمستخدم
            const pointsResult = await addUserPoints(userId, poin);
            
            let winMessage = `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🎉 إجـابـة صـحـيـحة!\n🏆 الـفـائـز: ${m.pushName || 'مستخدم'}\n📝 الـكـلـمـة: ${game.question}\n✅ الإجـابـة: ${game.correctAnswer}\n💰 الـنـقـاط: ${poin}\n⏱️ الـوقـت: ${timeTaken} ثانية\n📊 الـمـحـاولات: ${game.attempts}`;
            
            // إضافة معلومات البنك إذا نجحت العملية
            if (pointsResult.success) {
                winMessage += `\n💎 الـرصـيـد الـجـديـد: ${pointsResult.newExp} نقطة`;
                if (pointsResult.level > 1) {
                    winMessage += `\n⭐ الـمـسـتـوى: ${pointsResult.level}`;
                }
            }
            
            winMessage += `\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`;
            
            await conn.reply(m.chat, winMessage, m);
            delete global.writingGame[chatId];
            return true;
        }

        // تلميحات مبسطة
        let hintMessage = `❌ إجابة خاطئة!`;
        
        let extraHint = '';
        if (game.attempts === 2) {
            extraHint = `\n🍁 اكتب الكلمة بنفس الحروف`;
        } else if (game.attempts === 4) {
            const length = game.correctAnswer.length;
            extraHint = `\n🍁 تلميح: عدد الأحرف: ${length}`;
        }

        await conn.reply(m.chat, 
            `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n${hintMessage}${extraHint}\n📊 المحاولة: ${game.attempts}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
            m
        );

        return true;

    } catch (error) {
        console.error('🍁 خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['كتابة']
handler.tags = ['game']
handler.command = /^(كتابة|كت)$/i
handler.group = true

export default handler