// File: handler.js (أو اسم ملف المعالج الرئيسي لديك)
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const groupMetadataCache = new Map()
const lidCache = new Map()

// 👑💎 نظام الرياكتات العشوائية للأوامر غير الموجودة - تم التحديث ليليق بالملوك تنغن!
// (يحتوي على إيموجيات مبهرجة ومتنوعة مع خيار عدم الرد لزيادة الفخامة)
const reaccionesRandom = [
    '👑', '💎', '⚜️', '🔱', '🍾', '🥂', '🎶', '✨', '🔥', '🤹',
    '🥳', '💯', '🤩', '💖', '🌟', '🎊', '🔮', '🎭', '🎪', '💫',
    '🎉', '🎈', '🌸', '✨', '🥇', '🏆', '💥', '🧡', '💜', '💙'
]

const handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
    // 🎪 نظام الرياكتات للأوامر غير الموجودة
    if (m.text && global.prefix.test(m.text)) {
        const usedPrefix = global.prefix.exec(m.text)[0]
        const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
        
        if (command && command.length > 0) {
            const validCommand = (cmd, plugins) => {
                for (let plugin of Object.values(plugins)) {
                    if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(cmd)) {
                        return true
                    }
                }
                return false
            }
            
            if (!validCommand(command, global.plugins)) {
                // 👑 إمكانية عدم إرسال رياكت (احتمال عدم الرد حوالي 15% لزيادة الفخامة)
                if (Math.random() > 0.15) { // 85% chance to react
                    // 🎊 رياكت عشوائي مبهرج عندما الأمر غير موجود
                    const reaccionRandom = reaccionesRandom[Math.floor(Math.random() * reaccionesRandom.length)]
                    await m.react(reaccionRandom)
                    
                    // 🎯 تسجيل في الكونسول
                    console.log(`${chalk.yellow.bold('❌ أمر غير موجود:')} ${chalk.red(command)} ${chalk.blue('من:')} @${m.sender.split('@')[0]}`)
                } else {
                    // لا يتم الرد بأي شيء، تلبيةً لطلب "أو لا يرد بشيء"
                    console.log(`${chalk.yellow.bold('🤫 أمر غير موجود - لا رياكت:')} ${chalk.red(command)} ${chalk.blue('من:')} @${m.sender.split('@')[0]}`)
                }
                
                // ملاحظة للمطور: تم إزالة 'return' لمنع إيقاف تنفيذ بقية كود 'handler.before'
            }
        }
    }
    
    // ⬇️ الكود الأصلي يبقى كما هو ⬇️
    if (!m.messageStubType || !m.isGroup) return
    const primaryBot = global.db.data.chats[m.chat].primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) throw !1
    const chat = global.db.data.chats[m.chat]
    const users = m.messageStubParameters[0]
    const usuario = await resolveLidToRealJid(m?.sender, conn, m?.chat)
    const groupAdmins = participants.filter(p => p.admin)
    
    // 🎬 إعدادات القناة مع هوية تنغن المبهرج
    const rcanal = { 
        contextInfo: { 
            isForwarded: true, 
            forwardedNewsletterMessageInfo: { 
                newsletterJid: "0029VbBeu0o002T9NQnURQ2V@newsletter", 
                serverMessageId: '', 
                newsletterName: "👑 قناة تنغن المبهرج الرسمية" 
            }, 
            externalAdReply: { 
                title: "🎪 بوت تنغن المبهرج", 
                body: "📢 تابع القناة الرسمية للأحدث", 
                mediaUrl: null, 
                description: null, 
                previewType: "PHOTO", 
                thumbnail: await (await fetch(global.icono || 'https://files.catbox.moe/xr2m6u.jpg')).buffer(), 
                sourceUrl: "https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V", 
                mediaType: 1, 
                renderLargerThumbnail: false 
            }, 
            mentionedJid: null 
        }
    }
    
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://i.postimg.cc/jdtGzjzw/ltalatlbtabtlt.jpg'
    
    // 📝 الرسائل المعربة (تم إضافة إيموجيات جديدة لزيادة البهجة)
    const nombre = `> 🌸 @${usuario.split('@')[0]} قام بتغيير اسم المجموعة. 🏷️\n> ✦ الاسم الجديد:\n> *${m.messageStubParameters[0]}*`
    const foto = `> 🖼️ تم تغيير صورة المجموعة. 📸\n> ✦ تم بواسطة:\n> » @${usuario.split('@')[0]}`
    const edit = `> ⚙️ @${usuario.split('@')[0]} سمح لـ ${m.messageStubParameters[0] == 'on' ? 'المشرفين فقط 🛡️' : 'الجميع 🌐'} بتعديل إعدادات المجموعة.`
    const newlink = `> 🔗 تم إعادة تعيين رابط المجموعة. 🔄\n> ✦ تم بواسطة:\n> » @${usuario.split('@')[0]}`
    const status = `> 🔒 تم ${m.messageStubParameters[0] == 'on' ? '*إغلاق 🛑*' : '*فتح ✅*'} المجموعة بواسطة @${usuario.split('@')[0]}\n> ✦ الآن ${m.messageStubParameters[0] == 'on' ? '*المشرفين فقط ⚔️*' : '*الجميع 📢*'} يمكنهم إرسال الرسائل.`
    const admingp = `> 👑 @${users.split('@')[0]} أصبح مشرفاً في المجموعة. 🎉\n> ✦ تم بواسطة:\n> » @${usuario.split('@')[0]}`
    const noadmingp = `> 🔻 @${users.split('@')[0]} لم يعد مشرفاً في المجموعة. 👋\n> ✦ تم بواسطة:\n> » @${usuario.split('@')[0]}`
    
    // 🛡️ نظام الكشف عن التغييرات
    if (chat.detect && m.messageStubType == 2) {
        const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
        const sessionPath = `./${sessions}/`
        for (const file of await fs.promises.readdir(sessionPath)) {
            if (file.includes(uniqid)) {
                await fs.promises.unlink(path.join(sessionPath, file))
                console.log(`${chalk.yellow.bold('✎ تم الحذف!')} ${chalk.greenBright(`'${file}'`)}\n${chalk.redBright('ما تسبب في "undefined" في الدردشة.')}`)
            }
        }
    } 
    
    if (chat.detect && m.messageStubType == 21) {
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: nombre, ...rcanal }, { quoted: null })
    } 
    
    if (chat.detect && m.messageStubType == 22) {
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, ...rcanal }, { quoted: null })
    } 
    
    if (chat.detect && m.messageStubType == 23) {
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: newlink, ...rcanal }, { quoted: null })
    } 
    
    if (chat.detect && m.messageStubType == 25) {
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: edit, ...rcanal }, { quoted: null })
    } 
    
    if (chat.detect && m.messageStubType == 26) {
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: status, ...rcanal }, { quoted: null })
    } 
    
    if (chat.detect && m.messageStubType == 29) {
        rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
        await this.sendMessage(m.chat, { text: admingp, ...rcanal }, { quoted: null })
        return
    } 
    
    if (chat.detect && m.messageStubType == 30) {
        rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
        await this.sendMessage(m.chat, { text: noadmingp, ...rcanal }, { quoted: null })
    } else { 
        if (m.messageStubType == 2) return
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType], 
        })
    }
}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
    const inputJid = lid.toString()
    if (!inputJid.endsWith("@lid") || !groupChatId?.endsWith("@g.us")) { 
        return inputJid.includes("@") ? inputJid : `${inputJid}@s.whatsapp.net` 
    }
    
    if (lidCache.has(inputJid)) { 
        return lidCache.get(inputJid) 
    }
    
    const lidToFind = inputJid.split("@")[0]
    let attempts = 0
    
    while (attempts < maxRetries) {
        try {
            const metadata = await conn?.groupMetadata(groupChatId)
            if (!metadata?.participants) { 
                throw new Error("لم يتم الحصول على المشاركين") 
            }
            
            for (const participant of metadata.participants) {
                try {
                    if (!participant?.jid) continue
                    const contactDetails = await conn?.onWhatsApp(participant.jid)
                    if (!contactDetails?.[0]?.lid) continue
                    const possibleLid = contactDetails[0].lid.split("@")[0]
                    if (possibleLid === lidToFind) {
                        lidCache.set(inputJid, participant.jid)
                        return participant.jid
                    }
                } catch (e) { 
                    continue 
                }
            }
            
            lidCache.set(inputJid, inputJid)
            return inputJid
            
        } catch (e) {
            if (++attempts >= maxRetries) {
                lidCache.set(inputJid, inputJid)
                return inputJid
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay))
        }
    }
    return inputJid
}