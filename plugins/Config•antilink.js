let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com|facebook\.com|fb\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)|(https?:\/\/(?:www\.)?facebook\.com\/groups\/\S+)|(https?:\/\/(?:www\.)?fb\.com\/groups\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return true
    if (!m.isGroup) return false
    
    let chat = global.db.data.chats[m.chat]
    let delet = m.key.participant
    let bang = m.key.id
    let bot = global.db.data.settings[this.user.jid] || {}
    
    const isGroupLink = linkRegex.exec(m.text)
    const grupo = `https://chat.whatsapp.com`
    
    // ✅ إذا كان المشرف يرسل رابط
    if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
        return conn.reply(m.chat, 
            `🛡️ *أنت مشرف!*\n\n` +
            `🔗 *رابط مجموعة مكتشف*\n` +
            `✅ *لحسن الحظ أنت مشرف، تم تجاوز العقوبة*`,
            m
        )
    }
    
    // ✅ إذا كان مستخدم عادي يرسل رابط
    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return true
        }
        
        // ✅ تحديد نوع الرابط
        let linkType = 'رابط عام'
        if (m.text.includes('chat.whatsapp.com')) linkType = 'رابط واتساب'
        else if (m.text.includes('facebook.com/groups') || m.text.includes('fb.com/groups')) linkType = 'رابط فيسبوك'
        else if (m.text.includes('t.me') || m.text.includes('telegram.me')) linkType = 'رابط تيليجرام'
        
        // ✅ رسالة التحذير
        await conn.reply(m.chat, 
            `🚫 *تم كشف رابط محظور!*\n\n` +
            `👤 *المستخدم:* ${await this.getName(m.sender)}\n` +
            `🔗 *نوع الرابط:* ${linkType}\n` +
            `📋 *القاعدة:* ممنوع مشاركة روابط المجموعات\n` +
            `⚡ *العقوبة:* سيتم طردك من المجموعة`,
            m
        )
        
        // ✅ إذا البوت ليس مشرف
        if (!isBotAdmin) {
            return conn.reply(m.chat, 
                `❌ *لا أستطيع الطرد!*\n\n` +
                `👑 *أنا لست مشرف في المجموعة*\n` +
                `⚠️ *لا يمكنني إزالة المخالفين*`,
                m
            )
        }
        
        // ✅ إذا البوت مشرف - تنفيذ العقوبة
        if (isBotAdmin) {
            // حذف الرسالة
            await conn.sendMessage(m.chat, { 
                delete: { 
                    remoteJid: m.chat, 
                    fromMe: false, 
                    id: bang, 
                    participant: delet 
                }
            })
            
            // طرد المستخدم
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            
            // رسالة تأكيد الطرد
            await conn.reply(m.chat,
                `✅ *تم تنفيذ العقوبة*\n\n` +
                `👤 *المستخدم:* ${await this.getName(m.sender)}\n` +
                `🔗 *نوع الرابط:* ${linkType}\n` +
                `🚫 *السبب:* مشاركة روابط مجموعات محظورة\n` +
                `⚡ *الإجراء:* تم الطرد من المجموعة\n\n` +
                `📋 *الروابط الممنوعة:*\n` +
                `• روابط واتساب المجموعات\n` +
                `• روابط فيسبوك المجموعات\n` +
                `• روابط تيليجرام\n` +
                `• روابط القنوات`,
                m
            )
        } else if (!bot.restrict) {
            return conn.reply(m.chat, 
                `🔧 *الميزة معطلة!*\n\n` +
                `⚙️ *خاصية منع الروابط غير مفعلة*\n` +
                `💡 *قم بتفعيلها من الإعدادات*`,
                m
            )
        }
    }
    
    return true
}