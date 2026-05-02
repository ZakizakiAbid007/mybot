// الكود بواسطة The Carlos 👑
// لا تنسَ ترك حقوق المبرمج
var handler = async (m, { conn }) => {
  try {
    // التحقق 1: المجموعة
    if (!m.isGroup) 
      return conn.reply(m.chat, '❌ هذا الأمر يعمل في المجموعات فقط.', m);

    // تحديد المستهدف
    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) 
      return conn.reply(m.chat, '> _الرجاء الرد على رسالة أو وسم الشخص الذي تريد طرده._', m);

    const groupMeta = await conn.groupMetadata(m.chat);
    const ownerGroup = groupMeta.owner || m.chat.split('-')[0] + '@s.whatsapp.net';
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // التحقق 2: صلاحيات البوت
    const botIsAdmin = groupMeta.participants.some(p => p.jid === botJid && p.admin);
    if (!botIsAdmin) 
      return conn.reply(m.chat, '🚩 يجب أن أكون مشرفًا لأتمكن من طرد المستخدمين.', m);

    // التحقق 3: منع طرد المالكين والأرقام المصرح بها
    if ([ownerGroup, botJid, ...(global.owner?.map(o => o[0] + '@s.whatsapp.net') || [])].includes(target)) {
      return conn.reply(m.chat, '🚩 لا يمكنني طرد المالك أو رقم مُصرَّح به.', m);
    }

    // التحقق 4: منع طرد المشرفين الآخرين
    const userIsAdmin = groupMeta.participants.some(p => p.jid === target && p.admin);
    if (userIsAdmin) 
      return conn.reply(m.chat, '🚩 لا يمكنني طرد مشرف آخر في المجموعة.', m);

    // تنفيذ الطرد
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    conn.reply(m.chat, `✅ تم طرد المستخدم @${target.split('@')[0]}.`, m, { mentions: [target] });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة طرد المستخدم.', m);
  }
};

handler.help = ['طرد @مستخدم'];
handler.tags = ['مجموعة'];
handler.command = ['طرد', 'kick', 'خرج', 'حظر']; 
handler.admin = true;
handler.group = true;

export default handler;