const handler = async (m, { conn, text }) => {
    const numberPattern = /\d+/g;
    let user = '';
    const numberMatches = text.match(numberPattern);
    
    // محاولة استخراج الرقم من نص الرسالة (إذا كان مكتوباً)
    if (numberMatches) {
        const number = numberMatches.join('');
        user = number + '@s.whatsapp.net';
    
    // محاولة استخراج الرقم من رسالة مقتبسة (Quote)
    } else if (m.quoted && m.quoted.sender) {
        const quotedNumberMatches = m.quoted.sender.match(numberPattern);
        if (quotedNumberMatches) {
            const number = quotedNumberMatches.join('');
            user = number + '@s.whatsapp.net';
        } else {
            // رسالة خطأ في حال عدم التعرف على الرقم
        return conn.sendMessage(m.chat, {text: `*⚠️ تنسيق المستخدم غير معروف. قم بالرد على رسالة، أو أشر إلى مستخدم، أو اكتب رقمه.*`}, {quoted: fkontak});
    }
    // رسالة خطأ في حال عدم إيجاد المستخدم بأي طريقة
    } else {
        return conn.sendMessage(m.chat, {text: `🚩 *تنسيق المستخدم غير معروف. قم بالرد على رسالة، أو أشر إلى مستخدم، أو اكتب رقمه.*`}, {quoted: fkontak});
    }        
        
        const userNumber = user.split('@')[0];
        
        // التحقق من وجود المستخدم في قاعدة البيانات قبل الحذف
        if (!global.global.db.data.users[user] || global.global.db.data.users[user] == '') {
            return conn.sendMessage(m.chat, {text: `🚩 *المستخدم @${userNumber} غير موجود في قاعدة بياناتي.*`, mentions: [user]}, {quoted: fkontak});
         }
        
        // تنفيذ أمر الحذف الكلي للبيانات
        delete global.global.db.data.users[user];
        
        // رسالة النجاح
        conn.sendMessage(m.chat, {text: `🚩 *تم بنجاح حذف جميع بيانات المستخدم: @${userNumber} من قاعدة بياناتي.*`, mentions: [user]}, {quoted: fkontak});
};
handler.tags = ['owner'];
handler.command = ['حذف_بيانات_كاملة','حذف_مستخدم', 'مسح_بيانات', 'resetuser'];
handler.rowner = true;
export default handler;