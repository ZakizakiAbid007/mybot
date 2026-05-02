import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, text }) => {
    // 1. التحقق من الرد على رسالة
    if (!m.quoted) return m.reply('*⚠ الرد على ملصق لإعادة تسميته!*');
    let stiker = false;

    try {
        await m.react('⏳'); // تفاعل "قيد المعالجة"

        // 2. استخراج اسم الحزمة والمؤلف من النص
        // يتم فصل النص بواسطة الفاصل '|'
        let [packname, ...authorParts] = text.split('|');
        let author = authorParts.join('|') || '';
        
        // إذا لم يتم تحديد اسم حزمة، يتم استخدام سلسلة فارغة.
        packname = packname || ''; 

        // 3. التحقق من نوع الرسالة المقتبس عليها
        let mime = m.quoted.mimetype || '';
        if (!/webp/.test(mime)) return m.reply('⚠️ *يجب أن ترد على ملصق (صيغة webp)*');

        // 4. تنزيل الملصق
        const img = await m.quoted.download();
        if (!img) return m.reply('⚠ *تعذر تنزيل الملصق!*');

        // 5. إضافة/تعديل بيانات EXIF باستخدام الدالة addExif
        stiker = await addExif(img, packname, author);

        // 6. إرسال الملصق الجديد
        if (stiker) {
            await conn.sendMessage(
                m.chat,
                {
                    sticker: stiker,
                    // إضافة contextInfo للتزيين
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: false,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: `𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗 ☘︎`,
                            body: `✡︎ Sticker By • The Carlos`,
                            sourceUrl: global.redes || '', // رابط القنوات
                            thumbnail: global.icons || null // أيقونة البوت
                        }
                    }
                },
                { quoted: m }
            );
            await m.react('✅'); // تفاعل "نجاح"
        } else {
            throw new Error('⚠️ *فشلت عملية التعديل.*');
        }
    } catch (e) {
        console.error(e);
        await m.react('❌'); // تفاعل "فشل"
        m.reply(e.message || e);
    }
};

handler.help = ['خذ <اسم الحزمة>|<المؤلف>'];
handler.tags = ['ملصقات'];
handler.command = ['take', 'robar', 'wm', 'خذ', 'حقوقي', 'حقوق'];

export default handler;