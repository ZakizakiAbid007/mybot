let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. رسائل التحذير والانتظار الملكية
    const rwait = '⏳';
    const done = '✅';
    const error = '❌';
    const emoji = '🚩'; // رمز التنبيه

    // 2. التحقق من الرد على رسالة
    if (!m.quoted) {
        // رسالة إذا لم يتم الرد على أي شيء
        await conn.sendMessage(m.chat, { text: `${emoji} سيدي الملك، يرجى الرد على *فيديو* لتحويله إلى GIF مع الصوت.` }, { quoted: m });
        return;
    }

    const q = m.quoted;
    const mime = (q.msg || q).mimetype || '';
    
    // 3. التحقق من نوع الملف (يجب أن يكون فيديو mp4)
    if (!/(mp4)/.test(mime)) {
        // رسالة إذا تم الرد على ملف غير فيديو
        await conn.sendMessage(m.chat, { text: `${emoji} هذا الأمر مخصص لـ *الفيديوهات* فقط، يرجى الرد على فيديو.` }, { quoted: m });
        return;
    }

    // 4. رد فعل الانتظار
    if (typeof m.react === 'function') await m.react(rwait);

    try {
        // 5. تنزيل الفيديو
        const media = await q.download();
        
        // 6. النص المصاحب لملف GIF
        const caption = '*✨ تـم تـحـويـل الـفـيـديـو إلـى GIF مـع صـوتـه، كـمـا أمـرتـم يـا مـلـكـنـا!* 🐢';

        // 7. إرسال الفيديو كصيغة GIF (مع تفعيل التشغيل كـ GIF)
        await conn.sendMessage(m.chat, {
            video: media,
            gifPlayback: true, // هذا هو المفتاح لتحويله إلى GIF متحرك
            caption: caption,
            mimetype: 'video/mp4' // النوع يبقى mp4 لضمان الاحتفاظ بالصوت
        }, { quoted: m });

        // 8. رد فعل الإنجاز
        if (typeof m.react === 'function') await m.react(done);

    } catch (e) {
        console.error(e);
        // 9. رد فعل الخطأ
        if (typeof m.react === 'function') await m.react(error);
        conn.reply(m.chat, `${error} حدث خطأ غير متوقع أثناء تحويل الفيديو. حاول مجدداً سيدي الملك.`, m);
    }
};

// 10. تحديد الخصائص
handler.help = ['gif', 'لجيف'];
handler.tags = ['تحويل'];
handler.command = ['gif', 'لجيف'];

export default handler;