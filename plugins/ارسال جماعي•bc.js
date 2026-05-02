// الكود للملك تنغن 👑 - أمر البث الملكي العام (Broadcast)

import {randomBytes} from 'crypto';

const handler = async (m, {conn, command, participants, usedPrefix, text}) => {
    // التحقق من إدخال النص
    if (!text) return conn.reply(m.chat, '🚩 *أمر ملكي!* أدخل النص الذي تود بثه لكافة الدردشات.', m);
    
    // تعريفات ضرورية
    // تم حذف fkontak لتبسيط الكود وتجنب الاعتماد على متغيرات غير معرفة
    
    const cc4 = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
    const teks4 = text ? text : cc4.text;
    
    // جلب قائمة المجموعات والدردشات الخاصة
    const groups2 = Object.keys(await conn.groupFetchAllParticipating());
    // جلب الدردشات الخاصة من قاعدة البيانات
    const chats2 = Object.keys(global.db.data.users).filter((user) => user.endsWith('@s.whatsapp.net'));
    
    // رسالة البدء
    await conn.reply(m.chat, '🧋✨️ *بدء البث الملكي... سيتم إرسال رسالتك لكافة الدردشات فوراً.*', m, global.fake);
    
    const start2 = new Date().getTime();
    const usersTag2 = participants.map((u) => conn.decodeJid(u.id));
    let totalPri2 = 0;
    
    // 1. إرسال إلى المجموعات (مع تأخير لمنع الحظر)
    for (let i = 0; i < groups2.length; i++) {
        const group = groups2[i];
        const delayTime = i * 4000; // تأخير 4 ثواني بين كل مجموعة
        setTimeout(async () => {
            // الإرسال في المجموعات يتم بدون اقتباس للحفاظ على نظافة الرسالة
            await conn.reply(group, teks4, {mentions: usersTag2}, {quoted: null}); 
        }, delayTime);
    }
    
    // 2. إرسال إلى الدردشات الخاصة (مع تأخير)
    for (const user of chats2) {
        // يتم تخفيف السرعة هنا أيضاً
        await new Promise((resolve) => setTimeout(resolve, 2000)); // تأخير 2 ثانية بين كل محادثة خاصة
        await conn.reply(user, teks4, null, null);
        totalPri2++;
        // تحديد حد أقصى للدردشات الخاصة لمنع الحظر الشديد
        if (totalPri2 >= 500000) { 
            break;
        }
    }
    
    // 3. حساب وتلخيص النتائج
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
    
    // رسالة التلخيص الملكية
    await m.reply(`*⚔️ تقرير البث الملكي نُفِّذ!*
    
*⭐️ الرسالة أُرسلت إلى:*
    *🍟 دردشات خاصة:* ${totalPrivate2}
    *⚜️ مجموعات:* ${totalGroups2}
    *🚩 الإجمالي:* ${total2} دردشة

    *⏱️ إجمالي وقت الإرسال:* ${time2}
    
    ${totalPri2 >= 500000 ? `\n*ملاحظة: تم إيقاف الإرسال في الدردشات الخاصة عند ${totalPri2} للحماية من الحظر القاسي.*` : ''}`);
};

handler.help = ['بث', 'تعميم'];
handler.tags = ['ملك'];
handler.command = ['نشر', 'ارسال', 'بث', 'بث'];

handler.owner = true; // يتمتع به المالك فقط

export default handler;

// دوال مساعدة لم يتم استخدامها في الكود المُعدّل، لكن تم إبقاؤها لتكون شاملة
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const randomID = (length) => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length);