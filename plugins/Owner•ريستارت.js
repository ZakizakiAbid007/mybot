import { spawn } from 'child_process'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let handler = async (m, { conn, isROwner, text }) => {

// رسالة خطأ إذا لم يكن البوت يعمل ضمن مدير عمليات (مثل PM2)
if (!process.send) throw '*『✦』لإعادة التشغيل يدوياً: node start.js*\n*『✦』لإعادة التشغيل يدوياً: node index.js*'

// التحقق من أن الكود يعمل ضمن البوت نفسه
if (conn.user.jid == conn.user.jid) {

// إرسال تسلسل رسائل التحميل قبل البدء بالعملية
const { key } = await conn.sendMessage(m.chat, {text: `🗂️ جارٍ التحميل...`}, {quoted: m})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `📦 جارٍ التحميل...`, edit: key})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `♻️ جارٍ التحميل...`, edit: key})
await conn.sendMessage(m.chat, {text: `*『⛏️』بدء عملية إعادة التشغيل الكاملة...*`, edit: key})

// إرسال الإشارة إلى مدير العمليات لإعادة تشغيل البوت
process.send('reset')
} else throw 'eh'
}

handler.help = ['إعادة_تشغيل']
handler.tags = ['owner']
handler.command = ['إعادة_تشغيل', 'ريستارت'] // الأوامر المعربة
handler.rowner = true

export default handler