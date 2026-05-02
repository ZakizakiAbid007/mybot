const handler = async (m, { conn, text }) => {
    // 1. التحقق من وجود نص
    if (!text) {
        // إذا لم يتم إرسال نص الوصف
        return conn.reply(m.chat, '🚩 *أدخل النص الجديد للوصف يا مالكي!*', m, rcanal);
    }
    
    // 2. محاولة تحديث الوصف الشخصي
    try {
        // استخدام دالة تحديث الحالة (Profile Status) من مكتبة Baileys
        await conn.updateProfileStatus(text).catch(_ => _);
        
        // رسالة التأكيد
        conn.reply(m.chat, `✅️ تم تغيير وصف البوت بنجاح!`, m, rcanal);
    } catch (e) {
        // في حال حدوث خطأ
        console.error(e); // طباعة الخطأ في السجل (Log)
        throw 'حدث خطأ أثناء محاولة تغيير الوصف...';
    }
}

// معلومات تعريف الأمر
handler.help = ['setbio <نص>']; // المساعدة
handler.tags = ['owner', 'تعديل']; // الوسوم
// الأوامر التي يتم بها تفعيل الدالة
handler.command = ['setbio', 'تغيير_الوصف', 'وضع_الوصف']; 
handler.owner = true; // يتطلب أن يكون المستخدم مالكاً للبوت

export default handler;