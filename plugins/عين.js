import fetch from 'node-fetch';

let timeout = 60000;
let poin = 800;

if (!global.eyeGame) {
    global.eyeGame = {};
}

/**
 * ⚠️ ملاحظة هامة: دالة إضافة النقاط تحتاج إلى دمجها مع نظام النقاط الخاص ببوتك!
 * * في الوقت الحالي، هذه الدالة لن تعمل لأنها تعتمد على ملفات (getUserData, updateUserData)
 * غير محددة أو غير مستوردة بشكل صحيح في بيئة ES Module.
 * * يجب استبدالها بدوال البنك أو النقاط العالمية (global.db.data.users) في مشروعك.
 * تم إزالة استخدام require المؤقت.
 */
async function addUserPoints(userId, points) {
    try {
        // 🚨 يجب استبدال هذا المنطق بمنطق تحديث قاعدة البيانات الخاص بك (global.db.data.users[userId].exp += points)
        if (global.db && global.db.data.users[userId]) {
            global.db.data.users[userId].exp = (global.db.data.users[userId].exp || 0) + points;
            // يمكن إضافة منطق آخر هنا (مثل wins)
            return {
                success: true,
                newExp: global.db.data.users[userId].exp,
                pointsAdded: points,
                level: Math.floor(global.db.data.users[userId].exp / 1000) + 1
            };
        }
        return { success: false, reason: 'DB not available or user not found' };
    } catch (error) {
        console.error('🍁 خطأ في إضافة النقاط:', error);
        return { success: false };
    }
}


// دالة جلب بيانات شخصيات الأنمي
async function fetchEyeGameData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Raedxx1/-/main/Src/%D8%B9%D9%8A%D9%86.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🍁 تم جلب بيانات لعبة الأنمي بنجاح');
        return data;
    } catch (error) {
        console.error('🍁 خطأ في جلب بيانات الأنمي:', error);
        return [];
    }
}


// ----------------------------------------------------
// معالج بدء اللعبة
// ----------------------------------------------------
let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        // التأكد من أن اللعبة تعمل في المجموعات فقط، أو يمكنك إزالة هذا السطر إذا كنت تريدها في الخاص أيضاً
        if (!m.isGroup) return conn.reply(m.chat, '🍁 هذه اللعبة تعمل فقط في المجموعات.', m); 

        if (global.eyeGame && global.eyeGame[chatId]) {
            await conn.reply(m.chat, `🍁 لا يزال هناك سؤال أنمي نشط! ⏳\n🍁 للإلغاء: ${usedPrefix}حذف_اللعبة`, m);
            return;
        }

        let eyeGameCharacters = await fetchEyeGameData();
        
        if (eyeGameCharacters.length < 5) {
             console.warn('⚠️ بيانات الأنمي غير كافية، استخدام البيانات الافتراضية.');
             eyeGameCharacters = [
                { name: "غوكو", img: "https://i.imgur.com/gWlXo9g.jpeg" },
                { name: "ساسكي", img: "https://i.imgur.com/k9vY7yB.jpeg" },
                { name: "لايت ياغامي", img: "https://i.imgur.com/z4Lg2fF.jpeg" },
                { name: "لولوش", img: "https://i.imgur.com/qM6Xf9e.jpeg" },
                { name: "ليفاي", img: "https://i.imgur.com/Hl5xYgP.jpeg" },
                { name: "زورو", img: "https://i.imgur.com/y8v8F1e.jpeg" },
            ];
        }
        
        let json = eyeGameCharacters[Math.floor(Math.random() * eyeGameCharacters.length)];

        // رسالة العنوان (Caption)
        let caption = `
🍁 ━━━━━━━━━━━━━━━ 🍁
🎯 لـعـبـة عـيـن الأنـمـي (إصـدار النص)

💰 الـنـقـاط: ${poin} نقطة
⏰ الـوقـت: ${(timeout / 1000)} ثانية

🍁 أرسل اسم الشخصية مباشرة في الدردشة!
🍁 ━━━━━━━━━━━━━━━ 🍁
`.trim();

        // إرسال الرسالة التفاعلية مع الصورة
        await conn.sendFile(chatId, json.img, 'eye.jpg', caption, m); 

        // حفظ حالة اللعبة
        global.eyeGame[chatId] = {
            answer: json.name.toLowerCase().trim(),
            correctAnswer: json.name,
            image: json.img,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.eyeGame && global.eyeGame[chatId]) {
                    await conn.reply(m.chat, 
                        `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n⏰ انـتـهـى الـوقـت!\n🎯 الإجابة: ${json.name}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                        m
                    );
                    delete global.eyeGame[chatId];
                }
            }, timeout),
            attempts: 0
        };

    } catch (error) {
        console.error('🍁 خطأ في لعبة عين الأنمي:', error);
        await conn.reply(m.chat, '🍁 حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// ----------------------------------------------------
// معالج الإجابات: يستقبل الإجابات كنص
// ----------------------------------------------------
handler.before = async (m) => {
    try {
        // لا تستجب للرسائل التي ليست من البوت نفسه (لعبة) أو لا توجد لعبة نشطة
        if (!m.isBaileys || !global.eyeGame) return;
        
        const chatId = m.chat;
        const userId = m.sender;
        const game = global.eyeGame[chatId];
        
        if (!game) return false;

        // لا تعالج الرسائل التي ليست نصاً عادياً أو أمر بدء اللعبة
        if (!m.text || m.text.startsWith(handler.command)) return false; 
        
        // مقارنة الإجابة المدخلة بالإجابة الصحيحة
        const userAnswer = m.text.toLowerCase().trim();

        if (userAnswer === game.answer) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            const pointsResult = await addUserPoints(userId, poin);
            
            let winMessage = `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n🎉 إجـابـة صـحـيـحة!\n🏆 الـفـائـز: ${m.pushName || 'مستخدم'}\n🎯 الـشـخـصـيـة: ${game.correctAnswer}\n💰 الـنـقـاط: ${poin}`;
            
            if (pointsResult.success) {
                winMessage += `\n💎 الـرصـيـد الـجـديـد: ${pointsResult.newExp} نقطة`;
                // يمكن استخدام منطق المستوى هنا
            }
            
            winMessage += `\n⏱️ الـوقـت: ${timeTaken} ثانية\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`;
            
            await conn.reply(m.chat, winMessage, m);
            delete global.eyeGame[chatId];
            return true;
        }
        
        // إذا لم تكن الإجابة صحيحة، ارسل تلميحاً (تم تحسين التلميح)
        if (m.text.toLowerCase().trim() !== game.answer) {
            game.attempts++;
            
            let hintMessage = `❌ إجابة خاطئة! حاول مرة أخرى`;
            
            let extraHint = '';
            // تلميح بعد محاولتين
            if (game.attempts >= 2) {
                const firstLetter = game.correctAnswer.charAt(0);
                // إخفاء باقي الاسم
                const hiddenName = firstLetter + '...'.repeat(game.correctAnswer.length - 1);
                extraHint = `\n💡 تلميح: ${hiddenName} (طول الاسم: ${game.correctAnswer.length} أحرف)`;
            }

            await conn.reply(m.chat, 
                `🍁 ━━━━━━━━━━━━━━━ 🍁\n\n${hintMessage}${extraHint}\n\n🍁 ━━━━━━━━━━━━━━━ 🍁`, 
                m
            );
        }

        return true;

    } catch (error) {
        console.error('🍁 خطأ في معالجة إجابة الأنمي:', error);
        return false;
    }
}

handler.help = ['عين']
handler.tags = ['game']
handler.command = /^(عين)$/i
handler.group = true // اللعبة مخصصة للمجموعات

export default handler