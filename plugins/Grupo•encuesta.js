let handler = async (m, { conn, text, args, usedPrefix, command }) => {

if (!args[0]) throw `⚠️️ *_أدخل نصاً لبدء الاستطلاع._*\n\n📌 مثال : \n*${usedPrefix + command}* نص|نص2...`
if (!text.includes('|')) throw  `⚠️️ افصل خيارات الاستطلاع باستخدام *|* \n\n📌 مثال : \n*${usedPrefix + command}* نص|نص2...`
let a = []
let b = text.split('|')
for (let c = 0; c < b.length; c++) {
a.push([b[c]])
                        }
                        return conn.sendPoll(m.chat, `${packname}`, a, m)
}
handler.help = ['encuesta <text|text2>']
handler.tags = ['grupo'] 
handler.command = ['poll', 'encuesta', 'استطلاع', 'تصويت'] 
handler.group = true

export default handler