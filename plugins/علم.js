import fetch from 'node-fetch';

let timeout = 60000;
let poin = 1500;

if (!global.flagGame) {
    global.flagGame = {};
}

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
        
        if (global.flagGame && global.flagGame[chatId]) {
            await conn.reply(m.chat, `🍁 لا يزال هناك سؤال نشط!\n🍁 اكتب إجابتك الآن`, m);
            return;
        }

        // جلب البيانات من المصدر
        let src = await (await fetch('https://gist.githubusercontent.com/Kyutaka101/799d5646ceed992bf862026847473852/raw/dcbecff259b1d94615d7c48079ed1396ed42ef67/gistfile1.txt')).json();
        let json = src[Math.floor(Math.random() * src.length)];

        let caption = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎯 لـعـبـة الـعـلـم 🏳️
⏰ الـوقـت: ${(timeout / 1000)} ثانية  
💰 الـنـقـاط: ${poin} 

🍁 خـمـن اسـم الـدولـة

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        // إرسال الصورة والسؤال
        try {
            await conn.sendMessage(chatId, {
                image: { url: json.img },
                caption: caption
            }, { quoted: m });
        } catch (sendError) {
            console.error('🍁 خطأ في إرسال الصورة:', sendError);
            await conn.reply(m.chat, `🏳️ لعبة العلم\n\n${caption}`, m);
        }

        // حفظ حالة اللعبة
        global.flagGame[chatId] = {
            answer: json.name.toLowerCase(),
            correctAnswer: json.name,
            image: json.img,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.flagGame && global.flagGame[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n🎌 الإجابة: ${json.name}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.flagGame[chatId];
                }
            }, timeout),
            attempts: 0
        };

        console.log(`🍁 بدأت لعبة العلم في ${chatId} - الدولة: ${json.name}`);

    } catch (error) {
        console.error('🍁 خطأ في لعبة العلم:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// دالة التحقق من التشابه
function checkAnswerSimilarity(userAnswer, correctAnswer) {
    const longer = userAnswer.length > correctAnswer.length ? userAnswer : correctAnswer;
    const shorter = userAnswer.length > correctAnswer.length ? correctAnswer : userAnswer;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

// معالج الإجابات
handler.before = async (m) => {
    try {
        if (m.isBaileys || !m.text || !global.flagGame) return;
        
        const chatId = m.chat;
        const userId = m.sender;
        
        let userAnswer = m.text.toLowerCase().trim();
        
        const game = global.flagGame[chatId];
        if (!game) return false;

        game.attempts++;

        // التحقق من الإجابة الصحيحة
        if (userAnswer === game.answer.toLowerCase()) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            // إضافة النقاط للمستخدم
            const pointsResult = await addUserPoints(userId, poin);
            
            let winMessage = `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🎉 إجـابـة صـحـيـحة!\n🏆 الـفـائـز: ${m.pushName || 'مستخدم'}\n🎌 الـدولـة: ${game.correctAnswer}\n💰 الـنـقـاط: ${poin}\n⏱️ الـوقـت: ${timeTaken} ثانية\n📊 الـمـحـاولات: ${game.attempts}`;
            
            // إضافة معلومات البنك إذا نجحت العملية
            if (pointsResult.success) {
                winMessage += `\n💎 الـرصـيـد الـجـديـد: ${pointsResult.newExp} نقطة`;
                if (pointsResult.level > 1) {
                    winMessage += `\n⭐ الـمـسـتـوى: ${pointsResult.level}`;
                }
            }
            
            winMessage += `\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`;
            
            await conn.reply(m.chat, winMessage, m);
            delete global.flagGame[chatId];
            return true;
        }

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            await conn.reply(m.chat, 
                `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🚪 تـم الـإنـسـحـاب!\n🎌 الإجابة: ${game.correctAnswer}\n📊 المحاولات: ${game.attempts}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                m
            );
            delete global.flagGame[chatId];
            return true;
        }

        // تلميحات مبسطة
        const similarity = checkAnswerSimilarity(userAnswer, game.answer);
        
        let hintMessage = `❌ إجابة خاطئة!\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts === 2) {
            const firstLetter = game.correctAnswer.charAt(0);
            extraHint = `\n🍁 تلميح: الحرف الأول: ${firstLetter}`;
        } else if (game.attempts === 4 && similarity < 0.4) {
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

handler.help = ['علم']
handler.tags = ['game']
handler.command = /^(علم)$/i
handler.group = true

export default handler