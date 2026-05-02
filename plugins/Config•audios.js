// الأفضل إنشاء ملف جديد للأوديو العربي
// أنصح باسم: Config•audios-ar.js

let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat]
if (chat.isBanned) return
global.db.data.users[m.sender].money += 50
global.db.data.users[m.sender].exp += 50  

// ✅ إضافة ردود عربية جديدة
if (/^يا بوت|بوت|يا كيرا|كيرا$/i.test(m.text) && chat.audios) {  
if (!db.data.chats[m.chat].audios && m.isGroup) return 0    
let vn = 'https://qu.ax/xynz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'bot.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}  

if (/^صباح الخير|مساء الخير|اهلاً|مرحباً$/i.test(m.text) && chat.audios) {  
let vn = 'https://qu.ax/TTfs.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'welcome.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })} 

if (chat.audios && m.text.match(/(🥳|🤗|أهلاً وسهلاً|مرحبا)/gi)) {
let vn = 'https://qu.ax/cUYg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
conn.sendMessage(m.chat, { audio: { url: vn }, contextInfo: { "externalAdReply": { "title": packname, "body": botname, "previewType": "PHOTO", "thumbnailUrl": null,"thumbnail": icons, "sourceUrl": redes, "showAdAttribution": true}}, ptt: true, mimetype: 'audio/mpeg', fileName: `welcome.mp3` }, { quoted: estilo })}

if (chat.audios && m.text.match(/(احبك|بحبك|غالي|عزيز)/gi)) {    
let vn = 'https://qu.ax/rGdn.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'love.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

if (chat.audios && m.text.match(/(حزين|زعلان|تعبان|مكتئب|🥹|🥺|😭)/gi)) {    
let vn = 'https://qu.ax/VrjA.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'sad.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

if (chat.audios && m.text.match(/(الله|يارب|استغفر الله|سبحان الله)/gi)) {    
let vn = 'https://qu.ax/AWdx.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'allah.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

if (chat.audios && m.text.match(/(😂|🤣|هههه|ضحك|مضحك)/gi)) {    
let vn = 'https://qu.ax/EDUC.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'laugh.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

// ✅ الحفاظ على بعض الردود العالمية مع تسمية عربية
if (chat.audios && m.text.match(/(WTF|يا لهوي|يا سلام|مستحيل)/gi)) {
let vn = 'https://qu.ax/aPtM.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'surprise.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

if (chat.audios && m.text.match(/(برافو|ماشاء الله|واو|رائع)/gi)) {
let vn = 'https://qu.ax/hapR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'bravo.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: fkontak })}

return true 
}

export default handler