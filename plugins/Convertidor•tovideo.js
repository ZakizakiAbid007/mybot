const handler = async (m, { conn }) => {
    
    // 1. التحقق من الرد على ملصق
    if (!m.quoted || !m.quoted.isSticker) {
        return conn.reply(m.chat, '❌ *بأمر من الملك تنغن!* يجب عليك الرد على *ملصق متحرك* لتحويله إلى فيديو.', m);
    }
    
    // 2. التحقق من أن الملصق متحرك (Animation)
    if (!m.quoted.isAnimated) {
        return conn.reply(m.chat, '⚠️ *انتبه يا مالكي!* هذا الملصق ليس متحركاً (ثابت). لا يمكن تحويله إلى فيديو.', m);
    }
    
    try {
        await m.react('🔄'); // تفاعل (جاري العمل)
        
        // تحميل الملصق
        const media = await m.quoted.download();
        
        // 3. إرسال كفيديو MP4
        await conn.sendMessage(m.chat, {
            video: media,
            caption: '👑 *تنفيذ الأمر!* ✅ تم تحويل الملصق المتحرك إلى فيديو MP4.',
            mimetype: 'video/mp4'
        }, { quoted: m });
        
        await m.react('✅'); // تفاعل (تم بنجاح)
        
    } catch (error) {
        console.error("خطأ في تحويل الملصق لفيديو:", error);
        await m.react('❌');
        m.reply('❌ *فشل أمر التحويل.* قد يكون الملصق غير صالح أو حدث خطأ تقني.');
    }
};

handler.help = ['tovideo', 'لفيديو'];
handler.tags = ['tools', 'أدوات'];
handler.command = ['لفيديو', 'tovideo', 'tomp4', 'mp4'];
export default handler;