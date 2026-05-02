import axios from 'axios'

let handler = async (m, { conn, text }) => {
// رسالة بدء البحث
let bot = '🧑🏻‍💻 جاري البحث عن معلومات IP....'
conn.reply(m.chat, bot, m, rcanal, )

// 1. التحقق من وجود عنوان IP مُدخل
if (!text) {
    return conn.reply(m.chat, '🚩 *الرجاء إدخال عنوان IP للبحث عنه.*', m, rcanal, );
}

// 2. إرسال الطلب إلى API
// ملاحظة: الحقول المطلوبة محددة في الرابط (fields=...)
axios.get(`http://ip-api.com/json/${text}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,hosting,query`)
.then((res) => {
    const data = res.data

    // 3. التحقق من نجاح الطلب
    if (String(data.status) !== "success") {
        throw new Error(data.message || "فشلت عملية البحث عن IP");
    }
    
    // 4. بناء رسالة النتائج المعرَّبة
    let ipsearch = `
☁️ *مـعـلـومـات عـنـوان IP* ☁️

**عنوان IP:** ${data.query}
**البلد:** ${data.country}
**رمز البلد:** ${data.countryCode}
**المنطقة/المحافظة:** ${data.regionName}
**رمز المنطقة:** ${data.region}
**المدينة:** ${data.city}
**الحي/المقاطعة:** ${data.district || 'غير متوفر'}
**الرمز البريدي:** ${res.data.zip}
**خط الطول:** ${data.lon}
**خط العرض:** ${data.lat}
**المنطقة الزمنية:** ${data.timezone}
**مزود الخدمة (ISP):** ${data.isp}
**المنظمة:** ${data.org}
**AS (نظام ذاتي):** ${data.as}
**جوال (Mobile):** ${data.mobile ? "نعم" : "لا"}
**استضافة (Hosting):** ${data.hosting ? "نعم" : "لا"}
`.trim()

    // 5. إرسال النتائج
    conn.reply(m.chat, ipsearch, m, rcanal, );
})
// 6. معالجة الأخطاء
.catch(error => {
    // يمكن هنا إرسال رسالة خطأ أكثر وضوحاً
    console.error(error);
    conn.reply(m.chat, `❌ *حدث خطأ!* لم يتم العثور على معلومات لعنوان IP المدخل، أو أن الطلب فشل.`, m, rcanal);
});
}

// معلومات تعريف الأمر
handler.help = ['ip <عنوان ip>'] // المساعدة
handler.tags = ['owner', 'أدوات'] // الوسوم
handler.command = ['ip', 'معلومات_ip'] // الأوامر التي يتم بها تفعيل الدالة
handler.rowner = true // يتطلب أن يكون المستخدم مالكاً رئيسياً للبوت
export default handler