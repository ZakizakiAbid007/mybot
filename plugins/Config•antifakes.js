import db from '../lib/database.js'
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin} ) {
if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
if (isBotAdmin && chat.antifake) {
    
    // قائمة رموز الدول المحظورة (تم تصحيح الأقواس البرمجية)
    const blockedPrefixes = [
        '6',  // واسع النطاق (مثل 60، 62، 65، 66، 67، 68)
        '90', // تركيا
        // تم إزالة '212' (المغرب) لمنع حظر الأعضاء المحليين
        '92', // باكستان
        '93', // أفغانستان
        '94', // سريلانكا
        '62',  // روسيا/كازاخستان
        '49', // ألمانيا
        '32',  // واسع النطاق (مثل 20، 27، 21)
        '91', // الهند
        '48'  // بولندا
    ];
    
    // استخراج رقم المرسل (بدون @s.whatsapp.net)
    const senderNumberPrefix = m.sender.split('@')[0].substring(0, 3) || '';
    
    // التحقق من الرقم مقابل القائمة المحظورة
    let isBlocked = false;
    for (const prefix of blockedPrefixes) {
        if (senderNumberPrefix.startsWith(prefix)) {
            isBlocked = true;
            break;
        }
    }

    if (isBlocked) {
        global.db.data.users[m.sender].block = true;
        // طرد المستخدم
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        // يمكن إضافة رسالة تنبيه هنا إذا أردت
        // conn.reply(m.chat, `⚠️ *تم طرد رقم دولي غير مصرح به.*`, m)
    }
}}
export default handler