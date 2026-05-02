let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    // التحقق من أن الأمر يُستخدم في مجموعة
    if (!m.isGroup) throw '⚠️ **لا يمكن استخدام هذا الأمر إلا في المجموعات.**';

    let who;
    // تحديد الروبوت الهدف
    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]; // تم الإشارة إليه
    } else if (m.quoted) {
        who = m.quoted.sender; // تم الرد عليه
    } else if (text) {
        // تم إدخال رقم (يتم تنظيفه)
        who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        // لا يوجد تحديد للروبوت
        return m.reply(`⚠️ **يجب عليك الإشارة (منشن)، أو الرد، أو كتابة رقم الروبوت الذي تود تعيينه كروبوت أساسي.**`);
    }

    let botJid = who;
    if (who.endsWith('@lid')) {
        const pInfo = participants.find(p => p.lid === who);
        if (pInfo && pInfo.id) botJid = pInfo.id;
    }

    // تهيئة بيانات المجموعة إذا لم تكن موجودة
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

    // التحقق مما إذا كان الروبوت قد تم تعيينه بالفعل
    if (global.db.data.chats[m.chat].primaryBot === botJid) {
        return conn.reply(m.chat, `✨ **@${botJid.split`@`[0]} هو بالفعل الروبوت الأساسي لهذه المجموعة.**`, m, { mentions: [botJid] });
    }

    // تعيين الروبوت الأساسي الجديد
    global.db.data.chats[m.chat].primaryBot = botJid;

    // رسالة التأكيد
    let response = `
『 🤖 』⋮⋮ **تم تعيين الروبوت الأساسي:**
> *@${botJid.split('@')[0]}*

『 ℹ️ 』⋮⋮ **تأثير التعيين:**
> من الآن فصاعداً، سيتم تنفيذ جميع أوامر المجموعة بواسطته حصراً.

『 ⚠️ 』⋮⋮ **ملاحظة:**
> إذا أردت أن تعود جميع الروبوتات للرد على الأوامر، استخدم الأمر *resetbot* (بدون بادئة).
`.trim();

    await conn.sendMessage(m.chat, { 
        text: response, 
        mentions: [botJid] 
    }, { quoted: m });
}

// ------------------------------------
// تعريب الأوامر
// ------------------------------------
// الأمر الآن هو: !تعيين_بوت أو !البوت_الرئيسي
handler.help = ['تعيين_بوت <الرقم/الإشارة>'];
handler.tags = ['owner', 'group'];

// تعيين الأوامر المعرّبة
handler.command = ['تعيين_بوت', 'البوت_الرئيسي']; 

handler.admin = true;
handler.group = true;

export default handler;