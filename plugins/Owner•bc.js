// الكود مُعدّل ومُترجم بواسطة Gemini - Google

import {randomBytes} from 'crypto';

const handler = async (m, {conn, command, participants, usedPrefix, text}) => {
    // 🚩 التحقق من وجود نص للرسالة
    if (!text) return `🚩 *الرجاء إدخال النص الذي تريد بثه لجميع المحادثات.*\n\n*مثال:* \`${usedPrefix + command} مرحباً بكم في رسالة البث الجماعي.\``;
    
    // إنشاء كونتكت مزيف (fkontak) للرد (لأغراض العرض فقط)
    const fkontak = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${conn.user.jid.split('@')[0]}:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
    
    const cc4 = text ? m : m.quoted ? await m.getQuotedObj() : false || m;
    const teks4 = text ? text : cc4.text; // النص المراد بثه
    
    // جلب قائمة المجموعات التي يتواجد بها البوت
    const groups2 = Object.keys(await conn.groupFetchAllParticipating());
    // جلب قائمة المستخدمين في الخاص (من قاعدة البيانات)
    const chats2 = Object.keys(global.db.data.users).filter((user) => user.endsWith('@s.whatsapp.net'));
    
    // إشعار البدء
    await conn.reply(m.chat, '⭐️ *جارٍ إرسال رسالة البث لجميع المحادثات... قد يستغرق هذا بعض الوقت.*', m, fake); // fake يجب أن يكون معرَّفاً
    
    const start2 = new Date().getTime();
    const usersTag2 = participants.map((u) => conn.decodeJid(u.id)); // لتضمين منشن الأعضاء في المجموعات (اختياري)
    let totalPri2 = 0;
    
    // 🚀 1. إرسال إلى المجموعات
    for (let i = 0; i < groups2.length; i++) {
        const group = groups2[i];
        const delay = i * 4000; // تأخير 4 ثوانٍ بين كل مجموعة لتجنب الحظر
        
        setTimeout(async () => {
            await conn.reply(group, `⭐️ إعــــــــلان ⭐️\n\n` + teks4, {mentions: usersTag2}, {quoted: fkontak});
        }, delay);
    }
    
    // 🚀 2. إرسال إلى المحادثات الخاصة
    for (const user of chats2) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // تأخير 2 ثانية بين كل خاص
        
        // إرسال الرسالة
        await conn.reply(user, `⭐️ إعــــــــلان ⭐️\n\n` + teks4, fkontak, null);
        
        totalPri2++;
        // حد أقصى للرسائل الخاصة (500000 رسالة، يمكن تقليله)
        if (totalPri2 >= 500000) {
            break;
        }
    }
    
    // حساب الإحصائيات ووقت الإرسال
    const end2 = new Date().getTime();
    const totalPrivate2 = chats2.length;
    const totalGroups2 = groups2.length;
    const total2 = totalPrivate2 + totalGroups2;
    let time2 = Math.floor((end2 - start2) / 1000); // الوقت بالثواني
    
    // تحويل الوقت إلى دقائق وثواني
    if (time2 >= 60) {
        const minutes = Math.floor(time2 / 60);
        const seconds = time2 % 60;
        time2 = `${minutes} دقائق و ${seconds} ثواني`;
    } else {
        time2 = `${time2} ثواني`;
    }
    
    // 5. إرسال تقرير الإرسال
    await m.reply(`⭐️ *تم إرسال الرسالة إلى:*\n` +
                 `🍟 *المحادثات الخاصة:* ${totalPrivate2}\n` +
                 `⚜️ *المجموعات:* ${totalGroups2}\n` +
                 `🚩 *الإجمالي:* ${total2}\n\n` +
                 `⏱️ *إجمالي وقت الإرسال:* ${time2}\n` +
                 `${totalPri2 >= 500000 ? `\n${packname}` : ''}`); // packname يجب أن يكون معرَّفاً
};

handler.help = ['بث_جماعي', 'إعلان'];
handler.tags = ['المالك'];
handler.command = ['bc', 'comunicado', 'بث', 'بث_جماعي', 'إعلان_عام']; // إضافة الأوامر العربية

handler.owner = true; // حصرياً لمالك البوت

export default handler;

// دوال مساعدة (لم يتم تعريبها لأنها داخلية)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const randomID = (length) => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length);