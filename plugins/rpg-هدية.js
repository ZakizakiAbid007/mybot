// File: rpg-mysterybox.js (صندوق الحظ لـ تنغن بوت)

let handler = async (m, { conn, command }) => {
    const user = global.db.data.users[m.sender]
    // كولداون 30 دقيقة
    const cooldown = 1000 * 60 * 30 
    const tiempoRestante = cooldown - (new Date() - (user.lastbox || 0))

    if (tiempoRestante > 0) {
        let minutos = Math.floor(tiempoRestante / 60000)
        let segundos = Math.floor((tiempoRestante % 60000) / 1000)
        return m.reply(`⏳ *انتظر يا تنغن!* عليك الانتظار *${minutos} دقيقة و ${segundos} ثانية* لفتح صندوق حظ جديد.`)
    }

    // فرصة 1% للحصول على الجائزة الخاصة
    let especial = Math.random() < 0.01

    let premio
    if (especial) {
        premio = 500000
        await m.reply(
            `✨🎉 *مبـــــروك يــا مــلـك الــمـهـرجـانـات!* 🎉✨\n\n` +
            `لقد ربحت *صندوق الحظ الأسطوري* وحصلت على:\n\n` +
            `💰 *${premio.toLocaleString()} عملة* 🪙\n\n` +
            `🌟 فلترافقك الثروة والبركة في مغامراتك القادمة! 🌟`
        )
    } else {
        // الجائزة العادية (بين 10,000 و 50,000)
        premio = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000
        await m.reply(`🎁 *لقد فتحت صندوق حظ عادياً!*\n💰 حصلت على: *${premio.toLocaleString()} عملة* 🪙`)
    }

    // إضافة الجائزة وتحديث وقت آخر استخدام
    user.monedas = (user.monedas || 0) + premio
    user.lastbox = new Date() * 1
}

handler.help = ['cajamisteriosa']
handler.tags = ['ألعاب', 'اقتصاد']
handler.command = ['صندوق-الحظ', 'box', 'حظي', 'هدية']
handler.register = true

export default handler