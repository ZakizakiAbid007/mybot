// File: rpg-daily.js (المكافأة اليومية/نصف يومية لـ تنغن بوت)

// دالة مساعدة لتحويل الوقت بالمللي ثانية إلى تنسيق مفهوم (ساعة، دقيقة، ثانية)
function msToTime(duration) {
    const hours = Math.floor(duration / 3600000)
    const minutes = Math.floor((duration % 3600000) / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`
}

// دالة مساعدة لاختيار قيمة عشوائية
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

// الكولداون 12 ساعة
const cooldown = 12 * 60 * 60 * 1000 

var handler = async (m, { conn, isPrems }) => {
    const user = global.db.data.users[m.sender]
    const now = Date.now()

    // 1. التحقق من الكولداون
    if (user.lastclaim && now - user.lastclaim < cooldown) {
        const timeLeft = msToTime(cooldown - (now - user.lastclaim))
        return conn.reply(m.chat, `⏳ *نظام المكافآت مغلق حالياً يا تنغن*\n\n🧬 عد في: *${timeLeft}*`, m)
    }

    // 2. تحديد المكافآت
    const coin = pickRandom([500, 700, 1000, 1500, 2000, 3000, 5000]) // العملات
    // مكافأة الخبرة (أعلى للمميزين)
    const exp = isPrems
        ? pickRandom([1500, 2000, 2500, 3000, 4000])
        : pickRandom([700, 900, 1200, 1500, 1800])

    const diamonds = pickRandom([1, 2, 3, 4, 5]) // الماس

    // 3. إضافة المكافآت وتحديث الوقت
    user.monedas = (user.monedas || 0) + coin
    user.exp = (user.exp || 0) + exp
    user.diamond = (user.diamond || 0) + diamonds
    user.lastclaim = now

    // 4. رسالة الإستلام
    return conn.reply(m.chat, `
╔══🎁[ مكــافــأة تنغــن اليوميـة ]══╗
┃ 🧬 تم توليد مكافأتك بواسطة النظام.
┃ ⚡ المستخدم: *@${m.sender.split("@")[0]}*
┃ 🧠 عضوية مميزة: *${isPrems ? '✅' : '❌'}*
╠═══════════════════════
┃ ✨ الخبرة (XP): *+${exp}*
┃ 💰 العملات: *+${coin} 🪙*
┃ 💎 الماس: *+${diamonds}*
╚══════════════════════╝

🕐 يمكنك إعادة المطالبة بعد 12 ساعة.
`, m, { mentions: [m.sender] })
}

handler.help = ['daily', 'claim', 'يومي']
handler.tags = ['rpg', 'اقتصاد']
handler.command = ['daily', 'claim', 'يومي']
handler.register = true

export default handler