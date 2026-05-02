let handler = async (m, { args, conn }) => {
  if (!args[0]) return m.reply("أدخل النص بعد الأمر\nمثال: .صوت أنا الأقوى");

  const text = args.join(" ");
  
  try {
    // استخدام صوت ياباني عميق يشبه صوت سوكونا
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ja&client=tw-ob`;
    
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });
    
  } catch (error) {
    m.reply("❌ فشل تحويل النص. حاول مرة أخرى.");
  }
};

handler.command = ['صوت', 'سوكونا', 'sukuna'];
export default handler;