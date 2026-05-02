import { canLevelUp, xpRange } from '../lib/levelling.js'
import { levelup } from '../lib/canvas.js'

let handler = m => m
handler.before = async function (m, { conn, usedPrefix }) {

if (!db.data.chats[m.chat].autolevelup) return
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
let mentionedJid = [who]
let username = conn.getName(who)
let userName = m.pushName || 'مجهول'

let user = global.db.data.users[m.sender]
let chat = global.db.data.chats[m.chat]
if (!chat.autolevelup)
return !0

let level = user.level
let before = user.level * 1
while (canLevelUp(user.level, user.exp, global.multiplier)) 
user.level++
if (before !== user.level) {
let currentRole = Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level + 1 >= minLevel)[0]
let nextRole = Object.entries(roles).sort((a, b) => a[1] - b[1]).find(([, minLevel]) => level + 2 < minLevel)[0]

//if (user.role != currentRole && level >= 1) {
if (level >= 1) {
user.role = currentRole
let text22 = `✨ مبروك *${userName}*، على رتبتك الجديدة!\n\n\`الرتبة الجديدة:\`\n${currentRole}`
if (nextRole) {
text22 += `\n\n> الرتبة التالية ${nextRole}، في *المستوى ${roles[nextRole]}*. استمر في التقدم!`
}

await conn.sendMessage(global.channelid, { text: text22, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار 🔔 】",
body: '🥳 شخص حصل على رتبة جديدة!',
thumbnailUrl: perfil,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null }) 
}

m.reply(`*🎉 م ب ر و و ك ! 🎉*\n\n💫 المستوى الحالي » *${user.level}*\n🌵 الرتبة » ${user.role}\n📆 التاريخ » *${moment.tz('Africa/Cairo').format('DD/MM/YY')}*\n\n> *\`لقد وصلت إلى مستوى جديد!\`*`)

let especial = 'كوكيز'
let especial2 = 'خبرة'
let especial3 = 'مال'
let especial4 = 'انضمام'

let especialCant = Math.floor(Math.random() * (9 - 6 + 1)) + 6 // المدى: 6 إلى 9
let especialCant2 = Math.floor(Math.random() * (10 - 6 + 1)) + 6 // المدى: 6 إلى 10
let especialCant3 = Math.floor(Math.random() * (10 - 6 + 1)) + 6 // المدى: 6 إلى 10
let especialCant4 = Math.floor(Math.random() * (3 - 2 + 1)) + 2 // المدى: 2 إلى 3

let normal = ['جرعة', 'ماء', 'قمامة', 'خشب', 'صخر', 'حجر', 'خيط', 'حديد', 'فحم', 'زجاجة', 'علبة', 'كرتون'].getRandom()
let normal2 = ['طعام الحيوان', 'طعام القنطور', 'طعام الغريفين', 'طعام كيوبي', 'طعام التنين', 'طعام الحيوان الأليف', 'طعام الفينيق'].getRandom()
let normal3 = ['عنب', 'تفاح', 'برتقال', 'مانجو', 'موز'].getRandom()

let normalCant = [1, 3, 3, 3, 4, 4, 2, 2, 4, 4, 4, 4, 1].getRandom() 
let normalCant2 = [1, 3, 2, 2, 4, 4, 2, 2, 4, 4, 5, 5, 1].getRandom() 
let normalCant3 = [1, 3, 3, 3, 4, 4, 2, 2, 4, 4, 4, 4, 1].getRandom() 

if (level >= 1) {
let chtxt = `👤 *المستخدم:* ${userName}\n🐢 *المستوى السابق:* ${before}\n⭐️ *المستوى الحالي:* ${level + 1}\n👾 *الرتبة:* ${user.role}\n🍄 *البوت* » يوتسوبا-بوت ✨️🍁${(level + 1) % 5 === 0 ? `\n\n💰 *مكافأة الوصول للمستوى ${level + 1}:*
🎁 *مضاعف:* \`X${Math.floor(((level + 1) - 5) / 10) + 1}\`
- *${especialCant * (Math.floor(((level + 1) - 5) / 10) + 1)} 🍪 ${especial}*
- *${especialCant2 * (Math.floor(((level + 1) - 5) / 10) + 1)} ✨️ ${especial2}*
- *${especialCant3 * (Math.floor(((level + 1) - 5) / 10) + 1)} 💸 ${especial3}*
- *${especialCant4 * (Math.floor(((level + 1) - 5) / 10) + 1)} 🪙 ${especial4}*

> 👀 المكافأة التالية في *المستوى ${level + 6}*` : ''}`.trim()
await conn.sendMessage(global.channelid, { text: chtxt, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار 🔔 】",
body: '🥳 مستخدم حصل على مستوى جديد!',
thumbnailUrl: perfil, 
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
}

if (user.level == 5){
conn.reply(m.chat, `*🥳 مكافأة مستوى 5 الجديد!!* 🏆
ᰔᩚ *${especialCant * 1} ${especial}*
ᰔᩚ *${especialCant2 * 1} ${especial2}*
ᰔᩚ *${especialCant3 * 1} ${especial3}*
ᰔᩚ *${especialCant4 * 1} ${especial4}*`, m)
user[especial] += especialCant * 1
user[especial2] += especialCant2 * 1
user[especial3] += especialCant3 * 1
user[especial4] += especialCant4 * 1

}else if (user.level == 10){
conn.reply(m.chat, `*🥳 مكافأة مستوى 10 الجديد!!* 🏆
ᰔᩚ *${especialCant * 1} ${especial}*
ᰔᩚ *${especialCant2 * 1} ${especial2}*
ᰔᩚ *${especialCant3 * 1} ${especial3}*
ᰔᩚ *${especialCant4 * 1} ${especial4}*`, m)
user[especial] += especialCant * 1
user[especial2] += especialCant2 * 1
user[especial3] += especialCant3 * 1
user[especial4] += especialCant4 * 1

}else if (user.level == 15){
conn.reply(m.chat, `*🥳 مكافأة مستوى 15 الجديد!!* 🏆
ᰔᩚ *${especialCant * 2} ${especial}*
ᰔᩚ *${especialCant2 * 2} ${especial2}*
ᰔᩚ *${especialCant3 * 2} ${especial3}*
ᰔᩚ *${especialCant4 * 2} ${especial4}*`, m)
user[especial] += especialCant * 2
user[especial2] += especialCant2 * 2
user[especial3] += especialCant3 * 2
user[especial4] += especialCant4 * 2

}else if (user.level == 20){
conn.reply(m.chat, `*🥳 مكافأة مستوى 20 الجديد!!* 🏆
ᰔᩚ *${especialCant * 2} ${especial}*
ᰔᩚ *${especialCant2 * 2} ${especial2}*
ᰔᩚ *${especialCant3 * 2} ${especial3}*
ᰔᩚ *${especialCant4 * 2} ${especial4}*`, m)
user[especial] += especialCant * 2
user[especial2] += especialCant2 * 2
user[especial3] += especialCant3 * 2
user[especial4] += especialCant4 * 2

}else if (user.level == 25){
conn.reply(m.chat, `*🥳 مكافأة مستوى 25 الجديد!!* 🏆
ᰔᩚ *${especialCant * 3} ${especial}*
ᰔᩚ *${especialCant2 * 3} ${especial2}*
ᰔᩚ *${especialCant3 * 3} ${especial3}*
ᰔᩚ *${especialCant4 * 3} ${especial4}*`, m)
user[especial] += especialCant * 3
user[especial2] += especialCant2 * 3
user[especial3] += especialCant3 * 3
user[especial4] += especialCant4 * 3

}else if (user.level == 30){
conn.reply(m.chat, `*🥳 مكافأة مستوى 30 الجديد!!* 🏆
ᰔᩚ *${especialCant * 3} ${especial}*
ᰔᩚ *${especialCant2 * 3} ${especial2}*
ᰔᩚ *${especialCant3 * 3} ${especial3}*
ᰔᩚ *${especialCant4 * 3} ${especial4}*`, m)
user[especial] += especialCant * 3
user[especial2] += especialCant2 * 3
user[especial3] += especialCant3 * 3
user[especial4] += especialCant4 * 3

}else if (user.level == 35){
conn.reply(m.chat, `*🥳 مكافأة مستوى 35 الجديد!!* 🏆
ᰔᩚ *${especialCant * 4} ${especial}*
ᰔᩚ *${especialCant2 * 4} ${especial2}*
ᰔᩚ *${especialCant3 * 4} ${especial3}*
ᰔᩚ *${especialCant4 * 4} ${especial4}*`, m)
user[especial] += especialCant * 4
user[especial2] += especialCant2 * 4
user[especial3] += especialCant3 * 4
user[especial4] += especialCant4 * 4

}else if (user.level == 40){
conn.reply(m.chat, `*🥳 مكافأة مستوى 40 الجديد!!* 🏆
ᰔᩚ *${especialCant * 4} ${especial}*
ᰔᩚ *${especialCant2 * 4} ${especial2}*
ᰔᩚ *${especialCant3 * 4} ${especial3}*
ᰔᩚ *${especialCant4 * 4} ${especial4}*`, m)
user[especial] += especialCant * 4
user[especial2] += especialCant2 * 4
user[especial3] += especialCant3 * 4
user[especial4] += especialCant4 * 4

}else if (user.level == 45){
conn.reply(m.chat, `*🥳 مكافأة مستوى 45 الجديد!!* 🏆
ᰔᩚ *${especialCant * 5} ${especial}*
ᰔᩚ *${especialCant2 * 5} ${especial2}*
ᰔᩚ *${especialCant3 * 5} ${especial3}*
ᰔᩚ *${especialCant4 * 5} ${especial4}*`, m)
user[especial] += especialCant * 5
user[especial2] += especialCant2 * 5
user[especial3] += especialCant3 * 5
user[especial4] += especialCant4 * 5

}else if (user.level == 50){
conn.reply(m.chat, `*🥳 مكافأة مستوى 50 الجديد!!* 🏆
ᰔᩚ *${especialCant * 5} ${especial}*
ᰔᩚ *${especialCant2 * 5} ${especial2}*
ᰔᩚ *${especialCant3 * 5} ${especial3}*
ᰔᩚ *${especialCant4 * 5} ${especial4}*`, m)
user[especial] += especialCant * 5
user[especial2] += especialCant2 * 5
user[especial3] += especialCant3 * 5
user[especial4] += especialCant4 * 5

}else if (user.level == 55){
conn.reply(m.chat, `*🥳 مكافأة مستوى 55 الجديد!!* 🏆
ᰔᩚ *${especialCant * 6} ${especial}*
ᰔᩚ *${especialCant2 * 6} ${especial2}*
ᰔᩚ *${especialCant3 * 6} ${especial3}*
ᰔᩚ *${especialCant4 * 6} ${especial4}*`, m)
user[especial] += especialCant * 6
user[especial2] += especialCant2 * 6
user[especial3] += especialCant3 * 6
user[especial4] += especialCant4 * 6

}else if (user.level == 60){
conn.reply(m.chat, `*🥳 مكافأة مستوى 60 الجديد!!* 🏆
ᰔᩚ *${especialCant * 6} ${especial}*
ᰔᩚ *${especialCant2 * 6} ${especial2}*
ᰔᩚ *${especialCant3 * 6} ${especial3}*
ᰔᩚ *${especialCant4 * 6} ${especial4}*`, m)
user[especial] += especialCant * 6
user[especial2] += especialCant2 * 6
user[especial3] += especialCant3 * 6
user[especial4] += especialCant4 * 6

}else if (user.level == 65){
conn.reply(m.chat, `*🥳 مكافأة مستوى 65 الجديد!!* 🏆
ᰔᩚ *${especialCant * 7} ${especial}*
ᰔᩚ *${especialCant2 * 7} ${especial2}*
ᰔᩚ *${especialCant3 * 7} ${especial3}*
ᰔᩚ *${especialCant4 * 7} ${especial4}*`, m)
user[especial] += especialCant * 7
user[especial2] += especialCant2 * 7
user[especial3] += especialCant3 * 7
user[especial4] += especialCant4 * 7

}else if (user.level == 70){
conn.reply(m.chat, `*🥳 مكافأة مستوى 70 الجديد!!* 🏆
ᰔᩚ *${especialCant * 7} ${especial}*
ᰔᩚ *${especialCant2 * 7} ${especial2}*
ᰔᩚ *${especialCant3 * 7} ${especial3}*
ᰔᩚ *${especialCant4 * 7} ${especial4}*`, m)
user[especial] += especialCant * 7
user[especial2] += especialCant2 * 7
user[especial3] += especialCant3 * 7
user[especial4] += especialCant4 * 7

}else if (user.level == 75){
conn.reply(m.chat, `*🥳 مكافأة مستوى 75 الجديد!!* 🏆
ᰔᩚ *${especialCant * 8} ${especial}*
ᰔᩚ *${especialCant2 * 8} ${especial2}*
ᰔᩚ *${especialCant3 * 8} ${especial3}*
ᰔᩚ *${especialCant4 * 8} ${especial4}*`, m) 
user[especial] += especialCant * 8
user[especial2] += especialCant2 * 8
user[especial3] += especialCant3 * 8
user[especial4] += especialCant4 * 8

}else if (user.level == 80){
conn.reply(m.chat, `*🥳 مكافأة مستوى 80 الجديد!!* 🏆
ᰔᩚ *${especialCant * 8} ${especial}*
ᰔᩚ *${especialCant2 * 8} ${especial2}*
ᰔᩚ *${especialCant3 * 8} ${especial3}*
ᰔᩚ *${especialCant4 * 8} ${especial4}*`, m)
user[especial] += especialCant * 8
user[especial2] += especialCant2 * 8
user[especial3] += especialCant3 * 8
user[especial4] += especialCant4 * 8

}else if (user.level == 85){
conn.reply(m.chat, `*🥳 مكافأة مستوى 85 الجديد!!* 🏆
ᰔᩚ *${especialCant * 9} ${especial}*
ᰔᩚ *${especialCant2 * 9} ${especial2}*
ᰔᩚ *${especialCant3 * 9} ${especial3}*
ᰔᩚ *${especialCant4 * 9} ${especial4}*`, m)
user[especial] += especialCant * 9
user[especial2] += especialCant2 * 9
user[especial3] += especialCant3 * 9
user[especial4] += especialCant4 * 9

}else if (user.level == 90){
conn.reply(m.chat, `*🥳 مكافأة مستوى 90 الجديد!!* 🏆
ᰔᩚ *${especialCant * 9} ${especial}*
ᰔᩚ *${especialCant2 * 9} ${especial2}*
ᰔᩚ *${especialCant3 * 9} ${especial3}*
ᰔᩚ *${especialCant4 * 9} ${especial4}*`, m)
user[especial] += especialCant * 9
user[especial2] += especialCant2 * 9
user[especial3] += especialCant3 * 9
user[especial4] += especialCant4 * 9

}else if (user.level == 95){
conn.reply(m.chat, `*🥳 مكافأة مستوى 95 الجديد!!* 🏆
ᰔᩚ *${especialCant * 10} ${especial}*
ᰔᩚ *${especialCant2 * 10} ${especial2}*
ᰔᩚ *${especialCant3 * 10} ${especial3}*
ᰔᩚ *${especialCant4 * 10} ${especial4}*`, m)
user[especial] += especialCant * 10
user[especial2] += especialCant2 * 10
user[especial3] += especialCant3 * 10
user[especial4] += especialCant4 * 10

}else if (user.level == 100){
conn.reply(m.chat, `*🥳 مكافأة مستوى 100 الجديد!!* 🏆
ᰔᩚ *${especialCant * 10} ${especial}*
ᰔᩚ *${especialCant2 * 10} ${especial2}*
ᰔᩚ *${especialCant3 * 10} ${especial3}*
ᰔᩚ *${especialCant4 * 10} ${especial4}*`, m)
user[especial] += especialCant * 10
user[especial2] += especialCant2 * 10
user[especial3] += especialCant3 * 10
user[especial4] += especialCant4 * 10

}else{        

}

}}                
export default handler

global.roles = {
// المستوى 0-9: المبتدئين
'🌱 *مغامر(ة) - مبتدئ(ة) V*': 0,
'🌱 *مغامر(ة) - مبتدئ(ة) IV*': 2,
'🌱 *مغامر(ة) - مبتدئ(ة) III*': 4,
'🌱 *مغامر(ة) - مبتدئ(ة) II*': 6,
'🌱 *مغامر(ة) - مبتدئ(ة) I*': 8,

// المستوى 10-19: المتعلمين
'🛠️ *متعلم الطريق V*': 10,
'🛠️ *متعلم الطريق IV*': 12,
'🛠️ *متعلم الطريق III*': 14,
'🛠️ *متعلم الطريق II*': 16,
'🛠️ *متعلم الطريق I*': 18,

// المستوى 20-29: المستكشفين
'⚔️ *مستكشف(ة) الوادي V*': 20,
'⚔️ *مستكشف(ة) الوادي IV*': 22,
'⚔️ *مستكشف(ة) الوادي III*': 24,
'⚔️ *مستكشف(ة) الوادي II*': 26,
'⚔️ *مستكشف(ة) الوادي I*': 28,

// المستوى 30-39: المحاربين
'🏹 *محارب(ة) الفجر V*': 30,
'🏹 *محارب(ة) الفجر IV*': 32,
'🏹 *محارب(ة) الفجر III*': 34,
'🏹 *محارب(ة) الفجر II*': 36,
'🏹 *محارب(ة) الفجر I*': 38,

// المستوى 40-49: الحراس
'🛡️ *حارس(ة) الغابات V*': 40,
'🛡️ *حارس(ة) الغابات IV*': 42,
'🛡️ *حارس(ة) الغابات III*': 44,
'🛡️ *حارس(ة) الغابات II*': 46,
'🛡️ *حارس(ة) الغابات I*': 48,

// المستوى 50-59: السحرة
'🔮 *ساحر(ة) الغسق V*': 50,
'🔮 *ساحر(ة) الغسق IV*': 52,
'🔮 *ساحر(ة) الغسق III*': 54,
'🔮 *ساحر(ة) الغسق II*': 56,
'🔮 *ساحر(ة) الغسق I*': 58,

// المستوى 60-79: النخبة
'🏅 *بطل(ة) الذهب V*': 60,
'🏅 *بطل(ة) الذهب IV*': 62,
'🏅 *بطل(ة) الذهب III*': 64,
'🏅 *بطل(ة) الذهب II*': 66,
'🏅 *بطل(ة) الذهب I*': 68,
'💎 *فارس(ة) الماس V*': 70,
'💎 *فارس(ة) الماس IV*': 72,
'💎 *فارس(ة) الماس III*': 74,
'💎 *فارس(ة) الماس II*': 76,
'💎 *فارس(ة) الماس I*': 78,

// المستوى 80-99: الأساتذة
'🌌 *سيد(ة) النجوم V*': 80,
'🌌 *سيد(ة) النجوم IV*': 85,
'🌌 *سيد(ة) النجوم III*': 90,
'🌌 *سيد(ة) النجوم II*': 95,
'🌌 *سيد(ة) النجوم I*': 99,

// المستوى 100-149: الأسطوريون
'🌀 *أسطورة الفجر V*': 100,
'🌀 *أسطورة الفجر IV*': 110,
'🌀 *أسطورة الفجر III*': 120,
'🌀 *أسطورة الفجر II*': 130,
'🌀 *أسطورة الفجر I*': 140,

// المستوى 150-199: الملوك/الملكات
'👑 *ملك/ملكة الكون V*': 150,
'👑 *ملك/ملكة الكون IV*': 160,
'👑 *ملك/ملكة الكون III*': 170,
'👑 *ملك/ملكة الكون II*': 180,
'👑 *ملك/ملكة الكون I*': 199,

// المستوى 200-299: الأبطال
'🚀 *بطل(ة) المجرة V*': 200,
'🚀 *بطل(ة) المجرة IV*': 225,
'🚀 *بطل(ة) المجرة III*': 250,
'🚀 *بطل(ة) المجرة II*': 275,
'🚀 *بطل(ة) المجرة I*': 299,

// المستوى 300-399: النور الأعلى
'✨ *النور البدائي للكون V*': 300,
'✨ *النور البدائي للكون IV*': 325,
'✨ *النور البدائي للكون III*': 350,
'✨ *النور البدائي للكون II*': 375,
'✨ *النور البدائي للكون I*': 399,

// المستوى 400-499: النساج الأعلى
'🪐 *نساج(ة) المدارات اللانهائية V*': 400,
'🪐 *نساج(ة) المدارات اللانهائية IV*': 425,
'🪐 *نساج(ة) المدارات اللانهائية III*': 450,
'🪐 *نساج(ة) المدارات اللانهائية II*': 475,
'🪐 *نساج(ة) المدارات اللانهائية I*': 499,

// المستوى 500-599: الانعكاس الأعلى
'🪞 *الانعكاس الأعلى للقدر V*': 500,
'🪞 *الانعكاس الأعلى للقدر IV*': 525,
'🪞 *الانعكاس الأعلى للقدر III*': 550,
'🪞 *الانعكاس الأعلى للقدر II*': 575,
'🪞 *الانعكاس الأعلى للقدر I*': 599,

// المستوى 600-699: التحول
'🦋 *التحول النجمي V*': 600,
'🦋 *التحول النجمي IV*': 625,
'🦋 *التحول النجمي III*': 650,
'🦋 *التحول النجمي II*': 675,
'🦋 *التحول النجمي I*': 699,

// المستوى 700-799: رموز القدر
'💠 *حاكم رموز القدر V*': 700,
'💠 *حاكم رموز القدر IV*': 725,
'💠 *حاكم رموز القدر III*': 750,
'💠 *حاكم رموز القدر II*': 775,
'💠 *حاكم رموز القدر I*': 799,

// المستوى 800-899: العقل اللامع
'🧠 *العقل الكوني V*': 800,
'🧠 *العقل الكوني IV*': 825,
'🧠 *العقل الكوني III*': 850,
'🧠 *العقل الكوني II*': 875,
'🧠 *العقل الكوني I*': 899,

// المستوى 900-999: المسافر(ة)
'🛸 *مسافر(ة) الزمن V*': 900,
'🛸 *مسافر(ة) الزمن IV*': 925,
'🛸 *مسافر(ة) الزمن III*': 950,
'🛸 *مسافر(ة) الزمن II*': 975,
'🛸 *مسافر(ة) الزمن I*': 999,

// المستوى 1000+: الخالدون
'🔥 *بطل(ة) خالد V*': 1000,
'🔥 *بطل(ة) خالد IV*': 2000,
'🔥 *بطل(ة) خالد III*': 3000,
'🔥 *بطل(ة) خالد II*': 4000,
'🔥 *بطل(ة) خالد I*': 5000,
'👑🌌 *الإله الأبدي للأكوان المتعددة* ⚡': 10000,
}