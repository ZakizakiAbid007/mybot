import fs from 'fs'
import path from 'path'

// تعريف المسارات (اعتماداً على بنية مشروعك)
// قد تحتاج لتعديل هذا المسار ليتناسب مع موقع مجلد 'data' في مشروعك
const databaseDir = path.join(process.cwd(), 'data')
const warningsPath = path.join(databaseDir, 'warnings.json')

// تهيئة ملف الإنذارات إذا لم يكن موجوداً
function initializeWarningsFile() {
    // إنشاء مجلد البيانات إذا لم يكن موجوداً
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir, { recursive: true })
    }
    
    // إنشاء warnings.json إذا لم يكن موجوداً
    if (!fs.existsSync(warningsPath)) {
        fs.writeFileSync(warningsPath, JSON.stringify({}), 'utf8')
    }
}

// دالة تنظيف الـ JID
const cleanJid = (jid) => {
    if (!jid) return ''
    let clean = jid.split(':')[0]
    if (!clean.includes('@s.whatsapp.net')) {
        clean += '@s.whatsapp.net'
    }
    return clean
}

const handler = async (m, { conn, participants, usedPrefix, command, text }) => {
    // تحديد الأوامر المسموح بها بالعربية واللاتينية
    if (!/^(انذار|warn)$/i.test(command)) return

    try {
        // تهيئة الملفات أولاً
        initializeWarningsFile()

        const chatId = m.chat
        const senderId = m.sender
        
        // التحقق أولاً إذا كانت مجموعة
        if (!chatId.endsWith('@g.us')) {
            await conn.reply(chatId, '❌ هذا الأمر يمكن استخدامه فقط في المجموعات!', m)
            return
        }

        // 1. التحقق من المستخدم المستهدف (الإصلاح الشامل)
        let userToWarn = false;

        // أ. محاولة الاستخراج من m.mentionedJid (الأكثر شيوعاً والأكثر موثوقية)
        if (m.mentionedJid && m.mentionedJid[0]) {
            userToWarn = m.mentionedJid[0];
        } 
        // ب. محاولة الاستخراج من الرد (m.quoted.sender)
        else if (m.quoted && m.quoted.sender) {
            userToWarn = m.quoted.sender;
        } 
        // ج. محاولة الاستخراج من الرسالة الممتدة (الخاصية الأصلية في كودك)
        else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid && m.message.extendedTextMessage.contextInfo.mentionedJid[0]) {
            userToWarn = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        // د. التأكد من تنظيف الـ JID قبل الاستخدام
        if (userToWarn) {
            userToWarn = cleanJid(userToWarn)
        }
        
        if (!userToWarn) {
            await conn.reply(chatId, `❌ يرجى منشن المستخدم أو الرد على رسالته للإنذار!\nمثال: \`${usedPrefix}انذار @منشن\``, m)
            return
        }
        
        // 2. التحقق من صلاحيات المشرف
        if (!m.isOwner) {
            // البحث عن بيانات المرسل في قائمة المشاركين
            const senderParticipant = participants.find(p => p.id === senderId)
            const isSenderAdmin = senderParticipant?.admin === 'admin' || senderParticipant?.admin === 'superadmin'

            if (!isSenderAdmin) {
                await conn.reply(chatId, '❌ فقط مشرفي المجموعة يمكنهم استخدام أمر الإنذار!', m)
                return
            }
        }
        
        // 3. قراءة البيانات وزيادة الإنذار
        let warnings = {}
        try {
            warnings = JSON.parse(fs.readFileSync(warningsPath, 'utf8'))
        } catch (error) {
            warnings = {} 
        }

        // تهيئة الكائنات المتداخلة
        if (!warnings[chatId]) warnings[chatId] = {}
        if (!warnings[chatId][userToWarn]) warnings[chatId][userToWarn] = 0

        // زيادة الإنذار
        warnings[chatId][userToWarn]++
        fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2))

        const warningCount = warnings[chatId][userToWarn]
        const maxWarnings = 3 

        // 🟢 متغيرات الأرقام ونص الإشارة 🟢
        const userToWarnNumber = userToWarn.split('@')[0];
        const senderNumber = senderId.split('@')[0];
        
        // 4. رسالة الإنذار
        const warningMessage = `*『 ⚠️ إنذار جديد ⚠️ 』*\n\n` +
            `👤 *المستخدم المُنذر:* @${userToWarnNumber}\n` +
            `⚠️ *عدد الإنذارات:* ${warningCount}/${maxWarnings}\n` +
            `👑 *تم الإنذار بواسطة:* @${senderNumber}\n\n` +
            `📅 *التاريخ:* ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}`

        // إرسال الرسالة مع قائمة المنشن الصحيحة
        await conn.reply(chatId, warningMessage, m, {
            mentions: [userToWarn, senderId] 
        })

        // 5. الطرد التلقائي بعد 3 إنذارات
        if (warningCount >= maxWarnings) {
            try {
                // محاولة الطرد
                await conn.groupParticipantsUpdate(chatId, [userToWarn], "remove")
                
                // حذف الإنذارات بعد الطرد
                delete warnings[chatId][userToWarn]
                fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2))
                
                const kickMessage = `*『 🚫 طرد تلقائي 🚫 』*\n\n` +
                    `@${userToWarnNumber} تم طرده من المجموعة بعد تجاوز الحد الأقصى للإنذارات (${maxWarnings})! ⚠️`

                await conn.reply(chatId, kickMessage, m, {
                    mentions: [userToWarn] 
                })
            } catch (kickError) {
                console.error('❌ خطأ في الطرد التلقائي:', kickError)
                await conn.reply(chatId, '❌ فشل الطرد التلقائي! ربما يجب أن يكون البوت مشرفاً.', m)
            }
        }
    } catch (error) {
        console.error('❌ خطأ غير متوقع في أمر الإنذار:', error)
        await conn.reply(m.chat, '❌ حدث خطأ غير متوقع في أمر الإنذار!', m)
    }
}

handler.help = ['انذار @منشن']
handler.tags = ['مشرفين']
handler.command = /^(انذار|warn)$/i
handler.group = true
handler.admin = true

export default handler