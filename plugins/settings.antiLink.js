// File: مضاد-لينك.js
// يجب أن يكون الكود ضمن دالة handler
const handler = async (m, { conn, isOwner, isGroup, isAdmin, args, usedPrefix, command }) => {
    
    // التحقق من صلاحية الاستخدام
    if (!isGroup) throw 'هذا الأمر مخصص للمجموعات فقط.';
    if (!isAdmin) throw 'يجب أن تكون مشرفًا لتفعيل هذا الأمر.';
    
    // متغير يحمل إعدادات المجموعة (افترض وجوده في m.chat)
    let settings = global.db.data.chats[m.chat]; 
    
    if (args[0] === 'on') {
        settings.antiLink = true;
        m.reply(`✅ *تم تفعيل* مضاد الروابط بنجاح في هذه المجموعة.`);
    } else if (args[0] === 'off') {
        settings.antiLink = false;
        m.reply(`❌ *تم تعطيل* مضاد الروابط في هذه المجموعة.`);
    } else {
        // رسالة استخدام الأمر
        m.reply(`*طريقة الاستخدام:*\n\nلتفعيل: ${usedPrefix}${command} on\nلتعطيل: ${usedPrefix}${command} off\n\n*الحالة الحالية:* ${settings.antiLink ? 'مفعل 🟢' : 'معطل 🔴'}`);
    }
}

handler.command = ['مضاد-لينك', 'انتي-لينك']; 
handler.group = true;
handler.admin = true; // يتطلب صلاحية المشرف
// handler.botAdmin = true; // قد يتطلب صلاحية البوت كإداري
export default handler