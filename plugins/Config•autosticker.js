import { sticker } from '../lib/sticker.js'

let handler = m => m

handler.all = async function (m) {
  let chat = global.db.data.chats[m.chat] // بيانات الدردشة
  let user = global.db.data.users[m.sender] // بيانات المستخدم

  // 1. التحقق من تفعيل الخاصية وفي المجموعة
  if (chat.autosticker && m.isGroup) {
    let q = m
    let stiker = false
    let mime = (q.msg || q).mimetype || q.mediaType || '' // نوع الوسائط

    // تجاهل إذا كانت الرسالة ملصقًا بالفعل (webp)
    if (/webp/g.test(mime)) return

    // 2. معالجة الصور
    if (/image/g.test(mime)) {
      let img = await q.download?.()
      if (!img) return
      stiker = await sticker(img, false, packname, author) // إنشاء الملصق

    // 3. معالجة مقاطع الفيديو
    } else if (/video/g.test(mime)) {
      // التحقق من مدة الفيديو (يجب أن لا يتجاوز 7 ثوانٍ)
      if ((q.msg || q).seconds > 8)
        return await m.reply('᥀·࣭࣪̇˖🚩◗  *يجب ألا تتجاوز مدة الفيديو 7 ثوانٍ، حاول مرة أخرى.*')

      let vid = await q.download()
      if (!vid) return
      stiker = await sticker(vid, false, packname, author) // إنشاء الملصق

    // 4. معالجة رابط وسائط مباشر
    } else if (m.text.split(/\n| /i)[0]) {
      if (isUrl(m.text)) {
        stiker = await sticker(false, m.text.split(/\n| /i)[0], packname, author) // إنشاء ملصق من الرابط
      } else return
    }

    // 5. إرسال الملصق في حال إنشائه بنجاح
    if (stiker) {
      const سياق_المعلومات = {
        externalAdReply: {
          showAdAttribution: false,
          title: `ملصقات تلقائية 😈`,
          body: `✡︎ كيرا-MD • تنغن`,
          mediaType: 2,
          sourceUrl: global.redes || '',
          thumbnail: global.icons || null
        }
      }

      await conn.sendMessage(m.chat, {
        sticker: stiker,
        contextInfo: سياق_المعلومات
      }, { quoted: m }) // الرد كـ (اقتباس) على الرسالة الأصلية
    }
  }

  return !0
}

export default handler

// دالة مساعدة للتحقق من أن النص هو رابط وسائط
const isUrl = (text) => {
  return text.match(
    // يتحقق من رابط http/https ينتهي بصيغة وسائط (jpg, gif, png, mp4)
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/gi
  )
}