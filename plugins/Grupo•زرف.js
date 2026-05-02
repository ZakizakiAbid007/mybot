const handler = async (m, { conn, participants, isBotAdmin, isOwner, command }) => {
    
    // 1. التحقق من صلاحيات البوت للطرد
    if (!isBotAdmin) {
        return conn.reply(
            m.chat,
            `🤖 *البوت ليس لديه صلاحيات كافية*\n\n> يجب أن أكون *مشرفاً* لتنفيذ هذا الإجراء.\n🔒 الحالة الحالية: *ليس مشرفاً*`,
            m
        );
    }

    // 2. تصفية المشاركين الذين سيتم طردهم
    const usersToKick = participants
        .map(p => p.id)
        .filter(id => {
            // استثناء البوت نفسه
            if (id === conn.user.jid) return false;
            
            // استثناء مالكي/مشرفي المجموعة والمنشئ
            const participant = participants.find(p => p.id === id);
            // يتم استثناء: المشرفين (admin)، المشرفين الخارقين (superadmin)، ومالك المجموعة.
            if (participant && (participant.admin || participant.isSuperAdmin || participant.isOwner)) {
                 return false;
            }
            
            return true; // إدراج الجميع ما عدا المستثنين أعلاه
        });

    if (usersToKick.length === 0) {
        return conn.reply(m.chat, `🚩 لا يوجد أعضاء يمكن طردهم. (فقط المشرفون والبوت ومنشئ المجموعة موجودون).`, m);
    }
    
    // 3. رسالة التأكيد والبدء
    await conn.reply(m.chat, `⚠️ *بدء عملية الطرد السريع! سيتم إزالة ${usersToKick.length} عضو الآن.*`, m);
    await new Promise(resolve => setTimeout(resolve, 3000)); // انتظار 3 ثوانٍ قبل البدء

    let successfulKicks = 0;
    
    // 4. تنفيذ الطرد بالتتابع السريع
    try {
        for (const user of usersToKick) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            successfulKicks++;
            // 🚀 التعديل للسماح بالطرد السريع: تقليل التأخير إلى 500 ملي ثانية (نصف ثانية)
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }

        await conn.reply(m.chat, `✅ *تمت عملية المسح بنجاح!* تم طرد ${successfulKicks} عضو في سرعة البرق.`, m);
    } catch (e) {
        console.error("Error during mass kick:", e);
        // ملاحظة: قد يحدث هذا الخطأ إذا تم حظر البوت مؤقتاً بسبب السرعة الكبيرة في الطرد.
        await conn.reply(m.chat, `❌ حدث خطأ أثناء محاولة الطرد الجماعي. تم طرد ${successfulKicks} عضو قبل الفشل. *قد تكون سرعة الطرد عالية جداً.*`, m);
    }
};

// تعريف الأوامر والصلاحيات (عربية فقط)
handler.command = ['هكرهم', 'مذكرة']; // الأوامر المطلوبة
handler.group = true;
handler.admin = true; // يتطلب أن يكون مرسل الأمر مشرفاً
handler.botAdmin = true;

export default handler;