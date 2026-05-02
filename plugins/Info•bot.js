import fs from 'fs';

const handler = (m) => m;

handler.all = async function(m) {
  const chat = global.db.data.chats[m.chat];
  if (chat.isBanned) return;
  
  // ✅ رد على كلمة "بوت" أو "البوت"
  if (/^(بوت|البوت|bot)$/i.test(m.text)) {
    await this.reply(m.chat, 
      `🎊 *مرحباً! أنا ${global.botname}*\n\n` +
      `✨ *كيف يمكنني مساعدتك اليوم؟*\n\n` +
      `📱 *استخدم *${usedPrefix}القائمة* لرؤية جميع الأوامر*\n` +
      `💫 *أو اكتب *مساعدة* للدعم الفوري*`,
      m
    );
  }

  // ✅ رد على كلمة "شغال" أو "شتسوي"
  if (/^(شغال|شتسوي|وينك|نائم)$/i.test(m.text)) {
    await this.reply(m.chat, 
      `⚡ *أنا هنا وشغال!*\n\n` +
      `💫 *جاهز لمساعدتك في أي وقت*\n` +
      `📚 *اكتب *مساعدة* لرؤية ما يمكنني فعله*`,
      m
    );
  }

  // ✅ رد على كلمة "هاي" أو "هلا"
  if (/^(هاي|هلا|هلو|اهلاً)$/i.test(m.text)) {
    await this.reply(m.chat, 
      `🎯 *أهلاً وسهلاً!*\n\n` +
      `✨ *مرحباً بك في ${global.botname}*\n` +
      `🚀 *كيف يمكنني خدمتك اليوم؟*`,
      m
    );
  }

  // ✅ ردود مضحكة بالعربية
  if (/^(سكس|sexo)$/i.test(m.text)) {
    await this.reply(m.chat, `*إباحية* 😟🙈`, m);
  }

  if (/^(قضيب|pene)$/i.test(m.text)) {
    await this.reply(m.chat, `*تأكل* 😹`, m);
  }

  // ✅ رد على كلمة "شكراً" 
  if (/^(شكراً|شكرا|thanks|thank you)$/i.test(m.text)) {
    await this.reply(m.chat, 
      `*العفو! 😊*\n\n` +
      `*دائماً سعيد لمساعدتك!* ✨`,
      m
    );
  }

  // ✅ رد على كلمة "احبك"
  if (/^(احبك|بحبك|love you)$/i.test(m.text)) {
    await this.reply(m.chat, 
      `*وأنا أيضاً أحبك! ❤️*\n\n` +
      `*لكن كصديق رائع! 😄*`,
      m
    );
  }

  return !0;
};

export default handler;