// File: مضاد-حذف.js
// الأمر الذي يستخدمه المشرف لتشغيل أو إيقاف خاصية Anti-Delete

const handler = async (m, { conn, isGroup, isAdmin, args, usedPrefix, command }) => {
    
    // التحقق من صلاحية الاستخدام
    if (!isGroup) throw 'هذا الأمر مخصص للمجموعات فقط.';
    if (!isAdmin) throw 'يجب أن تكون مشرفًا لتفعيل هذا الأمر.';
    
    // متغير يحمل إعدادات المجموعة 
    let settings = global.db.data.chats[m.chat]; 
    
    if (args[0] === 'on') {
        settings.antiDelete = true;
        m.reply(`✅ *تم تفعيل* مضاد حذف الرسائل بنجاح في هذه المجموعة.\n\n_سيتم الآن إعادة إرسال أي رسالة محذوفة._`);
    } else if (args[0] === 'off') {
        settings.antiDelete = false;
        m.reply(`❌ *تم تعطيل* مضاد حذف الرسائل في هذه المجموعة.`);
    } else {
        // رسالة استخدام الأمر
        m.reply(`*طريقة الاستخدام:*\n\nلتفعيل: ${usedPrefix}${command} on\nلتعطيل: ${usedPrefix}${command} off\n\n*الحالة الحالية:* ${settings.antiDelete ? 'مفعل 🟢' : 'معطل 🔴'}`);
    }
}

handler.command = ['مضاد-حذف', 'انتي-ديليت']; 
handler.group = true;
handler.admin = true; 
export default handler