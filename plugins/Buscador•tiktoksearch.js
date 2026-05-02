import axios from 'axios'
const {proto, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent, getDevice} = (await import("@whiskeysockets/baileys")).default

let handler = async (message, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(message.chat, 
`🎵 *البحث في تيك توك*\n\n` +
`📝 *الاستخدام:*\n` +
`اكتب ما تريد البحث عنه في تيك توك\n\n` +
`✨ *أمثلة:*\n` +
`${usedPrefix + command} رقص\n` +
`${usedPrefix + command} كوميديا\n` +
`${usedPrefix + command} طبخ\n` +
`${usedPrefix + command} أغاني`, message, rcanal)

async function createVideoMessage(url) {
const { videoMessage } = await generateWAMessageContent({ video: { url } }, { upload: conn.waUploadToServer })
return videoMessage
}

async function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]]
}
}

try {
await message.react('⏳')
conn.reply(message.chat, '📥 جاري تحميل الفيديوهات...', message, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, thumbnail: icons,
sourceUrl: channel }}})

let results = []
let { data: response } = await axios.get('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + encodeURIComponent(text))
let searchResults = response.data

if (!searchResults || searchResults.length === 0) {
await message.react('❌')
return conn.reply(message.chat, `❌ *لم يتم العثور على نتائج*\n\nلا توجد فيديوهات عن: "${text}"`, message, rcanal)
}

shuffleArray(searchResults)
let selectedResults = searchResults.splice(0, 7)

for (let result of selectedResults) {
results.push({
body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: dev }),
header: proto.Message.InteractiveMessage.Header.fromObject({
title: '' + result.title,
hasMediaAttachment: true,
videoMessage: await createVideoMessage(result.nowm)
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })})}

const responseMessage = generateWAMessageFromContent(message.chat, {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.create({ text: '🎵 نتائج البحث عن: ' + text }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: '🔍 تيك توك - بحث' }),
header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: [...results] })})}}
}, { quoted: message })

await message.react('✅')
await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseKey.id })

} catch (error) {
console.error(error)
await message.react('❌')
await conn.reply(message.chat, 
`❌ *حدث خطأ في البحث*\n\n` +
`لم أتمكن من البحث عن: "${text}"\n` +
`يرجى المحاولة مرة أخرى لاحقاً`, message, rcanal)
}}

handler.help = ['tiktoksearch <بحث>', 'تيكتوك', 'بحث-تيكتوك']
handler.cookies = 1
handler.register = true
handler.tags = ['buscador', 'بحث']
handler.command = ['tiktoksearch', 'tiktoks', 'تيكتوك', 'تيك', 'tik']
export default handler