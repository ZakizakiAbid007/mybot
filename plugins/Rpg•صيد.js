// File: rpg-hunt.js (أمر الصيد والمطاردة لـ تنغن بوت)

let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ المستخدم غير موجود في قاعدة البيانات.')

    const cooldown = 30 * 60 * 1000 // 30 دقيقة
    const now = Date.now()

    if (!user.lastCazar) user.lastCazar = 0

    if (now - user.lastCazar < cooldown) {
        const remaining = cooldown - (now - user.lastCazar)
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        return m.reply(`⏳ يجب عليك الانتظار *${minutes}د ${seconds}ث* للعودة إلى الصيد مجدداً.`)
    }

    const objetos = [
        '🐗 خنزير بري',
        '🐍 ثعبان سام',
        '🐺 ذئب ضاري',
        '🐉 تنين صغير',
        '🦅 نسر ملكي',
        '🐰 أرنب سريع',
        '🦊 ثعلب ماكر',
        '🦁 أسد متوحش',
        '🐅 نمر مفترس',
        '🦄 حصان أحادي القرن',
        '🐉 وحش مجنح (Wyvern)',
        '🦖 ديناصور منقرض',
        '🕷️ عنكبوت عملاق',
        '🐉 تنين ناري',
        '🦦 ثعلب الماء السحري',
        '🐲 تنين شرقي',
        '🦈 سمكة قرش',
        '🐊 تمساح عملاق',
        '🦅 صقر حر'
    ]

    const resultado = objetos[Math.floor(Math.random() * objetos.length)]
    // المكافأة تتراوح بين 5,000 و 20,000 عملة
    const recompensa = Math.floor(Math.random() * 15000) + 5000 

    user.monedas = (user.monedas || 0) + recompensa
    user.lastCazar = now

    return m.reply(`🏹 *لقد خرجت في رحلة صيد!*\\n*هدف الصيد:* ${resultado}\\n💰 *المكافأة:* *${recompensa.toLocaleString()} عملة* 🪙`)
}

handler.command = ['cazar', 'hunt', 'صيد', 'قنص', 'مطاردة']
handler.tags = ['rpg', 'ألعاب']
handler.help = ['cazar']
export default handler