// File: ترقية.js
const handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
    
    // 1. التحقق من صلاحيات البوت والمستخدم
    if (!m.isGroup) throw '❌ هذا الأمر مخصص للمجموعات فقط.';
    if (!isAdmin) throw `👑 يجب أن تكون *مشرفًا* لاستخدام الأمر: *${usedPrefix + command}*`;
    if (!isBotAdmin) throw '🚩 يجب أن أكون *مشرفًا* لأتمكن من ترقية الأعضاء.';

    // 2. تحديد المستهدف
    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return conn.reply(m.chat, 'الرجاء الإشارة إلى المستخدم أو الرد على رسالته لمنحه الإشراف.', m);

    // 3. منع ترقية البوت نفسه أو المشرفين الحاليين
    const groupMetadata = await conn.groupMetadata(m.chat);
    const userIsAdmin = groupMetadata.participants.some(p => p.jid === target && p.admin);

    if (userIsAdmin) return conn.reply(m.chat, `🚩 المستخدم @${target.split('@')[0]} هو *مشرف بالفعل*.`, m, { mentions: [target] });
    if (target === conn.user.jid) return conn.reply(m.chat, '❌ لا يمكنني ترقية البوت نفسه.', m);

    // 4. تنفيذ الترقية
    await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
    
    conn.reply(m.chat, `✅ *تمت الترقية!*\n\n👑 أصبح @${target.split('@')[0]} *مشرفًا* جديدًا في المجموعة.`, m, { mentions: [target] });
};

handler.command = ['ترقية', 'promote', 'ادمن'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true; 

export default handler;