// File: rpg-work.js (أمر العمل وكسب المال لـ تنغن بوت)

const COOLDOWN = 60 * 60 * 1000 // 1 ساعة
const MIN_REWARD = 1000
const MAX_REWARD = 5000

let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender]
    const now = Date.now()

    if (!user.lastWork) user.lastWork = 0

    const tiempoRestante = COOLDOWN - (now - user.lastWork)

    // 1. التحقق من الكولداون
    if (tiempoRestante > 0) {
        let time = msToTime(tiempoRestante)
        return conn.reply(m.chat, `⏳ لقد عملت مؤخراً. عُد بعد *${time}* لكسب المزيد من العملات.`, m)
    }

    // 2. قائمة الوظائف المترجمة
    const trabajos = [
        'مبرمج 💻', 'هاكر 🕶️', 'سائق توصيل 🚴', 'خباز 🥖',
        'محارب ⚔️', 'ساحر 🔮', 'صياد 🏹', 'عامل منجم ⛏️',
        'صانع محتوى (ستريمر) 🎥', 'طباخ (شيف) 👨‍🍳', 'مرتزق 💣', 'رائد فضاء 🚀',
        'قرصان 🏴‍☠️', 'موسيقي 🎸', 'فنان 🎨', 'إطفائي 🚒',
        'شرطي 👮', 'محقق 🕵️', 'قاضٍ ⚖️', 'راقص 💃',
        'مهندس 🏗️', 'كاتب ✍️', 'مصور 📸', 'بائع 🛍️'
    ]
    
    // 3. اختيار الوظيفة والمكافأة
    const trabajoElegido = trabajos[Math.floor(Math.random() * trabajos.length)]
    const recompensa = Math.floor(Math.random() * (MAX_REWARD - MIN_REWARD + 1)) + MIN_REWARD

    // 4. إضافة المكافأة وتحديث الوقت
    user.monedas = (user.monedas || 0) + recompensa
    user.lastWork = now

    // 5. رسالة النجاح
    return conn.reply(m.chat, `✅ *لقد عملت كـ ${trabajoElegido}* وكسبت *${recompensa.toLocaleString()} عملة 🪙*.\n💼 عُد بعد ساعة واحدة للمواصلة!`, m)
}

handler.help = ['trabajar', 'work']
handler.tags = ['rpg', 'اقتصاد']
handler.command = ['عمل', 'trabajar', 'work', 'ورك']
handler.register = true

export default handler

// دالة مساعدة لتحويل الوقت
function msToTime(duration) {
    const minutes = Math.floor((duration / 1000 / 60) % 60)
    const hours = Math.floor((duration / 1000 / 60 / 60) % 24)
    return `${hours} ساعة ${minutes} دقيقة`
}