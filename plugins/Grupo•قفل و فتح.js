let handler = async (m, { conn, command }) => {
    try {
        let accion;
        let رسالة_النجاح;

        // 1. تحديد الإجراء بناءً على الأمر المُستخدم
        if (command === 'فتح') {
            accion = 'not_announcement';
            رسالة_النجاح = '🔓 *تم فتح المجموعة بنجاح.*\n\nيمكن لجميع الأعضاء إرسال الرسائل الآن.';
        } else if (command === 'قفل') {
            accion = 'announcement';
            رسالة_النجاح = '🔐 *تم إغلاق المجموعة بنجاح.*\n\nيمكن للمشرفين فقط إرسال الرسائل الآن.';
        } else {
            // لن يتم الوصول إلى هذا الجزء عادةً
            return;
        }

        // 2. تنفيذ التغيير في إعدادات المجموعة
        await conn.groupSettingUpdate(m.chat, accion);

        // 3. إرسال رسالة التأكيد
        m.reply(رسالة_النجاح);

    } catch (err) {
        console.error('خطأ في تحديث إعدادات المجموعة:', err);
        m.reply('❌ *حدث خطأ أثناء محاولة تحديث إعدادات المجموعة.*');
    }
}

// إعدادات المعالج
handler.help = ['فتح', 'قفل']
handler.tags = ['مجموعة']
// تم حصر الأوامر على 'فتح' و 'قفل' فقط
handler.command = ['فتح', 'قفل'] 
handler.admin = true      // يتطلب أن يكون مرسل الأمر مشرفًا
handler.botAdmin = true   // يتطلب أن يكون البوت مشرفًا

export default handler