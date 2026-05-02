// الكود للملك تنغن 👑 - أمر البث المُقَيَّد (Controlled BC)

import { randomBytes } from 'crypto';

// المتغير العام لتخزين هوية البوت الذي يقوم بالبث حاليًا
global.broadcastingBot = global.broadcastingBot || null;

const handler = async (m, { conn, command, participants, text }) => {
    if (!text) return conn.reply(m.chat, '🚩 *أمر ملكي!* يجب أن تحدد نص المرسوم الذي تود بثه لكافة الدردشات.', m);

    // 1. آلية القفل (Locking Mechanism)
    // إذا لم يكن هناك بوت يقوم بالبث، قم بتعيين هذا البوت ليكون هو المرسل.
    if (!global.broadcastingBot) {
        global.broadcastingBot = conn.user.jid;
        await conn.reply(m.chat, '✅ *القفل الملكي نُفِّذ!* هذا البوت الفرعي هو الوحيد المخول لإرسال البث الآن.', m);
    }

    // إذا كان هناك بوت آخر يقوم بالبث، امنع هذا البوت من الإرسال.
    if (global.broadcastingBot !== conn.user.jid) {
        return conn.reply(m.chat, '⚠️ *تنبيه:* بوت فرعي آخر يقوم حالياً بتنفيذ أمر البث. انتظر حتى ينتهي.', m);
    }

    const teks4 = text;
    // تم حذف فكونتاك هنا لأنه لم يُستخدم فعليًا في الكود الأصلي

    const groups2 = Object.keys(await conn.groupFetchAllParticipating());
    const chats2 = Object.keys(global.db.data.users).filter(user => user.endsWith('@s.whatsapp.net'));

    await conn.reply(m.chat, '🧋✨ *بدء تنفيذ المرسوم الملكي وإرساله لكافة الدردشات...*', m);

    const start2 = new Date().getTime();
    const usersTag2 = participants.map(u => conn.decodeJid(u.id));
    let totalPri2 = 0;

    // 2. إرسال إلى المجموعات (مع تأخير لمنع الحظر)
    for (let i = 0; i < groups2.length; i++) {
        const group = groups2[i];
        const delayTime = i * 4000; // 4 ثواني
        setTimeout(async () => {
            await conn.reply(group, teks4, { mentions: usersTag2 }, { quoted: null });
        }, delayTime);
    }

    // 3. إرسال إلى الدردشات الخاصة (مع تأخير)
    for (const user of chats2) {
        await delayMs(2000); // 2 ثواني
        await conn.reply(user, teks4, null, null);
        totalPri2++;
        if (totalPri2 >= 500000) break; // حد أقصى للحماية
    }

    // 4. تلخيص النتائج وتحرير القفل
    const end2 = new Date().getTime();
    const totalPrivate2 = chats2.length;
    const totalGroups2 = groups2.length;
    const total2 = totalPrivate2 + totalGroups2;

    let time2 = Math.floor((end2 - start2) / 1000);
    
    // تحويل الوقت
    if (time2 >= 60) {
        const minutes = Math.floor(time2 / 60);
        const seconds = time2 % 60;
        time2 = `${minutes} دقيقة و ${seconds} ثانية`;
    } else {
        time2 = `${time2} ثانية`;
    }

    await m.reply(`*⚔️ تقرير البث المُقَيَّد نُفِّذ!*
    *⭐️ الرسالة أُرسلت إلى:*
    *🍟 دردشات خاصة:* ${totalPrivate2}
    *⚜️ مجموعات:* ${totalGroups2}
    *🚩 الإجمالي:* ${total2} دردشة

    *⏱️ إجمالي وقت الإرسال:* ${time2}`);

    // تحرير القفل لتمكين البوتات الأخرى من الإرسال لاحقاً
    global.broadcastingBot = null;
};

handler.help = ['بث_متحكم'];
handler.tags = ['ملك'];
handler.command = ['اتباعي_نشر', 'ارسال_للفروع', 'بث_متحكم'];
handler.owner = true;

export default handler;

const delayMs = ms => new Promise(resolve => setTimeout(resolve, ms));
const randomID = length => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length);