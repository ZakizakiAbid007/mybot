import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
// 🚩 ملاحظة: يجب تعريف متغير rcanal في الملفات العامة، وإلا فسيحدث خطأ.
let img = await (await fetch(`https://qu.ax/BltWe.jpg`)).buffer()
let name = conn.getName(m.sender)
let user = global.db.data.users[m.sender]

// 1. إذا كان لا يستطيع الارتقاء بالمستوى بعد
if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    let { min, xp, max } = xpRange(user.level, global.multiplier)
    
    // رسالة عدم كفاية الخبرة
    let txt = `🍬 *الاسم:* ${name}\n\n`
    txt += `🚩 *المستوى الحالي:* ${user.level}\n`
    txt += `🍭 *الخبرة (XP):* ${user.exp - min} / ${xp}\n\n`
    txt += `🍁 الخبرة غير كافية! تحتاج إلى *${max - user.exp}* XP أخرى! ✨`
    
    // إرسال الرسالة
    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
    
// 2. إذا كان مؤهلاً للارتقاء بالمستوى
} else {
    let before = user.level * 1
    
    // حساب المستويات الجديدة
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    
    // رسالة التهنئة بالارتقاء
    if (before !== user.level) {
        let txt = `🎊 تــهـــانـــيـــنـــا 🎊\n\n` 
        txt += `*${before}* ➔ *${user.level}* [ ${user.role} ]\n\n`
        txt += `• 🧬 المستوى السابق: ${before}\n`
        txt += `• 🧬 المستوى الجديد: ${user.level}\n`
        txt += `• 📅 التاريخ: ${new Date().toLocaleString('ar-EG')}\n\n`
        txt += `🚩 *ملاحظة:* _كلما تفاعلت أكثر مع *Yotsuba Nakano*, زاد مستواك_`
        
        // إرسال الرسالة
        await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
    }
}
}

handler.help = ['ارتقاء_المستوى']
handler.tags = ['rpg']
handler.command = ['nivel', 'lvl', 'levelup', 'level', 'لفل', 'ارتقاء', 'ارتقاء_المستوى'] // إضافة الأوامر العربية
handler.register = true 
export default handler