import fetch from 'node-fetch'
import { lookup } from 'mime-types'

let handler = async (m, { conn, text, usedPrefix }) => {
// التحقق من وجود الرابط
if (!text) return conn.reply(m.chat, '❀ *يرجى إرسال رابط Mediafire للتحميل.*', m)

// التحقق من صلاحية الرابط
if (!/^https:\/\/www\.mediafire\.com\//i.test(text)) return conn.reply(m.chat, 'ꕥ *الرابط غير صالح.* يرجى إرسال رابط Mediafire صحيح.', m)

try {
await m.react('🕒')
const res = await fetch(`${global.APIs.delirius.url}/download/mediafire?url=${encodeURIComponent(text)}`)
const json = await res.json()
const data = json.data

// التحقق من نجاح الحصول على البيانات
if (!json.status || !data?.filename || !data?.link) { 
    throw 'ꕥ *لم نتمكن من الحصول على الملف من API.*' 
}

const filename = data.filename
const filesize = data.size || 'غير معروف'
const mimetype = data.mime || lookup(data.extension?.toLowerCase()) || 'application/octet-stream'
// فك ترميز الرابط إذا كان مشفراً (يحتوي على u=)
const dl_url = data.link.includes('u=') ? decodeURIComponent(data.link.split('u=')[1]) : data.link

const caption = `
乂 *تنزيل من Mediafire* 乂

✩ *الاسم* » ${filename}
✩ *الحجم* » ${filesize}
✩ *النوع* » ${mimetype}
✩ *الرابط الأصلي* » ${text}
`.trim()

// إرسال الملف كمستند (Document)
await conn.sendMessage(m.chat, { document: { url: dl_url }, fileName: filename, mimetype, caption }, { quoted: m })
await m.react('✔️')

} catch (e) {
await m.react('✖️')
return conn.reply(m.chat, `⚠︎ *حدث خطأ أثناء المعالجة.*\n> استخدم *${usedPrefix}report* للإبلاغ عن المشكلة.\n\n${e.message}`, m)
}}

handler.command = ['mf', 'ميديافاير']
handler.help = ['mediafire']
handler.tags = ['تنزيلات']

// تم إزالة (handler.group = true) و (handler.premium = true) مؤقتاً حسب طلبك

export default handler