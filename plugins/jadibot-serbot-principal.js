// ⚔️ كود مُعدَّل ومُخصَّص لِـ "ملك المهرجانات" 👑

import ws from 'ws'

const handler = async (m, { conn, usedPrefix }) => {
    
    // ⚔️ جمع قائمة معرفات البوتات الفرعية (Sub-Bots) النشطة حالياً
    // يتم تصفية الاتصالات للتأكد من أنها مفتوحة (ليست مغلقة)
    const subBots = [...new Set([
        ...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)
    ])]
    
    // 🛡️ إضافة البوت الرئيسي (إذا لم يكن مُضافاً بالفعل) لضمان اختياره إن لزم الأمر
    if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
        subBots.push(global.conn.user.jid)
    }

    const chat = global.db.data.chats[m.chat]

    // 🗡️ اختيار البوت الرئيسي الافتراضي (أول بوت في القائمة هو القائد المفترض)
    const who = subBots[0]    
    
    // ❌ التحقق من وجود بوت نشط
    if (!who) return conn.reply(m.chat, `لـم نـعـثـر عـلـى أي بـوت فـرعـي نـشـط لـتـعـيـيـنـه! *أين خدمي؟!* 😠`, m)

    // ⛔️ التحقق مما إذا كان البوت مُعيناً بالفعل
    if (chat.primaryBot === who) {
        return conn.reply(m.chat, `هـذا الـبـوت هـو بـالـفـعـل *الـقـائـد الـرئـيـسـي* لِـهـذه الـمـجـمـوعـة. لا تكرر الأوامر علي! 🙄`, m);
    }

    // ✅ تعيين البوت الرئيسي
    try {
        chat.primaryBot = who
        conn.reply(m.chat, `👑 *أَمْـرُ الـتَّـعْـيِـيـنِ نَـاجِـحٌ!*
تـم تـعـيـيـن الـقـائـد: *${who.split('@')[0]}* كـبـوت رئيـسـي لـلـمـجـمـوعـة.
> جـمـيـع الأوامـر سـتـنـفـذ الآن بـواـسـطـتـه فـقـط! ⚔️`, m)
    } catch (e) {
        // 🚨 معالجة الأخطاء
        conn.reply(m.chat, `⚠︎ حـدثـت مـشـكـلـة فـي تـنـفـيـذ أمـر الـمـلـك.\n> اسـتـخـدم *${usedPrefix}report* لإبـلاغ الـمـطـور.\n\n*الخطأ الفني:* ${e.message}`, m)
    }
}

// 📌 تعريف الأوامر والصلاحيات
handler.help = ['تعيين_الرئيسي']
handler.tags = ['مجموعة', 'ملك']
handler.command = ['set', 'تعيين_الرئيسي', 'تعيين_القائد'] // أوامر قوية
handler.group = true // يعمل في المجموعات فقط
handler.admin = true // يتطلب أن يكون المُرسل مشرفاً
handler.rowner = true // حصري للمالك

export default handler