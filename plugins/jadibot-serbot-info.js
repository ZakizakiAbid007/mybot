// الكود للملك تنغن 👑
// لا تنسى الإشارة لمصدر الكود الأصلي
import fs from 'fs'
import path from 'path'

async function handler(m, { conn: stars, usedPrefix }) {
    // الحد الأقصى للبوتات الفرعية المسموح بها
    const maxSubBots = 500 
    // الحصول على قائمة الاتصالات (البوتات الفرعية)
    const conns = Array.isArray(global.conns) ? global.conns : []

    // وظيفة التحقق من أن الاتصال مفتوح ونشط
    const isConnOpen = (c) => {
        try {
            return c?.ws?.socket?.readyState === 1 // التحقق من حالة الاتصال
        } catch {
            return !!c?.user?.id // التحقق من وجود معرف المستخدم
        }
    }

    // تجميع البوتات الفرعية النشطة والفريدة
    const unique = new Map()
    for (const c of conns) {
        if (!c || !c.user) continue
        if (!isConnOpen(c)) continue
        const jidRaw = c.user.jid || c.user.id || ''
        if (!jidRaw) continue
        unique.set(jidRaw, c)
    }

    const users = [...unique.values()]
    const totalUsers = users.length
    const availableSlots = Math.max(0, maxSubBots - totalUsers) // حساب المساحات المتاحة

    let responseMessage = `˚₊·—̳͟͞͞✞ *تابِعِي (SubBots) Black-clover-MD 🥷🏻*\n\n`

    if (totalUsers === 0) {
        // الرد عندما لا يوجد بوتات متصلة
        responseMessage += `✞ الحالة:\n> ⤿ لا يوجد أي *تابِع مُتصل* الآن. الجميع في إجازة! 😒\n\n✞ المعلومات:\n> ⤿ 🟢 المقاعد المتاحة: *${availableSlots}*`
    } else if (totalUsers <= 15) {
        // الرد عندما يكون العدد قليلاً (عرض القائمة)
        const listado = users
            .map((v, i) => {
                const num = v.user.jid.replace(/[^0-9]/g, '')
                const nombre = v?.user?.name || v?.user?.pushName || '👤 تابع غير مسمى'
                const waLink = `https://wa.me/${num}?text=${usedPrefix}code`
                return `✞ التابِع #${i + 1}\n> ⤿ 👾 @${num}\n> ⤿ 🌐 ${waLink}\n> ⤿ 🧠 ${nombre}`
            })
            .join('\n\n')

        responseMessage += `✞ الحالة:\n> ⤿ 🔢 الإجمالي المُتصل: *${totalUsers}*\n> ⤿ 🟢 المقاعد المتاحة: *${availableSlots}*\n\n*القائمة التفصيلية:*\n${listado}`
    } else {
        // الرد عندما يكون العدد كبيراً (رسالة مختصرة وقمعية)
        responseMessage += `✞ الحالة:\n> ⤿ 🔢 الإجمالي المُتصل: *${totalUsers}*\n> ⤿ 🟢 المقاعد المتاحة: *${availableSlots}*\n\nᥫ᭡ ملاحظة قمعية:\n> ⤿ هناك عدد كبير جداً من التوابع. *لا وقت لعرض كل هذه الأسماء التافهة!* 🙄`
    }

    // تم تغيير هذا السطر ليصبح رابط قناتك الملكية
    responseMessage += `\n\n👑 *قناة الملك الرسمية:* https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V`

    // محاولة قراءة صورة عشوائية من مسار محدد لاستخدامها كـ Thumbnail
    const imgDir = path.resolve('./src/img')
    let images = []
    try {
        images = fs.readdirSync(imgDir).filter(file => /\.(jpe?g|png|webp)$/i.test(file))
    } catch {
        images = []
    }

    const randomImage = images.length > 0 ? path.join(imgDir, images[Math.floor(Math.random() * images.length)]) : null
    const thumbnailBuffer = randomImage ? fs.readFileSync(randomImage) : null

    try {
        await stars.sendMessage(
            m.chat,
            {
                text: responseMessage,
                // التأكد من الإشارة لجميع الأرقام الموجودة في الرسالة
                mentions: [...new Set((responseMessage.match(/@(\d{5,16})/g) || []).map(v => v.replace('@', '') + '@s.whatsapp.net'))],
                contextInfo: {
                    externalAdReply: {
                        title: "˚₊·—̳͟͞͞✞ التوابع النشطة",
                        body: "حالة التوابع في الوقت الحقيقي",
                        mediaType: 1,
                        renderLargerThumbnail: false, 
                        // تم تثبيت رابط قناتك هنا
                        sourceUrl: "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V", 
                        thumbnail: thumbnailBuffer
                    }
                }
            },
            { quoted: m }
        )
    } catch (e) {
        console.error('❌ خطأ في إرسال قائمة التوابع:', e)
        // في حالة فشل الرد مع الـ externalAdReply، أرسل النص فقط
        await stars.sendMessage(m.chat, { text: responseMessage }, { quoted: m })
    }
}

handler.command = ['بوتاتي', 'اتباعي', 'قائمة_التوابع', 'حالة_البوتات']
handler.help = ['bots', 'حالة_البوتات']
handler.tags = ['البوتات_الفرعية']
export default handler