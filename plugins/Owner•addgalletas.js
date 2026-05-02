import db from '../lib/database.js'

import MessageType from '@whiskeysockets/baileys'
let impts = 0 // نسبة الضريبة (صفر في هذا الكود)
let handler = async (m, { conn, text }) => {
    let who
    
    // تحديد المستخدم المستهدف (منشن أو الدردشة الخاصة)
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    
    // 1. التحقق من منشن المستخدم
    if (!who) return m.reply('⚠️️ *الرجاء منشن (تاغ) المستخدم الذي تريد إضافة الكوكيز له.*')
    
    // استخراج النص (الكمية) بعد المنشن
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    
    // 2. التحقق من إدخال الكمية
    if (!txt) return m.reply('⚠️️ *أدخل عدد الكوكيز (النقاط) الذي تريد إضافته.*')
    
    // 3. التحقق من أن الكمية رقم
    if (isNaN(txt)) return m.reply('⚠️ *أرقام فقط!*')
    
    let dmt = parseInt(txt)
    let cookies = dmt
    let pjk = Math.ceil(dmt * impts) // حساب الضريبة (صفر)
    cookies += pjk // بما أن impts = 0، cookies = dmt
    
    // 4. التحقق من أن الكمية أكبر من 1
    if (cookies < 1) return m.reply('⚠️️ *الحد الأدنى للإضافة هو 1*')
    
    let users = global.db.data.users
    // إضافة الكمية (dmt) إلى رصيد المستخدم
    users[who].cookies = (users[who].cookies || 0) + dmt

    // 5. إرسال رسالة تأكيد للمنفذ
    await conn.reply(m.chat, `⊜ *🍪 تمت_الإضافة_بنجاح*
┏━━━━━━━━━━━⬣
┃⋄ *الكمية_المضافة:* ${dmt}
┗━━━━━━━━━━━⬣`, m, rcanal)
    
    // 6. إرسال إشعار للمستلم (fakeReply)
    conn.fakeReply(m.chat, `⊜ *_تلقيت للتو_* \n\n *_+${dmt} كوكيز 🍪_*`, who, m.text)
}

handler.help = ['إضافة_كوكيز *<@المستخدم>*']
handler.tags = ['المالك']
handler.command = ['addcookies', 'addcookie', 'addgalletas', 'إضافة_كوكيز', 'أضف_نقاط'] // إضافة الأوامر العربية
handler.rowner = true // حصرياً لمالك البوت

export default handler