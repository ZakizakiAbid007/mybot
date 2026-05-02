let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 🚩 التحقق من وجود @tag
    if (!text) return m.reply('⚠️ *الرجاء إدخال @tag لأحد المستخدمين لحظره.*');
    
    let who;
    // تحديد المستخدم المستهدف (المنشن)
    if (m.isGroup) who = m.mentionedJid[0];
    else who = m.chat; // في الخاص، يكون المستهدف هو المرسل نفسه (وهو أمر يندر استخدامه هنا)
    
    // 🚩 التحقق مرة أخرى
    if (!who) return m.reply('⚠️ *الرجاء إدخال @tag لأحد المستخدمين لحظره.*');
    
    let users = global.db.data.users;
    
    // 🚀 تنفيذ عملية الحظر
    users[who].banned = true;
    
    // رسالة التأكيد
    // ملاحظة: fkontak يجب أن يكون معرَّفاً كمتغير عام أو يتم استبداله بـ m
    conn.reply(m.chat, `⚠️ *تم حظر المستخدم @${who.split('@')[0]} بنجاح.*`, fkontak || m, { mentions: [who]});
}

handler.help = ['حظر_مستخدم <@تاغ> <السبب>'];
handler.command = ['banuser', 'حظر_مستخدم', 'حظر']; // إضافة الأوامر العربية
handler.tags = ['المالك'];
handler.rowner = true; // حصرياً لمالك البوت الرئيسي
export default handler;