const handler = async (m, {conn, isOwner}) => {
    // تصفية المحادثات المحظورة
    const chats = Object.entries(global.db.data.chats).filter((chat) => chat[1].isBanned);
    // تصفية المستخدمين المحظورين
    const users = Object.entries(global.db.data.users).filter((user) => user[1].banned);
    
    const caption = `
┌〔 👤 المستخدمون المحظورون 〕
├ *الإجمالي:* ${users.length} ${users ? '\n' + users.map(([jid], i) => `
├ ${isOwner ? '@' + jid.split`@`[0] : jid}`.trim()).join('\n') : '├ لا يوجد مستخدمون محظورون'}
└────

┌〔 💬 المحادثات المحظورة 〕
├ *الإجمالي:* ${chats.length} ${chats ? '\n' + chats.map(([jid], i) => `
├ ${isOwner ? '@' + jid.split`@`[0] : jid}`.trim()).join('\n') : '├ لا توجد محادثات محظورة'}
└────
`.trim();

    // إرسال الرد مع منشنة المستخدمين المحظورين (إذا كان المالك)
    m.reply(caption, null, {mentions: conn.parseMention(caption)});
};

handler.command = ['banlist', 'listban', 'قائمة_الحظر', 'المحظورون'] // إضافة الأوامر العربية
handler.rowner = true; // حصرياً لمالك البوت الرئيسي
export default handler;