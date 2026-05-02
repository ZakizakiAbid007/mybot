import { Sticker, StickerTypes } from 'wa-sticker-formatter';

let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('❌ قم بالرد على الصورة');
    
    try {
        await m.react('🔄');
        
        const media = await m.quoted.download();
        
        // استخدام مكتبة wa-sticker-formatter لتحسين الجودة
        const sticker = new Sticker(media, {
            pack: 'Yotsuba Bot',
            author: 'Yotsuba',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            quality: 50,
            background: '#00000000'
        });
        
        await conn.sendMessage(m.chat, await sticker.toMessage(), { quoted: m });
        await m.react('✅');
        
    } catch (error) {
        console.error(error);
        await m.react('❌');
        m.reply('❌ فشل في التحويل');
    }
};

handler.command = ['لملصق', 'tosticker'];
export default handler;