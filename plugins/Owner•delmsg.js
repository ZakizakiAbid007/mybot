const handler = async (m, {command, usedPrefix, text}) => {
    // تحديد نوع الرسالة المراد حذفها (vn, msg, img, sticker)
    const which = command.replace(/eliminar|حذف/i, '');
    
    // 🚩 التحقق من وجود اسم الرسالة
    if (!text) throw `*🛑 طريقة الاستخدام الخاطئة:*\n\nاستخدم الأمر \`${usedPrefix}list${which}\` *لعرض قائمة الرسائل المخزنة أولاً.*\n\n*مثال على الحذف:*\n\`${usedPrefix + command} اسم_الرسالة\``;
    
    const msgs = global.db.data.msgs;
    
    // 🚩 التحقق من أن الاسم موجود في قائمة الرسائل المخزنة
    // يتم استخدام '!text in msgs' لأنه قد يحتوي على مسافة في الكود الأصلي، تم تعديله ليكون أكثر دقة
    if (!(text in msgs)) throw `*🛑 الاسم '${text}' غير مُسجَّل في قائمة الرسائل المخزنة (الـ ${which}).*`;
    
    // 🚀 تنفيذ عملية الحذف
    delete msgs[text];
    
    // رسالة النجاح
    m.reply(`*🛑 تم حذف الرسالة بنجاح* من قائمة الرسائل المخزنة بالاسم: *'${text}'*`);
};

// تعريف الأوامر باللغتين
handler.help = ['vn', 'msg', 'img', 'sticker'].map((v) => 'del' + v + ' <اسم>');
handler.tags = ['قاعدة_البيانات'];
handler.command = ['eliminarvn', 'eliminarmsg', 'eliminarimg', 'eliminarsticker', 'حذف_vn', '_مسح_الجلسة', 'حذف_الجلسة', '_sticker']; // الأوامر العربية هي الأهم هنا
handler.rowner = true;
export default handler;