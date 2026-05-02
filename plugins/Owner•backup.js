import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // تعريف الإيموجيات كبديل للمتغيرات غير المعرفة في هذا الملف (مثل rwait, done, error)
    const rwait = '⌛'; // إيموجي الانتظار
    const done = '✅';  // إيموجي النجاح
    const error = '❌️'; // إيموجي الخطأ
    // افتراض وجود المتغيرات العامة أو استخدام قيم افتراضية
    const packname = global.packname || 'قاعدة_بيانات_البوت'; 
    const sessions = global.sessions || 'sessions'; 
    const fkontak = global.fkontak; // افتراض وجودها
    const fake = global.fake; // افتراض وجودها

    await m.reply(`❮🪐❯ » *جارٍ إرسال النسخة الاحتياطية لـ ${packname}...*`);
    
    try {
        await m.react(rwait);
        
        let d = new Date();
        // تنسيق التاريخ باللغة العربية
        let date = d.toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // قراءة الملفات
        let database = await fs.readFileSync(`./database.json`);
        let creds = await fs.readFileSync(`./${sessions}/creds.json`);
        
        // 1. إرسال التاريخ في الدردشة الحالية
        await conn.reply(m.chat, `*• التاريخ:* ${date}`, m, fake);
        
        // 2. إرسال ملف قاعدة البيانات (database.json) في الخاص
        await conn.sendMessage(m.sender, {
            document: database, 
            mimetype: 'application/json', 
            fileName: `database.json`
        }, { quoted: fkontak });
        await m.react(done);
        
        // 3. إرسال ملف الجلسة (creds.json) في الخاص
        await conn.sendMessage(m.sender, {
            document: creds, 
            mimetype: 'application/json', 
            fileName: `creds.json`
        }, { quoted: fkontak });
        await m.react(done);
        
        // 4. رسالة تأكيد إضافية في الخاص
        await conn.reply(m.sender, '✅ *تم إرسال قاعدة البيانات وملفات الجلسة بنجاح إلى الدردشة الخاصة بك.*', m, fake);
        
    } catch (e) {
        console.error(e);
        await m.react(error);
        conn.reply(m.chat, `❮❌️❯ » *حدث خطأ ما أثناء عملية النسخ الاحتياطي. تحقق من سجل الأخطاء (الكونسول).*`, m, fake);
    }
}

handler.help = ['نسخ_احتياطي'];
handler.tags = ['المالك'];
handler.command = ['backup', 'respaldo', 'copia', 'نسخ_احتياطي', 'باك_اب', 'احتياط']; // إضافة الأوامر العربية
handler.rowner = true; // حصرياً لمالك البوت الرئيسي

export default handler;