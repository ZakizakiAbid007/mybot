// File: سرعة.js (الاسم المقترح)

import { totalmem, freemem } from 'os'
import speed from 'performance-now'
import { sizeFormatter } from 'human-readable'
import fs from 'fs'
import path from 'path'

const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
})

const imgDir = path.resolve('./src/img')
let images = []

try {
    // حاول قراءة الصور مرة واحدة
    images = fs.readdirSync(imgDir).filter(file => /\.(jpe?g|png|webp)$/i.test(file))
} catch {
    images = []
}

const getRandomImage = () => {
    if (images.length === 0) return null
    const randomImage = images[Math.floor(Math.random() * images.length)]
    return fs.readFileSync(path.join(imgDir, randomImage))
}

var handler = async (m, { conn }) => {
    let timestamp = speed()
    let latensi = speed() - timestamp // سرعة الاستجابة

    let _muptime = process.uptime() * 1000
    let muptime = clockString(_muptime) // مدة التشغيل

    let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
    let groups = Object.entries(conn.chats)
        .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce)
        .map(v => v[0])

    // -------------------- [ النص المعرّب ] --------------------
    let texto = `*👑 تـنـغـن بـوت - مـعـلـومـات الـنـظـام ⚙️*
    
    *⏱ الـسـرعـة:*
    > ⤿ ${latensi.toFixed(4)} ثانية (مللي ثانية)

    * uptime مـدة الـتـشـغـيـل:*
    > ⤿ ${muptime}

    *👥 الإحـصـائـيـات:*
    > ⤿ ${chats.length} دردشة خاصة
    > ⤿ ${groups.length} مجموعة نشطة

    *💾 الـخـادم (RAM):*
    > ⤿ مُستخدم: ${format(totalmem() - freemem())}
    > ⤿ الكلي: ${format(totalmem())}
    
    *『تـنـغـن﹝👑﹞بـوت』*
    `.trim()

    const thumbnailBuffer = getRandomImage()

    conn.sendMessage(
        m.chat,
        {
            text: texto,
            contextInfo: {
                externalAdReply: {
                    title: "⏱ سرعة استجابة البوت",
                    body: `الوضع الحالي: ${latensi.toFixed(4)} ثانية`,
                    thumbnail: thumbnailBuffer,
                    mediaType: 1,
                    renderLargerThumbnail: true, // يفضل تفعيلها
                    sourceUrl: "https://wa.me/" + m.sender.split('@')[0]
                }
            }
        },
        { quoted: m }
    )
}

handler.help = ['ping']
handler.tags = ['أدوات'] // تعريب الوسم
handler.command = ['ping', 'p', 'سرعة', 'حالة']
handler.register = true

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}