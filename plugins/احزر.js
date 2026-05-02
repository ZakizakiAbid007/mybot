import fetch from 'node-fetch';

let timeout = 60000;
let poin = 1000;

if (!global.guessGame) {
    global.guessGame = {};
}

// دالة جلب البيانات من الرابط
async function fetchGuessGameData() {
    try {
        const response = await fetch('https://gist.githubusercontent.com/Kyutaka101/98d564d49cbf9b539fee19f744de7b26/raw/f2a3e68bbcdd2b06f9dbd5f30d70b9fda42fec14/guessflag');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🍁 تم جلب بيانات لعبة الاحزر بنجاح');
        return data;
    } catch (error) {
        console.error('🍁 خطأ في جلب البيانات:', error);
        return [];
    }
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
        
        if (global.guessGame && global.guessGame[chatId]) {
            await conn.reply(m.chat, `🍁 لا يزال هناك سؤال نشط!\n🍁 اكتب إجابتك الآن`, m);
            return;
        }

        // جلب البيانات من المصدر
        let guessGameData = await fetchGuessGameData();
        
        // إذا فشل جلب البيانات، نستخدم بيانات افتراضية
        if (guessGameData.length === 0) {
            guessGameData = [
                { img: "", name: "ناروتو" },
                { img: "", name: "لوفي" },
                { img: "", name: "غوكو" },
                { img: "", name: "إيرين" },
                { img: "", name: "ليفي" }
            ];
        }
        
        let json = guessGameData[Math.floor(Math.random() * guessGameData.length)];

        let caption = `
🍁 ━━━━━━━━━━━━━━━ 🍁
        
🎯 لـعـبـة احـزر 🎎
⏰ الـوقـت: ${(timeout / 1000)} ثانية  
💰 الـنـقـاط: ${poin} 

🍁 خـمـن اسـم الـشـخـصـيـة

🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        // إذا كانت هناك صورة، نرسلها مع النص
        if (json.img) {
            await conn.sendMessage(chatId, {
                image: { url: json.img },
                caption: caption
            }, { quoted: m });
        } else {
            await conn.reply(m.chat, `${caption}\n\n🧩 السؤال: من هذه الشخصية؟`, m);
        }

        // حفظ حالة اللعبة
        global.guessGame[chatId] = {
            answer: json.name.toLowerCase(),
            correctAnswer: json.name,
            image: json.img,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.guessGame && global.guessGame[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n🎎 الإجابة: ${json.name}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.guessGame[chatId];
                }
            }, timeout),
            attempts: 0
        };

        console.log(`🍁 بدأت لعبة احزر في ${chatId} - الشخصية: ${json.name}`);

    } catch (error) {
        console.error('🍁 خطأ في لعبة احزر:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m) => {
    try {
        if (m.isBaileys || !m.text || !global.guessGame) return;
        
        const chatId = m.chat;
        const userId = m.sender;
        
        let userAnswer = m.text.toLowerCase().trim();
        
        const game = global.guessGame[chatId];
        if (!game) return false;

        game.attempts++;

        // التحقق من الإجابة الصحيحة
        if (userAnswer === game.answer.toLowerCase()) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            // إضافة النقاط للمستخدم
            const pointsResult = await addUserPoints(userId, poin);
            
            let winMessage = `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🎉 إجـابـة صـحـيـحة!\n🏆 الـفـائـز: ${m.pushName || 'مستخدم'}\n🎎 الـشـخـصـيـة: ${game.correctAnswer}\n💰 الـنـقـاط: ${poin}\n⏱️ الـوقـت: ${timeTaken} ثانية\n📊 الـمـحـاولات: ${game.attempts}`;
            
            // إضافة معلومات البنك إذا نجحت العملية
            if (pointsResult.success) {
                winMessage += `\n💎 الـرصـيـد الـجـديـد: ${pointsResult.newExp} نقطة`;
                if (pointsResult.level > 1) {
                    winMessage += `\n⭐ الـمـسـتـوى: ${pointsResult.level}`;
                }
            }
            
            winMessage += `\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`;
            
            await conn.reply(m.chat, winMessage, m);
            delete global.guessGame[chatId];
            return true;
        }

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            await conn.reply(m.chat, 
                `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🚪 تـم الـإنـسـحـاب!\n🎎 الإجابة: ${game.correctAnswer}\n📊 المحاولات: ${game.attempts}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                m
            );
            delete global.guessGame[chatId];
            return true;
        }

        // تلميحات مبسطة
        let hintMessage = `❌ إجابة خاطئة!\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts === 2) {
            const firstLetter = game.correctAnswer.charAt(0);
            extraHint = `\n🍁 تلميح: الحرف الأول: ${firstLetter}`;
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

handler.help = ['احزر']
handler.tags = ['game']
handler.command = /^(احزر)$/i
handler.group = true

export default handler