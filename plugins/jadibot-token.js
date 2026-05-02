import fs from 'fs'

async function handler(m, { conn, usedPrefix }) {

// 🚩 تعريف الإيموجيات أو الثوابت المفقودة
const emoji = '🔑' // رمز مفتاح
const emoji2 = '⚠️' // رمز تحذير
const jadi = 'jadibot' // اسم مجلد ملفات الـ Jadibot

const user = m.sender.split('@')[0]

// 1. التحقق مما إذا كان المستخدم لديه جلسة Jadibot نشطة (ملف creds.json موجود)
if (fs.existsSync(`./${jadi}/` + user + '/creds.json')) {
    try {
        // قراءة محتوى ملف الجلسة (creds.json) وتحويله إلى Base64 Token
        let token = Buffer.from(fs.readFileSync(`./${jadi}/` + user + '/creds.json'), 'utf-8').toString('base64');
        
        // إرسال الرسالة الأولى (تنبيه بالخصوصية)
        await conn.reply(m.chat, `${emoji} *رمز التوكن (Token) الخاص بك جاهز!*\n\nهذا الرمز يسمح لك بتسجيل الدخول كـ "بوت فرعي" في أي بوت آخر. *ننصحك بشدة بعدم مشاركته مع أي شخص للحفاظ على خصوصيتك وأمان حسابك.*\n\n*توكن الجلسة الخاص بك هو:*`, m);
        
        // إرسال الرمز نفسه في رسالة منفصلة لسهولة النسخ
        await conn.reply(m.chat, token, m);
        
    } catch (error) {
        console.error('❌ خطأ في قراءة ملف الجلسة:', error);
        await conn.reply(m.chat, `${emoji2} *حدث خطأ أثناء قراءة ملف الجلسة الخاصة بك. الرجاء المحاولة لاحقاً.*`, m);
    }
} else {
    // 2. إرسال رسالة في حال عدم وجود جلسة نشطة
    await conn.reply(m.chat, `${emoji2} *ليس لديك توكن (Token) نشط حالياً.*\n\nالرجاء استخدام الأمر \`${usedPrefix}jadibot\` لإنشاء جلسة جديدة أولاً.`, m);
}

}

handler.help = ['token'];
handler.command = ['token', 'توكن', 'رمز_الجلسة'];
handler.tags = ['بوت_فرعي'];
handler.private = true; // الأمر يعمل فقط في الخاص

export default handler;