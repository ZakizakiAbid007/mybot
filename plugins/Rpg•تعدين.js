// File: rpg-minar.js (أمر التعدين لـ تنغن بوت)

const COOLDOWN = 10 * 60 * 1000 // 10 دقائق
const MIN_REWARD = 500
const MAX_REWARD = 500

let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender]
    const now = Date.now()

    // التأكد من تهيئة البيانات الأساسية
    if (!user.health) user.health = 100
    if (!user.monedas) user.monedas = 0
    if (!user.exp) user.exp = 0

    if (!user.lastmiming) user.lastmiming = 0

    const tiempoRestante = COOLDOWN - (now - user.lastmiming)

    // 1. التحقق من الكولداون
    if (tiempoRestante > 0) {
        let time = msToTime(tiempoRestante)
        return conn.reply(m.chat, `⛏️ *التعدين في فترة انتظار*\n⏳ عد بعد: *${time}* لكسب المزيد من العملات.`, m)
    }

    // 2. شرط الصحة
    if (user.health < 50) return conn.reply(m.chat, '💢 *طاقتك منخفضة جداً!* أنت ضعيف للغاية للتعدين. استعد طاقتك أولاً.', m)

    // 3. حساب المكافآت
    let monedasGanadas = 500
    let expGanada = pickRandom([200, 300, 400, 500, 600])
    
    // فرصة 2% للعثور على الكنز (0.02)
    const encontroTesoro = Math.random() < 0.02 
    let mensajeExtra = ''

    if (encontroTesoro) {
        monedasGanadas += 1000000 // مليون عملة إضافية
        mensajeExtra = '\n👑 *¡لقد وجدت كنز ملك السحرة!* 💰\n*+1,000,000* عملة إضافية'
    }

    // 4. خصم الصحة وإضافة المكافآت وتحديث الوقت
    user.monedas += monedasGanadas
    user.exp += expGanada
    user.health -= 50
    user.lastmiming = now

    // 5. رسالة النجاح
    let msg = `
⛏️ *تم بـدء الـتـعـديـن*

✅ *تم الانتهاء من الحفر بنجاح:*
💰 العملات: *+${monedasGanadas.toLocaleString()} 🪙*
✨ الخبرة: *+${expGanada}*

❤️ استهلاك الطاقة: *-50 HP*
📅 وقت الانتظار: *10 دقائق*
${mensajeExtra}
`.trim()

    await conn.reply(m.chat, msg, m)
    await conn.sendMessage(m.chat, { react: { text: '⛏️', key: m.key } })

    // 6. رسالة الكنز (مع تأخير للمتعة)
    if (encontroTesoro) {
        setTimeout(() => {
            conn.reply(m.chat, '💎 *مسح المنطقة...*', m)
        }, 1500)

        setTimeout(() => {
            conn.reply(m.chat, '✨ *يظهر لمعان ذهبي تحت الأرض...*', m)
        }, 3000)

        setTimeout(() => {
            conn.reply(m.chat, '👑 *لـقـد اكـتـشـفـت كـنـز مـلـك الـسـحـرة!* 💰\\n\\nتربح *1,000,000* عملة إضافية! 🪙', m)
        }, 5000)
    }
}

handler.help = ['minar']
handler.tags = ['rpg', 'اقتصاد']
handler.command = ['تعدين', 'minar']
handler.register = true
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function msToTime(ms) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${h} ساعة ${m} دقيقة ${s} ثانية`
}