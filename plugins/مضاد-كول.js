// File: مضاد-كول.js
const handler = async (m, { conn, isOwner, args, usedPrefix, command }) => {
    
    // التحقق من صلاحية الاستخدام (المالك فقط)
    if (!isOwner) throw 'هذا الأمر مخصص للمطور/المالك فقط.';
    
    // متغير يحمل إعدادات البوت العامة
    let settings = global.db.data.settings[conn.user.jid] || {};
    
    if (args[0] === 'on') {
        settings.antiCall = true;
        global.db.data.settings[conn.user.jid] = settings; 
        m.reply(`✅ *تم تفعيل* مضاد المكالمات *للبوت بالكامل*.\n\n_سيتم حظر أي مستخدم يتصل بالبوت تلقائيًا._`);
    } else if (args[0] === 'off') {
        settings.antiCall = false;
        global.db.data.settings[conn.user.jid] = settings;
        m.reply(`❌ *تم تعطيل* مضاد المكالمات *للبوت بالكامل*.`);
    } else {
        // رسالة استخدام الأمر
        m.reply(`*طريقة الاستخدام (للمالك):*\n\nلتفعيل: ${usedPrefix}${command} on\nلتعطيل: ${usedPrefix}${command} off\n\n*الحالة الحالية:* ${settings.antiCall ? 'مفعل 🟢' : 'معطل 🔴'}`);
    }
}

handler.command = ['مضاد-كول', 'انتي-كول']; 
handler.owner = true; 
export default handler