/* Creado por https://github.com/FG98F */

const handler = async (m, {conn}) => {
    // 🚀 جلب قائمة الأرقام المحظورة من البوت
    await conn.fetchBlocklist().then(async (data) => {
        // بناء نص الرسالة
        let txt = `*≡ قائمة الأرقام المحظورة*\n\n*الإجمالي:* ${data.length}\n\n┌─⊷\n`;
        
        // إضافة كل رقم محظور إلى القائمة
        for (const i of data) {
            txt += `▢ @${i.split('@')[0]}\n`;
        }
        
        txt += '└───────────';
        
        // إرسال الرد مع منشنة جميع الأرقام المحظورة (parseMention)
        return conn.reply(m.chat, txt, m, {mentions: await conn.parseMention(txt)});
    }).catch((err) => {
        console.log(err);
        // رسالة الخطأ في حالة عدم وجود أرقام محظورة
        throw 'لا يوجد أرقام محظورة حالياً.';
    });
};

handler.help = ['قائمة_الحظر_الواجهة'];
handler.tags = ['المالك'];
handler.command = ['blocklist', 'listblock', 'قائمة_الحظر_الواجهة']; // إضافة الأوامر العربية
handler.rowner = true; // حصرياً لمالك البوت الرئيسي
export default handler;