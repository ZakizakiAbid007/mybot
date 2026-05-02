let handler = async (m, { conn, command }) => {
    // التحقق مما إذا كان الأمر قد جاء كرد (اقتباس) على رسالة
    if (!m.quoted) {
        return conn.reply(m.chat, `❀ *الرجاء الرد (اقتباس) على الرسالة التي تريد حذفها.*`, m)
    }

    try {
        // محاولة استخلاص بيانات الرسالة المقتبسة لحذفها
        // هذه الطريقة تستخدم لحذف رسائل الآخرين كـ "مشرف"
        
        let participant = m.message.extendedTextMessage.contextInfo.participant
        let stanzaId = m.message.extendedTextMessage.contextInfo.stanzaId
        
        return conn.sendMessage(m.chat, {
            delete: { 
                remoteJid: m.chat,  // معرف الدردشة (المجموعة)
                fromMe: false,      // الرسالة ليست مرسلة من البوت
                id: stanzaId,       // معرف الرسالة
                participant: participant // مرسل الرسالة الأصلية
            }
        })
    } catch {
        // إذا فشلت محاولة الحذف كـ "مشرف" (بسبب خطأ في الوصول للبيانات أو غيره)، 
        // سيحاول حذف الرسالة كرسالة خاصة بالبوت (إذا كان البوت هو الذي أرسلها).
        return conn.sendMessage(m.chat, { delete: m.quoted.key })
    }
}

// تعريف معلومات الأمر والصلاحيات
handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del', 'delete', 'حذف', 'مسح'] // إضافة أوامر عربية
handler.group = true      // يعمل في المجموعات فقط
handler.admin = true      // يتطلب أن يكون مرسل الأمر مشرفاً
handler.botAdmin = true   // يتطلب أن يكون البوت مشرفاً في المجموعة (للحذف)

export default handler