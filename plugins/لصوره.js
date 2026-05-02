import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    // رسالة توضيح الاستخدام
    const notStickerMessage = `*👑 يا ملك، يجب أن ترد على ملصق أولاً*\n*طريقة الاستخدام:* ${usedPrefix + command} (بالرد على ملصق)`
    
    if (!m.quoted) throw notStickerMessage
    
    const q = m.quoted || m
    let mime = q.mediaType || ''
    
    // التحقق من أن الملف المقتبس هو ملصق
    if (!/sticker/.test(mime)) throw notStickerMessage
    
    // تنزيل الملصق
    let media = await q.download()
    
    // تحويل الملصق (webp) إلى صورة (png)
    // استخدام دالة webp2png المستوردة
    let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
    
    // إرسال الصورة الناتجة برسالة ملكية
    await conn.sendFile(m.chat, out, 'out.png', `
*══════ 👑 | تنغن للتحويلات | 👑 ══════*
*✨┊ تم تحويل الملصق إلى صورة PNG بنجاح!*
*══════ • 🏆 • ══════*
`, m)
}

handler.help = ['لصورة <ملصق>']
handler.tags = ['تحويل']
handler.command = ['لصورة', 'jpg', 'aimg', 'toimg'] // تم إضافة 'toimg' للشمولية

export default handler