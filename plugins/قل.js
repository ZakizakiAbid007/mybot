let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('🎤 أدخل النص');
    
    try {
        // استخدام Google TTS مباشرة
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`;
        
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });
        
    } catch (error) {
        m.reply('❌ فشل في تحويل النص إلى صوت');
    }
};

handler.command = ['tts', 'قل'];
export default handler;