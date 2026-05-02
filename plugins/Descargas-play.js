import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // ⛔️ التحقق من وجود نص البحث
    if (!text) {
        throw `
*💥 هَـيْـهَـات! أَدْخِـلْ تـعـلـيـمـاتِـكَ!*
الرجاء إدخال اسم الفيديو أو الأغنية للبحث.
📝 مِـثَـالُ الـقُـوَّةِ: ${usedPrefix + command} سيف النار اغنية
`.trim();
    }

    // ⚔️ بـدء الـبـحـث في يـوتـيـوب
    const search = await yts(text);
    const videoInfo = search.all?.[0]; // أول نتيجة بحث هي الأقوى

    // ⛔️ التحقق من النتائج
    if (!videoInfo) {
        throw '🔥 *تَـوَقُّـفٌ قَـسْـرِيٌّ!* لم نعثر على أي نتائج مطابقة لتعليماتك. حاول بكلمات أقوى.';
    }
    
    // 🛡️ تجميع رسالة العرض
    const body = `
\`\`\`
👑 مَـمْـلَـكَـةُ تِـنْـغَـنْ لِـلْـتَّـنْـزِيلَاتِ
-------------------------------------------
🔥 *الـعُـنْـوَانُ:* ${videoInfo.title}
⏳ *الـمُـدَّةُ:* ${videoInfo.timestamp}
🔗 *الـرابِـطُ:* ${videoInfo.url}

⚔️ **اختر سـلاحـك للتنزيل:**
(🎧 صـوتٌ نـقـيٌّ أو 📽️ مـشـهـدٌ بـصـريٌّ)
\`\`\``.trim();

    // 📧 إرسال الرسالة مع الأزرار
    await conn.sendMessage(
        m.chat,
        {
            image: { url: videoInfo.thumbnail },
            caption: body,
            footer: `𝕸𝖆𝖑𝖎𝖐 𝖆𝖑-𝕸𝖆𝖍𝖗𝖆𝖏𝖆𝖓𝖆𝖙 👑 | ${global.name || 'تِـنْـغَـنْ'} ⚔️`, // تخصيص الـ Footer باسمك
            buttons: [
                { buttonId: `.ytmp3 ${videoInfo.url}`, buttonText: { displayText: '🎧 صَـوْتٌ' } },
                { buttonId: `.ytmp4 ${videoInfo.url}`, buttonText: { displayText: '📽️ فِـيدِيـو' } },
                { buttonId: `.ytmp3doc ${videoInfo.url}`, buttonText: { displayText: '💿 صَـوْتٌ (مُـسْـتَـنَـد)' } },
                { buttonId: `.ytmp4doc ${videoInfo.url}`, buttonText: { displayText: '🎥 فِـيدِيـو (مُـسْـتَـنَـد)' } },
            ],
            viewOnce: true,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: '📡 تـنـزيـلات مـلـك الـمـهـرجـانـات', // تخصيص العنوان
                    body: '👑 مـمـلـكـة تـنـغـن للـتـنـزيـلات', // تخصيص الـ Body
                    mediaType: 2,
                    sourceUrl: global.redes || 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V', // رابط قناتك
                    thumbnail: global.icons || null
                }
            }
        },
        { quoted: m }
    );

    // 🌟 إظهار رد فعل النجاح
    m.react('⚔️');
};

handler.command = ['شغل', 'فيديو', 'play2', 'تنزيل', 'بحث_يوتيوب']; // إضافة المزيد من الأوامر العربية القوية
handler.tags = ['تنزيلات', 'وسائط'];
handler.group = true;
handler.limit = 6;
handler.register = true; // يفترض أن هذا الكود يتطلب التسجيل

export default handler;