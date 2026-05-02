import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {

let grupos = `*مـرحـبـاً!، أدعوك للانضمام إلى القناة الرسمية للملك تنغن!* 👑

📢 *قـنـاة تنغن الـرسـمـيـة:*

*✰* https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V
*✰* تنغن - King of Festivals

*─ׄ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׄ*

➠ تابعنا للحصول على آخر التحديثات والمهرجانات!

> ${dev || 'YotsubaBot-MD'}` // استخدام dev أو قيمة افتراضية

// إرسال صورة مع النص المنسق
await conn.sendFile(m.chat, imagen3, "tnghn_channel.jpg", grupos, fkontak, null, rcanal)
// ملاحظة: يجب أن تكون المتغيرات {imagen3}, {fkontak}, و {rcanal} مُعرَّفة كـ global.

await m.react(emojis) 
// ملاحظة: يجب أن يكون المتغير {emojis} مُعرَّفاً ليعمل التفاعل.

}
handler.help = ['channel', 'قناتي']
handler.tags = ['main', 'تواصل']
handler.command = ['قناتي', 'القناة_الرسمية', 'channel']
export default handler