const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user;
    let db = global.db.data.users; // قاعدة بيانات المستخدمين
    
    // 1. تحديد المستخدم المراد فك حظره
    if (m.quoted) {
        // إذا كان هناك اقتباس لرسالة
        user = m.quoted.sender;
    } else if (args.length >= 1) {
        // إذا تم إرسال العلامة (@tag) أو الرقم كـ (argument)
        user = args[0].replace('@', '') + '@s.whatsapp.net';
    } else {
        // إذا لم يتم تحديد المستخدم، يطلب التوسيم
        await conn.reply(m.chat, `🚩 قم بتوسيم (Tag) أو الرد على رسالة المستخدم الذي تريد فك حظره، مثال:\n> → *${usedPrefix}unbanuser <@tag>*`, m);
        return;
    }
    
    // 2. فحص حالة المستخدم في قاعدة البيانات
    if (db[user]) {
        // إذا كان المستخدم مسجلاً
        db[user].banned = false; // فك الحظر
        db[user].banRazon = ''; // مسح سبب الحظر (إذا وُجد)
        
        // جلب أسماء المستخدمين
        const nametag = await conn.getName(user);
        const nn = conn.getName(m.sender);
        
        // إرسال رسالة التأكيد في المجموعة/المحادثة
        await conn.reply(m.chat, `✅️ تم فك حظر المستخدم *${nametag}* بنجاح.`, m, { mentionedJid: [user] });
        
        // إرسال إشعار للمطور (إلى رقمك الشخصي)
        // ملاحظة: تم تعديل conn.reply... ليتناسب مع قناتك ورقمك المخزن
        conn.reply('212627416260@s.whatsapp.net', `🚩 المستخدم *${nametag}* قد تم فك حظره بواسطة المطور *${nn}*`, m, rcanal);
        
    } else {
        // إذا لم يكن المستخدم مسجلاً
        await conn.reply(m.chat, `🚩 هذا المستخدم غير مسجل في قاعدة البيانات.`, m);
    }
};

// معلومات تعريف الأمر
handler.help = ['unbanuser <@tag>']; // مساعدة الأمر
handler.command = ['unbanuser', 'فك_حظر']; // الأوامر التي يتم بها تفعيل الدالة
handler.tags = ['owner', 'إدارة']; // الوسوم
handler.rowner = true; // يتطلب أن يكون المستخدم مالكاً رئيسياً للبوت
handler.group = true; // يعمل في المجموعات
export default handler;