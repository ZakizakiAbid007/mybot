import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  // تحديد الرسالة المقتبسة أو المرسلة
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  // التحقق من أن المدخل هو صورة JPEG أو PNG
  if (!/image\/(jpe?g|png)/i.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(`خطأ! الرجاء الرد أو إرسال صورة مع الأمر:\n*${usedPrefix + command}*`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }) // إشارة بدء المعالجة

    const media = await quoted.download() // تنزيل الوسائط
    const ext = mime.split('/')[1]
    const filename = `upscaled_${Date.now()}.${ext}`

    // بناء بيانات النموذج للإرسال إلى API
    const form = new FormData()
    form.append('image', media, { filename, contentType: mime })
    form.append('scale', '2') // طلب مضاعفة الدقة

    // إعداد الرؤوس (Headers) للطلب
    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      'x-client-version': 'web',
      'x-locale': 'en'
    }

    // إرسال طلب لزيادة الدقة
    const res = await fetch('https://api2.pixelcut.app/image/upscale/v1', {
      method: 'POST',
      headers,
      body: form
    })

    const json = await res.json()
    // التحقق من نجاح الحصول على رابط النتيجة
    if (!json?.result_url || !json.result_url.startsWith('http')) throw new Error('تعذر الحصول على رابط الصورة المحسّنة.')

    // جلب الصورة المحسّنة من الرابط
    const resultBuffer = await (await fetch(json.result_url)).buffer()

    // إرسال النتيجة للمستخدم
    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: '✨ تم تحسين صورتك إلى دقة 2x.'
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }) // إشارة النجاح
  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }) // إشارة الخطأ
    m.reply(`❌ حدث خطأ:\n${err.message || err}`)
  }
}

handler.help = ['تحسين_دقة'] // ترجمة المساعدة
handler.tags = ['أدوات', 'صورة'] // ترجمة الوسوم
handler.command = ['hd', 'جودة', 'remini'] // الأوامر

export default handler

// دالة remini (غير مستخدمة حاليًا في هذا المعالج، ولكنها جزء من الكود الأصلي)
async function remini(imageData, operation) {
  return new Promise(async (resolve, reject) => {
    const availableOperations = ["enhance", "recolor", "dehaze"]
    if (!availableOperations.includes(operation)) operation = availableOperations[0]

    const baseUrl = `https://inferenceengine.vyro.ai/${operation}.vyro`
    const formData = new FormData()
    formData.append("image", Buffer.from(imageData), { filename: "enhance_image_body.jpg", contentType: "image/jpeg" })
    formData.append("model_version", 1, { "Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=utf-8" })

    formData.submit({
      url: baseUrl,
      host: "inferenceengine.vyro.ai",
      path: "/" + operation,
      protocol: "https:",
      headers: { "User-Agent": "okhttp/4.9.3", Connection: "Keep-Alive", "Accept-Encoding": "gzip" }
    }, function (err, res) {
      if (err) reject(err)
      const chunks = []
      res.on("data", chunk => chunks.push(chunk))
      res.on("end", () => resolve(Buffer.concat(chunks)))
      res.on("error", err => reject(err))
    })
  })
}