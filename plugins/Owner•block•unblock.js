const handler = async (m, {text, conn, usedPrefix, command}) => {
    // رسالة الاستخدام الخاطئ (why)
    const why = `🍟 *طريقة الاستخدام الخاطئة. الاستخدام الصحيح:*\n*${usedPrefix + command} @${m.sender.split('@')[0]}*`;
    
    // تحديد المستخدم المستهدف (منشن، اقتباس، أو رقم)
    const who = m.mentionedJid[0] ? 
        m.mentionedJid[0] : 
        m.quoted ? 
        m.quoted.sender : 
        text ? 
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : 
        false;
        
    // التحقق من وجود مستخدم مستهدف
    if (!who) return conn.reply(m.chat, why, m, {mentions: [m.sender]});
    
    const res = [];
    
    switch (command) {
        case 'blok':
        case 'block':
        case 'حظر_واجهة': // أمر حظر بالواجهة (Block UI)
            if (who) {
                await conn.updateBlockStatus(who, 'block').then(() => {
                    res.push(who);
                });
            } else conn.reply(m.chat, why, m, {mentions: [m.sender]});
            break;
            
        case 'unblok':
        case 'unblock':
        case 'الغاء_حظر_واجهة': // أمر إلغاء حظر بالواجهة (Unblock UI)
            if (who) {
                await conn.updateBlockStatus(who, 'unblock').then(() => {
                    res.push(who);
                });
            } else conn.reply(m.chat, why, m, {mentions: [m.sender]});
            break;
    }
    
    // رسالة النجاح
    if (res[0]) {
        conn.reply(m.chat, `🚩 *نجاح! تم استخدام الأمر ${command} على المستخدم ${res ? `${res.map((v) => '@' + v.split('@')[0])}` : ''}*`, m, {mentions: res});
    }
};

handler.command = ['block', 'unblock', 'blok', 'unblok', 'حظر_واجهة', 'حقه']; // إضافة الأوامر العربية
handler.rowner = true; // حصرياً لمالك البوت الرئيسي
export default handler;