let linkRegex = /\b((https?:\/\/|www\.)?[\w-]+\.[\w-]+(?:\.[\w-]+)*(\/[\w\.\-\/]*)?)\b/i
export async function before(m, {isAdmin, isBotAdmin, text}) {
  if (m.isBaileys && m.fromMe) {
    return !0;
  }
  if (!m.isGroup) return !1;
  const chat = global.db.data.chats[m.chat];
  const delet = m.key.participant;
  const bang = m.key.id;
  const bot = global.db.data.settings[this.user.jid] || {};
  const user = `@${m.sender.split`@`[0]}`;
  const isGroupLink = linkRegex.exec(m.text);
  if (chat.antiLink2 && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      // استثناء روابط المجموعة الحالية وروابط يوتيوب للسماح بمشاركتها
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
      const linkThisGroup2 = `https://www.youtube.com/`;
      const linkThisGroup3 = `https://youtu.be/`;
      if (m.text.includes(linkThisGroup)) return !0;
      if (m.text.includes(linkThisGroup2)) return !0;
      if (m.text.includes(linkThisGroup3)) return !0;
    }
    
    // رسالة التنبيه والطرد المعرّبة
    await this.sendMessage(m.chat, {text: `*「 🚫 مُكافِح الرَوابِط 🚫 」*\n*عُذراً لَم تَتَعلّم 🙄 ${user} لَقَد خَرَقْت قَوانِينْ المَجْمُوعَة، سَيَتِم طَردُك...!!*`, mentions: [m.sender]}, {quoted: m});
    
    // رسالة إذا لم يكن البوت مشرفاً
    if (!isBotAdmin) return m.reply('*[🚫] أنا لست مشرفاً ! بالتالي لا يمكنني تنفيذ إجراء الطرد.*');
    
    if (isBotAdmin && bot.restrict) {
      // حذف الرسالة والطرد
      await conn.sendMessage(m.chat, {delete: {remoteJid: m.chat, fromMe: false, id: bang, participant: delet}});
      const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      if (responseb[0].status === '404') return;
    } else if (!bot.restrict) return m.reply('*[🚫] المالك لم يُفعّل خيار التقييد (Restrict)، لا يمكنني تنفيذ الإجراء.*');
  }
  return !0;
}