import fetch from 'node-fetch';

let timeout = 60000;
let poin = 1000;

if (!global.sportGame) {
    global.sportGame = {};
}

// ⭐⭐⭐ أسئلة الرياضة ⭐⭐⭐
const sportQuestions = [
    {
        "question": "من فاز في كأس العالم 2022",
        "response": "الارجنتين",
        "options": ["البرازيل", "الارجنتين", "فرنسا", "ألمانيا"]
    },
    {
        "question": "من هو اللاعب الذي حقق الكرة الذهبية عام 2018",
        "response": "مودريتش",
        "options": ["مودريتش", "رونالدو", "ميسي", "صلاح"]
    },
    {
        "question": "من هو النادي الفائز ببطولة دوري ابطال اوروبا 1985",
        "response": "يوفنتوس",
        "options": ["يوفنتوس", "ليفربول", "روما", "بايرن ميونخ"]
    }
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
        
        if (global.sportGame && global.sportGame[chatId]) {
            await conn.reply(m.chat, `🍁 لا يزال هناك سؤال نشط!\n🍁 اكتب إجابتك الآن`, m);
            return;
        }

        // اختيار سؤال عشوائي
        let json = sportQuestions[Math.floor(Math.random() * sportQuestions.length)];
        
        // خلط الخيارات عشوائياً
        let shuffledOptions = [...json.options].sort(() => Math.random() - 0.5);

        let caption = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎯 لـعـبـة الـريـاضـة ⚽
⏰ الـوقـت: ${(timeout / 1000)} ثانية  
💰 الـنـقـاط: ${poin} 

⚽ الـسـؤال: ${json.question}

📋 الـخـيـارات:
1. ${shuffledOptions[0]}
2. ${shuffledOptions[1]}
3. ${shuffledOptions[2]}
4. ${shuffledOptions[3]}

🍁 اكتب رقم الإجابة (1-4)

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

        // حفظ حالة اللعبة
        global.sportGame[chatId] = {
            answer: json.response.toLowerCase().trim(),
            correctAnswer: json.response,
            question: json.question,
            options: shuffledOptions,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.sportGame && global.sportGame[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n⚽ الإجابة: ${json.response}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.sportGame[chatId];
                }
            }, timeout),
            attempts: 0
        };

        console.log(`🍁 بدأت لعبة رياضة في ${chatId} - السؤال: ${json.question}`);

    } catch (error) {
        console.error('🍁 خطأ في لعبة رياضة:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m) => {
    try {
        if (m.isBaileys || !m.text || !global.sportGame) return;

        const chatId = m.chat;
        const userId = m.sender;
        
        const game = global.sportGame[chatId];
        if (!game) return false;
        
        game.attempts++;

        let userAnswer = m.text.trim();
        
        // التحقق من الانسحاب
        if (userAnswer.toLowerCase() === 'انسحب') {
            clearTimeout(game.timeout);
            
            await conn.reply(m.chat, 
                `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🚪 تـم الـإنـسـحـاب!\n⚽ الإجابة: ${game.correctAnswer}\n📊 المحاولات: ${game.attempts}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                m
            );
            delete global.sportGame[chatId];
            return true;
        }
        
        // تحويل الأرقام العربية إلى إنجليزية
        const unifiedAnswer = userAnswer.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
                                       .replace(/[١٢٣٤]/g, d => '١٢٣٤'.indexOf(d) + 1);

        let isCorrect = false;
        const userAnswerLower = unifiedAnswer.toLowerCase();

        // التحقق من الإجابة كرقم (1, 2, 3, 4)
        const answerNum = parseInt(userAnswerLower);
        if (!isNaN(answerNum) && answerNum >= 1 && answerNum <= 4) {
            if (game.options[answerNum - 1].toLowerCase() === game.answer) {
                isCorrect = true;
            }
        }
        // التحقق من الإجابة كنص
        else if (userAnswerLower === game.answer) {
            isCorrect = true;
        }

        // التحقق من الإجابة الصحيحة
        if (isCorrect) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            // إضافة النقاط للمستخدم
            const pointsResult = await addUserPoints(userId, poin);
            
            let winMessage = `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🎉 إجـابـة صـحـيـحة!\n🏆 الـفـائـز: ${m.pushName || 'مستخدم'}\n⚽ الـسـؤال: ${game.question}\n✅ الإجـابـة: ${game.correctAnswer}\n💰 الـنـقـاط: ${poin}\n⏱️ الـوقـت: ${timeTaken} ثانية\n📊 الـمـحـاولات: ${game.attempts}`;
            
            // إضافة معلومات البنك إذا نجحت العملية
            if (pointsResult.success) {
                winMessage += `\n💎 الـرصـيـد الـجـديـد: ${pointsResult.newExp} نقطة`;
                if (pointsResult.level > 1) {
                    winMessage += `\n⭐ الـمـسـتـوى: ${pointsResult.level}`;
                }
            }
            
            winMessage += `\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`;
            
            await conn.reply(m.chat, winMessage, m);
            delete global.sportGame[chatId];
            return true;
        }

        // تلميحات مبسطة
        let hintMessage = `❌ إجابة خاطئة!`;
        
        let extraHint = '';
        if (game.attempts === 2) {
            extraHint = `\n🍁 حاول استخدام رقم الخيار (1-4)`;
        } else if (game.attempts === 4) {
            const firstLetter = game.correctAnswer.charAt(0);
            extraHint = `\n🍁 تلميح: الحرف الأول: ${firstLetter}`;
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

handler.help = ['رياضة']
handler.tags = ['game']
handler.command = /^(رياضة)$/i
handler.group = true

export default handler;