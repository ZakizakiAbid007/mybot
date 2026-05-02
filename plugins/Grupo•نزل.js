// File: نزل.js
const handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
    
    // 1. التحقق من صلاحيات المستخدم والبوت
    if (!m.isGroup) throw '❌ هذا الأمر مخصص للمجموعات فقط.';
    if (!isAdmin) throw `👑 يجب أن تكون *مشرفًا* لاستخدام الأمر: *${usedPrefix + command}*`;
    if (!isBotAdmin) throw '🚩 يجب أن أكون *مشرفًا* لأتمكن من عزل الأعضاء من الإشراف.';

    // 2. تحديد المستهدف
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    
    // التحقق من وجود مستهدف
    if (!user) {
        return conn.reply(m.chat, `*قم بالوسم أو الرد على المستخدم الذي تريد عزله من الإشراف.*\nمثال: ${usedPrefix + command} @المستخدم`, m);
    }

    // 3. منع عزل المالكين والبوت نفسه
    const groupMetadata = await conn.groupMetadata(m.chat);
    const ownerGroup = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
    
    if (user === conn.user.jid) return conn.reply(m.chat, '❌ لا يمكنني عزل البوت نفسه.', m);
    if (user === ownerGroup) return conn.reply(m.chat, '🚩 لا يمكن عزل منشئ المجموعة.', m);

    // 4. تنفيذ عزل الصلاحيات
    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        // رسالة التأكيد
        m.reply(`*✅ تم عزل @${user.split('@')[0]} من الإشراف بنجاح.*`, m, { mentions: [user] });
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة عزل المستخدم. تأكد أنه مشرف أساسًا.', m);
    }
}

// إعدادات المعالج
handler.command = ['نزل', 'demote', 'عزل']; 
handler.group = true; 
handler.admin = true; 
handler.botAdmin = true; // نضمن أن البوت يحتاج لصلاحية المشرف

export default handler;