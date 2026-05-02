import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function before(m, { conn, participants, groupMetadata}) {
    // التأكد من أن الرسالة تحتوي على stub type وأنها في مجموعة
    if (!m.messageStubType || !m.isGroup) return
    
    let usuario = `@${m.sender.split`@`[0]}`
    const groupName = (await conn.groupMetadata(m.chat)).subject
    const groupAdmins = participants.filter((p) => p.admin)

    let pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => imagen1)
    const img = await (await fetch(pp)).buffer()
    const chat = global.db.data.chats[m.chat]

    // أنواع الأحداث التي يتم اكتشافها في المجموعة:
    // 21: تغيير اسم المجموعة
    // 22: تغيير صورة المجموعة  
    // 24: تغيير وصف المجموعة
    // 25: تغيير إعدادات التعديل
    // 26: فتح/إغلاق المجموعة
    // 29: إضافة مشرف
    // 30: إزالة مشرف
    // 72: تغيير مدة الرسائل المؤقتة
    // 123: إيقاف الرسائل المؤقتة

    if (chat.detect && m.messageStubType == 21) {
        await this.sendMessage(m.chat, { 
            text: `🍟 ${usuario} *قام بتغيير اسم المجموعة*`, 
            mentions: (await conn.groupMetadata(m.chat)).participants.map(v => v.id) 
        }, { 
            quoted: fkontak, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        }) 

    } else if (chat.detect && m.messageStubType == 22) {
        await this.sendMessage(m.chat, { 
            text: `🚩 ${usuario} *قام بتغيير صورة المجموعة*`, 
            mentions: [m.sender] 
        }, { 
            quoted: fliveLoc, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        }) 

    } else if (chat.detect && m.messageStubType == 24) {
        await this.sendMessage(m.chat, { 
            text: `🍟 ${usuario} *قام بتعديل الوصف!*\n\nالوصف الجديد:\n\n${m.messageStubParameters[0]}`, 
            mentions: [m.sender] 
        }, { 
            quoted: fliveLoc, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        })

    } else if (chat.detect && m.messageStubType == 25) {
        await this.sendMessage(m.chat, { 
            text: `🚩 *الآن ${m.messageStubParameters[0] == 'on' ? 'المشرفين فقط' : 'الجميع'} يمكنهم تعديل معلومات المجموعة*`, 
            mentions: [m.sender] 
        }, { 
            quoted: fkontak, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        })

    } else if (chat.detect && m.messageStubType == 26) {
        await this.sendMessage(m.chat, { 
            text: `🚩 *تم ${m.messageStubParameters[0] == 'on' ? 'إغلاق' : 'فتح'} المجموعة*\n\n${m.messageStubParameters[0] == 'on' ? 'المشرفين فقط' : 'الجميع'} يمكنهم إرسال الرسائل`, 
            mentions: [m.sender] 
        }, { 
            quoted: fkontak, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        })

    } else if (chat.detect && m.messageStubType == 29) {
        let txt1 = `🚩 *مشرف جديد*\n\n`
        txt1 += `الاسم: @${m.messageStubParameters[0].split`@`[0]}\n`
        txt1 += `تم منحه الإشراف بواسطة: @${m.sender.split`@`[0]}`

        await conn.sendMessage(m.chat, {
            text: txt1, 
            mentions: [...txt1.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), 
            contextInfo: { 
                mentionedJid: [...txt1.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), 
                "externalAdReply": {
                    "showAdAttribution": true, 
                    "containsAutoReply": true, 
                    "renderLargerThumbnail": true, 
                    "title": global.packname, 
                    "body": dev, 
                    "containsAutoReply": true, 
                    "mediaType": 1, 
                    "thumbnail": img, 
                    "mediaUrl": channel, 
                    "sourceUrl": channel
                }
            }
        })

    } else if (chat.detect && m.messageStubType == 30) {
        let txt2 = `🚩 *مشرف أقل*\n\n`
        txt2 += `الاسم: @${m.messageStubParameters[0].split`@`[0]}\n`
        txt2 += `تم إزالة الإشراف بواسطة: @${m.sender.split`@`[0]}`

        await conn.sendMessage(m.chat, {
            text: txt2, 
            mentions: [...txt2.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), 
            contextInfo: { 
                mentionedJid: [...txt2.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), 
                "externalAdReply": {
                    "showAdAttribution": true, 
                    "containsAutoReply": true, 
                    "renderLargerThumbnail": true, 
                    "title": global.packname, 
                    "body": dev, 
                    "containsAutoReply": true, 
                    "mediaType": 1, 
                    "thumbnail": img, 
                    "mediaUrl": channel, 
                    "sourceUrl": channel
                }
            }
        })

    } else if (chat.detect && m.messageStubType == 72) {
        await this.sendMessage(m.chat, { 
            text: `🍟 ${usuario} *غير مدة الرسائل المؤقتة إلى @${m.messageStubParameters[0]}*`, 
            mentions: [m.sender] 
        }, { 
            quoted: fkontak, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        })

    } else if (chat.detect && m.messageStubType == 123) {
        await this.sendMessage(m.chat, { 
            text: `🍟 ${usuario} *قام بإيقاف الرسائل المؤقتة*`, 
            mentions: [m.sender] 
        }, { 
            quoted: fkontak, 
            ephemeralExpiration: 24*60*100, 
            disappearingMessagesInChat: 24*60*100
        })
        
    } else {
        // طباعة معلومات الأحداث غير المعالجة للتطوير
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType], 
        })
    }
}