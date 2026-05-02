// File: مضاد-سبام-command.js
// الأمر الذي يستخدمه المالك أو المشرفون لتشغيل أو إيقاف الخاصية في البوت كله

const handler = async (m, { conn, isOwner, args, usedPrefix, command, isAdmin, isGroup }) => {
    
    // 👑 تم تعديل الشرط: الآن مخصص للمالك والمشرفين في المجموعة
    // الشرط: إذا لم يكن المالك، يجب أن يكون ضمن مجموعة (isGroup) ويكون مشرفاً (isAdmin)
    if (!(isOwner || (isGroup && isAdmin))) {
        throw '🔥 **تـوقـف!** هذا الأمر مخصص للمالك والمشرفين (أركان المهرجان) فقط، وليس لأي شخص آخر.';
    }
    
    // متغير يحمل إعدادات البوت العامة
    let settings = global.db.data.settings[conn.user.jid] || {};
    
    if (args[0] === 'on') {
        settings.antiSpam = true;
        // تحديث قاعدة البيانات إذا كانت الإعدادات غير موجودة
        global.db.data.settings[conn.user.jid] = settings; 
        m.reply(`✅ *تـفـعـيـل نـاجـح!* تم إطلاق **نظام مُضَادّ السْـبَـامِ** *للبوت بالكامل*. لن نسمح بتخريب المهرجان! 💥`);
    } else if (args[0] === 'off') {
        settings.antiSpam = false;
        global.db.data.settings[conn.user.jid] = settings;
        m.reply(`❌ *تـعـطـيـل مـؤقـت!* تم **إيقاف** نظام مُضَادّ السْـبَـامِ *للبوت بالكامل*. احذر من تكرار الرسائل! ⚠️`);
    } else {
        // رسالة استخدام الأمر الحماسية
        m.reply(`
*طريقة الاستخدام يا بطل (للمالك أو المشرف):*
🎉 استخدم هذه الأوامر لتفجير نظام الحماية أو إيقافه!

**لـتـفـعـيـل:** ${usedPrefix}${command} on
**لـتـعـطـيـل:** ${usedPrefix}${command} off

*الـحـالـة الـحـالـيـة لـلـمـهـرجـان:*
${settings.antiSpam ? 'مُـفَـعَّـلٌ 🟢 ومُـحْـمِـيٌّ 🛡️' : 'مُـعَـطَّـلٌ 🔴 وخَـطِـيرٌ 🚨'}
        `.trim());
    }
}

handler.command = ['مضاد-سبام', 'انتي-سبام']; 
handler.group = true; // يجب أن يتم استخدامه في مجموعة
handler.admin = true; // يتطلب صلاحية المشرف (أو المالك)
export default handler