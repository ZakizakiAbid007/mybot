import util from 'util'
import path from 'path'

// دالة مساعدة لتحويل معرف (JID) إلى إشارة @
let user = a => '@' + a.split('@')[0]

// دالة مساعدة لاختيار عنصر عشوائي من قائمة
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    // التحقق من وجود نص مدخل من قبل المستخدم
    if (!text) return conn.reply(m.chat, 'مثال للاستخدام: #top *النص*', m)

    const participants = groupMetadata.participants.map(v => v.id)
    const picks = []

    // خلط قائمة المشاركين عشوائياً
    let shuffled = [...participants].sort(() => 0.5 - Math.random())
    // اختيار أول 10 مستخدمين (أو أقل)
    let topUsers = shuffled.slice(0, Math.min(10, shuffled.length))

    // قائمة رموز تعبيرية للاختيار العشوائي
    const emojis = ['🤓','😅','😂','😳','😎','🥵','😱','🤑','🙄','💩','🍑','🤨','🥴','🔥','👇🏻','😔','👀','🌚']
    const x = pickRandom(emojis)

    // بناء رسالة العنوان
    let topMessage = `*${x} أفضل ${topUsers.length} ${text} ${x}*\n`
    
    // إضافة المستخدمين إلى الرسالة
    topUsers.forEach((id, i) => {
        topMessage += `\n*${i + 1}. ${user(id)}*`
    })

    // إرسال الرسالة مع وسم (Mentions) جميع المستخدمين المختارين
    conn.sendMessage(m.chat, { text: topMessage, mentions: topUsers })
}

// إعدادات المعالج
handler.help = ['top *<نص>*']
handler.command = ['توب', 'الأفضل'] // إضافة أمر مترجم
handler.tags = ['ترفيه'] // ترجمة الوسم
handler.group = true // يعمل في المجموعات فقط

export default handler