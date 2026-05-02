import { promises as fsPromises, existsSync, rmSync } from "fs"
import path, { join } from 'path'
import ws from 'ws'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@whiskeysockets/baileys")).default

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {

    // ----------------------------------------------------
    // 1. تعيين الأوامر المعربة والبدائل (commands)
    // ----------------------------------------------------
    const isDeleteSession = /^(deletesesion|deletebot|deletesession|deletesesaion|حذف_جلسة|حذف_بوت)$/i.test(command)
    const isPauseBot = /^(stop|pausarai|pausarbot|إيقاف_مؤقت|توقف)$/i.test(command)
    const isShowBots = /^(bots|sockets|socket|بوتات|متصلون)$/i.test(command)

    // دالة تحويل النص إلى تنسيق "فانسي" (للحفاظ على شكل الكود)
    const toFancy = (str) => {
        const map = {
            'a': 'ᥲ', 'b': 'ᑲ', 'c': 'ᥴ', 'd': 'ᑯ', 'e': 'ᥱ', 'f': '𝖿', 'g': 'g', 'h': 'һ',
            'i': 'і', 'j': 'j', 'k': 'k', 'l': 'ᥣ', 'm': 'm', 'n': 'ᥒ', 'o': '᥆', 'p': '⍴',
            'q': 'q', 'r': 'r', 's': 's', 't': '𝗍', 'u': 'ᥙ', 'v': '᥎', 'w': 'ɯ', 'x': 'x',
            'y': 'ᥡ', 'z': 'z', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
            'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N',
            'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V',
            'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z'
        }
        return str.split('').map(c => map[c] || c).join('')
    }

    const reportError = async (e) => {
        await m.reply(`⚠️ ${toFancy("حدث خطأ غير متوقع، آسف جداً...")}`) // تعريب
        console.error(e)
    }

    const convertirMsAFormato = (ms) => {
        if (!ms || ms < 1000) return toFancy('اتصل للتو') // تعريب
        let segundos = Math.floor(ms / 1000)
        let minutos = Math.floor(segundos / 60)
        let horas = Math.floor(minutos / 60)
        let días = Math.floor(horas / 24)
        segundos %= 60; minutos %= 60; horas %= 24
        const parts = []
        // تعريب وحدات الوقت
        if (días > 0) parts.push(`${días} يوم`)
        if (horas > 0) parts.push(`${horas} س`)
        if (minutos > 0) parts.push(`${minutos} د`)
        if (segundos > 0) parts.push(`${segundos} ث`)
        return parts.join(', ') || toFancy('الآن تماماً') // تعريب
    }
    
    if (isDeleteSession) {
        const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        const uniqid = `${who.split('@')[0]}`
        const dirPath = `./${jadi}/${uniqid}`

        if (!existsSync(dirPath)) {
            return conn.sendMessage(m.chat, {
                // تعريب رسالة "الجلسة غير موجودة"
                text: `🚫 *${toFancy("الجلسة غير موجودة")}*\n\n✨ ${toFancy("ليس لديك جلسة نشطة حالياً.")}\n\n🔰 ${toFancy("يمكنك إنشاء واحدة باستخدام:")}\n*${usedPrefix}qr*\n\n📦 ${toFancy("أو الحصول على الكود:")}\n*${usedPrefix}code*`
            }, { quoted: m })
        }

        if (global.conn.user.jid !== conn.user.jid) {
            return conn.sendMessage(m.chat, {
                // تعريب
                text: `💬 ${toFancy("لا يمكن استخدام هذا الأمر إلا من البوت الرئيسي.")}`,
            }, { quoted: m })
        }

        try {
            await m.react('🗑️')
            await fsPromises.rm(dirPath, { recursive: true, force: true })
            await conn.sendMessage(m.chat, {
                // تعريب رسالة الحذف الناجح
                text: `🌈 ${toFancy("تم كل شيء! تم حذف جلستك بنجاح.")}`
            }, { quoted: m })
        } catch (e) {
            reportError(e)
        }
    }
    else if (isPauseBot) {
        if (global.conn.user.jid == conn.user.jid) {
            // تعريب
            return conn.reply(m.chat, `🚫 ${toFancy("لا يمكنك إيقاف البوت الرئيسي مؤقتاً.")}`, m)
        }
        // تعريب
        await conn.reply(m.chat, `🔕 *${botname || 'Sub-Bot'} ${toFancy("تم إيقافه مؤقتاً.")}*`, m)
        conn.ws.close()
    }

    else if (isShowBots) {
        const users = [...new Set([...global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
        
        let listaSubBots = users.map((v, i) => {
            // تعريب حالة "غير معروف"
            const uptime = v.uptime ? convertirMsAFormato(Date.now() - v.uptime) : toFancy('غير معروف')
            const numero = v.user.jid.split('@')[0]
            const nombre = v.user.name || toFancy('بدون اسم') // تعريب
            return `╭━ • 🤖 *بوت فرعي ${i + 1}* • ━
│➤ *${toFancy("المستخدم")}:* ${nombre} // تعريب
│➤ *${toFancy("الرقم")}:* wa.me/${numero} // تعريب
│➤ *${toFancy("مدة النشاط")}:* ${uptime} // تعريب
╰━━━━━━━━━━━━━`
        }).join('\n\n')

        // تعريب
        const finalMessage = users.length > 0 ? listaSubBots : `💤 ${toFancy("لا يوجد حاليًا أي بوت فرعي متصل.")}`
        const headerText = `*${toFancy("البوتات الفرعية المتصلة")}* ✨\n\n${toFancy("الإجمالي النشط:")} ${users.length}\n${users.length > 0 ? '───────────────\n' : ''}${finalMessage}`

        let mediaMessage = await prepareWAMessageMedia({ 
            image: { url: 'https://files.catbox.moe/65rdkc.jpg' } 
        }, { upload: conn.waUploadToServer })

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: headerText
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: toFancy('إدارة البوتات الفرعية') // تعريب
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: true,
                            imageMessage: mediaMessage.imageMessage
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        // تعريب زر QR
                                        display_text: toFancy("كن بوت فرعي (QR)"),
                                        id: `${usedPrefix}qr`
                                    })
                                },
                                {
                                    name: "quick_reply",
                                    buttonParamsJson: JSON.stringify({
                                        // تعريب زر كود الاقتران
                                        display_text: toFancy("احصل على الكود"),
                                        id: `${usedPrefix}code`
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }
}

handler.tags = ['serbot']
// ----------------------------------------------------
// 2. تحديث قائمة الأوامر المساعدة بالأوامر المعربة
// ----------------------------------------------------
handler.help = ['بوتات', 'حذف_جلسة', 'إيقاف_مؤقت']
handler.command = [
    'deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'حذف_جلسة', 'حذف_بوت',
    'stop', 'pausarai', 'pausarbot', 'إيقاف_مؤقت', 'توقف',
    'bots', 'sockets', 'socket', 'بوتات', 'متصلون'
]

export default handler