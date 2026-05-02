import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const timeout = 60000; // 60 ثانية

let handler = async (m, { conn, command }) => {
    // --- 1. جزء معالجة الإجابة (مجوب_X) ---
    if (command.startsWith('مجوب_')) {
        let id = m.chat;
        let MONTE = conn.MONTE[id]; 

        if (!MONTE) {
            // رسالة مختصرة لعدم وجود لعبة
            return conn.reply(m.chat, '*👑 لا توجد جولة نشطة. ابدأ بـ `.عين`.*', m);
        }

        let selectedAnswerIndex = parseInt(command.split('_')[1]);
        // التحقق من صلاحية الاختيار
        if (isNaN(selectedAnswerIndex) || selectedAnswerIndex < 1 || selectedAnswerIndex > 4) {
            // رسالة مختصرة للخطأ
            return conn.reply(m.chat, '*❌ اختيار غير صالح! اختر بين (1-4).*', m);
        }

        let selectedAnswer = MONTE.options[selectedAnswerIndex - 1];
        let isCorrect = MONTE.correctAnswer === selectedAnswer;

        if (isCorrect) {
            // رسالة الإجابة الصحيحة (مختصرة وفخمة)
            await conn.reply(m.chat, `*👑 مبروك يا ملك! إجابة صحيحة! ✅*\n*💰 الجائزة: 500xp*`, m);
            global.db.data.users[m.sender].exp += 500;
            clearTimeout(MONTE.timer);
            delete conn.MONTE[id];
        } else {
            // الإجابة الخاطئة
            MONTE.attempts -= 1;
            if (MONTE.attempts > 0) {
                // رسالة الإجابة الخاطئة مع المحاولات المتبقية (مختصرة)
                await conn.reply(m.chat, `*❌ إجابة خاطئة! المحاولات الباقية: ${MONTE.attempts} 🛠️*`, m);
            } else {
                // رسالة انتهاء المحاولات (مختصرة)
                await conn.reply(m.chat, `*💔 انتهت محاولاتك!* 📍\n*💡 الإجابة الصحيحة: ${MONTE.correctAnswer}*`, m);
                clearTimeout(MONTE.timer);
                delete conn.MONTE[id];
            }
        }
    } 
    // --- 2. جزء بدء اللعبة (عين/عيون) ---
    else {
        try {
            conn.MONTE = conn.MONTE || {};
            let id = m.chat;

            // منع بدء لعبة جديدة
            if (conn.MONTE[id]) {
                // رسالة منع اللعبة الجديدة (مختصرة)
                return conn.reply(m.chat, '*❌ جولة نشطة بالفعل. لا يمكن البدء!*', m);
            }

            // جلب البيانات من المصدر
            const response = await fetch('https://raw.githubusercontent.com/DK3MK/worker-bot/main/eye.json');
            const MONTEData = await response.json();

            if (!MONTEData || MONTEData.length === 0) {
                // رسالة خطأ المصدر (مختصرة)
                throw new Error('*❌ فشل جلب بيانات اللعبة. المصدر فارغ.*');
            }

            const MONTEItem = MONTEData[Math.floor(Math.random() * MONTEData.length)];
            const { img, name } = MONTEItem;

            // إعداد الخيارات الأربعة
            let options = [name];
            while (options.length < 4) {
                let randomItem = MONTEData[Math.floor(Math.random() * MONTEData.length)].name;
                if (!options.includes(randomItem)) {
                    options.push(randomItem);
                }
            }
            options.sort(() => Math.random() - 0.5);

            // تحضير الرسالة التفاعلية
            const media = await prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer });

            const interactiveMessage = {
                body: {
                    // رسالة مختصرة ومباشرة للبدء
                    text: `*👑 لعبة عيون الأنمي 👁️*\n\n*⏱️ 60 ثانية | 💰 500xp | ⚔️ 2 محاولة*\n*═════ • 🏆 • ═════*`, 
                },
                footer: { text: 'BY : KING TENGAN 👑' }, 
                header: {
                    title: 'ㅤ',
                    // رسالة مختصرة موجهة للفعل
                    subtitle: 'اختر اسم الشخصية الصحيح من الخيارات ⇊', 
                    hasMediaAttachment: true,
                    imageMessage: media.imageMessage,
                },
                nativeFlowMessage: {
                    buttons: options.map((option, index) => ({
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: `┊${index + 1}┊ ${option}`, // تبسيط نص الزر
                            id: `.مجوب_${index + 1}`
                        })
                    })),
                },
            };

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: { interactiveMessage },
                },
            }, { userJid: conn.user.jid, quoted: m });

            conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

            conn.MONTE[id] = {
                correctAnswer: name,
                options: options,
                timer: setTimeout(async () => {
                    if (conn.MONTE[id]) {
                        // رسالة انتهاء الوقت (مختصرة)
                        await conn.reply(m.chat, `*⌛ انتهى الوقت!* 📍\n*💡 الإجابة الصحيحة: ${name}*`, m);
                        delete conn.MONTE[id];
                    }
                }, timeout),
                attempts: 2
            };

        } catch (e) {
            console.error(e);
            conn.reply(m.chat, '*❌ حدث خطأ أثناء بدء اللعبة. المصدر قد يكون معطلاً.*', m);
        }
    }
};

handler.help = ['عين', 'عيون'];
handler.tags = ['ألعاب', 'تفاعل'];
handler.command = /^(عين|عيون|مجوب_\d+)$/i;

export default handler;