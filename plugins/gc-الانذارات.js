let handler = async (m, { conn, isOwner }) => {
    // تصفية المستخدمين الذين لديهم تحذيرات (warn > 0)
    let adv = Object.entries(global.db.data.users).filter(user => user[1].warn);
    
    // ملاحظة: المتغيرات 'warns' و 'user' تبدو غير مستخدمة أو مكررة في النص الأصلي، 
    // لذا سنعتمد على 'adv' للبيانات الصحيحة.
    
    // بناء رسالة القائمة
    let caption = `⚠️ *قائمة المستخدمين المُحذَّرين* ⚠️
*╭•·–––––––––––––––––––·•*
│ *الإجمالي : ${adv.length} مستخدم* ${adv ? '\n' + adv.map(([jid, user], i) => {
    // الحصول على اسم المستخدم أو استخدام 'لا يوجد مستخدم' إذا كان غير معرف
    const userName = conn.getName(jid) === undefined ? 'لا يوجد مستخدم' : conn.getName(jid);
    
    // عرض تفاصيل المستخدم
    return `
│
│ *${i + 1}.* ${userName} *(${user.warn}/4)*
│ ${isOwner ? '@' + jid.split`@`[0] : jid}
│ - - - - - - - - -`.trim();
}).join('\n') : ''}
*╰•·–––––––––––––––––––•*\n\n`
    
    // ملاحظة: تمت إزالة المتغيرات غير المعرفة مثل 'warns' و 'botname' من السطر الأخير لتجنب الأخطاء.
    // إذا كان لديك تعريفات لهذه المتغيرات (مثل 'botname') في سياق الكود الكامل، يمكنك إضافتها.
    
    await conn.reply(m.chat, caption, m, { mentions: await conn.parseMention(caption) });
}

// تعريف الأوامر باللغتين الإسبانية والعربية
handler.command = ['المنذورين', 'انذارات', 'قائمة_التحذيرات', 'adv', 'advlist', 'advlista'];
handler.group = true; // يفترض أنه أمر يخص المجموعات
handler.register = true; // يفترض أنه يتطلب التسجيل

export default handler;