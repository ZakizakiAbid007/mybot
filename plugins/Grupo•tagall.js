const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    return;
  }
  const pesan = args.join` `;
  const colombia = `💌 *الرسالة:* ${pesan}`;
  let teks = `💥 *استدعاء المجموعة*\n${colombia}\n\n☁️ *الإشارات:*\n`;
  for (const mem of participants) {
    teks += `@${mem.id.split('@')[0]}\n`;
  }
  conn.sendMessage(m.chat, {text: teks, mentions: participants.map((a) => a.id)} );
};
handler.help = ['tagall *<رسالة>*', 'invocar *<رسالة>*'];
handler.tags = ['grupo'];
handler.command = ['tagall', 'invocar', 'استدعاء', 'منشن'];
handler.admin = true;
handler.group = true;
export default handler;