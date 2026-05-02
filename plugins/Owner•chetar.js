const handler = async (m, { conn }) => {
    // تحديد بيانات المستخدم الحالي (مرسل الأمر)
    const user = global.db.data.users[m.sender];
    
    // 1. إرسال رسالة التأكيد للمستخدم
    // ملاحظة: يستخدم fkontak كـ quoted (مقتبس) إذا كان معرفاً
    conn.sendMessage(m.chat, 
        {
            text: `🚩 *@${m.sender.split('@')[0]} لديك الآن موارد لا محدودة*`, 
            mentions: [m.sender] // توسيم المستخدم في الرسالة
        }, 
        {quoted: fkontak}
    );
    
    // 2. تعيين الموارد إلى قيمة لا نهائية (Infinity) في قاعدة البيانات
    global.db.data.users[m.sender].money = Infinity; // المال
    global.db.data.users[m.sender].cookies = Infinity; // الكوكيز (أو مورد آخر)
    global.db.data.users[m.sender].level = Infinity; // المستوى
    global.db.data.users[m.sender].exp = Infinity; // نقاط الخبرة (EXP)
};

// معلومات تعريف الأمر
handler.help = ['cheat', 'ilimitado']; // المساعدة
handler.tags = ['owner']; // الوسوم
// الأوامر التي يتم بها تفعيل الدالة
handler.command = ['لامحدود', 'غش', 'ilimitado', 'infiniy', 'chetar']; 
handler.rowner = true; // يتطلب أن يكون المستخدم مالكاً رئيسياً للبوت
handler.fail = null; // لا يوجد معالج للأخطاء
export default handler;