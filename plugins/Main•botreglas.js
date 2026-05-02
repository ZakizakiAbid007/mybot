let handler = async (m, { conn, usedPrefix, command}) => {

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:هاتف\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let kira = `🚩 *قوانين بوت كيرا تنغن*\n
✰ لا تتصل بالبوت
✰ لا ترسل رسائل متكررة (سبام)
✰ تواصل مع المطور إذا كان ضرورياً
✰ اطلب الإذن قبل إضافة البوت إلى مجموعة

🍬 ملاحظة: *إذا لم تلتزم بقوانين البوت، سيتم حظرك.*

⚠️ تنبيه: *يمكنك دعمنا بترك نجمة 🌟 للمستودع الرسمي لكيرا.*

${global.md}`.trim()
await conn.reply(m.chat, kira, m, fake)

}
handler.help = ['قوانينالبوت']
handler.tags = ['main']
handler.command = ['قوانينالبوت', 'قوانين', 'reglasdelbot', 'reglasbot', 'reglas', 'شروط', 'شروط_البوت']
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}