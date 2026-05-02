// الكود للملك تنغن 👑 - أمر الوضع اللامحدود (Cheat/Infinity Mode)
const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    
    // تأكد من تهيئة المستخدم إذا لم يكن موجوداً (لضمان عمل الكود)
    if (!user) {
        global.db.data.users[m.sender] = {};
    }

    // 1. منح الموارد اللانهائية
    global.db.data.users[m.sender].monedas = Infinity;
    global.db.data.users[m.sender].level = Infinity;
    global.db.data.users[m.sender].exp = Infinity;

    // 2. رسالة التأكيد الملكية
    // (افتراض أن fkontak متغير عام للرد بالاقتباس)
    await conn.sendMessage(m.chat, {
        text: `👑 *تم التفعيل!* الغراب الملك @${m.sender.split('@')[0]}، لديك الآن *موارد وصلاحيات لا محدودة* في النظام! ⚔️`, 
        mentions: [m.sender]
    }, { quoted: global.fkontak || m }); // استخدام m كبديل إذا لم يكن fkontak معرفًا

};

handler.help = ['وضع_لامحدود'];
handler.tags = ['ملك'];
handler.command = ['ilimitado', 'infiniy', 'chetar', 'وضع_لامحدود', 'صلاحيات_مطلقة'];
handler.rowner = true;
handler.fail = null;

export default handler;