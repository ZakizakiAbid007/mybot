import { webp2png } from '../lib/webp2mp4.js'

var handler = async (m, { conn, usedPrefix, command }) => {

const notStickerMessage = `*🌳 قم بالرد على الملصق*`
if (!m.quoted) throw notStickerMessage 
const q = m.quoted || m
let mime = q.mediaType || ''
if (!/sticker/.test(mime)) throw notStickerMessage

conn.reply(m.chat, '⏳ جاري التحويل...', m, {
contextInfo: { 
    externalAdReply: { 
        mediaUrl: null, 
        mediaType: 1, 
        showAdAttribution: true,
        title: packname,
        body: dev,
        previewType: 0, 
        thumbnail: icons,
        sourceUrl: channel 
    }
}})

let media = await q.download()
let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
await conn.sendFile(m.chat, out, 'image.png', null, m)

}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg', 'jpg', 'jpge', 'png', 'لصورة']

handler.cookies = 2

export default handler