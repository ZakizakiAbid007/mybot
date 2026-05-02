// File: ملصق.js (Sticker Maker)
import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'
import path from 'path'

// دالة مساعدة للتحقق من الروابط
function isUrl(text) {
  return /^https?:\/\/.*\.(jpe?g|gif|png|webp)$/i.test(text)
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = null
  try {
    const q = m.quoted ? m.quoted : m // الحصول على الرسالة المستهدفة (اقتباس أو الرسالة الحالية)
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    
    // التأكد من وجود مجلد tmp للملفات المؤقتة
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

    if (/webp|image|video/g.test(mime)) {
        // 1. التحقق من مدة الفيديو (الحد الأقصى 8 ثوانٍ)
      if (/video/.test(mime) && ((q.msg || q).seconds > 8)) {
        return m.reply('⚠️ *عفواً! لا يمكن أن تتجاوز مدة الفيديو 8 ثوانٍ لإنشاء ملصق متحرك.*')
      }
      
      // 2. تنزيل الوسائط
      const media = await q.download()
      if (!media) return m.reply('❌ *لم يتمكن البوت من تنزيل الملف. تأكد من الرد على صورة/فيديو/ملصق.*')
      
      const tmpPath = path.join('./tmp', `${Date.now()}.webp`)
      
      try {
        // محاولة التحويل المباشر باستخدام دالة sticker
        stiker = await sticker(
          media,
          false,
          global.packsticker || 'ملصقات تنغن 👑', // اسم حزمة الملصقات
          global.author || 'بواسطة تنغن' // اسم المطور
        )
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      } catch (e) {
        // إذا فشل التحويل المباشر، يتم اللجوء إلى طريقة التحميل أولاً
        let out
        if (/webp/.test(mime)) out = await webp2png(media) // تحويل ملصق قديم إلى PNG
        else if (/image/.test(mime)) out = await uploadImage(media)
        else if (/video/.test(mime)) out = await uploadFile(media)
        
        if (typeof out !== 'string') out = await uploadImage(media) // محاولة تحميل أخرى كصورة
        
        // إعادة محاولة إنشاء الملصق باستخدام رابط التحميل
        stiker = await sticker(
          false,
          out,
          global.packsticker || 'ملصقات تنغن 👑',
          global.author || 'بواسطة تنغن'
        )
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      }
    } else if (args[0]) {
      // 3. التحويل من رابط مباشر
      if (isUrl(args[0])) {
        stiker = await sticker(
          false,
          args[0],
          global.packsticker || 'ملصقات تنغن 👑',
          global.author || 'بواسطة تنغن'
        )
        const tmpPath = path.join('./tmp', `${Date.now()}.webp`)
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      } else {
        return m.reply('📛 *الرابط الذي قدمته غير صالح أو لا ينتهي بصيغة صورة/ملصق.*')
      }
    } else {
      // 4. رسالة الاستخدام الخاطئ
      return m.reply(`📌 *الرجاء إرسال أو الرد على صورة/فيديو (أقصاه 8 ثوانٍ) أو تقديم رابط صالح.*\n\n*مثال:*\n> ${usedPrefix}ملصق [الرد على الصورة]`);
    }
  } catch (e) {
    console.error('❌ حدث خطأ أثناء إنشاء الملصق:', e)
    return m.reply('⚠️ *حدث خطأ غير متوقع أثناء محاولة إنشاء الملصق. الرجاء المحاولة بملف آخر.*')
  }

  // 5. إرسال الملصق
  if (stiker) {
    try {
      // إعداد contextInfo (لإضافة لمسة بصرية عن طريق صورة عشوائية)
      const imgFolder = path.join('./src/img')
      // البحث عن ملفات الصور داخل مجلد ./src/img
      const imgFiles = fs.existsSync(imgFolder) ? fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f)) : []
      let contextInfo = {}
      
      if (imgFiles.length > 0) {
        // اختيار صورة عشوائية كشعار (Thumbnail) للرسالة
        const randomImg = path.join(imgFolder, imgFiles[Math.floor(Math.random() * imgFiles.length)])
        const thumb = fs.existsSync(randomImg) ? fs.readFileSync(randomImg) : null
        if (thumb) {
          contextInfo = {
            externalAdReply: {
              title: '👑 تـنـغـن بـوت - صـانـع الـمـلـصـقـات',
              body: 'أصبح ملصقاً الآن!',
              mediaType: 2,
              thumbnail: thumb
            }
          }
        }
      }
      
      // إرسال الملصق
      if (Buffer.isBuffer(stiker)) {
        await conn.sendMessage(
          m.chat,
          { sticker: stiker, contextInfo },
          { quoted: m }
        )
      } else if (typeof stiker === 'string') { // في حالة إذا كانت النتيجة رابط مباشر
        await conn.sendMessage(
          m.chat,
          { sticker: { url: stiker }, contextInfo },
          { quoted: m }
        )
      } else {
        throw new Error('صيغة ملصق غير صالحة')
      }
    } catch (e) {
      console.error('⚠️ خطأ في إرسال الملصق:', e)
      return m.reply('❌ *عذراً، لم نتمكن من إرسال الملصق. يرجى التأكد من أن الملف صحيح.*')
    }
  } else {
    return m.reply('❌ *لم يتمكن البوت من إنشاء الملصق. تأكد من أن الملف المدعوم صورة/فيديو قصير أو رابط صحيح.*')
  }
}

handler.help = ['ملصق', 's'].map(v => v + ' <صورة|فيديو|رابط>')
handler.tags = ['أدوات']
handler.command = ['s', 'لملصق', 'stiker', 'ملصق']
handler.register = true

export default handler