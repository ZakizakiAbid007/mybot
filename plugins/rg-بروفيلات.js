// File: rpg-perfil.js (الملف الشخصي/كتاب التعاويذ لـ تنغن بوت)

import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'

const imagen1 = 'https://files.catbox.moe/7sc3os.jpg' // صورة افتراضية في حالة الفشل

var handler = async (m, { conn }) => {
    // 1. تحديد المستخدم (سواء كان المرسل أو من تم ذكره)
    let who = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
        ? conn.user.jid
        : m.sender

    // 2. جلب صورة البروفايل
    let pp
    try {
        pp = await conn.profilePictureUrl(who, 'image')
    } catch {
        pp = imagen1
    }

    let user = global.db.data.users[m.sender]
    
    // 3. تهيئة البيانات الأساسية للمستخدم إذا لم يكن موجوداً
    if (!user) {
        global.db.data.users[m.sender] = {
            premium: false,
            level: 0,
            monedas: 0, // العملات
            exp: 0,
            lastclaim: 0,
            registered: false,
            regTime: -1,
            age: 0,
            role: '⭑ Novato ⭑' // يجب تعريب هذه القيمة في ملف handler.before
        }
        user = global.db.data.users[m.sender]
    }

    let { premium, level, exp, registered, role } = user
    let username = await conn.getName(who)

    // 4. رسالة الحركة التحضيرية
    let animacion = `
〘 *نظام سحري* 〙📖

🔒 جاري الكشف عن الطاقة السحرية...
⏳ جاري تحليل كتاب التعاويذ (الغرِموير) الخاص بالمستخدم...
💠 جاري المزامنة مع المانا...

✨✨✨ *اِكْتِمَالُ التَّفْعِيلِ* ✨✨✨

*تم فتح كتاب التعاويذ...*
`.trim()

    await conn.sendMessage(m.chat, { text: animacion }, { quoted: m })

    // 5. محتوى المستخدم العادي (الأساسي)
    let noprem = `
『 كِتَابُ التَّعَاوِيذِ الأَسَاسِيِّ 』📕

⚔️ *المستخدم:* ${username}
🆔 *المعرف:* @${who.replace(/@.+/, '')}
📜 *مسجل:* ${registered ? '✅ مفعل' : '❌ لا'}

🧪 *الحالة السحرية:*
⚡ *المستوى:* ${level}
✨ *الخبرة (EXP):* ${exp}
📈 *الرتبة:* ${role}
🔮 *العضوية المميزة:* ❌ غير مفعلة

📔 *كتاب التعاويذ:* أساسي (ورقة واحدة) 📘
🔒 *العنصر:* غير معروف

📌 قم بترقية كتاب التعاويذ الخاص بك لفتح المزيد من السحر...

━━━━━━━━━━━━━━━━━━
`.trim()

    // 6. محتوى المستخدم المميز (وضع الشيطان)
    let prem = `
👹〘 وِضْعُ الشَّيْطَانِ: *مُفَعَّل* 〙👹

🌌 كِتَابُ التَّعَاوِيذِ الخَاصِّ (A)

🧛 *المستخدم النخبوي:* ${username}
🧿 *ID:* @${who.replace(/@.+/, '')}
✅ *مسجل:* ${registered ? 'نعم' : 'لا'}
👑 *الرتبة:* 🟣 *شيطان أسمى*

🔮 *الطاقة المظلمة:*
⚡ *المستوى:* ${level}
🌟 *الخبرة (EXP):* ${exp}
🪄 *الرتبة السحرية:* ${role}
💠 *حالة العضوية المميزة:* ✅ مُفَعَّلَة

📕 *كتاب التعاويذ:* ☯️ مُضاد للسحر (5 أوراق)
🔥 *الوضع الخاص:* ✦ *استيقاظ أستا المظلم*
🧩 *العنصر:* مُضاد للسحر وسيف شيطاني

📜 *تعويذة مفتوحة:* 
❖ 「𝙱𝚕𝚊𝚌𝚔 the Legends ⚡」
   ↳ ضرر هائل ضد البوتات المعادية.

📔 *ملاحظة:* لقد تجاوز هذا المستخدم حدوده... ☄️

🌌⟣══════════════⟢🌌
`.trim()

    // 7. إرسال الرسالة النهائية
    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: premium ? prem : noprem,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['الملف_الشخصي']
handler.register = true
handler.group = true
handler.tags = ['rpg', 'ملف-شخصي']
handler.command = ['ملف-شخصي', 'profile', 'بروفيلات']
export default handler