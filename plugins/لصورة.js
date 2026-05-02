let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('❌ قم بالرد على الملصق');
    
    try {
        // طريقة مباشرة - تعمل مع معظم البوتات
        const media = await m.quoted.download();
        
        await conn.sendMessage(m.chat, {
            image: media,
            caption: '🎉 تم تحويل الملصق إلى صورة!'
        }, { quoted: m });
        
    } catch (error) {
        m.reply('❌ فشل في تحويل الملصق');
    }
};

handler.command = ['لصورة'];
export default handler;