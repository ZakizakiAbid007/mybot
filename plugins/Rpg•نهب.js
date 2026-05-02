const ro = 3000; // الحد الأقصى لنقاط الخبرة (XP) التي يمكن سرقتها
const handler = async (m, {conn, usedPrefix, command}) => {
  
  // 1. التحقق من فترة الانتظار (Cooldown)
  const time = global.db.data.users[m.sender].lastrob + 7200000; // 7200000 ملي ثانية = ساعتان
  if (new Date - global.db.data.users[m.sender].lastrob < 7200000) {
    // رسالة الانتظار
    conn.reply(m.chat, `*🚩 مهلاً! انتظر ${msToTime(time - new Date())} لتعاود السرقة مجدداً.*`, m, rcanal);
    return;
  }
  
  // 2. تحديد الضحية (الـ Who)
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
  else who = m.chat;
  
  // 3. التحقق من الإشارة
  if (!who) {
    conn.reply(m.chat, `*🚩 قم بالإشارة إلى المستخدم (عمل تاغ) لسرقته.*`, m, fake)
    return;
  }
  
  // 4. التحقق من الوجود في قاعدة البيانات
  if (!(who in global.db.data.users)) { 
    conn.reply(m.chat, `*🚩 المستخدم غير موجود في قاعدة بياناتي.*`, m, rcanal)
    return;
  }
  
  const users = global.db.data.users[who]; // بيانات الضحية
  const rob = Math.floor(Math.random() * ro); // تحديد كمية السرقة العشوائية
  
  // 5. التحقق من ثراء الضحية (يجب أن يمتلك أكثر من الحد الأدنى للسرقة)
  if (users.exp < rob) return conn.reply(m.chat, `😔 @${who.split`@`[0]} يمتلك أقل من *${ro} XP*\nلا تسرق الفقراء :v":`, m, {mentions: [who]});
  
  // 6. تنفيذ عملية السرقة (خصم وإضافة)
  global.db.data.users[m.sender].exp += rob; // إضافة المبلغ المسروق للسارق
  global.db.data.users[who].exp -= rob; // خصم المبلغ المسروق من الضحية
  
  // 7. رسالة النجاح وتحديث وقت السرقة
  conn.reply(m.chat, `*🚩 نجحت السرقة! حصلت على ${rob} XP من @${who.split`@`[0]}*`, m, {mentions: [who]});
  global.db.data.users[m.sender].lastrob = new Date * 1;
};
handler.help = ['نهب'];
handler.tags = ['rpg'];
handler.command = ['نهب', 'نصب'];
export default handler;

// دالة تحويل المللي ثانية إلى وقت مقروء
function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  return hours + ' ساعة/ساعات ' + minutes + ' دقيقة/دقائق';
}