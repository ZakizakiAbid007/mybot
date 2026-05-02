var handler = async (m, { conn }) => {

    // 1. التحقق من أن البوت مشرف (لأنه لا يمكن تجديد الرابط إلا إذا كان البوت مشرفاً)
    const groupMetadata = await conn.groupMetadata(m.chat);
    const botJid = conn.user.jid;
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const botIsAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

    if (!botIsAdmin) {
        return conn.reply(m.chat, '🤖 *البوت ليس لديه صلاحيات كافية*\n\n> يجب أن أكون *مشرفاً* لتنفيذ هذا الإجراء.', m);
    }
    
    // 2. إلغاء (تجديد) رابط الدعوة الحالي للمجموعة
    let res = await conn.groupRevokeInvite(m.chat);
    
    // 3. جلب الرابط الجديد
    let gruf = m.chat;
    const newLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(gruf);
    
    // 4. إرسال رسالة تأكيد وإرسال الرابط الجديد في الخاص (m.sender)
    conn.reply(m.chat, '✅ *تم تجديد الرابط بنجاح!* جاري إرسال الرابط الجديد في الخاص.', m);
    
    // 5. إرسال الرابط الجديد للمستخدم في خاصه (RCANAL/MCANAL تم استبدالها بـ m.chat لضمان وصول الرسالة)
    // ملاحظة: بما أن الكود الأصلي استخدم 'm.sender'، سنرسل الرابط في الخاص.
    conn.reply(m.sender, `🔗 *الرابط الجديد للمجموعة هو:*\n\n${newLink}`, m);

}
// تعريف الأوامر والصلاحيات (عربية)
handler.help = ['تجديد_رابط'];
handler.tags = ['مجموعة'];
handler.command = ['revoke', 'restablecer', 'تجديد_رابط', 'تغيير_الرابط'];

handler.group = true; // يعمل في المجموعات فقط
handler.admin = true; // يتطلب أن يكون مرسل الأمر مشرفاً
handler.botAdmin = true; // يتطلب أن يكون البوت مشرفاً

export default handler;