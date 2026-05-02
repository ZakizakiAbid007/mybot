const handler = async (m, {conn, isAdmin, groupMetadata, rcanal }) => {
    // 1. التحقق إذا كان المستخدم مشرفاً بالفعل
    if (isAdmin) return m.reply('✧ *أنت بالفعل مشرف.*');
    
    try {
        // 2. منح الإشراف للمستخدم (m.sender)
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
        
        // استخدام رمز الإيموجي المناسب بدلاً من متغير 'done' غير المعرَّف
        await m.react('✅')
        
        // 3. رسالة النجاح
        m.reply('✧ *تم منحك الإشراف.*');
        
        // 4. إرسال إشعار للمالك الرئيسي (الرقم المحدد في الكود الأصلي)
        let nn = conn.getName(m.sender);
        conn.reply('5493876432076@s.whatsapp.net', `🚩 *${nn}* قام بمنح نفسه الإشراف التلقائي في المجموعة:\n> ${groupMetadata.subject}.`, m, rcanal);
    } catch (e) {
        console.error(e);
        // 5. رسالة الخطأ
        m.reply('✦ حدث خطأ ما. (تأكد من أن البوت مشرف ولديه الصلاحيات الكافية).');
    }
};

handler.tags = ['المالك'];
handler.help = ['اشراف_تلقائي'];
handler.command = ['autoadmin', 'ارفعني', 'ادمن_نفسي']; // إضافة الأوامر العربية

handler.rowner = true; // حصرياً لمالك البوت الرئيسي
handler.group = true; // يجب أن يعمل في المجموعات فقط
handler.botAdmin = true; // يجب أن يكون البوت مشرفاً لتنفيذ الأمر

export default handler;