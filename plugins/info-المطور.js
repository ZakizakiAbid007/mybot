// File: مطور.js
import PhoneNumber from 'awesome-phonenumber';

// نفترض تعريف المتغيرات العالمية هنا أو في مكان آخر (مثل settings.js)
// يجب عليك استبدال هذه القيم بقيمك الخاصة يا تنغن.
const global_dev = 'تنغن ملك المهرجانات'; // اسمك
const global_correo = 'Tenghen@example.com'; 
const global_yt = 'https://whatsapp.com/channel/0029VbBeu0o002T9NQnURQ2V'; // قناتك الرسمية
const global_packname = 'تـنـغـن بـوت';
const global_md = 'https://chat.whatsapp.com/رابط-مجموعة-البوت'; // رابط مجموعة البوت

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    
    // 1. تحديد أرقام المالك والبوت (تم استخدام أرقامك يا تنغن للنموذج)
    let nomor_owner = '212706595340'; // رقمك الأول
    let nomor_bot_helper = '212627416260'; // رقمك الثاني (كمساعد)

    // 2. جلب حالة (Bio) المالك والبوت
    let bio_owner = (await conn.fetchStatus(nomor_owner + '@s.whatsapp.net').catch(_ => {}))?.status || '👑 تنغن ملك المهرجانات والمطور الرئيسي.';
    let bio_bot = (await conn.fetchStatus(conn.user.jid).catch(_ => {}))?.status || '🤖 أنا بوت تنغن، هنا للمساعدة!';

    // 3. إرسال بطاقات الاتصال (VCards)
    await sendContactArray(conn, m.chat, [
        // بطاقة المالك (تنغن)
        [`${nomor_owner}`, `👑 ${global_dev}`, `${global_packname}`, `👨🏻‍💻 المطور`, global_correo, `المغرب`, `${global_yt}`, bio_owner],
        
        // بطاقة البوت نفسه
        [`${conn.user.jid.split('@')[0]}`, `بوت تنغن 🤖`, `${global_packname}`, `🛡️ لا للإزعاج/السبام`, global_correo, `الأنترنت`, global_md, bio_bot],
        
        // بطاقة المساعد (رقمك الثاني كـ Helper)
        [`${nomor_bot_helper}`, `🛠️ مساعد تنغن`, `بوت المساعدة`, 'الدعم الفني', global_correo, `المغرب`, global_md, 'للتواصل في حالة الطوارئ.'],
        
    ], m);

    // throw false لتجنب إظهار رسالة "غير معرف" في بعض البوتات
    throw false;
};

handler.help = ["المطور","مالك"]
handler.tags = ["معلومات"]
handler.command = ['owner','مطور','مالك']
export default handler

// *** الدالة المساعدة لإنشاء وإرسال البطاقات (نحافظ عليها كما هي) ***
async function sendContactArray(conn, jid, data, quoted, options) {
    if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
    let contacts = [];

    for (let [number, name, org, label, email, region, url, note] of data) {
        number = number.replace(/[^0-9]/g, '');
        
        let vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name.replace(/\n/g, '\\n')};;;;
FN:${name.replace(/\n/g, '\\n')}
ORG:${org}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
EMAIL;type=INTERNET:${email}
ADR:;;${region};;;;
URL:${url}
NOTE:${note}
END:VCARD`.trim();
        
        contacts.push({ vcard, displayName: name });
    }

    return await conn.sendMessage(
        jid,
        {
            contacts: {
                displayName: (contacts.length > 1 ? `${contacts.length} جهة اتصال` : contacts[0].displayName) || null,
                contacts,
            }
        },
        {
            quoted,
            ...options
        }
    );
}