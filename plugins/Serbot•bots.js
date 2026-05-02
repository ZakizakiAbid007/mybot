import ws from 'ws';
import fetch from 'node-fetch';

async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map();

  global.conns.forEach((conn) => {
    // التحقق من أن الاتصال موجود وغير مغلق
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn);
    }
  });

  let users = [...uniqueUsers.values()];
  // عدد البوتات الفرعية المتصلة (Jadibots)
  let subBotsCount = users.length;
  let botPrincipal = stars.user.jid;

  // حساب وقت تشغيل البوت الرئيسي
  let uptime = process.uptime(); // الوقت الفعلي بالثواني
  let hours = Math.floor(uptime / 3600);
  let minutes = Math.floor((uptime % 3600) / 60);

  // رسالة الرد
  let responseMessage = `
╭━〔 🍁 إحصائيات البوتات الفرعية 〕⬣
┃ *البوت_الرئيسي:* 1
┃ *البوتات_المؤقتة_المتصلة:* ${subBotsCount || '0'}
┃ *وقت_تشغيل_البوت_الرئيسي:* ${hours} ساعات و ${minutes} دقائق
╰━━━━━━━━━━━━⬣
`.trim();

  // إرسال رسالة مع externalAdReply (كرد على الرسالة)
  try {
    // جلب الصورة
    let img = await (await fetch('https://qu.ax/Zkbep.jpg')).buffer(); 
    await stars.sendMessage(m.chat, {
      text: responseMessage,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 9,
        externalAdReply: {
          title: '❑— إحصائيات البوتات الفرعية —❑',
          body: `عدد البوتات المتصلة: ${subBotsCount || '0'}`,
          thumbnail: img,
          sourceUrl: 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04',
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

    // رد فعل على الرسالة
    await m.react('🤖');
  } catch (e) {
    console.error(e);
    // في حالة الفشل، أرسل رسالة نصية بسيطة
    await stars.reply(m.chat, responseMessage, m);
  }
}

handler.help = ['البوتات_الفرعية'];
handler.tags = ['بوت_فرعي'];
handler.command = ['listjadibot', 'bots', 'البوتات_الفرعية', 'بوتاتي']; // إضافة الأوامر العربية

export default handler;