import fetch from 'node-fetch';
import { cpus as _cpus } from 'os';
import { sizeFormatter } from 'human-readable';

let format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

let handler = async (m, { conn }) => {
  try {
    // جلب معلومات النظام
    let uptime = clockString(process.uptime() * 1000);
    let totalreg = Object.keys(global.db.data.users).length || 0;
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const used = process.memoryUsage();

    // إنشاء رسالة حالة البوت باللغة العربية
    let menu = `🍀 *مــــعـــلــومــات الـــــبــــوت*
    
*_الـــــحــــالـــــة_*
🍁 ⋄ عدد المجموعات: *${groupsIn.length}*
🌸 ⋄ المجموعات المنضمة: *${groupsIn.length}*
🍁 ⋄ المجموعات المتروكة: *0*
🌸 ⋄ المحادثات الخاصة: *${chats.length - groupsIn.length}*
🍁 ⋄ إجمالي المحادثات: *${chats.length}*
🌸 ⋄ المستخدمون المسجلون: *${totalreg}*
🍁 ⋄ مدة التشغيل: *${uptime}*

🌼 *استخدام ذاكرة NodeJS*
${'```' + Object.keys(used).map((key) => `${key.padEnd(10, ' ')}: ${format(used[key])}`).join('\n') + '```'}
`;

    // إرسال الرسالة مع الرد الموسع (externalAdReply)
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '❑— YotsubaBot-MD —❑\nروبوت واتساب - أجهزة متعددة',
          thumbnailUrl: 'https://qu.ax/ilnry.jpg', // صورة مصغرة
          sourceUrl: 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V', // ⬅️ تم تحديث رابط قناتك هنا
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });

    // إضافة تفاعل على الرسالة الأصلية
    if (m.react) await m.react('🤖');

  } catch (e) {
    console.error(e);
    m.reply('❌ حدث خطأ أثناء معالجة الأمر.');
  }
};

handler.help = ['معلومات_البوت'];
handler.tags = ['معلومات'];
handler.command = ['info', 'infobot', 'botinfo', 'معلومات_البوت', 'حالة_البوت']; // إضافة الأوامر العربية

export default handler;

// دالة لحساب مدة التشغيل (hh:mm:ss)
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}