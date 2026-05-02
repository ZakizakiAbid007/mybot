export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  try {
    // ✅ تجاهل رسائل البوت والرسائل بدون محتوى
    if (m.isBaileys && m.fromMe) return true;
    if (!m.message) return true;

    // ✅ تجاهل الرسائل في المجموعات والبث
    if (m.isGroup || m.chat.endsWith('@broadcast')) return false;

    // ✅ استثناء نصوص محددة
    const excludedTexts = ['PIEDRA', 'PAPEL', 'TIJERA', 'serbot', 'jadibot', 'حجر', 'ورقة', 'مقص'];
    if (excludedTexts.some((text) => m.text?.includes(text))) return true;

    // ✅ الحصول على بيانات المحادثة وإعدادات البوت
    const chat = global.db.data.chats[m.chat] || {};
    const bot = global.db.data.settings[this.user.jid] || {};

    // ✅ التحقق إذا كان منع الخاص مفعلاً والمستخدم ليس مالكاً
    if (bot.antiPrivate && !isOwner && !isROwner) {
      const grupo = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'; // رابط قناتك

      // ✅ إرسال تحذير للمستخدم
      await m.reply(
        `🚫 *مرحباً @${m.sender.split`@`[0]}*\n\n` +
        `📵 *مطور البوت عطل الأوامر في المحادثات الخاصة*\n\n` +
        `⚡ *سيتم حظرك تلقائياً*\n\n` +
        `💫 *إذا كنت تريد استخدام الأوامر:*\n` +
        `انضم للمجموعة الرئيسية للبوت:\n${grupo}\n\n` +
        `🔗 *أو تفضل بزيارة قناتنا:*\n${global.channel}`,
        null,
        { mentions: [m.sender] }
      );

      // ✅ حظر المستخدم
      await this.updateBlockStatus(m.sender, 'block');
      
      // ✅ رسالة تأكيد الحظر
      await conn.reply(m.chat,
        `🔒 *تم حظرك تلقائياً*\n\n` +
        `👤 *المستخدم:* @${m.sender.split`@`[0]}\n` +
        `🚫 *السبب:* استخدام البوت في الخاص\n` +
        `📋 *القاعدة:* الأوامر متاحة فقط في المجموعات\n\n` +
        `💡 *لإلغاء الحظر:*\n` +
        `تواصل مع المطور أو انضم للمجموعة`,
        null,
        { mentions: [m.sender] }
      );
    }
    return false;
  } catch (error) {
    console.error('❌ خطأ في معالجة منع الخاص:', error);
    return true;
  }
}