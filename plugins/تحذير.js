import fs from 'fs'
import path from 'path'
// ... (بقية الكود الخاص بتحميل الإنذارات)

// تعريف المسار
const warningsFilePath = path.join(process.cwd(), 'data', 'warnings.json');

// دالة تحميل الإنذارات (لا تغيير فيها)
function loadWarnings() {
    // ... (نفس محتوى الدالة)
    const databaseDir = path.dirname(warningsFilePath)
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir, { recursive: true })
    }
    
    if (!fs.existsSync(warningsFilePath)) {
        fs.writeFileSync(warningsFilePath, JSON.stringify({}), 'utf8')
    }
    
    const data = fs.readFileSync(warningsFilePath, 'utf8')
    return JSON.parse(data)
}

// دالة تنظيف الـ JID - (تم حذفها لأننا سنستخدم الطرق القياسية)

const handler = async (m, { conn, usedPrefix, command, text }) => {
    
    const chatId = m.chat
    
    try {
        const warnings = loadWarnings()
        
        // 1. تحديد المستخدم المراد التحقق منه (منشن أو رد)
        // الطريقة الأكثر موثوقية:
        let userToCheck = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        
        // 2. التحقق من وجود مستخدم محدد
        if (!userToCheck) {
            // ملاحظة: تم تعديل الرسالة لتتطابق مع الأمر الذي فشل لديك
            await conn.reply(chatId, `❌ يرجى منشن المستخدم أو الرد على رسالته للتحقق من الإنذارات!\nمثال: \`${usedPrefix}انذارات @منشن\``, m)
            return
        }

        // 3. جلب عدد الإنذارات للمستخدم في هذه المجموعة
        const groupWarnings = warnings[chatId] || {}
        const warningCount = groupWarnings[userToCheck] || 0
        
        // 4. رسالة الرد
        const maxWarnings = 3
        const replyMessage = `*『 🔍 سجل الإنذارات 』*\n\n` +
            `👤 *المستخدم:* @${userToCheck.split('@')[0]}\n` +
            `⚠️ *عدد الإنذارات:* ${warningCount}/${maxWarnings} ` + (warningCount >= maxWarnings ? `(سيتم الطرد)` : `(باقٍ ${maxWarnings - warningCount})`)

        await conn.reply(chatId, replyMessage, m, {
            mentions: [userToCheck]
        })

    } catch (error) {
        console.error('❌ خطأ في أمر عرض الإنذارات:', error)
        await conn.reply(m.chat, '❌ حدث خطأ في عرض الإنذارات!', m)
    }
}

handler.help = ['انذارات @منشن']
handler.tags = ['مشرفين']
handler.command = /^(انذارات|checkwarns|listwarns)$/i // تم تعديل الأمر الرئيسي إلى 'انذارات'
handler.group = true 
handler.admin = true 

export default handler