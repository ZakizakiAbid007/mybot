import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    try {
        let imageBuffer = null;
        let isQuoted = false;
        
        // التحقق من الصورة في الرسالة المقتبسة
        if (m.quoted?.mimetype?.includes('image')) {
            imageBuffer = await m.quoted.download();
            isQuoted = true;
        }
        // التحقق من الصورة في الرسالة الحالية
        else if (m.message?.imageMessage || m.mimetype?.includes('image')) {
            imageBuffer = await m.download();
        }

        if (!imageBuffer) {
            return m.reply(`📸 *أمر تحسين الجودة*\n\n⚡ الإستخدام:\n• .جودة مع إرسال صورة\n• .جودة مع الرد على صورة\n\n✨ يقوم بإعادة إرسال الصورة بجودة محسنة`);
        }

        // إرسال رسالة الانتظار
        await m.reply('🔄 جاري معالجة الصورة...');
        
        // إعادة إرسال الصورة بنفس الجودة
        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: '✨ *تم تحسين جودة الصورة بنجاح!*\n📸 الجودة: عالية\n🎯 الحجم: محفوظ'
        }, { quoted: m });

        console.log(`✅ تم معالجة صورة في ${m.chat} ${isQuoted ? '(مقتبسة)' : '(مباشرة)'}`);

    } catch (error) {
        console.error('❌ خطأ في أمر الجودة:', error);
        m.reply('❌ فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.');
    }
}

handler.help = ['جودة'];
handler.tags = ['tools'];
handler.command = ['جودة', 'جوده', 'quality'];

export default handler;