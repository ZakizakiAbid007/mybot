// الكود مُعدّل ومُترجم بواسطة Gemini - Google

import { getUrlFromDirectPath } from "@whiskeysockets/baileys"
import _ from "lodash"
import axios from 'axios' 

let handler = async (m, { conn, command, usedPrefix, args, text, groupMetadata, isOwner, isROwner }) => {
// 
// تعاريف الأوامر العربية
//
const isCommand1 = /^(فحص|تفحص|inspect|رابط)\b$/i.test(command) // فحص رابط (inspect)
const isCommand2 = /^(تابع_قناة|اشتراك_قناة)\b$/i.test(command) // متابعة قناة
const isCommand3 = /^(الغاء_متابعة_قناة|فك_اشتراك_قناة|وقف_متابعة)\b$/i.test(command) // إلغاء متابعة قناة (Unfollow)
const isCommand4 = /^(كتم_قناة|إسكات_قناة)\b$/i.test(command) // كتم القناة (Mute)
const isCommand5 = /^(إلغاء_كتم_قناة|إلغاء_إسكات)\b$/i.test(command) // إلغاء كتم القناة (Unmute)
const isCommand6 = /^(تغيير_صورة_قناة|صورة_قناة_جديدة)\b$/i.test(command) // تغيير صورة القناة
const isCommand7 = /^(حذف_صورة_قناة|إزالة_صورة_قناة)\b$/i.test(command) // حذف صورة القناة
const isCommand8 = /^(تلقي_إشعارات_قناة|اشعارات_قناة)\b$/i.test(command) // تلقي تحديثات القناة
const isCommand9 = /^(وضع_تفاعلات_قناة|تفاعلات_قناة)\b$/i.test(command) // وضع التفاعلات (Reactions Mode)
const isCommand10 = /^(تغيير_اسم_قناة|اسم_قناة_جديد)\b$/i.test(command) // تغيير اسم القناة
const isCommand11 = /^(تغيير_وصف_قناة|وصف_قناة_جديد)\b$/i.test(command) // تغيير وصف القناة

const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
let txtBotAdminCh = '\n\n> *تأكد من أن البوت مشرف في القناة، وإلا فلن يعمل الأمر.*'

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
async function reportError(e) {
await m.reply(`✨️ حدث خطأ ما.`)
console.log(e)
}
let thumb = icons // 'icons' يجب أن يكون معرَّفًا في ملف الإعدادات العامة
let pp, ch, q, mime, buffer, media, inviteUrlch, imageBuffer
let redes = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V' // <--- تم التحديث إلى رابط قناتك
let md = 'https://whatsapp.com/' // يجب تعريف هذا المتغير في الإعدادات العامة

switch (true) {     
case isCommand1: // فحص/تفحص/inspect
let inviteCode
if (!text) return await conn.reply(m.chat, `🚩 *الرجاء إدخال رابط المجموعة/المجتمع أو القناة.*`, m, rcanal)
const MetadataGroupInfo = async (res, isInviteInfo = false) => {
let nameCommunity = "لا تنتمي لأي مجتمع"
let groupPicture = "لم يتمكن من الحصول عليها"

if (res.linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(res.linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`الاسم:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(res.id, 'image').catch(e => { return null })
inviteCode = await conn.groupInviteCode(m.chat).catch(e => { return null })

const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مالك_رئيسي)" : user.admin === "admin" ? " (مشرف)" : ""}`).join("\n")
: "لم يتم العثور عليهم"
let caption = `🆔 *معرف المجموعة:*\n${res.id || "لم يتم العثور عليه"}\n\n` +
`👑 *أنشئت بواسطة:*\n${res.owner ? `@${res.owner?.split("@")[0]}` : "لم يتم العثور عليه"} ${res.creation ? `بتاريخ ${formatDate(res.creation)}` : "(التاريخ غير متوفر)"}\n\n` +
`🏷️ *الاسم:*\n${res.subject || "لم يتم العثور عليه"}\n\n` +
`✏️ *تم تغيير الاسم بواسطة:*\n${res.subjectOwner ? `@${res.subjectOwner?.split("@")[0]}` : "لم يتم العثور عليه"} ${res.subjectTime ? `بتاريخ ${formatDate(res.subjectTime)}` : "(التاريخ غير متوفر)"}\n\n` +
`📄 *الوصف:*\n${res.desc || "لم يتم العثور عليه"}\n\n` +
`📝 *تم تغيير الوصف بواسطة:*\n${res.descOwner ? `@${res.descOwner?.split("@")[0]}` : "لم يتم العثور عليه"}\n\n` +
`🗃️ *معرف الوصف:*\n${res.descId || "لم يتم العثور عليه"}\n\n` +
`🖼️ *صورة المجموعة:*\n${pp ? pp : groupPicture}\n\n` +
`💫 *المُنشئ:*\n${res.author || "لم يتم العثور عليه"}\n\n` +
`🎫 *رمز الدعوة:*\n${res.inviteCode || inviteCode || "غير متوفر"}\n\n` +
`⌛ *الرسائل المؤقتة:*\n${res.ephemeralDuration !== undefined ? `${res.ephemeralDuration} ثانية` : "غير معروف"}\n\n` +
`🛃 *المشرفون:*\n` + (res.participants && res.participants.length > 0 ? res.participants.filter(user => user.admin === "admin" || user.admin === "superadmin").map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مالك_رئيسي)" : " (مشرف)"}`).join("\n") : "لم يتم العثور عليهم") + `\n\n` +
`🔰 *إجمالي الأعضاء:*\n${res.size || "العدد غير متوفر"}\n\n` +
`✨ *معلومات متقدمة* ✨\n\n🔎 *المجتمع المرتبط بالمجموعة:*\n${res.isCommunity ? "هذه المجموعة هي دردشة إعلانات" : `${res.linkedParent ? "`المعرف:` " + res.linkedParent : "هذه المجموعة"} ${nameCommunity}`}\n\n` +
`⚠️ *القيود:* ${res.restrict ? "✅ مقيَّدة" : "❌ غير مقيَّدة"}\n` +
`📢 *الإعلانات:* ${res.announce ? "✅ إعلانية" : "❌ ليست إعلانية"}\n` +
`🏘️ *هل هي مجتمع؟:* ${res.isCommunity ? "✅ نعم" : "❌ لا"}\n` +
`📯 *هل هي إعلان مجتمع؟:* ${res.isCommunityAnnounce ? "✅ نعم" : "❌ لا"}\n` +
`🤝 *تتطلب موافقة الأعضاء:* ${res.joinApprovalMode ? "✅ نعم" : "❌ لا"}\n` +
`🆕 *يمكن إضافة أعضاء مستقبليين:* ${res.memberAddMode ? "✅ نعم" : "❌ لا"}\n\n` 
return caption.trim()
}

const inviteGroupInfo = async (groupData) => {
const { id, subject, subjectOwner, subjectTime, size, creation, owner, desc, descId, linkedParent, restrict, announce, isCommunity, isCommunityAnnounce, joinApprovalMode, memberAddMode, ephemeralDuration } = groupData
let nameCommunity = "لا تنتمي لأي مجتمع"
let groupPicture = "لم يتمكن من الحصول عليها"
if (linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`الاسم:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(id, 'image').catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (مالك_رئيسي)" : user.admin === "admin" ? " (مشرف)" : ""}`).join("\n")
: "لم يتم العثور عليهم"

let caption = `🆔 *معرف المجموعة:*\n${id || "لم يتم العثور عليه"}\n\n` +
`👑 *أنشئت بواسطة:*\n${owner ? `@${owner?.split("@")[0]}` : "لم يتم العثور عليه"} ${creation ? `بتاريخ ${formatDate(creation)}` : "(التاريخ غير متوفر)"}\n\n` +
`🏷️ *الاسم:*\n${subject || "لم يتم العثور عليه"}\n\n` +
`✏️ *تم تغيير الاسم بواسطة:*\n${subjectOwner ? `@${subjectOwner?.split("@")[0]}` : "لم يتم العثور عليه"} ${subjectTime ? `بتاريخ ${formatDate(subjectTime)}` : "(التاريخ غير متوفر)"}\n\n` +
`📄 *الوصف:*\n${desc || "لم يتم العثور عليه"}\n\n` +
`💠 *معرف الوصف:*\n${descId || "لم يتم العثور عليه"}\n\n` +
`🖼️ *صورة المجموعة:*\n${pp ? pp : groupPicture}\n\n` +
`🏆 *الأعضاء المُميزون:*\n${formatParticipants(groupData.participants)}\n\n` +
`👥 *إجمالي الأعضاء (المُقدَّر):*\n${size || "العدد غير متوفر"}\n\n` +
`✨ *معلومات متقدمة* ✨\n\n🔎 *المجتمع المرتبط بالمجموعة:*\n${isCommunity ? "هذه المجموعة هي دردشة إعلانات" : `${linkedParent ? "`المعرف:` " + linkedParent : "هذه المجموعة"} ${nameCommunity}`}\n\n` +
`📢 *الإعلانات:* ${announce ? "✅ نعم" : "❌ لا"}\n` +
`🏘️ *هل هي مجتمع؟:* ${isCommunity ? "✅ نعم" : "❌ لا"}\n` +
`📯 *هل هي إعلان مجتمع؟:* ${isCommunityAnnounce ? "✅ نعم" : "❌ لا"}\n` +
`🤝 *تتطلب موافقة الأعضاء:* ${joinApprovalMode ? "✅ نعم" : "❌ لا"}\n`
return caption.trim()
}

let info
try {
let res = text ? null : await conn.groupMetadata(m.chat)
info = await MetadataGroupInfo(res) // إذا كان البوت في المجموعة
console.log('طريقة البيانات الوصفية للمجموعة')
} catch {
const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
let inviteInfo
if (inviteUrl) {
try {
inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
info = await inviteGroupInfo(inviteInfo) // لأي رابط مجموعة/مجتمع
console.log(info)
console.log('🌸 طريقة الرابط')    
} catch (e) {
m.reply('🌵 المجموعة/الرابط غير موجود أو غير صالح.')
return
}}}
if (info) {
await conn.sendMessage(m.chat, { text: info, contextInfo: {
mentionedJid: conn.parseMention(info),
externalAdReply: {
title: "🐢 أداة فحص المجموعات",
body: "🍃 فحص متقدم!",
thumbnailUrl: pp ? pp : thumb,
sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : md,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })
} else {
// معالجة روابط القنوات
let newsletterInfo
if (!channelUrl) return await conn.reply(m.chat, "🚩 *تأكد من أنه رابط قناة واتساب صالح.*", m, rcanal)
if (channelUrl) {
try {
newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(e => { return null })
if (!newsletterInfo) return await conn.reply(m.chat, "🚩 *لم يتم العثور على معلومات القناة. تأكد من صحة الرابط.*", m, rcanal)       
let caption = "*فحص روابط القنوات*\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview)
if (newsletterInfo?.preview) {
pp = getUrlFromDirectPath(newsletterInfo.preview)
} else {
pp = thumb
}
if (channelUrl && newsletterInfo) {
await conn.sendMessage(m.chat, { text: caption, contextInfo: {
mentionedJid: conn.parseMention(caption),
externalAdReply: {
title: "🐢 أداة فحص القنوات",
body: "🍃 فحص متقدم!",
thumbnailUrl: pp,
sourceUrl: args[0],
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })}
newsletterInfo.id ? conn.sendMessage(m.chat, { text: newsletterInfo.id }, { quoted: null }) : ''
} catch (e) {
reportError(e)
}}}
break

// متابعة قناة واتساب 
case isCommand2:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, fake)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب تريد أن يتابعها البوت.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n\`${usedPrefix}فحص رابط\`${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterFollow(ch)
await conn.reply(m.chat, `🚩 *بدأ البوت بمتابعة القناة ${chtitle} بنجاح.*`, m, rcanal) 
} catch (e) {
reportError(e)
}
break

// إلغاء متابعة قناة واتساب 
case isCommand3:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, fake)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب تريد أن يتوقف البوت عن متابعتها.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n\`${usedPrefix}فحص رابط\`${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUnfollow(ch)
await conn.reply(m.chat, `🚩 *توقف البوت عن متابعة القناة ${chtitle} بنجاح.*`, m, rcanal) 
} catch (e) {
reportError(e)
}
break

// كتم قناة واتساب 
case isCommand4:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب تريد أن يكتم البوت إشعاراتها.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterMute(ch)
await conn.reply(m.chat, `تم كتم إشعارات قناة *${chtitle}* بنجاح.`, m, rcanal) 
} catch (e) {
reportError(e)
}
break

// إلغاء كتم قناة واتساب 
case isCommand5:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب تريد أن يُلغي البوت كتم إشعاراتها.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUnmute(ch)
await conn.reply(m.chat, `تم إلغاء كتم إشعارات قناة *${chtitle}* بنجاح.`, m, rcanal) 
} catch (e) {
reportError(e)
}
break

// تعديل صورة القناة
case isCommand6:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب بالرد على صورة (jpg/jpeg/png) أو أضف رابط صورة.*\n
*بالرد على صورة:*
*\`${usedPrefix + command}\` المعرف@newsletter*

*بإضافة رابط صورة:*
*\`${usedPrefix + command}\` المعرف@newsletter رابط_الصورة*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`, m, rcanal)
const regex = /(\b\w+@newsletter\b)(?:.*?(https?:\/\/[^\s]+?\.(?:jpe?g|png)))?/i
const match = text.match(regex)
let match1 = match ? match[1] ? match[1] : null : null
let match2 = match ? match[2] ? match[2] : null : null
if (m.quoted) {
q = m.quoted ? m.quoted : m
mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/g.test(mime) && !/webp/g.test(mime)) {
media = await q.download()
} else {
return await conn.reply(m.chat, `*يجب الرد على صورة jpg/png.*`, m)
}} else { 
const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:jpe?g|png))/
if (!match2 && !text.match(imageUrlRegex)) return await conn.reply(m.chat, `*أضف رابط الصورة jpg/png بعد معرف القناة.*`, m)
try {
const response = await axios.get(match2 ? match2 : text.match(imageUrlRegex), { responseType: 'arraybuffer' })
imageBuffer = Buffer.from(response.data, 'binary')
} catch (error) {
return await conn.reply(m.chat, `🐢 خطأ أثناء تحميل الصورة من الرابط المقدم.`, m, rcanal)
}
media = imageBuffer
}
if (text.includes("@newsletter")) {
if(!match1) return await conn.reply(m.chat, `🚩 لم يتم العثور على معرف القناة.`, m, rcanal)
ch = match1
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUpdatePicture(ch, media)
await conn.sendMessage(ch, { text: `🚩 *قام البوت بتغيير صورة قناة* *${chtitle}* بنجاح.`, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار عام 🔔 】",
body: '✨️ صورة ملف شخصي جديدة للقناة.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break

// حذف صورة القناة
case isCommand7:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب تريد أن يحذف البوت صورتها.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n\`${usedPrefix}فحص رابط\`${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterRemovePicture(ch)
await conn.sendMessage(ch, { text: `🚩 *قام البوت بحذف صورة قناة* *${chtitle}* بنجاح.`, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار عام 🔔 】",
body: '✨️ تم حذف الصورة.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break

// تلقي إشعارات تحديثات القناة في الوقت الفعلي
case isCommand8:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
ch
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب لتلقي البوت إشعاراتها في الوقت الفعلي.*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`, m, rcanal)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.subscribeNewsletterUpdates(ch)
await conn.reply(m.chat, `🚩 *البوت سيتلقى الآن إشعارات قناة ${chtitle}*`, m, rcanal) 
} catch (e) {
reportError(e)
}
break

// تعيين وضع التفاعلات في قناة واتساب 
case isCommand9:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
ch
if (!text) return await conn.reply(m.chat, `
🚩 *أدخل معرف أو رابط قناة واتساب متبوعاً بخيار وضع التفاعلات للقناة.*

*وضع التفاعلات:*
> استخدم الرقم فقط.

*الخيارات:*
\`\`\`[1]\`\`\` أي تفاعل (ALL).
\`\`\`[2]\`\`\` التفاعلات الافتراضية (BASIC).
\`\`\`[3]\`\`\` لا تفاعلات (NONE).

*مثال على الاستخدام:*
*\`${usedPrefix + command}\` المعرف@newsletter 1*

يمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`.trim(), m, rcanal)

const parts = text.split(' ')
const modeNumber = parseInt(parts.pop())
ch = parts.join(' ')

let mode
switch (modeNumber) {
case 1:
mode = 'ALL'
break
case 2:
mode = 'BASIC'
break
case 3:
mode = 'NONE'
break
default:
return await conn.reply(m.chat, `🚩 *وضع التفاعل غير صالح.*\n
*وضع التفاعلات:*
> استخدم الرقم فقط.

*الخيارات:*
\`\`\`[1]\`\`\` أي تفاعل.
\`\`\`[2]\`\`\` التفاعلات الافتراضية.
\`\`\`[3]\`\`\` لا تفاعلات.

مثال على الاستخدام:
*\`${usedPrefix + command}\` المعرف@newsletter 1*`, m, rcanal)
}

if (ch.includes("@newsletter")) {
ch = ch.trim()
} else {
ch = await conn.newsletterMetadata("invite", ch).then(data => data.id).catch(e => null)
}

try {
const chtitle = await conn.newsletterMetadata(ch.includes("@newsletter") ? "jid" : "invite", ch.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterReactionMode(ch, mode)
await conn.sendMessage(ch, { text: `🚩 *قام البوت بتعيين وضع التفاعلات إلى* \`"${mode}"\` *لقناة* *${chtitle}*`, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار عام 🔔 】",
body: '✨️ تعديل إعدادات التفاعلات.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break

// تعديل اسم القناة
case isCommand10:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب لتغيير اسمها.*\n\n
*طريقة الاستخدام:*
*\`${usedPrefix + command}\` المعرف الاسم_الجديد* 

مثال على الاستخدام:
*\`${usedPrefix + command}\` 12345@newsletter اسم_القناة_الجديد*\n\nيمكنك الحصول على المعرف باستخدام الأمر:\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`, m, rcanal)
const [id, ...nameParts] = text.split(' ')
const name = nameParts.join(' ').trim()
if (name.length > 99) return await conn.reply(m.chat, `🚩 *اسم القناة لا يمكن أن يتجاوز 99 حرفاً.*`, m, rcanal)
if (text.includes("@newsletter")) {
ch = id.trim()
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUpdateName(ch, name)
await conn.sendMessage(ch, { text: `🚩 *قام البوت بتغيير اسم القناة إلى* *${name}*\n\n*الاسم السابق:* ${chtitle}\n*الاسم الجديد:* ${name}`, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار عام 🔔 】",
body: '✨️ اسم جديد للقناة.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break

// تعديل وصف القناة
case isCommand11:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `🚩 ليس لديك الصلاحية لاستخدام هذا الأمر.`, m, rcanal)
if (!text) return await conn.reply(m.chat, `🚩 *أدخل معرف أو رابط قناة واتساب لتغيير وصفها.*\n\n
*طريقة الاستخدام:*
*\`${usedPrefix + command}\` المعرف الوصف_الجديد* 

مثال على الاستخدام:
*\`${usedPrefix + command}\` 12345@newsletter الوصف_الجديد_للقناة*\n\n*يمكنك الحصول على المعرف باستخدام الأمر:*\n*\`${usedPrefix}فحص رابط\`*${txtBotAdminCh}`, m, rcanal)
const [idch, ...descriptionParts] = text.split(' ')
const description = descriptionParts.join(' ').trim()
if (text.includes("@newsletter")) {
ch = idch.trim()
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUpdateDescription(ch, description)
await conn.sendMessage(ch, { text: `🚩 *قام البوت بتعديل وصف قناة* *${chtitle}*`, contextInfo: {
externalAdReply: {
title: "【 🔔 إشعار عام 🔔 】",
body: '✨️ وصف جديد للقناة.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break
}}

handler.tags = ['أدوات', 'قنوات']
handler.help = ['صورة_قناة_جديدة', 'إلغاء_كتم_قناة', 'كتم_قناة', 'وقف_متابعة', 'تابع_قناة', 'تلقي_إشعارات_قناة', 'فحص', 'تفحص', 'رابط', 'حذف_صورة_قناة', 'وضع_تفاعلات_قناة', 'تغيير_اسم_قناة', 'تغيير_وصف_قناة']
handler.command = ['صورة_قناة_جديدة', 'إلغاء_كتم_قناة', 'كتم_قناة', 'وقف_متابعة', 'تابع_قناة', 'تلقي_إشعارات_قناة', 'فحص', 'تفحص', 'رابط', 'حذف_صورة_قناة', 'وضع_تفاعلات_قناة', 'تغيير_اسم_قناة', 'تغيير_وصف_قناة']
handler.register = true
export default handler 

function formatDate(n, locale = "ar", includeTime = true) {
if (n > 1e12) {
n = Math.floor(n / 1000)  // Convertir de milisegundos a segundos
} else if (n < 1e10) {
n = Math.floor(n * 1000)  // Convertir de segundos a milisegundos
}
const date = new Date(n)
if (isNaN(date)) return "تاريخ غير صالح"
// Formato de fecha: يوم/شهر/سنة
const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
const formattedDate = date.toLocaleDateString(locale, optionsDate)
if (!includeTime) return formattedDate
// ساعات، دقائق، وثواني
const hours = String(date.getHours()).padStart(2, '0')
const minutes = String(date.getMinutes()).padStart(2, '0')
const seconds = String(date.getSeconds()).padStart(2, '0')
const period = hours < 12 ? 'ص' : 'م'
const formattedTime = `${hours}:${minutes}:${seconds} ${period}`
return `${formattedDate}, ${formattedTime}`
}

function formatValue(key, value, preview) {
switch (key) {
case "subscribers":
return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "لا يوجد مشتركين"
case "creation_time":
case "nameTime":
case "descriptionTime":
return formatDate(value)
case "description": 
case "name":
return value || "لا توجد معلومات متوفرة"
case "state":
switch (value) {
case "ACTIVE": return "نشط"
case "GEOSUSPENDED": return "موقوف مؤقتاً (جغرافياً)"
case "SUSPENDED": return "موقوف"
default: return "غير معروف"
}
case "reaction_codes":
switch (value) {
case "ALL": return "جميع التفاعلات مسموحة"
case "BASIC": return "التفاعلات الأساسية مسموحة"
case "NONE": return "لا توجد تفاعلات مسموحة"
default: return "غير معروف"
}
case "verification":
switch (value) {
case "VERIFIED": return "مُوثَّق"
case "UNVERIFIED": return "غير مُوثَّق"
default: return "غير معروف"
}
case "mute":
switch (value) {
case "ON": return "مكتوم"
case "OFF": return "غير مكتوم"
case "UNDEFINED": return "غير معرّف"
default: return "غير معروف"
}
case "view_role":
switch (value) {
case "ADMIN": return "مشرف"
case "OWNER": return "مالك"
case "SUBSCRIBER": return "مشترك"
case "GUEST": return "زائر"
default: return "غير معروف"
}
case "picture":
if (preview) {
return getUrlFromDirectPath(preview)
} else {
return "لا توجد صورة متوفرة"
}
default:
return value !== null && value !== undefined ? value.toString() : "لا توجد معلومات متوفرة"
}}

function newsletterKey(key) {
return _.startCase(key.replace(/_/g, " "))
.replace("Id", "🆔 المعرف")
.replace("State", "📌 الحالة")
.replace("Creation Time", "📅 تاريخ الإنشاء")
.replace("Name Time", "✏️ تاريخ تعديل الاسم")
.replace("Name", "🏷️ الاسم")
.replace("Description Time", "📝 تاريخ تعديل الوصف")
.replace("Description", "📜 الوصف")
.replace("Invite", "📩 رابط الدعوة")
.replace("Handle", "👤 اسم مستعار")
.replace("Picture", "🖼️ الصورة")
.replace("Preview", "👀 معاينة")
.replace("Reaction Codes", "😃 التفاعلات")
.replace("Subscribers", "👥 المشتركون")
.replace("Verification", "✅ التوثيق")
.replace("Viewer Metadata", "🔍 بيانات المشاهد المتقدمة")
}

function processObject(obj, prefix = "", preview) {
let caption = ""
Object.keys(obj).forEach(key => {
const value = obj[key]
if (typeof value === "object" && value !== null) {
if (Object.keys(value).length > 0) {
const sectionName = newsletterKey(prefix + key)
caption += `\n*\`${sectionName}\`*\n`
caption += processObject(value, `${prefix}${key}_`)
}} else {
const shortKey = prefix ? prefix.split("_").pop() + "_" + key : key
const displayValue = formatValue(shortKey, value, preview)
const translatedKey = newsletterKey(shortKey)
caption += `- *${translatedKey}:*\n${displayValue}\n\n`
}})
return caption.trim()
}