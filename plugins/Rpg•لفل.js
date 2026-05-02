// File: level.js (نظام المستوى لـ تنغن بوت)
// يعتمد على ملف levelling.js الخارجي و global.multiplier
import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // 1. جلب الصورة وبيانات المستخدم
    let img = await (await fetch(`https://telegra.ph/file/b97148e2154508f63d909.jpg`)).buffer()
    let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]

    // 2. حفظ المستوى قبل التحديث
    let before = user.level * 1

    // 3. رفع المستوى (قد يستمر في الرفع أكثر من مرة إذا كان لديه XP كافية لعدة مستويات)
    // نفترض وجود global.multiplier
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++
    }

    // 4. حالة: لم يرتفع المستوى (عرض التقدم)
    if (before === user.level) {
        let { min, xp, max } = xpRange(user.level, global.multiplier)
        let txt = `
✨ *حالة المستوى* ✨

*👑 الاسم:* ${name}
*🚩 المستوى الحالي:* ${user.level}
*🔮 الخبرة (XP):* ${user.exp - min} / ${xp}

*🐢 ملاحظة:* لترفع مستواك، تحتاج إلى *${max - user.exp}* نقطة خبرة (XP) إضافية.
_تفاعل أكثر لجمع الخبرة!_`.trim()

        await conn.sendMessage(m.chat, {
            image: img,
            caption: txt
        }, { quoted: m })

        return
    }

    // 5. حالة: ارتفع المستوى (رسالة تهنئة)
    // تعيين دور افتراضي إذا لم يكن موجوداً (وهو ما تم تغطيته في كود الرتب السابق)
    if (!user.role) user.role = 'متدرب'

    let txt = `
🎉 *تـهـانـيـنـا يـا مـلـك الـمـهـرجـانـات!* 🎉

*👑 الساحر:* ${name}
*⬆️ المستوى الآن:* ${before} ➔ *${user.level}*
*🎖️ رتبتك:* [ *${user.role}* ]

*• 📅 التاريخ:* ${new Date().toLocaleString('ar-EG')}

*🚩 ملاحظة:* _كلما تفاعلت أكثر مع *تنغن بوت*، كلما ارتفعت مستواك ورتبتك أسرع._`.trim()

    await conn.sendMessage(m.chat, {
        image: img,
        caption: txt
    }, { quoted: m })
}

handler.help = ['level', 'مستوى']
handler.tags = ['اقتصاد', 'rpg']
handler.command = ['مستوى', 'lvl', 'levelup', 'level', 'لفل']
handler.register = true

export default handler