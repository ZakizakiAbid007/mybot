import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!m.quoted) return m.reply('*⚠️ قم بالرد على الملصق!*')
  let stiker = false
  try {
   await m.react(rwait)
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply('⚠️ *قم بالرد على ملصق*')
    let img = await m.quoted.download()
    if (!img) return m.reply('⚠️ *قم بالرد على ملصق!*')
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
     if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, true, { 
         contextInfo: { 
             'forwardingScore': 200, 
             'isForwarded': false, 
             externalAdReply: { 
                 showAdAttribution: false, 
                 title: `🍁 كيرا تنغن`,
                 body: `🍁 صنع بواسطة • كيرا`,
                 mediaType: 2, 
                 sourceUrl: redes, 
                 thumbnail: icons
             }
         }
     }, { quoted: m })
     await m.react(done)
     throw '⚠️ *فشل التحويل.*'
  }
}
handler.help = ['take *<اسم>|<مؤلف>*']
handler.tags = ['sticker']
handler.command = ['take', 'حقوق', 'wm', 'سر', 'خذ'] 

export default handler