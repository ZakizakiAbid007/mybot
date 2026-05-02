const handler = async (m, {conn, participants, groupMetadata}) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || `${global.icons}`;
  const {antiToxic, reaction, antiTraba, antidelete, antiviewonce, welcome, detect, antiLink, antiLink2, modohorny, autosticker, audios} = global.db.data.chats[m.chat];
  const groupAdmins = participants.filter((p) => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const text = `💥 *معلومات المجموعة*
💌 *الايدي:*
→ ${groupMetadata.id}
🥷 *الاسم:*
→ ${groupMetadata.subject}
🌟 *الوصف:*
→ ${groupMetadata.desc?.toString() || 'لا يوجد وصف'}
💫 *الأعضاء:*
→ ${participants.length} عضو
👑 *منشئ المجموعة:*
→ @${owner.split('@')[0]}
🏆 *المشرفين:*
${listAdmin}

💭 *الإعدادات*

◈ *الترحيب:* ${welcome ? '✅' : '❌'}
◈ *الكشف:* ${detect ? '✅' : '❌'}  
◈ *مكافحة الروابط:* ${antiLink ? '✅' : '❌'} 
◈ *مكافحة الروابط 𝟸:* ${antiLink2 ? '✅' : '❌'} 
◈ *وضع الإباحية:* ${modohorny ? '✅' : '❌'} 
◈ *الملصقات التلقائية:* ${autosticker ? '✅' : '❌'} 
◈ *الصوتيات:* ${audios ? '✅' : '❌'} 
◈ *مكافحة المشاهدة مرة واحدة:* ${antiviewonce ? '✅' : '❌'} 
◈ *الردود التفاعلية* ${reaction ? "✅️" : "❌️"}
◈ *الحذف:* ${antidelete ? '✅' : '❌'} 
◈ *مكافحة السمية:* ${antiToxic ? '✅' : '❌'} 
◈ *مكافحة السبام:* ${antiTraba ? '✅' : '❌'} 
`.trim();
  conn.sendFile(m.chat, pp, 'img.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['infogrupo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'gp', 'معلومات_المجموعة', 'معلومات_الكروب', 'جروب'];
handler.register = true
handler.group = true;
export default handler;