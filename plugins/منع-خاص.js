// File: منع-خاص-command.js
const handler = async (m, { conn, isOwner, args, usedPrefix, command }) => {
    
    // التحقق من صلاحية الاستخدام (المالك فقط)
    if (!isOwner) throw 'هذا الأمر مخصص للمطور/المالك فقط.';
    
    // متغير يحمل إعدادات البوت العامة
    let settings = global.db.data.settings[conn.user.jid] || {};
    
    if (args[0] === 'on') {
        settings.antiPrivate = true;
        global.db.data.settings[conn.user.jid] = settings; 
        m.reply(`✅ *تم تفعيل* منع استخدام البوت في الخاص *للبوت بالكامل*.\n\n_سيتم إنذار وحظر المستخدمين الذين يحاولون استخدام البوت في الخاص._`);
    } else if (args[0] === 'off') {
        settings.antiPrivate = false;
        global.db.data.settings[conn.user.jid] = settings;
        m.reply(`❌ *تم تعطيل* منع استخدام البوت في الخاص *للبوت بالكامل*.`);
    } else {
        // رسالة استخدام الأمر
        m.reply(`*طريقة الاستخدام (للمالك):*\n\nلتفعيل: ${usedPrefix}${command} on\nلتعطيل: ${usedPrefix}${command} off\n\n*الحالة الحالية:* ${settings.antiPrivate ? 'مفعل 🟢' : 'معطل 🔴'}`);
    }
}

handler.command = ['منع-خاص', 'انتي-خاص']; 
handler.owner = true; 
export default handler