const handler = async (m, { conn, text, command, usedPrefix }) => {
    // صورة افتراضية (تم الإبقاء عليها كرابط ثابت)
    const pp = 'https://i.imgur.com/vWnsjh8.jpg' 
    let number, ownerNumber, aa, who
    
    // تحديد المستخدم المستهدف (منشن أو اقتباس)
    if (m.isGroup) {
        who = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted?.sender ? m.quoted.sender : text
    } else who = m.chat
    
    // التحقق مما إذا تم تحديد مستخدم
    if (!who) {
        const warntext = `*❌ يجب الإشارة إلى شخص أو الرد على رسالته في المجموعة لتحذير المستخدم*\n\n*مثال:*\n*${usedPrefix + command} @إشارة*`
        return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) })
    }

    // تهيئة بيانات المستخدم المستهدف
    const user = global.db.data.users[who] || {}
    global.db.data.users[who] = user
    user.warn = user.warn || 0 // التأكد من أن التحذيرات تبدأ من الصفر

    // ⛔️ التحقق من مالك البوت (يبدو هذا الجزء غير مكتمل أو غير ضروري في سياق التحذير، 
    // لكن تم الحفاظ على هيكله الأصلي)
    const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net'
    for (let i = 0; i < global.owner.length; i++) {
        ownerNumber = global.owner[i][0]
        if (usuario.replace(/@s\.whatsapp\.net$/, '') === ownerNumber) {
            aa = ownerNumber + '@s.whatsapp.net'
            await conn.reply(m.chat, `…`, m, { mentions: [aa] })
            return
        }
    }
    // -------------------------------------------------------------

    // تحديد السبب
    const dReason = 'بدون سبب'
    const msgtext = text || dReason
    // إزالة المنشن من نص السبب
    const sdms = msgtext.replace(/@\d+-?\d* /g, '')

    // 1. زيادة التحذير وإرسال رسالة الإخطار
    user.warn += 1
    await m.reply(
        `*@${who.split`@`[0]}* تلقى تحذيراً في هذه المجموعة!\nالسبب: ${sdms}\n*التحذيرات: ${user.warn}/3*`, 
        null, 
        { mentions: [who] }
    )

    // 2. التحقق من حد الطرد (3 تحذيرات)
    if (user.warn >= 3) {
        user.warn = 0 // إعادة تعيين التحذيرات
        await m.reply(
            `لقد تم تحذيرك عدة مرات!!\n*@${who.split`@`[0]}* تجاوزت *3* تحذيرات، سيتم إزالتك الآن 👽`, 
            null, 
            { mentions: [who] }
        )
        // طرد المستخدم من المجموعة
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
    
    return false
}

handler.command = ['advertir', 'advertencia', 'warn', 'warning', 'تحذير', 'انذار']
handler.group = true // يعمل في المجموعات فقط
handler.admin = true // يتطلب صلاحية المشرف
// ملاحظة: لكي يعمل الطرد، يجب أن يكون البوت أيضًا مشرفاً (handler.botAdmin = true)
export default handler