// File: rpg-rob.js (أمر السرقة لـ تنغن بوت)

const COOLDOWN = 2 * 60 * 60 * 1000 // ساعتان
const MIN_ROB = 2000
const MAX_ROB = 50000

// رسائل النجاح (تم تعريبها وتخصيص @TARGET للمذكور)
const frases = [
    "💰 لقد حصلت على غنيمة جيدة من @TARGET.",
    "🪙 سرقت العملات ببراعة من @TARGET.",
    "🚀 نجاح كاسح! @TARGET لم يلاحظ شيئاً.",
    "🏴‍☠️ كقرصان حقيقي، سرقت من @TARGET.",
    "🎯 أصبت جيب @TARGET مباشرة.",
    "🕵️‍♂️ بخفاء، أخذت عملات من @TARGET.",
    "🔥 سرقت بسرعة قبل أن يتمكن @TARGET من الرد.",
    "💸 العملات تتطاير إلى جيبك من @TARGET.",
    "⚡ عملية سرقة خاطفة ومكتملة على @TARGET.",
    "🎉 حظ مؤقت حصلت عليه من @TARGET.",
    "👀 لم ير أحد كيف سرقت @TARGET.",
    "💎 أخذت عملات ثمينة من @TARGET.",
    "🥷 سرقت @TARGET بمهارة دون ترك أي أثر.",
    "🏹 كانت عملية سرقتك لـ @TARGET مثالية.",
    "🛡️ سرقت العملات بينما كان @TARGET مشتتاً."
]

const handler = async (m, { conn }) => {
    const userData = global.db.data.users[m.sender]
    const now = Date.now()

    // 1. التحقق من الكولداون (فترة الانتظار)
    if (userData.lastrob2 && now - userData.lastrob2 < COOLDOWN) {
        const timeLeft = msToTime(COOLDOWN - (now - userData.lastrob2))
        return conn.reply(m.chat, `🚩 *مازال نظام السرقة في وضع الاستراحة.*\n\n⏳ انتظر ${timeLeft} لتتمكن من السرقة مجدداً.`, m)
    }

    // 2. تحديد الهدف
    let target
    if (m.isGroup) {
        target = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted?.sender
    } else {
        target = m.chat
    }

    if (!target) return conn.reply(m.chat, `🚩 يجب عليك ذكر شخص ما (تاغ) لسرقته.`, m)
    if (!(target in global.db.data.users)) return conn.reply(m.chat, `🚩 هذا المستخدم غير مسجل في قاعدة بيانات البوت.`, m)
    if (target === m.sender) return conn.reply(m.chat, `🚩 لا يمكنك سرقة نفسك! هذا غباء.`, m)

    const targetData = global.db.data.users[target]

    // 3. التحقق من الحد الأدنى للهدف
    if (!targetData.monedas || targetData.monedas < MIN_ROB) {
        return conn.reply(m.chat, `😔 @${target.split("@")[0]} لديه أقل من ${MIN_ROB} عملة 🪙، لا تسرق الفقراء!`, m, { mentions: [target] })
    }

    // 4. حساب المبلغ المسروق
    let robbedAmount
    // 1% فرصة لسرقة كل شيء
    if (Math.random() < 0.01) {
        robbedAmount = targetData.monedas
    } else {
        robbedAmount = Math.floor(Math.random() * (MAX_ROB - MIN_ROB + 1)) + MIN_ROB
        // التأكد من أن المبلغ المسروق لا يتجاوز ما يملكه الهدف
        if (robbedAmount > targetData.monedas) robbedAmount = targetData.monedas
    }

    // 5. تحديث الأرصدة وتسجيل وقت السرقة
    userData.monedas = (userData.monedas || 0) + robbedAmount
    targetData.monedas -= robbedAmount
    userData.lastrob2 = now

    // 6. إرسال رسالة النجاح
    const frase = frases[Math.floor(Math.random() * frases.length)].replace("@TARGET", `@${target.split("@")[0]}`)
    return conn.reply(m.chat, `${frase}\n\n🚩 لقد سرقت *${robbedAmount.toLocaleString('ar-EG')}* عملة 🪙.`, m, { mentions: [target] })
}

handler.help = ['rob2']
handler.tags = ['rpg', 'اقتصاد']
handler.command = ['سرقة', 'نصب', 'نهب', 'اغتيال']
export default handler

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    
    let parts = []
    if (hours > 0) parts.push(`${hours} ساعة`)
    if (minutes > 0) parts.push(`${minutes} دقيقة`)
    if (seconds > 0) parts.push(`${seconds} ثانية`)
    
    return parts.length > 0 ? parts.join(' و ') : 'أقل من ثانية'
}